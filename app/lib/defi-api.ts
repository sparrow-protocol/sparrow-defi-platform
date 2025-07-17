import { JUPITER_API_BASE_URL, RAYDIUM_API_BASE_URL } from "@/app/lib/constants"
import type { JupiterRoute, JupiterPriceResponse } from "@/app/types/jupiter"
import type { RaydiumPoolInfo } from "@/app/types/pools/raydium"
import { Connection, VersionedTransaction } from "@solana/web3.js"

// Use Helius RPC if available, otherwise default Solana RPC
const HELIUS_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com"
const connection = new Connection(HELIUS_RPC_URL, "confirmed")

async function fetchJson(url: string, options?: RequestInit): Promise<any> {
  const response = await fetch(url, options)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(`API request failed: ${errorData.message || response.statusText}`)
  }
  return response.json()
}

/**
 * Fetches a price quote from Jupiter Aggregator.
 * @param inputMint The mint address of the input token.
 * @param outputMint The mint address of the output token.
 * @param amount The amount of the input token (in its smallest unit, e.g., lamports for SOL).
 * @param slippageBps Slippage tolerance in basis points (e.g., 50 for 0.5%).
 * @param platformFeeBps Optional: Platform fee in basis points (e.g., 20 for 0.2%).
 * @returns A JupiterRoute object or null if an error occurs.
 */
export async function getJupiterQuote(
  inputMint: string,
  outputMint: string,
  amount: string, // amount in lamports (smallest unit)
  slippageBps = 50, // 0.5% slippage
  platformFeeBps = 0, // New parameter
): Promise<JupiterRoute | null> {
  try {
    let url = `${JUPITER_API_BASE_URL}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
    if (platformFeeBps > 0) {
      url += `&platformFeeBps=${platformFeeBps}`
    }
    const data = await fetchJson(url)
    return data as JupiterRoute
  } catch (error) {
    console.error("Failed to get Jupiter quote:", error)
    return null
  }
}

/**
 * Fetches a serialized swap transaction from Jupiter Aggregator.
 * @param quoteResponse The quote response obtained from getJupiterQuote.
 * @param userPublicKey The public key of the user initiating the swap.
 * @param feeAccount Optional: The token account address to receive platform fees.
 * @returns A serialized transaction object or null if an error occurs.
 */
export async function getJupiterSwapTransaction(
  quoteResponse: JupiterRoute,
  userPublicKey: string,
  feeAccount: string | null = null, // New parameter
): Promise<any | null> {
  try {
    const url = `${JUPITER_API_BASE_URL}/swap`
    const body: any = {
      quoteResponse,
      userPublicKey,
      wrapUnwrapSOL: true, // Automatically wrap/unwrap SOL
    }
    if (feeAccount) {
      body.feeAccount = feeAccount
    }

    const data = await fetchJson(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    return data // This would typically be a serialized transaction
  } catch (error) {
    console.error("Failed to get Jupiter swap transaction:", error)
    return null
  }
}

/**
 * Fetches an ExactOut price quote from Jupiter Aggregator via the custom API route.
 * @param inputMint The mint address of the input token (customer pays with).
 * @param outputMint The mint address of the output token (merchant receives).
 * @param outputAmount The exact amount of the output token (in its smallest unit).
 * @param slippageBps Slippage tolerance in basis points.
 * @returns A JupiterRoute object or null.
 */
export async function getJupiterExactOutQuote(
  inputMint: string,
  outputMint: string,
  outputAmount: string, // exact amount in smallest unit
  slippageBps = 50, // 0.5% slippage
): Promise<JupiterRoute | null> {
  try {
    const response = await fetch("/api/jupiter-exact-out-swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputMint,
        outputMint,
        outputAmount,
        slippageBps,
        // userPublicKey and merchantRecipientAddress are not needed for just the quote
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to get ExactOut quote.")
    }
    const data = await response.json()
    return data.quoteResponse as JupiterRoute // The API route returns the full quote response
  } catch (error) {
    console.error("Failed to get Jupiter ExactOut quote:", error)
    return null
  }
}

/**
 * Fetches a serialized ExactOut swap transaction from Jupiter Aggregator via the custom API route.
 * @param inputMint The mint address of the input token.
 * @param outputMint The mint address of the output token.
 * @param outputAmount The exact amount of the output token.
 * @param slippageBps Slippage tolerance in basis points.
 * @param userPublicKey The public key of the customer initiating the swap.
 * @param merchantRecipientAddress The public key of the merchant receiving the payment.
 * @returns A serialized transaction object or null.
 */
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
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to get ExactOut swap transaction.")
    }
    const data = await response.json()
    return data // This should contain the serialized transaction
  } catch (error) {
    console.error("Failed to get Jupiter ExactOut swap transaction:", error)
    return null
  }
}

/**
 * Sends a raw transaction to the Solana network.
 * @param rawTransaction Base64 encoded raw transaction.
 * @returns The transaction signature.
 */
export async function sendAndConfirmRawTransaction(rawTransaction: string): Promise<string> {
  try {
    const transactionBuffer = Buffer.from(rawTransaction, "base64")
    const transaction = VersionedTransaction.deserialize(transactionBuffer)

    const signature = await connection.sendTransaction(transaction, {
      skipPreflight: false, // Set to true for faster but less safe sending
      preflightCommitment: "confirmed",
    })

    const { value } = await connection.confirmTransaction(signature, "confirmed")

    if (value && value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(value.err)}`)
    }

    return signature
  } catch (error) {
    console.error("Error sending and confirming transaction:", error)
    throw error
  }
}

/**
 * Fetches current token prices from Jupiter's Price API (v4) via a proxy.
 * @param mintAddresses Array of token mint addresses.
 * @param vsTokenMint   The mint address to quote against (default USDC).
 * @returns A JupiterPriceResponse object or null on error.
 */
export async function getJupiterTokenPrice(
  mintAddresses: string[],
  vsTokenMint = "EPjFWdd5AufqSSqeM2qN1xzybapTVG4itwqZNfwpPJ55", // USDC
): Promise<JupiterPriceResponse | null> {
  try {
    // Filter out any null or undefined mint addresses before joining
    const validMintAddresses = mintAddresses.filter(Boolean)
    if (!validMintAddresses.length) return null

    // Use the internal API route as a proxy to avoid CORS issues and ensure proper encoding
    const idsParam = validMintAddresses.join(",")
    const url = `/api/price?ids=${idsParam}&vsToken=${vsTokenMint}`

    const response = await fetch(url, { cache: "no-store" })
    const data: JupiterPriceResponse | { error?: string } = await response.json()

    if (!response.ok || !("data" in data)) {
      console.error(`Jupiter price API error ${response.status}: ${(data as any).error ?? "unknown error"}`)
      return null
    }

    return data as JupiterPriceResponse
  } catch (err) {
    console.error("Failed to fetch Jupiter token price:", err)
    return null
  }
}

/**
 * Placeholder for fetching Raydium pool information.
 * In a real application, this would interact with Raydium's API.
 * @returns An array of RaydiumPoolInfo or null.
 */
export async function getRaydiumPools(): Promise<RaydiumPoolInfo[] | null> {
  try {
    const url = `${RAYDIUM_API_BASE_URL}/pools`
    const response = await fetch(url)
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error fetching Raydium pools: ${response.statusText}. Details: ${errorText}`)
      throw new Error(`Error fetching Raydium pools: ${response.statusText}`)
    }
    const data = await response.json()
    return data as RaydiumPoolInfo[]
  } catch (error) {
    console.error("Failed to get Raydium pools:", error)
    return null
  }
}
