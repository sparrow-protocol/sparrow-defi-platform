export interface RaydiumToken {
  mint: string
  symbol: string
  name: string
  decimals: number
  icon: string
  tags: string[]
}

export interface RaydiumPool {
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
  marketVersion: number
  marketProgramId: string
  marketId: string
  marketAuthority: string
  marketBaseVault: string
  marketQuoteVault: string
  marketBids: string
  marketAsks: string
  marketEventQueue: string
  lookupTableAccount?: string
  official: boolean
}

export interface RaydiumFarm {
  id: string
  lpMint: string
  rewardMints: string[]
  version: number
  programId: string
  authority: string
  lpVault: string
  rewardVaults: string[]
  poolId: string
  poolOpenOrders: string
  poolTargetOrders: string
  poolWithdrawQueue: string
  poolLpVault: string
  poolMarketId: string
  poolMarketProgramId: string
  poolMarketAuthority: string
  poolMarketBaseVault: string
  poolMarketQuoteVault: string
  poolMarketBids: string
  poolMarketAsks: string
  poolMarketEventQueue: string
}
