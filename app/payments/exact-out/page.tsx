"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDown } from "lucide-react"
import { TokenSelectModal } from "@/components/token-select-modal"
import { useToast } from "@/app/hooks/use-toast"
import { useWallet } from "@/components/wallet-provider"
import { TransactionStatusModal } from "@/components/payments/transaction-status-modal"
import {
  getJupiterExactOutQuote,
  getJupiterExactOutSwapTransaction,
  sendAndConfirmRawTransaction,
} from "@/app/lib/defi-api"
import type { Token } from "@/app/types/tokens"
import type { JupiterQuoteResponse } from "@/app/types/api"
import { formatNumber } from "@/app/lib/format"
import { useSwapSettings } from "@/app/hooks/use-swap-settings"
import { VersionedTransaction } from "@solana/web3.js"

export default function ExactOutPaymentPage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [tokenFetchError, setTokenFetchError] = useState<string | null>(null)
  const [isLoadingTokens, setIsLoadingTokens] = useState(true)

  const [merchantRecipientAddress, setMerchantRecipientAddress] = useState(
    "GjFwB22222222222222222222222222222222222222222222222222222222222", // Example merchant address
  )
  const [outputToken, setOutputToken] = useState<Token | null>(null) // Merchant receives this token
  const [outputAmount, setOutputAmount] = useState<string>("1") // Merchant receives this amount
  const [inputToken, setInputToken] = useState<Token | null>(null) // Customer pays with this token
  const [customerPaysAmount, setCustomerPaysAmount] = useState<string>("") // Calculated from quote
  const [quote, setQuote] = useState<JupiterQuoteResponse | null>(null)
  const [isFetchingQuote, setIsFetchingQuote] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)
  const [modalFor, setModalFor] = useState<"output" | "input" | null>(null)

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"pending" | "confirmed" | "failed">("pending")
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null)
  const [transactionMessage, setTransactionMessage] = useState<string | undefined>(undefined)

  const { showToast } = useToast()
  const { isConnected, address: customerPublicKey, signTransaction } = useWallet()
  const { settings } = useSwapSettings()

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
        if (!outputToken || !fetchedTokens.some((t) => t.mint === outputToken.mint)) {
          setOutputToken(fetchedTokens.find((t) => t.symbol === "USDC") || fetchedTokens[0] || null)
        }
        if (!inputToken || !fetchedTokens.some((t) => t.mint === inputToken.mint)) {
          setInputToken(fetchedTokens.find((t) => t.symbol === "SOL") || fetchedTokens[1] || null)
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
  }, [outputToken, inputToken, showToast])

  // Fetch ExactOut quote when relevant inputs change
  useEffect(() => {
    const fetchExactOutQuote = async () => {
      if (
        inputToken &&
        outputToken &&
        outputAmount &&
        Number.parseFloat(outputAmount) > 0 &&
        merchantRecipientAddress
      ) {
        setIsFetchingQuote(true)
        try {
          const amountInSmallestUnit = (Number.parseFloat(outputAmount) * Math.pow(10, outputToken.decimals)).toFixed(0)
          const fetchedQuote = await getJupiterExactOutQuote(
            inputToken.mint,
            outputToken.mint,
            amountInSmallestUnit,
            settings.slippage * 100,
          )

          if (fetchedQuote && fetchedQuote.inAmount) {
            setQuote(fetchedQuote)
            const readableInput = Number.parseFloat(fetchedQuote.inAmount) / Math.pow(10, inputToken.decimals)
            setCustomerPaysAmount(readableInput.toFixed(inputToken.decimals > 6 ? 6 : inputToken.decimals))
          } else {
            setCustomerPaysAmount("No quote")
            setQuote(null)
            showToast({ message: "Failed to get ExactOut quote.", type: "error" })
          }
        } catch (error) {
          console.error("Error fetching ExactOut quote:", error)
          setCustomerPaysAmount("Error")
          setQuote(null)
          showToast({ message: "Error fetching ExactOut quote. Check console for details.", type: "error" })
        } finally {
          setIsFetchingQuote(false)
        }
      } else {
        setCustomerPaysAmount("")
        setQuote(null)
      }
    }
    const handler = setTimeout(() => {
      fetchExactOutQuote()
    }, 500)
    return () => clearTimeout(handler)
  }, [inputToken, outputToken, outputAmount, merchantRecipientAddress, settings.slippage, showToast])

  const handleTokenSelect = useCallback(
    (token: Token) => {
      if (modalFor === "output") {
        setOutputToken(token)
      } else if (modalFor === "input") {
        setInputToken(token)
      }
      setIsTokenModalOpen(false)
    },
    [modalFor],
  )

  const openTokenModal = (forToken: "output" | "input") => {
    setModalFor(forToken)
    setIsTokenModalOpen(true)
  }

  const handleInitiatePayment = async () => {
    if (!isConnected || !customerPublicKey) {
      showToast({ message: "Please connect your wallet to make a payment.", type: "warning" })
      return
    }
    if (!quote || !inputToken || !outputToken || !outputAmount || !merchantRecipientAddress) {
      showToast({ message: "Please ensure all payment details are filled and a quote is available.", type: "warning" })
      return
    }
    if (Number.parseFloat(outputAmount) <= 0) {
      showToast({ message: "Please enter a valid amount for the merchant to receive.", type: "warning" })
      return
    }

    setIsProcessingPayment(true)
    setIsTransactionModalOpen(true)
    setTransactionStatus("pending")
    setTransactionSignature(null)
    setTransactionMessage("Preparing payment transaction...")

    try {
      const amountInSmallestUnit = (Number.parseFloat(outputAmount) * Math.pow(10, outputToken.decimals)).toFixed(0)

      // 1. Get serialized transaction from our API route (which calls Jupiter's /swap with destinationTokenAccount)
      setTransactionMessage("Fetching payment transaction from Jupiter...")
      const swapTransactionResponse = await getJupiterExactOutSwapTransaction(
        inputToken.mint,
        outputToken.mint,
        amountInSmallestUnit,
        settings.slippage * 100,
        customerPublicKey,
        merchantRecipientAddress,
      )

      if (!swapTransactionResponse || !swapTransactionResponse.swapTransaction) {
        throw new Error("Failed to get payment transaction from Jupiter.")
      }

      // 2. Deserialize the transaction
      const transactionBuffer = Buffer.from(swapTransactionResponse.swapTransaction, "base64")
      const transaction = VersionedTransaction.deserialize(transactionBuffer)

      // 3. Sign the transaction (customer is the signer)
      setTransactionMessage("Signing transaction with your wallet...")
      const signedTransaction = await signTransaction(transaction)

      if (!signedTransaction) {
        throw new Error("Transaction signing failed or was cancelled.")
      }

      // 4. Serialize the signed transaction back to base64
      const signedRawTransaction = Buffer.from(signedTransaction.serialize()).toString("base64")

      // 5. Send and confirm the transaction
      setTransactionMessage("Sending payment to Solana network...")
      const signature = await sendAndConfirmRawTransaction(signedRawTransaction)

      setTransactionSignature(signature)
      setTransactionStatus("confirmed")
      setTransactionMessage("Payment successful!")
      showToast({ message: "Payment successful!", type: "success" })

      // 6. Save transaction to database
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPublicKey: customerPublicKey,
          inputMint: inputToken.mint,
          outputMint: outputToken.mint,
          inputAmount: quote.inAmount, // Use inAmount from the quote
          outputAmount: quote.outAmount, // Use outAmount from the quote
          signature: signature,
          status: "completed",
          type: "payment", // Explicitly set type as 'payment'
          paymentRecipient: merchantRecipientAddress,
          paymentAmount: outputAmount, // The amount the merchant received
          paymentSplToken: outputToken.mint,
          paymentLabel: "Jupcake Payment", // Example label
          paymentMessage: `Paid ${outputAmount} ${outputToken.symbol} for Jupcake`, // Example message
        }),
      })
    } catch (error: any) {
      console.error("Payment failed:", error)
      setTransactionStatus("failed")
      setTransactionMessage(error.message || "Payment failed. Please try again.")
      showToast({ message: error.message || "Payment failed.", type: "error" })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center py-12 md:py-24 lg:py-32 bg-medium-gray dark:bg-black text-black dark:text-white px-4">
      <h1 className="text-4xl font-bold text-gold mb-8 text-center">Pay & Receive (Exact Out)</h1>
      <p className="max-w-2xl text-lg text-black/70 dark:text-light-gray mb-8 text-center">
        Merchants can specify the exact token and amount they wish to receive, while customers pay with their preferred
        token.
      </p>
      <div className="w-full max-w-md bg-white dark:bg-dark-gray p-6 rounded-lg shadow-lg">
        <TokenSelectModal
          isOpen={isTokenModalOpen}
          onClose={() => setIsTokenModalOpen(false)}
          onSelectToken={handleTokenSelect}
          tokens={tokens}
          isLoadingTokens={isLoadingTokens}
          tokenFetchError={tokenFetchError}
        />

        <TransactionStatusModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          status={transactionStatus}
          signature={transactionSignature}
          message={transactionMessage}
        />

        {/* Merchant Receives */}
        <div className="rounded-lg bg-input-bg-light p-4 dark:bg-input-bg-dark shadow-sm mb-4">
          <div className="flex items-center justify-between text-sm text-black/70 dark:text-light-gray mb-2">
            <span>Merchant Receives</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Button
              onClick={() => openTokenModal("output")}
              className="flex items-center space-x-2 rounded-md bg-medium-gray px-3 py-2 text-lg font-semibold text-black hover:bg-light-gray dark:bg-dark-gray dark:text-white dark:hover:bg-medium-gray"
            >
              {outputToken ? (
                <>
                  <img
                    src={outputToken.icon || "/placeholder.svg"}
                    alt={`${outputToken.symbol} icon`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span>{outputToken.symbol}</span>
                </>
              ) : (
                <span>Select Token</span>
              )}
              <ArrowDown className="h-4 w-4 text-gold" />
            </Button>
            <div className="text-right w-full sm:w-auto">
              <Input
                type="number"
                placeholder="0.00"
                value={outputAmount}
                onChange={(e) => setOutputAmount(e.target.value)}
                className="w-full sm:w-32 border-none bg-transparent text-right text-3xl font-bold text-black focus:ring-0 dark:text-white"
              />
              <div className="text-sm text-black/70 dark:text-light-gray">$0</div> {/* Placeholder for USD value */}
            </div>
          </div>
        </div>

        {/* Customer Pays With */}
        <div className="rounded-lg bg-input-bg-light p-4 dark:bg-input-bg-dark shadow-sm mb-4">
          <div className="flex items-center justify-between text-sm text-black/70 dark:text-light-gray mb-2">
            <span>Customer Pays With</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Button
              onClick={() => openTokenModal("input")}
              className="flex items-center space-x-2 rounded-md bg-medium-gray px-3 py-2 text-lg font-semibold text-black hover:bg-light-gray dark:bg-dark-gray dark:text-white dark:hover:bg-medium-gray"
            >
              {inputToken ? (
                <>
                  <img
                    src={inputToken.icon || "/placeholder.svg"}
                    alt={`${inputToken.symbol} icon`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span>{inputToken.symbol}</span>
                </>
              ) : (
                <span>Select Token</span>
              )}
              <ArrowDown className="h-4 w-4 text-gold" />
            </Button>
            <div className="text-right w-full sm:w-auto">
              <Input
                type="text"
                placeholder="0.00"
                value={isFetchingQuote ? "Fetching..." : customerPaysAmount}
                readOnly
                className="w-full sm:w-32 border-none bg-transparent text-right text-3xl font-bold text-black focus:ring-0 dark:text-white"
              />
              <div className="text-sm text-black/70 dark:text-light-gray">$0</div> {/* Placeholder for USD value */}
            </div>
          </div>
        </div>

        {/* Merchant Recipient Address */}
        <div className="grid md:grid-cols-4 items-center gap-4 mb-6">
          <Label htmlFor="merchantAddress" className="md:text-right text-black dark:text-white">
            Merchant Address
          </Label>
          <Input
            id="merchantAddress"
            value={merchantRecipientAddress}
            onChange={(e) => setMerchantRecipientAddress(e.target.value)}
            placeholder="e.g., YourMerchantWalletAddress"
            className="md:col-span-3 border border-light-gray dark:border-dark-gray bg-input-bg-light dark:bg-input-bg-dark text-black dark:text-white"
          />
        </div>

        {/* Quote Details (similar to SwapDetails but for ExactOut) */}
        {quote && inputToken && outputToken && (
          <div className="space-y-2 text-sm text-black/70 dark:text-light-gray mb-6">
            <div className="flex justify-between">
              <span>Slippage Tolerance:</span>
              <span className="font-semibold text-gold">{settings.slippage}%</span>
            </div>
            <div className="flex justify-between">
              <span>Price Impact:</span>
              <span className={`${quote.priceImpactPct * 100 > 1 ? "text-negative-red" : "text-positive-green"}`}>
                {formatNumber(quote.priceImpactPct * 100, 2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Minimum Input (Customer Pays):</span>
              <span>
                {formatNumber(Number(quote.otherAmountThreshold) / Math.pow(10, inputToken.decimals), 6)}{" "}
                {inputToken.symbol}
              </span>
            </div>
            {quote.platformFee && (
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span>
                  {formatNumber(Number(quote.platformFee.amount) / Math.pow(10, inputToken.decimals), 6)}{" "}
                  {inputToken.symbol}
                </span>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleInitiatePayment}
          disabled={
            !isConnected ||
            isFetchingQuote ||
            isProcessingPayment ||
            !quote ||
            Number.parseFloat(outputAmount) <= 0 ||
            !merchantRecipientAddress
          }
          className="w-full py-3 text-lg font-semibold"
          variant="gold-filled"
        >
          {isConnected
            ? isFetchingQuote
              ? "Fetching Quote..."
              : isProcessingPayment
                ? "Processing Payment..."
                : "Confirm Payment"
            : "Connect Wallet"}
        </Button>
      </div>
    </div>
  )
}
