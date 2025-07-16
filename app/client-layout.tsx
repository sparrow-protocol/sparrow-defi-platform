"use client"

import type React from "react"
import "./globals.css"

import { useMemo } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { SwapSettingsProvider } from "@/app/hooks/use-swap-settings"
import { ToastProvider } from "@/app/hooks/use-toast"

// Solana Wallet Adapter imports
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"

// Styles for wallet modal
import "@solana/wallet-adapter-react-ui/styles.css"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const network = "mainnet-beta"
  const heliusRpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL

  // Use Helius RPC if available, else fallback to Solana cluster
  const endpoint = useMemo(() => {
    const fallback = clusterApiUrl(network)
    if (heliusRpcUrl) {
      console.log("✅ Using Helius RPC endpoint:", heliusRpcUrl)
      return heliusRpcUrl
    }
    console.log("⚠️ Falling back to default Solana RPC:", fallback)
    return fallback
  }, [heliusRpcUrl])

  // Supported wallets
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletProvider>
              <SwapSettingsProvider>
                <ToastProvider>
                  <div className="flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                </ToastProvider>
              </SwapSettingsProvider>
            </WalletProvider>
          </WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  )
}
