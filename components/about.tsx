"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gamepad2, Palette, Trophy, Shield, Video, Smartphone, Layout, Code2, Layers } from "lucide-react"
import Image from "next/image"
import { AgeCounter } from "@/components/age-counter"

const stats = [
  { label: "Born", value: "2008" },
  { label: "Birthday", value: "May 27" },
  { label: "Class", value: "HSC" },
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

// ── Flip Card ────────────────────────────────────────────
const FLIP_FACES = [
  { src: "/luffy.webp", alt: "Luffy" },
  { src: "/eren.webp", alt: "Eren" },
]

function FlipHint() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/55 px-3.5 py-1.5">
      <span className="text-[10px] uppercase tracking-widest text-white/80">Tap to flip</span>
    </div>
  )
}

function FlipCard() {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.button
      type="button"
      aria-label="Flip profile card"
      aria-pressed={flipped}
      onClick={() => setFlipped(f => !f)}
      className="relative block aspect-square w-full cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-site-accent/60"
      style={{ perspective: "1200px", WebkitTapHighlightColor: "transparent" }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {FLIP_FACES.map((face, i) => (
          <div
            key={face.src}
            className="absolute inset-0 rounded-3xl ring-1 ring-white/10"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: i === 1 ? "rotateY(180deg)" : undefined,
            }}
          >
            <Image
              src={face.src}
              alt={face.alt}
              fill
              sizes="(min-width: 1024px) 576px, 100vw"
              className="rounded-3xl object-cover object-center"
              priority
              draggable={false}
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <FlipHint />
          </div>
        ))}
      </motion.div>
    </motion.button>
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
                <span className="text-glow">Hey, I&apos;m Subit.</span>
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  I&apos;m just a guy trying to figure life out, build cool things, and become someone
                  I&apos;m proud of. I&apos;m into technology, web design, and exploring what the internet
                  has to offer. I like creating things that reflect my own taste, whether it&apos;s a
                  website, a new idea, or something completely random that I decided to try.
                </p>
                <p>
                  Outside of that, I&apos;m usually listening to music, watching anime, or spending hours
                  exploring things that catch my interest. I can be curious about pretty much anything,
                  and I enjoy learning things at my own pace.
                </p>
                <p>
                  I don&apos;t have everything figured out yet, and honestly, I don&apos;t think I need to.
                  I&apos;m just here to grow, create, make memories, and see where life takes me.
                </p>
                <p className="font-semibold text-foreground">
                  Just me, my little world, and a lot left to figure out.
                </p>
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
                    <skill.icon size={20} className="text-site-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{skill.label}</h3>
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}