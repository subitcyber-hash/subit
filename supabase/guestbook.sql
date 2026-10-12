-- Guestbook schema for Supabase. Run once in: Supabase Dashboard -> SQL Editor.
-- Safe to re-run.

create table if not exists public.guestbook_entries (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null default 'Anonymous',
  message     text        not null,
  approved    boolean     not null default false,   -- new entries stay hidden until you approve them
  ip_hash     text,                                  -- salted hash, used only for rate limiting
  created_at  timestamptz not null default now(),
  constraint guestbook_name_len    check (char_length(name) between 1 and 40),
  constraint guestbook_message_len check (char_length(message) between 2 and 500)
);

create index if not exists guestbook_approved_created_idx
  on public.guestbook_entries (created_at desc) where approved;
create index if not exists guestbook_iphash_created_idx
  on public.guestbook_entries (ip_hash, created_at desc);

alter table public.guestbook_entries enable row level security;
alter table public.guestbook_entries force row level security;

-- Visitors (anon key) may ONLY read approved rows, and only the public columns.
-- There is deliberately NO insert/update/delete policy for anon or authenticated:
-- submissions go through the server route, which uses the service-role key.
drop policy if exists "public can read approved" on public.guestbook_entries;
create policy "public can read approved"
  on public.guestbook_entries
  for select
  to anon, authenticated
  using (approved = true);

revoke all on public.guestbook_entries from anon, authenticated;
grant select (id, name, message, created_at) on public.guestbook_entries to anon, authenticated;
