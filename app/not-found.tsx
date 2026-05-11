"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

const PARTICLES = [
  { x: 10, y: 20, s: 1.5, d: 6.0, delay: 0.0 },
  { x: 25, y: 70, s: 1.0, d: 7.5, delay: 0.8 },
  { x: 40, y: 40, s: 1.8, d: 5.2, delay: 1.5 },
  { x: 60, y: 85, s: 1.2, d: 6.8, delay: 0.3 },
  { x: 75, y: 15, s: 1.0, d: 5.9, delay: 2.1 },
  { x: 88, y: 55, s: 1.6, d: 7.1, delay: 0.6 },
  { x: 92, y: 30, s: 1.1, d: 4.8, delay: 1.2 },
  { x: 5,  y: 60, s: 1.4, d: 6.3, delay: 1.9 },
  { x: 50, y: 10, s: 1.0, d: 5.5, delay: 0.4 },
  { x: 33, y: 90, s: 1.3, d: 7.2, delay: 1.7 },
]

const GLITCH_TEXTS = ["404", "4Ø4", "𝟜𝟘𝟜", "404", "ᗐᗜᗐ"]

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-6">

      {/* Grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06] pointer-events-none">
        <filter id="grain404">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain404)"/>
      </svg>

      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 65%)",
          left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{ opacity: [0, 0.35, 0], y: [0, -50] }}
          transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">

        {/* Glitchy 404 */}
        <motion.div
          className="relative mb-2 select-none"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Shadow layers for glitch */}
          <span
            className="absolute inset-0 text-[clamp(100px,20vw,180px)] font-black text-white/5 blur-sm select-none"
            aria-hidden
            style={{ transform: "translate(-3px, 2px)" }}
          >
            404
          </span>
          <span
            className="absolute inset-0 text-[clamp(100px,20vw,180px)] font-black text-white/5 blur-sm select-none"
            aria-hidden
            style={{ transform: "translate(3px, -2px)" }}
          >
            404
          </span>

          {/* Main 404 with flicker */}
          <motion.span
            className="relative block text-[clamp(100px,20vw,180px)] font-black text-white leading-none"
            style={{
              textShadow: "0 0 40px rgba(255,255,255,0.15), 0 0 80px rgba(255,255,255,0.05)",
              fontFamily: "var(--font-geist-sans), sans-serif",
            }}
            animate={{ opacity: [1, 1, 0.85, 1, 1, 0.9, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.42, 0.44, 0.7, 0.72, 1] }}
          >
            404
          </motion.span>
        </motion.div>

        {/* Gothic subtitle */}
        <motion.p
          className="mb-2 text-white/20 uppercase tracking-[0.4em] text-xs font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Page Not Found
        </motion.p>

        {/* Divider */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="h-px w-16 bg-white/10" />
          <div className="h-1 w-1 rounded-full bg-white/20" />
          <div className="h-px w-16 bg-white/10" />
        </motion.div>

        {/* Funny meme text */}
        <motion.div
          className="mb-3 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            bro where are you even going
          </h1>
          <p className="text-white/50 text-sm sm:text-base leading-relaxed">
            this page doesn't exist. never did. you manifested a 404.
            <br />
            very on brand of you honestly.
          </p>
        </motion.div>

        {/* Secondary funny line */}
        <motion.p
          className="mb-10 text-white/25 text-xs italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          — subit, probably asleep rn
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black cursor-pointer transition-all"
            >
              <Home size={16} />
              take me home
            </motion.div>
          </Link>

          <Link href="/#content">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/70 cursor-pointer hover:border-white/30 hover:text-white transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
              }}
            >
              <ArrowLeft size={16} />
              see the memes
            </motion.div>
          </Link>
        </motion.div>

        {/* Tiny footer note */}
        <motion.p
          className="mt-12 text-white/15 text-[10px] uppercase tracking-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          𝔖𝔘𝔅ℑ𝔗 · been on that peaceful shi
        </motion.p>
      </div>
    </div>
  )
}
