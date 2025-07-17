export interface HeliusNonFungibleToken {
  interface: "NonFungibleToken" | "ProgrammableNFT" | "NonFungible"
  id: string
  content?: {
    $schema: string
    json_uri: string
    files?: Array<{
      uri: string
      cdn_uri?: string
      mime: string
    }>
    metadata: {
      description?: string
      name: string
      symbol?: string
      attributes?: Array<{
        trait_type: string
        value: string | number
      }>
    }
    links?: {
      image?: string
      animation_url?: string
      external_url?: string
    }
  }
  authorities?: Array<{
    address: string
    scopes: string[]
  }>
  compression?: {
    eligible: boolean
    compressed: boolean
    data_hash?: string
    creator_hash?: string
    asset_hash?: string
    tree?: string
    seq?: number
    leaf_id?: number
  }
  grouping?: Array<{
    group_key: string
    group_value: string
  }>
  royalty?: {
    royalty_model: string
    target?: string
    percent: number
    basis_points: number
    primary_sale_happened: boolean
    locked: boolean
  }
  creators?: Array<{
    address: string
    share: number
    verified: boolean
  }>
  ownership: {
    frozen: boolean
    delegated: boolean
    delegate?: string
    ownership_model: string
    owner: string
  }
  supply?: {
    print_max_supply?: number
    print_current_supply?: number
    edition_nonce?: number
  }
  mutable: boolean
  burnt: boolean
}

export interface HeliusNFTCollection {
  id: string
  name: string
  symbol?: string
  description?: string
  image?: string
  external_url?: string
  verified: boolean
  floor_price?: number
  total_supply?: number
  holders?: number
  listed_count?: number
  avg_price_24h?: number
  volume_24h?: number
}

export interface HeliusNFTActivity {
  signature: string
  type: "SALE" | "LIST" | "DELIST" | "TRANSFER" | "MINT" | "BURN"
  source: string
  timestamp: number
  slot: number
  buyer?: string
  seller?: string
  price?: number
  marketplace?: string
  nft: {
    mint: string
    name: string
    image?: string
  }
}
