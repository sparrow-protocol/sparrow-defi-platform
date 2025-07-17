// Generic API Response structure
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Example: Token Price API Response
export interface TokenPriceApiResponse {
  mint: string
  vsMint: string
  price: number
}

// Example: Chart Data API Response
export interface ChartDataApiResponse {
  time: number
  value: number
}

// Example: Swap Quote API Response
export interface SwapQuoteApiResponse {
  quote: any // JupiterRoute or similar
}

// Example: Transaction History API Response
export interface TransactionHistoryApiResponse {
  transactions: any[] // Array of TransactionHistoryItem or similar
}
