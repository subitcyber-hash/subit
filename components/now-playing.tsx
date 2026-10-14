"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Track = { title: string; artist: string; album: string; image: string | null; url: string | null }
type Data =
  | { status: "playing"; track: Track }
  | { status: "last"; track: Track; playedAt?: string }
  | { status: "empty" | "unconfigured" }
  | { status: "error"; reason?: string }

const POLL_MS = 20_000

const CSS = `
.np-card{position:relative;overflow:hidden;isolation:isolate;display:flex;align-items:center;gap:16px;padding:16px;border-radius:16px;color:inherit;text-decoration:none;
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);transition:transform .2s ease,border-color .2s ease}
a.np-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--site-accent) 45%,transparent)}
a.np-card:focus-visible{outline:2px solid var(--site-accent);outline-offset:2px}
/* Blurred album-art backdrop: oversized so the blur never shows hard edges; the veil keeps text readable on any cover. */
.np-bg{position:absolute;z-index:-2;left:-40px;top:-40px;width:calc(100% + 80px);height:calc(100% + 80px);max-width:none;object-fit:cover;filter:blur(32px) saturate(1.5);opacity:.6;pointer-events:none;animation:np-fade .6s ease both}
.np-veil{position:absolute;z-index:-1;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.62),rgba(0,0,0,.42))}
@keyframes np-fade{from{opacity:0}to{opacity:.6}}
.np-card.np-has-bg .np-artist,.np-card.np-has-bg .np-label{color:rgba(255,255,255,.72)}
.np-card.np-has-bg .np-btn{border-color:rgba(255,255,255,.28)}
.np-cover{position:relative;flex:none;width:64px;height:64px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);display:grid;place-items:center;color:var(--muted-foreground)}
.np-cover img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s ease}
a.np-card:hover .np-cover img{transform:scale(1.05)}
.np-main{min-width:0;flex:1}
.np-label{display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--muted-foreground)}
.np-label .np-ago{text-transform:none;letter-spacing:0;opacity:.7}
.np-title{margin:0;font-size:16px;font-weight:600;color:var(--foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.np-artist{margin:0;font-size:14px;color:var(--muted-foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.np-btn{flex:none;display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;font-size:14px;color:color-mix(in srgb,var(--foreground) 80%,transparent);border:1px solid rgba(255,255,255,.15);transition:color .2s,border-color .2s}
a.np-card:hover .np-btn{color:var(--site-accent);border-color:color-mix(in srgb,var(--site-accent) 50%,transparent)}
.np-eq{display:inline-flex;align-items:flex-end;gap:2px;height:12px}
.np-eq i{display:block;width:2px;height:100%;border-radius:1px;background:var(--site-accent);transform-origin:bottom;animation:np-bar 1s ease-in-out infinite}
.np-eq i:nth-child(2){animation-delay:-.4s;animation-duration:.8s}
.np-eq i:nth-child(3){animation-delay:-.2s;animation-duration:1.2s}
.np-eq i:nth-child(4){animation-delay:-.6s;animation-duration:.9s}
@keyframes np-bar{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
.np-skel{animation:np-pulse 1.4s ease-in-out infinite}
.np-skel i{display:block;border-radius:6px;background:rgba(255,255,255,.1)}
@keyframes np-pulse{50%{opacity:.55}}
@media (min-width:640px){.np-cover{width:80px;height:80px}}
@media (max-width:639px){.np-btn-text{display:none}.np-btn{padding:9px}}
@media (prefers-reduced-motion:reduce){.np-bg{animation:none}.np-eq i{animation:none;transform:scaleY(.6)}.np-skel{animation:none}a.np-card,a.np-card:hover{transition:none;transform:none}}
`

function ago(iso?: string) {
  if (!iso) return ""
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (!isFinite(s) || s < 0) return ""
  if (s < 90) return "just now"
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  return `${Math.round(s / 86400)}d ago`
}

const NoteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
)
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" /><path d="M8 7h9v9" />
  </svg>
)

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
      const res = await fetch("/api/lastfm/now-playing", { cache: "no-store" })
      if (!res.ok) throw new Error("bad status")
      setData((await res.json()) as Data)
    } catch {
      // Keep showing the last good track on a transient failure.
      setData((prev) => (prev && prev.status !== "error" ? prev : { status: "error" }))
    } finally {
      inFlight.current = false
    }
  }, [])

  // Resolve once on mount so a not-yet-configured site hides the block instead of flashing a skeleton.
  useEffect(() => {
    refresh()
  }, [refresh])

  // Poll only while the widget is on screen and the tab is visible (saves battery and data on phones).
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

  // Not connected yet → render nothing, so the live site never shows a broken-looking block.
  if (data?.status === "unconfigured") return <section ref={rootRef} aria-hidden="true" />

  const playing = data?.status === "playing"
  const href = track?.url || undefined
  const Tag = (href ? "a" : "div") as "a"
  const linkProps = href ? { href, target: "_blank", rel: "noopener noreferrer", "aria-label": `${track?.title} by ${track?.artist} — open on Last.fm` } : {}

  return (
    <section ref={rootRef} id="listening" className="relative px-6 py-10" aria-label="Currently listening">
      <style>{CSS}</style>
      <div className="mx-auto max-w-xl">
        {!data ? (
          <div className="np-card np-skel" aria-busy="true" aria-label="Loading">
            <div className="np-cover" />
            <div className="np-main" style={{ display: "grid", gap: 10 }}>
              <i style={{ height: 10, width: 96 }} />
              <i style={{ height: 14, width: 160 }} />
              <i style={{ height: 12, width: 112 }} />
            </div>
          </div>
        ) : (
          <Tag {...linkProps} className={`np-card${track?.image && !imgFailed ? " np-has-bg" : ""}`}>
            {track?.image && !imgFailed && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={track.image} className="np-bg" src={track.image} alt="" aria-hidden="true" referrerPolicy="no-referrer" draggable={false} onError={() => setImgFailed(true)} />
                <span className="np-veil" aria-hidden="true" />
              </>
            )}
            <div className="np-cover">
              {track?.image && !imgFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={track.image} alt={track.album ? `${track.album} cover` : "Album cover"} width={80} height={80} loading="lazy" referrerPolicy="no-referrer" draggable={false} onError={() => setImgFailed(true)} />
              ) : (
                <NoteIcon />
              )}
            </div>

            <div className="np-main">
              <div className="np-label">
                {playing && (
                  <span className="np-eq" aria-hidden="true"><i /><i /><i /><i /></span>
                )}
                <span>{playing ? "Currently Listening" : "Last Played"}</span>
                {data.status === "last" && data.playedAt && <span className="np-ago">· {ago(data.playedAt)}</span>}
              </div>
              {track ? (
                <>
                  <p className="np-title">{track.title}</p>
                  <p className="np-artist">{track.artist}</p>
                </>
              ) : (
                <>
                  <p className="np-title">{data.status === "error" ? "Music is unavailable" : "Nothing played yet"}</p>
                  <p className="np-artist" style={{ whiteSpace: "normal" }}>
                    {data.status === "error" ? "Couldn't reach Last.fm right now." : "Check back once I press play."}
                  </p>
                </>
              )}
            </div>

            {href && (
              <span className="np-btn" aria-hidden="true">
                <span className="np-btn-text">Last.fm</span>
                <ArrowIcon />
              </span>
            )}
          </Tag>
        )}
      </div>
    </section>
  )
}
