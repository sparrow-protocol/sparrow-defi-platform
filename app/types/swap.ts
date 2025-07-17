import type { TokenInfo } from "./tokens"

export interface SwapQuote {
  inputMint: string
  outputMint: string
  inAmount: string // Raw amount in smallest units
  outAmount: string // Raw amount in smallest units
  outAmountWithSlippage: string // Raw amount with slippage applied
  priceImpactPct: number // Percentage (e.g., 0.01 for 1%)
  marketInfos: Array<{
    id: string
    label: string
    inputMint: string
    outputMint: string
    inAmount: string
    outAmount: string
    feeAmount: string
    feeMint: string
  }>
  amount: string // The original amount passed to the quote API
  slippageBps: number // Slippage in basis points
  otherAmountThreshold: string
  swapMode: "ExactIn" | "ExactOut"
  fees?: {
    signatureFee: number
    openOrdersDeposits: number[]
    ataDeposits: number[]
    totalFeeAndDeposits: number
    minimumSOLForTransaction: number
  }
}

export interface SwapTransaction {
  serializedTransaction: string // Base64 encoded transaction
  lastValidBlockHeight: number
  blockhash: string
}

export interface SwapSettings {
  slippageBps: number
}

export interface SwapInput {
  token: TokenInfo | null
  amount: string
  usdValue: number
}
