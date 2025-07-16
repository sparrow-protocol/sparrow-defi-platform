"use client"

import { useState, useEffect, useCallback } from "react"
import type { Token } from "@/app/types/tokens"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { ChartDataPoint } from "@/app/types/charts"
import { format } from "date-fns"

interface TokenChartProps {
  sellingToken: Token | null
  buyingToken: Token | null
}

export function TokenChart({ sellingToken, buyingToken }: TokenChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"24h" | "7d" | "30d">("24h")

  const title =
    sellingToken && buyingToken ? `${sellingToken.symbol} / ${buyingToken.symbol} Price Chart` : "Token Price Chart"

  const fetchChartData = useCallback(async () => {
    if (!sellingToken) {
      setChartData([])
      setError("Please select a token to view its chart.")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      // Fetch data for the selling token (as a primary example)
      // In a real scenario, you might fetch a pair's price or both tokens' prices against a common base.
      const response = await fetch(`/api/chart-data?mint=${sellingToken.mint}&timeframe=${selectedTimeframe}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch chart data")
      }
      const data: ChartDataPoint[] = await response.json()
      setChartData(data)
    } catch (err: any) {
      console.error("Error fetching chart data:", err)
      setError(err.message || "Failed to load chart data.")
      setChartData([])
    } finally {
      setIsLoading(false)
    }
  }, [sellingToken, selectedTimeframe])

  useEffect(() => {
    fetchChartData()
  }, [fetchChartData])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-gold">{title}</CardTitle>
        <div className="flex space-x-2 mt-2">
          <Button
            variant={selectedTimeframe === "24h" ? "gold-filled" : "ghost"}
            size="sm"
            onClick={() => setSelectedTimeframe("24h")}
            className="text-xs"
          >
            24h
          </Button>
          <Button
            variant={selectedTimeframe === "7d" ? "gold-filled" : "ghost"}
            size="sm"
            onClick={() => setSelectedTimeframe("7d")}
            className="text-xs"
          >
            7d
          </Button>
          <Button
            variant={selectedTimeframe === "30d" ? "gold-filled" : "ghost"}
            size="sm"
            onClick={() => setSelectedTimeframe("30d")}
            className="text-xs"
          >
            30d
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-gold" />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-negative-red text-center">Error: {error}</div>
          ) : chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-black/70 dark:text-light-gray">
              No chart data available for the selected token or timeframe.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(unixTime) => format(new Date(unixTime), "MMM dd")}
                  stroke="hsl(var(--foreground))"
                />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  labelFormatter={(label) => format(new Date(label), "MMM dd, HH:mm")}
                  formatter={(value: number) => [`$${value.toFixed(6)}`, "Price"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--gold))" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Removed the "Note: Chart data is simulated" message */}
      </CardContent>
    </Card>
  )
}
