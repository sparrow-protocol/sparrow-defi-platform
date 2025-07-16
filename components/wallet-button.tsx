"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"
import { useWallet } from "@/components/wallet-provider"
import Image from "next/image"

export function WalletButton() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="framed-black" // Wallet button black on light theme
          className="flex items-center space-x-2 rounded-md px-3 py-2"
        >
          {isConnected ? (
            <>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>WL</AvatarFallback>
              </Avatar>
              <span className="text-sm">
                {address?.slice(0, 4)}...{address?.slice(-3)}
              </span>
              <ChevronDown className="h-4 w-4 text-gold" />
            </>
          ) : (
            <span className="text-sm">Connect Wallet</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white text-black border-light-gray rounded-md dark:bg-dark-gray dark:text-white dark:border-medium-gray"
      >
        {isConnected ? (
          <DropdownMenuItem
            onClick={disconnectWallet}
            className="hover:bg-medium-gray dark:hover:bg-dark-gray cursor-pointer"
          >
            Disconnect
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => connectWallet("Phantom")}
              className="hover:bg-medium-gray dark:hover:bg-dark-gray cursor-pointer flex items-center space-x-2"
            >
              <Image src="/images/phantom.svg" alt="Phantom Logo" width={20} height={20} />
              <span>Phantom</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => connectWallet("Solflare")}
              className="hover:bg-medium-gray dark:hover:bg-dark-gray cursor-pointer flex items-center space-x-2"
            >
              <Image src="/images/solflare.svg" alt="Solflare Logo" width={20} height={20} />
              <span>Solflare</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => connectWallet("WalletConnect")}
              className="hover:bg-medium-gray dark:hover:bg-dark-gray cursor-pointer flex items-center space-x-2"
            >
              <Image src="/images/walletconnect.svg" alt="WalletConnect Logo" width={20} height={20} />
              <span>WalletConnect</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => connectWallet("Backpack")}
              className="hover:bg-medium-gray dark:hover:bg-dark-gray cursor-pointer flex items-center space-x-2"
            >
              <Image src="/images/backpack.png" alt="Backpack Logo" width={20} height={20} />
              <span>Backpack</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
