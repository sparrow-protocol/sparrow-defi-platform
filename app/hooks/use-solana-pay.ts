// app/hooks/use-solana-pay.ts
"use client"

import { useState, useCallback } from "react"
import type { SolanaPayTransactionRequest } from "@/app/types/solana-pay"
import { useToast } from "@/app/hooks/use-toast"
import type { Transaction } from "@/app/types/common"

interface SolanaPayResult {
  solanaPayUrl: string | null
  transactionBase64: string | null
  isLoading: boolean
  error: string | null
  generateSolanaPayUrl: (
    request: Omit<SolanaPayTransactionRequest, "recipient"> & { recipient: string },
  ) => Promise<void>
  savePaymentTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt" | "signature" | "status"> & {
      status?: "pending" | "completed" | "failed"
    },
  ) => Promise<void>
}

export function useSolanaPay(recipientAddress: string): SolanaPayResult {
  const [solanaPayUrl, setSolanaPayUrl] = useState<string | null>(null)
  const [transactionBase64, setTransactionBase64] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const generateSolanaPayUrl = useCallback(
    async (request: Omit<SolanaPayTransactionRequest, "recipient"> & { recipient: string }) => {
      setIsLoading(true)
      setError(null)
      setSolanaPayUrl(null)
      setTransactionBase64(null)

      try {
        const response = await fetch("/api/solana-pay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...request,
            recipient: recipientAddress, // Use the hook's recipient
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to generate Solana Pay URL")
        }

        const data = await response.json()
        setSolanaPayUrl(data.solanaPayUrl)
        setTransactionBase64(data.transaction)
        showToast({ message: "Solana Pay QR generated!", type: "success" })
      } catch (err: any) {
        console.error("Error generating Solana Pay URL:", err)
        setError(err.message || "An unknown error occurred.")
        showToast({ message: err.message || "Failed to generate Solana Pay QR.", type: "error" })
      } finally {
        setIsLoading(false)
      }
    },
    [recipientAddress, showToast],
  )

  const savePaymentTransaction = useCallback(
    async (
      transaction: Omit<Transaction, "id" | "createdAt" | "signature"> & {
        status?: "pending" | "completed" | "failed"
      },
    ) => {
      try {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to save payment transaction.")
        }
        console.log("Payment transaction saved:", await response.json())
      } catch (err: any) {
        console.error("Error saving payment transaction:", err)
        showToast({ message: err.message || "Failed to record payment transaction.", type: "error" })
      }
    },
    [showToast],
  )

  return { solanaPayUrl, transactionBase64, isLoading, error, generateSolanaPayUrl, savePaymentTransaction }
}
