export interface User {
  id: string // Database ID
  privyId: string // Privy user ID
  email: string | null
  phone: string | null
  walletAddress: string | null // Primary Solana wallet address
  embeddedWalletAddress: string | null // Privy embedded wallet address
  username: string | null
  avatarUrl: string | null
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  notifications: boolean
  slippageTolerance?: number // Default slippage for swaps
  favoriteTokens?: string[] // Array of token mint addresses
}
