"use client"

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, Loader2, Send, MessageSquareDashed } from "lucide-react"
import {
  ANON_NAME,
  MESSAGE_MAX,
  NAME_MAX,
  PAGE_SIZE,
  validateEntry,
  type PublicEntry,
} from "@/lib/guestbook"

const dateFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })
const formatDate = (iso: string) => {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? "" : dateFmt.format(d)
}

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors duration-200 hover:border-white/20 focus:border-white/35 focus:bg-white/[0.06] disabled:opacity-60 [&:-webkit-autofill]:[-webkit-text-fill-color:#fafafa] [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#161616] [&:-webkit-autofill]:[caret-color:#fafafa] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"

type Notice = { type: "success" | "error"; text: string } | null

export function Guestbook() {
  const [entries, setEntries] = useState<PublicEntry[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("") // honeypot — real visitors never see or fill this
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const mountedAt = useRef(0)
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async (offset: number) => {
    const res = await fetch(`/api/guestbook?limit=${PAGE_SIZE}&offset=${offset}`, { cache: "no-store" })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.error || "Couldn't load messages right now.")
    return data as { entries: PublicEntry[]; total: number; hasMore: boolean }
  }, [])

  const loadFirst = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await load(0)
      setEntries(data.entries)
      setTotal(data.total)
      setHasMore(data.hasMore)
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Couldn't load messages right now.")
    } finally {
      setLoading(false)
    }
  }, [load])

  useEffect(() => {
    mountedAt.current = Date.now()
    loadFirst()
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current)
    }
  }, [loadFirst])

  const loadMore = async () => {
    setLoadingMore(true)
    setLoadError(null)
    try {
      const data = await load(entries.length)
      setEntries((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        return [...prev, ...data.entries.filter((e) => !seen.has(e.id))]
      })
      setTotal(data.total)
      setHasMore(data.hasMore)
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Couldn't load more messages.")
    } finally {
      setLoadingMore(false)
    }
  }

  const showNotice = (n: Notice) => {
    setNotice(n)
    if (noticeTimer.current) clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(null), 7000)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const check = validateEntry(name, message)
    if (!check.ok) return showNotice({ type: "error", text: check.error })

    setSubmitting(true)
    setNotice(null)
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, website, elapsed: Date.now() - mountedAt.current }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.")
      setName("")
      setMessage("")
      showNotice({ type: "success", text: "Thanks for signing! Your message will show up once it's approved." })
    } catch (err) {
      showNotice({
        type: "error",
        text: err instanceof TypeError ? "Network error — check your connection and try again." : (err as Error).message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const remaining = MESSAGE_MAX - message.length
  const counterClass =
    remaining < 0 ? "text-red-400" : remaining <= 50 ? "text-amber-300/80" : "text-muted-foreground/60"

  return (
    <section id="guestbook" className="relative py-24">
      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">guestbook.</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            leave a little mark on my corner of the internet.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-start">
          {/* ── Form ── */}
          <motion.form
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="gb-name" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Name
                </label>
                <input
                  id="gb-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={NAME_MAX}
                  placeholder={`${ANON_NAME} (optional)`}
                  autoComplete="nickname"
                  disabled={submitting}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="gb-message" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Message
                </label>
                <textarea
                  id="gb-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="say hi, drop a thought…"
                  disabled={submitting}
                  className={`${fieldClass} resize-none`}
                  aria-describedby="gb-count"
                />
                <div id="gb-count" className={`mt-1.5 text-right text-xs tabular-nums transition-colors ${counterClass}`}>
                  {message.length}/{MESSAGE_MAX}
                </div>
              </div>

              {/* Honeypot */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="gb-website">Website</label>
                <input
                  id="gb-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={submitting ? undefined : { scale: 1.02 }}
                whileTap={submitting ? undefined : { scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? "Signing…" : "Sign Guestbook"}
              </motion.button>

              <div aria-live="polite" role="status" className="min-h-0">
                <AnimatePresence initial={false}>
                  {notice && (
                    <motion.div
                      key={notice.text}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm ${
                        notice.type === "success"
                          ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200"
                          : "border-red-400/20 bg-red-400/[0.07] text-red-200"
                      }`}
                    >
                      {notice.type === "success" ? (
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      )}
                      <span>{notice.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.form>

          {/* ── Messages ── */}
          <div className="min-w-0">
            {loading ? (
              <div className="space-y-3" aria-busy="true" aria-label="Loading messages">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="mb-3 h-3 w-28 rounded bg-white/10" />
                    <div className="mb-2 h-3 w-full rounded bg-white/[0.07]" />
                    <div className="h-3 w-2/3 rounded bg-white/[0.07]" />
                  </div>
                ))}
              </div>
            ) : loadError && entries.length === 0 ? (
              <div
                className="flex flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <AlertCircle size={22} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{loadError}</p>
                <button
                  type="button"
                  onClick={loadFirst}
                  className="rounded-full border border-white/15 px-5 py-2 text-sm text-foreground/80 transition-colors hover:border-white/30 hover:text-foreground"
                >
                  Try again
                </button>
              </div>
            ) : entries.length === 0 ? (
              <div
                className="flex flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}
              >
                <MessageSquareDashed size={24} className="text-muted-foreground" />
                <p className="font-medium text-foreground">No messages yet</p>
                <p className="text-sm text-muted-foreground">Be the first to leave a mark.</p>
              </div>
            ) : (
              <>
                <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                  {total} {total === 1 ? "message" : "messages"}
                </p>
                <ul className="space-y-3">
                  {entries.map((entry) => (
                    <motion.li
                      key={entry.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      whileHover={{ y: -2 }}
                      className="rounded-2xl p-5 transition-colors duration-200 hover:border-white/20"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-semibold uppercase text-foreground/80">
                          {[...entry.name][0] || "?"}
                        </div>
                        <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                          <span className="truncate text-sm font-semibold text-foreground">{entry.name}</span>
                          <time dateTime={entry.createdAt} className="shrink-0 text-xs text-muted-foreground">
                            {formatDate(entry.createdAt)}
                          </time>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                        {entry.message}
                      </p>
                    </motion.li>
                  ))}
                </ul>

                {loadError && <p className="mt-3 text-center text-sm text-red-300/80">{loadError}</p>}

                {hasMore && (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-foreground/80 transition-all hover:border-white/30 hover:bg-white/[0.04] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingMore && <Loader2 size={14} className="animate-spin" />}
                      {loadingMore ? "Loading…" : "Load more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
