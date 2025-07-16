"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Settings, ChevronDown, Rocket, RefreshCcw, ArrowUpDown, Eye, XCircle, Bell } from "lucide-react"
import { getJupiterQuote, getJupiterSwapTransaction, sendAndConfirmRawTransaction } from "@/app/lib/defi-api"
import type { JupiterQuoteResponse } from "@/app/types/api"
import type { Token } from "@/app/types/tokens"
import { useTheme } from "next-themes"
import { useSwapSettings } from "@/app/hooks/use-swap-settings"
import { SwapSettings } from "@/components/swap-settings" // Now a regular component
import { TokenSelectModal } from "@/components/token-select-modal"
import { useToast } from "@/app/hooks/use-toast"
import { useWallet } from "@/components/wallet-provider"
import { TransactionStatusModal } from "@/components/payments/transaction-status-modal"
import { useSolanaPay } from "@/app/hooks/use-solana-pay" // Keep for potential future direct use if needed.
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VersionedTransaction } from "@solana/web3.js"
import { TokenChart } from "@/components/token-chart"
import { TokenInput } from "@/components/swap/token-input"
import { SwapDetails } from "@/components/swap/swap-details"
import { SwapConfirmationModal } from "@/components/swap/swap-confirmation-modal"
import { TokenInfoCards } from "@/components/swap/token-info-cards"
import { useTokenBalances } from "@/app/hooks/use-token-balances"
import Link from "next/link" // Import Link for navigation

