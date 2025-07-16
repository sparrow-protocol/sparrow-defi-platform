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

export interface JupiterRecurringOrderResponse {
  id: string
  user: string
  inputMint: string
  outputMint: string
  inputAmount: string
  outputAmount: string
  createdAt: number
  updatedAt: number
  status: 'active' | 'paused' | 'executed' | 'cancelled'
  recurringType: 'time' | 'price'
  frequency?: string
  triggerPrice?: string
  nextExecutionTime?: number
}

export interface JupiterPriceResponse {
  data: {
    [mintAddress: string]: {
      id: string
      mint: string
      vsToken: string
      price: number
      lastUpdated: number
    }
  }
}
