# Guestbook setup (one time)

1. **Create a Supabase project** at supabase.com (free tier is fine).
2. **Create the table + security policies:** Dashboard → SQL Editor → New query → paste all of `supabase/guestbook.sql` → Run.
3. **Copy keys:** Dashboard → Project Settings → API (or "API Keys").
   - Project URL
   - `anon` / publishable key (safe to be public; can only read approved rows)
   - `service_role` / secret key (**private** — server only)
4. **Add env vars in Vercel:** Project → Settings → Environment Variables (Production + Preview), then redeploy:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GUESTBOOK_IP_SALT` (optional, any random string)
   Do NOT prefix them with `NEXT_PUBLIC_`. For local dev put the same in `.env.local`.
5. **Moderate:** new messages arrive with `approved = false`. Dashboard → Table Editor → `guestbook_entries` → tick `approved` on rows you want shown (delete rows to reject).
