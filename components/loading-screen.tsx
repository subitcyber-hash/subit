"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 4,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "rgba(0,200,255,0.6)",
            boxShadow: "0 0 4px rgba(0,200,255,0.8)",
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -30, -60],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [scanY, setScanY] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(current + Math.random() * 4 + 1, 100)
      setProgress(Math.floor(current))
      if (current >= 100) {
        clearInterval(interval)
        setTimeout(() => setDone(true), 1000)
      }
    }, 70)
    return () => clearInterval(interval)
  }, [])

  // Scan line animation
  useEffect(() => {
    let frame: number
    let y = 0
    const animate = () => {
      y = (y + 0.8) % 100
      setScanY(y)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
          style={{ background: "#000508" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          {/* Floating particles */}
          <Particles />

          {/* Background radial glow */}
          <div
            className="absolute"
            style={{
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,150,255,0.04) 0%, transparent 70%)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />

          {/* HUD corner brackets — top left */}
          {[
            { top: 24, left: 24, rotate: 0 },
            { top: 24, right: 24, rotate: 90 },
            { bottom: 24, left: 24, rotate: 270 },
            { bottom: 24, right: 24, rotate: 180 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ ...pos, width: 32, height: 32 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32">
                <path
                  d="M0 16 L0 0 L16 0"
                  fill="none"
                  stroke="rgba(0,200,255,0.5)"
                  strokeWidth="1.5"
                  transform={`rotate(${pos.rotate}, 16, 16)`}
                />
              </svg>
            </motion.div>
          ))}

          {/* Main orb group */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{ width: 300, height: 300 }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* SVG rings + arcs */}
            <svg className="absolute inset-0" width="300" height="300" viewBox="0 0 300 300">
              <defs>
                <filter id="neon" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3" result="b1"/>
                  <feGaussianBlur stdDeviation="8" result="b2"/>
                  <feGaussianBlur stdDeviation="16" result="b3"/>
                  <feMerge>
                    <feMergeNode in="b3"/>
                    <feMergeNode in="b2"/>
                    <feMergeNode in="b1"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="softglow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="b"/>
                  <feMerge>
                    <feMergeNode in="b"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <radialGradient id="sphereGrad" cx="38%" cy="35%">
                  <stop offset="0%" stopColor="#0a1f3a"/>
                  <stop offset="100%" stopColor="#010508"/>
                </radialGradient>
              </defs>

              {/* Dark sphere */}
              <circle cx="150" cy="150" r="90" fill="url(#sphereGrad)" />
              <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(0,180,255,0.08)" strokeWidth="1"/>
              {/* Sphere shine */}
              <ellipse cx="125" cy="120" rx="25" ry="15" fill="rgba(0,200,255,0.06)" style={{ filter: "blur(8px)" }}/>

              {/* Outer static ring */}
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(0,150,255,0.15)" strokeWidth="1" strokeDasharray="4 8"/>

              {/* Progress ring */}
              <circle
                cx="150" cy="150" r="118"
                fill="none"
                stroke="rgba(0,200,255,0.25)"
                strokeWidth="1"
                strokeDasharray={`${(progress / 100) * 741} 741`}
                strokeLinecap="round"
                transform="rotate(-90 150 150)"
                filter="url(#softglow)"
              />

              {/* Rotating main arc */}
              <motion.circle
                cx="150" cy="150" r="110"
                fill="none"
                stroke="rgba(0,210,255,0.9)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="120 572"
                filter="url(#neon)"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "150px 150px" }}
              />

              {/* Counter-rotating arc */}
              <motion.circle
                cx="150" cy="150" r="100"
                fill="none"
                stroke="rgba(0,180,255,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="60 569"
                filter="url(#softglow)"
                animate={{ rotate: -360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "150px 150px" }}
              />

              {/* Bright spark dot */}
              <motion.circle
                cx="150" cy="150" r="110"
                fill="none"
                stroke="rgba(180,240,255,1)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="4 688"
                filter="url(#neon)"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "150px 150px" }}
              />

              {/* Second spark */}
              <motion.circle
                cx="150" cy="150" r="100"
                fill="none"
                stroke="rgba(200,245,255,1)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="4 625"
                filter="url(#neon)"
                animate={{ rotate: -360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "150px 150px" }}
              />

              {/* HUD tick marks */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24
                const rad = (angle * Math.PI) / 180
                const r1 = 133, r2 = i % 6 === 0 ? 125 : 129
                return (
                  <line
                    key={i}
                    x1={150 + r1 * Math.cos(rad)}
                    y1={150 + r1 * Math.sin(rad)}
                    x2={150 + r2 * Math.cos(rad)}
                    y2={150 + r2 * Math.sin(rad)}
                    stroke="rgba(0,200,255,0.3)"
                    strokeWidth={i % 6 === 0 ? 1.5 : 0.8}
                  />
                )
              })}
            </svg>

            {/* Scan line inside sphere */}
            <div
              className="absolute overflow-hidden rounded-full"
              style={{ width: 180, height: 180, left: 60, top: 60 }}
            >
              <motion.div
                className="absolute left-0 right-0"
                style={{
                  height: 1,
                  background: "linear-gradient(to right, transparent, rgba(0,220,255,0.6), transparent)",
                  boxShadow: "0 0 8px rgba(0,200,255,0.6)",
                  top: `${scanY}%`,
                }}
              />
              <div
                className="absolute left-0 right-0"
                style={{
                  height: 40,
                  background: `linear-gradient(to bottom, transparent, rgba(0,180,255,0.04), transparent)`,
                  top: `calc(${scanY}% - 20px)`,
                }}
              />
            </div>

            {/* Center text */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              {/* HUD brackets around SUBIT */}
              <div className="relative px-4 py-2">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400/60" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-400/60" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-400/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400/60" />

                <motion.span
                  className="block text-2xl font-bold tracking-[0.4em] text-white"
                  style={{
                    textShadow: "0 0 10px rgba(0,200,255,0.8), 0 0 30px rgba(0,150,255,0.4)",
                    fontFamily: "monospace",
                  }}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  SUBIT
                </motion.span>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-cyan-400/30" />
                <span
                  className="text-xs font-mono text-cyan-400/70 tabular-nums"
                  style={{ textShadow: "0 0 8px rgba(0,200,255,0.5)" }}
                >
                  {String(progress).padStart(3, "0")}%
                </span>
                <div className="h-px w-8 bg-cyan-400/30" />
              </div>
            </div>
          </motion.div>

          {/* Bottom HUD bar */}
          <motion.div
            className="absolute bottom-10 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400/30" />
              <motion.span
                className="text-[9px] uppercase tracking-[0.5em] text-cyan-400/40 font-mono"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                INITIALIZING SYSTEM
              </motion.span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400/30" />
            </div>
            {/* Mini progress bar */}
            <div className="h-px w-48 bg-white/5 overflow-hidden rounded-full">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(to right, rgba(0,150,255,0.6), rgba(0,220,255,0.9))",
                  boxShadow: "0 0 6px rgba(0,200,255,0.6)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}