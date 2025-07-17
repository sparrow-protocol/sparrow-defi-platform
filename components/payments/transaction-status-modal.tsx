"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react"
import { truncatePublicKey } from "@/app/lib/format"
import Link from "next/link"
import { usePayment } from "@/app/hooks/use-payment"
import { useEffect } from "react"

interface TransactionStatusModalProps {
  isOpen: boolean
  onClose: () => void
  paymentRequestId: string | null
}

export function TransactionStatusModal({ isOpen, onClose, paymentRequestId }: TransactionStatusModalProps) {
  const { status, isLoading, error, fetchPaymentStatus } = usePayment()

  useEffect(() => {
    if (isOpen && paymentRequestId) {
      const interval = setInterval(() => {
        fetchPaymentStatus(paymentRequestId)
      }, 3000) // Poll every 3 seconds

      return () => clearInterval(interval)
    }
  }, [isOpen, paymentRequestId, fetchPaymentStatus])

  const getTitle = () => {
    if (isLoading) return "Processing Payment..."
    if (error) return "Payment Error"
    if (!status) return "Payment Status"

    switch (status.status) {
      case "pending":
        return "Payment Pending"
      case "processing":
        return "Payment Processing"
      case "completed":
        return "Payment Successful!"
      case "failed":
        return "Payment Failed"
      case "expired":
        return "Payment Expired"
      default:
        return "Payment Status"
    }
  }

  const getDescription = () => {
    if (isLoading) return "Your transaction is being processed on the Solana network. Please wait."
    if (error) return error
    if (!status) return "Fetching payment status..."

    switch (status.status) {
      case "pending":
        return "Waiting for the transaction to be confirmed on the blockchain."
      case "processing":
        return "The transaction has been sent and is awaiting final confirmation."
      case "completed":
        return "Your payment has been successfully completed and confirmed!"
      case "failed":
        return "The payment transaction failed. Please check the details and try again."
      case "expired":
        return "The payment request has expired. Please generate a new one."
      default:
        return "Checking transaction status..."
    }
  }

  const getIcon = () => {
    if (isLoading || status?.status === "pending" || status?.status === "processing") {
      return <Loader2 className="h-16 w-16 animate-spin text-primary" />
    }
    if (status?.status === "completed") {
      return <CheckCircle2 className="h-16 w-16 text-green-500" />
    }
    if (status?.status === "failed" || status?.status === "expired" || error) {
      return <XCircle className="h-16 w-16 text-red-500" />
    }
    return null
  }

  const explorerUrl = status?.signature ? `https://solscan.io/tx/${status.signature}` : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] text-center">
        <DialogHeader>
          <div className="flex justify-center mb-4">{getIcon()}</div>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {status?.signature && (
            <div className="text-sm text-muted-foreground">
              Transaction Signature: <span className="font-mono">{truncatePublicKey(status.signature, 8, 8)}</span>
            </div>
          )}
          {explorerUrl && (
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
                View on Solscan <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
