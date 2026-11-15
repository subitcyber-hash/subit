"use client"

import { useEffect, useRef } from "react"

// A 3D "extruded" title. The depth is a stack of text-shadows whose direction follows the pointer
// (plus a small tilt), tinted from the site accent colour down to black. On touch devices, or when
// the mouse is idle, it sways gently by itself. With reduced motion it stays still.
const LAYERS = 14

// The depth is LAYERS stacked copies of the text, each shifted a bit further along (--sx, --sy) and tinted
// from the accent colour down to black. Moving copies is a GPU transform (no repainting the glyphs), so it
// stays smooth even on phones.
const CSS = (() => {
  let rules = ""
  for (let i = 1; i <= LAYERS; i++) {
    const mix = Math.round(46 - (i / LAYERS) * 40) // accent %: brighter near the face, near-black at the back
    rules += `.t3d-l${i}{transform:translate3d(calc(var(--sx) * ${i}px),calc(var(--sy) * ${i}px),0);color:color-mix(in srgb,var(--site-accent) ${mix}%,#000)}\n`
  }
  return `
.t3d-wrap{display:inline-block;perspective:900px}
.t3d{position:relative;display:inline-block;--sx:0.6;--sy:1;--rx:0deg;--ry:0deg;transform:rotateX(var(--rx)) rotateY(var(--ry));transform-style:preserve-3d;will-change:transform}
.t3d-l{position:absolute;left:0;top:0;white-space:nowrap;user-select:none;pointer-events:none;will-change:transform}
.t3d-face{position:relative;display:block;color:#fff;text-shadow:0 -1px 0 rgba(255,255,255,.5),0 0 70px color-mix(in srgb,var(--site-accent) 30%,transparent)}
${rules}`
})()

export function Title3D({ children }: { children: string }) {
  const el = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = el.current
    if (!node) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return // static depth only

    let tx = 0 // target, -1..1
    let ty = 0
    let cx = 0 // current
    let cy = 0
    let lastMove = 0
    let visible = true
    let raf = 0

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
      lastMove = performance.now()
    }
    window.addEventListener("pointermove", onMove, { passive: true })

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(node)

    const tick = (now: number) => {
      raf = 0
      if (!visible || document.hidden) return // resumes via the observer / visibilitychange
      // idle (or touch): drift slowly in a figure-eight
      if (now - lastMove > 2500) {
        tx = Math.sin(now / 1900) * 0.7
        ty = Math.cos(now / 2600) * 0.45
      }
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      // light comes from the pointer side → the extrusion falls the opposite way
      node.style.setProperty("--sx", (-cx * 1.25).toFixed(3))
      node.style.setProperty("--sy", (0.55 - cy * 0.9).toFixed(3))
      node.style.setProperty("--rx", `${(-cy * 9).toFixed(2)}deg`)
      node.style.setProperty("--ry", `${(cx * 13).toFixed(2)}deg`)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const onVis = () => {
      if (!document.hidden && !raf) raf = requestAnimationFrame(tick)
    }
    document.addEventListener("visibilitychange", onVis)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <span className="t3d-wrap">
        <span ref={el} className="t3d" aria-hidden>
          {Array.from({ length: LAYERS }, (_, k) => LAYERS - k).map((i) => (
            <span key={i} className={`t3d-l t3d-l${i}`}>
              {children}
            </span>
          ))}
          <span className="t3d-face">{children}</span>
        </span>
      </span>
    </>
  )
}
