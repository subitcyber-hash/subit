"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gamepad2, Palette, Trophy, Shield, Video, Smartphone, Layout, Code2, Layers, Instagram } from "lucide-react"
import Image from "next/image"
import { AgeCounter } from "@/components/age-counter"

const stats = [
  { label: "Born", value: "2008" },
  { label: "Birthday", value: "May 27" },
  { label: "Class", value: "HSC" },
]

const milestones = [
  { value: "22+", label: "Posts Created" },
  { value: "157+", label: "Followers" },
  { value: "2026", label: "Started Creating" },
  { value: "6+", label: "Platforms" },
]

const personalSkills = [
  { icon: Gamepad2, label: "Favorite Games", description: "COD • Minecraft • Elden Ring" },
  { icon: Palette, label: "Favorite Colors", description: "Black • White • Blue" },
  { icon: Trophy, label: "Football Team", description: "Argentina" },
  { icon: Shield, label: "Football Club", description: "Barcelona" },
]

const tools = [
  { icon: Video,      label: "CapCut",       description: "Video editing" },
  { icon: Smartphone, label: "Alight Motion", description: "Motion graphics" },
  { icon: Layout,     label: "Canva",         description: "Design & graphics" },
  { icon: Code2,      label: "VS Code",       description: "Code editor" },
  { icon: Layers,     label: "Next.js",       description: "Web development" },
]

const timeline = [
  { year: "2008", title: "Born in Barishal", desc: "Bangladesh 🇧🇩" },
  { year: "2024", title: "Started making memes", desc: "Posted first content on Instagram & TikTok" },
  { year: "2025", title: "Went deeper into art", desc: "Started exploring aesthetic & anime content" },
  { year: "2026", title: "Built subit.site", desc: "Launched personal portfolio from scratch" },
]

// ── Flip Card ────────────────────────────────────────────
function FlipCard() {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="relative aspect-square max-w-md w-full cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front — profile.jpg */}
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src="/profile 1.webp"
            alt="SUBIT"
            fill
            className="object-cover object-top"
            style={{ mixBlendMode: "luminosity" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          {/* Tap hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] text-white/60 uppercase tracking-widest">Tap to flip</span>
          </div>
        </div>

        {/* Back — profile2.jpg */}
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Image
            src="/profile 2.webp"
            alt="SUBIT 2"
            fill
            className="object-cover object-top"
            style={{ mixBlendMode: "luminosity" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] text-white/60 uppercase tracking-widest">Tap to flip</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── Left Column ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            {/* Flip Card */}
            <FlipCard />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-light rounded-2xl p-4 text-center">
                <AgeCounter />
              </div>
              {stats.map((stat) => (
                <div key={stat.label} className="glass-light rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Milestones */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Milestones
              </p>
              <div className="grid grid-cols-4 gap-3">
                {milestones.map((m) => (
                  <div key={m.label} className="glass-light rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-foreground">{m.value}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right Column ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center gap-8"
          >
            {/* Bio */}
            <div>
              <span className="mb-4 block text-sm font-medium uppercase tracking-widest text-muted-foreground">
                About Me
              </span>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Memes, Art &
                <br />
                <span className="text-glow">Chill Guy</span>
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                I&apos;m SUBIT — a 17-year-old meme creator and aspiring artist from Barishal, Bangladesh.
                I make aesthetic, chill content that hits different. What started as posting
                memes on TikTok and Instagram turned into a whole creative journey I never want to stop.
                I also build things on the web — this site was built by me from scratch.
              </p>
            </div>

            {/* Timeline */}
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Journey
              </p>
              <div className="relative flex flex-col gap-4 border-l border-foreground/10 pl-5">
                {timeline.map((item) => (
                  <div key={item.year} className="relative">
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-foreground/30 ring-2 ring-background" />
                    <span className="text-xs font-mono text-muted-foreground/60">{item.year}</span>
                    <p className="font-semibold text-foreground text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Tools I Use
              </p>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <div
                    key={tool.label}
                    className="glass-light flex items-center gap-2 rounded-full px-3 py-1.5 transition-transform hover:scale-105"
                  >
                    <tool.icon size={13} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{tool.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal skills */}
            <div className="grid gap-3 sm:grid-cols-2">
              {personalSkills.map((skill) => (
                <div
                  key={skill.label}
                  className="glass-light group flex items-start gap-4 rounded-xl p-4 transition-transform hover:scale-[1.02]"
                >
                  <div className="rounded-lg bg-foreground/5 p-2 transition-colors group-hover:bg-foreground/10">
                    <skill.icon size={20} className="text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{skill.label}</h3>
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Collab button */}
            <a
              href="https://ig.me/m/hexed.subit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 px-5 py-4 transition-all hover:border-foreground/20 hover:bg-foreground/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Looking For Bf</p>
                  <p className="text-xs text-muted-foreground">Slide into my DMs</p>
                </div>
              </div>
              <Instagram size={18} className="text-muted-foreground shrink-0" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}