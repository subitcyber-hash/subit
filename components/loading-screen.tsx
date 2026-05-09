"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"counting" | "reveal" | "done">("counting")

  useEffect(() => {
    // Progress counter
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setPhase("reveal")
          setTimeout(() => setLoading(false), 1200)
          return 100
        }
        return prev + Math.random() * 8 + 2
      })
    }, 60)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Radial glow */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 60%)" }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-8">

            {/* Logo reveal */}
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.h1
                className="text-6xl font-bold tracking-[0.3em] text-white sm:text-8xl"
                style={{ fontFamily: "serif" }}
                initial={{ y: 80, opacity: 0 }}
                animate={phase === "reveal"
                  ? { y: 0, opacity: 1, scale: [1, 1.05, 1], filter: ["blur(0px)", "blur(4px)", "blur(0px)"] }
                  : { y: 0, opacity: 1 }
                }
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                SUBI
              </motion.h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-xs uppercase tracking-[0.5em] text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Creator · Artist · Meme Lord
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative h-px w-48 bg-white/10 overflow-hidden sm:w-64">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-white"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ ease: "linear" }}
                />
                {/* Shimmer */}
                <motion.div
                  className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{ left: ["-10%", "110%"] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Counter */}
              <span className="font-mono text-xs text-white/30">
                {Math.min(Math.floor(progress), 100).toString().padStart(3, "0")}%
              </span>
            </motion.div>

            {/* Glitch lines on reveal */}
            <AnimatePresence>
              {phase === "reveal" && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute left-0 right-0 bg-white/5"
                      style={{ top: `${20 + i * 30}%`, height: Math.random() * 3 + 1 }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Corner decorations */}
          {[
            "top-6 left-6 border-t border-l",
            "top-6 right-6 border-t border-r",
            "bottom-6 left-6 border-b border-l",
            "bottom-6 right-6 border-b border-r",
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute h-6 w-6 border-white/20 ${cls}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            />
          ))}

          {/* Bottom status */}
          <motion.div
            className="absolute bottom-8 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/20">
              {phase === "reveal" ? "Welcome" : "Loading..."}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}