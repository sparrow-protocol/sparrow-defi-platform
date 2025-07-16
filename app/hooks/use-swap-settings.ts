"use client"

import { useState, useCallback, createContext, useContext, type ReactNode } from "react"
import type { SwapSettings } from "@/app/types/common"

interface SwapSettingsContextType {
  settings: SwapSettings
  updateSettings: (newSettings: Partial<SwapSettings>) => void
}

const SwapSettingsContext = createContext<SwapSettingsContextType | undefined>(undefined)

export function SwapSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SwapSettings>({
    slippage: 0.5, // Default 0.5%
    transactionSpeed: "auto",
    mevProtection: true,
    customFee: 0.05, // Default 0.05%
    platformFeeBps: 0, // Default to 0 basis points
  })

  const updateSettings = useCallback((newSettings: Partial<SwapSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  return <SwapSettingsContext.Provider value={{ settings, updateSettings }}>{children}</SwapSettingsContext.Provider>
}

export function useSwapSettings() {
  const context = useContext(SwapSettingsContext)
  if (context === undefined) {
    throw new Error("useSwapSettings must be used within a SwapSettingsProvider")
  }
  return context
}
