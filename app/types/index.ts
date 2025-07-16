export interface Token {
  symbol: string
  name: string
  mint: string
  icon: string
}

export interface Quote {
  inAmount: string
  outAmount: string
  priceImpact: number
  // Add other relevant quote details
}
