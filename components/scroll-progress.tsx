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
        barRef.current.style.width = `${progress}%`
      }
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-[#C9D6E3]/40">
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "0%",
          background: "linear-gradient(to right, #8CBDE8, #61788D)",
          boxShadow: "0 0 8px rgba(140,189,232,0.5)",
          willChange: "width",
        }}
      />
    </div>
  )
}