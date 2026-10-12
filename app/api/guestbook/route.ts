import { createHash } from "node:crypto"
import { PAGE_SIZE, validateEntry, type PublicEntry } from "@/lib/guestbook"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/*
 * Server-only env (never prefixed NEXT_PUBLIC_, never sent to the browser):
 *   SUPABASE_URL                project URL
 *   SUPABASE_ANON_KEY           public/publishable key — used for READS (RLS: approved rows only)
 *   SUPABASE_SERVICE_ROLE_KEY   secret key — used ONLY to insert pending rows + rate-limit lookups
 *   GUESTBOOK_IP_SALT           optional extra salt for IP hashing
 */
const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")
const ANON_KEY = process.env.SUPABASE_ANON_KEY || ""
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const TABLE = "guestbook_entries"

const MAX_BODY_BYTES = 4096
const MIN_FILL_MS = 2500 // humans can't fill the form faster than this
const COOLDOWN_SEC = 30
const LIMIT_HOUR = 3
const LIMIT_DAY = 8
const GLOBAL_LIMIT_HOUR = 60

const NO_STORE = { "Cache-Control": "no-store" }
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: NO_STORE })

function sbHeaders(key: string, extra: Record<string, string> = {}) {
  const h: Record<string, string> = { apikey: key, ...extra }
  // Legacy JWT-style keys also go in Authorization; new sb_publishable_/sb_secret_ keys must not.
  if (key.startsWith("eyJ")) h.Authorization = `Bearer ${key}`
  return h
}

function totalFromRange(res: Response): number {
  const m = /\/(\d+)$/.exec(res.headers.get("content-range") || "")
  return m ? parseInt(m[1], 10) : 0
}

async function countSince(filter: string, seconds: number): Promise<number> {
  const since = new Date(Date.now() - seconds * 1000).toISOString()
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?select=id&${filter}&created_at=gte.${encodeURIComponent(since)}&limit=1`,
    { headers: sbHeaders(SERVICE_KEY, { Prefer: "count=exact" }), cache: "no-store" },
  )
  if (!res.ok) throw new Error(`count failed: ${res.status}`)
  return totalFromRange(res)
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  return (xff ? xff.split(",")[0] : req.headers.get("x-real-ip") || "unknown").trim()
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin")
  if (!origin) return true // non-browser clients: still subject to every other check
  try {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host")
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function GET(req: Request) {
  if (!SUPABASE_URL || !ANON_KEY) return json({ error: "Guestbook isn't configured yet." }, 503)

  const url = new URL(req.url)
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "", 10) || PAGE_SIZE, 1), 20)
  const offset = Math.min(Math.max(parseInt(url.searchParams.get("offset") || "", 10) || 0, 0), 10_000)

  try {
    // Anon key + RLS: the database itself guarantees only approved rows (and only public columns) come back.
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?select=id,name,message,created_at&order=created_at.desc,id.desc&limit=${limit}&offset=${offset}`,
      { headers: sbHeaders(ANON_KEY, { Prefer: "count=exact" }), cache: "no-store" },
    )
    if (!res.ok) throw new Error(`read failed: ${res.status}`)
    const rows = (await res.json()) as { id: string; name: string; message: string; created_at: string }[]
    const total = totalFromRange(res)
    const entries: PublicEntry[] = rows.map((r) => ({ id: r.id, name: r.name, message: r.message, createdAt: r.created_at }))
    return json({ entries, total, hasMore: offset + entries.length < total })
  } catch (err) {
    console.error("[guestbook] GET", err)
    return json({ error: "Couldn't load messages right now." }, 502)
  }
}

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: "Guestbook isn't configured yet." }, 503)
  if (!sameOrigin(req)) return json({ error: "Request blocked." }, 403)
  if (!(req.headers.get("content-type") || "").includes("application/json")) return json({ error: "Invalid request." }, 415)

  let body: Record<string, unknown>
  try {
    const text = await req.text()
    if (text.length > MAX_BODY_BYTES) return json({ error: "Message is too large." }, 413)
    const parsed = JSON.parse(text)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("bad body")
    body = parsed
  } catch {
    return json({ error: "Invalid request." }, 400)
  }

  const result = validateEntry(body.name, body.message)
  if (!result.ok) return json({ error: result.error }, 400)

  // Bot traps: filled honeypot or impossibly fast submit → pretend success, store nothing.
  const filledMs = typeof body.elapsed === "number" ? body.elapsed : 0
  if ((typeof body.website === "string" && body.website !== "") || filledMs < MIN_FILL_MS) {
    return json({ ok: true, pending: true })
  }

  const salt = process.env.GUESTBOOK_IP_SALT || SERVICE_KEY
  const ipHash = createHash("sha256").update(`${salt}:${clientIp(req)}`).digest("hex")

  try {
    const [recent, hour, day, global] = await Promise.all([
      countSince(`ip_hash=eq.${ipHash}`, COOLDOWN_SEC),
      countSince(`ip_hash=eq.${ipHash}`, 3600),
      countSince(`ip_hash=eq.${ipHash}`, 86400),
      countSince("id=not.is.null", 3600),
    ])
    if (recent >= 1) return json({ error: "Easy there — wait a moment before signing again." }, 429)
    if (hour >= LIMIT_HOUR || day >= LIMIT_DAY) return json({ error: "You've signed a lot recently. Try again later." }, 429)
    if (global >= GLOBAL_LIMIT_HOUR) return json({ error: "The guestbook is busy right now. Try again later." }, 429)

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: sbHeaders(SERVICE_KEY, { "Content-Type": "application/json", Prefer: "return=minimal" }),
      // `approved` is always false here — visitors can never self-approve.
      body: JSON.stringify({ name: result.value.name, message: result.value.message, approved: false, ip_hash: ipHash }),
      cache: "no-store",
    })
    if (!res.ok) throw new Error(`insert failed: ${res.status} ${await res.text()}`)
    return json({ ok: true, pending: true }, 201)
  } catch (err) {
    console.error("[guestbook] POST", err)
    return json({ error: "Couldn't save your message. Please try again." }, 502)
  }
}
