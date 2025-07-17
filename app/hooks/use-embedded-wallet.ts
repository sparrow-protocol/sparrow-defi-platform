"use client"

import { usePrivy, useWallets } from "@privy-io/react-auth"
import { useCallback, useEffect, useState } from "react"
import type { EmbeddedWallet } from "@privy-io/react-auth/dist/lib/types"
import { PublicKey } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"

export interface EmbeddedWalletHook {
  embeddedWallet: EmbeddedWallet | null
  embeddedWalletAddress: PublicKey | null
  createEmbeddedWallet: () => Promise<void>
  isCreatingEmbeddedWallet: boolean
}

export function useEmbeddedWallet(): EmbeddedWalletHook {
  const { ready, authenticated, user, createWallet } = usePrivy()
  const { wallets } = useWallets()
  const { toast } = useToast()

  const [isCreatingEmbeddedWallet, setIsCreatingEmbeddedWallet] = useState(false)
  const [embeddedWallet, setEmbeddedWallet] = useState<EmbeddedWallet | null>(null)
  const [embeddedWalletAddress, setEmbeddedWalletAddress] = useState<PublicKey | null>(null)

  useEffect(() => {
    if (ready && authenticated && user) {
      const privyEmbeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy" && wallet.walletClient === "privy",
      ) as EmbeddedWallet | undefined

      if (privyEmbeddedWallet) {
        setEmbeddedWallet(privyEmbeddedWallet)
        setEmbeddedWalletAddress(new PublicKey(privyEmbeddedWallet.address))
      } else {
        setEmbeddedWallet(null)
        setEmbeddedWalletAddress(null)
      }
    } else {
      setEmbeddedWallet(null)
      setEmbeddedWalletAddress(null)
    }
  }, [ready, authenticated, user, wallets])

  const createEmbeddedWallet = useCallback(async () => {
    if (!ready || !authenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create an embedded wallet.",
        type: "warning",
      })
      return
    }
    if (embeddedWallet) {
      toast({
        title: "Wallet Exists",
        description: "You already have an embedded wallet.",
        type: "info",
      })
      return
    }

    setIsCreatingEmbeddedWallet(true)
    try {
      await createWallet()
      toast({
        title: "Embedded Wallet Created",
        description: "Your new embedded wallet has been successfully created.",
        type: "success",
      })
    } catch (error: any) {
      console.error("Error creating embedded wallet:", error)
      toast({
        title: "Wallet Creation Failed",
        description: error.message || "Failed to create embedded wallet. Please try again.",
        type: "error",
      })
    } finally {
      setIsCreatingEmbeddedWallet(false)
    }
  }, [ready, authenticated, embeddedWallet, createWallet, toast])

  return {
    embeddedWallet,
    embeddedWalletAddress,
    createEmbeddedWallet,
    isCreatingEmbeddedWallet,
  }
}
