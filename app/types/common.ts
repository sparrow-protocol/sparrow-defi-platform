// app/types/common.ts
// Token interface moved to app/types/tokens.ts

export interface SwapSettings {
  slippage: number // Percentage, e.g., 0.5 for 0.5%
  transactionSpeed: "auto" | "fast" | "turbo"
  mevProtection: boolean
  customFee: number // Percentage, e.g., 0.05 for 0.05%
  platformFeeBps: number // New: Jupiter's platform fee in basis points
}

export interface Transaction {
  id?: number
  userPublicKey: string
  signature?: string | null
  status?: "pending" | "completed" | "failed"
  createdAt?: string
  type: "swap" | "payment" // New required field

  // Fields specific to Swaps
  inputMint?: string
  outputMint?: string
  inputAmount?: string // Amount of input token in smallest units
  outputAmount?: string // Amount of output token in smallest units

  // Fields specific to Payments (Solana Pay)
  paymentRecipient?: string // Public key string of the recipient
  paymentAmount?: string // Amount of SOL or SPL token
  paymentSplToken?: string // Mint address of SPL token if applicable
  paymentLabel?: string
  paymentMessage?: string
}
