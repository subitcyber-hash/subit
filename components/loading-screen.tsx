"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Deterministic particles — no Math.random at render time
const PARTICLES = [
  { x: 12, y: 78, s: 1.5, d: 5.2, delay: 0.2 },
  { x: 28, y: 45, s: 1.0, d: 7.1, delay: 1.1 },
  { x: 44, y: 88, s: 1.8, d: 4.8, delay: 0.5 },
  { x: 61, y: 32, s: 1.2, d: 6.4, delay: 2.0 },
  { x: 73, y: 65, s: 1.0, d: 5.9, delay: 0.8 },
  { x: 85, y: 22, s: 1.6, d: 7.5, delay: 1.6 },
  { x: 92, y: 74, s: 1.1, d: 4.3, delay: 0.3 },
  { x: 7,  y: 38, s: 1.4, d: 6.8, delay: 1.9 },
  { x: 53, y: 18, s: 1.0, d: 5.5, delay: 0.9 },
  { x: 38, y: 58, s: 1.3, d: 7.2, delay: 1.4 },
  { x: 67, y: 91, s: 1.0, d: 4.6, delay: 0.6 },
  { x: 19, y: 15, s: 1.7, d: 6.1, delay: 2.3 },
]

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cur = 0
    const id = setInterval(() => {
      cur = Math.min(cur + Math.random() * 3 + 1, 100)
      setProgress(Math.floor(cur))
      if (cur >= 100) {
        clearInterval(id)
        setTimeout(() => setDone(true), 900)
      }
    }, 80)
    return () => clearInterval(id)
  }, [])

  const circumference = 2 * Math.PI * 108
  const dash = (progress / 100) * circumference

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Subtle grain */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.06] pointer-events-none">
            <filter id="g">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
              <feColorMatrix type="saturate" values="0"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#g)"/>
          </svg>

          {/* Ambient center glow — breathes slowly */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 500,
              height: 500,
              background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 65%)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating particles */}
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
              animate={{ opacity: [0, 0.4, 0], y: [0, -40] }}
              transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}

          {/* Ring + content */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{ width: 260, height: 260 }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg className="absolute inset-0" width="260" height="260" viewBox="0 0 260 260">
              <defs>
                <filter id="softglow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="b1"/>
                  <feGaussianBlur stdDeviation="8" result="b2"/>
                  <feMerge>
                    <feMergeNode in="b2"/>
                    <feMergeNode in="b1"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="sparkglow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2"/>
                </filter>
              </defs>

              {/* Outer faint static ring */}
              <circle
                cx="130" cy="130" r="120"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />

              {/* Track ring */}
              <circle
                cx="130" cy="130" r="108"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />

              {/* Progress ring — clean arc */}
              <motion.circle
                cx="130" cy="130" r="108"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                transform="rotate(-90 130 130)"
                filter="url(#softglow)"
                transition={{ ease: "easeOut" }}
              />

              {/* Slow rotating arc — elegant sweep */}
              <motion.circle
                cx="130" cy="130" r="108"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="80 600"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "130px 130px" }}
              />

              {/* Bright spark — moves fast */}
              <motion.circle
                cx="130" cy="130" r="108"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="4 675"
                filter="url(#softglow)"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "130px 130px" }}
              />

              {/* Inner subtle ring */}
              <circle
                cx="130" cy="130" r="90"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
            </svg>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center gap-3">

              {/* Minimal brackets + SUBIT */}
              <div className="relative flex flex-col items-center gap-1">
                {/* Top bracket line */}
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="h-px w-4 bg-white/25" />
                  <div className="h-1 w-1 rounded-full bg-white/25" />
                  <div className="h-px w-4 bg-white/25" />
                </motion.div>

                {/* SUBIT */}
                <motion.h1
                  className="text-2xl font-light tracking-[0.5em] text-white"
                  style={{
                    textShadow: "0 0 20px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    letterSpacing: "0.5em",
                    paddingLeft: "0.5em", // compensate for tracking
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  SUBIT
                </motion.h1>

                {/* Bottom bracket line */}
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <div className="h-px w-4 bg-white/25" />
                  <div className="h-1 w-1 rounded-full bg-white/25" />
                  <div className="h-px w-4 bg-white/25" />
                </motion.div>
              </div>

              {/* Progress counter */}
              <motion.span
                className="font-light text-white/30 tabular-nums"
                style={{ fontSize: 11, letterSpacing: "0.2em", fontFamily: "monospace" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {String(progress).padStart(3, "0")}
              </motion.span>
            </div>
          </motion.div>

          {/* Bottom minimal line */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {/* Thin progress bar */}
            <div className="h-px w-32 overflow-hidden bg-white/5 rounded-full">
              <motion.div
                className="h-full bg-white/40 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <span className="text-[9px] uppercase tracking-[0.5em] text-white/15 font-light">
              Loading
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}