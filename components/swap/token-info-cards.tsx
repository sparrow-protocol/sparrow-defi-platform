"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { formatNumber } from "@/app/lib/format"
import type { Token } from "@/app/types/tokens"
import { useEffect, useState } from "react"
import { getJupiterTokenPrice } from "@/app/lib/defi-api"

interface TokenInfoCardsProps {
  solToken?: Token | null
  sprwToken?: Token | null
  solBalance?: number | null
  sprwBalance?: number | null
}

export function TokenInfoCards({ solToken, sprwToken, solBalance, sprwBalance }: TokenInfoCardsProps) {
  const [solPrice, setSolPrice] = useState<string | null>(null)
  const [sprwPrice, setSprwPrice] = useState<string | null>(null)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [priceError, setPriceError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoadingPrices(true)
      setPriceError(null)
      const mintsToFetch: string[] = []
      if (solToken) mintsToFetch.push(solToken.mint)
      if (sprwToken) mintsToFetch.push(sprwToken.mint)

      if (mintsToFetch.length > 0) {
        try {
          const priceData = await getJupiterTokenPrice(mintsToFetch)
          if (!priceData) {
            setPriceError("Unable to reach Jupiter Price API. Please try again later.")
            setSolPrice(null)
            setSprwPrice(null)
            return
          }
          if (priceData && priceData.data) {
            if (solToken && priceData.data[solToken.mint]) {
              setSolPrice(priceData.data[solToken.mint].price)
            } else {
              setSolPrice(null) // Clear price if not found
            }
            if (sprwToken && priceData.data[sprwToken.mint]) {
              setSprwPrice(priceData.data[sprwToken.mint].price)
            } else {
              setSprwPrice(null) // Clear price if not found
            }
          } else {
            setPriceError("No price data received from Jupiter.")
          }
        } catch (error: any) {
          console.error("Error fetching Jupiter price:", error)
          setPriceError(error.message || "Failed to fetch prices.")
          setSolPrice(null)
          setSprwPrice(null)
        }
      } else {
        setSolPrice(null)
        setSprwPrice(null)
        setPriceError("No tokens provided to fetch prices for.")
      }
      setIsLoadingPrices(false)
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Refresh prices every minute
    return () => clearInterval(interval)
  }, [solToken, sprwToken])

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* SOL Card */}
      <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-input-bg-dark">
        <div className="flex items-center space-x-2 mb-2">
          <Image src="/images/sol-icon.png" alt="SOL icon" width={28} height={28} className="rounded-full" />
          <div>
            <div className="font-semibold text-black dark:text-white text-lg">SOL</div>
            <div className="text-xs text-black/70 dark:text-light-gray">So11...1112</div>
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xl font-bold text-black dark:text-white">
            {isLoadingPrices ? "Loading..." : solPrice ? `$${formatNumber(Number(solPrice), 2)}` : "N/A"}
          </span>
          {/* Hardcoded for now, would need another API for 24h change */}
          <span className="text-sm text-positive-green">+2.05%</span>
        </div>
        {solBalance !== undefined && solBalance !== null && (
          <div className="text-sm text-black/70 dark:text-light-gray">Balance: {formatNumber(solBalance, 6)}</div>
        )}
        {/* Placeholder for chart */}
        <div className="mt-3 h-12 w-full rounded-md border border-positive-green/50 bg-positive-green/10" />
        <Button
          variant="link"
          className="mt-2 flex items-center space-x-1 p-0 text-black/70 hover:text-black dark:text-light-gray dark:hover:text-white text-sm"
        >
          <span>Open Page</span>
          <ExternalLink className="h-3 w-3 text-gold" />
        </Button>
      </div>

      {/* SPRW Card */}
      <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-input-bg-dark">
        <div className="flex items-center space-x-2 mb-2">
          <Image src="/images/sparrow-token.png" alt="SPRW icon" width={28} height={28} className="rounded-full" />
          <div>
            <div className="font-semibold text-black dark:text-white text-lg">SPRW</div>
            <div className="text-xs text-black/70 dark:text-light-gray">SPRW...xxxx</div>
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xl font-bold text-black dark:text-white">
            {isLoadingPrices ? "Loading..." : sprwPrice ? `$${formatNumber(Number(sprwPrice), 6)}` : "N/A"}
          </span>
          {/* Hardcoded for now, would need another API for 24h change */}
          <span className="text-sm text-negative-red">-3.32%</span>
        </div>
        {sprwBalance !== undefined && sprwBalance !== null && (
          <div className="text-sm text-black/70 dark:text-light-gray">Balance: {formatNumber(sprwBalance, 6)}</div>
        )}
        {/* Placeholder for chart */}
        <div className="mt-3 h-12 w-full rounded-md border border-negative-red/50 bg-negative-red/10" />
        <Button
          variant="link"
          className="mt-2 flex items-center space-x-1 p-0 text-black/70 hover:text-black dark:text-light-gray dark:hover:text-white text-sm"
        >
          <span>Open Page</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      {priceError && (
        <div className="sm:col-span-2 text-center text-negative-red text-sm p-2 rounded-md bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          Price Fetch Error: {priceError}
        </div>
      )}
    </div>
  )
}
