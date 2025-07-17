"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"
import { formatCurrency, formatTokenAmount } from "@/app/lib/format"
import type { TokenInfo } from "@/app/types/tokens"
import { Skeleton } from "@/components/ui/skeleton"

interface TokenInputProps {
  label: string
  amount: string
  onAmountChange: (amount: string) => void
  token: TokenInfo | null
  onTokenSelect: () => void
  balance?: number
  onMaxClick?: () => void
  usdValue?: number
  readOnly?: boolean
  isLoadingBalance?: boolean
}

export function TokenInput({
  label,
  amount,
  onAmountChange,
  token,
  onTokenSelect,
  balance,
  onMaxClick,
  usdValue,
  readOnly = false,
  isLoadingBalance = false,
}: TokenInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        {balance !== undefined && (
          <div className="text-sm text-muted-foreground flex items-center">
            Balance:{" "}
            {isLoadingBalance ? (
              <Skeleton className="h-4 w-16 ml-1" />
            ) : (
              <span className="font-medium ml-1">{formatTokenAmount(balance, token?.decimals || 6, 4)}</span>
            )}
            {onMaxClick && (
              <Button variant="link" size="sm" onClick={onMaxClick} className="h-auto p-0 ml-2 text-xs">
                MAX
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="flex-1 text-lg py-2"
          readOnly={readOnly}
        />
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto bg-transparent"
          onClick={onTokenSelect}
        >
          {token ? (
            <>
              <Avatar className="h-6 w-6">
                <AvatarImage src={token.logoURI || "/placeholder.svg"} alt={token.symbol} />
                <AvatarFallback>{token.symbol.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{token.symbol}</span>
            </>
          ) : (
            <span className="font-semibold">Select Token</span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      {usdValue !== undefined && (
        <div className="text-sm text-muted-foreground text-right">~{formatCurrency(usdValue)}</div>
      )}
    </div>
  )
}
