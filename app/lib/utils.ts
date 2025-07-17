import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PublicKey } from "@solana/web3.js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null

  return function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func.apply(this, args)
    }
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  let lastResult: any
  let lastRan: number

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      lastRan = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastResult)
      lastResult = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        },
        Math.max(limit - (Date.now() - lastRan), 0),
      )
    }
  }
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch (error) {
    return false
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function truncatePublicKey(publicKey: string | PublicKey | null | undefined, chars = 4): string {
  if (!publicKey) return ""
  const pk = typeof publicKey === "string" ? publicKey : publicKey.toBase58()
  return `${pk.substring(0, chars)}...${pk.substring(pk.length - chars)}`
}
