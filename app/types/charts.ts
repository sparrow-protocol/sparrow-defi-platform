// app/types/charts.ts
export interface ChartDataPoint {
  time: number // Timestamp or date
  value: number // Price or volume
}

export interface TokenPriceHistory {
  mint: string
  symbol: string
  data: ChartDataPoint[]
}
