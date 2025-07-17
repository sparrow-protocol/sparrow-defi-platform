import type { PublicKey, Transaction } from "@solana/web3.js"
import type { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  PhantomWalletAdapter as PhantomWallet,
  SolflareWalletAdapter as SolflareWallet,
  BackpackWalletAdapter,
  GlowWalletAdapter,
  SlopeWalletAdapter,
  SolletWalletAdapter,
  MathWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"

export interface WalletAdapter {
  name: string
  icon: string
  url: string
  connect(): Promise<void>
  disconnect(): Promise<void>
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
  publicKey: PublicKey | null
  connected: boolean
}

export const getWalletAdapters = (network: WalletAdapterNetwork) => {
  const endpoint = clusterApiUrl(network)

  return [
    new PhantomWallet(),
    new SolflareWallet(),
    new BackpackWalletAdapter(),
    new GlowWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolletWalletAdapter(),
    new MathWalletAdapter(),
    new LedgerWalletAdapter(),
    new TorusWalletAdapter(),
  ]
}
