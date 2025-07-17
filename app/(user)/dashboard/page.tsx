"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, DollarSign, Wallet } from "lucide-react"
import Link from "next/link"
import { TransactionHistory } from "@/components/transaction-history"
import { useWallet } from "@/components/wallet-provider"
import { useUser } from "@/app/hooks/use-user"
import { formatCurrency } from "@/app/lib/currency"
import { useTokenBalances } from "@/app/hooks/use-token-balances"
import { useEffect } from "react"

export default function DashboardPage() {
  const { isConnected, address } = useWallet()
  const { user, authenticated } = useUser()
  const { balances, isLoading, error, fetchBalances } = useTokenBalances(address?.toBase58() || "")

  const totalPortfolioValue = balances.reduce((sum, b) => sum + (b.usdValue || 0), 0)

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances()
    }
  }, [isConnected, address, fetchBalances])

  if (!authenticated) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-gold">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please log in to view your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Connected Wallet</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {address ? `${address.toBase58().slice(0, 6)}...${address.toBase58().slice(-4)}` : "Not Connected"}
          </div>
          <p className="text-xs text-muted-foreground">{user?.email ? `Logged in as ${user.email}` : "Guest User"}</p>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2 xl:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gold">Recent Transactions</CardTitle>
          <Link href="#" className="flex items-center gap-1 text-sm text-muted-foreground hover:underline">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <TransactionHistory />
        </CardContent>
      </Card>
    </div>
  )
}
