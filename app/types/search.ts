export interface SearchResult {
  type: "token" | "address" | "transaction" | "pool"
  id: string
  name?: string
  symbol?: string
  icon?: string
}
