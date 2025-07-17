export interface RaydiumPoolInfo {
  id: string
  baseMint: string
  quoteMint: string
  lpMint: string
  baseDecimals: number
  quoteDecimals: number
  lpDecimals: number
  version: number
  programId: string
  authority: string
  openOrders: string
  targetOrders: string
  baseVault: string
  quoteVault: string
  withdrawQueue: string
  lpVault: string
  marketId: string
  marketProgramId: string
  marketAuthority: string
  marketBaseVault: string
  marketQuoteVault: string
  marketBids: string
  marketAsks: string
  marketEventQueue: string
  lookupTableAccount?: string
  official: boolean
}

export interface RaydiumPoolStats {
  id: string
  tvl: number
  volume24h: number
  volume7d: number
  fee24h: number
  fee7d: number
  apr: number
  apy: number
  price: number
  priceChange24h: number
  lpPrice: number
  baseReserve: number
  quoteReserve: number
}

export interface RaydiumLiquidityPosition {
  poolId: string
  lpAmount: number
  baseAmount: number
  quoteAmount: number
  sharePercent: number
  value: number
}
