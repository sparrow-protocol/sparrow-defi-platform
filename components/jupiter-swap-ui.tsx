"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Settings, ChevronDown, Search } from "lucide-react"
import SwapInterface from "@/components/swap-interface"

export default function JupiterSwapUI() {
  const [activeTab, setActiveTab] = useState("instant")

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0e17] text-white">
      {/* Background Image */}
      <Image
        src="/images/background.png"
        alt="Space background with cat and planet"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 z-10 bg-black opacity-50" />

      <div className="relative z-20 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              {/* Placeholder for Jupiter Logo */}
              <div className="h-6 w-6 rounded-full bg-lime-500" />
              <span className="text-lg font-bold">Jupiter</span>
            </div>
            <nav className="hidden space-x-4 md:flex">
              <Button variant="link" className="text-lime-500">
                Swap
              </Button>
              <Button variant="link" className="text-white/70 hover:text-white">
                Pro
              </Button>
              <Button variant="link" className="text-white/70 hover:text-white">
                Perps
              </Button>
              <Button variant="link" className="text-white/70 hover:text-white">
                Portfolio
              </Button>
              <Button variant="link" className="text-white/70 hover:text-white">
                FAQ
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                type="text"
                placeholder="Search token or address"
                className="w-64 rounded-full border border-white/20 bg-white/10 pl-9 text-sm text-white placeholder:text-white/50 focus:border-lime-500 focus:ring-0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/50">/</span>
            </div>
            <Button className="rounded-full bg-lime-500 px-4 py-2 text-sm font-semibold hover:bg-lime-600">
              <Plus className="mr-1 h-4 w-4" />
              Create
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 rounded-full bg-white/10 px-3 py-2 text-white/70 hover:bg-white/20 hover:text-white"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                    <AvatarFallback>GL</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">GL...yJ</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1a1f2c] text-white border-white/20">
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Profile</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Disconnect</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content - Now uses the refactored SwapInterface */}
        <main className="flex flex-1 items-center justify-center p-4">
          <SwapInterface />
        </main>

        {/* Bottom Info Cards - Now part of SwapInterface */}
        {/* Talk to us button */}
        <div className="absolute bottom-4 right-4">
          <Button className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/20">
            Talk to us
          </Button>
        </div>
      </div>
    </div>
  )
}
