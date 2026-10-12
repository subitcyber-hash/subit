// Server-only Spotify helpers. Secrets come from environment variables and never reach the browser.

export const SPOTIFY_SCOPES = "user-read-currently-playing user-read-recently-played"

export type NowPlaying =
  | { status: "playing" | "last"; track: Track; playedAt?: string }
  | { status: "empty" | "unconfigured" | "error" }

export type Track = { title: string; artist: string; album: string; image: string | null; url: string | null }

type Img = { url: string; width?: number }
type SpotifyItem = {
  type?: string
  name?: string
  artists?: { name?: string }[]
  album?: { name?: string; images?: Img[] }
  show?: { name?: string; publisher?: string; images?: Img[] }
  images?: Img[]
  external_urls?: { spotify?: string }
}

const cfg = () => ({
  id: process.env.SPOTIFY_CLIENT_ID || "",
  secret: process.env.SPOTIFY_CLIENT_SECRET || "",
  refresh: process.env.SPOTIFY_REFRESH_TOKEN || "",
})

export const isConfigured = () => {
  const c = cfg()
  return Boolean(c.id && c.secret && c.refresh)
}

export function basicAuth(id: string, secret: string) {
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64")
}

// Access tokens last ~1h; keep one per server instance and refresh a minute early.
let cachedToken: { value: string; expires: number } | null = null

export async function getAccessToken(force = false): Promise<string> {
  if (!force && cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value
  const c = cfg()
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: basicAuth(c.id, c.secret), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: c.refresh }),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`token refresh failed: ${res.status}`)
  const data = (await res.json()) as { access_token?: string; expires_in?: number }
  if (!data.access_token) throw new Error("token refresh returned no token")
  cachedToken = { value: data.access_token, expires: Date.now() + (data.expires_in ?? 3600) * 1000 }
  return cachedToken.value
}

export function resetTokenCache() {
  cachedToken = null
}

export function toTrack(item: SpotifyItem | null | undefined): Track | null {
  if (!item || typeof item !== "object") return null
  const title = item.name?.trim()
  if (!title) return null
  const isEpisode = item.type === "episode"
  const artist = isEpisode
    ? item.show?.publisher || item.show?.name || ""
    : (item.artists || []).map((a) => a.name).filter(Boolean).join(", ")
  const images = (isEpisode ? item.images || item.show?.images : item.album?.images) || []
  // Prefer a mid-size cover (~300px) — sharp on retina at 80px without downloading 640px.
  const image = (images.find((i) => (i.width ?? 0) <= 320 && (i.width ?? 0) >= 150) || images[0])?.url || null
  const url = item.external_urls?.spotify || null
  return {
    title,
    artist: artist || "Unknown artist",
    album: (isEpisode ? item.show?.name : item.album?.name) || "",
    image: image && image.startsWith("https://") ? image : null,
    url: url && url.startsWith("https://open.spotify.com/") ? url : null,
  }
}

class RateLimited extends Error {
  retryAfter: number
  constructor(s: number) {
    super("rate limited")
    this.retryAfter = s
  }
}
export { RateLimited }

async function spotifyGet(path: string, token: string): Promise<Response> {
  return fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
}

async function callApi(path: string): Promise<Response> {
  let res = await spotifyGet(path, await getAccessToken())
  if (res.status === 401) res = await spotifyGet(path, await getAccessToken(true)) // token revoked/expired early
  if (res.status === 429) throw new RateLimited(parseInt(res.headers.get("retry-after") || "30", 10) || 30)
  return res
}

export async function fetchNowPlaying(): Promise<NowPlaying> {
  const cur = await callApi("/me/player/currently-playing?additional_types=track,episode")
  if (cur.status === 200) {
    const data = (await cur.json().catch(() => null)) as { is_playing?: boolean; item?: SpotifyItem } | null
    const track = toTrack(data?.item)
    if (track && data?.is_playing) return { status: "playing", track }
    if (track) return { status: "last", track } // paused: show it as the last played song
  } else if (cur.status !== 204) {
    throw new Error(`currently-playing failed: ${cur.status}`)
  }

  const rec = await callApi("/me/player/recently-played?limit=1")
  if (!rec.ok) throw new Error(`recently-played failed: ${rec.status}`)
  const data = (await rec.json().catch(() => null)) as { items?: { track?: SpotifyItem; played_at?: string }[] } | null
  const first = data?.items?.[0]
  const track = toTrack(first?.track)
  return track ? { status: "last", track, playedAt: first?.played_at } : { status: "empty" }
}
