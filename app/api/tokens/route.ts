import { NextResponse } from "next/server"
import type { Token } from "@/app/types/tokens"
import {
  createRateLimiter,
  canCall,
  getRemainingTime,
} from "@/app/lib/rate-limit"
import {
  JUPITER_TOKEN_LIST_URL,
  SOLANA_LABS_TOKEN_LIST_URL,
} from "@/app/lib/constants"

// Rate limiter: 1 call every 5 seconds
const tokenListLimiter = createRateLimiter("token-list-fetch", {
  intervalMs: 5000,
  maxCalls: 1,
})

function normalizeTokens(tokens: any[]): Token[] {
  return tokens.map((token) => ({
    address: token.address || token.mint,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
    icon: token.icon || token.logoURI || "/placeholder.svg?height=24&width=24",
    tags: token.tags || [],
    isVerified: token.isVerified ?? true,
    organicScore: token.organicScore,
    usdPrice: token.usdPrice,
  }))
}

export async function GET() {
  try {
    if (!canCall("token-list-fetch")) {
      const timeLeft = getRemainingTime("token-list-fetch")
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please wait ${Math.ceil(
            timeLeft / 1000,
          )} seconds.`,
        },
        { status: 429 },
      )
    }

    let tokens: Token[] = []
    let jupiterError: string | null = null
    let solanaLabsError: string | null = null

    // Attempt 1: Jupiter
    try {
      console.log("Attempting to fetch tokens from Jupiter...")
      const jupiterResponse = await fetch(JUPITER_TOKEN_LIST_URL)
      if (!jupiterResponse.ok) {
        const errorText = await jupiterResponse.text()
        throw new Error(
          `Jupiter API failed: Status ${jupiterResponse.status} - ${jupiterResponse.statusText}. Details: ${errorText.substring(
            0,
            200,
          )}...`,
        )
      }
      const jupiterData = await jupiterResponse.json()
      tokens = normalizeTokens(jupiterData)
      console.log("Fetched tokens from Jupiter:", tokens.length)
      return NextResponse.json(tokens, {
        status: 200,
        headers: { "Cache-Control": "public, max-age=60" },
      })
    } catch (err: any) {
      jupiterError = err.message
      console.warn("Jupiter fetch failed:", jupiterError)
    }

    // Attempt 2: Solana Labs
    try {
      console.log("Attempting to fetch tokens from Solana Labs...")
      const solanaResponse = await fetch(SOLANA_LABS_TOKEN_LIST_URL)
      if (!solanaResponse.ok) {
        const errorText = await solanaResponse.text()
        throw new Error(
          `Solana Labs API failed: Status ${solanaResponse.status} - ${solanaResponse.statusText}. Details: ${errorText.substring(
            0,
            200,
          )}...`,
        )
      }
      const solanaData = await solanaResponse.json()
      if (!Array.isArray(solanaData.tokens)) {
        throw new Error("Invalid Solana Labs token list format.")
      }
      tokens = normalizeTokens(solanaData.tokens)
      console.log("Fetched tokens from Solana Labs:", tokens.length)
      return NextResponse.json(tokens, {
        status: 200,
        headers: { "Cache-Control": "public, max-age=60" },
      })
    } catch (err: any) {
      solanaLabsError = err.message
      console.error("Solana Labs fetch failed:", solanaLabsError)
    }

    // Both failed
    const finalError = `Failed to fetch tokens from all sources.\nJupiter: ${jupiterError || "N/A"}\nSolana Labs: ${solanaLabsError || "N/A"}`
    console.error(finalError)
    return NextResponse.json({ error: finalError }, { status: 500 })
  } catch (err: any) {
    console.error("Unexpected token API error:", err)
    return NextResponse.json(
      { error: err.message || "An unexpected server error occurred." },
      { status: 500 },
    )
  }
}
