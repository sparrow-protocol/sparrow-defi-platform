import { useEffect, useState } from "react"
import { useJupiter } from "@jup-ag/react-hook"
import JSBI from "jsbi"
import type { UseSwapQuoteProps, UseSwapQuoteResult } from "@/components/swap/types/types"

export const useSwapQuote = ({
  inputAmount,
  sellingToken,
  buyingToken,
  slippage,
  platformFeeBps,
  platformFeeAccount,
  showToast,
}: UseSwapQuoteProps): UseSwapQuoteResult => {
  const [outputAmount, setOutputAmount] = useState<string>("")
  const [quote, setQuote] = useState<any>(null)

  const amountInSmallestUnits =
    sellingToken && !isNaN(Number(inputAmount))
      ? Math.floor(Number(inputAmount) * 10 ** sellingToken.decimals)
      : 0

  const jupiter = useJupiter({
    amount: JSBI.BigInt(amountInSmallestUnits),
    inputMint: sellingToken?.address,
    outputMint: buyingToken?.address,
    slippageBps: JSBI.BigInt(Math.floor(slippage * 100)),
    platformFeeBps: platformFeeBps ? JSBI.BigInt(platformFeeBps) : undefined,
  })

  const { quoteResponseMeta, loading: isFetchingQuote, error, fetchQuote } = jupiter

  useEffect(() => {
    if (!inputAmount || amountInSmallestUnits <= 0) {
      setQuote(null)
      setOutputAmount("")
      return
    }

    fetchQuote()
      .then((res) => {
        const qr = res?.quoteResponse
        setQuote(qr ?? null)
      })
      .catch((e) => {
        console.error(e)
        setQuote(null)
      })
  }, [inputAmount, amountInSmallestUnits, fetchQuote])

  useEffect(() => {
    if (!quote || !buyingToken) {
      setOutputAmount("")
      return
    }
    const out = Number(quote.outAmount) / 10 ** buyingToken.decimals
    setOutputAmount(out.toFixed(buyingToken.decimals))
  }, [quote, buyingToken])

  useEffect(() => {
    if (error) {
      showToast({ message: "Error fetching quote.", type: "error" })
    } else if (!isFetchingQuote && !quote && amountInSmallestUnits > 0) {
      showToast({ message: "No routes found for this token pair.", type: "error" })
    }
  }, [error, isFetchingQuote, quote, amountInSmallestUnits, showToast])

  return {
    quote,
    outputAmount,
    isFetchingQuote,
  }
}
