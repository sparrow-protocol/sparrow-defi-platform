import { getJupiterQuote, getJupiterSwapTransaction } from "@/app/lib/defi-api"
import type { Token } from "@/app/types/tokens" // Updated import

// Placeholder for fetching token list (in a real app, this would be from a reliable source)
export async function getJupiterTokenList(): Promise<Token[]> {
  // In a real application, you'd fetch this from Jupiter's token list endpoint
  // For now, we'll fetch from our own API route
  console.log("Fetching Jupiter token list from /api/tokens...")
  try {
    const response = await fetch("/api/tokens")
    if (!response.ok) {
      throw new Error(`Error fetching tokens: ${response.statusText}`)
    }
    const data: Token[] = await response.json()
    return data
  } catch (error) {
    console.error("Failed to get Jupiter token list:", error)
    return [] // Return empty array on error
  }
}

// Re-exporting from defi-api for convenience if needed
export { getJupiterQuote, getJupiterSwapTransaction }
