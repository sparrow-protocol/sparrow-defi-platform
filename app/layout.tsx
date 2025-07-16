import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
})

export const metadata: Metadata = {
  title: "Sparrow Protocol",
  description: "Decentralized token swap platform",
  other: {
    author: "Sparrow Protocol"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
