"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, X, ChevronUp } from "lucide-react"

const PLAYLIST = [
  { id: 1,  title: "Iris",                    artist: "Pastel Ghost",              src: "/music/01-iris.m4a" },
  { id: 2,  title: "Fever (Slowed & Reverb)", artist: "Buckshot & Fakemink",       src: "/music/02-fever.m4a" },
  { id: 3,  title: "Agora Hills",             artist: "Doja Cat",                  src: "/music/03-agora-hills.m4a" },
  { id: 4,  title: "Faded (Slowed Remix)",    artist: "Alan Walker",               src: "/music/04-faded.m4a" },
  { id: 5,  title: "Impostor Syndrome",       artist: "Sidney Gish",               src: "/music/05-impostor.m4a" },
  { id: 6,  title: "Nuts (feat. Rainy Bear)", artist: "Lil Peep",                  src: "/music/06-nuts.m4a" },
  { id: 7,  title: "Welcome and Goodbye",     artist: "Dream Ivory",               src: "/music/07-welcome.m4a" },
  { id: 8,  title: "Nope You're Too Late",    artist: "i already died",            src: "/music/08-nope.m4a" },
  { id: 9,  title: "The Less I Know Better",  artist: "Tame Impala",               src: "/music/09-less-i-know.m4a" },
  { id: 10, title: "Tesla",                   artist: "Eyedress & zzzahara",       src: "/music/10-tesla.m4a" },
]

function formatTime(s: number) {
  if (isNaN(s)) return "0:00"
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}

export function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  const current = PLAYLIST[currentIndex]

  // Click outside to close
  useEffect(() => {
    if (!expanded) return

    const handleClickOutside = (e: MouseEvent) => {
      if (playerRef.current && !playerRef.current.contains(e.target as Node)) {
        setExpanded(false)
        setShowPlaylist(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [expanded])

  useEffect(() => {
    const audio = new Audio(current.src)
    audio.volume = isMuted ? 0 : 0.7
    audioRef.current = audio

    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration))
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100 || 0)
    })
    audio.addEventListener("ended", () => nextTrack())

    if (isPlaying) audio.play().catch(() => {})

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [currentIndex])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.play().catch(() => {})
    else audioRef.current.pause()
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : 0.7
  }, [isMuted])

  const nextTrack = useCallback(() => {
    setCurrentIndex(i => (i + 1) % PLAYLIST.length)
  }, [])

  const prevTrack = useCallback(() => {
    setCurrentIndex(i => (i - 1 + PLAYLIST.length) % PLAYLIST.length)
  }, [])

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = pct * duration
  }

  return (
    <motion.div
      ref={playerRef}
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
    >
      <AnimatePresence mode="wait">
        {!expanded ? (
          /* ── Collapsed pill ── */
          <motion.button
            key="pill"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setExpanded(true)}
            className="glass-light flex items-center gap-3 rounded-full px-4 py-3 backdrop-blur-md hover:bg-foreground/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-end gap-0.5 h-4">
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-foreground"
                  animate={isPlaying
                    ? { height: ["4px", "16px", "8px", "14px", "4px"] }
                    : { height: "4px" }
                  }
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                />
              ))}
            </div>
            <div className="text-left max-w-[140px]">
              <p className="text-xs font-semibold text-foreground truncate">{current.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{current.artist}</p>
            </div>
            <Music size={14} className="text-muted-foreground" />
          </motion.button>
        ) : (
          /* ── Expanded player ── */
          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-light w-72 rounded-2xl p-4 backdrop-blur-md shadow-2xl"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => setShowPlaylist(p => !p)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Music size={12} />
                Playlist
                <ChevronUp
                  size={12}
                  className={`transition-transform ${showPlaylist ? "" : "rotate-180"}`}
                />
              </button>
              <button
                onClick={() => { setExpanded(false); setShowPlaylist(false) }}
                className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Playlist */}
            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-hide">
                    {PLAYLIST.map((track, i) => (
                      <button
                        key={track.id}
                        onClick={() => { setCurrentIndex(i); setIsPlaying(true) }}
                        className={`w-full rounded-lg px-3 py-2 text-left transition-all hover:bg-foreground/10 ${
                          i === currentIndex ? "bg-foreground/10" : ""
                        }`}
                      >
                        <p className={`text-xs font-medium truncate ${i === currentIndex ? "text-foreground" : "text-muted-foreground"}`}>
                          {track.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{track.artist}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Animated bars visual */}
            <div className="mb-4 flex items-end justify-center gap-1 h-8">
              {[1,2,3,4,5,6,7,8].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-full bg-foreground/60"
                  animate={isPlaying
                    ? { height: [`${4 + (i%3)*6}px`, `${16 + (i%4)*8}px`, `${4 + (i%3)*6}px`] }
                    : { height: "4px" }
                  }
                  transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>

            {/* Track info */}
            <div className="mb-4 text-center">
              <p className="font-semibold text-foreground truncate">{current.title}</p>
              <p className="text-xs text-muted-foreground">{current.artist}</p>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <div
                className="h-1.5 w-full cursor-pointer rounded-full bg-foreground/10 overflow-hidden"
                onClick={seek}
              >
                <motion.div
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setIsMuted(m => !m)}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </motion.button>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={prevTrack}
                  className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipBack size={18} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(p => !p)}
                  className="rounded-full bg-foreground p-3 text-background shadow-lg"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={nextTrack}
                  className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward size={18} />
                </motion.button>
              </div>

              <div className="w-8" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  )
}