"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion"
import { Instagram, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import Image from "next/image"

function TikTokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

const BASE_ITEMS = [
  { id: 1,  platform: "instagram", image: "/memes/meme-1.png" },
  { id: 2,  platform: "tiktok",    image: "/memes/meme-2.png" },
  { id: 3,  platform: "instagram", image: "/memes/meme-3.png" },
  { id: 4,  platform: "tiktok",    image: "/memes/meme-4.png" },
  { id: 5,  platform: "instagram", image: "/memes/meme-5.png" },
  { id: 6,  platform: "tiktok",    image: "/memes/meme-6.png" },
  { id: 7,  platform: "instagram", image: "/memes/meme-7.png" },
  { id: 8,  platform: "tiktok",    image: "/memes/meme-8.png" },
  { id: 9,  platform: "instagram", image: "/memes/meme-9.png" },
  { id: 10, platform: "tiktok",    image: "/memes/meme-10.png" },
  { id: 11, platform: "instagram", image: "/memes/meme-11.png" },
  { id: 12, platform: "tiktok",    image: "/memes/meme-12.png" },
]

const CARD_WIDTH = 280
const CARD_GAP = 16
const CARD_STEP = CARD_WIDTH + CARD_GAP
const AUTO_INTERVAL = 1500
const TOTAL = BASE_ITEMS.length

const platformIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: Instagram,
  tiktok: TikTokIcon,
}

