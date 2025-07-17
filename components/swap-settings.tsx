"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useSwapSettings } from "@/app/context/swap-settings"
import { MAX_SLIPPAGE_BPS } from "@/app/lib/constants"

interface SwapSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function SwapSettings({ isOpen, onClose }: SwapSettingsProps) {
  const { slippageBps, setSlippageBps, resetSlippage } = useSwapSettings()
  const [localSlippage, setLocalSlippage] = useState(slippageBps)

  useEffect(() => {
    setLocalSlippage(slippageBps)
  }, [slippageBps])

  const handleSliderChange = (value: number[]) => {
    setLocalSlippage(value[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      setLocalSlippage(Math.round(value * 100)) // Convert percentage to BPS
    }
  }

  const handleApplySettings = () => {
    setSlippageBps(localSlippage)
    onClose()
  }

  const handleReset = () => {
    resetSlippage()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Swap Settings</DialogTitle>
          <DialogDescription>Configure your swap preferences.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slippage" className="col-span-2">
              Slippage Tolerance
            </Label>
            <Input
              id="slippage"
              type="number"
              value={(localSlippage / 100).toFixed(2)}
              onChange={handleInputChange}
              className="col-span-2 text-right"
              step="0.01"
              min="0"
              max={(MAX_SLIPPAGE_BPS / 100).toString()}
            />
            <span className="col-span-4 text-right text-sm text-muted-foreground">%</span>
          </div>
          <Slider
            min={0}
            max={MAX_SLIPPAGE_BPS}
            step={1}
            value={[localSlippage]}
            onValueChange={handleSliderChange}
            className="col-span-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0%</span>
            <span>{MAX_SLIPPAGE_BPS / 100 / 2}%</span>
            <span>{MAX_SLIPPAGE_BPS / 100}%</span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button onClick={handleApplySettings}>Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
