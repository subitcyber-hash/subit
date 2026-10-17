import type { Metadata } from "next"
import Image from "next/image"
import { ArrowUpRight, Facebook, Globe, Instagram, Mail, MessageCircle, Twitter } from "lucide-react"
import { DiscordIcon, PinterestIcon, TelegramIcon, TikTokIcon } from "@/components/socials"

// "Link in bio" page — one tap to every place Subit lives. All links match the main site.
export const metadata: Metadata = {
  title: "Links",
  description: "All of SUBIT's links in one place — Instagram, TikTok, Discord, Telegram and more.",
  alternates: { canonical: "/links" },
  openGraph: { title: "SUBIT — Links", description: "All of SUBIT's links in one place.", url: "https://subit.site/links", type: "website", images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "SUBIT — Links", description: "All of SUBIT's links in one place.", images: ["/og.jpg"] },
}

type L = { label: string; sub: string; href: string; icon: React.ComponentType<{ size?: number; className?: string }>; primary?: boolean }

const LINKS: L[] = [
  { label: "Instagram", sub: "@subynxz · main", href: "https://instagram.com/subynxz", icon: Instagram, primary: true },
  { label: "TikTok", sub: "@subynx", href: "https://www.tiktok.com/@subynx", icon: TikTokIcon, primary: true },
  { label: "My Website", sub: "subit.site", href: "/", icon: Globe },
  { label: "Discord", sub: "cooked together", href: "https://discord.gg/DvyaHtx7E", icon: DiscordIcon },
  { label: "Telegram", sub: "@SubitFuego", href: "https://t.me/SubitFuego", icon: TelegramIcon },
  { label: "WhatsApp", sub: "message me", href: "https://wa.me/8801732875763", icon: MessageCircle },
  { label: "Instagram", sub: "@zexqvi · 2nd", href: "https://instagram.com/zexqvi", icon: Instagram },
  { label: "X / Twitter", sub: "@Fuegoweb3", href: "https://x.com/Fuegoweb3", icon: Twitter },
  { label: "Facebook", sub: "Subit Ash", href: "https://www.facebook.com/w0xx6", icon: Facebook },
  { label: "Pinterest", sub: "@subitfuego", href: "https://pin.it/3WDLn1zBO", icon: PinterestIcon },
  { label: "Email", sub: "subitfuego@subit.site", href: "mailto:subitfuego@subit.site", icon: Mail },
]

export default function LinksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-32 pt-14">
      <style>{`
        .lk-bg{position:absolute;inset:0;pointer-events:none;background:
          radial-gradient(60% 40% at 50% 0%,color-mix(in srgb,var(--site-accent) 22%,transparent),transparent 70%),
          radial-gradient(50% 40% at 100% 100%,color-mix(in srgb,var(--site-accent) 10%,transparent),transparent 70%)}
        .lk-in{animation:lk-in .5s cubic-bezier(.16,1,.3,1) both}
        @keyframes lk-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .lk-btn{display:flex;align-items:center;gap:14px;width:100%;padding:14px 16px;border-radius:20px;color:#fff;text-decoration:none;
          background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);transition:transform .18s,background .18s,border-color .18s}
        .lk-btn:hover,.lk-btn:focus-visible{transform:translateY(-2px);background:rgba(255,255,255,.09);border-color:color-mix(in srgb,var(--site-accent) 60%,transparent);outline:none}
        .lk-btn:active{transform:scale(.985)}
        .lk-btn.p{background:color-mix(in srgb,var(--site-accent) 16%,rgba(255,255,255,.04));border-color:color-mix(in srgb,var(--site-accent) 45%,transparent)}
        .lk-ic{flex:none;display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,.08);color:var(--site-accent)}
        .lk-btn.p .lk-ic{background:var(--site-accent);color:var(--site-accent-fg)}
        @media (prefers-reduced-motion:reduce){.lk-in{animation:none}.lk-btn{transition:none}}
      `}</style>
      <div className="lk-bg" />

      <div className="relative mx-auto w-full max-w-md">
        <header className="lk-in mb-8 text-center">
          <div className="mx-auto mb-5 h-28 w-28 overflow-hidden rounded-full border-2 border-site-accent/70 shadow-[0_0_0_8px_rgba(255,255,255,0.05),0_20px_60px_-10px_rgba(0,0,0,0.8)]">
            <Image src="/profile.jpg" alt="SUBIT" width={224} height={224} priority className="h-full w-full object-cover" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">SUBIT</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/55">Creator · Artist · Meme Lord</p>
          <p className="mt-3 text-sm text-white/60">Memes, art &amp; good vibes only.</p>
        </header>

        <ul className="flex flex-col gap-3">
          {LINKS.map((l, i) => {
            const external = /^https?:/.test(l.href)
            return (
              <li key={l.label + l.sub} className="lk-in" style={{ animationDelay: `${80 + i * 45}ms` }}>
                <a
                  href={l.href}
                  className={`lk-btn${l.primary ? " p" : ""}`}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="lk-ic"><l.icon size={22} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold leading-tight">{l.label}</span>
                    <span className="block truncate text-xs text-white/55">{l.sub}</span>
                  </span>
                  <ArrowUpRight size={18} className="flex-none text-white/40" aria-hidden />
                </a>
              </li>
            )
          })}
        </ul>

        <p className="mt-10 text-center text-xs text-white/35">subit.site</p>
      </div>
    </main>
  )
}
