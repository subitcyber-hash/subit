"use client"

import { motion } from "framer-motion"
import { Gamepad2, Palette, Trophy, Shield } from "lucide-react"
import Image from "next/image"
import { AgeCounter } from "@/components/age-counter"

const stats = [
  { label: "Born", value: "2008" },
  { label: "Birthday", value: "May 27" },
  { label: "Class", value: "HSC" },
]

const skills = [
  { icon: Gamepad2, label: "Favorite Games", description: "COD • Minecraft • Elden Ring" },
  { icon: Palette, label: "Favorite Colors", description: "Black • White • Blue" },
  { icon: Trophy, label: "Football Team", description: "Argentina" },
  { icon: Shield, label: "Football Club", description: "Barcelona" },
]

export function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left Column - Image & Stats */}
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
              {/* Real-time Age Counter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-light rounded-2xl p-4 text-center"
              >
                <AgeCounter />
              </motion.div>

              {/* Other stats */}
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
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground"
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
              className="mb-8 text-lg leading-relaxed text-muted-foreground"
            >
              I&apos;m SUBIT — a 17-year-old meme creator and aspiring artist from Bangladesh. 
              I make aesthetic, chill content that hits different. What started as posting 
              memes on TikTok and Instagram turned into a whole creative journey I never want to stop.
            </motion.p>

            {/* Skills */}
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}