"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { DEFAULT_SLIPPAGE_BPS } from "@/app/lib/constants"

interface SwapSettings {
  slippageBps: number
  autoSlippage: boolean
  transactionSpeed: "auto" | "fast" | "fastest"
}

interface SwapSettingsContextType {
  settings: SwapSettings
  updateSettings: (newSettings: Partial<SwapSettings>) => void
}

const SwapSettingsContext = createContext<SwapSettingsContextType | undefined>(undefined)

export const SwapSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SwapSettings>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("swapSettings")
      if (savedSettings) {
        return JSON.parse(savedSettings)
      }
    }
    return {
      slippageBps: DEFAULT_SLIPPAGE_BPS,
      autoSlippage: true,
      transactionSpeed: "auto",
    }
  })

  useEffect(() => {
    // Save settings to localStorage whenever they change
    if (typeof window !== "undefined") {
      localStorage.setItem("swapSettings", JSON.stringify(settings))
    }
  }, [settings])

  const updateSettings = useCallback((newSettings: Partial<SwapSettings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }))
  }, [])

  return <SwapSettingsContext.Provider value={{ settings, updateSettings }}>{children}</SwapSettingsContext.Provider>
}

export const useSwapSettings = (): SwapSettingsContextType => {
  const context = useContext(SwapSettingsContext)
  if (!context) {
    throw new Error("useSwapSettings must be used within a SwapSettingsProvider")
  }
  return context
}
