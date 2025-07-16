"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react"

interface TransactionStatusModalProps {
  isOpen: boolean
  onClose: () => void
  status: "pending" | "confirmed" | "failed"
  signature: string | null
  message?: string
}

export function TransactionStatusModal({ isOpen, onClose, status, signature, message }: TransactionStatusModalProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Loader2 className="h-12 w-12 animate-spin text-gold" />
      case "confirmed":
        return <CheckCircle className="h-12 w-12 text-positive-green" />
      case "failed":
        return <XCircle className="h-12 w-12 text-negative-red" />
      default:
        return null
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case "pending":
        return "Transaction Pending..."
      case "confirmed":
        return "Transaction Confirmed!"
      case "failed":
        return "Transaction Failed"
      default:
        return "Transaction Status"
    }
  }

  const getStatusDescription = () => {
    if (message) return message
    switch (status) {
      case "pending":
        return "Your transaction is being processed on the Solana network."
      case "confirmed":
        return "Your transaction has been successfully confirmed."
      case "failed":
        return "There was an error processing your transaction. Please try again."
      default:
        return ""
    }
  }

  const solanaExplorerUrl = signature ? `https://solscan.io/tx/${signature}` : "#" // Or use your preferred explorer

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-dark-gray text-black dark:text-white border-light-gray dark:border-medium-gray rounded-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="mb-4">{getStatusIcon()}</div>
          <DialogTitle className="text-2xl font-bold text-gold">{getStatusTitle()}</DialogTitle>
          <DialogDescription className="text-black/70 dark:text-light-gray">{getStatusDescription()}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {signature && (
            <a
              href={solanaExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gold hover:underline"
            >
              <span>View on Explorer</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <Button variant="gold-filled" onClick={onClose} className="mt-2">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
