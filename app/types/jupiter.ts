export interface JupiterPoolInfo {
  address: string
  programId: string
  type: string
  mintA: string
  mintB: string
  reserveA: string
  reserveB: string
  feeRate: number
  openTime?: number
}

export interface JupiterRoute {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  outAmountWithSlippage: string
  priceImpactPct: number
  marketInfos: Array<{
    id: string
    label: string
    inputMint: string
    outputMint: string
    inAmount: string
    outAmount: string
    feeAmount: string
    feeMint: string
  }>
  amount: string
  slippageBps: number
  otherAmountThreshold: string
  swapMode: "ExactIn" | "ExactOut"
  fees?: {
    signatureFee: number
    openOrdersDeposits: number[]
    ataDeposits: number[]
    totalFeeAndDeposits: number
    minimumSOLForTransaction: number
  }
}
