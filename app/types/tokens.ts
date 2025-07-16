// app/types/tokens.ts
export interface Token {
  symbol: string
  name: string
  mint: string
  icon: string // Changed from 'logoURI' to 'icon' for consistency with local usage
  decimals: number // Add decimals for amount calculations
  logoURI?: string // Keep original logoURI if needed
}
