import { errorReason, fetchNowPlaying, isConfigured, RateLimited, type NowPlaying } from "@/lib/spotify"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Visitors share one cached answer so Spotify is hit at most once per TTL, however many people load the page.
const TTL_MS = 10_000
let cache: { at: number; data: NowPlaying } | null = null
let blockedUntil = 0 // set when Spotify rate-limits us

const headers = { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20" }
const out = (data: NowPlaying) => Response.json(data, { headers })

export async function GET() {
  if (!isConfigured()) return Response.json({ status: "unconfigured" } satisfies NowPlaying, { headers: { "Cache-Control": "no-store" } })

  const now = Date.now()
  if (cache && now - cache.at < TTL_MS) return out(cache.data)
  if (now < blockedUntil) return out(cache?.data ?? { status: "error" })

  try {
    const data = await fetchNowPlaying()
    cache = { at: now, data }
    return out(data)
  } catch (err) {
    if (err instanceof RateLimited) blockedUntil = now + err.retryAfter * 1000
    console.error("[spotify] now-playing", err instanceof Error ? err.message : err)
    // Serve the last good answer rather than flashing an error for a transient failure.
    return Response.json(cache?.data ?? ({ status: "error", reason: errorReason(err) } satisfies NowPlaying), { headers: { "Cache-Control": "no-store" } })
  }
}
