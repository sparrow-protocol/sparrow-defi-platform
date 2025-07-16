// app/types/helius.ts
// Placeholder for Helius specific types if needed for more advanced features
// For basic RPC, standard @solana/web3.js types are sufficient.

export interface HeliusEnhancedTransaction {
  // Example: Helius's enhanced transaction details
  signature: string
  timestamp: number
  fee: number
  // ... other Helius specific fields
}

export interface HeliusWebhookEvent {
  // Example: Helius webhook payload structure
  webhookId: string
  events: any[]
  // ...
}
