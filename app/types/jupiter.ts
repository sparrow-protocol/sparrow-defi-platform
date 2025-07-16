export interface JupiterTokenInfo {
  id: string
  name: string
  symbol: string
  icon?: string
  decimals: number
  isVerified?: boolean
  organicScore?: number
  usdPrice?: number
  // ...extend with more V2 metadata if needed
}
