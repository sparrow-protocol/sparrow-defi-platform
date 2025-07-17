"use client"

import { useEffect, useRef } from "react"
import QRCodeStyling, { type Options } from "qr-code-styling"
import { useSolanaPay } from "@/app/hooks/use-solana-pay"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { truncatePublicKey } from "@/app/lib/format"

interface SolanaPayQRProps {
  recipient: string
  amount: number
  splToken?: string
  label?: string
  message?: string
  size?: number
  level?: "L" | "M" | "Q" | "H"
  fgColor?: string
  bgColor?: string
  includeLogo?: boolean
  logoSrc?: string
  logoWidth?: number
  logoHeight?: number
  logoOpacity?: number
}

const defaultQrOptions: Options = {
  width: 250,
  height: 250,
  type: "canvas",
  dotsOptions: {
    color: "#000000",
    type: "rounded",
  },
  backgroundOptions: {
    color: "#ffffff",
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#000000",
  },
  cornersDotOptions: {
    type: "dot",
    color: "#000000",
  },
}

export function SolanaPayQR({
  recipient,
  amount,
  splToken,
  label,
  message,
  size = 250,
  level = "H",
  fgColor = "#000000",
  bgColor = "#ffffff",
  includeLogo = true,
  logoSrc = "/images/sparrow-icon-black.png", // Default Sparrow logo
  logoWidth = 50,
  logoHeight = 50,
  logoOpacity = 1,
}: SolanaPayQRProps) {
  const ref = useRef<HTMLDivElement>(null)
  const qrCode = useRef<QRCodeStyling | null>(null)
  const { qrUrl, paymentId, paymentStatus, isLoading, error, generatePaymentQr } = useSolanaPay()

  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        ...defaultQrOptions,
        width: size,
        height: size,
        dotsOptions: { ...defaultQrOptions.dotsOptions, color: fgColor },
        backgroundOptions: { ...defaultQrOptions.backgroundOptions, color: bgColor },
        image: includeLogo ? logoSrc : undefined,
        imageOptions: {
          ...defaultQrOptions.imageOptions,
          imageSize: Math.min(logoWidth, logoHeight) / size,
          margin: 0,
          crossOrigin: "anonymous", // Important for CORS
        },
      })
    }

    if (ref.current) {
      qrCode.current.append(ref.current)
    }
  }, [size, fgColor, bgColor, includeLogo, logoSrc, logoWidth, logoHeight, logoOpacity])

  useEffect(() => {
    if (qrUrl && qrCode.current) {
      qrCode.current.update({
        data: qrUrl,
      })
    }
  }, [qrUrl])

  useEffect(() => {
    generatePaymentQr(recipient, amount, splToken, label, message)
  }, [recipient, amount, splToken, label, message, generatePaymentQr])

  const getStatusMessage = () => {
    if (isLoading) return "Generating QR code..."
    if (error) return `Error: ${error}`
    if (!paymentId) return "Waiting for payment request..."

    switch (paymentStatus?.status) {
      case "pending":
        return "Waiting for payment..."
      case "processing":
        return "Payment is being processed..."
      case "completed":
        return "Payment successful!"
      case "failed":
        return "Payment failed."
      case "expired":
        return "Payment request expired."
      default:
        return "Initializing payment..."
    }
  }

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />
    if (error || paymentStatus?.status === "failed" || paymentStatus?.status === "expired")
      return <XCircle className="h-8 w-8 text-red-500" />
    if (paymentStatus?.status === "completed") return <CheckCircle2 className="h-8 w-8 text-green-500" />
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />
  }

  return (
    <Card className="w-full max-w-sm mx-auto text-center">
      <CardHeader>
        <CardTitle>Scan to Pay</CardTitle>
        <CardDescription>
          {label || "Sparrow Payment"} for {amount} {splToken ? "SPL Token" : "SOL"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div ref={ref} className="border rounded-lg p-2" style={{ width: size, height: size }} />
          {isLoading || paymentStatus?.status === "pending" || paymentStatus?.status === "processing" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
              {getStatusIcon()}
            </div>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{getStatusMessage()}</p>
        {paymentStatus?.signature && (
          <p className="text-xs text-muted-foreground">Tx: {truncatePublicKey(paymentStatus.signature, 6, 6)}</p>
        )}
        {paymentStatus?.status === "failed" || paymentStatus?.status === "expired" ? (
          <Button onClick={() => generatePaymentQr(recipient, amount, splToken, label, message)}>
            Generate New QR
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
