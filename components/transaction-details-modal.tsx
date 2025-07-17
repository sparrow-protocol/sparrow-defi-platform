"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatTokenAmount, truncatePublicKey } from "@/app/lib/format"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import type { TransactionHistoryItem } from "@/app/types/trade" // Corrected import

interface TransactionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: TransactionHistoryItem | null
}

export function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  if (!transaction) {
    return null
  }

  const explorerUrl = `https://solscan.io/tx/${transaction.signature}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>Information about your recent transaction.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium capitalize">{transaction.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span
              className={`font-medium capitalize ${transaction.status === "success" ? "text-green-500" : "text-red-500"}`}
            >
              {transaction.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{formatDate(transaction.timestamp * 1000, "long")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Signature:</span>
            <span className="font-mono">{truncatePublicKey(transaction.signature)}</span>
          </div>

          {transaction.type === "swap" && (
            <>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Input Amount:</span>
                <span className="font-medium">
                  {transaction.inputAmount ? formatTokenAmount(transaction.inputAmount) : "N/A"}{" "}
                  {transaction.inputTokenSymbol || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Output Amount:</span>
                <span className="font-medium">
                  {transaction.outputAmount ? formatTokenAmount(transaction.outputAmount) : "N/A"}{" "}
                  {transaction.outputTokenSymbol || ""}
                </span>
              </div>
            </>
          )}

          {(transaction.type === "transfer" || transaction.type === "mint" || transaction.type === "burn") && (
            <>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">
                  {transaction.amount ? formatTokenAmount(transaction.amount) : "N/A"} {transaction.tokenSymbol || ""}
                </span>
              </div>
              {transaction.from && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-mono">{truncatePublicKey(transaction.from)}</span>
                </div>
              )}
              {transaction.to && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-mono">{truncatePublicKey(transaction.to)}</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
              View on Solscan <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
