import type { Token } from "./tokens"
import type { JupiterQuoteResponse } from "./jupiter"

// Basic swap input structure
export interface SwapInput {
  fromToken: Token
  toToken: Token
  amount: string // Input amount in base units (e.g., lamports)
}

// Result of a completed swap operation
export interface SwapResult {
  quote: JupiterQuoteResponse
  transactionSignature: string
  status: "success" | "failed" | "pending"
  timestamp: number
}

// Generic fetch status (used for UI state management)
export type FetchStatus = "idle" | "loading" | "success" | "error"

// UI toast type for notifications
export interface ToastMessage {
  id: string
  type: "success" | "error" | "info" | "warning"
  title?: string
  message: string
  duration?: number // in ms
}

// Used for wallet-based operations
export interface WalletInfo {
  address: string
  label?: string
  connected: boolean
}

// Optional: general API error format
export interface APIError {
  status: number
  message: string
  details?: string
}
