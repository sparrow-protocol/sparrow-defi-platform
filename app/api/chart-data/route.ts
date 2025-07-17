import { type NextRequest, NextResponse } from "next/server"
import { BIRDEYE_API_BASE_URL, BIRDEYE_API_KEY, COINGECKO_ID_MAP } from "@/app/lib/constants"
import type { ChartDataPoint } from "@/app/types/chart"

// Helper to fetch data from CoinGecko
async function fetchCoinGeckoData(coinId: string, days: string, interval: string): Promise<ChartDataPoint[]> {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`)
    }
    const data = await response.json()
    // CoinGecko returns [timestamp, price] arrays
    return data.prices.map(([timestamp, price]: [number, number]) => ({
      time: Math.floor(timestamp / 1000), // Convert ms to seconds
      value: price,
    }))
  } catch (error) {
    console.error(`Error fetching CoinGecko data for ${coinId}:`, error)
    return []
  }
}

// Helper to fetch data from Birdeye
async function fetchBirdeyeData(mint: string, timeframe: string): Promise<ChartDataPoint[]> {
  if (!BIRDEYE_API_KEY) {
    console.warn("BIRDEYE_API_KEY is not set. Cannot fetch Birdeye data.")
    return []
  }

  let interval: string
  let limit: number
  switch (timeframe) {
    case "24h":
      interval = "1m" // 1 minute interval for 24 hours
      limit = 1440 // 24 * 60
      break
    case "7d":
      interval = "1h" // 1 hour interval for 7 days
      limit = 168 // 7 * 24
      break
    case "30d":
      interval = "4h" // 4 hour interval for 30 days
      limit = 180 // 30 * 24 / 4
      break
    default:
      interval = "1h"
      limit = 168
  }

  const url = `${BIRDEYE_API_BASE_URL}/defi/history_price?address=${mint}&address_type=token&type=${interval}&time_from=${Math.floor(Date.now() / 1000) - limit * 60}&time_to=${Math.floor(Date.now() / 1000)}`
  try {
    const response = await fetch(url, {
      headers: {
        "X-API-KEY": BIRDEYE_API_KEY,
      },
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Birdeye API error: ${response.statusText}. Details: ${errorData.message || "unknown"}`)
    }
    const data = await response.json()
    if (data.success && data.data) {
      return data.data.map((item: any) => ({
        time: item.unixTime, // Birdeye returns unix timestamp in seconds
        value: item.value,
      }))
    }
    return []
  } catch (error) {
    console.error(`Error fetching Birdeye data for ${mint}:`, error)
    return []
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mint = searchParams.get("mint")
  const timeframe = searchParams.get("timeframe") || "24h" // Default to 24h

  if (!mint) {
    return NextResponse.json({ error: "Mint address is required" }, { status: 400 })
  }

  let chartData: ChartDataPoint[] = []

  // Try CoinGecko first if a mapping exists
  const coinId = COINGECKO_ID_MAP[mint]
  if (coinId) {
    let days: string
    let interval: string
    switch (timeframe) {
      case "24h":
        days = "1"
        interval = "hourly"
        break
      case "7d":
        days = "7"
        interval = "hourly"
        break
      case "30d":
        days = "30"
        interval = "daily"
        break
      default:
        days = "1"
        interval = "hourly"
    }
    chartData = await fetchCoinGeckoData(coinId, days, interval)
  }

  // If CoinGecko fails or no mapping, try Birdeye
  if (chartData.length === 0) {
    chartData = await fetchBirdeyeData(mint, timeframe)
  }

  if (chartData.length === 0) {
    return NextResponse.json({ error: "No chart data available for this token or timeframe." }, { status: 404 })
  }

  return NextResponse.json(chartData)
}
