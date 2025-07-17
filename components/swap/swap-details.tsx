import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPercentage, formatTokenAmount } from "@/app/lib/format"
import type { JupiterRoute } from "@/app/types/jupiter"
import type { TokenInfo } from "@/app/types/tokens"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SwapDetailsProps {
  quote: JupiterRoute
  inputToken: TokenInfo | null
  outputToken: TokenInfo | null
}

export function SwapDetails({ quote, inputToken, outputToken }: SwapDetailsProps) {
  if (!quote || !inputToken || !outputToken) {
    return null
  }

  const inputAmount = Number.parseFloat(quote.inAmount) / Math.pow(10, inputToken.decimals)
  const outputAmount = Number.parseFloat(quote.outAmount) / Math.pow(10, outputToken.decimals)
  const minReceived = Number.parseFloat(quote.outAmountWithSlippage) / Math.pow(10, outputToken.decimals)

  const pricePerUnit = inputAmount > 0 ? outputAmount / inputAmount : 0
  const inversePricePerUnit = outputAmount > 0 ? inputAmount / outputAmount : 0

  const priceImpact = quote.priceImpactPct * 100 // Convert to percentage
  const slippageTolerance = quote.slippageBps / 100 // Convert to percentage

  const totalFees = quote.fees?.totalFeeAndDeposits ? quote.fees.totalFeeAndDeposits / 1_000_000_000 : 0 // Convert lamports to SOL

  return (
    <Card className="mt-4 bg-muted/50 border-none shadow-none">
      <CardContent className="p-4 text-sm space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Price</span>
          <span className="font-medium">
            1 {inputToken.symbol} = {formatTokenAmount(pricePerUnit, outputToken.decimals, 6)} {outputToken.symbol}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Inverse Price</span>
          <span className="font-medium">
            1 {outputToken.symbol} = {formatTokenAmount(inversePricePerUnit, inputToken.decimals, 6)}{" "}
            {inputToken.symbol}
          </span>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center">
            Minimum Received
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Your transaction will revert if you receive less than this amount.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <span className="font-medium">
            {formatTokenAmount(minReceived, outputToken.decimals, 6)} {outputToken.symbol}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center">
            Price Impact
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  The difference between the market price and your execution price due to trade size.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <span className={priceImpact > 1 ? "text-red-500 font-medium" : "font-medium"}>
            {formatPercentage(priceImpact)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center">
            Slippage Tolerance
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Your transaction will revert if the price changes unfavorably by more than this percentage.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <span className="font-medium">{formatPercentage(slippageTolerance)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center">
            Estimated Network Fees
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Fees paid to the Solana network for transaction processing.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <span className="font-medium">{formatTokenAmount(totalFees, 9, 6)} SOL</span>
        </div>
      </CardContent>
    </Card>
  )
}
