"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Code2, Instagram, Palette, Video, Github } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Project = {
  title: string
  description: string
  icon: LucideIcon
  tags: string[]
  href?: string
  linkLabel?: string
}

// ✏️ Edit this list to change what shows up in the section.
// Remove `href` from a project if it has no link yet.
const PROJECTS: Project[] = [
  {
    title: "subit.site",
    description:
      "This personal portfolio, designed and built from scratch with Next.js, Tailwind and Framer Motion.",
    icon: Code2,
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    href: "https://github.com/subitcyber-hash/subit",
    linkLabel: "View code",
  },
  {
    title: "Meme Page",
    description:
      "Aesthetic, chill meme content posted daily to Instagram and TikTok for a growing community.",
    icon: Instagram,
    tags: ["Memes", "Instagram", "TikTok"],
    href: "https://instagram.com/subynxz",
    linkLabel: "Visit page",
  },
  {
    title: "Edits & Motion",
    description:
      "Short-form video edits and motion graphics made with CapCut and Alight Motion.",
    icon: Video,
    tags: ["CapCut", "Alight Motion", "Video"],
  },
  {
    title: "Art & Graphics",
    description:
      "Anime and aesthetic artwork, posters and graphics designed in Canva.",
    icon: Palette,
    tags: ["Anime", "Aesthetic", "Canva"],
  },
]

const cardClass =
  "glass-light group relative flex h-full flex-col gap-5 rounded-2xl p-6 transition-colors hover:bg-foreground/5"

export function Projects() {
  return (
    <section id="projects" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Featured
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Projects
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {PROJECTS.map((project, i) => {
            const Icon = project.icon
            const card = (
              <>
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-foreground/5 p-3 transition-colors group-hover:bg-foreground/10">
                    <Icon size={22} className="text-foreground" />
                  </div>
                  {project.href && (
                    <ArrowUpRight
                      size={20}
                      className="text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    />
                  )}
                </div>

                <div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-foreground/5 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.linkLabel && (
                    <span className="ml-auto flex items-center gap-1 text-xs font-medium text-foreground/70 group-hover:text-foreground">
                      {project.linkLabel === "View code" && <Github size={12} />}
                      {project.linkLabel}
                    </span>
                  )}
                </div>
              </>
            )

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                  >
                    {card}
                  </a>
                ) : (
                  <div className={cardClass}>{card}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
