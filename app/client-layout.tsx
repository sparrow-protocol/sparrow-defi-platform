"use client"
import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { ToastDisplay } from "@/app/hooks/use-toast"
import { SwapSettingsProvider } from "@/app/hooks/use-swap-settings"

// Solana Wallet Adapter imports
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { useMemo } from "react"

// Default styles for the wallet modal
import "@solana/wallet-adapter-react-ui/styles.css"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Use Helius RPC if available, otherwise default Solana RPC
  const network = "mainnet-beta" // Can be "devnet", "testnet", "mainnet-beta"
  const heliusRpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL

  const endpoint = useMemo(() => {
    if (heliusRpcUrl) {
      console.log("Using Helius RPC endpoint:", heliusRpcUrl)
      return heliusRpcUrl
    }
    console.log("Using default Solana cluster RPC endpoint:", clusterApiUrl(network))
    return clusterApiUrl(network)
  }, [network, heliusRpcUrl])

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletProvider>
              <SwapSettingsProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </SwapSettingsProvider>
            </WalletProvider>
            <ToastDisplay />
          </WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  )
}
