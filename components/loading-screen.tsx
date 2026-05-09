"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen() {
  const [phase, setPhase] = useState<"enter" | "opening" | "done">("enter")
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    // Auto-open after 2.5s if user doesn't click
    const timer = setTimeout(() => handleOpen(), 2500)
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
          transition={{ duration: 0.3 }}
        >
          {/* LEFT DOOR */}
          <motion.div
            className="relative flex h-full w-1/2 flex-col items-end justify-center overflow-hidden bg-black pr-12"
            animate={phase === "opening" ? { x: "-100%" } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Film grain */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.15] pointer-events-none">
              <filter id="grain-l">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="saturate" values="0"/>
              </filter>
              <rect width="100%" height="100%" filter="url(#grain-l)"/>
            </svg>

            {/* Blur glow */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 65%)" }} />

            {/* Grid texture */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Vertical line on right edge */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-white/10" />

            {/* Corner brackets */}
            <div className="absolute top-8 right-8 h-8 w-8 border-t border-r border-white/20" />
            <div className="absolute bottom-8 right-8 h-8 w-8 border-b border-r border-white/20" />

            {/* Content */}
            <motion.div
              className="relative z-10 flex flex-col items-end gap-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold tracking-[0.2em] text-white sm:text-7xl"
                style={{ fontFamily: "serif" }}>
                SU
              </h1>
              <div className="h-px w-16 bg-white/30" />
            </motion.div>

            {/* Glow */}
            <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
          </motion.div>

          {/* RIGHT DOOR */}
          <motion.div
            className="relative flex h-full w-1/2 flex-col items-start justify-center overflow-hidden bg-[#0a0a0a] pl-12"
            animate={phase === "opening" ? { x: "100%" } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Film grain */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.15] pointer-events-none">
              <filter id="grain-r">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="saturate" values="0"/>
              </filter>
              <rect width="100%" height="100%" filter="url(#grain-r)"/>
            </svg>

            {/* Blur glow */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 65%)" }} />

            {/* Grid texture */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Vertical line on left edge */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />

            {/* Corner brackets */}
            <div className="absolute top-8 left-8 h-8 w-8 border-t border-l border-white/20" />
            <div className="absolute bottom-8 left-8 h-8 w-8 border-b border-l border-white/20" />

            {/* Content */}
            <motion.div
              className="relative z-10 flex flex-col items-start gap-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold tracking-[0.2em] text-white sm:text-7xl"
                style={{ fontFamily: "serif" }}>
                BI
              </h1>
              <div className="h-px w-16 bg-white/30" />
            </motion.div>

            {/* Glow */}
            <div className="absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
          </motion.div>

          {/* Center seam line */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/20"
            animate={phase === "opening" ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Center click prompt */}
          <AnimatePresence>
            {phase === "enter" && (
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.8 }}
              >
                {/* Pulsing ring */}
                <motion.div
                  className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/30"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white/10"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  {/* Arrow right + left */}
                  <div className="flex items-center gap-1">
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="white" opacity="0.6">
                      <path d="M8 6L0 0v12z" />
                    </svg>
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="white" opacity="0.6" style={{ transform: "scaleX(-1)" }}>
                      <path d="M8 6L0 0v12z" />
                    </svg>
                  </div>
                </motion.div>

                <motion.span
                  className="text-[10px] uppercase tracking-[0.4em] text-white/30"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
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