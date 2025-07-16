"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  connectWallet: () => void
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected, disconnect } = useSolanaWallet()
  const { setVisible } = useWalletModal()

  const isConnected = connected
  const address = publicKey ? publicKey.toBase58() : null

  const connectWallet = () => {
    setVisible(true) // Open the wallet modal
  }

  const disconnectWallet = () => {
    disconnect()
  }

  return (
    <WalletContext.Provider value={{ isConnected, address, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
