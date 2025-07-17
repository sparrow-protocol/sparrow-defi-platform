import type { PublicKey } from "@solana/web3.js"

export type TradeDirection = "buy" | "sell"

export type TradeType = "market" | "limit"

export type TradeStatus = "open" | "filled" | "cancelled" | "partial_fill"

export interface TradeOrder {
  id: string
  market: string // e.g., SOL/USDC
  direction: TradeDirection
  type: TradeType
  price: number
  amount: number
  filledAmount: number
  status: TradeStatus
  createdAt: number
  updatedAt: number
}

export interface TradePair {
  baseMint: PublicKey
  quoteMint: PublicKey
  baseSymbol: string
  quoteSymbol: string
  baseName: string
  quoteName: string
  baseIcon?: string
  quoteIcon?: string
  price: number
  volume24h: number
  change24h: number
}

export interface TradeQuote {
  inAmount: number
  outAmount: number
  priceImpact: number
  slippage: number
  route: string[] // List of intermediate tokens/pools
  fees: {
    amount: number
    mint: PublicKey
    symbol: string
  }[]
}

export interface TradeHistoryItem {
  signature: string
  timestamp: number
  type: "swap" | "transfer" | "unknown"
  status: "success" | "failed"
  amount?: number
  tokenSymbol?: string
  from?: string
  to?: string
  // For swaps
  inputAmount?: number
  inputTokenSymbol?: string
  outputAmount?: number
  outputTokenSymbol?: string
}
