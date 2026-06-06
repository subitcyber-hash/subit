"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LOGO_LETTERS = ["𝔖", "𝔘", "𝔅", "ℑ", "𝔗"]

export function LoadingScreen() {
  const [stage, setStage] = useState<"video" | "reveal" | "exit" | "done">("video")
  const [videoOpacity, setVideoOpacity] = useState(1)

  useEffect(() => {
    // Fade video at 2.2s
    const t1 = setTimeout(() => setVideoOpacity(0), 2200)
    // Gothic reveal at 2.9s
    const t2 = setTimeout(() => setStage("reveal"), 2900)
    // Start exit at 4.8s
    const t3 = setTimeout(() => setStage("exit"), 4800)
    // Unmount at 6s
    const t4 = setTimeout(() => setStage("done"), 6000)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  if (stage === "done") return null

  return (
    <div className="fixed inset-0 z-[999] bg-black overflow-hidden">

      {/* ── VIDEO ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ opacity: videoOpacity, transition: "opacity 0.7s ease-in-out" }}
      >
        <video
          src="/lock.webm"
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>

      {/* ── GOTHIC REVEAL ── */}
      <AnimatePresence>
        {(stage === "reveal" || stage === "exit") && (
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
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
                    textShadow: "0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.15)",
                  }}
                  initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                  animate={stage === "exit"
                    ? { opacity: 0, scale: 1.4, filter: "blur(20px)", y: -30 }
                    : { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
                  }
                  transition={stage === "exit"
                    ? { delay: i * 0.05, duration: 0.7, ease: "easeIn" }
                    : { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                  }
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              className="mt-4 text-white/40 uppercase tracking-[0.5em] text-xs font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={stage === "exit" ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
              transition={stage === "exit"
                ? { duration: 0.5, ease: "easeIn" }
                : { delay: 0.5, duration: 0.6 }
              }
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
                animate={stage === "exit" ? { width: 0, opacity: 0 } : { width: "35vw" }}
                transition={{ delay: stage === "exit" ? 0 : 0.3, duration: 0.7, ease: "easeOut" }}
              />
              <div className="mx-4 h-1 w-1 rounded-full bg-white/20" />
              <motion.div
                className="h-px bg-white/15"
                initial={{ width: 0 }}
                animate={stage === "exit" ? { width: 0, opacity: 0 } : { width: "35vw" }}
                transition={{ delay: stage === "exit" ? 0 : 0.3, duration: 0.7, ease: "easeOut" }}
              />
            </motion.div>
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
            transition={{ duration: 1.0, ease: "easeInOut", delay: 0.4 }}
          />
        )}
      </AnimatePresence>

    </div>
  )
}