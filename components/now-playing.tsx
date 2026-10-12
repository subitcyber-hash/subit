"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Music2 } from "lucide-react"

type Track = { title: string; artist: string; album: string; image: string | null; url: string | null }
type Data =
  | { status: "playing" | "last"; track: Track; playedAt?: string }
  | { status: "empty" | "unconfigured" | "error" }

const POLL_MS = 15_000

function SpotifyMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.88 8.16 5.22 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.2-1.26 11.16-1.02 15.54 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.44.3z" />
    </svg>
  )
}

function Equalizer() {
  return (
    <span className="np-eq" aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  )
}

function ago(iso?: string) {
  if (!iso) return ""
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (!isFinite(s)) return ""
  if (s < 90) return "just now"
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  return `${Math.round(s / 86400)}d ago`
}

export function NowPlaying() {
  const [data, setData] = useState<Data | null>(null)
  const [imgFailed, setImgFailed] = useState(false)
  const [visible, setVisible] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const inFlight = useRef(false)

  const refresh = useCallback(async () => {
    if (inFlight.current) return
    inFlight.current = true
    try {
      const res = await fetch("/api/spotify/now-playing", { cache: "no-store" })
      if (!res.ok) throw new Error("bad status")
      setData((await res.json()) as Data)
    } catch {
      // Keep showing the last good track on a transient failure; only show an error if we have nothing.
      setData((prev) => (prev && prev.status !== "error" ? prev : { status: "error" }))
    } finally {
      inFlight.current = false
    }
  }, [])

  // Resolve once on mount so a not-yet-configured site hides the block immediately instead of flashing a skeleton.
  useEffect(() => {
    refresh()
  }, [refresh])

  // Only poll while the widget is on screen and the tab is visible (saves battery/data on phones).
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    refresh()
    const tick = () => document.visibilityState === "visible" && refresh()
    const id = setInterval(tick, POLL_MS)
    document.addEventListener("visibilitychange", tick)
    return () => {
      clearInterval(id)
      document.removeEventListener("visibilitychange", tick)
    }
  }, [visible, refresh])

  const track = data && (data.status === "playing" || data.status === "last") ? data.track : null
  useEffect(() => setImgFailed(false), [track?.image])

  // Not connected yet → render nothing so the live site never shows a broken-looking block.
  if (data?.status === "unconfigured") return <section ref={rootRef} aria-hidden="true" />

  const playing = data?.status === "playing"
  const label = playing ? "Currently Listening" : "Last Played"
  const href = track?.url || undefined
  const Wrapper = (href ? "a" : "div") as "a"
  const linkProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <section ref={rootRef} className="relative px-6 py-10" aria-label="Currently listening on Spotify">
      <style>{`
        .np-eq{display:inline-flex;align-items:flex-end;gap:2px;height:12px}
        .np-eq i{display:block;width:2px;height:100%;border-radius:1px;background:#1ed760;transform-origin:bottom;animation:np-bar 1s ease-in-out infinite}
        .np-eq i:nth-child(2){animation-delay:-.4s;animation-duration:.8s}
        .np-eq i:nth-child(3){animation-delay:-.2s;animation-duration:1.2s}
        .np-eq i:nth-child(4){animation-delay:-.6s;animation-duration:.9s}
        @keyframes np-bar{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
        @media (prefers-reduced-motion:reduce){.np-eq i{animation:none;transform:scaleY(.6)}}
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-xl"
      >
        {!data ? (
          <div
            className="flex animate-pulse items-center gap-4 rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            aria-busy="true"
          >
            <div className="h-16 w-16 shrink-0 rounded-xl bg-white/10 sm:h-20 sm:w-20" />
            <div className="flex-1 space-y-2.5">
              <div className="h-2.5 w-24 rounded bg-white/10" />
              <div className="h-3.5 w-40 rounded bg-white/[0.08]" />
              <div className="h-3 w-28 rounded bg-white/[0.06]" />
            </div>
          </div>
        ) : (
          <Wrapper
            {...linkProps}
            className="group flex items-center gap-4 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] sm:h-20 sm:w-20">
              {track?.image && !imgFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.image}
                  alt={track.album ? `${track.album} cover` : "Album cover"}
                  width={80}
                  height={80}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Music2 size={22} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {playing && <Equalizer />}
                <span>{label}</span>
                {!playing && data.status === "last" && data.playedAt && (
                  <span className="normal-case tracking-normal text-muted-foreground/60">· {ago(data.playedAt)}</span>
                )}
              </div>

              {track ? (
                <>
                  <p className="truncate text-base font-semibold text-foreground">{track.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
                </>
              ) : (
                <>
                  <p className="text-base font-semibold text-foreground">
                    {data.status === "error" ? "Spotify is unavailable" : "Nothing played yet"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.status === "error" ? "Couldn't reach Spotify right now." : "Check back once I press play."}
                  </p>
                </>
              )}
            </div>

            {href && (
              <span
                className="flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-sm text-foreground/80 transition-colors group-hover:border-white/30 group-hover:text-foreground"
                aria-label="Open in Spotify"
              >
                <SpotifyMark />
                <span className="hidden sm:inline">Open</span>
              </span>
            )}
          </Wrapper>
        )}
      </motion.div>
    </section>
  )
}
