import { getJupiterQuote, getJupiterSwapTransaction } from "@/app/lib/defi-api"
import type { Token } from "@/app/types/tokens"

/**
 * Fetch the list of tokens supported by Jupiter.
 * Typically proxied through a Next.js API route for caching / SSR.
 */
export async function getJupiterTokenList(): Promise<Token[]> {
  try {
    console.log("Fetching Jupiter token list from /api/tokens...")
    const response = await fetch("/api/tokens")

    if (!response.ok) {
      throw new Error(`Error fetching tokens: ${response.statusText}`)
    }

    const data: Token[] = await response.json()
    return data
  } catch (error) {
    console.error("Failed to get Jupiter token list:", error)
    return []
  }
}

// Re-export swap helpers from the custom defi-api
export { getJupiterQuote, getJupiterSwapTransaction }