// ── Lightbox ──────────────────────────────────────────────
function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: typeof BASE_ITEMS[0]
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const PlatformIcon = platformIcons[item.platform]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[998] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop — click to close */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      <button
        onClick={onPrev}
        className="absolute left-4 sm:left-8 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        className="absolute right-4 sm:right-8 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Image card */}
      <motion.div
        key={item.id}
        className="relative z-10 mx-20 flex flex-col items-center gap-4"
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{
            width: "min(85vw, 520px)",
            aspectRatio: "1 / 1",
          }}
        >
          <Image
            src={item.image}
            alt={`meme ${item.id}`}
            fill
            className="object-cover"
            priority
          />
          {/* Platform badge */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
            <PlatformIcon size={12} />
            <span className="text-xs text-white capitalize">{item.platform}</span>
          </div>
        </div>

        {/* Counter */}
        <p className="text-sm text-white/40 tabular-nums">
          {item.id} / {BASE_ITEMS.length}
        </p>
      </motion.div>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────
export function ContentShowcase() {
  const items = [...BASE_ITEMS, ...BASE_ITEMS, ...BASE_ITEMS]
  const OFFSET = TOTAL * CARD_STEP

  const x = useMotionValue(-OFFSET)
  const [centerIndex, setCenterIndex] = useState(TOTAL)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isDragging = useRef(false)
  const didDrag = useRef(false)
  const dragStartX = useRef(0)
  const dragStartVal = useRef(0)
  const isAnimating = useRef(false)
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((index: number) => {
    if (isAnimating.current) return
    isAnimating.current = true
    const target = -(index * CARD_STEP)
    animate(x, target, {
      type: "spring",
      stiffness: 320,
      damping: 32,
      mass: 0.6,
      onComplete: () => {
        isAnimating.current = false
        if (index < TOTAL) {
          const jump = index + TOTAL
          x.set(-(jump * CARD_STEP))
          setCenterIndex(jump)
        } else if (index >= TOTAL * 2) {
          const jump = index - TOTAL
          x.set(-(jump * CARD_STEP))
          setCenterIndex(jump)
        } else {
          setCenterIndex(index)
        }
      },
    })
  }, [x])

  const next = useCallback(() => {
    setCenterIndex(prev => { const n = prev + 1; goTo(n); return n })
  }, [goTo])

  const prev = useCallback(() => {
    setCenterIndex(prev => { const n = prev - 1; goTo(n); return n })
  }, [goTo])

  const startAuto = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current)
    autoTimer.current = setInterval(() => {
      if (!isDragging.current) next()
    }, AUTO_INTERVAL)
  }, [next])

  const stopAuto = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current)
  }, [])

  useEffect(() => {
    startAuto()
    return () => stopAuto()
  }, [startAuto, stopAuto])

  // Pause carousel while lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) stopAuto()
    else startAuto()
  }, [lightboxIndex, stopAuto, startAuto])

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    didDrag.current = false
    dragStartX.current = e.clientX
    dragStartVal.current = x.get()
    stopAuto()
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const delta = e.clientX - dragStartX.current
    if (Math.abs(delta) > 5) didDrag.current = true
    x.set(dragStartVal.current + delta)
  }
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    const delta = e.clientX - dragStartX.current
    if (Math.abs(delta) > 60) delta < 0 ? next() : prev()
    else goTo(centerIndex)
    startAuto()
  }

  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    didDrag.current = false
    dragStartX.current = e.touches[0].clientX
    dragStartVal.current = x.get()
    stopAuto()
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    const delta = e.touches[0].clientX - dragStartX.current
    if (Math.abs(delta) > 5) didDrag.current = true
    x.set(dragStartVal.current + delta)
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    const delta = e.changedTouches[0].clientX - dragStartX.current
    if (Math.abs(delta) > 60) delta < 0 ? next() : prev()
    else goTo(centerIndex)
    startAuto()
  }

  const realIndex = ((centerIndex % TOTAL) + TOTAL) % TOTAL

  const lightboxPrev = () =>
    setLightboxIndex(i => i === null ? 0 : (i - 1 + TOTAL) % TOTAL)
  const lightboxNext = () =>
    setLightboxIndex(i => i === null ? 0 : (i + 1) % TOTAL)

  return (
    <>
      <section id="content" className="relative py-24 overflow-hidden">
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
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => { stopAuto(); prev(); startAuto() }}
                className="glass-light rounded-full p-3 text-foreground hover:bg-foreground/10"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => { stopAuto(); next(); startAuto() }}
                className="glass-light rounded-full p-3 text-foreground hover:bg-foreground/10"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Carousel track */}
        <div
          className="relative flex cursor-grab select-none items-center active:cursor-grabbing"
          style={{ height: 360 }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <motion.div
            className="absolute flex gap-4"
            style={{ x, left: "50%", marginLeft: -(CARD_WIDTH / 2) }}
          >
            {items.map((item, i) => {
              const distance = i - centerIndex
              const isCenter = distance === 0
              const isAdjacent = Math.abs(distance) === 1
              const isNearby = Math.abs(distance) <= 2
              const PlatformIcon = platformIcons[item.platform]

              return (
                <motion.div
                  key={`${item.id}-${i}`}
                  className="relative flex-shrink-0 overflow-hidden rounded-2xl"
                  style={{ width: CARD_WIDTH }}
                  animate={{
                    scale: isCenter ? 1 : isAdjacent ? 0.88 : 0.75,
                    opacity: isCenter ? 1 : isAdjacent ? 0.6 : 0.3,
                    filter: isCenter ? "blur(0px)" : isAdjacent ? "blur(1px)" : "blur(2.5px)",
                    y: isCenter ? -12 : 0,
                    zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.5 }}
                >
                  {isCenter && (
                    <motion.div
                      className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
                      style={{ boxShadow: "0 0 0 1.5px rgba(255,255,255,0.15), 0 0 40px 6px rgba(255,255,255,0.08)" }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  <div
                    className={`relative aspect-square bg-foreground/5 ${isCenter ? "cursor-zoom-in" : ""}`}
                    onClick={() => {
                      if (isCenter && !didDrag.current) {
                        setLightboxIndex(item.id - 1)
                      }
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={`meme ${item.id}`}
                      fill
                      className="object-cover"
                      draggable={false}
                      loading={isNearby ? "eager" : "lazy"}
                      priority={i < 3}
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur-sm">
                      <PlatformIcon size={14} />
                    </div>

                    {isCenter && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/20">
                          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                            <ZoomIn size={22} className="text-white" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {BASE_ITEMS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { const idx = TOTAL + i; setCenterIndex(idx); goTo(idx); stopAuto(); startAuto() }}
              animate={{ width: realIndex === i ? 24 : 8, opacity: realIndex === i ? 1 : 0.3 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="h-2 rounded-full bg-foreground"
            />
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            item={BASE_ITEMS[lightboxIndex]}
            onClose={() => setLightboxIndex(null)}
            onPrev={lightboxPrev}
            onNext={lightboxNext}
          />
        )}
      </AnimatePresence>
    </>
  )
}