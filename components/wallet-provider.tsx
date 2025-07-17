"use client"

import { useMemo } from "react"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { VersionedTransaction } from "@solana/web3.js"
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { clusterApiUrl } from "@solana/web3.js"
import { PhantomWalletAdapter, SolflareWalletAdapter, BackpackWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PrivyProvider } from "@privy-io/react-auth"
import { RPC_URLS } from "@/app/lib/constants"

// Default styles for wallet adapter UI
import "@solana/wallet-adapter-react-ui/styles.css"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
  signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction | null>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

interface WalletProviderProps {
  children: React.ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet // Or Devnet, Testnet
  const endpoint = useMemo(() => RPC_URLS[0] || clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new BackpackWalletAdapter(),
      // Add other wallets here
    ],
    [network],
  )

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        embeddedWallets: {
          createOnLogin: "users-and-eoa", // Create embedded wallet for all users
          noPromptOnSignature: false, // Prompt for signature
        },
        loginMethods: ["email", "wallet", "google", "apple"],
        appearance: {
          theme: "dark", // Or "light" based on your app's theme
          accentColor: "#676FFF",
          logo: "/images/sparrow-icon-white.png",
        },
        // Replace this with your desired redirect URLs
        // loginRedirectUri: "http://localhost:3000/dashboard",
        // logoutRedirectUri: "http://localhost:3000/",
      }}
    >
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletProviderInner>{children}</WalletProviderInner>
          </WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </PrivyProvider>
  )
}

const WalletProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.solana) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true })
          setAddress(response.publicKey.toString())
          setIsConnected(true)
        } catch (error) {
          // Wallet not connected or user rejected
          console.log("Wallet not connected")
        }
      }
    }
    checkConnection()
  }, [])

  const connect = useCallback(async () => {
    if (typeof window !== "undefined" && window.solana) {
      try {
        const response = await window.solana.connect()
        setAddress(response.publicKey.toString())
        setIsConnected(true)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        throw error
      }
    } else {
      throw new Error("Solana wallet not found. Please install Phantom or another Solana wallet.")
    }
  }, [])

  const disconnect = useCallback(() => {
    if (typeof window !== "undefined" && window.solana) {
      window.solana.disconnect()
    }
    setAddress(null)
    setIsConnected(false)
  }, [])

  const signTransaction = useCallback(
    async (transaction: VersionedTransaction): Promise<VersionedTransaction | null> => {
      if (!isConnected || typeof window === "undefined" || !window.solana) {
        throw new Error("Wallet not connected")
      }

      try {
        const signedTransaction = await window.solana.signTransaction(transaction)
        return signedTransaction
      } catch (error) {
        console.error("Failed to sign transaction:", error)
        return null
      }
    },
    [isConnected],
  )

  const value = {
    isConnected,
    address,
    connect,
    disconnect,
    signTransaction,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Extend the Window interface to include solana
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => void
      signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction>
    }
  }
}
