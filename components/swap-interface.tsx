"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, ArrowDown, Loader2 } from "lucide-react"
import { TokenSelectModal } from "@/components/token-select-modal"
import { SwapSettings } from "@/components/swap-settings"
import type { TokenInfo } from "@/app/types/tokens"
import { useSwapQuote } from "@/app/hooks/use-swap-quote"
import { useWallet } from "@/components/wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { SwapDetails } from "@/components/swap/swap-details"
import { SwapConfirmationModal } from "@/components/swap/swap-confirmation-modal"
import { executeSwapTransaction } from "@/server/actions/swap"
import { formatTokenAmount } from "@/app/lib/format"
import { useTokenBalances } from "@/app/hooks/use-token-balances"
import { SOL_MINT, USDC_MINT, ERROR_MESSAGES } from "@/app/lib/constants"
import { TokenInput } from "@/components/swap/token-input"
import { UI_CONFIG } from "@/app/lib/ui-config" // Import UI_CONFIG
import { truncatePublicKey } from "@/app/lib/utils" // Import truncatePublicKey

export function SwapInterface() {
  const { address, isConnected, signTransaction, signAllTransactions } = useWallet()
  const { toast } = useToast()
  const {
    balances,
    isLoading: isBalancesLoading,
    refetch: refetchBalances,
  } = useTokenBalances(address?.toBase58() || null)

  const [inputToken, setInputToken] = useState<TokenInfo | null>(null)
  const [outputToken, setOutputToken] = useState<TokenInfo | null>(null)
  const [inputAmount, setInputAmount] = useState<string>("")
  const [outputAmount, setOutputAmount] = useState<string>("")
  const [isInputting, setIsInputting] = useState<"input" | "output" | null>(null)
  const [isConnecting, setIsConnecting] = useState(false) // Declare isConnecting

  const [isTokenSelectModalOpen, setIsTokenSelectModalOpen] = useState(false)
  const [selectTokenType, setSelectTokenType] = useState<"input" | "output" | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)

  const {
    quote,
    isLoading: isQuoteLoading,
    error: quoteError,
    refetchQuote,
  } = useSwapQuote(
    inputToken,
    outputToken,
    isInputting === "input" ? inputAmount : outputAmount,
    isInputting === "input" ? "ExactIn" : "ExactOut",
  )

  useEffect(() => {
    // Set default tokens if not already set
    if (!inputToken) {
      setInputToken({
        address: SOL_MINT,
        chainId: 101,
        decimals: 9,
        name: "Solana",
        symbol: "SOL",
        logoURI: "/images/sol-icon.png",
      })
    }
    if (!outputToken) {
      setOutputToken({
        address: USDC_MINT,
        chainId: 101,
        decimals: 6,
        name: "USD Coin",
        symbol: "USDC",
        logoURI:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapTVG4itwqZNfwpPJ55/logo.png",
      })
    }
  }, [inputToken, outputToken])

  useEffect(() => {
    if (quote && !isQuoteLoading) {
      if (isInputting === "input") {
        setOutputAmount(formatTokenAmount(quote.outAmount, outputToken?.decimals || 6))
      } else if (isInputting === "output") {
        setInputAmount(formatTokenAmount(quote.inAmount, inputToken?.decimals || 9))
      }
    } else if (!isQuoteLoading && !quote && (inputAmount || outputAmount)) {
      // Clear output if no quote found and there's an amount
      if (isInputting === "input") setOutputAmount("")
      else if (isInputting === "output") setInputAmount("")
    }
  }, [quote, isQuoteLoading, isInputting, inputToken, outputToken, inputAmount, outputAmount])

  const handleInputAmountChange = useCallback((value: string) => {
    setInputAmount(value)
    setIsInputting("input")
  }, [])

  const handleOutputAmountChange = useCallback((value: string) => {
    setOutputAmount(value)
    setIsInputting("output")
  }, [])

  const handleSelectToken = useCallback(
    (token: TokenInfo) => {
      if (selectTokenType === "input") {
        if (token.address === outputToken?.address) {
          setOutputToken(inputToken) // Swap them
        }
        setInputToken(token)
      } else if (selectTokenType === "output") {
        if (token.address === inputToken?.address) {
          setInputToken(outputToken) // Swap them
        }
        setOutputToken(token)
      }
      setIsTokenSelectModalOpen(false)
    },
    [selectTokenType, inputToken, outputToken],
  )

  const handleSwapTokens = useCallback(() => {
    setInputToken(outputToken)
    setOutputToken(inputToken)
    setInputAmount(outputAmount)
    setOutputAmount(inputAmount)
    setIsInputting(isInputting === "input" ? "output" : "input") // Maintain the active input field
  }, [inputToken, outputToken, inputAmount, outputAmount, isInputting])

  const handleMaxInput = useCallback(() => {
    if (!inputToken || !address || isBalancesLoading) return

    const balance = balances.find((b) => b.tokenAddress === inputToken.address)
    if (balance) {
      let amount = balance.balance
      // Deduct a small amount for SOL if it's the input token to cover transaction fees
      if (inputToken.address === SOL_MINT) {
        amount = Math.max(0, amount - 0.005) // Leave 0.005 SOL for fees
      }
      setInputAmount(amount.toString())
      setIsInputting("input")
    }
  }, [inputToken, address, balances, isBalancesLoading])

  const handleSwap = useCallback(async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
        variant: "destructive",
      })
      return
    }
    if (!inputToken || !outputToken || !inputAmount || !outputAmount || !quote) {
      toast({
        title: "Missing Information",
        description: "Please select tokens and enter amounts.",
        variant: "destructive",
      })
      return
    }
    if (isQuoteLoading) {
      toast({
        title: "Loading Quote",
        description: "Please wait for the swap quote to load.",
        variant: "warning",
      })
      return
    }
    if (quoteError) {
      toast({
        title: "Quote Error",
        description: quoteError,
        variant: "destructive",
      })
      return
    }

    setIsConfirmationModalOpen(true)
  }, [
    isConnected,
    address,
    inputToken,
    outputToken,
    inputAmount,
    outputAmount,
    quote,
    isQuoteLoading,
    quoteError,
    toast,
  ])

  const confirmSwap = useCallback(async () => {
    if (!quote || !address || !signTransaction || !signAllTransactions) {
      toast({
        title: "Error",
        description: "Swap data or wallet connection missing.",
        variant: "destructive",
      })
      return
    }

    setIsConfirmationModalOpen(false) // Close modal immediately

    toast({
      title: "Initiating Swap",
      description: "Preparing your transaction...",
      duration: UI_CONFIG.TOAST_DURATION,
    })

    try {
      const {
        success,
        signature,
        error: txError,
      } = await executeSwapTransaction(quote, address.toBase58(), signTransaction, signAllTransactions)

      if (success && signature) {
        toast({
          title: "Swap Successful!",
          description: `Transaction confirmed: ${truncatePublicKey(signature)}`,
          variant: "success",
          duration: UI_CONFIG.TOAST_DURATION,
        })
        setInputAmount("")
        setOutputAmount("")
        refetchBalances() // Refresh balances after successful swap
      } else {
        toast({
          title: "Swap Failed",
          description: txError || ERROR_MESSAGES.TRANSACTION_FAILED,
          variant: "destructive",
          duration: UI_CONFIG.TOAST_DURATION,
        })
      }
    } catch (err: any) {
      console.error("Swap execution error:", err)
      toast({
        title: "Swap Error",
        description: err.message || ERROR_MESSAGES.TRANSACTION_FAILED,
        variant: "destructive",
        duration: UI_CONFIG.TOAST_DURATION,
      })
    }
  }, [quote, address, signTransaction, signAllTransactions, toast, refetchBalances])

  const inputTokenBalance = balances.find((b) => b.tokenAddress === inputToken?.address)?.balance || 0
  const outputTokenBalance = balances.find((b) => b.tokenAddress === outputToken?.address)?.balance || 0

  const inputTokenUsdValue = inputToken ? Number.parseFloat(inputAmount) * (inputToken.price || 0) : 0
  const outputTokenUsdValue = outputToken ? Number.parseFloat(outputAmount) * (outputToken.price || 0) : 0

  const canSwap =
    isConnected &&
    inputToken &&
    outputToken &&
    Number.parseFloat(inputAmount) > 0 &&
    quote &&
    !isQuoteLoading &&
    !quoteError

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Swap</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">Swap Settings</span>
          </Button>
        </div>

        <TokenInput
          label="You pay"
          amount={inputAmount}
          onAmountChange={handleInputAmountChange}
          token={inputToken}
          onTokenSelect={() => {
            setSelectTokenType("input")
            setIsTokenSelectModalOpen(true)
          }}
          balance={inputTokenBalance}
          onMaxClick={handleMaxInput}
          usdValue={inputTokenUsdValue}
          isLoadingBalance={isBalancesLoading}
        />

        <div className="flex justify-center my-2">
          <Button variant="outline" size="icon" onClick={handleSwapTokens} className="rounded-full bg-transparent">
            <ArrowDown className="h-5 w-5" />
            <span className="sr-only">Swap Tokens</span>
          </Button>
        </div>

        <TokenInput
          label="You receive"
          amount={outputAmount}
          onAmountChange={handleOutputAmountChange}
          token={outputToken}
          onTokenSelect={() => {
            setSelectTokenType("output")
            setIsTokenSelectModalOpen(true)
          }}
          balance={outputTokenBalance}
          usdValue={outputTokenUsdValue}
          isLoadingBalance={isBalancesLoading}
          readOnly={isInputting === "input"} // Output is read-only if inputting exact amount
        />

        {isQuoteLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Fetching best route...</span>
          </div>
        )}

        {quote && !isQuoteLoading && <SwapDetails quote={quote} inputToken={inputToken} outputToken={outputToken} />}

        {quoteError && !isQuoteLoading && <p className="text-red-500 text-sm text-center mt-4">{quoteError}</p>}

        <Button
          onClick={handleSwap}
          className="w-full mt-6"
          disabled={!canSwap || isQuoteLoading || !inputToken || !outputToken || Number.parseFloat(inputAmount) <= 0}
        >
          {isConnecting ? "Connecting Wallet..." : isConnected ? "Swap" : "Connect Wallet"}
        </Button>
      </CardContent>

      <TokenSelectModal
        isOpen={isTokenSelectModalOpen}
        onClose={() => setIsTokenSelectModalOpen(false)}
        onSelectToken={handleSelectToken}
      />
      <SwapSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      {quote && inputToken && outputToken && (
        <SwapConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={confirmSwap}
          quote={quote}
          inputToken={inputToken}
          outputToken={outputToken}
          inputAmount={inputAmount}
          outputAmount={outputAmount}
        />
      )}
    </Card>
  )
}
