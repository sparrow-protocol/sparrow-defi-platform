import { type PublicKey, VersionedTransaction } from "@solana/web3.js"
import { JUPITER_API_BASE_URL, JUPITER_TOKEN_LIST_URL } from "@/app/lib/constants"
import type { JupiterRoute, JupiterSwapResponse } from "@/app/types/jupiter"
import { rpcService } from "@/app/lib/solana/rpc-service"

export class JupiterApi {
  private baseUrl: string

  constructor(baseUrl: string = JUPITER_API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Fetches a quote from Jupiter Aggregator.
   * @param inputMint The mint address of the input token.
   * @param outputMint The mint address of the output token.
   * @param amount The amount of the input token (in its smallest unit, e.g., lamports for SOL).
   * @param slippageBps Slippage tolerance in basis points (e.g., 50 for 0.5%).
   * @param swapMode "ExactIn" (default) or "ExactOut".
   * @param platformFeeBps Optional: Platform fee in basis points (e.g., 20 for 0.2%).
   * @param feeAccount Optional: The token account address to receive platform fees.
   * @returns A JupiterRoute object or null if an error occurs.
   */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: string,
    slippageBps: number,
    swapMode: "ExactIn" | "ExactOut" = "ExactIn",
    platformFeeBps?: number,
    feeAccount?: string,
  ): Promise<JupiterRoute | null> {
    try {
      const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount,
        slippageBps: slippageBps.toString(),
        swapMode,
      })
      if (platformFeeBps !== undefined) {
        params.append("platformFeeBps", platformFeeBps.toString())
      }
      if (feeAccount) {
        params.append("feeAccount", feeAccount)
      }

      const response = await fetch(`${this.baseUrl}/quote?${params.toString()}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching Jupiter quote: ${response.statusText}. Details: ${errorText}`)
        return null
      }
      const data = await response.json()
      return data as JupiterRoute
    } catch (error) {
      console.error("Failed to get Jupiter quote:", error)
      return null
    }
  }

  /**
   * Fetches a serialized swap transaction from Jupiter Aggregator.
   * @param quoteResponse The quote response obtained from getQuote.
   * @param userPublicKey The public key of the user initiating the swap.
   * @param wrapUnwrapSOL Automatically wrap/unwrap SOL (default: true).
   * @param feeAccount Optional: The token account address to receive platform fees.
   * @returns A serialized transaction string or null if an error occurs.
   */
  async getSwapTransaction(
    quoteResponse: JupiterRoute,
    userPublicKey: PublicKey,
    wrapUnwrapSOL = true,
    feeAccount: PublicKey | null = null,
  ): Promise<string | null> {
    try {
      const body: any = {
        quoteResponse,
        userPublicKey: userPublicKey.toBase58(),
        wrapUnwrapSOL,
      }
      if (feeAccount) {
        body.feeAccount = feeAccount.toBase58()
      }

      const response = await fetch(`${this.baseUrl}/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error fetching swap transaction: ${response.statusText}. Details: ${errorText}`)
        return null
      }
      const data: JupiterSwapResponse = await response.json()
      return data.swapTransaction
    } catch (error) {
      console.error("Failed to get Jupiter swap transaction:", error)
      return null
    }
  }

  /**
   * Sends and confirms a raw transaction.
   * @param rawTransaction Base64 encoded raw transaction string.
   * @returns The transaction signature.
   */
  async sendAndConfirmTransaction(rawTransaction: string): Promise<string> {
    try {
      const transactionBuffer = Buffer.from(rawTransaction, "base64")
      const transaction = VersionedTransaction.deserialize(transactionBuffer)

      const signature = await rpcService.sendAndConfirmTransaction(transaction)
      return signature
    } catch (error) {
      console.error("Error sending and confirming transaction:", error)
      throw error
    }
  }

  /**
   * Fetches the list of all tokens supported by Jupiter.
   * @returns An array of TokenInfo objects.
   */
  async getTokens(): Promise<any[]> {
    try {
      const response = await fetch(JUPITER_TOKEN_LIST_URL)
      if (!response.ok) {
        throw new Error(`Failed to fetch token list: ${response.statusText}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching Jupiter token list:", error)
      return []
    }
  }

  /**
   * Fetches the price of a token from Jupiter's price API.
   * @param mint The mint address of the token.
   * @param vsMint The mint address of the vs token (default: SOL).
   * @returns The price as a number or null.
   */
  async getPrice(mint: string, vsMint = "So11111111111111111111111111111111111111112"): Promise<number | null> {
    try {
      const response = await fetch(`https://price.jup.ag/v4/price?ids=${mint}&vsToken=${vsMint}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch price: ${response.statusText}`)
      }
      const data = await response.json()
      return data.data?.[mint]?.price || null
    } catch (error) {
      console.error(`Error fetching price for ${mint}:`, error)
      return null
    }
  }
}

export const jupiterClient = new JupiterApi() // Exported as jupiterClient
