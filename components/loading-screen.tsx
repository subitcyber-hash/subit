"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen() {
  const [phase, setPhase] = useState<"enter" | "opening" | "done">("enter")
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => handleOpen(), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleOpen = () => {
    if (clicked) return
    setClicked(true)
    setPhase("opening")
    setTimeout(() => setPhase("done"), 1400)
  }

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex cursor-pointer"
          onClick={handleOpen}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* ── Shared blurred video background (visible between doors) ── */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover scale-110"
              style={{ filter: "blur(18px) brightness(0.4)" }}
            >
              <source src="/door-bg.mp4" type="video/mp4" />
            </video>
            {/* Extra dark overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* ── LEFT DOOR ── */}
          <motion.div
            className="relative flex h-full w-1/2 flex-col items-end justify-center overflow-hidden pr-12"
            style={{ background: "rgba(0,0,0,0.88)" }}
            animate={phase === "opening" ? { x: "-100%" } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Blurred video inside door (slightly lighter than bg) */}
            <div className="absolute inset-0 overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover scale-110"
                style={{ filter: "blur(24px) brightness(0.25)", opacity: 0.6 }}
              >
                <source src="/door-bg.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Film grain */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.12] pointer-events-none">
              <filter id="grain-l">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="saturate" values="0"/>
              </filter>
              <rect width="100%" height="100%" filter="url(#grain-l)"/>
            </svg>

            {/* Radial glow from seam */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 100% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />

            {/* Right edge seam */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-white/15" />

            {/* Corner brackets */}
            <div className="absolute top-8 right-8 h-8 w-8 border-t border-r border-white/20" />
            <div className="absolute bottom-8 right-8 h-8 w-8 border-b border-r border-white/20" />

            {/* SU text */}
            <motion.div
              className="relative z-10 flex flex-col items-end gap-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1
                className="text-6xl font-bold tracking-[0.2em] text-white sm:text-8xl"
                style={{ fontFamily: "serif", textShadow: "0 0 40px rgba(255,255,255,0.2)" }}
              >
                SU
              </h1>
              <div className="h-px w-16 bg-white/25" />
            </motion.div>
          </motion.div>

          {/* ── RIGHT DOOR ── */}
          <motion.div
            className="relative flex h-full w-1/2 flex-col items-start justify-center overflow-hidden pl-12"
            style={{ background: "rgba(8,8,8,0.88)" }}
            animate={phase === "opening" ? { x: "100%" } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Blurred video inside door */}
            <div className="absolute inset-0 overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover scale-110"
                style={{ filter: "blur(24px) brightness(0.25)", opacity: 0.6 }}
              >
                <source src="/door-bg.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Film grain */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.12] pointer-events-none">
              <filter id="grain-r">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="saturate" values="0"/>
              </filter>
              <rect width="100%" height="100%" filter="url(#grain-r)"/>
            </svg>

            {/* Radial glow from seam */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />

            {/* Left edge seam */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/15" />

            {/* Corner brackets */}
            <div className="absolute top-8 left-8 h-8 w-8 border-t border-l border-white/20" />
            <div className="absolute bottom-8 left-8 h-8 w-8 border-b border-l border-white/20" />

            {/* BI text */}
            <motion.div
              className="relative z-10 flex flex-col items-start gap-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1
                className="text-6xl font-bold tracking-[0.2em] text-white sm:text-8xl"
                style={{ fontFamily: "serif", textShadow: "0 0 40px rgba(255,255,255,0.2)" }}
              >
                BIT
              </h1>
              <div className="h-px w-16 bg-white/25" />
            </motion.div>
          </motion.div>

          {/* ── Center seam ── */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)" }}
            animate={phase === "opening" ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />

          {/* ── Enter prompt ── */}
          <AnimatePresence>
            {phase === "enter" && (
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.9 }}
              >
                {/* Pulsing ring */}
                <motion.div
                  className="relative flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.04)" }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <div className="flex items-center gap-1.5">
                    <svg width="7" height="11" viewBox="0 0 8 12" fill="white" opacity="0.7">
                      <path d="M8 6L0 0v12z" />
                    </svg>
                    <svg width="7" height="11" viewBox="0 0 8 12" fill="white" opacity="0.7" style={{ transform: "scaleX(-1)" }}>
                      <path d="M8 6L0 0v12z" />
                    </svg>
                  </div>
                </motion.div>

                <motion.span
                  className="text-[10px] uppercase tracking-[0.5em] text-white/30"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  Enter
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}