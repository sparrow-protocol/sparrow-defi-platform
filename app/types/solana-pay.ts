import type { PublicKey } from "@solana/web3.js"

/**
 * Represents a transaction request conforming to the Solana Pay spec.
 */
export interface SolanaPayTransactionRequest {
  recipient: PublicKey // Destination wallet address
  amount: number // Amount to send (in SOL or token units)
  splToken?: PublicKey // Optional: SPL token mint address for token transfers
  reference?: PublicKey[] // Optional: Used to track or associate payment with external systems
  label?: string // Optional: UI-friendly merchant name or label
  message?: string // Optional: Description or note for the transaction
  memo?: string // Optional: On-chain memo attached to the transaction
}

/**
 * Props for generating a Solana Pay-compatible QR code.
 */
export interface SolanaPayQRProps {
  url: string // Solana Pay URL to encode
  size?: number // Optional: size of the QR code in pixels (default can be set in component)
}
