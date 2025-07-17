"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@/components/wallet-provider"
import { getTransactionsByAddress } from "@/server/actions/trade"
import type { TransactionHistoryItem } from "@/app/types/trade" // Corrected import
import { useToast } from "@/hooks/use-toast"

export function useTransactionHistory() {
  const { address, isConnected } = useWallet()
  const [history, setHistory] = useState<TransactionHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchHistory = useCallback(async () => {
    if (!isConnected || !address) {
      setHistory([])
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const fetchedHistory = await getTransactionsByAddress(address.toBase58())
      setHistory(fetchedHistory)
    } catch (err) {
      console.error("Failed to fetch transaction history:", err)
      setError("Failed to load transaction history.")
      toast({
        title: "Error",
        description: "Failed to load transaction history. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected, toast])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { history, isLoading, error, refetch: fetchHistory }
}
