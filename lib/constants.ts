export const JUPITER_API_BASE_URL = process.env.NEXT_PUBLIC_JUPITER_API_URL || "https://quote-api.jup.ag/v6"
export const RAYDIUM_API_BASE_URL = process.env.NEXT_PUBLIC_RAYDIUM_API_URL || "https://api.raydium.io/v2"

// Jupiter Price API base (separate from the quote/swap API)
export const JUPITER_PRICE_API_BASE_URL = "https://price.jup.ag/v4"

// CoinGecko API Base URL
export const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3"

// Mapping of common token mints to CoinGecko IDs
export const COINGECKO_ID_MAP: { [mintAddress: string]: string } = {
  So11111111111111111111111111111111111111112: "solana", // SOL
  EPjFWdd5AufqSSqeM2qN1xzybapTVG4itwqZNfwpPJ55: "usd-coin", // USDC
  //: "Sparrow", // SPRW
  // Add other common tokens here if needed
}

// Token List URLs
export const JUPITER_TOKEN_LIST_URL = "https://token.jup.ag/strict.json"
export const SOLANA_LABS_TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json"

// Dexscreener API Base URL (for price/pair data, not token lists)
export const DEXSCREENER_API_BASE_URL = "https://api.dexscreener.com/latest/dex"

// Birdeye API Base URL (for price/market data, not token lists)
export const BIRDEYE_API_BASE_URL = "https://public-api.birdeye.so/public"

export const CUSTOM_TRANSACTION_FEE_PERCENTAGE = 0.05 // 0.05%