export default function SwapInterface() {
  const [activeTab, setActiveTab] = useState("instant") // "instant", "trigger", "recurring", "settings"
  const [tokens, setTokens] = useState<Token[]>([])
  const [sellingToken, setSellingToken] = useState<Token | null>(null)
  const [buyingToken, setBuyingToken] = useState<Token | null>(null)
  const [inputAmount, setInputAmount] = useState<string>("")
  const [outputAmount, setOutputAmount] = useState<string>("")
  const [quote, setQuote] = useState<JupiterQuoteResponse | null>(null)
  const [isFetchingQuote, setIsFetchingQuote] = useState(false)
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)
  const [modalFor, setModalFor] = useState<"selling" | "buying" | null>(null)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"pending" | "confirmed" | "failed">("pending")
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null)
  const [transactionMessage, setTransactionMessage] = useState<string | undefined>(undefined)
  const [isChartModalOpen, setIsChartModalOpen] = useState(false)
  const [isConfirmSwapModalOpen, setIsConfirmSwapModalOpen] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [tokenFetchError, setTokenFetchError] = useState<string | null>(null)
  const [isLoadingTokens, setIsLoadingTokens] = useState(true)

  const { theme } = useTheme()
  const { settings } = useSwapSettings()
  const { showToast } = useToast()
  const { isConnected, address, signTransaction } = useWallet()

  const { balances, isLoadingBalances, refetchBalances } = useTokenBalances(tokens)

  // No longer using useSolanaPay directly in SwapInterface for QR generation,
  // it's now encapsulated in OnRampSolanaPay component.
  // Keeping the hook import for potential future direct use if needed.
  const {
    solanaPayUrl,
    isLoading: isGeneratingSolanaPay,
    generateSolanaPayUrl,
    savePaymentTransaction,
  } = useSolanaPay("GjFwB2222222222222222222222222222222222222222222222222222222222") // Placeholder recipient

  const getActiveTabClass = (tabName: string) => {
    return activeTab === tabName
      ? "bg-gold text-black"
      : "text-black hover:bg-light-gray dark:text-white dark:hover:bg-dark-gray"
  }

  // Fetch token list on component mount
  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoadingTokens(true)
      setTokenFetchError(null)
      try {
        const response = await fetch("/api/tokens")
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || "Failed to load tokens from API.")
        }
        if (!Array.isArray(data)) {
          console.error("Token API did not return an array:", data)
          throw new Error("Failed to load tokens: Invalid data format.")
        }
        const fetchedTokens: Token[] = data
        setTokens(fetchedTokens)

        // Set default tokens if not already set or if they are no longer in the fetched list
        if (!sellingToken || !fetchedTokens.some((t) => t.mint === sellingToken.mint)) {
          setSellingToken(fetchedTokens.find((t) => t.symbol === "SOL") || fetchedTokens[0] || null)
        }
        if (!buyingToken || !fetchedTokens.some((t) => t.symbol === buyingToken?.symbol)) {
          setBuyingToken(fetchedTokens.find((t) => t.symbol === "USDC") || fetchedTokens[1] || null)
        }
      } catch (error: any) {
        console.error("Failed to fetch tokens:", error)
        setTokenFetchError(error.message || "Failed to load tokens. Please try again later.")
        showToast({ message: error.message || "Failed to load tokens. Please try again later.", type: "error" })
        setTokens([])
      } finally {
        setIsLoadingTokens(false)
      }
    }
    fetchTokens()
  }, [sellingToken, buyingToken, showToast])

  // Fetch quote when relevant inputs change
  useEffect(() => {
    const fetchQuote = async () => {
      if (sellingToken && buyingToken && inputAmount && Number.parseFloat(inputAmount) > 0) {
        setIsFetchingQuote(true)
        try {
          const amountInSmallestUnit = (Number.parseFloat(inputAmount) * Math.pow(10, sellingToken.decimals)).toFixed(0)
          const fetchedQuote = await getJupiterQuote(
            sellingToken.mint,
            buyingToken.mint,
            amountInSmallestUnit,
            settings.slippage * 100,
            settings.platformFeeBps, // Pass platformFeeBps
          )
          if (fetchedQuote) {
            setQuote(fetchedQuote)
            const readableOutput = Number.parseFloat(fetchedQuote.outAmount) / Math.pow(10, buyingToken.decimals)
            setOutputAmount(readableOutput.toFixed(buyingToken.decimals > 6 ? 6 : buyingToken.decimals))
          } else {
            setOutputAmount("Error fetching quote")
            setQuote(null)
            showToast({ message: "Failed to get swap quote.", type: "error" })
          }
        } catch (error) {
          console.error("Error fetching Jupiter quote:", error)
          setOutputAmount("Error")
          setQuote(null)
          showToast({ message: "Error fetching swap quote. Check console for details.", type: "error" })
        } finally {
          setIsFetchingQuote(false)
        }
      } else {
        setOutputAmount("")
        setQuote(null)
      }
    }
    const handler = setTimeout(() => {
      fetchQuote()
    }, 500)
    return () => clearTimeout(handler)
  }, [inputAmount, sellingToken, buyingToken, settings.slippage, settings.platformFeeBps, showToast]) // Add platformFeeBps to dependencies

  const handleInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(e.target.value)
  }

  const handleTokenSelect = useCallback(
    (token: Token) => {
      if (modalFor === "selling") {
        setSellingToken(token)
      } else if (modalFor === "buying") {
        setBuyingToken(token)
      }
      setIsTokenModalOpen(false)
    },
    [modalFor],
  )

  const openTokenModal = (forToken: "selling" | "buying") => {
    setModalFor(forToken)
    setIsTokenModalOpen(true)
  }

  const swapTokens = () => {
    if (sellingToken && buyingToken) {
      setSellingToken(buyingToken)
      setBuyingToken(sellingToken)
      setInputAmount(outputAmount) // Swap amounts too
      setOutputAmount(inputAmount)
      setQuote(null) // Clear quote as tokens have swapped
    }
  }

  const handleInitiateSwap = () => {
    if (!isConnected || !address) {
      showToast({ message: "Please connect your wallet to swap.", type: "warning" })
      return
    }
    if (!quote) {
      showToast({ message: "No valid quote available for swap.", type: "warning" })
      return
    }
    if (Number.parseFloat(inputAmount) <= 0) {
      showToast({ message: "Please enter an amount to swap.", type: "warning" })
      return
    }
    setIsConfirmSwapModalOpen(true)
  }

  const handleConfirmSwap = async () => {
    if (!isConnected || !address || !quote || !sellingToken || !buyingToken) {
      showToast({ message: "Swap prerequisites not met.", type: "error" })
      return
    }

    setIsConfirmSwapModalOpen(false) // Close confirmation modal
    setIsTransactionModalOpen(true)
    setTransactionStatus("pending")
    setTransactionSignature(null)
    setTransactionMessage("Preparing transaction...")
    setIsSwapping(true)

    try {
      // Get platform fee account from environment variable
      const platformFeeAccount = process.env.NEXT_PUBLIC_PLATFORM_FEE_ACCOUNT || null

      // 1. Get serialized transaction from Jupiter
      setTransactionMessage("Fetching swap transaction from Jupiter...")
      const swapTransactionResponse = await getJupiterSwapTransaction(quote, address, platformFeeAccount)

      if (!swapTransactionResponse || !swapTransactionResponse.swapTransaction) {
        throw new Error("Failed to get swap transaction from Jupiter.")
      }

      // 2. Deserialize the transaction
      const transactionBuffer = Buffer.from(swapTransactionResponse.swapTransaction, "base64")
      const transaction = VersionedTransaction.deserialize(transactionBuffer)

      // 3. Sign the transaction
      setTransactionMessage("Signing transaction with your wallet...")
      const signedTransaction = await signTransaction(transaction) // Use wallet adapter's signTransaction

      if (!signedTransaction) {
        throw new Error("Transaction signing failed or was cancelled.")
      }

      // 4. Serialize the signed transaction back to base64
      const signedRawTransaction = Buffer.from(signedTransaction.serialize()).toString("base64")

      // 5. Send and confirm the transaction
      setTransactionMessage("Sending transaction to Solana network...")
      const signature = await sendAndConfirmRawTransaction(signedRawTransaction)

      setTransactionSignature(signature)
      setTransactionStatus("confirmed")
      setTransactionMessage("Transaction successful!")
      showToast({ message: "Swap successful!", type: "success" })

      // 6. Save transaction to database
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPublicKey: address,
          inputMint: sellingToken?.mint,
          outputMint: buyingToken?.mint,
          inputAmount: quote.inAmount,
          outputAmount: quote.outAmount,
          signature: signature,
          status: "completed",
          type: "swap", // Explicitly set type as 'swap'
        }),
      })
      refetchBalances() // Refresh balances after a successful swap
    } catch (error: any) {
      console.error("Swap failed:", error)
      setTransactionStatus("failed")
      setTransactionMessage(error.message || "Swap failed. Please try again.")
      showToast({ message: error.message || "Swap failed.", type: "error" })
    } finally {
      setIsSwapping(false)
    }
  }

  const handleClearInputs = () => {
    setInputAmount("")
    setOutputAmount("")
    setQuote(null)
    showToast({ message: "Swap inputs cleared.", type: "info" })
  }

  const solBalance = balances["SOL"]?.amount || 0
  // Find SPRW token from the actual fetched tokens, not a dummy one
  const sprwToken = tokens.find((t) => t.symbol === "SPRW")
  const sprwBalance = sprwToken ? balances[sprwToken.symbol]?.amount : null

  return (
    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-dark-gray">
      {/* Token Select Modal */}
      <TokenSelectModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSelectToken={handleTokenSelect}
        tokens={tokens}
        isLoadingTokens={isLoadingTokens}
        tokenFetchError={tokenFetchError}
      />

      {/* Transaction Status Modal */}
      <TransactionStatusModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        status={transactionStatus}
        signature={transactionSignature}
        message={transactionMessage}
      />

      {/* Chart Modal */}
      <Dialog open={isChartModalOpen} onOpenChange={setIsChartModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-dark-gray text-black dark:text-white border-light-gray dark:border-medium-gray rounded-md">
          <DialogHeader>
            <DialogTitle className="text-gold">Token Chart</DialogTitle>
            <DialogDescription className="text-black/70 dark:text-light-gray">
              Price history for {sellingToken?.symbol} / {buyingToken?.symbol}
            </DialogDescription>
          </DialogHeader>
          <TokenChart sellingToken={sellingToken} buyingToken={buyingToken} />
          <div className="flex justify-end">
            <Button variant="gold-filled" onClick={() => setIsChartModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Swap Confirmation Modal */}
      <SwapConfirmationModal
        isOpen={isConfirmSwapModalOpen}
        onClose={() => setIsConfirmSwapModalOpen(false)}
        onConfirm={handleConfirmSwap}
        quote={quote}
        sellingToken={sellingToken}
        buyingToken={buyingToken}
        inputAmount={inputAmount}
        outputAmount={outputAmount}
        isSwapping={isSwapping}
      />

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-1 rounded-lg bg-medium-gray p-1 dark:bg-input-bg-dark">
        <Button
          variant="ghost"
          className={`flex-1 rounded-lg px-1 py-1 text-[0.65rem] sm:px-2 sm:py-2 sm:text-xs md:px-4 md:py-2 md:text-sm font-semibold ${getActiveTabClass("instant")}`}
          onClick={() => setActiveTab("instant")}
        >
          <Rocket className={`mr-1 h-4 w-4 ${activeTab === "instant" ? "text-black" : "text-gold"}`} />
          <span className="hidden sm:inline">Instant</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 rounded-lg px-1 py-1 text-[0.65rem] sm:px-2 sm:py-2 sm:text-xs md:px-4 md:py-2 md:text-sm font-semibold ${getActiveTabClass("trigger")}`}
          onClick={() => setActiveTab("trigger")}
        >
          <Bell className={`mr-1 h-4 w-4 ${activeTab === "trigger" ? "text-black" : "text-gold"}`} />
          <span className="hidden sm:inline">Trigger</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 rounded-lg px-1 py-1 text-[0.65rem] sm:px-2 sm:py-2 sm:text-xs md:px-4 md:py-2 md:text-sm font-semibold ${getActiveTabClass("recurring")}`}
          onClick={() => setActiveTab("recurring")}
        >
          <RefreshCcw className={`mr-1 h-4 w-4 ${activeTab === "recurring" ? "text-black" : "text-gold"}`} />
          <span className="hidden sm:inline">Recurring</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 rounded-lg px-1 py-1 text-[0.65rem] sm:px-2 sm:py-2 sm:text-xs md:px-4 md:py-2 md:text-sm font-semibold ${getActiveTabClass("settings")}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className={`mr-1 h-4 w-4 ${activeTab === "settings" ? "text-black" : "text-gold"}`} />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "instant" && (
        <div className="space-y-4">
          {/* Ultra V2 and Refresh */}
          <div className="flex items-center justify-between text-light-gray dark:text-light-gray">
            <Button
              variant="ghost"
              className="flex items-center space-x-1 text-sm hover:bg-medium-gray rounded-md dark:hover:bg-input-bg-dark"
            >
              <Rocket className="h-3 w-3 text-gold" />
              <span>Ultra V2</span>
              <ChevronDown className="h-3 w-3 text-gold" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-medium-gray rounded-md dark:hover:bg-input-bg-dark">
              <RefreshCcw className="h-4 w-4 text-gold" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>

          {tokenFetchError && (
            <div className="p-3 rounded-md bg-negative-red/10 border border-negative-red text-negative-red text-sm">
              <p className="font-semibold">Error loading tokens:</p>
              <p>{tokenFetchError}</p>
              <p className="mt-1 text-xs">Please check your network connection or try again later.</p>
            </div>
          )}

          {/* Selling Section */}
          <TokenInput
            label="Selling"
            amount={inputAmount}
            onAmountChange={handleInputAmountChange}
            selectedToken={sellingToken}
            onSelectTokenClick={() => openTokenModal("selling")}
            balance={sellingToken ? balances[sellingToken.symbol]?.amount : null}
            onMaxClick={() => {
              if (sellingToken && balances[sellingToken.symbol]) {
                setInputAmount(balances[sellingToken.symbol].amount.toString())
              }
            }}
            onHalfClick={() => {
              if (sellingToken && balances[sellingToken.symbol]) {
                setInputAmount((balances[sellingToken.symbol].amount / 2).toString())
              }
            }}
          />

          {/* Swap Icon */}
          <div className="flex justify-center -my-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-medium-gray hover:bg-light-gray dark:bg-input-bg-dark dark:hover:bg-dark-gray"
              onClick={swapTokens}
            >
              <ArrowUpDown className="h-5 w-5 text-gold" />
              <span className="sr-only">Swap tokens</span>
            </Button>
          </div>

          {/* Buying Section */}
          <TokenInput
            label="Buying"
            amount={outputAmount}
            onAmountChange={() => {}} // Read-only
            selectedToken={buyingToken}
            onSelectTokenClick={() => openTokenModal("buying")}
            balance={buyingToken ? balances[buyingToken.symbol]?.amount : null}
            readOnly
            isFetchingQuote={isFetchingQuote}
          />

          {/* Custom Fee */}
          <div className="text-center text-sm text-black/70 dark:text-light-gray mt-4">
            Custom Fee: <span className="font-semibold text-gold">{settings.customFee}%</span>
          </div>

          {/* Jupiter Route Plan and Price Impact */}
          <SwapDetails quote={quote} sellingToken={sellingToken} buyingToken={buyingToken} />

          {/* Swap Button */}
          <Button
            variant="gold-filled"
            className="w-full rounded-md py-3 text-lg font-semibold mt-4"
            onClick={handleInitiateSwap}
            disabled={!isConnected || isFetchingQuote || !quote || Number.parseFloat(inputAmount) <= 0 || isSwapping}
          >
            {isConnected
              ? isFetchingQuote
                ? "Fetching Quote..."
                : isSwapping
                  ? "Swapping..."
                  : "Swap"
              : "Connect Wallet"}
          </Button>

          {/* Clear Inputs Button */}
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-black/70 hover:bg-medium-gray rounded-md dark:text-light-gray dark:hover:bg-input-bg-dark"
              onClick={handleClearInputs}
            >
              <XCircle className="h-4 w-4 text-gold" />
              <span>Clear Inputs</span>
            </Button>
          </div>

          {/* Bottom Info Cards & Chart/History Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="ghost"
              className="flex-1 flex items-center justify-center space-x-2 text-black/70 hover:bg-medium-gray rounded-md dark:text-light-gray dark:hover:bg-input-bg-dark"
              onClick={() => setIsChartModalOpen(true)}
            >
              <Eye className="h-4 w-4 text-gold" />
              <span>Show Chart</span>
            </Button>
            <Link href="/portfolio" passHref className="flex-1">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center space-x-2 text-black/70 hover:bg-medium-gray rounded-md dark:text-light-gray dark:hover:bg-input-bg-dark"
              >
                <Eye className="h-4 w-4 text-gold" />
                <span>Show History</span>
              </Button>
            </Link>
          </div>

          <TokenInfoCards
            solToken={tokens.find((t) => t.symbol === "SOL")}
            sprwToken={sprwToken} // Pass the actual sprwToken found (or null)
            solBalance={solBalance}
            sprwBalance={sprwBalance}
          />
        </div>
      )}

      {activeTab === "trigger" && (
        <div className="text-center text-black/70 dark:text-light-gray py-8">Trigger swaps coming soon!</div>
      )}

      {activeTab === "recurring" && (
        <div className="text-center text-black/70 dark:text-light-gray py-8">Recurring swaps coming soon!</div>
      )}

      {activeTab === "settings" && (
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gold mb-4 text-center">Swap Settings</h2>
          <SwapSettings />
        </div>
      )}
    </div>
  )
}
