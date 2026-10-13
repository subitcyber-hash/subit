"use client"

import { useEffect, useRef, useState } from "react"
import {
  ACCENTS,
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  applyAccent,
  readStoredAccent,
  storeAccent,
  type AccentId,
} from "@/lib/accent"

const CSS = `
.acs{display:flex;flex-wrap:wrap;align-items:center;gap:10px 12px}
.acs-label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted-foreground)}
.acs-row{display:flex;align-items:center;gap:6px}
.acs-sw{position:relative;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:transparent;cursor:pointer;display:grid;place-items:center;-webkit-tap-highlight-color:transparent}
.acs-dot{width:18px;height:18px;border-radius:50%;background:var(--c);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);transition:transform .2s ease,box-shadow .2s ease}
.acs-sw:hover .acs-dot{transform:scale(1.18)}
.acs-sw[aria-checked="true"] .acs-dot{transform:scale(1.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18),0 0 0 2px var(--background),0 0 0 3.5px var(--c)}
.acs-sw:focus-visible{outline:2px solid var(--site-accent);outline-offset:1px}
.acs-reset{font:inherit;font-size:12px;color:var(--muted-foreground);background:transparent;border:1px solid var(--border);border-radius:999px;padding:4px 10px;cursor:pointer;transition:color .2s,border-color .2s,opacity .2s}
.acs-reset:hover:not(:disabled){color:var(--foreground);border-color:var(--site-accent)}
.acs-reset:focus-visible{outline:2px solid var(--site-accent);outline-offset:2px}
.acs-reset:disabled{opacity:.4;cursor:default}
@media (prefers-reduced-motion:reduce){.acs-dot,.acs-reset{transition:none}.acs-sw:hover .acs-dot{transform:none}}
`

export function AccentSwitcher() {
  // SSR and first client render both use the default, so hydration always matches;
  // the saved choice is read after mount (the <head> script already painted the right color).
  const [accent, setAccent] = useState<AccentId>(DEFAULT_ACCENT)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    setAccent(readStoredAccent())
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACCENT_STORAGE_KEY || e.key === null) {
        const next = readStoredAccent()
        applyAccent(next)
        setAccent(next)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const choose = (id: AccentId) => {
    setAccent(id)
    applyAccent(id)
    storeAccent(id)
  }

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = ACCENTS.length - 1
    let next = -1
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === last ? 0 : i + 1
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? last : i - 1
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = last
    if (next < 0) return
    e.preventDefault()
    choose(ACCENTS[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div className="acs">
      <style>{CSS}</style>
      <span className="acs-label" id="acs-label">Accent</span>
      <div className="acs-row" role="radiogroup" aria-labelledby="acs-label">
        {ACCENTS.map((a, i) => (
          <button
            key={a.id}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="radio"
            aria-checked={accent === a.id}
            aria-label={a.name}
            title={a.name}
            tabIndex={accent === a.id ? 0 : -1}
            className="acs-sw"
            style={{ ["--c" as string]: a.hex }}
            onClick={() => choose(a.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className="acs-dot" />
          </button>
        ))}
      </div>
      <button type="button" className="acs-reset" onClick={() => choose(DEFAULT_ACCENT)} disabled={accent === DEFAULT_ACCENT} aria-label="Reset accent color to Ice Blue">
        Reset
      </button>
    </div>
  )
}
