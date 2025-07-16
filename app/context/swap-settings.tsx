"use client"

import React, { createContext, useContext, useState } from "react"

interface SwapSettingsContextType {
  slippageBps: number
  setSlippageBps: (bps: number) => void
}

// Create the context
const SwapSettingsContext = createContext<SwapSettingsContextType | undefined>(undefined)

// Export the provider
export const SwapSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [slippageBps, setSlippageBps] = useState<number>(50) // Default to 0.5%

  return (
    <SwapSettingsContext.Provider value={{ slippageBps, setSlippageBps }}>
      {children}
    </SwapSettingsContext.Provider>
  )
}

// Export the custom hook
export const useSwapSettings = (): SwapSettingsContextType => {
  const context = useContext(SwapSettingsContext)
  if (!context) {
    throw new Error("useSwapSettings must be used within a SwapSettingsProvider")
  }
  return context
}
