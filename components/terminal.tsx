"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  COMMANDS,
  MAX_INPUT,
  completeCommand,
  linesToPlainText,
  runCommand,
  sanitizeInput,
  type Line,
} from "@/lib/terminal"

type Entry = { id: number; cmd: string | null; lines: Line[] }

const MAX_ENTRIES = 80
const MAX_HISTORY = 50
const PROMPT = "subit@site:~$"

const WELCOME: Line[] = [
  { kind: "text", text: "Welcome to subit.site — an interactive terminal.", tone: "accent" },
  { kind: "text", text: "Type 'help' for commands — or just say hi and ask me anything.", tone: "dim" },
]

const CSS = `
.tm{--tm-green:var(--site-accent);--tm-dim:rgba(255,255,255,.5);--tm-err:#f87171;
  font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
  color:#e5e5e5;background:#050505;border:1px solid rgba(255,255,255,.1);border-radius:16px;overflow:hidden;
  box-shadow:0 20px 60px -20px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.04);text-align:left}
.tm *{box-sizing:border-box}
.tm-bar{display:flex;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03)}
.tm-dots{display:flex;gap:8px;flex:none}
.tm-dot{width:12px;height:12px;border-radius:50%;border:0;padding:0;cursor:pointer;opacity:.85;transition:opacity .15s,transform .15s}
.tm-dot:hover{opacity:1;transform:scale(1.15)}
.tm-dot:focus-visible,.tm-btn:focus-visible,.tm-chip:focus-visible{outline:2px solid var(--tm-green);outline-offset:2px}
.tm-r{background:#ff5f57}.tm-y{background:#febc2e}.tm-g{background:#28c840}
.tm-title{flex:1;min-width:0;text-align:center;font-size:12px;color:var(--tm-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tm-btn{flex:none;font:inherit;font-size:11px;color:var(--tm-dim);background:transparent;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:4px 9px;cursor:pointer;transition:color .15s,border-color .15s}
.tm-btn:hover{color:#fff;border-color:rgba(255,255,255,.3)}
.tm-body{height:340px;overflow-y:auto;overscroll-behavior:contain;padding:14px 16px;font-size:13px;line-height:1.65;cursor:text;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent}
.tm.tm-tall .tm-body{height:520px}
.tm.tm-min .tm-body,.tm.tm-min .tm-chips{display:none}
.tm-line{animation:tm-in .22s ease-out both;word-break:break-word;white-space:pre-wrap}
.tm-gap{height:.9em}
.tm-cmd{display:flex;gap:8px}
.tm-p{color:var(--tm-green);flex:none}
.tm-t-accent{color:var(--tm-green)}.tm-t-dim{color:var(--tm-dim)}.tm-t-error{color:var(--tm-err)}
.tm-row{display:grid;grid-template-columns:minmax(0,150px) 1fr;gap:12px;animation:tm-in .22s ease-out both}
.tm-k{color:var(--tm-green)}
.tm-v{min-width:0;word-break:break-word}
.tm a{color:#fff;text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--site-accent) 60%,transparent);text-underline-offset:3px}
.tm a:hover{color:var(--tm-green)}
.tm-input{display:flex;gap:8px;align-items:center}
.tm-field{flex:1;min-width:0;font:inherit;font-size:13px;color:#fff;background:transparent;border:0;outline:0;padding:0;caret-color:var(--tm-green)}
.tm-field::placeholder{color:rgba(255,255,255,.25)}
.tm-cursor{display:inline-block;width:.6em;height:1.1em;background:var(--tm-green);animation:tm-blink 1.1s steps(1) infinite;flex:none}
.tm-chips{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px 14px;border-top:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02)}
.tm-chip{font:inherit;font-size:12px;color:rgba(255,255,255,.7);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:6px 12px;cursor:pointer;transition:color .15s,border-color .15s,background .15s,transform .15s}
.tm-chip:hover{color:var(--tm-green);border-color:color-mix(in srgb,var(--site-accent) 50%,transparent);background:color-mix(in srgb,var(--site-accent) 8%,transparent);transform:translateY(-1px)}
@keyframes tm-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes tm-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@media (max-width:640px){
  .tm-body{height:300px;padding:12px;font-size:12.5px}.tm.tm-tall .tm-body{height:440px}
  .tm-row{grid-template-columns:1fr;gap:0;margin-bottom:6px}
  .tm-k{color:var(--tm-green)}
  .tm-field{font-size:16px} /* 16px stops iOS from zooming on focus */
  .tm-chips{padding:10px 12px 12px;gap:6px}.tm-chip{padding:7px 11px}
  .tm-title{font-size:11px}
}
@media (prefers-reduced-motion:reduce){.tm-line,.tm-row{animation:none}.tm-cursor{animation:none}}
`

