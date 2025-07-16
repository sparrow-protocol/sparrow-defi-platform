import type { Token } from "./tokens"
import type { JupiterQuoteResponse } from "./jupiter"
import type { RaydiumSwapQuote } from "./raydium"

/**
 * Enum to represent supported swap platforms.
 */
export type SwapAggregator = "jupiter" | "raydium"

/**
 * Common input for performing a token swap.
 */
export interface SwapInput {
  fromToken: Token
  toToken: Token
  amount: string // Amount in smallest unit (e.g., lamports or token decimals)
  aggregator: SwapAggregator
}

/**
 * Union type for supported quote response types.
 */
export type SwapQuote = JupiterQuoteResponse | RaydiumSwapQuote

/**
 * Represents the result of a token swap operation.
 */
export interface SwapResult {
  quote: SwapQuote
  aggregator: SwapAggregator
  transactionSignature: string
  status: "success" | "failed" | "pending"
  timestamp: number
}
