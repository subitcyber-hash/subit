import { randomBytes } from "node:crypto"
import { SPOTIFY_SCOPES } from "@/lib/spotify"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// ONE-TIME SETUP ONLY. Disabled (404) unless SPOTIFY_SETUP=1 is set. Remove that variable afterwards.
export async function GET() {
  const id = process.env.SPOTIFY_CLIENT_ID
  const redirect = process.env.SPOTIFY_REDIRECT_URI
  if (process.env.SPOTIFY_SETUP !== "1" || !id || !redirect) return new Response("Not found", { status: 404 })

  const state = randomBytes(16).toString("hex")
  const url = new URL("https://accounts.spotify.com/authorize")
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: id,
    scope: SPOTIFY_SCOPES,
    redirect_uri: redirect,
    state,
    show_dialog: "true",
  }).toString()

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": `spotify_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api/spotify; Max-Age=600`,
      "Cache-Control": "no-store",
    },
  })
}
