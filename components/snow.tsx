"use client"

import { useEffect, useRef } from "react"

type Flake = {
  x: number
  y: number
  r: number      // radius
  speed: number  // fall speed (px/frame @60fps)
  sway: number   // horizontal sway amplitude
  phase: number
  opacity: number
}

// Lightweight canvas snowfall. Never blocks clicks, pauses when the tab is hidden,
// and is skipped entirely for people who prefer reduced motion.
export function Snow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0
    let h = 0
    let flakes: Flake[] = []
    let raf = 0
    let last = performance.now()

    const makeFlake = (spawnAnywhere: boolean): Flake => {
      const r = 0.8 + Math.random() * 2.4
      return {
        x: Math.random() * w,
        y: spawnAnywhere ? Math.random() * h : -10,
        r,
        speed: 0.35 + r * 0.28,
        sway: 8 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.35 + Math.random() * 0.55,
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = w < 640 ? 40 : 90
      flakes = Array.from({ length: count }, () => makeFlake(true))
    }

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 3) // normalize to 60fps, clamp big gaps
      last = now
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i]
        f.y += f.speed * dt
        f.phase += 0.012 * dt
        const x = f.x + Math.sin(f.phase) * f.sway
        if (f.y - f.r > h) {
          flakes[i] = makeFlake(false)
          continue
        }
        ctx.beginPath()
        ctx.arc(x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(140,189,232,${f.opacity})`
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener("resize", resize)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  )
}
