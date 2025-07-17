"use server"

import { sql } from "@/app/lib/db"
import type { PaymentRequest, PaymentStatus } from "@/app/types/payments"
import { type PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { getAssociatedTokenAddressSync, createTransferInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { getLatestBlockhashAndHeight } from "@/app/lib/solana/transaction"

export async function createPaymentRequest(paymentData: Omit<PaymentRequest, "id">) {
  try {
    const id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const result = await sql`
      INSERT INTO payment_requests (
        id, amount, currency, recipient, memo, reference, label, message, spl_token, created_at
      )
      VALUES (
        ${id}, ${paymentData.amount}, ${paymentData.currency}, ${paymentData.recipient},
        ${paymentData.memo}, ${paymentData.reference}, ${paymentData.label},
        ${paymentData.message}, ${paymentData.splToken}, NOW()
      )
      RETURNING *
    `

    return { success: true, payment: { ...result[0], id } }
  } catch (error) {
    console.error("Error creating payment request:", error)
    return { success: false, error: "Failed to create payment request" }
  }
}

export async function createPayment(
  data: Omit<PaymentRequest, "id" | "created_at" | "updated_at" | "status" | "signature">,
): Promise<{ success: boolean; payment?: PaymentRequest; error?: string }> {
  try {
    const [result] = await sql<PaymentRequest[]>`
      INSERT INTO payment_requests (amount, currency, recipient, memo, reference, label, message, spl_token, status)
      VALUES (${data.amount}, ${data.currency}, ${data.recipient}, ${data.memo}, ${data.reference}, ${data.label}, ${data.message}, ${data.splToken}, 'pending')
      RETURNING *;
    `
    if (result) {
      return { success: true, payment: result }
    } else {
      return { success: false, error: "Failed to insert payment request." }
    }
  } catch (error: any) {
    console.error("Database error creating payment request:", error)
    return { success: false, error: error.message || "Database error." }
  }
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentRequest["status"],
  signature?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const [result] = await sql<PaymentRequest[]>`
      UPDATE payment_requests 
      SET status = ${status}, signature = ${signature || null}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id;
    `
    if (result) {
      return { success: true }
    } else {
      return { success: false, error: "Payment request not found or update failed." }
    }
  } catch (error: any) {
    console.error("Database error updating payment status:", error)
    return { success: false, error: error.message || "Database error." }
  }
}

export async function getPaymentStatus(id: string): Promise<PaymentStatus | null> {
  try {
    const [payment] = await sql<PaymentRequest[]>`
      SELECT id, status, signature, created_at, updated_at FROM payment_requests WHERE id = ${id};
    `
    if (payment) {
      return {
        id: payment.id,
        status: payment.status || "pending",
        signature: payment.signature || undefined,
        createdAt: new Date(payment.created_at).getTime(),
        updatedAt: new Date(payment.updated_at || payment.created_at).getTime(),
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching payment status:", error)
    return null
  }
}

export async function getPaymentRequest(
  id: string,
): Promise<{ success: boolean; payment?: PaymentRequest; error?: string }> {
  try {
    const [payment] = await sql<PaymentRequest[]>`
      SELECT * FROM payment_requests WHERE id = ${id};
    `
    if (payment) {
      return { success: true, payment }
    } else {
      return { success: false, error: "Payment request not found." }
    }
  } catch (error: any) {
    console.error("Database error fetching payment request:", error)
    return { success: false, error: error.message || "Database error." }
  }
}

export async function createSolanaPayTransaction(
  payer: PublicKey,
  recipient: PublicKey,
  amount: number, // UI amount
  splToken?: PublicKey,
  memo?: string,
  reference?: PublicKey,
): Promise<Transaction> {
  const { blockhash, lastValidBlockHeight } = await getLatestBlockhashAndHeight()

  const transaction = new Transaction({
    recentBlockhash: blockhash,
    lastValidBlockHeight: lastValidBlockHeight,
    feePayer: payer,
  })

  if (splToken) {
    // SPL Token transfer
    const amountInSmallestUnits = amount * Math.pow(10, 6) // Assuming 6 decimals for common SPL tokens like USDC/USDT
    const fromTokenAccount = getAssociatedTokenAddressSync(splToken, payer)
    const toTokenAccount = getAssociatedTokenAddressSync(splToken, recipient)

    transaction.add(
      createTransferInstruction(fromTokenAccount, toTokenAccount, payer, amountInSmallestUnits, [], TOKEN_PROGRAM_ID),
    )
  } else {
    // SOL transfer
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipient,
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    )
  }

  if (memo) {
    // Add memo instruction (optional, but good for tracking)
    // This requires the memo program to be deployed on chain
    // For simplicity, we'll omit the actual memo program instruction unless explicitly needed
    // transaction.add(new TransactionInstruction({
    //   keys: [{ pubkey: new PublicKey("MemoSq4gqABAXKb96WygZ6s"), isSigner: false, isWritable: false }],
    //   data: Buffer.from(memo, 'utf8'),
    //   programId: new PublicKey("MemoSq4gqABAXKb96WygZ6s"),
    // }));
  }

  if (reference) {
    // Add reference as a read-only account to the transaction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: reference,
        lamports: 0, // No lamports transferred, just for reference
      }),
    )
  }

  return transaction
}
