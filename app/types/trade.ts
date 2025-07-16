/**
 * Represents an active or historical trade order (e.g., for a DEX UI).
 */
export interface TradeOrder {
  id: string                     // Unique order ID (e.g., UUID or hash)
  type: "buy" | "sell"          // Buy or sell order
  tokenPair: string             // Format: "SOL/USDC", "ETH/USDT", etc.
  price: number                 // Price per unit of base token
  amount: number                // Quantity of base token to trade
  total: number                 // price * amount, i.e., total in quote token
  status: "open" | "filled" | "cancelled"
  timestamp: number             // UNIX timestamp (in seconds or ms)
}

/**
 * Represents an executed trade (match between two orders).
 */
export interface TradeHistoryEntry {
  id: string                     // Unique trade ID
  tokenPair: string             // Format: "SOL/USDC"
  price: number                 // Execution price
  amount: number                // Amount traded
  type: "buy" | "sell"          // Direction from the perspective of the user
  timestamp: number             // When trade was executed
}
