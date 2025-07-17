export interface PaymentRequest {
  id: string
  amount: number
  currency: "SOL" | "SPL" | "USD" // Currency of the amount (e.g., SOL, USDC, USD)
  recipient: string // Solana public key of the recipient
  memo?: string // Optional memo for the transaction
  reference?: string // Optional reference for the transaction (e.g., order ID)
  label?: string // Optional label for the payment (e.g., "Coffee")
  message?: string // Optional message for the payment (e.g., "Thanks for the coffee!")
  splToken?: string // Optional SPL token mint address if currency is SPL
  status?: "pending" | "completed" | "failed" | "processing" | "expired"
  signature?: string // Transaction signature once completed
  created_at?: Date // Timestamp of creation
  updated_at?: Date // Timestamp of last update
}

export interface PaymentStatus {
  id: string
  status: "pending" | "completed" | "failed" | "processing" | "expired"
  signature?: string
  createdAt: number
  updatedAt: number
}
