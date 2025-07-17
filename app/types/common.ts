export interface SwapSettings {
  slippage: number
  transactionSpeed: "auto" | "fast" | "slow"
  mevProtection: boolean
  customFee: number
  platformFeeBps: number
}

export type TransactionStatus = "pending" | "confirmed" | "failed"
export type TransactionType = "swap" | "payment" | "transfer" | "mint" | "burn" | "unknown"

export interface Transaction {
  id: string
  userPublicKey: string
  signature: string | null
  status: TransactionStatus
  type: TransactionType
  inputMint?: string | null
  outputMint?: string | null
  inputAmount?: number | null
  outputAmount?: number | null
  paymentRecipient?: string | null
  paymentAmount?: number | null
  paymentSplToken?: string | null
  paymentLabel?: string | null
  paymentMessage?: string | null
  createdAt: Date
  updatedAt?: Date
}

export interface TokenMetadata {
  mint: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
  tags?: string[]
  extensions?: { [key: string]: any }
}
