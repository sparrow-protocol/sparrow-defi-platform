import { LAMPORTS_PER_SOL } from "@solana/web3.js"

// API URLs
export const JUPITER_API_BASE_URL = process.env.NEXT_PUBLIC_JUPITER_API_URL || "https://quote-api.jup.ag/v6"
export const RAYDIUM_API_BASE_URL = process.env.NEXT_PUBLIC_RAYDIUM_API_URL || "https://api.raydium.io/v2"
export const JUPITER_PRICE_API_BASE_URL = "https://price.jup.ag/v4"
export const JUPITER_TOKEN_LIST_URL = process.env.NEXT_PUBLIC_JUPITER_TOKEN_LIST_URL || "https://token.jup.ag/all"
export const SOLANA_LABS_TOKEN_LIST_URL =
  process.env.NEXT_PUBLIC_SOLANA_TOKEN_LIST_URL ||
  "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json"
export const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3"
export const BIRDEYE_API_BASE_URL = process.env.NEXT_PUBLIC_BIRDEYE_API_URL || "https://public-api.birdeye.so"
export const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY // Server-side only
export const DEXSCREENER_API_BASE_URL =
  process.env.NEXT_PUBLIC_DEXSCREENER_API_URL || "https://api.dexscreener.com/latest"
export const PUMPFUN_API_URL = process.env.NEXT_PUBLIC_PUMPFUN_API_URL || "https://pumpportal.fun/api"

// Solana Program IDs
export const JUPITER_PROGRAM_ID =
  process.env.NEXT_PUBLIC_JUPITER_PROGRAM_ID || "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
export const JUPITER_V6_PROGRAM_ID =
  process.env.NEXT_PUBLIC_JUPITER_V6_PROGRAM_ID || "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
export const RAYDIUM_AMM_PROGRAM_ID =
  process.env.NEXT_PUBLIC_RAYDIUM_AMM_PROGRAM_ID || "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
export const RAYDIUM_LIQUIDITY_PROGRAM_ID_V4 =
  process.env.NEXT_PUBLIC_RAYDIUM_LIQUIDITY_PROGRAM_ID_V4 || "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
export const RAYDIUM_STAKE_PROGRAM_ID =
  process.env.NEXT_PUBLIC_RAYDIUM_STAKE_PROGRAM_ID || "EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q"
export const RAYDIUM_POOL_PROGRAM_ID =
  process.env.NEXT_PUBLIC_RAYDIUM_POOL_PROGRAM_ID || "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"

// Token Program IDs
export const SPL_TOKEN_PROGRAM_ID =
  process.env.NEXT_PUBLIC_SPL_TOKEN_PROGRAM_ID || "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
export const SPL_TOKEN_2022_PROGRAM_ID =
  process.env.NEXT_PUBLIC_SPL_TOKEN_2022_PROGRAM_ID || "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
export const ASSOCIATED_TOKEN_PROGRAM_ID =
  process.env.NEXT_PUBLIC_ASSOCIATED_TOKEN_PROGRAM_ID || "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"

// Token Mints
export const SOL_MINT = "So11111111111111111111111111111111111111112"
export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapTVG4itwqZNfwpPJ55"
export const USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
export const SPRW_MINT = process.env.NEXT_PUBLIC_SPRW_MINT || "SPRWjzkRGb3kzfXrPnAX9wzKz4dHFhxcHKKisVjBZNr"

// Platform Configuration
export const PLATFORM_FEE_BPS = 20 // 0.2%
export const PLATFORM_FEE_ACCOUNT =
  process.env.NEXT_PUBLIC_PLATFORM_FEE_ACCOUNT || "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
export const MAX_SLIPPAGE_BPS = 1000 // 10%
export const DEFAULT_SLIPPAGE_BPS = 50 // 0.5%
export const CUSTOM_TRANSACTION_FEE_PERCENTAGE = 0.05 // 0.05%

// CoinGecko ID mappings
export const COINGECKO_ID_MAP: Record<string, string> = {
  [SOL_MINT]: "solana",
  [USDC_MINT]: "usd-coin",
  [USDT_MINT]: "tether",
  [SPRW_MINT]: "sparrow-protocol",
}

// Chart timeframes
export const CHART_TIMEFRAMES = {
  "1m": { label: "1M", days: "1", interval: "minutely" },
  "5m": { label: "5M", days: "1", interval: "minutely" },
  "15m": { label: "15M", days: "1", interval: "minutely" },
  "1h": { label: "1H", days: "1", interval: "hourly" },
  "4h": { label: "4H", days: "7", interval: "hourly" },
  "1d": { label: "1D", days: "30", interval: "daily" },
  "1w": { label: "1W", days: "90", interval: "daily" },
} as const

// Client-side RPC URLs (public endpoints only)
export const RPC_URLS = [
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL,
  process.env.NEXT_PUBLIC_SOLANA_RPC_1,
  process.env.NEXT_PUBLIC_SOLANA_RPC_2,
  "https://api.mainnet-beta.solana.com",
].filter(Boolean) as string[]

// Wallet Configuration
export const SUPPORTED_WALLETS = [
  "phantom",
  "solflare",
  "backpack",
  "glow",
  "slope",
  "sollet",
  "mathwallet",
  "ledger",
  "torus",
] as const

// Transaction Limits
export const TRANSACTION_LIMITS = {
  MIN_SOL_AMOUNT: 0.001,
  MAX_SOL_AMOUNT: 1000,
  MIN_TOKEN_AMOUNT: 0.000001,
  MAX_SLIPPAGE: 50, // 50%
  QUOTE_REFRESH_INTERVAL: 10000, // 10 seconds
  BALANCE_REFRESH_INTERVAL: 30000, // 30 seconds
} as const

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: "Please connect your wallet to continue",
  INSUFFICIENT_BALANCE: "Insufficient balance for this transaction",
  INVALID_AMOUNT: "Please enter a valid amount",
  SLIPPAGE_TOO_HIGH: "Slippage tolerance is too high",
  TRANSACTION_FAILED: "Transaction failed. Please try again",
  NETWORK_ERROR: "Network error. Please check your connection",
  QUOTE_EXPIRED: "Quote has expired. Please refresh",
} as const

export const UI_CONFIG = {
  appName: "Sparrow DeFi",
  logo: "/images/sparrow-logo-white.png",
  icon: "/images/sparrow-icon-white.png",
  theme: "dark", // default theme
}

export { LAMPORTS_PER_SOL }
