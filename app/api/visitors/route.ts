import { NextResponse } from "next/server"

async function incrementAndGet(): Promise<number> {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    return 1000
  }

  try {
    const res = await fetch(`${url}/incr/page_views`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    return data.result || 1000
  } catch {
    return 1000
  }
}

export async function GET() {
  const count = await incrementAndGet()
  return NextResponse.json({ count })
}