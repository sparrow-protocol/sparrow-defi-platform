import { type NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { jupiterApi } from "@/app/lib/jupiter/jupiter"
import { PLATFORM_FEE_ACCOUNT, PLATFORM_FEE_BPS } from "@/app/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const { inputMint, outputMint, outputAmount, slippageBps, userPublicKey, merchantRecipientAddress } =
      await req.json()

    if (!inputMint || !outputMint || !outputAmount || !slippageBps) {
      return NextResponse.json({ error: "Missing required parameters for quote" }, { status: 400 })
    }

    // Step 1: Get the ExactOut quote from Jupiter
    const quote = await jupiterApi.getQuote(
      inputMint,
      outputMint,
      outputAmount,
      slippageBps,
      "ExactOut",
      PLATFORM_FEE_BPS,
      PLATFORM_FEE_ACCOUNT,
    )

    if (!quote) {
      return NextResponse.json({ error: "Failed to get Jupiter ExactOut quote" }, { status: 500 })
    }

    // If only quote is requested (e.g., for display), return it
    if (!userPublicKey || !merchantRecipientAddress) {
      return NextResponse.json({ quoteResponse: quote })
    }

    // Step 2: Get the swap transaction if userPublicKey and merchantRecipientAddress are provided
    const swapTransaction = await jupiterApi.getSwapTransaction(
      quote,
      new PublicKey(userPublicKey),
      true, // wrapUnwrapSOL
      new PublicKey(merchantRecipientAddress), // This is where the merchant receives the exact amount
    )

    if (!swapTransaction) {
      return NextResponse.json({ error: "Failed to get Jupiter ExactOut swap transaction" }, { status: 500 })
    }

    return NextResponse.json({ swapTransaction })
  } catch (error: any) {
    console.error("Error in Jupiter ExactOut Swap API:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
