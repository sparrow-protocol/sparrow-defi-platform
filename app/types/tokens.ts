export interface Token {
  address: string               // Token mint address (e.g., USDC mint)
  symbol: string                // Token symbol (e.g., "USDC")
  name: string                  // Full token name (e.g., "USD Coin")
  decimals: number             // Number of decimal places (e.g., 6 for USDC)
  icon?: string                // Optional icon URL (Jupiter/Coingecko often provide this)
  tags?: string[]              // Optional tags (e.g., ["stablecoin", "wrapped"])
  isVerified?: boolean         // Optional verification flag (from token list)
  organicScore?: number        // Optional trust or quality score
  usdPrice?: number            // Optional real-time USD price (if fetched)
  [x: string]: any             // Allow extra dynamic fields if needed
}
