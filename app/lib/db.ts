// app/lib/db.ts
import { neon } from "@neondatabase/serverless"

// Ensure DATABASE_URL is set in your environment variables
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in environment variables.")
}

// Create a singleton instance of the Neon client
const sql = neon(databaseUrl)

export { sql }
