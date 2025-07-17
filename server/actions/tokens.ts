"use server"

import { jupiterClient } from "@/app/lib/jupiter/jupiter" // Correctly importing jupiterClient
import {
  BIRDEYE_API_BASE_URL,
  BIRDEYE_API_KEY,
  COINGECKO_ID_MAP,
  COINGECKO_API_BASE_URL,
  LAMPORTS_PER_SOL,
} from "@/app/lib/constants"
import type { Token } from "@/app/types/tokens"
import type { Balance } from "@/app/types/balance"
import { createServerConnection } from "@/app/lib/solana/rpc-service"
import { PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

interface BirdeyePriceResponse {
  data: {
    value: number
    vsTokenSymbol: string
    updateUnixTime: number
    priceChange24h: number
    v24h: number
    volume24h: number
    liquidity: number
    marketCap: number
    supply: number
    decimals: number
  }
  success: boolean
}

interface CoinGeckoPriceResponse {
  [key: string]: {
    usd: number
    usd_24h_change: number
  }
}

// Cache for token metadata to avoid repeated API calls
const tokenMetadataCache = new Map<string, Token>()

export async function getTokens(): Promise<Token[]> {
  // Exported as getTokens
  try {
    const tokens = await jupiterClient.getTokens() // Using jupiterClient
    // Enrich with price data if available
    const tokensWithPrices = await Promise.all(
      tokens.map(async (token) => {
        const price = await getPrice(token.address)
        return { ...token, price }
      }),
    )
    return tokensWithPrices
  } catch (error) {
    console.error("Error fetching all tokens:", error)
    return []
  }
}

export async function getTokenMetadata(mintAddress: string): Promise<Token | null> {
  if (tokenMetadataCache.has(mintAddress)) {
    return tokenMetadataCache.get(mintAddress)!
  }

  try {
    const tokens = await jupiterClient.getTokens() // Using jupiterClient
    const token = tokens.find((t) => t.address === mintAddress)
    if (token) {
      tokenMetadataCache.set(mintAddress, token)
      return token
    }
    return null
  } catch (error) {
    console.error(`Error fetching metadata for ${mintAddress}:`, error)
    return null
  }
}

export async function getPrice(
  mint: string,
  vsMint = "So11111111111111111111111111111111111111112",
): Promise<number | null> {
  // Try Birdeye first
  if (BIRDEYE_API_KEY) {
    try {
      const url = `${BIRDEYE_API_BASE_URL}/defi/price?address=${mint}`
      const response = await fetch(url, {
        headers: {
          "X-API-KEY": BIRDEYE_API_KEY,
        },
        next: {
          revalidate: 30, // Revalidate every 30 seconds
        },
      })

      if (response.ok) {
        const data: BirdeyePriceResponse = await response.json()
        if (data.success && data.data?.value) {
          return data.data.value
        }
      } else {
        console.warn(`Birdeye price fetch failed for ${mint}: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.warn(`Error fetching price from Birdeye for ${mint}:`, error)
    }
  }

  // Fallback to Jupiter Price API
  try {
    const price = await jupiterClient.getPrice(mint, vsMint) // Using jupiterClient
    return price
  } catch (error) {
    console.warn(`Error fetching price from Jupiter for ${mint}:`, error)
    // Fallback to CoinGecko if Jupiter fails and we have a CoinGecko ID
    const coingeckoId = COINGECKO_ID_MAP[mint]
    if (coingeckoId) {
      try {
        const cgUrl = `${COINGECKO_API_BASE_URL}/simple/price?ids=${coingeckoId}&vs_currencies=usd`
        const cgResponse = await fetch(cgUrl, { next: { revalidate: 60 } })
        if (cgResponse.ok) {
          const cgData: CoinGeckoPriceResponse = await cgResponse.json()
          return cgData[coingeckoId]?.usd || null
        }
      } catch (cgError) {
        console.warn(`Error fetching price from CoinGecko for ${mint}:`, cgError)
      }
    }
    return null
  }
}

export async function getTokenBalances(walletAddress: string): Promise<Balance[]> {
  const connection = createServerConnection()
  const ownerPublicKey = new PublicKey(walletAddress)
  const balances: Balance[] = []

  try {
    // Get SOL balance
    const solBalanceLamports = await connection.getBalance(ownerPublicKey)
    const solBalance = solBalanceLamports / LAMPORTS_PER_SOL
    const solPrice = await getPrice("So11111111111111111111111111111111111111112")
    balances.push({
      tokenAddress: "So11111111111111111111111111111111111111112",
      tokenSymbol: "SOL",
      tokenName: "Solana",
      balance: solBalance,
      usdValue: solBalance * (solPrice || 0),
      price: solPrice,
      priceChange24h: null, // Requires more data
      icon: "/images/sol-icon.png",
    })

    // Get SPL token balances
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    const mintsToFetchPriceFor = new Set<string>()
    const tokenAccountMap = new Map<string, { amount: number; decimals: number }>()

    for (const account of tokenAccounts.value) {
      const mint = account.account.data.parsed.info.mint
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount
      const decimals = account.account.data.parsed.info.tokenAmount.decimals

      if (amount > 0) {
        mintsToFetchPriceFor.add(mint)
        tokenAccountMap.set(mint, { amount, decimals })
      }
    }

    const allTokens = await getTokens() // Using getTokens here
    for (const mint of mintsToFetchPriceFor) {
      const tokenInfo = allTokens.find((t) => t.address === mint)
      const { amount, decimals } = tokenAccountMap.get(mint)!
      const price = await getPrice(mint) // Fetch price for each token
      const usdValue = amount * (price || 0)

      balances.push({
        tokenAddress: mint,
        tokenSymbol: tokenInfo?.symbol || "UNKNOWN",
        tokenName: tokenInfo?.name || "Unknown Token",
        balance: amount,
        usdValue: usdValue,
        price: price,
        priceChange24h: tokenInfo?.priceChange24h || null, // Use priceChange from tokenInfo if available
        icon: tokenInfo?.logoURI || "/placeholder.svg",
      })
    }

    return balances.sort((a, b) => b.usdValue - a.usdValue) // Sort by USD value
  } catch (error) {
    console.error("Error in getTokenBalances:", error)
    throw error
  }
}
