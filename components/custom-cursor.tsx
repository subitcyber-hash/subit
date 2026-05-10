"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [trail, setTrail] = useState({ x: -100, y: -100 })
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const down = () => setClicking(true)
    const up = () => setClicking(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener("mousemove", move)
    window.addEventListener("mousedown", down)
    window.addEventListener("mouseup", up)
    document.addEventListener("mouseleave", leave)
    document.addEventListener("mouseenter", enter)

    // Detect hoverable elements
    const addHover = () => setHovering(true)
    const removeHover = () => setHovering(false)
    const els = document.querySelectorAll("a, button, [role='button']")
    els.forEach(el => {
      el.addEventListener("mouseenter", addHover)
      el.addEventListener("mouseleave", removeHover)
    })

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mousedown", down)
      window.removeEventListener("mouseup", up)
      document.removeEventListener("mouseleave", leave)
      document.removeEventListener("mouseenter", enter)
    }
  }, [])

  // Trail follows with delay
  useEffect(() => {
    const timeout = setTimeout(() => setTrail(pos), 80)
    return () => clearTimeout(timeout)
  }, [pos])

  // Hide on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null

  return (
    <>
      {/* Trail dot */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full"
        style={{
          width: hovering ? 40 : 28,
          height: hovering ? 40 : 28,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "transparent",
          left: trail.x,
          top: trail.y,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
          transition: "width 0.2s, height 0.2s, opacity 0.2s",
        }}
        animate={{
          left: trail.x,
          top: trail.y,
          scale: clicking ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.5 }}
      />

      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-white"
        style={{
          width: clicking ? 4 : 6,
          height: clicking ? 4 : 6,
          left: pos.x,
          top: pos.y,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
          boxShadow: "0 0 6px rgba(255,255,255,0.6)",
          transition: "width 0.1s, height 0.1s, opacity 0.2s",
        }}
      />
    </>
  )
}