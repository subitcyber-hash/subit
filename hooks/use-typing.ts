"use client"

import { useEffect, useState } from "react"

const PHRASES = [
  "Creator · Artist · Meme Lord",
  "Been on that peaceful shi",
  "Aesthetic · Chill · Good Vibes",
  "Based in Barishal, Bangladesh",
]

export function useTypingAnimation(speed = 60, pause = 2000) {
  const [text, setText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = PHRASES[phraseIndex]

    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIndex + 1))
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause)
        } else {
          setCharIndex(c => c + 1)
        }
      } else {
        setText(current.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setDeleting(false)
          setCharIndex(0)
          setPhraseIndex(i => (i + 1) % PHRASES.length)
        } else {
          setCharIndex(c => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, phraseIndex, speed, pause])

  return text
}