// app/api/jupiter-exact-out-swap/route.ts
import { NextResponse } from "next/server"
import { JUPITER_API_BASE_URL } from "@/app/lib/constants"
import type { JupiterQuoteResponse } from "@/app/types/api"
import { PublicKey } from "@solana/web3.js"
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"

export async function POST(request: Request) {
  try {
    const {
      inputMint,
      outputMint,
      outputAmount, // This is the exact amount the merchant wants to receive
      slippageBps,
      userPublicKey, // Customer's public key
      merchantRecipientAddress, // Merchant's public key
    } = await request.json()

    if (!inputMint || !outputMint || !outputAmount || !userPublicKey || !merchantRecipientAddress) {
      return NextResponse.json({ error: "Missing required parameters for ExactOut swap." }, { status: 400 })
    }

    // 1. Get ExactOut Quote
    const quoteUrl = `${JUPITER_API_BASE_URL}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${outputAmount}&slippageBps=${slippageBps}&swapMode=ExactOut`
    console.log("Fetching ExactOut quote from:", quoteUrl)
    const quoteResponse = await fetch(quoteUrl)

    if (!quoteResponse.ok) {
      const errorText = await quoteResponse.text()
      console.error(`Error fetching ExactOut quote: ${quoteResponse.statusText}. Details: ${errorText}`)
      return NextResponse.json(
        { error: `Failed to get ExactOut quote: ${quoteResponse.statusText}. ${errorText}` },
        { status: quoteResponse.status },
      )
    }
    const quote: JupiterQuoteResponse = await quoteResponse.json()

    if (!quote || !quote.inAmount || !quote.outAmount) {
      return NextResponse.json({ error: "Invalid quote response from Jupiter." }, { status: 500 })
    }

    // 2. Determine destinationTokenAccount for the merchant
    let destinationTokenAccount: PublicKey
    try {
      const merchantPubKey = new PublicKey(merchantRecipientAddress)
      const outputMintPubKey = new PublicKey(outputMint)

      // For SOL, the destination is the merchant's public key directly
      if (outputMint === "So11111111111111111111111111111111111111112") {
        destinationTokenAccount = merchantPubKey
      } else {
        // For SPL tokens, get or derive the associated token account
        destinationTokenAccount = getAssociatedTokenAddressSync(
          outputMintPubKey,
          merchantPubKey,
          true, // allowOwnerOffCurve: true if merchantPubKey is not a PDA
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        )
      }
    } catch (e: any) {
      console.error("Error deriving destinationTokenAccount:", e)
      return NextResponse.json(
        { error: `Invalid merchant recipient address or output mint: ${e.message}` },
        { status: 400 },
      )
    }

    // 3. Get serialized swap transaction
    const swapUrl = `${JUPITER_API_BASE_URL}/swap`
    const swapBody = {
      quoteResponse: quote,
      userPublicKey: userPublicKey, // Customer's public key
      destinationTokenAccount: destinationTokenAccount.toBase58(), // Merchant's token account
      wrapUnwrapSOL: true, // Automatically wrap/unwrap SOL for the customer
    }
    console.log("Fetching ExactOut swap transaction with body:", JSON.stringify(swapBody, null, 2))

    const swapTransactionResponse = await fetch(swapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(swapBody),
    })

    if (!swapTransactionResponse.ok) {
      const errorText = await swapTransactionResponse.text()
      console.error(
        `Error fetching ExactOut swap transaction: ${swapTransactionResponse.statusText}. Details: ${errorText}`,
      )
      return NextResponse.json(
        { error: `Failed to get ExactOut swap transaction: ${swapTransactionResponse.statusText}. ${errorText}` },
        { status: swapTransactionResponse.status },
      )
    }
    const swapData = await swapTransactionResponse.json()

    return NextResponse.json(swapData, { status: 200 })
  } catch (error: any) {
    console.error("Failed to process ExactOut swap request:", error)
    return NextResponse.json(
      { error: error.message || "An unexpected server error occurred during ExactOut swap." },
      { status: 500 },
    )
  }
}
