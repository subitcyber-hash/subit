"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Minimal splash: wordmark + thin progress line on black, ~1.4s total.
const SHOW_MS = 1200

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), SHOW_MS)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.span
            className="select-none text-sm font-medium uppercase tracking-[0.6em] text-foreground/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Subit
          </motion.span>

          <div className="mt-6 h-px w-24 overflow-hidden bg-[#C9D6E3]">
            <motion.div
              className="h-full bg-[#8CBDE8]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: SHOW_MS / 1000, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
