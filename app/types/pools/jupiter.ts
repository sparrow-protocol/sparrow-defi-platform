export interface JupiterPoolInfo {
  address: string
  programId: string
  type: "Raydium" | "Orca" | "Serum" | "Saber" | "Aldrin" | "Crema" | "Lifinity" | "Mercurial" | "Cykura" | "Whirlpool"
  tokenA: {
    mint: string
    reserve: number
  }
  tokenB: {
    mint: string
    reserve: number
  }
  fee: number
  tvl: number
  volume24h: number
  apy?: number
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
