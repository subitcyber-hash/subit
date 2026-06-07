"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LOGO_LETTERS = ["𝔖", "𝔘", "𝔅", "ℑ", "𝔗"]

export function LoadingScreen() {
  const [stage, setStage] = useState<"video" | "reveal" | "exit" | "done">("video")
  const [videoOpacity, setVideoOpacity] = useState(1)

  useEffect(() => {
    const t1 = setTimeout(() => setVideoOpacity(0), 2200)
    const t2 = setTimeout(() => setStage("reveal"), 2900)
    const t3 = setTimeout(() => setStage("exit"), 4800)
    const t4 = setTimeout(() => setStage("done"), 5800)
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
          src="/lock.mp4"
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
            transition={{ duration: 0.3 }}
          >
            {/* Letters — NO blur, just y + opacity + scale */}
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
              transition={stage === "exit"
                ? { duration: 0.3 }
                : { delay: 0.4, duration: 0.5 }
              }
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

    </div>
  )
}