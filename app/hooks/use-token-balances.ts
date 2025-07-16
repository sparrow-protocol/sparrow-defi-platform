"use client"

import { useState, useEffect, useCallback } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { useWallet } from "@/components/wallet-provider"
import { useToast } from "@/app/hooks/use-toast"
import type { Token } from "@/app/types/tokens"

const SOL_MINT = "So11111111111111111111111111111111111111112"
const HELIUS_RPC_URL =
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com"
const connection = new Connection(HELIUS_RPC_URL, "confirmed")

interface TokenBalance {
  mint: string
  amount: number
  uiAmountString: string
}

export function useTokenBalances(tokens: Token[] = []) {
  const { address, isConnected } = useWallet()
  const { showToast } = useToast()

  const [balances, setBalances] = useState<Record<string, TokenBalance>>({})
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = useCallback(async () => {
    if (!isConnected || !address) {
      setBalances({})
      return
    }

    setIsLoadingBalances(true)
    setError(null)

    try {
      const owner = new PublicKey(address)

      const [solBalanceLamports, tokenAccounts] = await Promise.all([
        connection.getBalance(owner),
        connection.getParsedTokenAccountsByOwner(owner, {
          programId: TOKEN_PROGRAM_ID,
        }),
      ])

      const solBalance = solBalanceLamports / 1e9
      const newBalances: Record<string, TokenBalance> = {
        [SOL_MINT]: {
          mint: SOL_MINT,
          amount: solBalance,
          uiAmountString: solBalance.toString(),
        },
      }

      for (const { account } of tokenAccounts.value) {
        const info = account.data.parsed.info
        const mint = info.mint
        const uiAmount = info.tokenAmount.uiAmount
        const rawAmount = info.tokenAmount.amount

        if (uiAmount && Number(uiAmount) > 0) {
          newBalances[mint] = {
            mint,
            amount: uiAmount,
            uiAmountString: rawAmount,
          }
        }
      }

      setBalances(newBalances)
    } catch (err: any) {
      console.error("Error fetching token balances:", err)
      setError(err.message || "Failed to fetch balances.")
      showToast({
        message: err.message || "Failed to load balances.",
        type: "error",
      })
    } finally {
      setIsLoadingBalances(false)
    }
  }, [address, isConnected, showToast])

  useEffect(() => {
    fetchBalances()
    const interval = setInterval(fetchBalances, 30000)
    return () => clearInterval(interval)
  }, [fetchBalances])

  return {
    balances,
    isLoadingBalances,
    error,
    refetchBalances: fetchBalances,
    getBalanceForMint: (mint: string) => balances[mint]?.amount || 0,
  }
}
