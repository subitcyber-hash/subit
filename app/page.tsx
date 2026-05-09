"use client"

import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FollowerStats } from "@/components/follower-stats"
import { About } from "@/components/about"
import { ContentShowcase } from "@/components/content-showcase"
import { Socials } from "@/components/socials"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { InstagramFeed } from "@/components/instagram-feed"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <FollowerStats />
      <About />
      <ContentShowcase />
      <ContentShowcase />
<InstagramFeed />
<Socials />
      <Socials />
      <Contact />
      <Footer />
    </main>
  )
}
