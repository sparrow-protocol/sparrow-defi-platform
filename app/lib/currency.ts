import { LAMPORTS_PER_SOL } from "@solana/web3.js"

export function formatCurrency(amount: number | null | undefined, decimals = 2, symbol = "$"): string {
  if (amount === null || amount === undefined) {
    return `${symbol}0.00`
  }
  return `${symbol}${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export function formatTokenAmount(amount: number | null | undefined, decimals: number): string {
  if (amount === null || amount === undefined) {
    return "0"
  }
  return amount.toFixed(decimals)
}

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL
}

export function solToLamports(sol: number): number {
  return sol * LAMPORTS_PER_SOL
}
