"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function EmbeddedWallet() {
  const { ready, authenticated, user, login, createWallet, linkWallet, logout } = usePrivy()

  const hasEmbeddedWallet = user?.wallet?.walletClientType === "privy"

  const handleCreateWallet = async () => {
    try {
      await createWallet()
    } catch (error) {
      console.error("Error creating embedded wallet:", error)
    }
  }

  const handleLinkWallet = async () => {
    try {
      await linkWallet()
    } catch (error) {
      console.error("Error linking wallet:", error)
    }
  }

  if (!ready) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Loading Wallet...</CardTitle>
          <CardDescription>Please wait while we prepare your wallet experience.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (!authenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>Sign in to create or link your embedded wallet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={login} className="w-full">
            Sign In / Connect
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Embedded Wallet</CardTitle>
        <CardDescription>
          {hasEmbeddedWallet ? "Your embedded wallet is ready." : "Create or link an embedded wallet."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasEmbeddedWallet ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Address:{" "}
              {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : "N/A"}
            </p>
            <Button onClick={logout} variant="outline" className="mt-4 bg-transparent">
              Disconnect Privy
            </Button>
          </div>
        ) : (
          <>
            <Button onClick={handleCreateWallet} className="w-full">
              Create Embedded Wallet
            </Button>
            <Button onClick={handleLinkWallet} variant="outline" className="w-full bg-transparent">
              Link Existing Wallet
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
