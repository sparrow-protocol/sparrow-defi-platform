export * from "./raydium"
export * from "./jupiter"

export interface PoolData {
  id: string
  dex: "Raydium" | "Jupiter" | "Orca" | "Serum"
  tokenA: {
    mint: string
    symbol: string
    decimals: number
    reserve: number
  }
  tokenB: {
    mint: string
    symbol: string
    decimals: number
    reserve: number
  }
  tvl: number
  volume24h: number
  fee: number
  apy?: number
  price: number
  priceChange24h: number
}

export interface LiquidityPool extends PoolData {
  lpTokenMint: string
  lpTokenSupply: number
  userLpBalance?: number
  userSharePercent?: number
}
