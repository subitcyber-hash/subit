// Accent color options. The hex values here must match the html[data-accent="…"] rules in app/globals.css
// (a test-time check keeps them in sync). Ice Blue is the default and needs no attribute.

export const ACCENTS = [
  { id: "ice", name: "Ice Blue", hex: "#A5D8FF" },
  { id: "silver", name: "Silver", hex: "#C0C0C0" },
  { id: "violet", name: "Violet", hex: "#B8A1FF" },
  { id: "emerald", name: "Emerald", hex: "#6EE7B7" },
  { id: "rose", name: "Rose", hex: "#FDA4AF" },
  { id: "amber", name: "Amber", hex: "#FCD34D" },
] as const

export type AccentId = (typeof ACCENTS)[number]["id"]
export const DEFAULT_ACCENT: AccentId = "ice"
export const ACCENT_STORAGE_KEY = "subit-accent"

export const isAccentId = (v: unknown): v is AccentId => ACCENTS.some((a) => a.id === v)

// Runs in <head> before first paint so a saved accent never flashes the default color.
export const ACCENT_INIT_SCRIPT = `try{var a=localStorage.getItem(${JSON.stringify(ACCENT_STORAGE_KEY)});if(${JSON.stringify(
  ACCENTS.map((x) => x.id),
)}.indexOf(a)>-1&&a!==${JSON.stringify(DEFAULT_ACCENT)})document.documentElement.setAttribute("data-accent",a)}catch(e){}`

export function applyAccent(id: AccentId) {
  const root = document.documentElement
  if (id === DEFAULT_ACCENT) root.removeAttribute("data-accent")
  else root.setAttribute("data-accent", id)
}

export function readStoredAccent(): AccentId {
  try {
    const v = localStorage.getItem(ACCENT_STORAGE_KEY)
    return isAccentId(v) ? v : DEFAULT_ACCENT
  } catch {
    return DEFAULT_ACCENT
  }
}

export function storeAccent(id: AccentId) {
  try {
    if (id === DEFAULT_ACCENT) localStorage.removeItem(ACCENT_STORAGE_KEY)
    else localStorage.setItem(ACCENT_STORAGE_KEY, id)
  } catch {
    /* private mode / blocked storage: the choice still applies for this visit */
  }
}
