import { type NextRequest, NextResponse } from "next/server"
import { createTransferInstruction, getAssociatedTokenAddressSync, getAccount } from "@solana/spl-token"
import {
  Connection,
  PublicKey,
  SystemProgram,
  type Transaction,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js"
import { RPC_URLS, SPL_TOKEN_PROGRAM_ID } from "@/app/lib/constants"
import { validateSolanaPayTransaction } from "@/app/lib/solana/solana-pay"

const connection = new Connection(RPC_URLS[0], "confirmed")

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const recipient = searchParams.get("recipient")
    const amount = searchParams.get("amount")
    const splToken = searchParams.get("spl-token")
    const reference = searchParams.get("reference")
    const label = searchParams.get("label")
    const message = searchParams.get("message")

    if (!recipient) {
      return NextResponse.json({ error: "Recipient address is required" }, { status: 400 })
    }

    const recipientPublicKey = new PublicKey(recipient)
    let transaction: Transaction | VersionedTransaction

    if (splToken) {
      // SPL Token transfer
      const tokenMint = new PublicKey(splToken)
      const recipientATA = getAssociatedTokenAddressSync(tokenMint, recipientPublicKey, false, SPL_TOKEN_PROGRAM_ID)

      // Check if recipient ATA exists, if not, the payer will need to create it
      // For Solana Pay, the merchant usually ensures the ATA exists or handles its creation.
      // For simplicity, we assume it exists for now.
      try {
        await getAccount(connection, recipientATA, "confirmed", SPL_TOKEN_PROGRAM_ID)
      } catch (e) {
        console.warn(`Recipient ATA for ${splToken} does not exist for ${recipient}.`)
        // In a real app, you might return an error or provide instructions for ATA creation.
        return NextResponse.json(
          { error: "Recipient token account not found. Please create it first." },
          { status: 400 },
        )
      }

      const transferAmount = amount ? Number.parseFloat(amount) * Math.pow(10, 6) : 0 // Assuming 6 decimals for common tokens like USDC/USDT
      if (transferAmount <= 0) {
        return NextResponse.json({ error: "Invalid SPL token amount" }, { status: 400 })
      }

      const ix = createTransferInstruction(
        // Placeholder: Payer's ATA will be determined by the wallet signing the transaction
        // This is a dummy source, the wallet will replace it with the actual source ATA
        getAssociatedTokenAddressSync(
          tokenMint,
          new PublicKey("11111111111111111111111111111111"),
          false,
          SPL_TOKEN_PROGRAM_ID,
        ),
        recipientATA,
        new PublicKey("11111111111111111111111111111111"), // Dummy owner, replaced by wallet
        transferAmount,
        [],
        SPL_TOKEN_PROGRAM_ID,
      )

      // Solana Pay requires a transaction to be returned, which the wallet will then sign.
      // The payer will be set by the wallet.
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized")
      const transactionMessage = new TransactionMessage({
        payerKey: new PublicKey("11111111111111111111111111111111"), // Dummy payer, replaced by wallet
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToLegacyMessage()

      transaction = new VersionedTransaction(transactionMessage)
    } else {
      // SOL transfer
      const solAmount = amount ? Number.parseFloat(amount) : 0
      if (solAmount <= 0) {
        return NextResponse.json({ error: "Invalid SOL amount" }, { status: 400 })
      }

      const ix = SystemProgram.transfer({
        fromPubkey: new PublicKey("11111111111111111111111111111111"), // Dummy payer, replaced by wallet
        toPubkey: recipientPublicKey,
        lamports: solAmount * LAMPORTS_PER_SOL,
      })

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized")
      const transactionMessage = new TransactionMessage({
        payerKey: new PublicKey("11111111111111111111111111111111"), // Dummy payer, replaced by wallet
        recentBlockhash: blockhash,
        instructions: [ix],
      }).compileToLegacyMessage()

      transaction = new VersionedTransaction(transactionMessage)
    }

    // Serialize the transaction for the response
    const serializedTransaction = Buffer.from(transaction.serialize()).toString("base64")

    return NextResponse.json({
      transaction: serializedTransaction,
      message: message || "Payment Request",
    })
  } catch (error: any) {
    console.error("Error generating Solana Pay transaction:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { account, transaction, message, signature } = await req.json()

    if (!account || !transaction || !signature) {
      return NextResponse.json({ error: "Missing required parameters for transaction validation" }, { status: 400 })
    }

    const isValid = await validateSolanaPayTransaction(connection, new PublicKey(account), transaction, signature)

    if (isValid) {
      return NextResponse.json({ message: "Transaction validated successfully!" })
    } else {
      return NextResponse.json({ error: "Transaction validation failed." }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error validating Solana Pay transaction:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
