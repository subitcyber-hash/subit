// Simulated website terminal: a fixed set of commands that return plain data.
// Nothing here executes user input — free text gets an automatic keyword-based reply.
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
          row("tiktok", "@subynx", "https://www.tiktok.com/@subynx"),
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
      return { lines: chatReply(clean) }
    }
  }
}

// Free-text auto replies: simple keyword intents built from facts already on the site.
// Nothing is evaluated or sent anywhere — input is only matched against fixed patterns.
const run = (cmd: string): Line[] => {
  const r = runCommand(cmd)
  return "lines" in r ? r.lines : []
}

const INTENTS: { test: RegExp; reply: (m: string) => Line[] }[] = [
  { test: /^(hi|hii+|hello|hey+|yo|sup|hola|salam|assalamu|what'?s up|wassup|good (morning|evening|afternoon|night))\b/, reply: () => [text("Hey! 👋 Welcome to my corner of the internet.", "accent"), text("Ask me anything — who I am, what I build, or how to reach me. Or type 'help'.")] },
  { test: /how are you|how r u|how('?s| is) it going|hru/, reply: () => [text("Doing great, thanks for asking! How about you?", "accent"), text("Type 'about' if you want to know more about me.", "dim")] },
  { test: /\b(who|what) (are|r) (you|u)\b|your name|who is subit|who made|about (you|subit|me)|introduce/, reply: () => run("about") },
  { test: /project|portfolio|built|build|made|website|work\b/, reply: () => run("projects") },
  { test: /skill|learn|tech|stack|code|coding|develop|program|cyber|hack|design|edit/, reply: () => run("skills") },
  { test: /interest|hobb|anime|music|song|game|gaming|football|soccer|messi|barca|fun\b|like to do/, reply: () => run("interests") },
  { test: /social|insta|tiktok|facebook|twitter|\bx\b|pinterest|telegram|discord|whatsapp|follow|find you/, reply: () => run("socials") },
  { test: /contact|email|mail|reach|hire|message|dm\b|talk to you|collab|business/, reply: () => run("contact") },
  { test: /age|old are|born|birthday|class|study|student|school|hsc/, reply: () => [text("I was born in 2008 and I'm currently in HSC.", "accent"), text("Type 'about' for the short version of my story.", "dim")] },
  { test: /where|location|country|live|from\b|bangladesh/, reply: () => [text("I'm based in Bangladesh (UTC+6). 🌏", "accent"), text("The best way to reach me is the contact form or my socials.", "dim")] },
  { test: /time|date|today|day is/, reply: () => run("date") },
  { test: /thank|thx|ty\b|appreciate/, reply: () => [text("Anytime! 😊", "accent")] },
  { test: /\b(bye|goodbye|see you|cya|gn)\b/, reply: () => [text("See you around! Thanks for stopping by. 👋", "accent")] },
  { test: /love|cool|nice|awesome|great|amazing|good site|well done/, reply: () => [text("Thank you, that means a lot! 💙", "accent"), text("Feel free to follow me — type 'socials'.", "dim")] },
  { test: /joke|funny|meme/, reply: () => [text("Why do programmers prefer dark mode?", "accent"), text("Because light attracts bugs. 🐛"), text("More memes on my Instagram — type 'socials'.", "dim")] },
  { test: /help|command|what can|what do|options/, reply: () => run("help") },
]

function chatReply(clean: string): Line[] {
  const m = clean.toLowerCase()
  for (const i of INTENTS) if (i.test.test(m)) return i.reply(m)
  return [
    text("Hmm, I'm not sure about that one yet. 🤔", "accent"),
    text("Try asking about my projects, skills, interests or how to contact me — or type 'help' for commands."),
  ]
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
