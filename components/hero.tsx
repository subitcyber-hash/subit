"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, ChevronDown, X } from "lucide-react"
import { useTypingAnimation } from "@/hooks/use-typing"

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

const igAccounts = [
  { handle: "@hexed.subit", label: "Main", desc: "Memes · Art · Vibes", href: "https://instagram.com/hexed.subit" },
  { handle: "@w0xxi3", label: "2nd", desc: "Content · TikTok crosspost", href: "https://instagram.com/w0xxi3" },
]

// Reduced to 6 particles
const PARTICLES = [
  { x: 120, y: 340, drift: -80,  duration: 6.2, size: 2, opacity: 0.4 },
  { x: 560, y: 480, drift: -60,  duration: 5.4, size: 3, opacity: 0.5 },
  { x: 200, y: 600, drift: -100, duration: 7.3, size: 2, opacity: 0.4 },
  { x: 670, y: 150, drift: -160, duration: 5.9, size: 3, opacity: 0.3 },
  { x: 180, y: 260, drift: -130, duration: 9.2, size: 1, opacity: 0.5 },
  { x: 820, y: 430, drift: -85,  duration: 5.7, size: 3, opacity: 0.2 },
]

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const [showIgPopup, setShowIgPopup] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const typedText = useTypingAnimation()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!showIgPopup) return
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) setShowIgPopup(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showIgPopup])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setShowIgPopup(false) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0">

        {/* Static image — always shown */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero-bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(4px) brightness(0.35)",
            transform: "scale(1.08)",
          }}
        />

        {/* Video — no drift animation, just static */}
        <div className="absolute inset-0 hidden sm:block">
          <video
            autoPlay loop muted playsInline preload="none"
            className="h-full w-full object-cover"
            style={{ filter: "blur(3px) brightness(0.35)" }}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        {/* 2 static glow orbs instead of 4 animated — massive perf win */}
        <div
          className="absolute -left-60 -top-60 h-[500px] w-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-60 -right-60 h-[600px] w-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)" }}
        />
        {/* One subtle center pulse — only 1 animated orb */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)", willChange: "transform, opacity" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 6 particles only after mount */}
        {mounted && PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{ width: p.size, height: p.size, left: p.x, top: p.y, willChange: "transform, opacity" }}
            animate={{ y: [p.y, p.y + p.drift, p.y], opacity: [0, p.opacity, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          />
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <span className="glass-light rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
            Creator · Artist · Meme Lord
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 text-7xl font-bold tracking-tighter text-foreground sm:text-8xl md:text-9xl"
          style={{ textShadow: "0 0 60px rgba(255,255,255,0.25)" }}
        >
          𝔖𝔘𝔅ℑ𝔗
        </motion.h1>

        <p className="mb-10 text-lg text-white/50">
          {typedText}<span className="animate-pulse">|</span>
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Instagram popup */}
          <div className="relative" ref={popupRef}>
            <motion.button
              onClick={() => setShowIgPopup(p => !p)}
              className="glass-light flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-md transition-colors duration-100 hover:bg-white/10 hover:text-white"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram size={18} />
              Instagram
            </motion.button>

            <AnimatePresence>
              {showIgPopup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 rounded-2xl p-3 z-50"
                  style={{
                    background: "rgba(15,15,15,0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Choose account</p>
                    <button onClick={() => setShowIgPopup(false)} className="text-white/40 hover:text-white/70 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {igAccounts.map((acc) => (
                      <a
                        key={acc.handle}
                        href={acc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/8"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                        onClick={() => setShowIgPopup(false)}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
                          <Instagram size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{acc.handle}</p>
                          <p className="text-[10px] text-white/40 truncate">{acc.desc}</p>
                        </div>
                        <span className="text-[10px] font-medium text-white/30 shrink-0 rounded-full border border-white/10 px-2 py-0.5">
                          {acc.label}
                        </span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/8801732875763"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-light flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-md transition-colors duration-100 hover:bg-white/10 hover:text-white"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#about"
          className="flex flex-col items-center gap-2 text-white/40 transition-colors hover:text-white/70"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={20} />
        </motion.a>
      </motion.div>
    </section>
  )
}