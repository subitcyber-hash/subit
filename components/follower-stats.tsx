"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Instagram, Facebook } from "lucide-react"

// TikTok icon component
function TikTokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

interface PlatformStat {
  platform: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  followers: number | null
  color: string
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{formatNumber(count)}</span>
}

function SkeletonCard() {
  return (
    <div className="glass-light relative flex flex-col items-center gap-3 rounded-2xl p-6 animate-pulse">
      <div className="h-7 w-7 rounded-full bg-foreground/10" />
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-16 rounded bg-foreground/10" />
        <div className="h-3 w-12 rounded bg-foreground/10" />
      </div>
    </div>
  )
}

export function FollowerStats() {
  const [stats, setStats] = useState<PlatformStat[]>([
    { platform: "Instagram", icon: Instagram, followers: null, color: "#E1306C" },
    { platform: "TikTok", icon: TikTokIcon, followers: null, color: "#FFFFFF" },
    { platform: "Facebook", icon: Facebook, followers: null, color: "#1877F2" },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchFollowers() {
      try {
        const res = await fetch("/api/followers")
        if (!res.ok) throw new Error("API error")
        const data = await res.json()

        setStats((prev) =>
          prev.map((s) => {
            const key = s.platform.toLowerCase() as "instagram" | "tiktok" | "facebook"
            return { ...s, followers: data[key] ?? null }
          })
        )
      } catch (err) {
        console.error("Failed to fetch follower counts:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchFollowers()
  }, [])

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Community
          </h2>
          <p className="text-muted-foreground">
            Join the growing community across platforms
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            stats.map((stat, index) => (
              <motion.div
                key={stat.platform}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-light card-glow group relative flex flex-col items-center gap-3 rounded-2xl p-6 transition-all duration-300"
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-20"
                  style={{
                    background: `radial-gradient(circle at center, ${stat.color}, transparent 70%)`,
                  }}
                />

                <stat.icon size={28} className="relative z-10 text-foreground" />

                <div className="relative z-10 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {stat.followers !== null ? (
                      <AnimatedCounter value={stat.followers} />
                    ) : error ? (
                      <span className="text-base text-muted-foreground">Unavailable</span>
                    ) : (
                      "—"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.platform}</div>
                </div>

                {/* Live indicator */}
                {stat.followers !== null && (
                  <div className="relative z-10 flex items-center gap-1.5 text-xs text-green-500">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    Live
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {error && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Could not load live counts. Check your API credentials in{" "}
            <code className="rounded bg-foreground/10 px-1 py-0.5 text-xs">.env.local</code>.
          </p>
        )}
      </div>
    </section>
  )
}