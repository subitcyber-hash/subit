// Shared (client + server) guestbook rules. Pure functions only — no secrets, no Node APIs.

export const NAME_MAX = 40
export const MESSAGE_MIN = 2
export const MESSAGE_MAX = 500
export const PAGE_SIZE = 6
export const ANON_NAME = "Anonymous"

// Zero-width, bidi-override and other invisible characters used for spoofing / layout abuse.
const INVISIBLE = /[​-‏‪-‮⁠-⁯﻿­]/g
// ASCII control chars (keeps \n and \t, handled separately).
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const URL_RE = /(https?:\/\/|www\.)\S+/gi

export function cleanName(raw: unknown): string {
  if (typeof raw !== "string") return ""
  return raw
    .normalize("NFC")
    .replace(INVISIBLE, "")
    .replace(CONTROL, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function cleanMessage(raw: unknown): string {
  if (typeof raw !== "string") return ""
  return raw
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(INVISIBLE, "")
    .replace(CONTROL, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export type GuestbookInput = { name: string; message: string }
export type ValidationResult =
  | { ok: true; value: GuestbookInput }
  | { ok: false; error: string }

export function validateEntry(rawName: unknown, rawMessage: unknown): ValidationResult {
  const name = cleanName(rawName) || ANON_NAME
  const message = cleanMessage(rawMessage)

  if ([...name].length > NAME_MAX) return { ok: false, error: `Name must be ${NAME_MAX} characters or fewer.` }
  if ([...message].length < MESSAGE_MIN) return { ok: false, error: "Write a little something first." }
  if ([...message].length > MESSAGE_MAX) return { ok: false, error: `Message must be ${MESSAGE_MAX} characters or fewer.` }
  if ((message.match(URL_RE) || []).length > 1 || (name.match(URL_RE) || []).length > 0) {
    return { ok: false, error: "Please keep links out of the guestbook." }
  }
  if (/(.)\1{14,}/u.test(message)) return { ok: false, error: "That looks like spam — try writing a real message." }
  return { ok: true, value: { name, message } }
}

export type PublicEntry = { id: string; name: string; message: string; createdAt: string }
