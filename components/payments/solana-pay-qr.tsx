"use client"
import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import type { SolanaPayQRProps } from "@/app/types/solana-pay"

export function SolanaPayQR({ url, size = 256 }: SolanaPayQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        { width: size, color: { dark: "#000000", light: "#FFFFFF" } },
        (error) => {
          if (error) {
            console.error("Error generating QR code:", error)
          }
        },
      )
    }
  }, [url, size])

  if (!url) {
    return <div className="text-center text-black/70 dark:text-light-gray">No Solana Pay URL provided.</div>
  }

  return (
    <div className="flex justify-center p-4">
      <canvas ref={canvasRef} className="rounded-md shadow-lg" />
    </div>
  )
}
