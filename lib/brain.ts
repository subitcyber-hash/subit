import { ageYears } from "./age"

// The terminal's "brain": everything the chat is allowed to know about Subit.
// EDIT THIS FILE to teach it new things — no other code changes needed.
//  • FACTS  → short statements. The AI chat reads these (it never invents beyond them).
//  • FAQ    → question keywords + a ready answer. Used by the offline replies and also shown to the AI.
// Only put things here you're happy for every visitor to read.

export const FACTS: string[] = [
  `Subit is ${ageYears()} years old (born 27 May 2008) and is in HSC.`,
  "He's into technology, web design and exploring the internet, and is learning web dev (Next.js, Tailwind, Framer Motion) and cybersecurity.",
  "He makes meme content (Instagram, TikTok), short-form edits (CapCut, Alight Motion), anime/aesthetic art and posters (Canva).",
  "Interests: anime, music, gaming (COD, Minecraft, Elden Ring), football (Argentina, Barcelona).",
  "Based in Bangladesh. This portfolio is built with Next.js and open source at github.com/subitcyber-hash/subit.",
  "Contact: email subitfuego@subit.site, the contact form on the site, Instagram @subynxz (main) and @zexqvi, TikTok @subynx, X @Fuegoweb3, Telegram @SubitFuego, WhatsApp via the site.",
  "The site has a music player, an accent color switcher, a 'Currently Listening' card powered by Last.fm, and a few hidden easter eggs.",
  // ➕ Add your own facts below, one per line, e.g.:
  // "Favorite anime: ...",
  // "Currently working on: ...",
]

export const FAQ: { keys: string[]; answer: string }[] = [
  { keys: ["easter egg", "secret", "hidden", "cheat code", "konami"], answer: "Psst… there are a few hidden surprises on this site. Try the Konami code, or poke around the terminal. 😉" },
  { keys: ["accent", "color", "colour", "theme"], answer: "Use the little color dots in the footer at the bottom of the page to switch the site's accent color — Ice Blue, Silver, Violet, Emerald, Rose or Amber." },
  { keys: ["listening", "last.fm", "lastfm", "spotify", "playing"], answer: "The 'Currently Listening' card shows what Subit is playing right now, pulled live from Last.fm." },
  { keys: ["open source", "source code", "github", "repo"], answer: "This site is open source: github.com/subitcyber-hash/subit" },
  { keys: ["made with", "built with", "framework", "next.js", "nextjs", "tailwind"], answer: "Built with Next.js, Tailwind CSS and Framer Motion, hosted on Vercel." },
  // ➕ Add your own: { keys: ["favorite anime", "fav anime"], answer: "My favorite anime is ..." },
]

export function faqAnswer(message: string): string | null {
  const m = message.toLowerCase()
  const hit = FAQ.find((f) => f.keys.some((k) => m.includes(k)))
  return hit ? hit.answer : null
}
