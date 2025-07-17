import { type NextRequest, NextResponse } from "next/server"
import { JUPITER_PRICE_API_BASE_URL } from "@/app/lib/constants"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.get("ids")
  const vsToken = searchParams.get("vsToken") || "EPjFWdd5AufqSSqeM2qN1xzybapTVG4itwqZNfwpPJ55" // Default to USDC

  if (!ids) {
    return NextResponse.json({ error: "Missing 'ids' parameter" }, { status: 400 })
  }

  try {
    const url = `${JUPITER_PRICE_API_BASE_URL}/price?ids=${ids}&vsToken=${vsToken}`
    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      console.error(`Jupiter Price API error: ${response.status} - ${errorData.message}`)
      return NextResponse.json({ error: `Failed to fetch prices: ${errorData.message}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching Jupiter prices:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
