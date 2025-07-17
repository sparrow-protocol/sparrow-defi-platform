"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/app/hooks/use-media-query"
import { SidebarTrigger as Trigger, SidebarInset as Inset, SidebarProvider as Provider } from "@/components/ui/sidebar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter((segment) => segment)
    const breadcrumbs = [{ label: "Home", href: "/" }]

    pathSegments.forEach((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/")
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
      breadcrumbs.push({ label, href })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <Provider>
      <AppSidebar />
      <Inset>
        <Header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          {isMobile && <Trigger className="-ml-1" />}
          {isMobile && <Separator orientation="vertical" className="mr-2 h-4" />}
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={crumb.href}>
                  {index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </Header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
        <Footer />
      </Inset>
    </Provider>
  )
}
