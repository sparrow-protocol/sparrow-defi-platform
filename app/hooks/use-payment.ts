"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/components/wallet-provider"
import type { TransactionType } from "@/app/types/transactions"
import type { Token } from "@/app/types/tokens"

interface PaymentOptions {
  recipientAddress: string
  amount: number
  token?: Token // Optional token for SPL transfers
  transactionType: TransactionType
  usdValue?: number
  fee?: number
}

export function usePayment() {
  const { address, signTransaction, isConnected } = useWallet()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastSignature, setLastSignature] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const makePayment = useCallback(
    async ({ recipientAddress, amount, token, transactionType, usdValue, fee }: PaymentOptions) => {
      if (!isConnected || !address) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to make a payment.",
          type: "warning",
        })
        setPaymentError("Wallet not connected")
        return null
      }

      setIsProcessing(true)
      setLastSignature(null)
      setPaymentError(null)

      try {
        // 1. Create a payment request via the /api/solana-pay endpoint
        const response = await fetch("/api/solana-pay", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: recipientAddress,
            amount: amount,
            "spl-token": token?.address,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create payment request.")
        }

        const { transaction } = await response.json()

        // 2. Sign the transaction
        const signedTransaction = await signTransaction(transaction)

        if (!signedTransaction) {
          throw new Error("Failed to sign transaction.")
        }

        // 3. Send the transaction to the network
        const signatureResponse = await fetch("/api/solana-pay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account: address.toBase58(),
            transaction: transaction,
            signature: signedTransaction.signature.toString("base64"),
          }),
        })

        if (!signatureResponse.ok) {
          const errorData = await signatureResponse.json()
          throw new Error(errorData.error || "Failed to send transaction.")
        }

        const { message } = await signatureResponse.json()

        setLastSignature(message)
        toast({
          title: "Payment Successful!",
          description: `Transaction confirmed: ${message}`,
          type: "success",
          duration: 5000,
        })

        return message
      } catch (error: any) {
        console.error("Payment failed:", error)
        setPaymentError(error.message || "An unknown error occurred during payment.")
        toast({
          title: "Payment Failed",
          description: error.message || "An unknown error occurred during payment.",
          type: "error",
          duration: 5000,
        })
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [address, signTransaction, isConnected, toast],
  )

  return {
    isProcessing,
    lastSignature,
    paymentError,
    makePayment,
  }
}
