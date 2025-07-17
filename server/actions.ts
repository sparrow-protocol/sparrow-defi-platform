"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/app/lib/db"
import { PublicKey } from "@solana/web3.js"
import { createSolTransferTransaction, createSplTransferTransaction } from "@/app/lib/solana/transaction"
import { getPrice } from "@/server/actions/tokens"
import { getSwapQuote, executeSwap } from "@/server/actions/swap"
import { getChartData } from "@/server/actions/chart"
import { getTransactionsByAddress } from "@/server/actions/trade"
import { createPayment, getPaymentStatus, updatePaymentStatus } from "@/server/actions/payments"
import { getUserData, updateUserData } from "@/server/actions/user"

// Re-export all server actions for easier access
export {
  getPrice,
  getSwapQuote,
  executeSwap,
  getChartData,
  getTransactionsByAddress,
  createPayment,
  getPaymentStatus,
  updatePaymentStatus,
  getUserData,
  updateUserData,
}

// Example: Server Action for a simple SOL transfer
export async function transferSol(from: string, to: string, amount: number) {
  try {
    const fromPublicKey = new PublicKey(from)
    const toPublicKey = new PublicKey(to)

    // Create the transaction (server-side)
    const serializedTransaction = await createSolTransferTransaction(fromPublicKey, toPublicKey, amount)

    // In a real app, you'd send this serializedTransaction to the client for signing
    // For this example, we'll simulate sending and confirming
    // const signature = await sendRawTransaction(serializedTransaction);
    // const confirmed = await confirmTransaction(signature);

    // Simulate success
    const signature = "SIMULATED_SOL_TRANSFER_SIGNATURE_" + Date.now()
    const confirmed = true

    if (confirmed) {
      // Save transaction to DB
      await sql`
        INSERT INTO transactions (user_public_key, signature, status, type, input_mint, output_mint, input_amount, output_amount)
        VALUES (${from}, ${signature}, 'completed', 'transfer', 'SOL', 'SOL', ${amount}, ${amount})
      `
      revalidatePath("/portfolio") // Revalidate portfolio page to show updated balance
      return { success: true, signature }
    } else {
      return { success: false, error: "Transaction not confirmed" }
    }
  } catch (error: any) {
    console.error("Error in transferSol server action:", error)
    return { success: false, error: error.message || "Failed to transfer SOL" }
  }
}

// Example: Server Action for an SPL token transfer
export async function transferSplToken(from: string, to: string, mint: string, amount: number) {
  try {
    const fromPublicKey = new PublicKey(from)
    const toPublicKey = new PublicKey(to)
    const tokenMint = new PublicKey(mint)

    // Create the transaction (server-side)
    const serializedTransaction = await createSplTransferTransaction(fromPublicKey, toPublicKey, tokenMint, amount)

    // Simulate success
    const signature = "SIMULATED_SPL_TRANSFER_SIGNATURE_" + Date.now()
    const confirmed = true

    if (confirmed) {
      // Save transaction to DB
      await sql`
        INSERT INTO transactions (user_public_key, signature, status, type, input_mint, output_mint, input_amount, output_amount)
        VALUES (${from}, ${signature}, 'completed', 'transfer', ${mint}, ${mint}, ${amount}, ${amount})
      `
      revalidatePath("/portfolio")
      return { success: true, signature }
    } else {
      return { success: false, error: "Transaction not confirmed" }
    }
  } catch (error: any) {
    console.error("Error in transferSplToken server action:", error)
    return { success: false, error: error.message || "Failed to transfer SPL token" }
  }
}
