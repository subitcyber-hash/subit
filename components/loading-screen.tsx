"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Reduced to 6 particles
const PARTICLES = [
  { x: 12, y: 78, s: 1.5, d: 6.0, delay: 0.2 },
  { x: 44, y: 88, s: 1.8, d: 5.2, delay: 0.5 },
  { x: 73, y: 65, s: 1.0, d: 5.9, delay: 0.8 },
  { x: 85, y: 22, s: 1.6, d: 7.5, delay: 1.6 },
  { x: 53, y: 18, s: 1.0, d: 5.5, delay: 0.9 },
  { x: 19, y: 15, s: 1.7, d: 6.1, delay: 2.3 },
]

const LOGO_LETTERS = ["𝔖", "𝔘", "𝔅", "ℑ", "𝔗"]

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "reveal" | "exit">("loading")
  const [done, setDone] = useState(false)
  const progressRef = useRef(0)

  useEffect(() => {
    // Slower interval — 120ms instead of 80ms, fewer re-renders
    const id = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + Math.random() * 4 + 2, 100)
      setProgress(Math.floor(progressRef.current))
      if (progressRef.current >= 100) {
        clearInterval(id)
        setTimeout(() => setPhase("reveal"), 200)
        setTimeout(() => setPhase("exit"), 1600)
        setTimeout(() => setDone(true), 2400)
      }
    }, 120)
    return () => clearInterval(id)
  }, [])

  const circumference = 2 * Math.PI * 108
  const dash = (progress / 100) * circumference

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Ambient glow — CSS only, no JS animation */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 500,
              height: 500,
              background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />

          {/* Particles — GPU accelerated with willChange */}
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.s,
                height: p.s,
                willChange: "transform, opacity",
              }}
              animate={{ opacity: [0, 0.35, 0], y: [0, -40] }}
              transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}

          {/* ── REVEAL PHASE ── */}
          <AnimatePresence>
            {phase === "reveal" && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Gothic letters */}
                <div className="flex items-end gap-1 sm:gap-2">
                  {LOGO_LETTERS.map((letter, i) => (
                    <motion.span
                      key={i}
                      className="text-white select-none"
                      style={{
                        fontSize: "clamp(56px, 12vw, 110px)",
                        fontFamily: "serif",
                        lineHeight: 1,
                        willChange: "transform, opacity",
                        textShadow: "0 0 30px rgba(255,255,255,0.4)",
                      }}
                      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>

                {/* Tagline */}
                <motion.p
                  className="mt-4 text-white/40 uppercase tracking-[0.5em] text-xs font-light"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Creator · Artist · Meme Lord
                </motion.p>

                {/* Sweep lines */}
                <motion.div
                  className="absolute flex w-full items-center justify-center"
                  style={{ top: "50%" }}
                >
                  <motion.div
                    className="h-px bg-white/15"
                    initial={{ width: 0 }}
                    animate={{ width: "35vw" }}
                    exit={{ width: 0 }}
                    transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                  />
                  <div className="mx-4 h-1 w-1 rounded-full bg-white/20" />
                  <motion.div
                    className="h-px bg-white/15"
                    initial={{ width: 0 }}
                    animate={{ width: "35vw" }}
                    exit={{ width: 0 }}
                    transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── LOADING PHASE: ring ── */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{ width: 260, height: 260 }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: phase === "loading" ? 1 : 0,
              scale: phase === "loading" ? 1 : 0.7,
            }}
            transition={{ duration: phase === "loading" ? 1.0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg className="absolute inset-0" width="260" height="260" viewBox="0 0 260 260">
              {/* Removed heavy SVG blur filters — use simple strokes only */}
              <circle cx="130" cy="130" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              <circle cx="130" cy="130" r="108" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

              {/* Progress arc — no filter */}
              <circle
                cx="130" cy="130" r="108"
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                transform="rotate(-90 130 130)"
                style={{ transition: "stroke-dasharray 0.12s ease-out" }}
              />

              {/* Single slow rotating arc — removed the fast spark */}
              <motion.circle
                cx="130" cy="130" r="108"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="60 620"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "130px 130px", willChange: "transform" }}
              />

              <circle cx="130" cy="130" r="90" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </svg>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="h-px w-4 bg-white/25" />
                  <div className="h-1 w-1 rounded-full bg-white/25" />
                  <div className="h-px w-4 bg-white/25" />
                </motion.div>

                <motion.h1
                  className="text-2xl font-light tracking-[0.5em] text-white"
                  style={{
                    textShadow: "0 0 20px rgba(255,255,255,0.3)",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    letterSpacing: "0.5em",
                    paddingLeft: "0.5em",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  SUBIT
                </motion.h1>

                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="h-px w-4 bg-white/25" />
                  <div className="h-1 w-1 rounded-full bg-white/25" />
                  <div className="h-px w-4 bg-white/25" />
                </motion.div>
              </div>

              <motion.span
                className="font-light text-white/30 tabular-nums"
                style={{ fontSize: 11, letterSpacing: "0.2em", fontFamily: "monospace" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {String(progress).padStart(3, "0")}
              </motion.span>
            </div>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "loading" ? 1 : 0 }}
            transition={{ delay: phase === "loading" ? 1.0 : 0, duration: 0.3 }}
          >
            <div className="h-px w-32 overflow-hidden bg-white/5 rounded-full">
              <div
                className="h-full bg-white/35 rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
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