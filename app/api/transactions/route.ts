// app/api/transactions/route.ts
import { NextResponse } from "next/server"
import { sql } from "@/app/lib/db"
import type { Transaction } from "@/app/types/common"

export async function POST(request: Request) {
  try {
    const {
      userPublicKey,
      signature,
      status,
      type, // New: transaction type
      inputMint,
      outputMint,
      inputAmount,
      outputAmount,
      paymentRecipient, // New: Solana Pay specific
      paymentAmount, // New: Solana Pay specific
      paymentSplToken, // New: Solana Pay specific
      paymentLabel, // New: Solana Pay specific
      paymentMessage, // New: Solana Pay specific
    } = (await request.json()) as Transaction

    if (!userPublicKey || !type) {
      return NextResponse.json({ error: "Missing required fields: userPublicKey or type" }, { status: 400 })
    }

    // Insert the new transaction into the database
    const result = await sql`
      INSERT INTO transactions (
        user_public_key, signature, status, type,
        input_mint, output_mint, input_amount, output_amount,
        payment_recipient, payment_amount, payment_spl_token, payment_label, payment_message
      )
      VALUES (
        ${userPublicKey}, ${signature || null}, ${status || "pending"}, ${type},
        ${inputMint || null}, ${outputMint || null}, ${inputAmount || null}, ${outputAmount || null},
        ${paymentRecipient || null}, ${paymentAmount || null}, ${paymentSplToken || null}, ${paymentLabel || null}, ${paymentMessage || null}
      )
      RETURNING id, created_at;
    `

    return NextResponse.json({ message: "Transaction saved successfully", transaction: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Failed to save transaction:", error)
    return NextResponse.json({ error: "Failed to save transaction" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Fetch all transactions (for demonstration purposes)
    const transactions = await sql`SELECT * FROM transactions ORDER BY created_at DESC;`
    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
