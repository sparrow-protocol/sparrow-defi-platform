"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"
import type { Token } from "@/app/types/tokens"
import { formatNumber } from "@/app/lib/format"

interface TokenInputProps {
  label: string
  amount: string
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedToken: Token | null
  onSelectTokenClick: () => void
  balance?: number | null
  onMaxClick?: () => void
  onHalfClick?: () => void
  readOnly?: boolean
  isFetchingQuote?: boolean
}

export function TokenInput({
  label,
  amount,
  onAmountChange,
  selectedToken,
  onSelectTokenClick,
  balance,
  onMaxClick,
  onHalfClick,
  readOnly = false,
  isFetchingQuote = false,
}: TokenInputProps) {
  return (
    <div className="rounded-lg bg-input-bg-light p-4 dark:bg-input-bg-dark shadow-sm">
      <div className="flex items-center justify-between text-sm text-black/70 dark:text-light-gray mb-2">
        <span>{label}</span>
        {balance !== undefined && balance !== null && (
          <div className="flex items-center space-x-2">
            <span>
              Balance: {formatNumber(balance, 6)} {selectedToken?.symbol}
            </span>
            {onHalfClick && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 rounded-md bg-medium-gray px-2 text-xs text-black hover:bg-light-gray dark:bg-dark-gray dark:text-white dark:hover:bg-medium-gray"
                onClick={onHalfClick}
              >
                HALF
              </Button>
            )}
            {onMaxClick && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 rounded-md bg-medium-gray px-2 text-xs text-black hover:bg-light-gray dark:bg-dark-gray dark:text-white dark:hover:bg-medium-gray"
                onClick={onMaxClick}
              >
                MAX
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <Button
          onClick={onSelectTokenClick}
          className="flex items-center space-x-2 rounded-md bg-medium-gray px-3 py-2 text-lg font-semibold text-black hover:bg-light-gray dark:bg-dark-gray dark:text-white dark:hover:bg-medium-gray"
        >
          {selectedToken ? (
            <>
              <Image
                src={selectedToken.icon || "/placeholder.svg"}
                alt={`${selectedToken.symbol} icon`}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{selectedToken.symbol}</span>
            </>
          ) : (
            <span>Select Token</span>
          )}
          <ChevronDown className="h-4 w-4 text-gold" />
        </Button>
        <div className="text-right w-full sm:w-auto">
          <Input
            type="number"
            placeholder="0.00"
            value={isFetchingQuote && !readOnly ? "Fetching..." : amount}
            onChange={onAmountChange}
            readOnly={readOnly || isFetchingQuote}
            className="w-full sm:w-32 border-none bg-transparent text-right text-3xl font-bold text-black focus:ring-0 dark:text-white"
          />
          {/* Placeholder for USD value, if available */}
          <div className="text-sm text-black/70 dark:text-light-gray">$0</div>
        </div>
      </div>
    </div>
  )
}
