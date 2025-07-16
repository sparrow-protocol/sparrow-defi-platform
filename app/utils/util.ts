import { PublicKey } from "@solana/web3.js"

/**
 * Check if a string is a valid Solana address
 */
export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Convert a string amount to lamports (based on token decimals)
 */
export function toLamports(amount: string, decimals: number): bigint {
  return BigInt(Math.floor(Number(amount) * 10 ** decimals))
}

/**
 * Convert lamports (bigint or number) to a token amount string
 */
export function fromLamports(lamports: bigint | number, decimals: number): string {
  return (Number(lamports) / 10 ** decimals).toFixed(decimals)
}

/**
 * Sleep for a given number of milliseconds (useful for retries)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Check if two public keys are equal
 */
export function pubkeyEquals(a: PublicKey, b: PublicKey): boolean {
  return a.toBase58() === b.toBase58()
}

/**
 * Clamp a number between a min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
