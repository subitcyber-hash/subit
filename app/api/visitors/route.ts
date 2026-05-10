import { NextResponse } from "next/server"

// Simple in-memory counter (resets on redeploy)
// For persistent counts, upgrade to Vercel KV (free tier available)
let count = 1000 // start from 1000 so it doesn't look empty

export async function GET() {
  count++
  return NextResponse.json({ count })
}