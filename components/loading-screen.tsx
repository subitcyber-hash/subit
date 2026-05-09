"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(current + Math.random() * 5 + 1.5, 100)
      setProgress(Math.floor(current))
      if (current >= 100) {
        clearInterval(interval)
        setTimeout(() => setDone(true), 900)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Orb container */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{ width: 280, height: 280 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Dark sphere core */}
            <div
              className="absolute rounded-full"
              style={{
                width: 180,
                height: 180,
                background: "radial-gradient(circle at 35% 35%, #0a1628, #020408)",
                boxShadow: "inset 0 0 40px rgba(0,180,255,0.08), 0 0 60px rgba(0,150,255,0.05)",
              }}
            />

            {/* Inner glow on sphere */}
            <div
              className="absolute rounded-full"
              style={{
                width: 180,
                height: 180,
                background: "radial-gradient(circle at 30% 30%, rgba(0,200,255,0.12), transparent 60%)",
              }}
            />

            {/* SVG arcs */}
            <svg
              className="absolute inset-0"
              width="280"
              height="280"
              viewBox="0 0 280 280"
            >
              <defs>
                {/* Blue glow filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur1"/>
                  <feGaussianBlur stdDeviation="6" result="blur2"/>
                  <feMerge>
                    <feMergeNode in="blur2"/>
                    <feMergeNode in="blur1"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Outer rotating arc 1 */}
              <motion.ellipse
                cx="140" cy="140" rx="125" ry="50"
                fill="none"
                stroke="rgba(0,200,255,0.9)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="200 600"
                filter="url(#glow)"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "140px 140px" }}
              />

              {/* Outer rotating arc 2 — offset */}
              <motion.ellipse
                cx="140" cy="140" rx="125" ry="50"
                fill="none"
                stroke="rgba(0,180,255,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="100 700"
                filter="url(#glow2)"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: -1.5 }}
                style={{ transformOrigin: "140px 140px" }}
              />

              {/* Tilted arc 1 */}
              <motion.ellipse
                cx="140" cy="140" rx="115" ry="45"
                fill="none"
                stroke="rgba(0,220,255,0.8)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="180 600"
                filter="url(#glow)"
                animate={{ rotate: -360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "140px 140px", transform: "rotateX(60deg) rotateZ(0deg)" }}
              />

              {/* Tilted arc 2 */}
              <motion.ellipse
                cx="140" cy="140" rx="110" ry="42"
                fill="none"
                stroke="rgba(30,180,255,0.6)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="120 650"
                filter="url(#glow2)"
                animate={{ rotate: -360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: -1.2 }}
                style={{ transformOrigin: "140px 140px", transform: "rotateX(60deg) rotateZ(0deg)" }}
              />

              {/* Vertical arc */}
              <motion.ellipse
                cx="140" cy="140" rx="42" ry="120"
                fill="none"
                stroke="rgba(0,210,255,0.7)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="150 600"
                filter="url(#glow)"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "140px 140px" }}
              />

              {/* Diagonal arc */}
              <motion.ellipse
                cx="140" cy="140" rx="120" ry="45"
                fill="none"
                stroke="rgba(0,190,255,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="90 700"
                filter="url(#glow2)"
                animate={{ rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: -2 }}
                style={{ transformOrigin: "140px 140px", transform: "rotate(45deg)" }}
              />

              {/* Bright spark on arc 1 */}
              <motion.ellipse
                cx="140" cy="140" rx="125" ry="50"
                fill="none"
                stroke="rgba(180,240,255,1)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 792"
                filter="url(#glow)"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "140px 140px" }}
              />

              {/* Bright spark on tilted arc */}
              <motion.ellipse
                cx="140" cy="140" rx="115" ry="45"
                fill="none"
                stroke="rgba(200,245,255,1)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 750"
                filter="url(#glow)"
                animate={{ rotate: -360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "140px 140px", transform: "rotateX(60deg)" }}
              />
            </svg>

            {/* Outer ambient glow */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 280,
                height: 280,
                background: "radial-gradient(circle, rgba(0,180,255,0.08) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Center text */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <span
                className="font-bold text-white tabular-nums"
                style={{
                  fontSize: 36,
                  lineHeight: 1,
                  textShadow: "0 0 20px rgba(0,200,255,0.6), 0 0 40px rgba(0,150,255,0.3)",
                  letterSpacing: "-1px",
                }}
              >
                {progress}%
              </span>
              <motion.span
                className="text-[9px] uppercase tracking-[0.4em] text-cyan-400/60"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading
              </motion.span>
            </div>
          </motion.div>

          {/* SUBIT below */}
          <motion.p
            className="mt-10 text-xs uppercase tracking-[0.6em] text-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            SUBIT
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}