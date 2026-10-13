// Server-only Last.fm helper. The API key lives in env vars and never reaches the browser.
// Last.fm exposes your Spotify listening once Spotify scrobbling is connected to your Last.fm account.

export type Track = { title: string; artist: string; album: string; image: string | null; url: string | null }
export type NowPlaying =
  | { status: "playing"; track: Track }
  | { status: "last"; track: Track; playedAt?: string }
  | { status: "empty" | "unconfigured" }
  | { status: "error"; reason?: string }

type LfmImage = { "#text"?: string; size?: string }
type LfmTrack = {
  name?: string
  url?: string
  artist?: { "#text"?: string; name?: string }
  album?: { "#text"?: string }
  image?: LfmImage[]
  date?: { uts?: string }
  "@attr"?: { nowplaying?: string }
}

export class LastfmError extends Error {
  reason: string
  constructor(reason: string) {
    super(reason)
    this.reason = reason
  }
}

const PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f" // Last.fm's grey "no cover" star image

export const config = () => ({
  key: process.env.LASTFM_API_KEY || "",
  user: process.env.LASTFM_USERNAME || "",
})
export const isConfigured = () => {
  const c = config()
  return Boolean(c.key && c.user)
}

export function toTrack(t: LfmTrack | undefined | null): Track | null {
  if (!t || typeof t !== "object") return null
  const title = t.name?.trim()
  if (!title) return null
  const artist = (t.artist?.["#text"] || t.artist?.name || "").trim()
  const imgs = Array.isArray(t.image) ? t.image : []
  const pick = ["extralarge", "large", "medium"].map((s) => imgs.find((i) => i.size === s)?.["#text"]).find((u) => u && u.startsWith("https://") && !u.includes(PLACEHOLDER))
  const url = t.url && t.url.startsWith("https://www.last.fm/") ? t.url : null
  return { title, artist: artist || "Unknown artist", album: (t.album?.["#text"] || "").trim(), image: pick || null, url }
}

export async function fetchNowPlaying(): Promise<NowPlaying> {
  const { key, user } = config()
  const qs = new URLSearchParams({ method: "user.getrecenttracks", user, api_key: key, format: "json", limit: "2" })
  let res: Response
  try {
    res = await fetch(`https://ws.audioscrobbler.com/2.0/?${qs}`, { cache: "no-store", signal: AbortSignal.timeout(8000) })
  } catch {
    throw new LastfmError("network") // never include the URL (it contains the key)
  }
  const data = (await res.json().catch(() => null)) as {
    error?: number
    recenttracks?: { track?: LfmTrack | LfmTrack[] }
  } | null
  if (data?.error) throw new LastfmError(`lastfm_${data.error}`) // 6 = user not found, 10 = bad key, 29 = rate limit…
  if (!res.ok || !data) throw new LastfmError(`http_${res.status}`)

  const raw = data.recenttracks?.track
  const list = Array.isArray(raw) ? raw : raw ? [raw] : []
  const first = list[0]
  const track = toTrack(first)
  if (!track) return { status: "empty" }
  if (first?.["@attr"]?.nowplaying === "true") return { status: "playing", track }
  return { status: "last", track, playedAt: first?.date?.uts ? new Date(Number(first.date.uts) * 1000).toISOString() : undefined }
}
