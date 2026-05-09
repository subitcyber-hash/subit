"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      // Random increment for natural feel
      const increment = Math.random() * 6 + 2
      current = Math.min(current + increment, 100)
      setProgress(Math.floor(current))

      if (current >= 100) {
        clearInterval(interval)
        setTimeout(() => setDone(true), 700)
      }
    }, 60)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Subtle grain */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.06] pointer-events-none">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
              <feColorMatrix type="saturate" values="0"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)"/>
          </svg>

          {/* Pill container */}
          <motion.div
            className="relative flex flex-col items-center justify-center overflow-hidden"
            style={{
              width: 280,
              height: 180,
              borderRadius: 60,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Animated gradient orbs inside pill */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 180,
                height: 120,
                background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)",
                bottom: -20,
                left: -20,
                filter: "blur(20px)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 150,
                height: 100,
                background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
                top: -10,
                right: -10,
                filter: "blur(20px)",
              }}
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -10, 0],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 100,
                height: 80,
                background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",
                bottom: 10,
                right: 20,
                filter: "blur(16px)",
              }}
              animate={{
                scale: [1, 1.3, 1],
                y: [0, -10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Percentage number */}
            <motion.div
              className="relative z-10 flex items-baseline gap-1"
              key={progress}
            >
              <span
                className="font-bold text-white"
                style={{
                  fontSize: 64,
                  lineHeight: 1,
                  fontFamily: "sans-serif",
                  textShadow: "0 2px 20px rgba(255,255,255,0.3)",
                  letterSpacing: "-2px",
                }}
              >
                {progress}
              </span>
              <span
                className="text-white/70 font-medium"
                style={{ fontSize: 24, lineHeight: 1 }}
              >
                %
              </span>
            </motion.div>

            {/* LOADING text */}
            <motion.p
              className="relative z-10 mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/50"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading
            </motion.p>

            {/* Glass shine at top */}
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                height: "40%",
                background: "linear-gradient(to bottom, rgba(255,255,255,0.07), transparent)",
                borderRadius: "60px 60px 0 0",
              }}
            />
          </motion.div>

          {/* Site name below pill */}
          <motion.p
            className="absolute bottom-12 text-xs uppercase tracking-[0.5em] text-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            SUBIT
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}