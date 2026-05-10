"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Eye } from "lucide-react"

export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    // Use Vercel's /api/visitors endpoint (see route below)
    fetch("/api/visitors")
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => setCount(null))
  }, [])

  if (count === null) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-light fixed bottom-24 left-6 z-40 flex items-center gap-2 rounded-full px-3 py-2 text-xs text-muted-foreground backdrop-blur-md"
    >
      <Eye size={12} />
      <span className="tabular-nums font-mono">{count.toLocaleString()}</span>
      <span>views</span>
    </motion.div>
  )
}