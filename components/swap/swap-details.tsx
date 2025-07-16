"use client"

import type { JupiterQuoteResponse, JupiterRoutePlan } from "@/app/types/api"
import type { Token } from "@/app/types/tokens"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Info, TriangleAlert } from "lucide-react"
import { formatNumber } from "@/app/lib/format"

interface SwapDetailsProps {
  quote: JupiterQuoteResponse | null
  sellingToken: Token | null
  buyingToken: Token | null
}

export function SwapDetails({ quote, sellingToken, buyingToken }: SwapDetailsProps) {
  if (!quote || !sellingToken || !buyingToken) return null

  const priceImpact = quote.priceImpactPct * 100
  const sellingDecimals = sellingToken.decimals ?? 0
  const buyingDecimals = buyingToken.decimals ?? 0

  return (
    <div className="space-y-4">
      {/* Price Impact Warning */}
      {priceImpact > 0.01 && (
        <div className="flex items-center text-gold text-sm p-2 rounded-md bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <TriangleAlert className="mr-2 h-4 w-4" />
          <span>Price Impact: {formatNumber(priceImpact, 2)}%</span>
        </div>
      )}

      {/* Platform Fee Display */}
      {quote.platformFee && (
        <div className="flex justify-between items-center text-sm text-black/70 dark:text-light-gray p-2 rounded-md bg-medium-gray dark:bg-input-bg-dark">
          <span>Platform Fee:</span>
          <span className="font-semibold text-black dark:text-white">
            {formatNumber(
              Number(quote.platformFee.amount) / Math.pow(10, sellingDecimals),
              6
            )}{" "}
            {sellingToken.symbol}
          </span>
        </div>
      )}

      {/* Route Plan Details */}
      {quote.routePlan && quote.routePlan.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-b border-light-gray dark:border-dark-gray">
            <AccordionTrigger className="flex items-center justify-between py-3 text-base font-semibold text-black dark:text-white hover:no-underline">
              <span className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-gold" />
                <span>Route Details</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 text-black/70 dark:text-light-gray">
              <div className="grid gap-3 text-xs">
                {quote.routePlan.map((route: JupiterRoutePlan, index: number) => (
                  <div
                    key={index}
                    className="rounded-md bg-medium-gray p-3 dark:bg-input-bg-dark"
                  >
                    <p className="font-semibold text-black dark:text-white">
                      Swap {index + 1}: {route.swapInfo.label}
                    </p>
                    <p>
                      <span className="font-medium">In:</span>{" "}
                      {formatNumber(
                        Number(route.amount) / Math.pow(10, sellingDecimals),
                        6
                      )}{" "}
                      {sellingToken.symbol}
                    </p>
                    <p>
                      <span className="font-medium">Out:</span>{" "}
                      {formatNumber(
                        Number(route.swapInfo.outAmount) / Math.pow(10, buyingDecimals),
                        6
                      )}{" "}
                      {buyingToken.symbol}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}
