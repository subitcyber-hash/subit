"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const LETTERS = ["S", "U", "B", "I", "T"]

export function LoadingScreen() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [fading, setFading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // Flip letters in one by one
    LETTERS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 200 + i * 300))
    })

    // Wait then fade out
    const totalDelay = 200 + LETTERS.length * 300 + 700
    timers.push(setTimeout(() => setFading(true), totalDelay))
    timers.push(setTimeout(() => setDone(true), totalDelay + 900))

    return () => timers.forEach(clearTimeout)
  }, [])

  if (done) return null

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black"
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Subtle grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.07] pointer-events-none">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)"/>
      </svg>

      {/* 3D flip letters */}
      <div
        className="flex items-center gap-3 sm:gap-6"
        style={{ perspective: "800px" }}
      >
        {LETTERS.map((letter, i) => (
          <motion.span
            key={letter}
            className="inline-block text-7xl font-bold text-white sm:text-[120px]"
            style={{
              fontFamily: "serif",
              lineHeight: 1,
              transformStyle: "preserve-3d",
            }}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={
              visibleCount > i
                ? { rotateX: 0, opacity: 1 }
                : { rotateX: -90, opacity: 0 }
            }
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 16,
              mass: 0.9,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Underline draws after all letters */}
      <motion.div
        className="mt-4 h-px bg-white/25"
        initial={{ width: 0, opacity: 0 }}
        animate={
          visibleCount === LETTERS.length
            ? { width: "160px", opacity: 1 }
            : { width: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      />

      {/* Tagline fades in after letters */}
      <motion.p
        className="mt-4 text-[10px] uppercase tracking-[0.5em] text-white/25"
        initial={{ opacity: 0 }}
        animate={visibleCount === LETTERS.length ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Creator · Artist · Meme Lord
      </motion.p>
    </motion.div>
  )
}