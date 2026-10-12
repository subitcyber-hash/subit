import { basicAuth } from "@/lib/spotify"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const page = (body: string, status = 200) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font:16px system-ui;background:#000;color:#eee;max-width:640px;margin:40px auto;padding:0 20px">${body}`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  )

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

// ONE-TIME SETUP ONLY (needs SPOTIFY_SETUP=1). Shows your refresh token once so you can paste it into Vercel.
export async function GET(req: Request) {
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  const redirect = process.env.SPOTIFY_REDIRECT_URI
  if (process.env.SPOTIFY_SETUP !== "1" || !id || !secret || !redirect) return new Response("Not found", { status: 404 })

  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const cookieState = /(?:^|;\s*)spotify_state=([a-f0-9]+)/.exec(req.headers.get("cookie") || "")?.[1]

  if (url.searchParams.get("error")) return page(`<p>Spotify says: ${esc(url.searchParams.get("error")!)}</p>`, 400)
  if (!code || !state || !cookieState || state !== cookieState) return page("<p>Invalid or expired login. Start again at /api/spotify/login.</p>", 400)

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: basicAuth(id, secret), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirect }),
    cache: "no-store",
  })
  const data = (await res.json().catch(() => ({}))) as { refresh_token?: string }
  if (!res.ok || !data.refresh_token) return page("<p>Token exchange failed. Check your client ID/secret and redirect URI.</p>", 502)

  return page(
    `<h2>Connected ✓</h2><p>Copy this into Vercel as <b>SPOTIFY_REFRESH_TOKEN</b>, then remove <b>SPOTIFY_SETUP</b> and redeploy:</p><pre style="white-space:pre-wrap;word-break:break-all;background:#111;padding:14px;border-radius:12px">${esc(data.refresh_token)}</pre>`,
  )
}
