"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ExternalLink, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react" // Import ArrowUp, ArrowDown
import { useToast } from "@/app/hooks/use-toast"
import type { Transaction } from "@/app/types/common"
import { truncatePublicKey } from "@/app/lib/format"
import { Button } from "@/components/ui/button"
import { TransactionDetailsModal } from "@/components/transaction-details-modal"
import { formatNumber } from "@/app/lib/format"

// Skeleton component for loading state
const TableRowSkeleton = () => (
  <TableRow className="animate-pulse border-b border-light-gray dark:border-dark-gray">
    <TableCell className="py-4">
      <div className="h-4 bg-medium-gray rounded dark:bg-input-bg-dark w-24" />
    </TableCell>
    <TableCell>
      <div className="h-4 bg-medium-gray rounded dark:bg-input-bg-dark w-16" />
    </TableCell>
    <TableCell>
      <div className="h-4 bg-medium-gray rounded dark:bg-input-bg-dark w-32" />
    </TableCell>
    <TableCell>
      <div className="h-4 bg-medium-gray rounded dark:bg-input-bg-dark w-20" />
    </TableCell>
    <TableCell>
      <div className="h-4 bg-medium-gray rounded dark:bg-input-bg-dark w-20" />
    </TableCell>
    <TableCell>
      <div className="h-4 bg-medium-gray rounded dark:bg-input-bg-dark w-28" />
    </TableCell>
  </TableRow>
)

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()
  const [activeFilterTab, setActiveFilterTab] = useState<"all" | "swaps" | "payments">("all")
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Sorting states
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc") // Default to descending for date

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // You can adjust this number

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/transactions")
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.statusText}`)
        }
        const data: Transaction[] = await response.json()
        setTransactions(data)
      } catch (error: any) {
        console.error("Error fetching transactions:", error)
        showToast({ message: error.message || "Failed to load transaction history.", type: "error" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [showToast])

  const sortedAndFilteredTransactions = useMemo(() => {
    let filtered = transactions.filter((tx) => {
      if (activeFilterTab === "all") return true
      return tx.type === activeFilterTab
    })

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let valA: any
        let valB: any

        switch (sortColumn) {
          case "date":
            valA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            valB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            break
          case "type":
            valA = a.type.toLowerCase()
            valB = b.type.toLowerCase()
            break
          case "amount":
            // For amount, we need to consider both input/output for swaps and paymentAmount for payments
            const getNumericAmount = (tx: Transaction) => {
              if (tx.type === "swap" && tx.inputAmount) return Number(tx.inputAmount)
              if (tx.type === "payment" && tx.paymentAmount) return Number(tx.paymentAmount)
              return 0
            }
            valA = getNumericAmount(a)
            valB = getNumericAmount(b)
            break
          case "status":
            valA = a.status?.toLowerCase() || ""
            valB = b.status?.toLowerCase() || ""
            break
          default:
            return 0
        }

        if (typeof valA === "string" && typeof valB === "string") {
          return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        return sortDirection === "asc" ? valA - valB : valB - valA
      })
    }

    return filtered
  }, [transactions, activeFilterTab, sortColumn, sortDirection])

  // Reset to first page when filter or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilterTab, sortColumn, sortDirection])

  // Calculate current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedAndFilteredTransactions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedAndFilteredTransactions.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailsModalOpen(true)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc") // Default sort direction for new column
    }
  }

  const getSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
    }
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-gold">Transaction History</CardTitle>
        <CardDescription className="text-black/70 dark:text-light-gray">
          Your recent swap and payment transactions. Click on a transaction for more details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex justify-center space-x-2 rounded-md bg-medium-gray p-1 dark:bg-input-bg-dark">
          <Button
            variant="ghost"
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${activeFilterTab === "all" ? "bg-gold text-black" : "text-black hover:bg-light-gray dark:text-white dark:hover:bg-dark-gray"}`}
            onClick={() => setActiveFilterTab("all")}
          >
            All
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${activeFilterTab === "swaps" ? "bg-gold text-black" : "text-black hover:bg-light-gray dark:text-white dark:hover:bg-dark-gray"}`}
            onClick={() => setActiveFilterTab("swaps")}
          >
            Swaps
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${activeFilterTab === "payments" ? "bg-gold text-black" : "text-black hover:bg-light-gray dark:text-white dark:hover:bg-dark-gray"}`}
            onClick={() => setActiveFilterTab("payments")}
          >
            Payments
          </Button>
        </div>

        {isLoading ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-medium-gray dark:bg-input-bg-dark">
                  <TableHead className="text-black dark:text-white">Date</TableHead>
                  <TableHead className="text-black dark:text-white">Type</TableHead>
                  <TableHead className="text-black dark:text-white">Details</TableHead>
                  <TableHead className="text-black dark:text-white">Amount</TableHead>
                  <TableHead className="text-black dark:text-white">Status</TableHead>
                  <TableHead className="text-black dark:text-white">Signature</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : sortedAndFilteredTransactions.length === 0 ? (
          <div className="text-center text-black/70 dark:text-light-gray py-8">
            No {activeFilterTab !== "all" ? activeFilterTab : ""} transactions found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-medium-gray dark:bg-input-bg-dark">
                    <TableHead
                      className="text-black dark:text-white cursor-pointer hover:text-gold flex items-center"
                      onClick={() => handleSort("date")}
                    >
                      Date {getSortIcon("date")}
                    </TableHead>
                    <TableHead
                      className="text-black dark:text-white cursor-pointer hover:text-gold flex items-center"
                      onClick={() => handleSort("type")}
                    >
                      Type {getSortIcon("type")}
                    </TableHead>
                    <TableHead className="text-black dark:text-white">Details</TableHead>
                    <TableHead
                      className="text-black dark:text-white cursor-pointer hover:text-gold flex items-center"
                      onClick={() => handleSort("amount")}
                    >
                      Amount {getSortIcon("amount")}
                    </TableHead>
                    <TableHead
                      className="text-black dark:text-white cursor-pointer hover:text-gold flex items-center"
                      onClick={() => handleSort("status")}
                    >
                      Status {getSortIcon("status")}
                    </TableHead>
                    <TableHead className="text-black dark:text-white">Signature</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((tx) => (
                    <TableRow
                      key={tx.id}
                      className="border-b border-light-gray dark:border-dark-gray cursor-pointer hover:bg-medium-gray dark:hover:bg-input-bg-dark"
                      onClick={() => handleRowClick(tx)}
                    >
                      <TableCell className="text-black dark:text-white">
                        {tx.createdAt ? format(new Date(tx.createdAt), "MMM dd, HH:mm") : "N/A"}
                      </TableCell>
                      <TableCell className="text-black dark:text-white capitalize">{tx.type}</TableCell>
                      <TableCell className="text-black dark:text-white">
                        {tx.type === "swap" && tx.inputMint && tx.outputMint
                          ? `From ${truncatePublicKey(tx.inputMint, 4, 4)} To ${truncatePublicKey(tx.outputMint, 4, 4)}`
                          : tx.type === "payment" && tx.paymentRecipient
                            ? `To ${truncatePublicKey(tx.paymentRecipient, 4, 4)}`
                            : "N/A"}
                      </TableCell>
                      <TableCell className="text-black dark:text-white">
                        {tx.type === "swap" && tx.inputAmount && tx.outputAmount
                          ? `${formatNumber(Number(tx.inputAmount), 4)} -> ${formatNumber(Number(tx.outputAmount), 4)}`
                          : tx.type === "payment" && tx.paymentAmount
                            ? `${formatNumber(Number(tx.paymentAmount), 6)} ${tx.paymentSplToken ? truncatePublicKey(tx.paymentSplToken, 4, 4) : "SOL"}`
                            : "N/A"}
                      </TableCell>
                      <TableCell
                        className={`font-semibold ${
                          tx.status === "completed"
                            ? "text-positive-green"
                            : tx.status === "failed"
                              ? "text-negative-red"
                              : "text-gold"
                        }`}
                      >
                        {tx.status}
                      </TableCell>
                      <TableCell>
                        {tx.signature ? (
                          <a
                            href={`https://solscan.io/tx/${tx.signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-gold hover:underline"
                            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking link
                          >
                            <span>{truncatePublicKey(tx.signature, 6, 4)}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-gold hover:bg-medium-gray dark:hover:bg-input-bg-dark"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "gold-filled" : "ghost"}
                    size="sm"
                    onClick={() => paginate(page)}
                    className={`h-8 w-8 rounded-md text-sm ${currentPage === page ? "text-black" : "text-black hover:bg-light-gray dark:text-white dark:hover:bg-dark-gray"}`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-gold hover:bg-medium-gray dark:hover:bg-input-bg-dark"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>

      <TransactionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </Card>
  )
}
