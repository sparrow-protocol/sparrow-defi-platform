import type { Token } from "./tokens"
import type { JupiterQuoteResponse } from "./api"

export interface SwapInput {
  fromToken: Token
  toToken: Token
  amount: string
}

export interface SwapResult {
  quote: JupiterQuoteResponse
  transactionSignature: string
  status: "success" | "failed" | "pending"
  timestamp: number
}
