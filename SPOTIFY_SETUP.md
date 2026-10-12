# "Currently Listening" widget — setup

The widget shows nothing (it hides itself) until all three env vars exist. Credentials stay on the server.

## 1. Create a Spotify app
1. Go to https://developer.spotify.com/dashboard → **Create app** (log in with your Spotify account).
2. Redirect URI: `https://subit.site/api/spotify/callback` (for local testing also add `http://127.0.0.1:3000/api/spotify/callback`).
3. Tick **Web API**. Save. Open **Settings** and copy the **Client ID** and **Client secret**.
4. Spotify apps start in Development mode: **User Management → add the email of your Spotify account** (the one you listen with).

## 2. Add env vars in Vercel (Settings → Environment Variables)
| Name | Value |
|---|---|
| `SPOTIFY_CLIENT_ID` | from the dashboard |
| `SPOTIFY_CLIENT_SECRET` | from the dashboard |
| `SPOTIFY_REDIRECT_URI` | `https://subit.site/api/spotify/callback` (must match step 1 exactly) |
| `SPOTIFY_SETUP` | `1` (temporary) |

Redeploy.

## 3. Connect your account (once)
Open `https://subit.site/api/spotify/login`, approve access. The callback page shows a **refresh token**.

## 4. Finish
Add `SPOTIFY_REFRESH_TOKEN` = that token in Vercel, **delete `SPOTIFY_SETUP`**, redeploy. The setup routes return 404 again.

Notes: only your public listening is shown (Private Session hides it). Never commit or share the secret or refresh token; if leaked, rotate the secret in the dashboard and repeat step 3.
