// app/lib/format.ts

/**
 * Formats a number to a fixed number of decimal places.
 * @param value The number to format.
 * @param decimals The number of decimal places.
 * @returns The formatted string.
 */
export function formatNumber(value: number | string, decimals = 2): string {
  const num = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(num)) {
    return "0.00"
  }
  return num.toFixed(decimals)
}

/**
 * Formats a large number with K, M, B suffixes.
 * @param num The number to format.
 * @returns The formatted string.
 */
export function formatLargeNumber(num: number | string): string {
  const n = typeof num === "string" ? Number.parseFloat(num) : num
  if (isNaN(n)) {
    return "0"
  }

  if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(2) + "B"
  }
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(2) + "M"
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(2) + "K"
  }
  return n.toFixed(2)
}

/**
 * Truncates a Solana public key for display.
 * @param publicKey The public key string.
 * @param startLength Number of characters to show at the start.
 * @param endLength Number of characters to show at the end.
 * @returns The truncated string.
 */
export function truncatePublicKey(publicKey: string | null, startLength = 4, endLength = 4): string {
  if (!publicKey) {
    return "N/A"
  }
  if (publicKey.length <= startLength + endLength) {
    return publicKey
  }
  return `${publicKey.substring(0, startLength)}...${publicKey.substring(publicKey.length - endLength)}`
}
