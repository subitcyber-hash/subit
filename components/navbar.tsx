"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Home",    href: "#home" },
  { name: "About",   href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Socials", href: "#socials" },
  { name: "Contact", href: "#contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        update()
      })
    }
    const update = () => {
      setScrolled(window.scrollY > 50)
      const sections = navItems.map((item) => item.href.slice(1))
      const scrollPosition = window.scrollY + 100
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Floating pill navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-32px)] max-w-[860px]"
      >
        <motion.div
          className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full px-5 py-2.5"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow: scrolled
              ? "0 12px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.3), inset 0 1.5px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(255,255,255,0.08)"
              : "0 6px 24px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.22), inset 0 1.5px 1px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(255,255,255,0.06)",
            transition: "box-shadow 0.3s",
          }}
        >
          {/* Left — Logo */}
          <motion.a
            href="#home"
            onClick={closeMenu}
            className="text-lg font-bold tracking-wider text-foreground shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ѕυвιт
          </motion.a>

          {/* Center — Desktop nav */}
          <div className="hidden md:flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  activeSection === item.href.slice(1)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 rounded-full bg-site-accent/15"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </a>
            ))}
          </div>

          {/* Right — Hamburger (mobile) / empty spacer (desktop) */}
          <div className="flex justify-end -mr-2 md:mr-0">
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground md:hidden"
              style={{ background: "rgba(255,255,255,0.12)", boxShadow: "inset 0 1px 0.5px rgba(255,255,255,0.35)" }}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={16} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile menu — floating Apple-style glass sheet under the pill */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={closeMenu}
            />

            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-4 right-4 top-[84px] z-[45] mx-auto max-w-[860px] overflow-hidden rounded-[32px] p-3 md:hidden"
              style={{
                transformOrigin: "top center",
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow:
                  "0 24px 60px -12px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.28), inset 0 1.5px 1px rgba(255,255,255,0.45), inset 0 -1px 1px rgba(255,255,255,0.1), inset 1px 0 1px rgba(255,255,255,0.15), inset -1px 0 1px rgba(255,255,255,0.15)",
              }}
            >
              <nav className="flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const active = activeSection === item.href.slice(1)
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.03 + index * 0.03, duration: 0.15 }}
                      onClick={closeMenu}
                      className={`relative flex items-center rounded-2xl px-5 py-3.5 text-lg font-semibold transition-colors active:scale-[0.98] ${
                        active ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                      }`}
                      style={
                        active
                          ? {
                              background: "rgba(255,255,255,0.14)",
                              boxShadow:
                                "inset 0 1px 0.5px rgba(255,255,255,0.4), inset 0 -0.5px 0.5px rgba(255,255,255,0.08)",
                            }
                          : undefined
                      }
                    >
                      <span>{item.name}</span>
                      <span className="ml-auto font-mono text-xs text-foreground/35">
                        0{index + 1}
                      </span>
                    </motion.a>
                  )
                })}
              </nav>

              <div
                className="mx-3 mt-3 pt-4 pb-2 text-center"
                style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                  Creator · Artist · Meme Lord
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
