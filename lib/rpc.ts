export const getRpcUrl = () => {
  return (
    process.env.NEXT_PUBLIC_HELIUS_RPC_URL ||
    process.env.NEXT_PUBLIC_SOLANA_RPC_1 ||
    process.env.NEXT_PUBLIC_SOLANA_RPC_2 ||
    process.env.NEXT_PUBLIC_SOLANA_RPC_3
  )
}
