export const SOLANA_NETWORK = process.env.NODE_ENV === "production" ? "mainnet-beta" : "devnet"

export const RPC_ENDPOINTS = {
  HELIUS: process.env.NEXT_PUBLIC_HELIUS_RPC_URL!,
  SOLANA_1: process.env.NEXT_PUBLIC_SOLANA_RPC_1!,
  SOLANA_2: process.env.NEXT_PUBLIC_SOLANA_RPC_2!,
  SOLANA_3: process.env.NEXT_PUBLIC_SOLANA_RPC_3!,
}

export const TOKEN_ADDRESSES = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  SPRW: process.env.NEXT_PUBLIC_SPRW_MINT!,
}

export const PROGRAM_IDS = {
  TOKEN: process.env.NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID!,
  TOKEN_2022: process.env.NEXT_PUBLIC_SPL_TOKEN_2022_PROGRAM_ID!,
  ASSOCIATED_TOKEN: process.env.NEXT_PUBLIC_ASSOCIATED_TOKEN_PROGRAM_ID!,
  JUPITER: process.env.NEXT_PUBLIC_JUPITER_PROGRAM_ID!,
  JUPITER_V6: process.env.NEXT_PUBLIC_JUPITER_V6_PROGRAM_ID!,
}

export const API_ENDPOINTS = {
  JUPITER: process.env.NEXT_PUBLIC_JUPITER_API_URL!,
  RAYDIUM: process.env.NEXT_PUBLIC_RAYDIUM_API_URL!,
  BIRDEYE: process.env.NEXT_PUBLIC_BIRDEYE_API_URL!,
  DEXSCREENER: process.env.NEXT_PUBLIC_DEXSCREENER_API_URL!,
}

export const DEFAULT_SLIPPAGE = 100 // 1%
export const MAX_SLIPPAGE = 5000 // 50%
export const DEFAULT_PRIORITY_FEE = 0.001 // SOL

// This file can be used for additional utility-specific constants
// that are not directly related to API endpoints or blockchain programs.

export const LOCAL_STORAGE_KEYS = {
  THEME: "theme",
  SWAP_SLIPPAGE: "swapSlippageBps",
  TOKEN_LIST_CACHE: "tokenListCache",
}

export const DEBOUNCE_TIME_MS = 500
export const THROTTLE_TIME_MS = 200
