export interface Token {
  [x: string]: any
  address: string              // Token mint address
  symbol: string               // Short symbol like "USDC"
  name: string                 // Full name like "USD Coin"
  decimals: number            // Decimal precision (e.g., 6 for USDC)
  icon?: string               // Optional icon URL
  tags?: string[]             // Optional tags like ["stablecoin", "wrapped"]
  isVerified?: boolean        // Optional verification flag
  organicScore?: number       // Optional trust/quality score from source
  usdPrice?: number           // Optional real-time price in USD
}
