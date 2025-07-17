import { PublicKey } from "@solana/web3.js"

/**
 * Validates if a string is a valid Solana public key.
 * @param address The string to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Validates if an amount is a positive number.
 * @param amount The amount to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidAmount(amount: number | string): boolean {
  const num = typeof amount === "string" ? Number.parseFloat(amount) : amount
  return !isNaN(num) && num > 0
}

/**
 * Validates if a slippage BPS value is within acceptable range (0-10000).
 * @param slippageBps The slippage in basis points.
 * @returns True if valid, false otherwise.
 */
export function isValidSlippage(slippageBps: number): boolean {
  return slippageBps >= 0 && slippageBps <= 10000 // 0% to 100%
}
