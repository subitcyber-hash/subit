"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
  const [stage, setStage] = useState<"video" | "loading" | "reveal" | "done">("video")
  const [progress, setProgress] = useState(0)
  const [videoFading, setVideoFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef(0)

  // Stage 1: video plays for 2-3 sec then fades out
  useEffect(() => {
    const fadeTimer = setTimeout(() => setVideoFading(true), 2500)
    const switchTimer = setTimeout(() => setStage("loading"), 3200)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(switchTimer)
    }
  }, [])

  // Stage 2: loading progress bar
  useEffect(() => {
    if (stage !== "loading") return
    const id = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + Math.random() * 4 + 2, 100)
      setProgress(Math.floor(progressRef.current))
      if (progressRef.current >= 100) {
        clearInterval(id)
        setTimeout(() => setStage("reveal"), 200)
        setTimeout(() => setStage("done"), 2000)
      }
    }, 120)
    return () => clearInterval(id)
  }, [stage])

  if (stage === "done") return null

  const circumference = 2 * Math.PI * 108
  const dash = (progress / 100) * circumference

  return (
    <div className="fixed inset-0 z-[999] bg-black overflow-hidden">

      {/* ── VIDEO INTRO ── */}
      <AnimatePresence>
        {(stage === "video") && (
          <motion.div
            className="absolute inset-0 z-20"
            initial={{ opacity: 1 }}
            animate={{ opacity: videoFading ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <video
              ref={videoRef}
              src="/lock.webm"
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LOADING RING ── */}
      <AnimatePresence>
        {stage === "loading" && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Ambient glow */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 500, height: 500,
                background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)",
                left: "50%", top: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />

            {/* Particles */}
            {PARTICLES.map((p, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white pointer-events-none"
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, willChange: "transform, opacity" }}
                animate={{ opacity: [0, 0.35, 0], y: [0, -40] }}
                transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
              />
            ))}

            {/* Ring */}
            <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
              <svg className="absolute inset-0" width="260" height="260" viewBox="0 0 260 260">
                <circle cx="130" cy="130" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                <circle cx="130" cy="130" r="108" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
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

              {/* Center */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-4 bg-white/25" />
                    <div className="h-1 w-1 rounded-full bg-white/25" />
                    <div className="h-px w-4 bg-white/25" />
                  </div>
                  <h1
                    className="text-2xl font-light tracking-[0.5em] text-white"
                    style={{
                      textShadow: "0 0 20px rgba(255,255,255,0.3)",
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      letterSpacing: "0.5em",
                      paddingLeft: "0.5em",
                    }}
                  >
                    SUBIT
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="h-px w-4 bg-white/25" />
                    <div className="h-1 w-1 rounded-full bg-white/25" />
                    <div className="h-px w-4 bg-white/25" />
                  </div>
                </div>
                <span
                  className="font-light text-white/30 tabular-nums"
                  style={{ fontSize: 11, letterSpacing: "0.2em", fontFamily: "monospace" }}
                >
                  {String(progress).padStart(3, "0")}
                </span>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-12 flex flex-col items-center gap-3">
              <div className="h-px w-32 overflow-hidden bg-white/5 rounded-full">
                <div
                  className="h-full bg-white/35 rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[9px] uppercase tracking-[0.5em] text-white/15 font-light">
                Loading
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── REVEAL PHASE ── */}
      <AnimatePresence>
        {stage === "reveal" && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
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
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="mt-4 text-white/40 uppercase tracking-[0.5em] text-xs font-light"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Creator · Artist · Meme Lord
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}