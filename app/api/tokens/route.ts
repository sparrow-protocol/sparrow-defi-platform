// app/api/tokens/route.ts
import { NextResponse } from "next/server"
import type { Token } from "@/app/types/tokens"
import { createRateLimiter, canCall, getRemainingTime } from "@/app/lib/rate-limit"
import { JUPITER_TOKEN_LIST_URL, SOLANA_LABS_TOKEN_LIST_URL } from "@/app/lib/constants"

// Create a rate limiter for token list fetching
const tokenListLimiter = createRateLimiter("token-list-fetch", { intervalMs: 5000, maxCalls: 1 }) // 1 call every 5 seconds

export async function GET() {
  try {
    if (!canCall("token-list-fetch")) {
      const timeLeft = getRemainingTime("token-list-fetch")
      return NextResponse.json(
        { error: `Rate limit exceeded. Please wait ${Math.ceil(timeLeft / 1000)} seconds.` },
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
          `Jupiter API failed: Status ${jupiterResponse.status} - ${jupiterResponse.statusText}. Details: ${errorText.substring(0, 200)}...`,
        )
      }
      tokens = await jupiterResponse.json()
      console.log("Successfully fetched tokens from Jupiter. Number of tokens:", tokens.length)
      // If successful, return immediately
      return NextResponse.json(
        tokens.map((token) => ({
          ...token,
          icon: token.icon || token.logoURI || "/placeholder.svg?height=24&width=24",
        })),
      )
    } catch (error: any) {
      jupiterError = error.message
      console.warn(`Jupiter fetch failed: ${jupiterError}. Attempting fallback to Solana Labs...`)
    }

    // Attempt 2: Solana Labs (only if Jupiter failed)
    try {
      console.log("Attempting to fetch tokens from Solana Labs...")
      const solanaLabsResponse = await fetch(SOLANA_LABS_TOKEN_LIST_URL)
      if (!solanaLabsResponse.ok) {
        const errorText = await solanaLabsResponse.text()
        throw new Error(
          `Solana Labs API failed: Status ${solanaLabsResponse.status} - ${solanaLabsResponse.statusText}. Details: ${errorText.substring(0, 200)}...`,
        )
      }
      const solanaLabsData = await solanaLabsResponse.json()
      if (solanaLabsData && Array.isArray(solanaLabsData.tokens)) {
        tokens = solanaLabsData.tokens.map((token: any) => ({
          symbol: token.symbol,
          name: token.name,
          mint: token.address, // Solana Labs uses 'address' for mint
          icon: token.logoURI || "/placeholder.svg?height=24&width=24",
          decimals: token.decimals,
          logoURI: token.logoURI,
        }))
        console.log("Successfully fetched tokens from Solana Labs. Number of tokens:", tokens.length)
        // If successful, return immediately
        return NextResponse.json(
          tokens.map((token) => ({
            ...token,
            icon: token.icon || token.logoURI || "/placeholder.svg?height=24&width=24",
          })),
        )
      } else {
        throw new Error("Invalid data format from Solana Labs token list.")
      }
    } catch (error: any) {
      solanaLabsError = error.message
      console.error(`Solana Labs fetch failed: ${solanaLabsError}.`)
    }

    // If both attempts failed
    const errorMessage = `Failed to fetch tokens from all sources. Jupiter error: [${jupiterError || "N/A"}]. Solana Labs error: [${solanaLabsError || "N/A"}].`
    console.error("Final token fetch error:", errorMessage) // Added this log for debugging
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  } catch (error: any) {
    console.error("Unexpected error in token API route:", error)
    return NextResponse.json({ error: error.message || "An unexpected server error occurred." }, { status: 500 })
  }
}
