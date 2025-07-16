import type { JupiterTokenInfo } from "@/app/types/jupiter"

// Fetch a single token by mint address
export async function fetchJupiterTokenInfo(mint: string): Promise<JupiterTokenInfo | null> {
  try {
    const res = await fetch(`https://lite-api.jup.ag/tokens/v2/mint/${mint}`)
    if (!res.ok) return null
    const data = await res.json()
    return data as JupiterTokenInfo
  } catch (err) {
    console.error("fetchJupiterTokenInfo error:", err)
    return null
  }
}

// Search for tokens by symbol/name
export async function searchJupiterTokens(query: string): Promise<JupiterTokenInfo[]> {
  try {
    const res = await fetch(`https://lite-api.jup.ag/tokens/v2/search?query=${encodeURIComponent(query)}`)
    if (!res.ok) return []
    const data = await res.json()
    return data as JupiterTokenInfo[]
  } catch (err) {
    console.error("searchJupiterTokens error:", err)
    return []
  }
}
