"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Instagram, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

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

const contentItems = [
  { id: 1,  title: "i love when a song describes my exact station.",                                    platform: "instagram", image: "/memes/meme-1.png" },
  { id: 2,  title: "thinking of ways to talk to fine shyt",                                            platform: "tiktok",    image: "/memes/meme-2.png" },
  { id: 3,  title: "been on that peaceful shi",                                                         platform: "instagram", image: "/memes/meme-3.png" },
  { id: 4,  title: "nothing is that serious, choose peace.",                                            platform: "tiktok",    image: "/memes/meme-4.png" },
  { id: 5,  title: "u need to stop being scared of losing people",                                     platform: "instagram", image: "/memes/meme-5.png" },
  { id: 6,  title: "forgotten by the one i could never forget.",                                       platform: "tiktok",    image: "/memes/meme-6.png" },
  { id: 7,  title: "Remember how we used to talk everyday? Yeah, I miss that.",                        platform: "instagram", image: "/memes/meme-7.png" },
  { id: 8,  title: "my problem is i expect people to treat me the way i treat them",                   platform: "tiktok",    image: "/memes/meme-8.png" },
  { id: 9,  title: "I give people second chances because I know people can change",                    platform: "instagram", image: "/memes/meme-9.png" },
  { id: 10, title: "never let a bitch ruin your mental health",                                        platform: "tiktok",    image: "/memes/meme-10.png" },
  { id: 11, title: "change is uncomfortable but necessary",                                            platform: "instagram", image: "/memes/meme-11.png" },
  { id: 12, title: "How it feels when the breakup depression is gone and the ego is back",             platform: "tiktok",    image: "/memes/meme-12.png" },
]

const platformIcons = {
  instagram: Instagram,
  tiktok: TikTokIcon,
}

export function ContentShowcase() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "left" ? -340 : 340,
        behavior: "smooth",
      })
      setTimeout(checkScrollability, 300)
    }
  }

  return (
    <section id="content" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Featured
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Content Showcase
            </h2>
          </div>

          <div className="hidden gap-2 sm:flex">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`glass-light rounded-full p-3 transition-all ${
                canScrollLeft ? "text-foreground hover:bg-foreground/10" : "cursor-not-allowed text-muted-foreground/50"
              }`}
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`glass-light rounded-full p-3 transition-all ${
                canScrollRight ? "text-foreground hover:bg-foreground/10" : "cursor-not-allowed text-muted-foreground/50"
              }`}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          className="scrollbar-hide -mx-6 flex gap-4 overflow-x-auto px-6 pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {contentItems.map((item, index) => {
            const PlatformIcon = platformIcons[item.platform as keyof typeof platformIcons]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="glass-light card-glow group relative min-w-[280px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-foreground/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Platform badge */}
                  <div className="absolute left-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur-sm">
                    <PlatformIcon size={14} />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

              </motion.div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}