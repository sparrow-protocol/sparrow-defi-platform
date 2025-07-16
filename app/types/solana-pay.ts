// app/types/solana-pay.ts
import type { PublicKey } from "@solana/web3.js"

export interface SolanaPayTransactionRequest {
  recipient: PublicKey
  amount: number
  splToken?: PublicKey // Optional: for SPL token payments
  reference?: PublicKey[] // Optional: for linking to external records
  label?: string
  message?: string
  memo?: string // Optional: for transaction memo
}

export interface SolanaPayQRProps {
  url: string
  size?: number
}
