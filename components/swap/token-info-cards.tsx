"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatTokenAmount } from "@/app/lib/format"
import type { TokenInfo } from "@/app/types/tokens"
import { useTokenBalances } from "@/app/hooks/use-token-balances"
import { useWallet } from "@/components/wallet-provider"
import { Skeleton } from "@/components/ui/skeleton"

interface TokenInfoCardsProps {
  inputToken: TokenInfo | null
  outputToken: TokenInfo | null
  inputAmount: string
  outputAmount: string
}

export function TokenInfoCards({ inputToken, outputToken, inputAmount, outputAmount }: TokenInfoCardsProps) {
  const { address } = useWallet()
  const { balances, isLoading: isBalancesLoading } = useTokenBalances(address?.toBase58() || null)

  const inputBalance = balances.find((b) => b.tokenAddress === inputToken?.address)
  const outputBalance = balances.find((b) => b.tokenAddress === outputToken?.address)

  const inputTokenUsdValue =
    inputToken && Number.parseFloat(inputAmount) > 0 ? Number.parseFloat(inputAmount) * (inputToken.price || 0) : 0
  const outputTokenUsdValue =
    outputToken && Number.parseFloat(outputAmount) > 0 ? Number.parseFloat(outputAmount) * (outputToken.price || 0) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <Card className="bg-muted/50 border-none shadow-none">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Your {inputToken?.symbol || "Input"} Balance</span>
            {isBalancesLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <span className="font-semibold text-base">
                {inputBalance ? formatTokenAmount(inputBalance.balance, inputToken?.decimals || 6) : "0.00"}{" "}
                {inputToken?.symbol || ""}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Current Price</span>
            {inputToken?.price ? (
              <span className="font-semibold text-base">{formatCurrency(inputToken.price)}</span>
            ) : (
              <span className="text-muted-foreground text-base">N/A</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Estimated Value</span>
            <span className="font-semibold text-base">{formatCurrency(inputTokenUsdValue)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50 border-none shadow-none">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Your {outputToken?.symbol || "Output"} Balance</span>
            {isBalancesLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <span className="font-semibold text-base">
                {outputBalance ? formatTokenAmount(outputBalance.balance, outputToken?.decimals || 6) : "0.00"}{" "}
                {outputToken?.symbol || ""}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Current Price</span>
            {outputToken?.price ? (
              <span className="font-semibold text-base">{formatCurrency(outputToken.price)}</span>
            ) : (
              <span className="text-muted-foreground text-base">N/A</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Estimated Value</span>
            <span className="font-semibold text-base">{formatCurrency(outputTokenUsdValue)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
