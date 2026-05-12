"use client"

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
  { icon: Video,      label: "CapCut",        description: "Video editing" },
  { icon: Smartphone, label: "Alight Motion",  description: "Motion graphics" },
  { icon: Layout,     label: "Canva",          description: "Design & graphics" },
  { icon: Code2,      label: "VS Code",        description: "Code editor" },
  { icon: Layers,     label: "Next.js",        description: "Web development" },
]

const timeline = [
  { year: "2008", title: "Born in Barishal", desc: "Bangladesh 🇧🇩" },
  { year: "2024", title: "Started making memes", desc: "Posted first content on Instagram & TikTok" },
  { year: "2025", title: "Went deeper into art", desc: "Started exploring aesthetic & anime content" },
  { year: "2026", title: "Built subit.site", desc: "Launched personal portfolio from scratch" },
]

export function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── Left Column ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            {/* Profile Image */}
            <div className="glass-light card-glow relative aspect-square max-w-md overflow-hidden rounded-3xl">
              <Image
                src="/profile.jpg"
                alt="SUBI"
                fill
                className="object-cover object-top"
                style={{ mixBlendMode: "luminosity" }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-light rounded-2xl p-4 text-center"
              >
                <AgeCounter />
              </motion.div>
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                  className="glass-light rounded-2xl p-4 text-center"
                >
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Milestones
              </p>
              <div className="grid grid-cols-4 gap-3">
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="glass-light rounded-xl p-3 text-center"
                  >
                    <div className="text-lg font-bold text-foreground">{m.value}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">{m.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Column ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center gap-8"
          >
            {/* Bio */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-4 block text-sm font-medium uppercase tracking-widest text-muted-foreground"
              >
                About Me
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              >
                Memes, Art &
                <br />
                <span className="text-glow">Chill Guy</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                I&apos;m SUBIT — a 17-year-old meme creator and aspiring artist from Barishal, Bangladesh.
                I make aesthetic, chill content that hits different. What started as posting
                memes on TikTok and Instagram turned into a whole creative journey I never want to stop.
                I also build things on the web — this site was built by me from scratch.
              </motion.p>
            </div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Journey
              </p>
              <div className="relative flex flex-col gap-4 border-l border-foreground/10 pl-5">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-foreground/30 ring-2 ring-background" />
                    <span className="text-xs font-mono text-muted-foreground/60">{item.year}</span>
                    <p className="font-semibold text-foreground text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Tools I Use
              </p>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, i) => (
                  <motion.div
                    key={tool.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                    whileHover={{ scale: 1.05 }}
                    className="glass-light flex items-center gap-2 rounded-full px-3 py-1.5"
                  >
                    <tool.icon size={13} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{tool.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Personal skills */}
            <div className="grid gap-3 sm:grid-cols-2">
              {personalSkills.map((skill, index) => (
                <motion.div
                  key={skill.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-light group flex items-start gap-4 rounded-xl p-4 transition-all"
                >
                  <div className="rounded-lg bg-foreground/5 p-2 transition-colors group-hover:bg-foreground/10">
                    <skill.icon size={20} className="text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{skill.label}</h3>
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Available for collabs button */}
            <motion.a
              href="https://instagram.com/hexed.subit"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 px-5 py-4 transition-all hover:border-foreground/20 hover:bg-foreground/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Pulsing green dot */}
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
            </motion.a>

          </motion.div>
        </div>
      </div>
    </section>
  )
}