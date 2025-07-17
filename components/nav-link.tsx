"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type * as React from "react"

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode
}

export function NavLink({ href, children, className, ...props }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href as string))

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
