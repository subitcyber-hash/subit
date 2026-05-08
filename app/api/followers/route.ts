import { NextResponse } from "next/server"

// No API calls needed — all counts are read from .env.local
// Update the numbers in .env.local whenever you want to refresh them.

function getCount(envKey: string): number | null {
  const val = process.env[envKey]
  if (!val) {
    console.warn(`${envKey} not set in .env.local`)
    return null
  }
  const parsed = parseInt(val, 10)
  return isNaN(parsed) ? null : parsed
}

export async function GET() {
  return NextResponse.json({
    instagram: getCount("INSTAGRAM_FOLLOWER_COUNT"),
    tiktok:    getCount("TIKTOK_FOLLOWER_COUNT"),
    facebook:  getCount("FACEBOOK_FOLLOWER_COUNT"),
  })
}