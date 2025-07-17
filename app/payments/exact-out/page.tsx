"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/components/wallet-provider"
import { PublicKey } from "@solana/web3.js"
import {
  getJupiterExactOutQuote,
  getJupiterExactOutSwapTransaction,
  sendAndConfirmRawTransaction,
} from "@/app/lib/defi-api"
import type { Token } from "@/app/types/tokens"
import { formatTokenAmount, formatCurrency } from "@/app/lib/currency"
import { Loader2 } from "lucide-react"
import { TokenSelectModal } from "@/components/token-select-modal"
import { TransactionStatusModal } from "@/components/payments/transaction-status-modal"
import { DEFAULT_SLIPPAGE_BPS, SOL_MINT, USDC_MINT } from "@/app/lib/constants"
import { getTokens } from "@/server/actions/tokens"
import { VersionedTransaction } from "@solana/web3.js"

export default function ExactOutPaymentPage() {
  const { address, signTransaction, isConnected } = useWallet()
  const { toast } = useToast()

  const [outputToken, setOutputToken] = useState<Token | null>(null)
  const [inputToken, setInputToken] = useState<Token | null>(null)
  const [outputAmount, setOutputAmount] = useState<string>("")
  const [recipientAddress, setRecipientAddress] = useState<string>("")
  const [quote, setQuote] = useState<any | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isOutputTokenModalOpen, setIsOutputTokenModalOpen] = useState(false)
  const [isInputTokenModalOpen, setIsInputTokenModalOpen] = useState(false)
  const [allTokens, setAllTokens] = useState<Token[]>([])

  useEffect(() => {
    const fetchTokens = async () => {
      const tokens = await getTokens()
      setAllTokens(tokens)
      // Set default tokens
      setOutputToken(tokens.find((t) => t.address === USDC_MINT) || null)
      setInputToken(tokens.find((t) => t.address === SOL_MINT) || null)
    }
    fetchTokens()
  }, [])

  const fetchQuote = useCallback(async () => {
    if (!inputToken || !outputToken || !outputAmount || Number.parseFloat(outputAmount) <= 0) {
      setQuote(null)
      return
    }

    setIsLoadingQuote(true)
    try {
      const amountInSmallestUnits = Math.round(
        Number.parseFloat(outputAmount) * Math.pow(10, outputToken.decimals),
      ).toString()
      const fetchedQuote = await getJupiterExactOutQuote(
        inputToken.address,
        outputToken.address,
        amountInSmallestUnits,
        DEFAULT_SLIPPAGE_BPS,
      )
      setQuote(fetchedQuote)
    } catch (error) {
      console.error("Error fetching exact out quote:", error)
      toast({
        title: "Error",
        description: "Failed to fetch exact out quote. Please try again.",
        type: "error",
      })
      setQuote(null)
    } finally {
      setIsLoadingQuote(false)
    }
  }, [inputToken, outputToken, outputAmount, toast])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchQuote()
    }, 500) // Debounce quote fetching

    return () => clearTimeout(handler)
  }, [fetchQuote])

  const handleMakePayment = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a payment.",
        type: "warning",
      })
      return
    }
    if (!quote) {
      toast({
        title: "Missing Quote",
        description: "Please wait for a valid quote to be generated.",
        type: "warning",
      })
      return
    }
    if (!recipientAddress || !PublicKey.isOnCurve(new PublicKey(recipientAddress))) {
      toast({
        title: "Invalid Recipient Address",
        description: "Please enter a valid Solana recipient address.",
        type: "error",
      })
      return
    }

    setIsProcessingPayment(true)
    setTransactionSignature(null)
    setIsTransactionModalOpen(true)

    try {
      const rawTransaction = await getJupiterExactOutSwapTransaction(
        inputToken!.address,
        outputToken!.address,
        Math.round(Number.parseFloat(outputAmount) * Math.pow(10, outputToken!.decimals)).toString(),
        DEFAULT_SLIPPAGE_BPS,
        address.toBase58(),
        recipientAddress,
      )

      if (!rawTransaction) {
        throw new Error("Failed to get swap transaction from Jupiter.")
      }

      const transaction = VersionedTransaction.deserialize(Buffer.from(rawTransaction, "base64"))
      const signedTransaction = await signTransaction(transaction)

      if (!signedTransaction) {
        throw new Error("Failed to sign transaction.")
      }

      const signature = await sendAndConfirmRawTransaction(
        Buffer.from(signedTransaction.serialize()).toString("base64"),
      )
      setTransactionSignature(signature)
      toast({
        title: "Payment Successful!",
        description: `Transaction confirmed: ${signature}`,
        type: "success",
        duration: 5000,
      })
    } catch (error: any) {
      console.error("Payment failed:", error)
      toast({
        title: "Payment Failed",
        description: error.message || "An unknown error occurred during payment.",
        type: "error",
        duration: 5000,
      })
      setTransactionSignature(null)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const estimatedInputAmount = quote
    ? formatTokenAmount(quote.inAmount / Math.pow(10, inputToken?.decimals || 0), inputToken?.decimals || 6)
    : "0"
  const estimatedInputAmountUsd =
    quote && inputToken?.price
      ? formatCurrency((quote.inAmount / Math.pow(10, inputToken.decimals)) * inputToken.price, 2)
      : "$0.00"

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-gold">Exact Out Payment</CardTitle>
          <CardDescription>Specify the exact amount of the token you want the recipient to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="output-token">Recipient Receives (Exact Amount)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="output-amount"
                type="number"
                placeholder="0.00"
                value={outputAmount}
                onChange={(e) => setOutputAmount(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={() => setIsOutputTokenModalOpen(true)}>
                {outputToken ? (
                  <div className="flex items-center gap-2">
                    {outputToken.logoURI && (
                      <img
                        src={outputToken.logoURI || "/placeholder.svg"}
                        alt={outputToken.symbol}
                        className="h-5 w-5 rounded-full"
                      />
                    )}
                    {outputToken.symbol}
                  </div>
                ) : (
                  "Select Token"
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="input-token">You Pay (Estimated)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="input-amount"
                type="text"
                value={isLoadingQuote ? "Calculating..." : estimatedInputAmount}
                readOnly
                className="flex-1 bg-muted"
              />
              <Button variant="outline" onClick={() => setIsInputTokenModalOpen(true)}>
                {inputToken ? (
                  <div className="flex items-center gap-2">
                    {inputToken.logoURI && (
                      <img
                        src={inputToken.logoURI || "/placeholder.svg"}
                        alt={inputToken.symbol}
                        className="h-5 w-5 rounded-full"
                      />
                    )}
                    {inputToken.symbol}
                  </div>
                ) : (
                  "Select Token"
                )}
              </Button>
            </div>
            {inputToken?.price && (
              <p className="text-sm text-muted-foreground text-right">~{estimatedInputAmountUsd}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipient-address">Recipient Solana Address</Label>
            <Input
              id="recipient-address"
              type="text"
              placeholder="Enter recipient's public key"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </div>

          <Button
            onClick={handleMakePayment}
            className="w-full bg-gold hover:bg-dark-gold text-white"
            disabled={!isConnected || !quote || isLoadingQuote || isProcessingPayment || !recipientAddress}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              "Make Payment"
            )}
          </Button>
        </CardContent>
      </Card>

      <TokenSelectModal
        isOpen={isOutputTokenModalOpen}
        onClose={() => setIsOutputTokenModalOpen(false)}
        onSelectToken={(token) => {
          setOutputToken(token)
          setIsOutputTokenModalOpen(false)
        }}
        tokens={allTokens}
      />
      <TokenSelectModal
        isOpen={isInputTokenModalOpen}
        onClose={() => setIsInputTokenModalOpen(false)}
        onSelectToken={(token) => {
          setInputToken(token)
          setIsInputTokenModalOpen(false)
        }}
        tokens={allTokens}
      />

      <TransactionStatusModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        signature={transactionSignature}
        isLoading={isProcessingPayment}
        title="Payment Status"
        description="Your exact-out payment is being processed."
      />
    </div>
  )
}
