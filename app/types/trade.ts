// app/types/trade.ts
export interface TradeOrder {
  id: string
  type: "buy" | "sell"
  tokenPair: string // e.g., "SOL/USDC"
  price: number
  amount: number
  total: number
  status: "open" | "filled" | "cancelled"
  timestamp: number
}

export interface TradeHistoryEntry {
  id: string
  tokenPair: string
  price: number
  amount: number
  type: "buy" | "sell"
  timestamp: number
}
