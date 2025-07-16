import {
  Connection,
  PublicKey,
  TransactionInstruction,
  Keypair,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js"

/**
 * Create a VersionedTransaction and sign it with provided keypairs.
 */
export async function createAndSignTransaction(
  connection: Connection,
  payer: PublicKey,
  instructions: TransactionInstruction[],
  signers: Keypair[],
): Promise<VersionedTransaction> {
  console.log("Creating and signing transaction...")

  const { blockhash } = await connection.getLatestBlockhash()

  const message = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message()

  const versionedTx = new VersionedTransaction(message)

  versionedTx.sign(signers)

  return versionedTx
}
