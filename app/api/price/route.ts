// app/api/price/route.ts
import { NextResponse } from "next/server"
import { JUPITER_PRICE_API_BASE_URL } from "@/app/lib/constants"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get("ids")
    const vsToken = searchParams.get("vsToken") ?? "EPjFWdd5AufqSSqeM2qN1xzybapTVG4itwqZNfwpPJ55" // USDC

    if (!ids) {
      console.warn("Price API: 'ids' parameter is missing. Returning 400.")
      return NextResponse.json({ error: "ids query parameter is required" }, { status: 400 })
    }

    // `ids` arrives un-encoded from the client; encode it exactly once
    const upstream = `${JUPITER_PRICE_API_BASE_URL}/price?ids=${encodeURIComponent(ids)}&vsToken=${vsToken}`

    console.log("Fetching Jupiter Price API from:", upstream) // Added for debugging

    // Use new URL() to ensure the URL is treated as absolute, which can help in some environments
    const res = await fetch(new URL(upstream), { next: { revalidate: 30 } }) // 30-second SSG revalidation
    const raw = await res.text()
    let payload: unknown
    try {
      payload = JSON.parse(raw)
    } catch {
      payload = { error: raw.trim() }
    }

    if (!res.ok) {
      console.error(`Jupiter Price API returned non-OK status ${res.status}. Raw response: ${raw}`)
    }

    return NextResponse.json(payload, { status: res.status })
  } catch (err: any) {
    console.error("Proxy /api/price error:", err)
    return NextResponse.json({ error: "Internal price proxy error" }, { status: 500 })
  }
}
