export interface SwapSettings {
  slippage: number
  transactionSpeed: "auto" | "fast" | "slow"
  mevProtection: boolean
  customFee: number
  platformFeeBps: number
}

export type TransactionStatus = "pending" | "completed" | "failed"
export type TransactionType = "swap" | "payment"

export interface Transaction {
  id?: number
  userPublicKey: string
  signature?: string | null
  status?: TransactionStatus
  createdAt?: string
  type: TransactionType

  // Swap-specific
  inputMint?: string
  outputMint?: string
  inputAmount?: string // Amount in smallest units
  outputAmount?: string // Amount in smallest units

  // Payment-specific (Solana Pay)
  paymentRecipient?: string
  paymentAmount?: string // In SOL or smallest units of SPL token
  paymentSplToken?: string // Mint address of SPL token
  paymentLabel?: string
  paymentMessage?: string
}
