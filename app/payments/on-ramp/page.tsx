"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { SolanaPayQR } from "@/components/payments/solana-pay-qr"
import { useToast } from "@/app/hooks/use-toast"
import { useWallet } from "@/components/wallet-provider"
import { useSolanaPay } from "@/app/hooks/use-solana-pay"

export default function OnRampPage() {
  const [recipient, setRecipient] = useState("GjFwB22222222222222222222222222222222222222222222222222222222222") // Default recipient
  const [amount, setAmount] = useState("0.01")
  const [label, setLabel] = useState("Sparrow Protocol Donation")
  const [message, setMessage] = useState("Thank you for supporting Sparrow Protocol!")
  const [splToken, setSplToken] = useState("") // Optional SPL token mint

  const { address: userPublicKey } = useWallet()
  const { solanaPayUrl, isLoading, error, generateSolanaPayUrl, savePaymentTransaction } = useSolanaPay(recipient)
  const { showToast } = useToast()

  const handleGenerateQR = useCallback(async () => {
    if (!recipient || !amount || Number.parseFloat(amount) <= 0) {
      showToast({ message: "Please enter a valid recipient and amount.", type: "warning" })
      return
    }

    await generateSolanaPayUrl({
      amount: Number.parseFloat(amount),
      label,
      message,
      recipient, // This is passed to the hook, which then uses it
      splToken: splToken || undefined,
    })

    // Save the payment transaction to DB immediately after QR generation (for demo purposes)
    if (userPublicKey) {
      await savePaymentTransaction({
        userPublicKey: userPublicKey,
        type: "payment",
        paymentRecipient: recipient,
        paymentAmount: amount.toString(),
        paymentSplToken: splToken || undefined,
        paymentLabel: label,
        paymentMessage: message,
        status: "pending", // Set as pending until confirmed on-chain
      })
    }
  }, [
    recipient,
    amount,
    label,
    message,
    splToken,
    generateSolanaPayUrl,
    savePaymentTransaction,
    userPublicKey,
    showToast,
  ])

  return (
    <div className="flex flex-1 flex-col items-center py-12 md:py-24 lg:py-32 bg-medium-gray dark:bg-black text-black dark:text-white px-4">
      <h1 className="text-4xl font-bold text-gold mb-8 text-center">On-Ramp with Solana Pay</h1>
      <p className="max-w-2xl text-lg text-black/70 dark:text-light-gray mb-8 text-center">
        Generate a Solana Pay QR code to receive payments or donations in SOL or SPL tokens.
      </p>
      <div className="w-full max-w-md bg-white dark:bg-dark-gray p-6 rounded-lg shadow-lg">
        <div className="grid gap-6 py-4">
          <div className="grid md:grid-cols-4 items-center gap-4">
            <Label htmlFor="recipient" className="md:text-right text-black dark:text-white">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g., 123...xyz"
              className="md:col-span-3 border border-light-gray dark:border-dark-gray bg-input-bg-light dark:bg-input-bg-dark text-black dark:text-white"
            />
          </div>
          <div className="grid md:grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="md:text-right text-black dark:text-white">
              Amount (SOL/Token)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.001"
              className="md:col-span-3 border border-light-gray dark:border-dark-gray bg-input-bg-light dark:bg-input-bg-dark text-black dark:text-white"
            />
          </div>
          <div className="grid md:grid-cols-4 items-center gap-4">
            <Label htmlFor="splToken" className="md:text-right text-black dark:text-white">
              SPL Token Mint (Optional)
            </Label>
            <Input
              id="splToken"
              value={splToken}
              onChange={(e) => setSplToken(e.target.value)}
              placeholder="e.g., EPjFWdd5AufqSSqeM2qN1xzybapTVG4itwqZNfwpPJ55 (USDC)"
              className="md:col-span-3 border border-light-gray dark:border-dark-gray bg-input-bg-light dark:bg-input-bg-dark text-black dark:text-white"
            />
          </div>
          <div className="grid md:grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="md:text-right text-black dark:text-white">
              Label (Optional)
            </Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Donation"
              className="md:col-span-3 border border-light-gray dark:border-dark-gray bg-input-bg-light dark:bg-input-bg-dark text-black dark:text-white"
            />
          </div>
          <div className="grid md:grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="md:text-right text-black dark:text-white">
              Message (Optional)
            </Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., Thank you!"
              className="md:col-span-3 border border-light-gray dark:border-dark-gray bg-input-bg-light dark:bg-input-bg-dark text-black dark:text-white"
            />
          </div>

          <Button
            onClick={handleGenerateQR}
            disabled={isLoading || !recipient || Number.parseFloat(amount) <= 0}
            className="w-full mt-4 py-3 text-lg font-semibold"
            variant="gold-filled"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating QR...
              </>
            ) : (
              "Generate Solana Pay QR"
            )}
          </Button>

          {error && (
            <div className="text-center text-negative-red text-sm p-2 rounded-md bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              Error: {error}
            </div>
          )}

          {solanaPayUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gold text-center mb-4">Scan to Pay</h3>
              <SolanaPayQR url={solanaPayUrl} size={256} />
              <p className="text-center text-sm text-black/70 dark:text-light-gray mt-2 break-all">
                URL: <span className="font-mono text-xs">{solanaPayUrl}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
