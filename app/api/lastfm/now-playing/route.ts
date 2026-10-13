import { fetchNowPlaying, isConfigured, LastfmError, type NowPlaying } from "@/lib/lastfm"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// All visitors share one cached answer, so Last.fm is called at most once per TTL.
const TTL_MS = 10_000
let cache: { at: number; data: NowPlaying } | null = null

const OK = { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20" }
const NO_STORE = { "Cache-Control": "no-store" }

export async function GET() {
  if (!isConfigured()) return Response.json({ status: "unconfigured" } satisfies NowPlaying, { headers: NO_STORE })

  const now = Date.now()
  if (cache && now - cache.at < TTL_MS) return Response.json(cache.data, { headers: OK })

  try {
    const data = await fetchNowPlaying()
    cache = { at: now, data }
    return Response.json(data, { headers: OK })
  } catch (err) {
    const reason = err instanceof LastfmError ? err.reason : "unknown"
    console.error("[lastfm] now-playing", reason) // reason codes only — no URLs, no key
    // Prefer the last good answer over flashing an error for a transient failure.
    return Response.json(cache?.data ?? ({ status: "error", reason } satisfies NowPlaying), { headers: NO_STORE })
  }
}
