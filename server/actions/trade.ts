"use server"

import { sql } from "@/app/lib/db"
import type { TransactionHistoryItem } from "@/app/types/trade"

export async function getTransactionsByAddress(address: string): Promise<TransactionHistoryItem[]> {
  try {
    const transactions = await sql<TransactionHistoryItem[]>`
      SELECT
        signature,
        EXTRACT(EPOCH FROM created_at) AS timestamp,
        status,
        type,
        input_amount,
        input_mint,
        output_amount,
        output_mint,
        payment_amount AS amount, -- Use payment_amount for generic 'amount' if it's a payment
        payment_spl_token AS token_symbol, -- Use payment_spl_token for generic 'token_symbol'
        payment_recipient AS "to",
        user_public_key AS "from"
      FROM transactions
      WHERE user_public_key = ${address}
      ORDER BY created_at DESC
      LIMIT 50;
    `

    // Enrich with token symbols if possible (requires fetching token metadata)
    // For simplicity, we'll use placeholder symbols or fetch them if needed.
    const enrichedTransactions: TransactionHistoryItem[] = transactions.map((tx) => ({
      ...tx,
      inputTokenSymbol: tx.input_mint === "So11111111111111111111111111111111111111112" ? "SOL" : tx.input_mint, // Placeholder
      outputTokenSymbol: tx.output_mint === "So11111111111111111111111111111111111111112" ? "SOL" : tx.output_mint, // Placeholder
      tokenSymbol: tx.token_symbol === "So11111111111111111111111111111111111111112" ? "SOL" : tx.token_symbol, // Placeholder
      // Convert amounts from raw to UI friendly if needed, based on decimals
      // This would require fetching token decimals, which is omitted for brevity.
      // For now, assume amounts are already UI-friendly or handle on client.
    }))

    return enrichedTransactions
  } catch (error) {
    console.error("Error fetching transactions by address:", error)
    throw error
  }
}
