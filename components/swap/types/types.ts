import type { JupiterQuoteResponse } from "@/types/api"
import type { TokenInfo } from "@/types/tokens"

export interface UseSwapQuoteProps {
  inputAmount: string
  sellingToken: TokenInfo | null
  buyingToken: TokenInfo | null
  slippage: number
  platformFeeBps: number
  platformFeeAccount: string
  showToast: (params: { message: string; type: "success" | "error" }) => void
}

export interface UseSwapQuoteResult {
  quote: JupiterQuoteResponse | null
  outputAmount: string
  isFetchingQuote: boolean
}
