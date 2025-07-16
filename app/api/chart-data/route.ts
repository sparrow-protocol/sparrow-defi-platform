// app/api/chart-data/route.ts
import { NextResponse } from "next/server"
import type { ChartDataPoint } from "@/app/types/charts"
import { COINGECKO_API_BASE_URL, COINGECKO_ID_MAP } from "@/app/lib/constants"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mint = searchParams.get("mint")
  const timeframe = searchParams.get("timeframe") || "24h" // e.g., "24h", "7d", "30d"

  if (!mint) {
    return NextResponse.json({ error: "Mint address is required" }, { status: 400 })
  }

  const coingeckoId = COINGECKO_ID_MAP[mint]

  if (!coingeckoId) {
    return NextResponse.json(
      { error: `Chart data not available for this token (CoinGecko ID not found for mint: ${mint}).` },
      { status: 404 },
    )
  }

  let days: string
  let interval: string
  switch (timeframe) {
    case "24h":
      days = "1"
      interval = "hourly"
      break
    case "7d":
      days = "7"
      interval = "daily"
      break
    case "30d":
      days = "30"
      interval = "daily"
      break
    default:
      days = "1"
      interval = "hourly"
  }

  try {
    const url = `${COINGECKO_API_BASE_URL}/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
    console.log(`Fetching chart data from CoinGecko: ${url}`)

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `Error fetching chart data from CoinGecko: ${response.status} - ${response.statusText}. Details: ${errorText}`,
      )
      return NextResponse.json(
        { error: `Failed to fetch chart data from CoinGecko: ${response.statusText || "Unknown error"}` },
        { status: response.status },
      )
    }

    const data = await response.json()

    if (!data || !data.prices) {
      return NextResponse.json({ error: "Invalid data format from CoinGecko API." }, { status: 500 })
    }

    // CoinGecko returns prices as [timestamp, price] arrays
    const chartData: ChartDataPoint[] = data.prices.map((point: [number, number]) => ({
      time: point[0], // Timestamp in milliseconds
      value: point[1], // Price
    }))

    return NextResponse.json(chartData)
  } catch (error) {
    console.error("Failed to fetch chart data:", error)
    return NextResponse.json({ error: "Failed to fetch chart data due to server error." }, { status: 500 })
  }
}
