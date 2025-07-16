import { PublicKey } from "@solana/web3.js"
import { Token } from "@/app/types/tokens"

/**
 * Format number as a currency (e.g. "$1,234.56")
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a large number with commas (e.g. "1,000,000")
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format token amount with its symbol (e.g. "2.34 SOL")
 */
export function formatTokenAmount(amount: number, token: Token, decimals = 4): string {
  return `${formatNumber(amount, decimals)} ${token.symbol}`
}

/**
 * Shorten public key/address (e.g. "4Nd1...XGQk")
 */
export function shortenAddress(address: string | PublicKey, chars = 4): string {
  const addr = typeof address === "string" ? address : address.toBase58()
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`
}

/**
 * Format a percentage (e.g. 0.05 => "5%")
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format timestamp to readable date (e.g. "Jul 16, 2025 14:30")
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
