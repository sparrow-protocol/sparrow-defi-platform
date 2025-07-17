export interface Token {
  address: string // Token mint address (e.g., USDC mint)
  chainId: number
  decimals: number // Number of decimal places (e.g., 6 for USDC)
  name: string // Full token name (e.g., "USD Coin")
  symbol: string // Token symbol (e.g., "USDC")
  logoURI?: string // Optional icon URL (Jupiter/Coingecko often provide this)
  tags?: string[] // Optional tags (e.g., ["stablecoin", "wrapped"])
  extensions?: { [key: string]: any }
  // Custom fields for UI
  price?: number // Optional real-time USD price (if fetched)
  priceChange24h?: number // Optional 24h price change
  isVerified?: boolean // Optional verification flag (from token list)
  organicScore?: number // Optional trust or quality score
  [x: string]: any // Allow extra dynamic fields if needed
}
