"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { JupiterQuoteResponse } from "@/app/types/api"
import type { Token } from "@/app/types/tokens"
import { formatNumber } from "@/app/lib/format"
import { Loader2 } from "lucide-react"

interface SwapConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  quote: JupiterQuoteResponse | null
  sellingToken: Token | null
  buyingToken: Token | null
  inputAmount: string
  outputAmount: string
  isSwapping: boolean
}

export function SwapConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  quote,
  sellingToken,
  buyingToken,
  inputAmount,
  outputAmount,
  isSwapping,
}: SwapConfirmationModalProps) {
  if (!quote || !sellingToken || !buyingToken) return null

  const priceImpact = (quote.priceImpactPct ?? 0) * 100

  const inputDecimals = sellingToken.decimals ?? 0
  const outputDecimals = buyingToken.decimals ?? 0

  const formattedInput = formatNumber(parseFloat(inputAmount), 6)
  const formattedOutput = formatNumber(parseFloat(outputAmount), 6)

  const minReceived =
    Number(quote.outAmountWithSlippage) / Math.pow(10, outputDecimals)

  const platformFee =
    quote.platformFee?.amount &&
    formatNumber(
      Number(quote.platformFee.amount) / Math.pow(10, inputDecimals),
      6
    )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-dark-gray text-black dark:text-white border-light-gray dark:border-medium-gray rounded-md">
        <DialogHeader>
          <DialogTitle className="text-gold">Confirm Swap</DialogTitle>
          <DialogDescription className="text-black/70 dark:text-light-gray">
            Review the details of your swap before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 text-black dark:text-white">
          <div className="flex justify-between items-center">
            <span className="text-black/70 dark:text-light-gray">You are selling:</span>
            <span className="font-semibold text-lg">
              {formattedInput} {sellingToken.symbol}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-black/70 dark:text-light-gray">You will receive:</span>
            <span className="font-semibold text-lg">
              {formattedOutput} {buyingToken.symbol}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-black/70 dark:text-light-gray">Price Impact:</span>
            <span className={priceImpact > 1 ? "text-negative-red" : "text-positive-green"}>
              {formatNumber(priceImpact, 2)}%
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-black/70 dark:text-light-gray">Minimum Received:</span>
            <span>
              {formatNumber(minReceived, 6)} {buyingToken.symbol}
            </span>
          </div>

          {platformFee && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-black/70 dark:text-light-gray">Platform Fee:</span>
              <span>{platformFee} {sellingToken.symbol}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSwapping}>
            Cancel
          </Button>
          <Button variant="gold-filled" onClick={onConfirm} disabled={isSwapping}>
            {isSwapping ? (
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
