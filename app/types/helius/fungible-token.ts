export interface HeliusFungibleToken {
  interface: "FungibleToken" | "FungibleAsset"
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
      symbol: string
      token_standard?: string
    }
    links?: {
      image?: string
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
  token_info?: {
    supply: number
    decimals: number
    token_program: string
    mint_authority?: string
    freeze_authority?: string
    associated_token_address: string
    price_info?: {
      price_per_token: number
      total_price: number
      currency: string
    }
  }
}

export interface HeliusTokenBalance {
  mint: string
  owner: string
  amount: number
  decimals: number
  token_account: string
  frozen: boolean
}

export interface HeliusTokenMetadata {
  mint: string
  name: string
  symbol: string
  description?: string
  image?: string
  external_url?: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
  properties?: {
    files?: Array<{
      uri: string
      type: string
    }>
    category?: string
  }
}
