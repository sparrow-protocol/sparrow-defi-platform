import { Pool, neon } from "@neondatabase/serverless"

// This is a simple example for connecting to Neon.
// In a real application, you'd likely use an ORM like Prisma or Drizzle.

let pool: Pool | null = null

export function getDbPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.")
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  }
  return pool
}

export async function queryDb<T>(sqlQuery: string, params: any[] = []): Promise<T[]> {
  const client = await getDbPool().connect()
  try {
    const result = await client.query(sqlQuery, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}

// Export the neon template literal tag for direct SQL queries
export const sql = neon(process.env.DATABASE_URL!)
