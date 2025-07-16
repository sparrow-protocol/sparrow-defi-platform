"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/app/types/common"
import { format } from "date-fns"
import { truncatePublicKey, formatNumber } from "@/app/lib/format"
import { ExternalLink } from "lucide-react"

interface TransactionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

export function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  if (!transaction) {
    return null
  }

  const solanaExplorerUrl = transaction.signature ? `https://solscan.io/tx/${transaction.signature}` : "#"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-dark-gray text-black dark:text-white border-light-gray dark:border-medium-gray rounded-md">
        <DialogHeader>
          <DialogTitle className="text-gold">Transaction Details</DialogTitle>
          <DialogDescription className="text-black/70 dark:text-light-gray">
            Detailed information about your transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-black dark:text-white text-sm">
          <div className="flex justify-between">
            <span className="font-semibold text-black/70 dark:text-light-gray">ID:</span>
            <span>{transaction.id || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black/70 dark:text-light-gray">Type:</span>
            <span className="capitalize">{transaction.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black/70 dark:text-light-gray">Status:</span>
            <span
              className={`font-semibold ${
                transaction.status === "completed"
                  ? "text-positive-green"
                  : transaction.status === "failed"
                    ? "text-negative-red"
                    : "text-gold"
              }`}
            >
              {transaction.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black/70 dark:text-light-gray">Date:</span>
            <span>{transaction.createdAt ? format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm") : "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-black/70 dark:text-light-gray">User Public Key:</span>
            <span>{truncatePublicKey(transaction.userPublicKey, 8, 8)}</span>
          </div>

          {transaction.type === "swap" && (
            <>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70 dark:text-light-gray">Input Token Mint:</span>
                <span>{truncatePublicKey(transaction.inputMint || "N/A", 8, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70 dark:text-light-gray">Input Amount:</span>
                <span>{transaction.inputAmount ? formatNumber(Number(transaction.inputAmount), 6) : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70 dark:text-light-gray">Output Token Mint:</span>
                <span>{truncatePublicKey(transaction.outputMint || "N/A", 8, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70 dark:text-light-gray">Output Amount:</span>
                <span>{transaction.outputAmount ? formatNumber(Number(transaction.outputAmount), 6) : "N/A"}</span>
              </div>
            </>
          )}

          {transaction.type === "payment" && (
            <>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70 dark:text-light-gray">Recipient:</span>
                <span>{truncatePublicKey(transaction.paymentRecipient || "N/A", 8, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-black/70 dark:text-light-gray">Payment Amount:</span>
                <span>
                  {transaction.paymentAmount ? formatNumber(Number(transaction.paymentAmount), 6) : "N/A"}{" "}
                  {transaction.paymentSplToken ? truncatePublicKey(transaction.paymentSplToken, 4, 4) : "SOL"}
                </span>
              </div>
              {transaction.paymentLabel && (
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70 dark:text-light-gray">Label:</span>
                  <span>{transaction.paymentLabel}</span>
                </div>
              )}
              {transaction.paymentMessage && (
                <div className="flex justify-between">
                  <span className="font-semibold text-black/70 dark:text-light-gray">Message:</span>
                  <span>{transaction.paymentMessage}</span>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between items-center">
            <span className="font-semibold text-black/70 dark:text-light-gray">Signature:</span>
            {transaction.signature ? (
              <a
                href={solanaExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gold hover:underline"
              >
                <span>{truncatePublicKey(transaction.signature, 6, 4)}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              "N/A"
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="gold-filled" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
