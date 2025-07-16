export interface RaydiumSwapQuote {
  inAmount: string
  outAmount: string
  expectedSlippage: number
  priceImpactPct: number
  route: string[]
  fees?: {
    platformFee: string
    liquidityFee: string
  }
}

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
  marketBaseMintDecimals: number
  marketQuoteMintDecimals: number
  official: boolean
}
