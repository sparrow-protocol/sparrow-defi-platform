"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface SwapSettings {
  slippage: number
  transactionSpeed: "auto" | "fast" | "turbo"
  mevProtection: boolean
  customFee: number
  platformFeeBps: number
}

interface SwapSettingsContextType {
  settings: SwapSettings
  updateSettings: (updates: Partial<SwapSettings>) => void
}

// Create context
const SwapSettingsContext = createContext<SwapSettingsContextType | undefined>(undefined)

// Provider component
export const SwapSettingsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [settings, setSettings] = useState<SwapSettings>({
    slippage: 0.5, // 0.5%
    transactionSpeed: "auto",
    mevProtection: true,
    customFee: 0,
    platformFeeBps: 20, // 0.2% platform fee
  })

  const updateSettings = (updates: Partial<SwapSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  return <SwapSettingsContext.Provider value={{ settings, updateSettings }}>{children}</SwapSettingsContext.Provider>
}

// Custom hook to consume the context
export const useSwapSettings = (): SwapSettingsContextType => {
  const context = useContext(SwapSettingsContext)
  if (!context) {
    throw new Error("useSwapSettings must be used within a SwapSettingsProvider")
  }
  return context
}
