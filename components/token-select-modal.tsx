"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import type { TokenInfo } from "@/app/types/tokens"
import { getAllTokens } from "@/server/actions/tokens"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useTokenBalances } from "@/app/hooks/use-token-balances"
import { useWallet } from "@/components/wallet-provider"
import { formatTokenAmount } from "@/app/lib/format"
import { formatCurrency } from "@/app/lib/currency" // Import formatCurrency

interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectToken: (token: TokenInfo) => void
}

export function TokenSelectModal({ isOpen, onClose, onSelectToken }: TokenSelectModalProps) {
  const { address } = useWallet()
  const { balances, isLoading: isBalancesLoading } = useTokenBalances(address?.toBase58() || null)
  const { toast } = useToast()

  const [allTokens, setAllTokens] = useState<TokenInfo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoadingTokens, setIsLoadingTokens] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoadingTokens(true)
      setError(null)
      try {
        const fetchedTokens = await getAllTokens()
        setAllTokens(fetchedTokens)
      } catch (err: any) {
        console.error("Failed to fetch tokens:", err)
        setError(err.message || "Failed to load tokens.")
        toast({
          title: "Error",
          description: err.message || "Failed to load tokens. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingTokens(false)
      }
    }

    if (isOpen) {
      fetchTokens()
    }
  }, [isOpen, toast])

  const filteredTokens = useMemo(() => {
    if (!searchTerm) {
      // Sort by USD value if balances are available, otherwise by symbol
      if (balances.length > 0 && !isBalancesLoading) {
        const tokensWithBalances = allTokens.map((token) => {
          const balanceInfo = balances.find((b) => b.tokenAddress === token.address)
          return {
            ...token,
            balance: balanceInfo?.balance || 0,
            usdValue: balanceInfo?.usdValue || 0,
          }
        })
        return tokensWithBalances.sort((a, b) => b.usdValue - a.usdValue)
      }
      return allTokens.sort((a, b) => a.symbol.localeCompare(b.symbol))
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return allTokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(lowerCaseSearchTerm) ||
        token.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        token.address.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [allTokens, searchTerm, balances, isBalancesLoading])

  const handleTokenClick = useCallback(
    (token: TokenInfo) => {
      onSelectToken(token)
      onClose()
    },
    [onSelectToken, onClose],
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Select a Token</DialogTitle>
          <DialogDescription>Search for a token by name, symbol, or address.</DialogDescription>
        </DialogHeader>
        <div className="relative px-6 pb-4">
          <Search className="absolute left-9 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[400px] px-6">
          {isLoadingTokens || isBalancesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : filteredTokens.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No tokens found.</div>
          ) : (
            <div className="grid gap-2">
              {filteredTokens.map((token) => {
                const balanceInfo = balances.find((b) => b.tokenAddress === token.address)
                return (
                  <div
                    key={token.address}
                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent"
                    onClick={() => handleTokenClick(token)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={token.logoURI || "/placeholder.svg"} alt={token.symbol} />
                        <AvatarFallback>{token.symbol.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      </div>
                    </div>
                    {balanceInfo && (
                      <div className="text-right">
                        <p className="font-medium">{formatTokenAmount(balanceInfo.balance, token.decimals, 4)}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(balanceInfo.usdValue)}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
