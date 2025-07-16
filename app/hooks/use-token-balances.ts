// app/hooks/use-token-balances.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { useWallet } from "@/components/wallet-provider"
import { useToast } from "@/app/hooks/use-toast"
import type { Token } from "@/app/types/tokens"

interface TokenBalance {
  mint: string
  amount: number // Formatted readable amount
  uiAmountString: string // Raw string amount
}

// Use Helius RPC if available, otherwise default Solana RPC
const HELIUS_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com"
const connection = new Connection(HELIUS_RPC_URL, "confirmed")

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
      const ownerPublicKey = new PublicKey(address)

      // Fetch SOL balance
      const solBalanceLamports = await connection.getBalance(ownerPublicKey)
      const solBalance = solBalanceLamports / 10 ** 9 // SOL has 9 decimals
      setBalances((prev) => ({
        ...prev,
        SOL: {
          mint: "So11111111111111111111111111111111111111112",
          amount: solBalance,
          uiAmountString: solBalance.toString(),
        },
      }))

      // Fetch SPL token balances
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
        programId: TOKEN_PROGRAM_ID,
      })

      const newBalances: Record<string, TokenBalance> = {
        SOL: {
          mint: "So11111111111111111111111111111111111111112",
          amount: solBalance,
          uiAmountString: solBalance.toString(),
        },
      }

      tokenAccounts.value.forEach((account) => {
        const parsedInfo = account.account.data.parsed.info
        const mintAddress = parsedInfo.mint
        const uiAmount = parsedInfo.tokenAmount.uiAmount
        const uiAmountString = parsedInfo.tokenAmount.amount // Raw string amount

        // Find the token in the provided tokens list to get its symbol/name
        const tokenMeta = tokens.find((t) => t.mint === mintAddress)

        if (tokenMeta) {
          newBalances[tokenMeta.symbol] = {
            mint: mintAddress,
            amount: uiAmount,
            uiAmountString: uiAmountString,
          }
        }
      })
      setBalances(newBalances)
    } catch (err: any) {
      console.error("Error fetching token balances:", err)
      setError(err.message || "Failed to fetch token balances.")
      showToast({ message: err.message || "Failed to load balances.", type: "error" })
    } finally {
      setIsLoadingBalances(false)
    }
  }, [isConnected, address, tokens, showToast])

  useEffect(() => {
    fetchBalances()
    // Refresh balances periodically or on specific events
    const interval = setInterval(fetchBalances, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [fetchBalances])

  return { balances, isLoadingBalances, error, refetchBalances: fetchBalances }
}
