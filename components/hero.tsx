"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Instagram, Facebook, ChevronDown } from "lucide-react"

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

const socialLinks = [
  { icon: Instagram,    href: "https://instagram.com/hexed.subit", label: "Instagram" },
  { icon: WhatsAppIcon, href: "https://wa.me/your_number",         label: "WhatsApp" },
]

const PARTICLES = [
  { x: 120,  y: 340, drift: -80,  duration: 6.2,  size: 2, opacity: 0.4 },
  { x: 340,  y: 120, drift: -140, duration: 8.1,  size: 1, opacity: 0.3 },
  { x: 560,  y: 480, drift: -60,  duration: 5.4,  size: 3, opacity: 0.5 },
  { x: 780,  y: 200, drift: -180, duration: 9.0,  size: 1, opacity: 0.2 },
  { x: 200,  y: 600, drift: -100, duration: 7.3,  size: 2, opacity: 0.4 },
  { x: 900,  y: 350, drift: -120, duration: 6.8,  size: 1, opacity: 0.3 },
  { x: 450,  y: 720, drift: -90,  duration: 8.5,  size: 2, opacity: 0.5 },
  { x: 670,  y: 150, drift: -160, duration: 5.9,  size: 3, opacity: 0.3 },
  { x: 310,  y: 420, drift: -70,  duration: 7.1,  size: 1, opacity: 0.4 },
  { x: 1050, y: 550, drift: -110, duration: 6.4,  size: 2, opacity: 0.3 },
  { x: 180,  y: 260, drift: -130, duration: 9.2,  size: 1, opacity: 0.5 },
  { x: 820,  y: 430, drift: -85,  duration: 5.7,  size: 3, opacity: 0.2 },
  { x: 500,  y: 310, drift: -150, duration: 8.8,  size: 2, opacity: 0.4 },
  { x: 740,  y: 640, drift: -65,  duration: 6.0,  size: 1, opacity: 0.3 },
  { x: 90,   y: 510, drift: -195, duration: 7.6,  size: 2, opacity: 0.5 },
  { x: 1100, y: 220, drift: -75,  duration: 5.3,  size: 1, opacity: 0.3 },
  { x: 620,  y: 580, drift: -105, duration: 8.3,  size: 3, opacity: 0.4 },
  { x: 260,  y: 170, drift: -145, duration: 9.5,  size: 1, opacity: 0.2 },
  { x: 970,  y: 680, drift: -55,  duration: 6.7,  size: 2, opacity: 0.4 },
  { x: 420,  y: 390, drift: -125, duration: 7.9,  size: 1, opacity: 0.3 },
  { x: 150,  y: 450, drift: -95,  duration: 8.0,  size: 2, opacity: 0.5 },
  { x: 850,  y: 280, drift: -170, duration: 7.4,  size: 1, opacity: 0.3 },
  { x: 380,  y: 550, drift: -85,  duration: 6.1,  size: 3, opacity: 0.4 },
  { x: 700,  y: 400, drift: -115, duration: 9.3,  size: 1, opacity: 0.2 },
  { x: 1000, y: 150, drift: -135, duration: 5.8,  size: 2, opacity: 0.4 },
]

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* ── Background Layer ── */}
      <div className="absolute inset-0">

        {/* Image fallback (mobile) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(4px) brightness(0.35)",
            transform: "scale(1.08)",
          }}
        />

        {/* Video with slow drift movement */}
        <motion.div
          className="absolute inset-0 hidden sm:block"
          animate={{ scale: [1.05, 1.12, 1.05], x: [0, 10, 0], y: [0, -8, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            style={{ filter: "blur(3px) brightness(0.35)" }}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Base dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        {/* ── Animated Glow Orbs ── */}
        <motion.div
          className="absolute -left-60 -top-60 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, 30, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-60 -right-60 h-[600px] w-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0], y: [0, -20, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Center pulse glow behind title */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Top-right warm glow */}
        <motion.div
          className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* ── Floating Particles ── */}
        {mounted && PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ width: p.size, height: p.size, left: p.x, top: p.y }}
            animate={{
              y: [p.y, p.y + p.drift, p.y],
              x: [p.x, p.x + (i % 2 === 0 ? 20 : -20), p.x],
              opacity: [0, p.opacity, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          />
        ))}

        {/* Cinematic scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">

        {/* Eyebrow tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <span className="glass-light rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
            Creator · Artist · Meme Lord
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 text-7xl font-bold tracking-tighter text-foreground sm:text-8xl md:text-9xl"
          style={{ textShadow: "0 0 80px rgba(255,255,255,0.3), 0 0 160px rgba(255,255,255,0.1)" }}
        >
          SUBI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mb-10 text-lg text-white/50 sm:text-xl md:text-2xl"
        >
          One Piece • Vinland Saga • Death Note
        </motion.p>

        {/* Social CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {socialLinks.map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-light flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
              whileHover={{ scale: 1.08, y: -3, boxShadow: "0 8px 30px rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <social.icon size={18} />
              {social.label}
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
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