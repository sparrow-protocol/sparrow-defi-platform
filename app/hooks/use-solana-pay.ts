"use client"

import { useState, useEffect, useCallback } from "react"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"
import { createPaymentRequest, updatePaymentStatus } from "@/server/actions/payments"
import type { PaymentRequest, PaymentStatus } from "@/app/types/payments"
import { encodeURL, findReference, validateTransfer } from "@solana/pay"
import BigNumber from "bignumber.js"
import type { Connection } from "@solana/web3.js"

export function useSolanaPay() {
  const { connection } = useConnection()
  const { toast } = useToast()

  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePaymentQr = useCallback(
    async (recipient: string, amount: number, splToken?: string, label?: string, message?: string) => {
      setIsLoading(true)
      setError(null)
      setQrUrl(null)
      setPaymentId(null)
      setPaymentStatus(null)

      try {
        const newPaymentRequest: Omit<PaymentRequest, "id"> = {
          amount,
          currency: splToken ? "SPL" : "SOL",
          recipient,
          splToken,
          label,
          message,
          status: "pending",
        }

        const { success, payment, error: createError } = await createPaymentRequest(newPaymentRequest)

        if (!success || !payment) {
          throw new Error(createError || "Failed to create payment request.")
        }

        setPaymentId(payment.id)

        const reference = new PublicKey(payment.id)
        const url = encodeURL({
          recipient: new PublicKey(recipient),
          amount: new BigNumber(amount),
          splToken: splToken ? new PublicKey(splToken) : undefined,
          reference,
          label: label || "Sparrow Payment",
          message: message || `Payment for ${amount} ${splToken ? "tokens" : "SOL"}`,
        })

        setQrUrl(url.toString())
        toast({
          title: "QR Code Generated",
          description: "Scan the QR code to complete the payment.",
        })
        return payment.id
      } catch (err: any) {
        console.error("Error generating Solana Pay QR:", err)
        setError(err.message || "Failed to generate payment QR code.")
        toast({
          title: "Error",
          description: err.message || "Failed to generate payment QR code.",
          variant: "destructive",
        })
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const monitorPaymentStatus = useCallback(
    async (id: string, connection: Connection) => {
      if (!id) return

      const reference = new PublicKey(id)
      let signature: string | null = null
      let intervalId: NodeJS.Timeout | null = null

      const checkStatus = async () => {
        try {
          const found = await findReference(connection, reference, { finality: "confirmed" })
          signature = found.signature

          // Validate the transaction
          await validateTransfer(connection, signature, { reference })

          // Update status in DB
          await updatePaymentStatus(id, "completed", signature)
          setPaymentStatus({
            id,
            status: "completed",
            signature,
            createdAt: Date.now(), // Placeholder, ideally from DB
            updatedAt: Date.now(),
          })
          toast({
            title: "Payment Confirmed!",
            description: `Transaction: ${signature.slice(0, 8)}...`,
            variant: "success",
          })
          if (intervalId) clearInterval(intervalId)
        } catch (err: any) {
          if (err.name === "FindReferenceError") {
            // Transaction not found yet, keep polling
            console.log("Transaction not found yet, polling...")
          } else {
            console.error("Error validating payment:", err)
            setError(err.message || "Payment validation failed.")
            updatePaymentStatus(id, "failed")
            setPaymentStatus({
              id,
              status: "failed",
              signature: signature || undefined,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })
            toast({
              title: "Payment Failed",
              description: err.message || "Payment could not be confirmed.",
              variant: "destructive",
            })
            if (intervalId) clearInterval(intervalId)
          }
        }
      }

      // Initial check
      await checkStatus()

      // Poll every 3 seconds
      intervalId = setInterval(checkStatus, 3000)

      return () => {
        if (intervalId) clearInterval(intervalId)
      }
    },
    [toast],
  )

  useEffect(() => {
    if (paymentId && connection) {
      const cleanup = monitorPaymentStatus(paymentId, connection)
      return () => {
        cleanup?.()
      }
    }
  }, [paymentId, connection, monitorPaymentStatus])

  return {
    qrUrl,
    paymentId,
    paymentStatus,
    isLoading,
    error,
    generatePaymentQr,
  }
}
