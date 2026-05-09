"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create the behold widget element dynamically to avoid TS errors
    const widget = document.createElement("behold-widget")
    widget.setAttribute("feed-id", "8m3XRbLpTRLP7WAKl4AI")
    containerRef.current.appendChild(widget)

    // Load Behold script
    const script = document.createElement("script")
    script.src = "https://w.behold.so/widget.js"
    script.type = "module"
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [])

  return (
    <section id="instagram" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <span className="mb-2 block text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Instagram
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Latest Posts
          </h2>
          <p className="text-muted-foreground">
            Follow{" "}
            <a
              href="https://instagram.com/hexed.subit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              @hexed.subit
            </a>{" "}
            for more
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          ref={containerRef}
        />
      </div>
    </section>
  )
}