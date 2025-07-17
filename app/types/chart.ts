export type ChartDataPoint = {
  time: number // Unix timestamp in seconds
  value: number // Price
  volume?: number
  high?: number
  low?: number
  open?: number
  close?: number
}

export type TokenChartData = {
  symbol: string
  mint: string
  data: ChartDataPoint[]
  timeframe: ChartTimeframe
  lastUpdated: number
}

export type ChartTimeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w"

export type ChartInterval = "minutely" | "hourly" | "daily"

export interface ChartConfig {
  timeframe: ChartTimeframe
  showVolume: boolean
  showMA: boolean
  maLength: number
  theme: "light" | "dark"
}

export interface PriceChange {
  value: number
  percentage: number
  timeframe: string
}

export interface MarketStats {
  price: number
  priceChange24h: PriceChange
  volume24h: number
  volumeChange24h: PriceChange
  marketCap?: number
  fdv?: number
  supply?: {
    total: number
    circulating: number
  }
}
