# Terminal AI chat

Free-text messages in the terminal are answered by Claude through `/api/chat`.
Without a key the terminal keeps using its built-in keyword replies, so nothing breaks.

## Turn it on
1. Create a key at https://console.anthropic.com (API keys).
2. **Set a monthly spend limit** in the console (Settings → Limits). This is your real cost cap.
3. Vercel → Project → Settings → Environment Variables:
   - `ANTHROPIC_API_KEY` = your key (Production)
   - optional `CHAT_MODEL` (default `claude-haiku-5-5`) and `CHAT_DAILY_LIMIT` (default 400 messages/day for the whole site)
4. Redeploy.

## Protection built in
- Key stays on the server; never sent to the browser.
- Max 300 characters per message, 6 messages of context, ~220 output tokens.
- Limits: 6 messages/minute and 40/day per visitor, plus a site-wide daily cap. (In-memory per server instance, so a speed bump — the console spend limit is the hard stop.)
- If the limit is hit or the API fails, the terminal falls back to the built-in replies.
