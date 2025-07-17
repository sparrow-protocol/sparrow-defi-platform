"use server"

import type { ChartDataPoint, ChartTimeframe } from "@/app/types/chart"
import { BIRDEYE_API_BASE_URL, BIRDEYE_API_KEY } from "@/app/lib/constants"

interface BirdeyeChartResponse {
  data: {
    items: Array<{
      unixTime: number
      value: number
      volume: number
      high: number
      low: number
      open: number
      close: number
    }>
  }
  success: boolean
}

export async function getChartData(mint: string, vsMint: string, timeframe: ChartTimeframe): Promise<ChartDataPoint[]> {
  if (!BIRDEYE_API_KEY) {
    console.warn("BIRDEYE_API_KEY is not set. Cannot fetch chart data.")
    return []
  }

  const intervalMap: Record<ChartTimeframe, string> = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "1h": "1h",
    "4h": "4h",
    "1d": "1d",
    "1w": "1d", // Birdeye doesn't have a direct '1w' interval, use '1d' for longer periods
  }

  const limitMap: Record<ChartTimeframe, number> = {
    "1m": 60, // 1 hour of 1-min data
    "5m": 288, // 24 hours of 5-min data
    "15m": 96, // 24 hours of 15-min data
    "1h": 168, // 7 days of 1-hour data
    "4h": 168, // 28 days of 4-hour data (approx)
    "1d": 90, // 90 days of 1-day data
    "1w": 365, // 1 year of 1-day data (approx)
  }

  const interval = intervalMap[timeframe] || "1h"
  const limit = limitMap[timeframe] || 168

  const url = `${BIRDEYE_API_BASE_URL}/defi/history_price?address=${mint}&vs_token=${vsMint}&timeframe=${interval}&limit=${limit}`

  try {
    const response = await fetch(url, {
      headers: {
        "X-API-KEY": BIRDEYE_API_KEY,
      },
      next: {
        revalidate: 60, // Revalidate every 60 seconds
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Failed to fetch chart data from Birdeye: ${response.status} ${response.statusText} - ${errorText}`,
      )
    }

    const data: BirdeyeChartResponse = await response.json()

    if (!data.success || !data.data?.items) {
      console.warn("Birdeye API returned no data or success false:", data)
      return []
    }

    // Birdeye returns unixTime in seconds
    const chartDataPoints: ChartDataPoint[] = data.data.items.map((item) => ({
      time: item.unixTime,
      value: item.value,
      volume: item.volume,
      high: item.high,
      low: item.low,
      open: item.open,
      close: item.close,
    }))

    return chartDataPoints.sort((a, b) => a.time - b.time) // Ensure data is sorted by time
  } catch (error) {
    console.error("Error in getChartData:", error)
    throw error
  }
}
