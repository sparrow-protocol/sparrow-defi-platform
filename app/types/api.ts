export interface JupiterQuoteResponse {
  inAmount: string
  outAmount: string
  outAmountWithSlippage: string
  priceImpactPct: number
  swapMode: string
  platformFee?: {
    amount: string
    mint: string
  }
  routePlan: JupiterRoutePlan[]
}

export interface JupiterRecurringOrderResponse {
  id: string
  user: string
  inputMint: string
  outputMint: string
  amount: string
  frequency: string
  recurringType: string
  status: string
  createdAt: string
  updatedAt?: string
  nextExecutionTime?: string
  [key: string]: any
}

export interface JupiterRoutePlan {
  amount: string
  swapInfo: {
    amm: string
    label: string
    inputMint: string
    outputMint: string
    inAmount: string
    outAmount: string
    feeAmount: string
    feeMint: string
  }
}

export interface JupiterPriceResponse {
  data: {
    [mintAddress: string]: {
      id: string
      mintSymbol: string
      vsToken: string
      vsTokenSymbol: string
      price: number
    }
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
