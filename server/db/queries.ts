"use server"

import { sql } from "@/app/lib/db"
import type { PaymentRequest } from "@/app/types/payments"
import type { User } from "@/app/types/users"
import type { Transaction } from "@/app/types/common"

// --- Payment Requests ---
export async function createPaymentRequest(
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

export async function updatePaymentRequest(
  id: string,
  data: Partial<Omit<PaymentRequest, "id" | "created_at" | "updated_at">>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const [result] = await sql<PaymentRequest[]>`
      UPDATE payment_requests
      SET
        amount = COALESCE(${data.amount}, amount),
        currency = COALESCE(${data.currency}, currency),
        recipient = COALESCE(${data.recipient}, recipient),
        memo = COALESCE(${data.memo}, memo),
        reference = COALESCE(${data.reference}, reference),
        label = COALESCE(${data.label}, label),
        message = COALESCE(${data.message}, message),
        spl_token = COALESCE(${data.splToken}, spl_token),
        status = COALESCE(${data.status}, status),
        signature = COALESCE(${data.signature}, signature),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id;
    `
    if (result) {
      return { success: true }
    } else {
      return { success: false, error: "Payment request not found or update failed." }
    }
  } catch (error: any) {
    console.error("Database error updating payment request:", error)
    return { success: false, error: error.message || "Database error." }
  }
}

// --- User Profiles ---
export async function getUser(privyId: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const [user] = await sql<User[]>`
      SELECT * FROM users WHERE privy_id = ${privyId};
    `
    if (user) {
      return { success: true, user }
    } else {
      return { success: false, error: "User not found." }
    }
  } catch (error: any) {
    console.error("Database error fetching user:", error)
    return { success: false, error: error.message || "Database error." }
  }
}

export async function upsertUser(
  privyId: string,
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "privyId">>,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const [user] = await sql<User[]>`
      INSERT INTO users (privy_id, email, phone, wallet_address, embedded_wallet_address, username, avatar_url, preferences)
      VALUES (
        ${privyId},
        ${data.email || null},
        ${data.phone || null},
        ${data.walletAddress || null},
        ${data.embeddedWalletAddress || null},
        ${data.username || null},
        ${data.avatarUrl || null},
        ${JSON.stringify(data.preferences || { theme: "system", notifications: true })}::jsonb
      )
      ON CONFLICT (privy_id) DO UPDATE SET
        email = COALESCE(EXCLUDED.email, users.email),
        phone = COALESCE(EXCLUDED.phone, users.phone),
        wallet_address = COALESCE(EXCLUDED.wallet_address, users.wallet_address),
        embedded_wallet_address = COALESCE(EXCLUDED.embedded_wallet_address, users.embedded_wallet_address),
        username = COALESCE(EXCLUDED.username, users.username),
        avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
        preferences = users.preferences || EXCLUDED.preferences, -- Merge JSONB
        updated_at = NOW()
      RETURNING *;
    `
    if (user) {
      return { success: true, user }
    } else {
      return { success: false, error: "Failed to upsert user." }
    }
  } catch (error: any) {
    console.error("Database error upserting user:", error)
    return { success: false, error: error.message || "Database error." }
  }
}

// --- Transactions ---
export async function createTransaction(
  data: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
): Promise<{ success: boolean; transaction?: Transaction; error?: string }> {
  try {
    const [result] = await sql<Transaction[]>`
      INSERT INTO transactions (user_public_key, signature, status, type, input_mint, output_mint, input_amount, output_amount, payment_recipient, payment_amount, payment_spl_token, payment_label, payment_message)
      VALUES (
        ${data.userPublicKey},
        ${data.signature || null},
        ${data.status},
        ${data.type},
        ${data.inputMint || null},
        ${data.outputMint || null},
        ${data.inputAmount || null},
        ${data.outputAmount || null},
        ${data.paymentRecipient || null},
        ${data.paymentAmount || null},
        ${data.paymentSplToken || null},
        ${data.paymentLabel || null},
        ${data.paymentMessage || null}
      )
      RETURNING *;
    `
    if (result) {
      return { success: true, transaction: result }
    } else {
      return { success: false, error: "Failed to insert transaction." }
    }
  } catch (error: any) {
    console.error("Database error creating transaction:", error)
    return { success: false, error: error.message || "Database error." }
  }
}

export async function getTransactions(
  userPublicKey: string,
): Promise<{ success: boolean; transactions?: Transaction[]; error?: string }> {
  try {
    const transactions = await sql<Transaction[]>`
      SELECT * FROM transactions WHERE user_public_key = ${userPublicKey} ORDER BY created_at DESC;
    `
    return { success: true, transactions }
  } catch (error: any) {
    console.error("Database error fetching transactions:", error)
    return { success: false, error: error.message || "Database error." }
  }
}

export async function updateTransactionStatus(
  signature: string,
  status: Transaction["status"],
): Promise<{ success: boolean; error?: string }> {
  try {
    const [result] = await sql<Transaction[]>`
      UPDATE transactions
      SET status = ${status}, updated_at = NOW()
      WHERE signature = ${signature}
      RETURNING signature;
    `
    if (result) {
      return { success: true }
    } else {
      return { success: false, error: "Transaction not found or update failed." }
    }
  } catch (error: any) {
    console.error("Database error updating transaction status:", error)
    return { success: false, error: error.message || "Database error." }
  }
}
