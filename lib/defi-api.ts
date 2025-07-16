import { Connection, VersionedTransaction } from "@solana/web3.js"
import {
  JUPITER_API_BASE_URL,
  JUPITER_PRICE_API_BASE_URL,
  RAYDIUM_API_BASE_URL,
} from "@/app/lib/constants"
import type {
  JupiterQuoteResponse,
  JupiterRecurringOrderResponse,
  JupiterPriceResponse,
  RaydiumPoolInfo,
} from "@/app/types/api"

const HELIUS_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com"
const connection = new Connection(HELIUS_RPC_URL, "confirmed")

// Fetch a Jupiter quote
export async function getJupiterQuote(
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps = 50,
  platformFeeBps = 0,
): Promise<JupiterQuoteResponse | null> {
  try {
    let url = `${JUPITER_API_BASE_URL}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
    if (platformFeeBps > 0) {
      url += `&platformFeeBps=${platformFeeBps}`
    }
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`Jupiter quote error: ${response.statusText}`, await response.text())
      return null
    }
    const data = await response.json()
    return data as JupiterQuoteResponse
  } catch (err) {
    console.error("Failed to fetch Jupiter quote:", err)
    return null
  }
}

// Fetch a Jupiter swap transaction
export async function getJupiterSwapTransaction(
  quoteResponse: JupiterQuoteResponse,
  userPublicKey: string,
  feeAccount: string | null = null,
): Promise<any | null> {
  try {
    const body: any = {
      quoteResponse,
      userPublicKey,
      wrapUnwrapSOL: true,
    }
    if (feeAccount) {
      body.feeAccount = feeAccount
    }

    const response = await fetch(`${JUPITER_API_BASE_URL}/swap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      console.error(`Swap transaction error: ${response.statusText}`, await response.text())
      return null
    }
    return await response.json()
  } catch (err) {
    console.error("Failed to get Jupiter swap transaction:", err)
    return null
  }
}

// Get ExactOut quote via custom proxy route
export async function getJupiterExactOutQuote(
  inputMint: string,
  outputMint: string,
  outputAmount: string,
  slippageBps = 50,
): Promise<JupiterQuoteResponse | null> {
  try {
    const response = await fetch("/api/jupiter-exact-out-swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputMint, outputMint, outputAmount, slippageBps }),
    })
    if (!response.ok) {
      console.error("ExactOut quote error:", await response.json())
      return null
    }
    const { quoteResponse } = await response.json()
    return quoteResponse as JupiterQuoteResponse
  } catch (err) {
    console.error("Failed to get ExactOut quote:", err)
    return null
  }
}

// Get ExactOut swap transaction via proxy
export async function getJupiterExactOutSwapTransaction(
  inputMint: string,
  outputMint: string,
  outputAmount: string,
  slippageBps: number,
  userPublicKey: string,
  merchantRecipientAddress: string,
): Promise<any | null> {
  try {
    const response = await fetch("/api/jupiter-exact-out-swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputMint,
        outputMint,
        outputAmount,
        slippageBps,
        userPublicKey,
        merchantRecipientAddress,
      }),
    })
    if (!response.ok) {
      console.error("ExactOut swap tx error:", await response.json())
      return null
    }
    return await response.json()
  } catch (err) {
    console.error("Failed to get ExactOut swap transaction:", err)
    return null
  }
}

// Send raw transaction to the blockchain
export async function sendAndConfirmRawTransaction(rawTransaction: string): Promise<string> {
  try {
    const transactionBuffer = Buffer.from(rawTransaction, "base64")
    const transaction = VersionedTransaction.deserialize(transactionBuffer)
    const signature = await connection.sendTransaction(transaction, {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    })
    const { value } = await connection.confirmTransaction(signature, "confirmed")

    if (value?.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(value.err)}`)
    }

    return signature
  } catch (err) {
    console.error("Error sending transaction:", err)
    throw err
  }
}

// Get token prices via proxy route to Jupiter Price API
export async function getJupiterTokenPrice(
  mintAddresses: string[],
  vsTokenMint = "EPjFWdd5AufqSSqeM2qN1xzybapTVG4itwqZNfwpPJ55", // USDC
): Promise<JupiterPriceResponse | null> {
  try {
    const idsParam = mintAddresses.filter(Boolean).join(",")
    if (!idsParam) return null

    const url = `/api/price?ids=${idsParam}&vsToken=${vsTokenMint}`
    const response = await fetch(url, { cache: "no-store" })

    const data = await response.json()
    if (!response.ok || !("data" in data)) {
      console.error("Jupiter price API error:", data)
      return null
    }

    return data as JupiterPriceResponse
  } catch (err) {
    console.error("Failed to fetch token price:", err)
    return null
  }
}

// Fetch recurring orders from Jupiter
export async function getJupiterRecurringOrders(
  userPublicKey: string,
  orderStatus: "active" | "history" | "all" = "active",
  recurringType: "time" | "price" | "all" = "all",
  page = 0,
): Promise<JupiterRecurringOrderResponse[] | null> {
  try {
    const url = `${JUPITER_API_BASE_URL}/recurring/v1/getRecurringOrders?user=${userPublicKey}&orderStatus=${orderStatus}&recurringType=${recurringType}&page=${page}`
    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) {
      console.error("Recurring order error:", await response.text())
      return null
    }
    return await response.json()
  } catch (err) {
    console.error("Failed to fetch recurring orders:", err)
    return null
  }
}

// Fetch Raydium pools
export async function getRaydiumPools(): Promise<RaydiumPoolInfo[] | null> {
  try {
    const response = await fetch(`${RAYDIUM_API_BASE_URL}/pools`, {
      next: { revalidate: 300 },
    })
    if (!response.ok) {
      console.error("Raydium pool error:", await response.text())
      return null
    }
    return await response.json()
  } catch (err) {
    console.error("Failed to fetch Raydium pools:", err)
    return null
  }
}
