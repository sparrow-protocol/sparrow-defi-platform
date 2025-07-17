import { RAYDIUM_API_BASE_URL } from "@/app/lib/constants"
import type { RaydiumPoolInfo, RaydiumPoolStats } from "@/app/types/pools/raydium"

export class RaydiumClient {
  private apiUrl: string

  constructor() {
    this.apiUrl = RAYDIUM_API_BASE_URL
  }

  private async fetchJson(url: string, options?: RequestInit): Promise<any> {
    const response = await fetch(url, options)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(`Raydium API request failed: ${errorData.message || response.statusText}`)
    }
    return response.json()
  }

  async getPools(): Promise<RaydiumPoolInfo[]> {
    const url = `${this.apiUrl}/sdk/liquidity/mainnet.json`
    try {
      const data = await this.fetchJson(url)
      return data.official as RaydiumPoolInfo[]
    } catch (error) {
      console.error("Error fetching Raydium pools:", error)
      return []
    }
  }

  async getPoolStats(poolId: string): Promise<RaydiumPoolStats | null> {
    const url = `${this.apiUrl}/v2/main/pairs/${poolId}`
    try {
      const data = await this.fetchJson(url)
      return data as RaydiumPoolStats
    } catch (error) {
      console.error("Error fetching Raydium pool stats:", error)
      return null
    }
  }
}

export const raydiumClient = new RaydiumClient()
