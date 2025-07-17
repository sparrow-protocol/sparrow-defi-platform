"use server"

import { VersionedTransaction } from "@solana/web3.js"
import { jupiterClient } from "@/app/lib/jupiter/jupiter"
import { sendRawTransaction, confirmTransaction } from "@/app/lib/solana/transaction"
import { sql } from "@/app/lib/db"
import type { JupiterRoute } from "@/app/types/jupiter"
import { PLATFORM_FEE_ACCOUNT } from "@/app/lib/constants"

export async function getSwapQuote(
  inputMint: string,
  outputMint: string,
  amount: number, // UI amount
  slippageBps: number,
  swapMode: "ExactIn" | "ExactOut" = "ExactIn",
): Promise<JupiterRoute | null> {
  try {
    // Convert UI amount to smallest units based on token decimals (assuming 6 for now, will need actual token decimals)
    // For a real application, you'd fetch token decimals first.
    // For simplicity, let's assume a common decimal for now or pass it from client.
    // Jupiter API expects amount in smallest units.
    const amountInSmallestUnits = Math.round(amount * Math.pow(10, 6)) // Example: assuming 6 decimals

    const quote = await jupiterClient.getQuote(inputMint, outputMint, amountInSmallestUnits, slippageBps, swapMode)
    return quote
  } catch (error) {
    console.error("Error fetching swap quote:", error)
    throw error
  }
}

export async function getSwapQuoteExactOut(
  inputMint: string,
  outputMint: string,
  outAmount: string, // This is already in smallest units from client
  slippageBps: number,
): Promise<JupiterRoute | null> {
  try {
    const quote = await jupiterClient.getQuote(
      inputMint,
      outputMint,
      Number.parseInt(outAmount, 10), // outAmount is already in smallest units
      slippageBps,
      "ExactOut",
    )
    return quote
  } catch (error) {
    console.error("Error fetching ExactOut swap quote:", error)
    throw error
  }
}

export async function executeSwap(
  quote: JupiterRoute,
  userPublicKey: string,
  destinationTokenAccount?: string, // Optional: for exact out payments to a specific merchant account
): Promise<{ swapTransaction: string; signature: string | null; error: string | null }> {
  try {
    const swapTransaction = await jupiterClient.getSwapTransaction(
      quote,
      userPublicKey,
      true, // wrapUnwrapSOL
      PLATFORM_FEE_ACCOUNT, // Platform fee account
    )

    if (!swapTransaction) {
      return { swapTransaction: "", signature: null, error: "Failed to get swap transaction from Jupiter." }
    }

    // The transaction needs to be signed by the user on the client-side.
    // This function only prepares the transaction.
    return { swapTransaction, signature: null, error: null }
  } catch (error: any) {
    console.error("Error executing swap:", error)
    return { swapTransaction: "", signature: null, error: error.message || "Failed to execute swap." }
  }
}

export async function executeSwapTransaction(
  quote: JupiterRoute,
  userPublicKey: string,
  signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction>,
  signAllTransactions: (transactions: VersionedTransaction[]) => Promise<VersionedTransaction[]>,
): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    const { swapTransaction: serializedTransaction } = await executeSwap(quote, userPublicKey)

    if (!serializedTransaction) {
      return { success: false, error: "Failed to get serialized transaction." }
    }

    const transactionBuffer = Buffer.from(serializedTransaction, "base64")
    const transaction = VersionedTransaction.deserialize(transactionBuffer)

    // Sign the transaction
    const signedTransaction = await signTransaction(transaction)

    // Send and confirm the transaction
    const signature = await sendRawTransaction(Buffer.from(signedTransaction.serialize()).toString("base64"))
    const confirmed = await confirmTransaction(signature)

    if (confirmed) {
      // Record the transaction in the database
      await sql`
        INSERT INTO transactions (user_public_key, signature, status, type, input_mint, output_mint, input_amount, output_amount)
        VALUES (
          ${userPublicKey},
          ${signature},
          'completed',
          'swap',
          ${quote.inputMint},
          ${quote.outputMint},
          ${Number.parseFloat(quote.inAmount)},
          ${Number.parseFloat(quote.outAmount)}
        );
      `
      return { success: true, signature }
    } else {
      // If not confirmed, update status to failed
      await sql`
        INSERT INTO transactions (user_public_key, signature, status, type, input_mint, output_mint, input_amount, output_amount)
        VALUES (
          ${userPublicKey},
          ${signature},
          'failed',
          'swap',
          ${quote.inputMint},
          ${quote.outputMint},
          ${Number.parseFloat(quote.inAmount)},
          ${Number.parseFloat(quote.outAmount)}
        )
        ON CONFLICT (signature) DO UPDATE SET status = 'failed', updated_at = NOW();
      `
      return { success: false, error: "Transaction not confirmed on chain." }
    }
  } catch (error: any) {
    console.error("Error in executeSwapTransaction:", error)
    // Attempt to record failed transaction if signature is available
    if (error.signature) {
      await sql`
        INSERT INTO transactions (user_public_key, signature, status, type, input_mint, output_mint, input_amount, output_amount)
        VALUES (
          ${userPublicKey},
          ${error.signature},
          'failed',
          'swap',
          ${quote.inputMint},
          ${quote.outputMint},
          ${Number.parseFloat(quote.inAmount)},
          ${Number.parseFloat(quote.outAmount)}
        )
        ON CONFLICT (signature) DO UPDATE SET status = 'failed', updated_at = NOW();
      `
    }
    return { success: false, error: error.message || "An unexpected error occurred during swap execution." }
  }
}
