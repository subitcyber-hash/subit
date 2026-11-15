"use client"

import { useEffect, useRef } from "react"

// A chrome, solid-looking 3D title that spins like a turntable.
// The thickness is LAYERS stacked copies of the text placed one behind the other in real 3D space
// (translateZ), so when it turns you see the true side edges, then the back, then the front again.
// Everything is a GPU transform, and the spin pauses when the title is off screen.
// Reduced motion: no spin — it rests at a slight angle so the depth is still visible.
const LAYERS = 36
const STEP = 1 // px between layers → ~36px of thickness (tight, so the side reads as one solid slab)
const SPIN_SECONDS = 9

const CSS = (() => {
  let rules = ""
  for (let i = 1; i <= LAYERS; i++) {
    // smooth, band-free metal edge: a single gentle darkening from front to back, hint of accent colour
    const light = (58 - (i / LAYERS) * 26).toFixed(1)
    rules += `.t3d-l${i}{transform:translateZ(${(-i * STEP).toFixed(2)}px);color:color-mix(in srgb,var(--site-accent) 14%,hsl(215 8% ${light}%))}\n`
  }
  return `
.t3d-wrap{position:relative;display:inline-block;perspective:1100px;padding:0 .12em}
.t3d-wrap::before{content:"";position:absolute;inset:-30% -10%;pointer-events:none;background:radial-gradient(closest-side,color-mix(in srgb,var(--site-accent) 20%,transparent),transparent 72%)}
.t3d-tilt{position:relative;display:inline-block;transform:rotateX(var(--rx,-6deg));transform-style:preserve-3d;transition:transform .35s ease-out}
.t3d{position:relative;display:inline-block;transform-style:preserve-3d;animation:t3d-spin ${SPIN_SECONDS}s linear infinite}
.t3d.paused{animation-play-state:paused}
@keyframes t3d-spin{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}
.t3d-l{position:absolute;left:0;top:0;white-space:nowrap;user-select:none;pointer-events:none}
.t3d-face,.t3d-back{display:block;color:transparent;
  background:linear-gradient(180deg,#fff 0%,color-mix(in srgb,var(--site-accent) 22%,#d6dade) 30%,#5d636b 49%,#f1f3f5 53%,#a3a9b1 76%,#fff 100%);
  -webkit-background-clip:text;background-clip:text}
.t3d-face{position:relative}
.t3d-back{position:absolute;left:0;top:0;white-space:nowrap;user-select:none;pointer-events:none;transform:translateZ(${(-(LAYERS + 1) * STEP).toFixed(2)}px)}
${rules}
@media (prefers-reduced-motion:reduce){.t3d{animation:none;transform:rotateY(-30deg)}}
`
})()

export function Title3D({ children }: { children: string }) {
  const tilt = useRef<HTMLSpanElement>(null)
  const spin = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const t = tilt.current
    const s = spin.current
    if (!t || !s) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return

    // mouse height nudges the tilt a little (up/down look)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const y = (e.clientY / window.innerHeight) * 2 - 1
      t.style.setProperty("--rx", `${(-6 - y * 10).toFixed(1)}deg`)
    }
    window.addEventListener("pointermove", onMove, { passive: true })

    const io = new IntersectionObserver(([en]) => s.classList.toggle("paused", !en.isIntersecting))
    io.observe(s)
    const onVis = () => s.classList.toggle("paused", document.hidden)
    document.addEventListener("visibilitychange", onVis)

    return () => {
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <span className="t3d-wrap">
        <span ref={tilt} className="t3d-tilt" aria-hidden>
          <span ref={spin} className="t3d">
            {Array.from({ length: LAYERS }, (_, k) => LAYERS - k).map((i) => (
              <span key={i} className={`t3d-l t3d-l${i}`}>
                {children}
              </span>
            ))}
            <span className="t3d-back">{children}</span>
            <span className="t3d-face">{children}</span>
          </span>
        </span>
      </span>
    </>
  )
}
