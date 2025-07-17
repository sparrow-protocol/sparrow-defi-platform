"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { usePrivy, useWallets as usePrivyWallets } from "@privy-io/react-auth"
import { PublicKey } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"
import { getEmbeddedWalletPublicKey } from "@/app/lib/solana/embedded-wallets"

export function useWallets() {
  const { publicKey: solanaPublicKey, connected: solanaConnected, wallet: solanaWallet } = useSolanaWallet()
  const { ready, authenticated, user } = usePrivy()
  const { wallets: privyWallets } = usePrivyWallets()
  const { toast } = useToast()

  const [address, setAddress] = useState<PublicKey | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletName, setWalletName] = useState<string | null>(null)
  const [walletIcon, setWalletIcon] = useState<string | null>(null)
  const [isEmbedded, setIsEmbedded] = useState(false)

  const connectWallet = useCallback(async () => {
    setIsConnecting(true)
    setError(null)
    try {
      // If Privy is ready and authenticated, prioritize embedded wallet or connected Privy wallet
      if (ready && authenticated && user) {
        const privyEmbeddedWallet = privyWallets.find(
          (wallet) => wallet.walletClientType === "privy" && wallet.walletClient === "privy",
        )
        if (privyEmbeddedWallet) {
          const pk = await getEmbeddedWalletPublicKey(privyEmbeddedWallet)
          setAddress(pk)
          setIsConnected(true)
          setIsEmbedded(true)
          setWalletName("Privy Embedded Wallet")
          setWalletIcon("/placeholder.svg") // Placeholder for Privy icon
          toast({
            title: "Wallet Connected",
            description: "Connected to Privy Embedded Wallet.",
          })
          return
        }

        const connectedPrivySolanaWallet = privyWallets.find(
          (wallet) => wallet.chainType === "solana" && wallet.connectorType === "wallet_adapter",
        )
        if (connectedPrivySolanaWallet) {
          setAddress(new PublicKey(connectedPrivySolanaWallet.publicAddress))
          setIsConnected(true)
          setIsEmbedded(false)
          setWalletName(connectedPrivySolanaWallet.walletClientType || "Connected Wallet")
          setWalletIcon(connectedPrivySolanaWallet.imageUrl || "/placeholder.svg")
          toast({
            title: "Wallet Connected",
            description: `Connected to ${connectedPrivySolanaWallet.walletClientType || "your wallet"}.`,
          })
          return
        }
      }

      // Fallback to Solana Wallet Adapter if no Privy wallet is connected or authenticated
      if (solanaConnected && solanaPublicKey && solanaWallet) {
        setAddress(solanaPublicKey)
        setIsConnected(true)
        setIsEmbedded(false)
        setWalletName(solanaWallet.adapter.name)
        setWalletIcon(solanaWallet.adapter.icon)
        toast({
          title: "Wallet Connected",
          description: `Connected to ${solanaWallet.adapter.name}.`,
        })
      } else {
        // If no wallet is connected, prompt user to connect
        // This part would typically trigger a modal or a specific wallet adapter's connect method
        // For now, we'll just log a message
        console.log("No wallet connected. Please use a wallet adapter to connect.")
        setIsConnected(false)
        setAddress(null)
        setWalletName(null)
        setWalletIcon(null)
        setIsEmbedded(false)
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      setError(err.message || "Failed to connect wallet.")
      toast({
        title: "Wallet Connection Failed",
        description: err.message || "An unexpected error occurred during wallet connection.",
        variant: "destructive",
      })
      setIsConnected(false)
      setAddress(null)
      setWalletName(null)
      setWalletIcon(null)
      setIsEmbedded(false)
    } finally {
      setIsConnecting(false)
    }
  }, [ready, authenticated, user, privyWallets, solanaConnected, solanaPublicKey, solanaWallet, toast])

  const disconnectWallet = useCallback(async () => {
    setIsDisconnecting(true)
    setError(null)
    try {
      if (solanaConnected && solanaWallet?.adapter.connected) {
        await solanaWallet.adapter.disconnect()
      }
      // If using Privy, log out from Privy
      if (authenticated) {
        // await logout(); // This would log out the user from Privy entirely
        // For just disconnecting the wallet without logging out, Privy's API might need specific handling
      }
      setAddress(null)
      setIsConnected(false)
      setWalletName(null)
      setWalletIcon(null)
      setIsEmbedded(false)
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
    } catch (err: any) {
      console.error("Error disconnecting wallet:", err)
      setError(err.message || "Failed to disconnect wallet.")
      toast({
        title: "Wallet Disconnection Failed",
        description: err.message || "An unexpected error occurred during wallet disconnection.",
        variant: "destructive",
      })
    } finally {
      setIsDisconnecting(false)
    }
  }, [solanaConnected, solanaWallet, authenticated, toast])

  useEffect(() => {
    // Initial check and re-check on adapter changes
    connectWallet()
  }, [connectWallet])

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnecting,
    error,
    walletName,
    walletIcon,
    isEmbedded,
    connectWallet,
    disconnectWallet,
  }
}
