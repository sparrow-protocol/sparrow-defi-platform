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
