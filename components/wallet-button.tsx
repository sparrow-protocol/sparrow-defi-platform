"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/wallet-provider"
import { usePrivy } from "@privy-io/react-auth"
import { truncatePublicKey } from "@/app/lib/format"
import { Wallet, LogOut, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export function WalletButton() {
  const {
    isConnected,
    address,
    walletName,
    walletIcon,
    isConnecting,
    isDisconnecting,
    connectWallet,
    disconnectWallet,
  } = useWallet()
  const { login, logout: privyLogout, ready: privyReady, authenticated: privyAuthenticated } = usePrivy()
  const { toast } = useToast()

  const handleConnect = async () => {
    if (!privyReady) {
      toast({
        title: "Loading...",
        description: "Privy is still loading. Please wait.",
        variant: "info",
      })
      return
    }
    if (!privyAuthenticated) {
      login() // Trigger Privy login flow
    } else {
      // If already authenticated with Privy, try to connect a specific wallet if not already
      connectWallet()
    }
  }

  const handleDisconnect = async () => {
    await disconnectWallet()
    if (privyAuthenticated) {
      await privyLogout() // Also log out from Privy
    }
  }

  if (isConnecting || isDisconnecting) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {isConnecting ? "Connecting..." : "Disconnecting..."}
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Avatar className="h-6 w-6">
              <AvatarImage src={walletIcon || "/placeholder.svg"} alt={walletName || "Wallet"} />
              <AvatarFallback>{walletName?.slice(0, 1) || "W"}</AvatarFallback>
            </Avatar>
            {truncatePublicKey(address.toBase58())}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={handleConnect}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
