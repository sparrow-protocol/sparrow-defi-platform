import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import { Calistoga as FontHeading } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css"
import ClientLayout from "@/app/client-layout"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
})

export const metadata: Metadata = {
  title: "Sparrow - DeFi Platform",
  description: "A decentralized finance platform built on Solana.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, fontHeading.variable)}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
