"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0)
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-white/5">
      <motion.div
        className="h-full origin-left"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.9))",
          boxShadow: "0 0 8px rgba(255,255,255,0.4)",
        }}
        transition={{ ease: "linear" }}
      />
    </div>
  )
}