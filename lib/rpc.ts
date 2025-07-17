// Client-side RPC URLs (public endpoints only)
export const getClientRpcUrls = (): string[] => {
  return [
    process.env.NEXT_PUBLIC_HELIUS_RPC_URL,
    process.env.NEXT_PUBLIC_SOLANA_RPC_1,
    process.env.NEXT_PUBLIC_SOLANA_RPC_2,
    "https://api.mainnet-beta.solana.com",
  ].filter(Boolean) as string[]
}

// Server-side RPC URLs (can include private endpoints)
export const getServerRpcUrls = (): string[] => {
  return [
    process.env.HELIUS_API_RPC_URL, // Private Helius RPC
    process.env.NEXT_PUBLIC_SOLANA_RPC_1,
    process.env.NEXT_PUBLIC_SOLANA_RPC_2,
    process.env.NEXT_PUBLIC_SOLANA_RPC_3,
    "https://api.mainnet-beta.solana.com",
  ].filter(Boolean) as string[]
}

// Get a single RPC URL for client-side use (e.g., for WalletAdapter)
export const getClientRpcUrl = (): string => {
  const urls = getClientRpcUrls()
  return urls.length > 0 ? urls[0] : "https://api.mainnet-beta.solana.com"
}

// Get a single RPC URL for server-side use (e.g., for server actions)
export const getServerRpcUrl = (): string => {
  const urls = getServerRpcUrls()
  return urls.length > 0 ? urls[0] : "https://api.mainnet-beta.solana.com"
}
