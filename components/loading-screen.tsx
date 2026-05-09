"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LETTERS = ["S", "U", "B", "I", "T"]

export function LoadingScreen() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [fading, setFading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Reveal letters one by one
    const timers: ReturnType<typeof setTimeout>[] = []

    LETTERS.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleCount(i + 1), 300 + i * 350)
      )
    })

    // After all letters shown, wait then fade out
    timers.push(setTimeout(() => setFading(true), 300 + LETTERS.length * 350 + 600))
    timers.push(setTimeout(() => setDone(true), 300 + LETTERS.length * 350 + 1400))

    return () => timers.forEach(clearTimeout)
  }, [])

  if (done) return null

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
          animate={fading ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Subtle grain */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.08] pointer-events-none">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
              <feColorMatrix type="saturate" values="0"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)"/>
          </svg>

          {/* Letters */}
          <div className="flex items-end gap-2 sm:gap-4">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={letter}
                className="text-7xl font-bold text-white sm:text-9xl"
                style={{
                  fontFamily: "serif",
                  opacity: 0,
                  lineHeight: 1,
                }}
                animate={
                  visibleCount > i
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 20, filter: "blur(8px)" }
                }
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Thin line that draws under letters */}
          <motion.div
            className="absolute bottom-[46%] h-px bg-white/20"
            initial={{ width: 0 }}
            animate={visibleCount === LETTERS.length ? { width: "120px" } : { width: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}