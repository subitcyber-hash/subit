"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

const BIRTH_DATE = new Date("2008-05-27T00:00:00")

function getAge() {
  const now = new Date()
  const diff = now.getTime() - BIRTH_DATE.getTime()
  const years = diff / (1000 * 60 * 60 * 24 * 365.25)
  return years.toFixed(9) // 9 decimal places
}

export function AgeCounter() {
  const rootRef = useRef<HTMLDivElement>(null)
  const wholeRef = useRef<HTMLSpanElement>(null)
  const decimalRef = useRef<HTMLSpanElement>(null)
  const [whole, decimal] = getAge().split(".")

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // Update the text nodes directly (no React re-render) and only while visible
    const tick = () => {
      const [w, d] = getAge().split(".")
      if (wholeRef.current) wholeRef.current.textContent = w
      if (decimalRef.current) decimalRef.current.textContent = `.${d}`
    }
    let id: ReturnType<typeof setInterval> | null = null
    const start = () => { if (id === null) id = setInterval(tick, 100) }
    const stop = () => { if (id !== null) { clearInterval(id); id = null } }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { tick(); start() } else stop()
    })
    io.observe(root)
    return () => { stop(); io.disconnect() }
  }, [])

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-1"
    >
      <div className="flex items-baseline gap-0.5 font-mono">
        <span ref={wholeRef} suppressHydrationWarning className="text-2xl font-bold text-foreground">{whole}</span>
        <span ref={decimalRef} suppressHydrationWarning className="text-sm text-muted-foreground">.{decimal}</span>
      </div>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">Years Old</span>
    </motion.div>
  )
}
