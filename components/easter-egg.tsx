"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Hidden surprise: the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) or the `matrix` terminal command
// starts a short "digital rain" overlay. Esc / click / tap closes it; it also ends by itself.
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]
const DURATION = 8000
const GLYPHS = "アイウエオカキクケコサシスセソタチツテト0123456789<>/{}$#@SUBIT"

export function EasterEgg() {
  const [active, setActive] = useState(false)
  const [toast, setToast] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  const progress = useRef(0)

  const start = useCallback(() => setActive(true), [])
  const stop = useCallback(() => setActive(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return
      if (e.key === "Escape") return stop()
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      progress.current = k === KONAMI[progress.current] ? progress.current + 1 : k === KONAMI[0] ? 1 : 0
      if (progress.current === KONAMI.length) {
        progress.current = 0
        setToast(true)
        start()
      }
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("subit:matrix", start)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("subit:matrix", start)
    }
  }, [start, stop])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(false), 3500)
    return () => window.clearTimeout(id)
  }, [toast])

  useEffect(() => {
    if (!active) return
    const cv = canvas.current
    const ctx = cv?.getContext("2d")
    if (!cv || !ctx) return
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const end = window.setTimeout(stop, reduce ? 2500 : DURATION)
    if (reduce) return () => window.clearTimeout(end) // static overlay only

    let color = "#6EE7B7"
    try {
      const c = getComputedStyle(document.documentElement).getPropertyValue("--site-accent").trim()
      if (c) color = c
    } catch {}

    const size = 16
    let w = 0
    let h = 0
    let drops: number[] = []
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drops = Array.from({ length: Math.ceil(w / size) }, () => Math.random() * -40)
    }
    resize()
    window.addEventListener("resize", resize)

    let raf = 0
    let last = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (now - last < 50) return
      last = now
      ctx.fillStyle = "rgba(0,0,0,0.12)"
      ctx.fillRect(0, 0, w, h)
      ctx.font = `${size}px monospace`
      ctx.fillStyle = color
      drops.forEach((y, i) => {
        ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * size, y * size)
        drops[i] = y * size > h && Math.random() > 0.975 ? 0 : y + 1
      })
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(end)
      window.removeEventListener("resize", resize)
    }
  }, [active, stop])

  return (
    <>
      {active && (
        <div
          role="dialog"
          aria-label="Easter egg"
          onClick={stop}
          className="fixed inset-0 z-[9998] cursor-pointer bg-black/85"
          style={{ animation: "egg-in .4s ease both" }}
        >
          <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
          <p className="absolute inset-x-0 bottom-8 text-center font-mono text-xs text-white/60">tap anywhere or press Esc to exit</p>
        </div>
      )}
      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-6 z-[9999] -translate-x-1/2 rounded-full border border-white/15 bg-black/80 px-4 py-2 font-mono text-xs text-white backdrop-blur"
          style={{ animation: "egg-in .3s ease both" }}
        >
          🎮 Cheat code activated
        </div>
      )}
      <style>{`@keyframes egg-in{from{opacity:0}to{opacity:1}}@media (prefers-reduced-motion:reduce){[aria-label="Easter egg"]{animation:none!important}}`}</style>
    </>
  )
}
