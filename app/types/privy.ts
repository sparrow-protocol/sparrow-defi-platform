import type { Wallet } from "@privy-io/react-auth"

export interface PrivyUser {
  id: string
  email?: {
    address: string
    verified: boolean
  }
  phone?: {
    number: string
    verified: boolean
  }
  wallet?: Wallet // The primary wallet connected to Privy
  linkedAccounts?: Wallet[] // Other wallets linked to the Privy account
  publicAddress?: string // The primary public address
  username?: string
  profileImage?: string
  createdAt?: string
  lastLoginAt?: string
}
