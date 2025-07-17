/**
 * Represents a Helius-enhanced transaction,
 * which may include enriched metadata beyond basic Solana transactions.
 */
export interface HeliusEnhancedTransaction {
  signature: string
  timestamp: number // UNIX timestamp (in seconds)
  fee: number // Transaction fee in lamports
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
  type: string // E.g., "TRANSFER", "SWAP", "NFT_MINT", etc.
  description?: string
  involvedAccounts: string[] // Wallets involved
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

export interface HeliusAsset {
  interface: string // e.g., "FungibleToken", "NonFungibleToken"
  id: string // Mint address
  content?: {
    json_uri?: string
    metadata?: {
      name?: string
      symbol?: string
      description?: string
      image?: string
      external_url?: string
      attributes?: Array<{
        trait_type: string
        value: string | number
      }>
    }
    links?: {
      image?: string
    }
  }
  ownership?: {
    owner?: string
    delegate?: string
    frozen?: boolean
  }
  token_info?: {
    supply?: number
    decimals?: number
    token_program?: string
    associated_token_address?: string
    price_info?: {
      price_per_token?: number
      total_price?: number
      currency?: string
    }
  }
  royalty?: {
    basis_points?: number
  }
  creators?: Array<{
    address: string
    share: number
    verified: boolean
  }>
  grouping?: Array<{
    group_key: string
    group_value: string
  }>
}

export interface HeliusGetAssetsByOwnerResponse {
  jsonrpc: string
  id: string
  result: {
    total: number
    limit: number
    page: number
    items: HeliusAsset[]
  }
}

export interface HeliusGetTokenAccountsResponse {
  jsonrpc: string
  id: string
  result: {
    context: {
      slot: number
    }
    value: Array<{
      account: string // Token account address
      mint: string // Token mint address
      owner: string // Owner of the token account
      amount: number // Raw token amount
      decimals: number
      frozen: boolean
      token_program: string
      associated_token_address?: string
    }>
  }
}

export interface HeliusTransaction {
  signature: string
  timestamp: number
  type: string // e.g., "TRANSFER", "SWAP"
  source: string // e.g., "SYSTEM_PROGRAM", "JUPITER"
  fee: number
  feePayer: string
  blockTime: number
  slot: number
  nativeTransfers?: Array<{
    fromUserAccount: string
    toUserAccount: string
    amount: number
  }>
  tokenTransfers?: Array<{
    fromUserAccount?: string
    toUserAccount?: string
    mint: string
    tokenAmount: number
    tokenStandard: string
  }>
  events?: {
    swap?: {
      nativeInput: {
        amount: number
        mint: string
      }
      nativeOutput: {
        amount: number
        mint: string
      }
      tokenInput?: {
        amount: number
        mint: string
      }
      tokenOutput?: {
        amount: number
        mint: string
      }
      tokenFees?: Array<{
        amount: number
        mint: string
      }>
      solFees?: number
      innerSwaps?: any[]
      referrer?: string
    }
    nft?: any
  }
  // ... other fields from Helius parsed transactions
}
