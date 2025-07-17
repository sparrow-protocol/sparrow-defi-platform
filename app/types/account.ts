import type { PublicKey } from "@solana/web3.js"

export type AccountInfo = {
  publicKey: PublicKey
  balance: number // SOL balance
  tokenAccounts: TokenAccount[]
}

export type TokenAccount = {
  mint: PublicKey
  address: PublicKey
  amount: number
  decimals: number
  uiAmount: number
  uiAmountString: string
  tokenSymbol?: string
  tokenName?: string
  tokenIcon?: string
}
