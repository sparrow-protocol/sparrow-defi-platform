// app/types/api.ts

// Jupiter Aggregator API Types (simplified)
export interface JupiterQuoteResponse {
  inAmount: string
  outAmount: string
  outAmountWithSlippage: string
  priceImpactPct: number
  routePlan: any[] // Detailed route plan would go here
  swapMode: string
  platformFee?: {
    // New: Optional platform fee details
    amount: string // Amount of fee in smallest units
    mint: string // Mint address of the token the fee is collected in
  }
  // Add other fields as per Jupiter API documentation
}

export interface JupiterSwapResponse {
  swapTransaction: string // Base64 encoded transaction
  // Add other fields as per Jupiter API documentation
}

// Raydium API Types (simplified)
export interface RaydiumPoolInfo {
  id: string
  lpMint: string
  baseMint: string
  quoteMint: string
  baseVault: string
  quoteVault: string
  lpVault: string
  // Add other fields as per Raydium API documentation
}

// Jupiter Price API Types
export interface JupiterPriceInfo {
  id: string
  type: string
  price: string // Price as a string
  extraInfo?: any // Optional extra info
}

export interface JupiterPriceResponse {
  data: {
    [mintAddress: string]: JupiterPriceInfo
  }
  timeTaken: number
}
