"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatTokenAmount } from "@/app/lib/currency"
import { useTokenBalances } from "@/app/hooks/use-token-balances"
import { useWallet } from "@/components/wallet-provider"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"

export default function PortfolioPage() {
  const { address, isConnected } = useWallet()
  const { balances, isLoading, error, fetchBalances } = useTokenBalances(address?.toBase58() || "")

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances()
    }
  }, [isConnected, address, fetchBalances])

  if (!isConnected) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-gold">Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please connect your wallet to view your portfolio.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-gold">Your Portfolio</CardTitle>
          <p className="text-muted-foreground">Overview of your token holdings.</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading balances...</span>
            </div>
          ) : error ? (
            <div className="text-center text-negative-red">Error loading portfolio: {error}</div>
          ) : balances.length === 0 ? (
            <div className="text-center text-muted-foreground">No tokens found in your wallet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">USD Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balances.map((balance) => (
                  <TableRow key={balance.mintAddress}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {balance.logoURI && (
                        <img
                          src={balance.logoURI || "/placeholder.svg"}
                          alt={balance.symbol}
                          className="h-6 w-6 rounded-full"
                        />
                      )}
                      {balance.name} ({balance.symbol})
                    </TableCell>
                    <TableCell className="text-right">{formatTokenAmount(balance.amount, balance.decimals)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balance.usdValue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
