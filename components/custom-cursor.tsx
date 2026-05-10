"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    // Use refs + direct DOM manipulation for max speed — no React re-renders
    let ringX = -100, ringY = -100
    let dotX = -100, dotY = -100
    let frame: number

    const moveDot = (x: number, y: number) => {
      dotX = x
      dotY = y
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
    }

    const animateRing = () => {
      // Ring follows dot with smooth lerp — faster: 0.18 factor
      ringX += (dotX - ringX) * 0.18
      ringY += (dotY - ringY) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`
      }
      frame = requestAnimationFrame(animateRing)
    }

    const onMove = (e: MouseEvent) => {
      moveDot(e.clientX, e.clientY)
      setVisible(true)
    }

    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const onHoverIn = () => setHovering(true)
    const onHoverOut = () => setHovering(false)

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)

    // Add hover detection to interactive elements
    const addListeners = () => {
      document.querySelectorAll("a, button, [role='button'], input, textarea").forEach(el => {
        el.addEventListener("mouseenter", onHoverIn)
        el.addEventListener("mouseleave", onHoverOut)
      })
    }
    addListeners()

    // Re-add listeners when DOM changes
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    frame = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  // Don't render on touch devices
  if (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) return null

  return (
    <>
      {/* Outer ring — slightly delayed */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full"
        style={{
          width: hovering ? 44 : 32,
          height: hovering ? 44 : 32,
          marginLeft: hovering ? -22 : -16,
          marginTop: hovering ? -22 : -16,
          border: `1px solid rgba(255,255,255,${hovering ? 0.5 : 0.25})`,
          background: hovering ? "rgba(255,255,255,0.04)" : "transparent",
          opacity: visible ? 1 : 0,
          transition: "width 0.15s, height 0.15s, margin 0.15s, border-color 0.15s, opacity 0.2s",
          willChange: "transform",
        }}
      />

      {/* Inner dot — instant */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-white"
        style={{
          width: clicking ? 4 : 5,
          height: clicking ? 4 : 5,
          marginLeft: clicking ? -2 : -2.5,
          marginTop: clicking ? -2 : -2.5,
          opacity: visible ? 1 : 0,
          boxShadow: "0 0 6px rgba(255,255,255,0.7)",
          transition: "width 0.1s, height 0.1s, opacity 0.15s",
          willChange: "transform",
        }}
      />
    </>
  )
}