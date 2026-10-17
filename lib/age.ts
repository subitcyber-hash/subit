// Single source of truth for Subit's age (same birth date the About-section counter uses).
export const BIRTH_DATE = new Date("2008-05-27T00:00:00")

export function ageYears(now: Date = new Date()): number {
  let age = now.getFullYear() - BIRTH_DATE.getFullYear()
  const m = now.getMonth() - BIRTH_DATE.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < BIRTH_DATE.getDate())) age--
  return age
}
