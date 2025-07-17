import {
  Connection,
  type PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  type TransactionInstruction,
  ComputeBudgetProgram,
  VersionedTransaction,
  TransactionMessage,
  type BlockhashWithExpiryBlockHeight,
} from "@solana/web3.js"
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  createTransferInstruction,
  getAccount,
} from "@solana/spl-token"
import { RPC_URLS, SPL_TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@/app/lib/constants"
import { rpcService } from "@/app/lib/solana/rpc-service"

// Helper to get a connection instance
const getConnection = () => new Connection(RPC_URLS[0], "confirmed")

/**
 * Creates a new associated token account for a given mint and owner.
 * @param payer The public key of the account that will pay for the transaction.
 * @param owner The public key of the owner of the new associated token account.
 * @param mint The public key of the token mint.
 * @returns The instruction to create the associated token account.
 */
export function createAssociatedTokenAccountIx(
  payer: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
): TransactionInstruction {
  return createAssociatedTokenAccountInstruction(
    payer,
    getAssociatedTokenAddressSync(mint, owner),
    owner,
    mint,
    SPL_TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )
}

/**
 * Creates a transfer instruction for SPL tokens.
 * @param source The public key of the source token account.
 * @param destination The public key of the destination token account.
 * @param owner The public key of the owner of the source token account.
 * @param amount The amount of tokens to transfer (in smallest units).
 * @param mint The public key of the token mint.
 * @returns The instruction to transfer tokens.
 */
export function createSplTransferIx(
  source: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
  amount: number,
  mint: PublicKey,
): TransactionInstruction {
  return createTransferInstruction(
    source,
    destination,
    owner,
    amount,
    [], // Signers, if any additional are needed
    SPL_TOKEN_PROGRAM_ID,
  )
}

/**
 * Creates a SOL transfer instruction.
 * @param from The public key of the sender.
 * @param to The public key of the recipient.
 * @param amount The amount of SOL to transfer (in SOL, will be converted to lamports).
 * @returns The instruction to transfer SOL.
 */
export function createSolTransferIx(from: PublicKey, to: PublicKey, amount: number): TransactionInstruction {
  return SystemProgram.transfer({
    fromPubkey: from,
    toPubkey: to,
    lamports: amount * LAMPORTS_PER_SOL,
  })
}

/**
 * Adds a compute budget instruction to a transaction.
 * This can help with transaction reliability on congested networks.
 * @param units The desired compute units.
 * @param microLamports The desired micro-lamports per compute unit.
 * @returns An array of compute budget instructions.
 */
export function createComputeBudgetIxs(units: number, microLamports: number): TransactionInstruction[] {
  return [
    ComputeBudgetProgram.setComputeUnitLimit({ units }),
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports }),
  ]
}

/**
 * Fetches the balance of a token account.
 * @param accountPublicKey The public key of the token account.
 * @returns The token amount as a number, or null if the account is not found.
 */
export async function getTokenAccountBalance(accountPublicKey: PublicKey): Promise<number | null> {
  try {
    const accountInfo = await getAccount(getConnection(), accountPublicKey, "confirmed", SPL_TOKEN_PROGRAM_ID)
    return Number(accountInfo.amount) / Math.pow(10, accountInfo.decimals)
  } catch (error) {
    console.error(`Error fetching token account balance for ${accountPublicKey.toBase58()}:`, error)
    return null
  }
}

/**
 * Fetches the SOL balance of a public key.
 * @param publicKey The public key to check.
 * @returns The SOL balance as a number.
 */
export async function getSolBalance(publicKey: PublicKey): Promise<number> {
  try {
    const lamports = await rpcService.getBalance(publicKey)
    return lamports / LAMPORTS_PER_SOL
  } catch (error) {
    console.error(`Error fetching SOL balance for ${publicKey.toBase58()}:`, error)
    return 0
  }
}

/**
 * Builds a VersionedTransaction from a list of instructions.
 * @param payer The public key of the account that will pay for the transaction.
 * @param instructions An array of TransactionInstruction objects.
 * @returns A VersionedTransaction object.
 */
export async function buildVersionedTransaction(
  payer: PublicKey,
  instructions: TransactionInstruction[],
): Promise<VersionedTransaction> {
  const connection = getConnection()
  const blockhash = await connection.getLatestBlockhash("finalized")

  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash.blockhash,
    instructions,
  }).compileToLegacyMessage() // Use compileToLegacyMessage for now for broader compatibility

  return new VersionedTransaction(messageV0)
}

/**
 * Creates a SOL transfer transaction.
 * @param from The public key of the sender.
 * @param to The public key of the recipient.
 * @param amount The amount of SOL to transfer (in SOL).
 * @returns A VersionedTransaction object.
 */
export async function createSolTransferTransaction(
  from: PublicKey,
  to: PublicKey,
  amount: number,
): Promise<VersionedTransaction> {
  const instructions = [createSolTransferIx(from, to, amount)]
  return buildVersionedTransaction(from, instructions)
}

/**
 * Creates an SPL token transfer transaction.
 * @param payer The public key of the account that will pay for the transaction.
 * @param sourceTokenAccount The public key of the source token account.
 * @param destinationTokenAccount The public key of the destination token account.
 * @param owner The public key of the owner of the source token account.
 * @param amount The amount of tokens to transfer (in smallest units).
 * @param mint The public key of the token mint.
 * @returns A VersionedTransaction object.
 */
export async function createSplTransferTransaction(
  payer: PublicKey,
  sourceTokenAccount: PublicKey,
  destinationTokenAccount: PublicKey,
  owner: PublicKey,
  amount: number,
  mint: PublicKey,
): Promise<VersionedTransaction> {
  const instructions = [createSplTransferIx(sourceTokenAccount, destinationTokenAccount, owner, amount, mint)]
  return buildVersionedTransaction(payer, instructions)
}

/**
 * Gets the latest blockhash and last valid block height.
 * @returns An object containing the blockhash and last valid block height.
 */
export async function getLatestBlockhashAndHeight(): Promise<BlockhashWithExpiryBlockHeight> {
  const connection = getConnection()
  return connection.getLatestBlockhash("finalized")
}

/**
 * Sends a raw transaction to the network.
 * @param rawTransaction The raw transaction as a Buffer.
 * @returns The transaction signature.
 */
export async function sendRawTransaction(rawTransaction: Buffer): Promise<string> {
  return rpcService.sendRawTransaction(rawTransaction)
}

/**
 * Confirms a transaction on the network.
 * @param signature The transaction signature to confirm.
 * @param commitment The commitment level for confirmation.
 * @returns True if the transaction is confirmed, false otherwise.
 */
export async function confirmTransaction(
  signature: string,
  commitment: "confirmed" | "finalized" = "confirmed",
): Promise<boolean> {
  return rpcService.confirmTransaction(signature, commitment)
}
