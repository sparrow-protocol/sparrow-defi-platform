/**
 * Represents a Helius-enhanced transaction,
 * which may include enriched metadata beyond basic Solana transactions.
 */
export interface HeliusEnhancedTransaction {
  signature: string
  timestamp: number // UNIX timestamp (in seconds)
  fee: number       // Transaction fee in lamports
  slot?: number
  success?: boolean
  instructions?: any[] // Decoded instructions if Helius provides
  logs?: string[]
  error?: string | null
  accountData?: Record<string, any>
  // Extend with more Helius-specific fields as needed
}

/**
 * Represents a webhook event payload from Helius.
 * These are sent to your server when specific events occur (e.g., transfer, mint, burn).
 */
export interface HeliusWebhookEvent {
  webhookId: string
  webhookType: string
  events: HeliusParsedEvent[]
  timestamp: number
  reference?: string // Optional identifier for correlating with your system
}

/**
 * Represents an individual parsed event from Helius webhooks.
 * This is generic—consider creating discriminated union types for each `type`.
 */
export interface HeliusParsedEvent {
  type: string                 // E.g., "TRANSFER", "SWAP", "NFT_MINT", etc.
  description?: string
  involvedAccounts: string[]  // Wallets involved
  tokenTransfers?: {
    fromUserAccount: string
    toUserAccount: string
    mint: string
    amount: string
  }[]
  nativeTransfers?: {
    from: string
    to: string
    amount: string
  }[]
  timestamp: number
  signature: string
  // Extend depending on your subscription type
}
