"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatTokenAmount, formatCurrency, formatPercentage } from "@/app/lib/format"
import type { JupiterRoute } from "@/app/types/jupiter"
import type { TokenInfo } from "@/app/types/tokens"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface SwapConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  quote: JupiterRoute
  inputToken: TokenInfo
  outputToken: TokenInfo
  inputAmount: string
  outputAmount: string
}

export function SwapConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  quote,
  inputToken,
  outputToken,
  inputAmount,
  outputAmount,
}: SwapConfirmationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    await onConfirm()
    setIsConfirming(false)
    // Modal will be closed by parent after transaction status is handled
  }

  const inputAmountFormatted = formatTokenAmount(Number.parseFloat(inputAmount), inputToken.decimals)
  const outputAmountFormatted = formatTokenAmount(Number.parseFloat(outputAmount), outputToken.decimals)

  const minReceived = quote.outAmountWithSlippage
    ? formatTokenAmount(Number.parseFloat(quote.outAmountWithSlippage), outputToken.decimals)
    : "N/A"
  const priceImpact = formatPercentage(quote.priceImpactPct * 100)
  const slippageTolerance = formatPercentage(quote.slippageBps / 100)

  // Calculate estimated fees (simplified, Jupiter quote provides more detail)
  const totalFees = quote.fees?.totalFeeAndDeposits
    ? formatCurrency(quote.fees.totalFeeAndDeposits / 1_000_000_000)
    : "N/A"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Swap</DialogTitle>
          <DialogDescription>Review the details before confirming your swap.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">You Pay</span>
            <span className="text-lg font-semibold">
              {inputAmountFormatted} {inputToken.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">You Receive</span>
            <span className="text-lg font-semibold">
              {outputAmountFormatted} {outputToken.symbol}
            </span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Minimum Received</span>
            <span>
              {minReceived} {outputToken.symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price Impact</span>
            <span>{priceImpact}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Slippage Tolerance</span>
            <span>{slippageTolerance}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Network Fees</span>
            <span>{totalFees} SOL</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isConfirming}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isConfirming}>
            {isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
              </>
            ) : (
              "Confirm Swap"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
