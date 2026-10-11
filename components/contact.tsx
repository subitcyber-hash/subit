"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, MapPin, Sparkles, CheckCircle } from "lucide-react"

export function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [focused, setFocused] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "d7ad451e-f691-492c-aad7-30ddd233ca4f",
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `New message from ${formState.name} — SUBI Portfolio`,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setIsSubmitted(true)
        setFormState({ name: "", email: "", message: "" })
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } catch {
      setError("Network error. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <span className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Get in Touch
            </span>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Let&apos;s Create
              <br />
              <span className="text-glow">Something Amazing</span>
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Have a project in mind or just want to say hello? I&apos;d love to hear from you.
              Drop me a message and let&apos;s start a conversation.
            </p>

            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-light flex items-center gap-4 rounded-xl p-4"
              >
                <div className="rounded-lg bg-foreground/5 p-3">
                  <Mail size={20} className="text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">subitfuego@subit.site</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-light flex items-center gap-4 rounded-xl p-4"
              >
                <div className="rounded-lg bg-foreground/5 p-3">
                  <MapPin size={20} className="text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">Barishal</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="glass card-glow rounded-3xl p-8">

              {/* Success message */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-green-400"
                >
                  <CheckCircle size={18} />
                  <span className="text-sm font-medium">Message sent! I'll get back to you soon.</span>
                </motion.div>
              )}

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="mb-6">
                <label
                  htmlFor="name"
                  className={`mb-2 block text-sm font-medium transition-colors ${
                    focused === "name" ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  required
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder-muted-foreground/50 transition-all focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10"
                  placeholder="Your name"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className={`mb-2 block text-sm font-medium transition-colors ${
                    focused === "email" ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder-muted-foreground/50 transition-all focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10"
                  placeholder="your@email.com"
                />
              </div>

              <div className="mb-8">
                <label
                  htmlFor="message"
                  className={`mb-2 block text-sm font-medium transition-colors ${
                    focused === "message" ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Message
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  id="message"
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  required
                  className="w-full resize-none rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground placeholder-muted-foreground/50 transition-all focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10"
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full overflow-hidden rounded-xl bg-foreground py-4 font-semibold text-background transition-all hover:shadow-lg hover:shadow-foreground/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles size={18} />
                      </motion.span>
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle size={18} />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}