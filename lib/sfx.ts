// Tiny UI sound effects, synthesised with the Web Audio API — no audio files to download.
// Sounds only ever start after a visitor interaction (browsers require it), are quiet,
// and can be switched off with the toggle in the footer (remembered in localStorage).

export type Sfx = "tap" | "key" | "enter" | "reply" | "error" | "toggle" | "matrix"

const KEY = "subit-sfx"
let ctx: AudioContext | null = null
let lastKey = 0

export function isSfxOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off"
  } catch {
    return true
  }
}

export function setSfxOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off")
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("subit:sfx-change"))
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === "suspended") void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

type Tone = { f: number; to?: number; d: number; v: number; type?: OscillatorType; at?: number }

function tone(c: AudioContext, t: Tone) {
  const start = c.currentTime + (t.at ?? 0)
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = t.type ?? "sine"
  o.frequency.setValueAtTime(t.f, start)
  if (t.to) o.frequency.exponentialRampToValueAtTime(t.to, start + t.d)
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(t.v, start + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, start + t.d)
  o.connect(g).connect(c.destination)
  o.start(start)
  o.stop(start + t.d + 0.02)
}

export function play(name: Sfx, force = false) {
  if (!force && !isSfxOn()) return
  const c = audio()
  if (!c) return
  switch (name) {
    case "tap":
      tone(c, { f: 560, to: 380, d: 0.07, v: 0.045 })
      break
    case "key": {
      const now = performance.now()
      if (now - lastKey < 28) return
      lastKey = now
      tone(c, { f: 1000 + Math.random() * 220, to: 800, d: 0.028, v: 0.022, type: "triangle" })
      break
    }
    case "enter":
      tone(c, { f: 440, d: 0.06, v: 0.03, type: "square" })
      tone(c, { f: 660, d: 0.08, v: 0.03, type: "square", at: 0.055 })
      break
    case "reply":
      tone(c, { f: 660, to: 880, d: 0.09, v: 0.04 })
      tone(c, { f: 990, d: 0.1, v: 0.03, at: 0.07 })
      break
    case "error":
      tone(c, { f: 220, to: 120, d: 0.14, v: 0.035, type: "sawtooth" })
      break
    case "toggle":
      tone(c, { f: 620, d: 0.06, v: 0.045 })
      tone(c, { f: 930, d: 0.09, v: 0.045, at: 0.055 })
      break
    case "matrix":
      tone(c, { f: 90, to: 900, d: 0.7, v: 0.04, type: "triangle" })
      for (let i = 0; i < 8; i++) tone(c, { f: 500 + i * 110, d: 0.07, v: 0.02, type: "square", at: 0.1 + i * 0.06 })
      break
  }
}