function RowLine({ line }: { line: Extract<Line, { kind: "row" }> }) {
  const external = !!line.href && !line.href.startsWith("#") && !line.href.startsWith("mailto:")
  return (
    <div className="tm-row">
      <span className="tm-k">{line.key}</span>
      <span className="tm-v">
        {line.href ? (
          <a href={line.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {line.value}
          </a>
        ) : (
          line.value
        )}
      </span>
    </div>
  )
}

function Output({ line }: { line: Line }) {
  if (line.kind === "blank") return <div className="tm-gap" aria-hidden="true" />
  if (line.kind === "row") return <RowLine line={line} />
  return <div className={`tm-line${line.tone ? ` tm-t-${line.tone}` : ""}`}>{line.text}</div>
}

export function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, cmd: null, lines: WELCOME }])
  const [value, setValue] = useState("")
  const [focused, setFocused] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [tall, setTall] = useState(false)
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle")

  const history = useRef<string[]>([])
  const histIdx = useRef(-1) // -1 = not browsing history
  const draft = useRef("")
  const nextId = useRef(1)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep the newest output in view by scrolling the terminal itself (never the page).
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries, minimized])

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current) }, [])

  const clear = useCallback(() => setEntries([]), [])

  const run = useCallback((raw: string) => {
    const clean = sanitizeInput(raw)
    if (clean) {
      history.current = [clean, ...history.current.filter((h) => h !== clean)].slice(0, MAX_HISTORY)
    }
    histIdx.current = -1
    draft.current = ""

    if (!clean) {
      // Like a real shell: an empty Enter just gives a fresh prompt line.
      setEntries((prev) => [...prev, { id: nextId.current++, cmd: "", lines: [] }].slice(-MAX_ENTRIES))
      return
    }
    const result = runCommand(clean)
    if ("clear" in result) return clear()
    setEntries((prev) => [...prev, { id: nextId.current++, cmd: clean, lines: result.lines }].slice(-MAX_ENTRIES))
  }, [clear])

  const submit = (cmd: string) => {
    run(cmd)
    setValue("")
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      submit(value)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const h = history.current
      if (!h.length) return
      if (histIdx.current === -1) draft.current = value
      histIdx.current = Math.min(histIdx.current + 1, h.length - 1)
      setValue(h[histIdx.current])
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (histIdx.current === -1) return
      histIdx.current -= 1
      setValue(histIdx.current === -1 ? draft.current : history.current[histIdx.current])
    } else if (e.key === "Tab") {
      const done = completeCommand(value)
      if (done) {
        e.preventDefault()
        setValue(done)
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault()
      clear()
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      const el = e.currentTarget
      if (el.selectionStart === el.selectionEnd) {
        e.preventDefault()
        if (value) setEntries((prev) => [...prev, { id: nextId.current++, cmd: value + "^C", lines: [] }].slice(-MAX_ENTRIES))
        setValue("")
        histIdx.current = -1
      }
    } else if (e.key === "Escape") {
      e.currentTarget.blur()
    }
  }

  const copyOutput = async () => {
    const text = entries
      .map((en) => [en.cmd !== null ? `${PROMPT} ${en.cmd}` : "", linesToPlainText(en.lines)].filter((s) => s !== "").join("\n"))
      .join("\n")
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      try {
        const ta = document.createElement("textarea")
        ta.value = text
        ta.setAttribute("readonly", "")
        ta.style.position = "fixed"
        ta.style.opacity = "0"
        document.body.appendChild(ta)
        ta.select()
        ok = document.execCommand("copy")
        document.body.removeChild(ta)
      } catch {
        ok = false
      }
    }
    setCopied(ok ? "ok" : "fail")
    if (copyTimer.current) clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopied("idle"), 1800)
  }

  const focusInput = () => {
    // Don't steal focus when the visitor is selecting text to copy.
    if (window.getSelection()?.toString()) return
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <section id="terminal" className="relative px-6 py-16" aria-label="Interactive terminal">
      <style>{CSS}</style>
      <div className="mx-auto max-w-3xl">
        <div className={`tm${tall ? " tm-tall" : ""}${minimized ? " tm-min" : ""}`}>
          <div className="tm-bar">
            <div className="tm-dots">
              <button type="button" className="tm-dot tm-r" aria-label="Clear terminal" title="Clear" onClick={clear} />
              <button
                type="button"
                className="tm-dot tm-y"
                aria-label={minimized ? "Expand terminal" : "Minimize terminal"}
                aria-expanded={!minimized}
                title={minimized ? "Expand" : "Minimize"}
                onClick={() => setMinimized((m) => !m)}
              />
              <button
                type="button"
                className="tm-dot tm-g"
                aria-label={tall ? "Shrink terminal" : "Enlarge terminal"}
                title={tall ? "Shrink" : "Enlarge"}
                onClick={() => { setTall((t) => !t); setMinimized(false) }}
              />
            </div>
            <div className="tm-title">subit@site:~</div>
            <button type="button" className="tm-btn" onClick={copyOutput} aria-label="Copy terminal output">
              {copied === "ok" ? "Copied ✓" : copied === "fail" ? "Copy failed" : "Copy"}
            </button>
          </div>

          <div ref={bodyRef} className="tm-body" onClick={focusInput} role="log" aria-live="polite" aria-label="Terminal output">
            {entries.map((en) => (
              <div key={en.id}>
                {en.cmd !== null && (
                  <div className="tm-cmd tm-line">
                    <span className="tm-p">{PROMPT}</span>
                    <span>{en.cmd}</span>
                  </div>
                )}
                {en.lines.map((l, i) => (
                  <Output key={i} line={l} />
                ))}
                {en.lines.length > 0 && <div className="tm-gap" aria-hidden="true" />}
              </div>
            ))}

            <form
              className="tm-input"
              onSubmit={(e) => { e.preventDefault(); submit(value) }}
            >
              <span className="tm-p" aria-hidden="true">{PROMPT}</span>
              <input
                ref={inputRef}
                className="tm-field"
                type="text"
                value={value}
                maxLength={MAX_INPUT}
                onChange={(e) => { setValue(e.target.value); histIdx.current = -1 }}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label="Terminal command input. Type help for commands."
                placeholder={focused ? "" : "type a command or just chat…"}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="send"
                inputMode="text"
              />
              {!focused && !value && <span className="tm-cursor" aria-hidden="true" />}
            </form>
          </div>

          <div className="tm-chips" role="group" aria-label="Quick commands">
            {COMMANDS.map((c) => (
              <button
                key={c.name}
                type="button"
                className="tm-chip"
                title={c.desc}
                onClick={() => { submit(c.name); setMinimized(false) }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
