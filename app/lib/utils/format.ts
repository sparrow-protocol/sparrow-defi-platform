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
 * Formats a currency value with proper decimal places and currency symbol.
 * @param value The value to format.
 * @param currency The currency symbol (default: USD).
 * @param decimals The number of decimal places (default: 2).
 * @returns The formatted currency string.
 */
export function formatCurrency(value: number | string, currency = "USD", decimals = 2): string {
  const num = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(num)) {
    return `$0.00`
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return formatter.format(num)
}

/**
 * Formats a token amount with appropriate decimal places.
 * @param amount The token amount to format.
 * @param decimals The token decimals (default: 6).
 * @param displayDecimals The number of decimal places to display (default: 6).
 * @returns The formatted token amount string.
 */
export function formatTokenAmount(amount: number | string | bigint, decimals = 6, displayDecimals = 6): string {
  let num: number

  if (typeof amount === "bigint") {
    num = Number(amount) / Math.pow(10, decimals)
  } else if (typeof amount === "string") {
    num = Number.parseFloat(amount)
  } else {
    num = amount
  }

  if (isNaN(num)) {
    return "0"
  }

  // For very small amounts, show more precision
  if (num < 0.001 && num > 0) {
    return num.toExponential(2)
  }

  // For amounts less than 1, show up to 6 decimal places
  if (num < 1) {
    return num.toFixed(Math.min(displayDecimals, 6))
  }

  // For larger amounts, show fewer decimal places
  if (num >= 1000) {
    return formatLargeNumber(num)
  }

  return num.toFixed(Math.min(displayDecimals, 4))
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

/**
 * Formats a percentage value.
 * @param value The percentage value (0-100).
 * @param decimals The number of decimal places (default: 2).
 * @returns The formatted percentage string.
 */
export function formatPercentage(value: number | string, decimals = 2): string {
  const num = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(num)) {
    return "0.00%"
  }
  return `${num.toFixed(decimals)}%`
}

/**
 * Formats a price change with appropriate color coding.
 * @param change The price change value.
 * @param isPercentage Whether the change is a percentage.
 * @returns Object with formatted value and color class.
 */
export function formatPriceChange(change: number | string, isPercentage = false) {
  const num = typeof change === "string" ? Number.parseFloat(change) : change
  if (isNaN(num)) {
    return { value: "0.00", color: "text-gray-500" }
  }

  const formatted = isPercentage ? formatPercentage(num) : formatNumber(num)
  const color = num > 0 ? "text-green-500" : num < 0 ? "text-red-500" : "text-gray-500"
  const prefix = num > 0 ? "+" : ""

  return {
    value: `${prefix}${formatted}`,
    color,
  }
}

/**
 * Formats a timestamp to a readable date string.
 * @param timestamp The timestamp in milliseconds.
 * @param format The format type ('short', 'long', 'time').
 * @returns The formatted date string.
 */
export function formatDate(timestamp: number, format: "short" | "long" | "time" = "short"): string {
  const date = new Date(timestamp)

  switch (format) {
    case "long":
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    case "time":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    default:
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
  }
}
