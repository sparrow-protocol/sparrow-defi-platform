export interface FeeConfig {
  platformFeeBps: number // Basis points for platform fee (e.g., 20 for 0.2%)
  platformFeeAccount: string // Solana address for platform fee recipient
  transactionFeePercentage: number // Percentage for custom transaction fees (e.g., 0.05 for 0.05%)
}

export interface CalculatedFees {
  platformFee: {
    amount: number // Amount in base token
    amountUsd: number // Amount in USD
    tokenMint: string
    tokenSymbol: string
  } | null
  solanaNetworkFee: {
    amount: number // Amount in SOL (lamports)
    amountSol: number // Amount in SOL
    amountUsd: number // Amount in USD
  }
  totalFeesUsd: number
}
