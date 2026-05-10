"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const BIRTH_DATE = new Date("2008-05-27T00:00:00")

function getAge() {
  const now = new Date()
  const diff = now.getTime() - BIRTH_DATE.getTime()
  const years = diff / (1000 * 60 * 60 * 24 * 365.25)
  return years.toFixed(9) // 9 decimal places
}

export function AgeCounter() {
  const [age, setAge] = useState(getAge())

  useEffect(() => {
    const id = setInterval(() => setAge(getAge()), 100)
    return () => clearInterval(id)
  }, [])

  const [whole, decimal] = age.split(".")

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-1"
    >
      <div className="flex items-baseline gap-0.5 font-mono">
        <span className="text-2xl font-bold text-foreground">{whole}</span>
        <span className="text-sm text-muted-foreground">.{decimal}</span>
      </div>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">Years Old</span>
    </motion.div>
  )
}