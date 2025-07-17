"use client"

import { useState, useEffect, useCallback } from "react"
import { useSwapSettings } from "@/app/context/swap-settings"
import { getSwapQuote } from "@/server/actions/swap"
import type { TokenInfo } from "@/app/types/tokens"
import type { JupiterRoute } from "@/app/types/jupiter"
import { useToast } from "@/hooks/use-toast"
import { TRANSACTION_LIMITS } from "@/app/lib/constants"

export function useSwapQuote(
  inputToken: TokenInfo | null,
  outputToken: TokenInfo | null,
  amount: string,
  swapMode: "ExactIn" | "ExactOut" = "ExactIn",
) {
  const { slippageBps } = useSwapSettings()
  const { toast } = useToast()

  const [quote, setQuote] = useState<JupiterRoute | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchedAmount, setLastFetchedAmount] = useState<string | null>(null)

  const fetchQuote = useCallback(async () => {
    if (!inputToken || !outputToken || !amount || Number.parseFloat(amount) <= 0) {
      setQuote(null)
      setError(null)
      setIsLoading(false)
      return
    }

    // Prevent fetching for the same amount repeatedly
    if (amount === lastFetchedAmount) {
      return
    }

    setIsLoading(true)
    setError(null)
    setLastFetchedAmount(amount)

    try {
      const quoteData = await getSwapQuote(
        inputToken.address,
        outputToken.address,
        Number.parseFloat(amount),
        slippageBps,
        swapMode,
      )

      if (quoteData) {
        setQuote(quoteData)
      } else {
        setQuote(null)
        setError("No swap route found for the given tokens and amount.")
        toast({
          title: "No Route Found",
          description: "Could not find a swap route. Try a different amount or tokens.",
          variant: "warning",
        })
      }
    } catch (err: any) {
      console.error("Error fetching swap quote:", err)
      setQuote(null)
      setError(err.message || "Failed to fetch swap quote.")
      toast({
        title: "Error Fetching Quote",
        description: err.message || "An unexpected error occurred while fetching the swap quote.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [inputToken, outputToken, amount, slippageBps, swapMode, lastFetchedAmount, toast])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchQuote()
    }, 500) // Debounce fetching to avoid excessive API calls

    return () => clearTimeout(handler)
  }, [fetchQuote])

  // Auto-refresh quote at intervals
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !error && quote) {
        fetchQuote()
      }
    }, TRANSACTION_LIMITS.QUOTE_REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [isLoading, error, quote, fetchQuote])

  return { quote, isLoading, error, refetchQuote: fetchQuote }
}
