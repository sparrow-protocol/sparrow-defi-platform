// app/api/solana-pay/route.ts
import { NextResponse } from "next/server"
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { createTransferCheckedInstruction, getAssociatedTokenAddressSync, getMint } from "@solana/spl-token"
import type { SolanaPayTransactionRequest } from "@/app/types/solana-pay"

// Use Helius RPC if available, otherwise default Solana RPC
const HELIUS_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com"
const connection = new Connection(HELIUS_RPC_URL, "confirmed")

export async function POST(request: Request) {
  try {
    const { recipient, amount, splToken, reference, label, message, memo } =
      (await request.json()) as SolanaPayTransactionRequest

    if (!recipient || !amount) {
      return NextResponse.json({ error: "Missing recipient or amount" }, { status: 400 })
    }

    let recipientPubKey: PublicKey
    try {
      recipientPubKey = new PublicKey(recipient)
    } catch (e) {
      console.error("Invalid recipient public key:", recipient, e)
      return NextResponse.json({ error: "Invalid recipient public key format." }, { status: 400 })
    }

    // Placeholder payer, will be replaced by wallet during signing
    // For transaction creation, we use a dummy payer. The actual payer signs later.
    const dummyPayer = new PublicKey("11111111111111111111111111111111")

    const transaction = new Transaction()

    if (splToken) {
      // SPL Token transfer
      let mintPubKey: PublicKey
      try {
        mintPubKey = new PublicKey(splToken)
      } catch (e) {
        console.error("Invalid SPL token mint public key:", splToken, e)
        return NextResponse.json({ error: "Invalid SPL token mint public key format." }, { status: 400 })
      }

      const mintInfo = await getMint(connection, mintPubKey)
      const amountInSmallestUnits = Math.round(amount * Math.pow(10, mintInfo.decimals))

      // These ATAs are for the *sender* and *recipient*.
      // The sender's ATA will be derived from the actual sender's public key during wallet interaction.
      // For now, we use the dummyPayer for the sender's ATA derivation in the instruction.
      const senderTokenAccount = getAssociatedTokenAddressSync(mintPubKey, dummyPayer, true) // allowOwnerOffCurve: true for dummy
      const recipientTokenAccount = getAssociatedTokenAddressSync(mintPubKey, recipientPubKey, true) // allowOwnerOffCurve: true for dummy

      transaction.add(
        createTransferCheckedInstruction(
          senderTokenAccount,
          mintPubKey,
          recipientTokenAccount,
          dummyPayer, // This would be the sender's public key when signed
          amountInSmallestUnits,
          mintInfo.decimals,
        ),
      )
    } else {
      // SOL transfer
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: dummyPayer, // This would be the sender's public key when signed
          toPubkey: recipientPubKey,
          lamports: Math.round(amount * LAMPORTS_PER_SOL),
        }),
      )
    }

    // Add optional references, label, message, memo
    // Solana Pay references are typically added as instruction keys or in a memo.
    // For simplicity and broad compatibility, we'll primarily rely on the URL parameters for Solana Pay.
    // If a memo is provided, add it as a separate instruction.
    if (memo) {
      // Note: Memo program ID is fixed.
      transaction.add(
        new Transaction({
          recentBlockhash: "11111111111111111111111111111111", // Placeholder, will be replaced
          feePayer: dummyPayer, // Placeholder, will be replaced
        }).add(SystemProgram.memo({ memo })).instructions[0], // Extract the instruction
      )
    }

    // Set recent blockhash and fee payer (will be overridden by wallet)
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = dummyPayer

    // Serialize the transaction for Solana Pay URL
    // requireAllSignatures: false because the sender hasn't signed yet.
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false, verifySignatures: false })
    const transactionBase64 = serializedTransaction.toString("base64")

    // Construct the Solana Pay URL
    const solanaPayUrl = new URL(`solana:${recipientPubKey.toBase58()}`)
    solanaPayUrl.searchParams.append("amount", amount.toString())
    if (splToken) {
      solanaPayUrl.searchParams.append("spl-token", splToken.toBase58())
    }
    if (label) {
      solanaPayUrl.searchParams.append("label", label)
    }
    if (message) {
      solanaPayUrl.searchParams.append("message", message)
    }
    if (reference && reference.length > 0) {
      reference.forEach((ref) => solanaPayUrl.searchParams.append("reference", ref.toBase58()))
    }

    return NextResponse.json({ solanaPayUrl: solanaPayUrl.toString(), transaction: transactionBase64 }, { status: 200 })
  } catch (error: any) {
    console.error("Failed to create Solana Pay transaction:", error)
    // Provide a more generic error message to the client for security/simplicity
    return NextResponse.json({ error: error.message || "Failed to create Solana Pay transaction" }, { status: 500 })
  }
}
