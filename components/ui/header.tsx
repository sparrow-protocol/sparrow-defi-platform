"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Settings } from "lucide-react"
import { WalletButton } from "@/components/wallet-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/app/hooks/use-mobile" // Import useMobile hook

export function Header() {
  const { theme } = useTheme()
  const isMobile = useMobile() // Use the hook
  const logoIconSrc = theme === "dark" ? "/images/sparrow-icon-white.png" : "/images/sparrow-icon-black.png"

  return (
    <header className="bg-white text-black border-b border-light-gray dark:bg-black dark:text-white dark:border-dark-gray py-4">
      <div className="container mx-auto flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left Group: Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={logoIconSrc || "/placeholder.svg"} alt="Sparrow Protocol Logo" width={30} height={30} />
            <span className="text-xl font-light-custom text-black dark:text-white">Sparrow</span>
            <span className="text-xl font-geist-bold text-gold">Swap</span>
          </Link>
        </div>

        {/* Centered Navigation for Desktop */}
        <nav className="hidden md:flex flex-grow justify-center space-x-4">
          <Button variant="link" asChild className="text-gold hover:text-dark-gold">
            <Link href="/">Swap</Link>
          </Button>
          <Button variant="link" asChild className="text-black hover:text-gold dark:text-white dark:hover:text-gold">
            <Link href="/pro">Pro</Link>
          </Button>
          <Button variant="link" asChild className="text-black hover:text-gold dark:text-white dark:hover:text-gold">
            <Link href="/perps">Perps</Link>
          </Button>
          <Button variant="link" asChild className="text-black hover:text-gold dark:text-white dark:hover:text-gold">
            <Link href="/portfolio">Portfolio</Link>
          </Button>
          <Button variant="link" asChild className="text-black hover:text-gold dark:text-white dark:hover:text-gold">
            <Link href="/payments/on-ramp">On-Ramp</Link>
          </Button>
          <Button variant="link" asChild className="text-black hover:text-gold dark:text-white dark:hover:text-gold">
            <Link href="/payments/exact-out">Pay & Receive</Link>
          </Button>
          <Button variant="link" asChild className="text-black hover:text-gold dark:text-white dark:hover:text-gold">
            <Link href="/faq">FAQ</Link>
          </Button>
        </nav>

        {/* Right Group: Search, Create, Wallet, Theme, Settings */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Input - Responsive */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-light-gray dark:text-light-gray" />
            <Input
              type="text"
              placeholder="Search token or address"
              className="w-32 sm:w-48 md:w-64 rounded-md border border-light-gray bg-input-bg-light pl-9 text-sm text-black placeholder:text-light-gray focus:border-gold focus:ring-0 dark:border-dark-gray dark:bg-input-bg-dark dark:text-white dark:placeholder:text-light-gray"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-light-gray dark:text-light-gray">
              /
            </span>
          </div>
          {/* Create Button - Hidden on small mobile */}
          {!isMobile && (
            <Button variant="gold-filled" className="rounded-md px-4 py-2 text-sm font-semibold hidden md:flex">
              <Plus className="mr-1 h-4 w-4" />
              Create
            </Button>
          )}
          <WalletButton />
          <ThemeToggle />
          <Button variant="framed-black" size="icon" className="rounded-md text-gold hidden sm:flex">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
