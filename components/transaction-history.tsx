"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react"
import { formatTokenAmount, truncatePublicKey, formatDate } from "@/app/lib/format"
import { TransactionDetailsModal } from "@/components/transaction-details-modal"
import { useTransactionHistory } from "@/app/hooks/use-transaction-history"
import type { TransactionHistoryItem } from "@/app/types/trade" // Corrected import
import { useWallet } from "@/components/wallet-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function TransactionHistory() {
  const { isConnected } = useWallet()
  const { history, isLoading, error, refetch } = useTransactionHistory()
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionHistoryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRowClick = (transaction: TransactionHistoryItem) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <p className="text-muted-foreground">Connect your wallet to view transaction history.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-red-500">
        <p>Error loading transactions: {error}</p>
        <Button onClick={refetch} variant="outline" className="mt-4 bg-transparent">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Signature</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            history.map((tx) => (
              <TableRow
                key={tx.signature}
                onClick={() => handleRowClick(tx)}
                className="cursor-pointer hover:bg-accent"
              >
                <TableCell className="capitalize flex items-center">
                  {tx.type === "swap" && <RefreshCw className="mr-2 h-4 w-4 text-blue-500" />}
                  {tx.type === "transfer" && tx.amount && tx.amount > 0 && (
                    <ArrowDownLeft className="mr-2 h-4 w-4 text-green-500" />
                  )}
                  {tx.type === "transfer" && tx.amount && tx.amount < 0 && (
                    <ArrowUpRight className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  {tx.type}
                </TableCell>
                <TableCell>
                  {tx.type === "swap" ? (
                    <>
                      {tx.inputAmount ? formatTokenAmount(tx.inputAmount) : "N/A"} {tx.inputTokenSymbol || ""}
                      {" -> "}
                      {tx.outputAmount ? formatTokenAmount(tx.outputAmount) : "N/A"} {tx.outputTokenSymbol || ""}
                    </>
                  ) : (
                    <>
                      {tx.amount ? formatTokenAmount(tx.amount) : "N/A"} {tx.tokenSymbol || ""}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`capitalize ${tx.status === "success" ? "text-green-500" : "text-red-500"}`}>
                    {tx.status}
                  </span>
                </TableCell>
                <TableCell>{formatDate(tx.timestamp * 1000, "short")}</TableCell>
                <TableCell className="text-right font-mono">{truncatePublicKey(tx.signature)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  )
}
