# Terminal AI chat

Free-text messages in the terminal are answered by Claude through `/api/chat`.
Without a key the terminal keeps using its built-in keyword replies, so nothing breaks.

## Turn it on (free, with Groq)
1. Sign up at https://console.groq.com (free tier, no card) and create an API key.
2. Vercel → Project → Settings → Environment Variables:
   - `GROQ_API_KEY` = your key (Production)
   - optional `CHAT_MODEL` (default `llama-3.1-8b-instant`) and `CHAT_DAILY_LIMIT` (default 400 messages/day for the whole site)
3. Redeploy.

Free tiers have their own usage caps; if Groq is rate-limited the terminal falls back to its built-in replies.

## Paid alternative (Claude)
Set `ANTHROPIC_API_KEY` instead (used only when `GROQ_API_KEY` is missing) and set a monthly spend limit in the Anthropic console.

## Protection built in
- Key stays on the server; never sent to the browser.
- Max 300 characters per message, 6 messages of context, ~220 output tokens.
- Limits: 6 messages/minute and 40/day per visitor, plus a site-wide daily cap. (In-memory per server instance, so a speed bump — the console spend limit is the hard stop.)
- If the limit is hit or the API fails, the terminal falls back to the built-in replies.
