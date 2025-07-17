import { clusterApiUrl, Connection } from "@solana/web3.js"

const DEFAULT_TIMEOUT = 3000

/**
 * Check the health of an RPC endpoint by attempting a simple version fetch.
 */
export async function checkRpcHealth(rpcUrl: string, timeout = DEFAULT_TIMEOUT): Promise<boolean> {
  const connection = new Connection(rpcUrl)
  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    await connection.getVersion()
    clearTimeout(id)
    return true
  } catch (error) {
    console.warn(`RPC ${rpcUrl} failed health check:`, error)
    return false
  }
}

/**
 * Get the first healthy RPC from a list, or return null if none work.
 */
export async function getHealthyRpc(rpcList: string[]): Promise<string | null> {
  for (const rpc of rpcList) {
    const isHealthy = await checkRpcHealth(rpc)
    if (isHealthy) return rpc
  }
  return null
}
