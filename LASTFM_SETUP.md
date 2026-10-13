# "Currently Listening" widget (Last.fm) — setup

The widget hides itself until both env vars below exist. The API key stays on the server.

## 1. Connect Spotify to Last.fm (so your listening shows up)
1. Create a free account at https://www.last.fm (or log in).
2. Go to https://www.last.fm/settings/applications → **Spotify scrobbling → Connect** and approve.
3. Go to https://www.last.fm/settings/privacy and make sure **"Hide recent listening information"** is **unticked**, otherwise nothing can be shown publicly.
4. Play a song on Spotify. After a few seconds it should appear on your Last.fm profile.

## 2. Get a free Last.fm API key
1. Open https://www.last.fm/api/account/create
2. Fill in any application name and description (e.g. "subit.site"). Leave "Callback URL" empty.
3. Copy the **API key** (you do not need the shared secret).

## 3. Add env vars in Vercel (Settings → Environment Variables, Production)
| Name | Value |
|---|---|
| `LASTFM_API_KEY` | your API key |
| `LASTFM_USERNAME` | your Last.fm username |

Then redeploy.

## Troubleshooting
The endpoint `/api/lastfm/now-playing` returns a safe error code in `reason`:
- `lastfm_6` → username is wrong
- `lastfm_10` → API key is wrong
- `lastfm_29` → rate limit (wait a minute)
- `network` / `http_5xx` → Last.fm is temporarily down
