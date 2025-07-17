import type { PublicKey } from "@solana/web3.js"

/**
 * Represents a transaction request conforming to the Solana Pay spec.
 */
export interface SolanaPayTransactionRequest {
  recipient: PublicKey // Destination wallet address
  amount: number // Amount to send (in SOL or token units)
  splToken?: PublicKey // Optional: SPL token mint address for token transfers
  reference?: PublicKey // Optional: Used to track or associate payment with external systems
  label?: string // Optional: UI-friendly merchant name or label
  message?: string // Optional: Description or note for the transaction
}

export interface SolanaPayTransactionResponse {
  transaction: string // Base64 encoded serialized transaction
  message?: string
}

/**
 * Props for generating a Solana Pay-compatible QR code.
 */
export interface SolanaPayQRProps {
  recipient: string
  amount: number
  splToken?: string
  label?: string
  message?: string
  size?: number
  level?: "L" | "M" | "Q" | "H"
  fgColor?: string
  bgColor?: string
  includeLogo?: boolean
  logoSrc?: string
  logoWidth?: number
  logoHeight?: number
  logoOpacity?: number
}
