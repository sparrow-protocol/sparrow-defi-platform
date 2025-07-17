import { type NextRequest, NextResponse } from "next/server"
import { queryDb } from "@/app/lib/db"
import type { TransactionRecord } from "@/app/types/transactions"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const walletAddress = searchParams.get("walletAddress")
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
  const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
  }

  try {
    const transactions = await queryDb<TransactionRecord>(
      `SELECT * FROM transactions WHERE wallet_address = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3`,
      [walletAddress, limit, offset],
    )
    return NextResponse.json(transactions)
  } catch (error: any) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      walletAddress,
      signature,
      transactionType,
      amount,
      tokenMint,
      usdValue,
      status,
      fee,
      paymentRecipient,
      paymentAmount,
      paymentTokenMint,
    } = await req.json()

    if (!walletAddress || !signature || !transactionType || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await queryDb(
      `INSERT INTO transactions (
        wallet_address, signature, transaction_type, amount, token_mint, usd_value, status, fee,
        payment_recipient, payment_amount, payment_token_mint
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        walletAddress,
        signature,
        transactionType,
        amount,
        tokenMint,
        usdValue,
        status,
        fee,
        paymentRecipient,
        paymentAmount,
        paymentTokenMint,
      ],
    )
    return NextResponse.json(result[0], { status: 201 })
  } catch (error: any) {
    console.error("Error inserting transaction:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
