export type TokenBalance = {
  mint: string
  amount: string
  decimals: number
  uiAmount: number
  uiAmountString: string
  symbol?: string
  name?: string
  icon?: string
}

export interface Balance {
  tokenAddress: string
  tokenSymbol: string
  tokenName: string
  balance: number // UI amount
  usdValue: number
  price: number | null
  priceChange24h: number | null
  icon: string | null
}

export type WalletBalance = {
  sol: number
  tokens: TokenBalance[]
  balances: Balance[]
}
