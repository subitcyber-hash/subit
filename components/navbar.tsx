"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Home",    href: "#home" },
  { name: "About",   href: "#about" },
  { name: "Content", href: "#content" },
  { name: "Socials", href: "#socials" },
  { name: "Contact", href: "#contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
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
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isOpen ? "glass backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={closeMenu}
              className="relative z-50 text-2xl font-bold tracking-wider text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ѕυвιт
            </motion.a>

            {/* Desktop nav */}
            <div className="hidden items-center gap-8 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group relative py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-foreground transition-all duration-300 ${
                      activeSection === item.href.slice(1) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              ))}
            </div>

            {/* Hamburger */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden glass-light"
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
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xl md:hidden"
              onClick={closeMenu}
            />

            {/* Slide panel */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-40 h-full w-3/4 max-w-xs bg-background/95 backdrop-blur-2xl border-l border-border md:hidden flex flex-col"
            >
              {/* Spacer for navbar height */}
              <div className="h-20 flex-shrink-0" />

              {/* Nav links — flex-1 so it fills space, overflow-y-auto for safety */}
              <nav className="flex flex-col gap-1 px-6 py-4 flex-1 overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ delay: index * 0.07, type: "spring", stiffness: 300, damping: 25 }}
                    onClick={closeMenu}
                    className={`relative flex items-center rounded-xl px-4 py-4 text-xl font-semibold transition-all ${
                      activeSection === item.href.slice(1)
                        ? "text-foreground bg-foreground/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {activeSection === item.href.slice(1) && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-foreground"
                      />
                    )}
                    <span className="pl-3">{item.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground/40 font-mono">
                      0{index + 1}
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* Bottom tagline — flex-shrink-0 so it never gets pushed off */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex-shrink-0 px-8 py-6 border-t border-border"
              >
                <p className="text-xs text-muted-foreground/50 uppercase tracking-widest">
                  Creator · Artist · Meme Lord
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}