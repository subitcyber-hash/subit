"use client"

import { useEffect, useRef } from "react"

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      const progress = total > 0 ? (scrollTop / total) * 100 : 0
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress / 100})`
      }
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-white/5">
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "100%",
          transform: "scaleX(0)",
          transformOrigin: "left",
          background: "linear-gradient(to right, color-mix(in srgb, var(--site-accent) 40%, transparent), var(--site-accent))",
          boxShadow: "0 0 8px color-mix(in srgb, var(--site-accent) 40%, transparent)",
          willChange: "transform",
        }}
      />
    </div>
  )
}