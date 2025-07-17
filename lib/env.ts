import { z } from "zod"

export const envSchema = z.object({
  NEXT_PUBLIC_JUPITER_API_URL: z.string().url(),
  NEXT_PUBLIC_SOLANA_RPC_1: z.string().url(),
  // ... other keys
})

export const env = envSchema.parse(process.env)
