import type { PublicKey, SignatureResult, TransactionSignature } from "@solana/web3.js"

export type TransactionStatus = "pending" | "confirmed" | "failed"

export type TransactionDetails = {
  signature: TransactionSignature
  status: SignatureResult["err"] | null
  blockTime: number | null
  slot: number | null
  fee: number | null
  lamports: number | null
  type: "transfer" | "swap" | "unknown"
  source?: PublicKey
  destination?: PublicKey
  amount?: number
  tokenMint?: PublicKey
  tokenSymbol?: string
  tokenName?: string
  tokenIcon?: string
}

export type TransactionHistoryItem = {
  signature: string
  timestamp: number
  type: "transfer" | "swap" | "mint" | "burn" | "unknown"
  status: "success" | "failed"
  amount?: number
  tokenSymbol?: string
  from?: string
  to?: string
}
