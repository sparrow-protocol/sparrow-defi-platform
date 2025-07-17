"use client"

import { useState, useEffect, useCallback } from "react"
import { useConnection } from "@solana/wallet-adapter-react"
import { getTokenBalances as fetchTokenBalancesAction } from "@/server/actions/tokens"
import { useToast } from "@/hooks/use-toast"
import type { Balance } from "@/app/types/balance"
import { TRANSACTION_LIMITS } from "@/app/lib/constants"

export function useTokenBalances(walletAddress: string | null) {
  const { connection } = useConnection()
  const [balances, setBalances] = useState<Balance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBalances = useCallback(async () => {
    if (!walletAddress) {
      setBalances([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const fetchedBalances = await fetchTokenBalancesAction(walletAddress)
      setBalances(fetchedBalances)
    } catch (err: any) {
      console.error("Error fetching token balances:", err)
      setError(err.message || "Failed to load token balances.")
      toast({
        title: "Error",
        description: err.message || "Failed to load token balances. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress, toast])

  useEffect(() => {
    fetchBalances()
  }, [fetchBalances])

  // Auto-refresh balances at intervals
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !error) {
        fetchBalances()
      }
    }, TRANSACTION_LIMITS.BALANCE_REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [isLoading, error, fetchBalances])

  return { balances, isLoading, error, refetch: fetchBalances }
}
