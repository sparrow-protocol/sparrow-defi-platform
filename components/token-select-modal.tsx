"use client"
import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import type { Token } from "@/app/types/tokens"
import { Search, Loader2 } from "lucide-react" // Import Loader2

interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectToken: (token: Token) => void
  tokens: Token[]
  isLoadingTokens: boolean // New prop
  tokenFetchError: string | null // New prop
}

export function TokenSelectModal({
  isOpen,
  onClose,
  onSelectToken,
  tokens,
  isLoadingTokens,
  tokenFetchError,
}: TokenSelectModalProps) {
  const safeTokens: Token[] = Array.isArray(tokens) ? tokens : []
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTokens = useMemo(() => {
    if (!searchTerm) {
      return safeTokens
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return safeTokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(lowerCaseSearchTerm) ||
        token.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        token.mint.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [searchTerm, safeTokens])

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("") // Reset search term when modal closes
    }
  }, [isOpen])

  const handleSelect = (token: Token) => {
    onSelectToken(token)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-dark-gray text-black dark:text-white border-light-gray dark:border-medium-gray rounded-md">
        <DialogHeader>
          <DialogTitle className="text-gold">Select Token</DialogTitle>
          <DialogDescription className="text-black/70 dark:text-light-gray">
            Search for a token by symbol, name, or address.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-light-gray dark:text-light-gray" />
          <Input
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-light-gray bg-input-bg-light pl-9 text-sm text-black placeholder:text-light-gray focus:border-gold focus:ring-0 dark:border-dark-gray dark:bg-input-bg-dark dark:text-white dark:placeholder:text-light-gray"
          />
        </div>
        <ScrollArea className="h-[300px] pr-4">
          {isLoadingTokens ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-gold" />
            </div>
          ) : tokenFetchError ? (
            <div className="text-center text-negative-red py-8">
              <p className="font-semibold">Error loading tokens:</p>
              <p className="text-sm">{tokenFetchError}</p>
              <p className="text-xs mt-2">Please try again later or check your network.</p>
            </div>
          ) : filteredTokens.length === 0 ? (
            <div className="text-center text-black/70 dark:text-light-gray">No tokens found.</div>
          ) : (
            <div className="grid gap-2">
              {filteredTokens.map((token) => (
                <div
                  key={token.mint}
                  className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-medium-gray dark:hover:bg-input-bg-dark"
                  onClick={() => handleSelect(token)}
                >
                  <Image
                    src={token.icon || "/placeholder.svg"}
                    alt={`${token.symbol} icon`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-black dark:text-white">{token.symbol}</div>
                    <div className="text-xs text-black/70 dark:text-light-gray">{token.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
