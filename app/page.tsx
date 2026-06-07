"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { ContentShowcase } from "@/components/content-showcase"
import { Socials } from "@/components/socials"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { InstagramFeed } from "@/components/instagram-feed"

function ParallaxSection({ children, offset = 60 }: { children: React.ReactNode; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y, willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <ParallaxSection offset={40}>
        <About />
      </ParallaxSection>
      <ParallaxSection offset={30}>
        <ContentShowcase />
      </ParallaxSection>
      <ParallaxSection offset={30}>
        <InstagramFeed />
      </ParallaxSection>
      <ParallaxSection offset={30}>
        <Socials />
      </ParallaxSection>
      <ParallaxSection offset={25}>
        <Contact />
      </ParallaxSection>
      <Footer />
    </main>
  )
}