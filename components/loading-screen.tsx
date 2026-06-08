"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LOGO_LETTERS = ["𝔖", "𝔘", "𝔅", "ℑ", "𝔗"]

// Ripple rings — pure CSS, no video, no lag
const RIPPLES = [
  { size: 120, delay: "0s",    duration: "2.4s" },
  { size: 220, delay: "0.4s",  duration: "2.4s" },
  { size: 340, delay: "0.8s",  duration: "2.4s" },
  { size: 480, delay: "1.2s",  duration: "2.4s" },
  { size: 640, delay: "1.6s",  duration: "2.4s" },
]

export function LoadingScreen() {
  const [stage, setStage] = useState<"ripple" | "reveal" | "exit" | "done">("ripple")

  useEffect(() => {
    // Ripple plays for 2.5s then gothic reveal
    const t1 = setTimeout(() => setStage("reveal"), 2500)
    // Exit at 4.2s
    const t2 = setTimeout(() => setStage("exit"), 4200)
    // Done at 5.2s
    const t3 = setTimeout(() => setStage("done"), 5200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (stage === "done") return null

  return (
    <div className="fixed inset-0 z-[999] bg-black overflow-hidden flex items-center justify-center">

      {/* ── RIPPLE ANIMATION ── */}
      <AnimatePresence>
        {stage === "ripple" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Center glow dot */}
            <div
              className="absolute rounded-full bg-white"
              style={{
                width: 8,
                height: 8,
                boxShadow: "0 0 20px 6px rgba(255,255,255,0.6)",
              }}
            />

            {/* Ripple rings */}
            {RIPPLES.map((r, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/30"
                style={{
                  width: r.size,
                  height: r.size,
                  animation: `ripple ${r.duration} ${r.delay} ease-out infinite`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GOTHIC REVEAL ── */}
      <AnimatePresence>
        {(stage === "reveal" || stage === "exit") && (
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Letters */}
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
                    textShadow: "0 0 40px rgba(255,255,255,0.4)",
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={stage === "exit"
                    ? { opacity: 0, scale: 1.3, y: -20 }
                    : { opacity: 1, y: 0, scale: 1 }
                  }
                  transition={stage === "exit"
                    ? { delay: i * 0.04, duration: 0.5, ease: "easeIn" }
                    : { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                  }
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              className="mt-4 text-white/40 uppercase tracking-[0.5em] text-xs font-light"
              initial={{ opacity: 0, y: 8 }}
              animate={stage === "exit" ? { opacity: 0 } : { opacity: 1, y: 0 }}
              transition={stage === "exit" ? { duration: 0.3 } : { delay: 0.4, duration: 0.5 }}
            >
              Creator · Artist · Meme Lord
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FINAL BLACK FADE ── */}
      <AnimatePresence>
        {stage === "exit" && (
          <motion.div
            className="absolute inset-0 z-30 bg-black pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut", delay: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Ripple keyframe CSS */}
      <style>{`
        @keyframes ripple {
          0%   { transform: scale(0.3); opacity: 0.8; }
          100% { transform: scale(1);   opacity: 0; }
        }
      `}</style>
    </div>
  )
}