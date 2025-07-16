export interface TokenInfo {
  name: string
  symbol: string
  address: string
  decimals: number
  logoURI?: string
  coingeckoId?: string
  coinmarketcapId?: number //
  tags?: string[]
  extensions?: {
    website?: string
    twitter?: string
    cmcSlug?: string
    [key: string]: any
  }
  isNative?: boolean
  chainId?: number
  birdeye?: BirdeyeTokenData
  coinmarketcap?: CoinMarketCapTokenData
  jupiterSource?: boolean
}

export interface BirdeyeTokenData {
  id: string
  price?: number
  priceChange24h?: number
  volume24h?: number
  marketCap?: number
  liquidity?: number
  updatedAt?: number
}

export interface CoinMarketCapTokenData {
  priceUsd: number
  percentChange24h: number
  marketCapUsd: number
  volume24hUsd: number
  rank: number
  lastUpdated: string
}
