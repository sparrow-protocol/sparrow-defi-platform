"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { SearchForm } from "@/components/search-form"
import {
  Home,
  BarChart,
  Wallet,
  Repeat,
  DollarSign,
  Settings,
  Info,
  HelpCircle,
  FileText,
  User2,
  LogOut,
  TrendingUp,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/app/hooks/use-user"
import { usePrivy } from "@privy-io/react-auth"
import { truncatePublicKey } from "@/app/lib/format"
import { useWallet } from "@/components/wallet-provider"

// Menu items.
const mainNavigation = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart,
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: Wallet,
  },
  {
    title: "Swap",
    href: "/", // Main page has swap
    icon: Repeat,
  },
  {
    title: "Payments",
    href: "/payments/exact-out",
    icon: DollarSign,
    subItems: [
      { title: "Exact Out", href: "/payments/exact-out" },
      { title: "On-Ramp", href: "/payments/on-ramp" },
    ],
  },
  {
    title: "Perpetuals",
    href: "/perps",
    icon: TrendingUp,
  },
]

const userNavigation = [
  {
    title: "Profile",
    href: "/profile",
    icon: User2,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

const legalNavigation = [
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
  {
    title: "FAQ",
    href: "/faq",
    icon: HelpCircle,
  },
  {
    title: "Terms of Use",
    href: "/terms-of-use",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    icon: FileText,
  },
  {
    title: "Disclaimer",
    href: "/disclaimer",
    icon: FileText,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, isLoading: isUserLoading } = useUser()
  const { logout } = usePrivy()
  const { address } = useWallet()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-4">
          <img src="/images/sparrow-icon-white.png" alt="Sparrow Logo" className="h-8 w-8" />
          <span className="text-xl font-semibold text-white">Sparrow</span>
        </Link>
        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton isActive={pathname.startsWith(item.href)}>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.title} asChild>
                            <Link href={subItem.href}>{subItem.title}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Legal & Info</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {legalNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatarUrl || "/placeholder-user.jpg"} alt={user?.username || "User"} />
                    <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <span>{user?.username || truncatePublicKey(address?.toBase58() || "") || "Guest"}</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User2 className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
