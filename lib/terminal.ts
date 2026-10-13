// Simulated website terminal: a fixed set of commands that return plain data.
// Nothing here executes user input — unknown text just gets a friendly message.
// All links/handles/facts below mirror what already exists on the site (projects.tsx, socials.tsx,
// hero.tsx, footer.tsx, contact.tsx, about.tsx).

export type Line =
  | { kind: "text"; text: string; tone?: "dim" | "accent" | "error" }
  | { kind: "row"; key: string; value: string; href?: string }
  | { kind: "blank" }

export type CommandResult = { lines: Line[] } | { clear: true }

const text = (t: string, tone?: "dim" | "accent" | "error"): Line => ({ kind: "text", text: t, tone })
const row = (key: string, value: string, href?: string): Line => ({ kind: "row", key, value, href })
const blank: Line = { kind: "blank" }

export const COMMANDS = [
  { name: "help", desc: "list all available commands" },
  { name: "about", desc: "a short intro to Subit" },
  { name: "projects", desc: "things I've built and made" },
  { name: "interests", desc: "anime, music, games, tech & more" },
  { name: "skills", desc: "what I'm learning and using" },
  { name: "socials", desc: "find me around the internet" },
  { name: "contact", desc: "get in touch" },
  { name: "date", desc: "show the current date and time" },
  { name: "whoami", desc: "who are you, exactly?" },
  { name: "clear", desc: "clear the terminal" },
] as const

export const COMMAND_NAMES: string[] = COMMANDS.map((c) => c.name)

export const MAX_INPUT = 120

// Things people try in a real shell. We stay a pretend terminal and say so.
const SHELL_ISH = new Set([
  "sudo", "rm", "ls", "cd", "cat", "curl", "wget", "ssh", "pwd", "mkdir", "touch", "chmod", "kill",
  "bash", "sh", "node", "python", "npm", "git", "vim", "nano", "exit", "echo", "ping", "nmap",
])

export function sanitizeInput(raw: string): string {
  // Collapse whitespace and strip control / invisible characters; length-capped.
  return raw
    .replace(/[\u0000-\u001F\u007F​-‏‪-‮⁠-⁯﻿]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_INPUT)
}

export function runCommand(input: string, now: Date = new Date()): CommandResult {
  const clean = sanitizeInput(input)
  const name = clean.split(" ")[0].toLowerCase()

  switch (name) {
    case "help":
      return {
        lines: [
          text("Available commands:", "accent"),
          ...COMMANDS.map((c) => row(c.name, c.desc)),
          blank,
          text("Tip: use ↑ / ↓ for history and Tab to autocomplete.", "dim"),
        ],
      }

    case "about":
      return {
        lines: [
          text("Hey, I'm Subit.", "accent"),
          text("Just a guy trying to figure life out, build cool things, and become someone I'm proud of."),
          text("I'm into technology, web design, and exploring what the internet has to offer."),
          blank,
          row("born", "2008"),
          row("class", "HSC"),
          blank,
          text("Just me, my little world, and a lot left to figure out.", "dim"),
        ],
      }

    case "projects":
      return {
        lines: [
          text("Projects:", "accent"),
          row("subit.site", "this portfolio — Next.js, Tailwind, Framer Motion", "https://github.com/subitcyber-hash/subit"),
          row("meme page", "chill meme content on Instagram & TikTok", "https://instagram.com/subynxz"),
          row("edits & motion", "short-form edits in CapCut and Alight Motion"),
          row("art & graphics", "anime and aesthetic artwork, posters in Canva"),
          blank,
          text("More in the Projects section above.", "dim"),
        ],
      }

    case "interests":
      return {
        lines: [
          text("Interests:", "accent"),
          row("anime", "watching it in my free time"),
          row("music", "usually listening to something"),
          row("gaming", "COD · Minecraft · Elden Ring"),
          row("technology", "web design, the internet, building things"),
          row("football", "Argentina · Barcelona"),
        ],
      }

    case "skills":
      return {
        lines: [
          text("Learning:", "accent"),
          row("web dev", "Next.js · Tailwind · Framer Motion"),
          row("cybersecurity", "currently learning"),
          blank,
          text("Tools I use:", "accent"),
          row("editing", "CapCut · Alight Motion"),
          row("design", "Canva"),
          row("code", "VS Code · Next.js"),
        ],
      }

    case "socials":
      return {
        lines: [
          text("Find me here:", "accent"),
          row("instagram", "@subynxz (main)", "https://instagram.com/subynxz"),
          row("instagram", "@zexqvi (2nd)", "https://instagram.com/zexqvi"),
          row("tiktok", "@w0xxi3", "https://www.tiktok.com/@w0xxi3"),
          row("facebook", "Subit Ash", "https://www.facebook.com/w0xx6"),
          row("twitter / x", "@Fuegoweb3", "https://x.com/Fuegoweb3"),
          row("pinterest", "@subitfuego", "https://pin.it/3WDLn1zBO"),
          row("telegram", "@SubitFuego", "https://t.me/SubitFuego"),
          row("discord", "cooked together", "https://discord.gg/DvyaHtx7E"),
          row("whatsapp", "message me", "https://wa.me/8801732875763"),
        ],
      }

    case "contact":
      return {
        lines: [
          text("Get in touch:", "accent"),
          row("email", "subitfuego@subit.site", "mailto:subitfuego@subit.site"),
          row("form", "use the contact form on this page", "#contact"),
        ],
      }

    case "date":
      return {
        lines: [
          text(
            now.toLocaleString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZoneName: "short",
            }),
          ),
        ],
      }

    case "whoami": {
      let tz = ""
      try {
        tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
      } catch {
        /* ignore */
      }
      return {
        lines: [
          text("visitor", "accent"),
          text("A curious human exploring Subit's little corner of the internet."),
          ...(tz ? [row("timezone", tz)] : []),
          row("access", "read-only, no shell. you're safe here"),
        ],
      }
    }

    case "clear":
      return { clear: true }

    default: {
      if (SHELL_ISH.has(name)) {
        return {
          lines: [
            text(`${name}: this is a pretend terminal — nothing here runs real commands.`, "error"),
            text("Type 'help' to see what I do understand.", "dim"),
          ],
        }
      }
      // Echo as plain text only; React escapes it, and it is never evaluated.
      return {
        lines: [
          text(`command not found: ${name}`, "error"),
          text("Type 'help' to see available commands.", "dim"),
        ],
      }
    }
  }
}

export function linesToPlainText(lines: Line[]): string {
  return lines
    .map((l) => {
      if (l.kind === "blank") return ""
      if (l.kind === "row") return `${l.key.padEnd(16)}${l.value}${l.href && !l.value.includes(l.href) ? ` → ${l.href}` : ""}`
      return l.text
    })
    .join("\n")
}

export function completeCommand(prefix: string): string | null {
  const p = prefix.trim().toLowerCase()
  if (!p || p.includes(" ")) return null
  const matches = COMMAND_NAMES.filter((n) => n.startsWith(p))
  return matches.length === 1 ? matches[0] : null
}
