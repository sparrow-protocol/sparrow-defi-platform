"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { SwapSettingsProvider } from "@/app/context/swap-settings"
import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WalletProvider>
        <SwapSettingsProvider>
          {children}
          <Toaster />
        </SwapSettingsProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}
