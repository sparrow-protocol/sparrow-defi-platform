import type { Wallet } from "@privy-io/react-auth"
import { PublicKey } from "@solana/web3.js"

/**
 * Retrieves the Solana public key for a Privy embedded wallet.
 * @param privyWallet The Privy wallet object.
 * @returns The PublicKey of the embedded wallet.
 * @throws Error if the wallet is not a Solana wallet or public address is missing.
 */
export async function getEmbeddedWalletPublicKey(privyWallet: Wallet): Promise<PublicKey> {
  if (privyWallet.chainType !== "solana") {
    throw new Error("Provided wallet is not a Solana wallet.")
  }
  if (!privyWallet.publicAddress) {
    throw new Error("Privy wallet public address is missing.")
  }
  return new PublicKey(privyWallet.publicAddress)
}

/**
 * Signs a message using the Privy embedded wallet.
 * @param privyWallet The Privy wallet object.
 * @param message The message to sign (as a Uint8Array).
 * @returns The signed message as a Uint8Array.
 * @throws Error if signing fails or wallet is not connected.
 */
export async function signMessageWithEmbeddedWallet(privyWallet: Wallet, message: Uint8Array): Promise<Uint8Array> {
  if (!privyWallet.connected) {
    throw new Error("Privy wallet is not connected.")
  }
  if (!privyWallet.signMessage) {
    throw new Error("Privy wallet does not support message signing.")
  }
  const signature = await privyWallet.signMessage(message)
  return new Uint8Array(signature)
}

/**
 * Signs a transaction using the Privy embedded wallet.
 * @param privyWallet The Privy wallet object.
 * @param transaction The transaction to sign (as a base64 string).
 * @returns The signed transaction as a base64 string.
 * @throws Error if signing fails or wallet is not connected.
 */
export async function signTransactionWithEmbeddedWallet(privyWallet: Wallet, transaction: string): Promise<string> {
  if (!privyWallet.connected) {
    throw new Error("Privy wallet is not connected.")
  }
  if (!privyWallet.signTransaction) {
    throw new Error("Privy wallet does not support transaction signing.")
  }
  const signedTx = await privyWallet.signTransaction(transaction)
  return signedTx
}

/**
 * Sends a transaction using the Privy embedded wallet.
 * @param privyWallet The Privy wallet object.
 * @param transaction The transaction to send (as a base64 string).
 * @returns The transaction signature.
 * @throws Error if sending fails or wallet is not connected.
 */
export async function sendTransactionWithEmbeddedWallet(privyWallet: Wallet, transaction: string): Promise<string> {
  if (!privyWallet.connected) {
    throw new Error("Privy wallet is not connected.")
  }
  if (!privyWallet.sendTransaction) {
    throw new Error("Privy wallet does not support sending transactions directly.")
  }
  const signature = await privyWallet.sendTransaction(transaction)
  return signature
}
