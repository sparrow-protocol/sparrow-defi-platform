import type { HeliusFungibleToken, HeliusTokenBalance } from "@/app/types/helius/fungible-token"
import type { HeliusNonFungibleToken } from "@/app/types/helius/non-fungible-token"

const HELIUS_API_KEY = process.env.HELIUS_API_KEY
const HELIUS_RPC_URL = process.env.HELIUS_API_RPC_URL || "https://mainnet.helius-rpc.com"

export class HeliusClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || HELIUS_API_KEY || ""
    this.baseUrl = `${HELIUS_RPC_URL}/?api-key=${this.apiKey}`
  }

  async getAsset(assetId: string): Promise<HeliusFungibleToken | HeliusNonFungibleToken | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "get-asset",
          method: "getAsset",
          params: {
            id: assetId,
          },
        }),
      })

      const data = await response.json()
      return data.result || null
    } catch (error) {
      console.error("Error fetching asset:", error)
      return null
    }
  }

  async getAssetsByOwner(
    ownerAddress: string,
    page = 1,
    limit = 1000,
  ): Promise<(HeliusFungibleToken | HeliusNonFungibleToken)[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "get-assets-by-owner",
          method: "getAssetsByOwner",
          params: {
            ownerAddress,
            page,
            limit,
          },
        }),
      })

      const data = await response.json()
      return data.result?.items || []
    } catch (error) {
      console.error("Error fetching assets by owner:", error)
      return []
    }
  }

  async getTokenBalances(ownerAddress: string): Promise<HeliusTokenBalance[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "get-token-accounts",
          method: "getTokenAccounts",
          params: {
            owner: ownerAddress,
          },
        }),
      })

      const data = await response.json()
      return data.result?.token_accounts || []
    } catch (error) {
      console.error("Error fetching token balances:", error)
      return []
    }
  }

  async searchAssets(query: {
    name?: string
    symbol?: string
    creator?: string
    collection?: string
    interface?: string
    page?: number
    limit?: number
  }): Promise<(HeliusFungibleToken | HeliusNonFungibleToken)[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "search-assets",
          method: "searchAssets",
          params: query,
        }),
      })

      const data = await response.json()
      return data.result?.items || []
    } catch (error) {
      console.error("Error searching assets:", error)
      return []
    }
  }

  async getTransactionHistory(address: string, before?: string): Promise<any[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "get-parsed-transactions",
          method: "getParsedTransactions",
          params: {
            accounts: [address],
            before,
          },
        }),
      })

      const data = await response.json()
      return data.result || []
    } catch (error) {
      console.error("Error fetching transaction history:", error)
      return []
    }
  }
}

export const heliusClient = new HeliusClient()
