"use client"

import { useEffect, useState } from "react"
import { isSfxOn, play, setSfxOn } from "@/lib/sfx"

// Mounted once in the layout: soft tap on buttons/links, and typing sounds in the terminal input.
export function SfxListener() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("a,button,[role='button'],[role='radio']")
      if (!el || el.closest("[data-nosfx]")) return
      play("tap")
    }
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (!t?.classList?.contains("tm-field") || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      if (e.key === "Enter") play("enter")
      else if (e.key.length === 1 || e.key === "Backspace") play("key")
    }
    document.addEventListener("click", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("click", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [])
  return null
}

const CSS = `
.sfx{display:inline-flex;align-items:center;gap:8px;font:inherit;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted-foreground);background:transparent;border:1px solid var(--border);border-radius:999px;padding:5px 12px 5px 10px;cursor:pointer;transition:color .2s,border-color .2s}
.sfx:hover{color:var(--foreground);border-color:var(--site-accent)}
.sfx:focus-visible{outline:2px solid var(--site-accent);outline-offset:2px}
.sfx[aria-pressed="true"] svg{color:var(--site-accent)}
@media (prefers-reduced-motion:reduce){.sfx{transition:none}}
`

export function SfxToggle() {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const sync = () => setOn(isSfxOn())
    sync()
    window.addEventListener("subit:sfx-change", sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener("subit:sfx-change", sync)
      window.removeEventListener("storage", sync)
    }
  }, [])
  return (
    <>
      <style>{CSS}</style>
      <button
        type="button"
        data-nosfx
        className="sfx"
        aria-pressed={on}
        aria-label={on ? "Sound effects on. Click to mute" : "Sound effects off. Click to turn on"}
        onClick={() => {
          const next = !on
          setSfxOn(next)
          setOn(next)
          if (next) play("toggle", true)
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          {on ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          ) : (
            <>
              <path d="m22 9-6 6" />
              <path d="m16 9 6 6" />
            </>
          )}
        </svg>
        Sound {on ? "on" : "off"}
      </button>
    </>
  )
}
