"use client"

import { useState, useEffect, useCallback } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CHART_TIMEFRAMES, SOL_MINT, USDC_MINT, UI_CONFIG } from "@/app/lib/constants"
import { getChartData } from "@/server/actions/chart"
import type { ChartDataPoint } from "@/app/types/chart"
import { formatCurrency, formatDate } from "@/app/lib/format"
import { Loader2 } from "lucide-react"

type TimeframeKey = keyof typeof CHART_TIMEFRAMES

export function TokenChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [timeframe, setTimeframe] = useState<TimeframeKey>("1d")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChartData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getChartData(SOL_MINT, USDC_MINT, timeframe)
      setChartData(data)
    } catch (err: any) {
      console.error("Error fetching chart data:", err)
      setError(err.message || "Failed to load chart data.")
    } finally {
      setIsLoading(false)
    }
  }, [timeframe])

  useEffect(() => {
    fetchChartData()
  }, [fetchChartData])

  // Auto-refresh chart data
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !error) {
        fetchChartData()
      }
    }, UI_CONFIG.CHART_UPDATE_INTERVAL)

    return () => clearInterval(interval)
  }, [isLoading, error, fetchChartData])

  const formatXAxis = (tickItem: number) => {
    const date = new Date(tickItem * 1000) // Convert seconds to milliseconds
    switch (timeframe) {
      case "1m":
      case "5m":
      case "15m":
      case "1h":
        return formatDate(date.getTime(), "time")
      case "4h":
      case "1d":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "1w":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })
      default:
        return ""
    }
  }

  const formatYAxis = (tickItem: number) => formatCurrency(tickItem, "USD", 4)

  return (
    <CardContent>
      <div className="flex justify-end gap-2 mb-4">
        {Object.entries(CHART_TIMEFRAMES).map(([key, value]) => (
          <Button
            key={key}
            variant={timeframe === key ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeframe(key as TimeframeKey)}
          >
            {value.label}
          </Button>
        ))}
      </div>
      <div className="h-[400px] w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading chart data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            <p>{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No chart data available for this timeframe.
          </div>
        ) : (
          <ChartContainer
            config={{
              price: {
                label: "Price",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  tickFormatter={formatXAxis}
                  minTickGap={50}
                  axisLine={false}
                  tickLine={false}
                  className="text-xs text-muted-foreground"
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={formatYAxis}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                  className="text-xs text-muted-foreground"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent formatter={(value) => formatCurrency(value, "USD", 4)} />}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-price)"
                  strokeWidth={2}
                  dot={false}
                  name="Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </CardContent>
  )
}
