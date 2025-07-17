"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { useToast } from "@/hooks/use-toast"

interface JupiterSwapUIProps {
  defaultInputMint?: string
  defaultOutputMint?: string
  defaultAmount?: number
}

export function JupiterSwapUI({ defaultInputMint, defaultOutputMint, defaultAmount }: JupiterSwapUIProps) {
  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { connection } = useConnection()
  const { toast } = useToast()
  const widgetContainerRef = useRef<HTMLDivElement>(null)
  const isJupiterLoaded = useRef(false)

  const onJupiterLoad = () => {
    if (isJupiterLoaded.current) return // Prevent multiple loads
    isJupiterLoaded.current = true

    if (window.Jupiter) {
      window.Jupiter.init({
        displayMode: "widget",
        endpoint: connection.rpcEndpoint,
        strictTokenList: true,
        defaultInputMint: defaultInputMint || "So11111111111111111111111111111111111111112", // SOL
        defaultOutputMint: defaultOutputMint || "EPjFWdd5AufqSSqeM2qN1xzybapTVG4itwqZNfwpPJ55", // USDC
        defaultAmount: defaultAmount,
        formProps: {
          fixedOutputMint: false,
          initialSlippageBps: 50, // 0.5%
        },
        containerStyles: {
          borderRadius: "12px",
          boxShadow: "none",
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        },
        theme: "dark", // Or "light" based on your theme
        // Pass wallet and connection directly
        wallet: {
          publicKey: publicKey?.toBase58(),
          signTransaction: signTransaction
            ? async (tx) => {
                const signedTx = await signTransaction(tx)
                return signedTx.serialize()
              }
            : undefined,
          signAllTransactions: signAllTransactions
            ? async (txs) => {
                const signedTxs = await signAllTransactions(txs)
                return signedTxs.map((tx) => tx.serialize())
              }
            : undefined,
        },
        // Callbacks for events
        onSwapError: ({ error }) => {
          console.error("Jupiter Swap Error:", error)
          toast({
            title: "Swap Failed",
            description: error.message || "An error occurred during the swap.",
            variant: "destructive",
          })
        },
        onSwapSuccess: ({ txid }) => {
          toast({
            title: "Swap Successful!",
            description: `Transaction ID: ${txid.slice(0, 8)}...`,
            variant: "success",
          })
        },
      })

      if (widgetContainerRef.current) {
        window.Jupiter.mount(widgetContainerRef.current)
      }
    }
  }

  useEffect(() => {
    // If Jupiter is already loaded (e.g., on route change), re-mount
    if (window.Jupiter && widgetContainerRef.current && isJupiterLoaded.current) {
      window.Jupiter.mount(widgetContainerRef.current)
    }
  }, [publicKey, connection.rpcEndpoint]) // Re-mount if wallet or RPC changes

  return (
    <>
      <Script
        src="https://terminal.jup.ag/main-v1.js"
        onLoad={onJupiterLoad}
        onError={(e) => {
          console.error("Failed to load Jupiter script:", e)
          toast({
            title: "Error",
            description: "Failed to load Jupiter swap widget. Please try refreshing.",
            variant: "destructive",
          })
        }}
        strategy="lazyOnload"
      />
      <div ref={widgetContainerRef} className="w-full h-[600px]" />
    </>
  )
}
