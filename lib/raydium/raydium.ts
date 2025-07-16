import { RAYDIUM_API_BASE_URL } from "@/app/lib/constants"
import type { RaydiumPoolInfo } from "@/app/types/api"

/**
 * Fetches all Raydium pools.
 * @returns An array of RaydiumPoolInfo objects or null if request fails.
 */
export async function getRaydiumPools(): Promise<RaydiumPoolInfo[] | null> {
  try {
    const response = await fetch(`${RAYDIUM_API_BASE_URL}/pools`, {
      next: { revalidate: 300 }, // Revalidate every 5 mins if using next/cache
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Raydium API error: ${response.statusText}. Details: ${errorText}`)
      return null
    }

    const data = await response.json()
    return data as RaydiumPoolInfo[]
  } catch (err) {
    console.error("Failed to fetch Raydium pools:", err)
    return null
  }
}
