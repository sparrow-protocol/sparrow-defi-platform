import { Connection, type PublicKey, type VersionedTransaction } from "@solana/web3.js"
import { getServerRpcUrl, getServerRpcUrls } from "../../../lib/rpc"

class RpcService {
  private connections: Connection[]
  private defaultConnection: Connection

  constructor() {
    this.connections = this.createServerConnectionsInternal()
    this.defaultConnection = new Connection("https://api.mainnet-beta.solana.com", "confirmed") // Fallback
  }

  // Internal method to create server-side connection
  private createServerConnectionInternal(): Connection {
    const rpcUrl = getServerRpcUrl()
    return new Connection(rpcUrl, "confirmed")
  }

  // Internal method to create multiple connections for load balancing
  private createServerConnectionsInternal(): Connection[] {
    const rpcUrls = getServerRpcUrls()
    return rpcUrls.map((url) => new Connection(url, "confirmed"))
  }

  // Get a random server connection for load balancing
  getRandomServerConnection(): Connection {
    const randomIndex = Math.floor(Math.random() * this.connections.length)
    return this.connections[randomIndex] || this.defaultConnection
  }

  // Health check for RPC endpoints
  async checkRpcHealth(rpcUrl: string): Promise<boolean> {
    try {
      const connection = new Connection(rpcUrl, "confirmed")
      await connection.getSlot()
      return true
    } catch (error) {
      console.error(`RPC health check failed for ${rpcUrl}:`, error)
      return false
    }
  }

  // Get the best performing RPC endpoint
  async getBestRpcConnection(): Promise<Connection> {
    const rpcUrls = getServerRpcUrls()

    // Test all endpoints concurrently
    const healthChecks = await Promise.allSettled(
      rpcUrls.map(async (url) => {
        const startTime = Date.now()
        const isHealthy = await this.checkRpcHealth(url)
        const responseTime = Date.now() - startTime
        return { url, isHealthy, responseTime }
      }),
    )

    // Find the fastest healthy endpoint
    const healthyEndpoints = healthChecks
      .filter(
        (result): result is PromiseFulfilledResult<{ url: string; isHealthy: boolean; responseTime: number }> =>
          result.status === "fulfilled" && result.value.isHealthy,
      )
      .map((result) => result.value)
      .sort((a, b) => a.responseTime - b.responseTime)

    if (healthyEndpoints.length === 0) {
      // Fallback to default if no endpoints are healthy
      return this.defaultConnection
    }

    return new Connection(healthyEndpoints[0].url, "confirmed")
  }

  /**
   * Sends a raw transaction to the network.
   * @param rawTransaction The raw transaction as a Buffer.
   * @returns The transaction signature.
   */
  async sendRawTransaction(rawTransaction: Buffer): Promise<string> {
    const connection = this.getRandomServerConnection()
    return connection.sendRawTransaction(rawTransaction)
  }

  /**
   * Confirms a transaction on the network.
   * @param signature The transaction signature to confirm.
   * @param commitment The commitment level for confirmation.
   * @returns True if the transaction is confirmed, false otherwise.
   */
  async confirmTransaction(signature: string, commitment: "confirmed" | "finalized" = "confirmed"): Promise<boolean> {
    const connection = this.getRandomServerConnection()
    const { value } = await connection.confirmTransaction(signature, commitment)
    return value === null
  }

  /**
   * Sends and confirms a versioned transaction.
   * @param transaction The versioned transaction to send.
   * @returns The transaction signature.
   */
  async sendAndConfirmTransaction(transaction: VersionedTransaction): Promise<string> {
    const connection = this.getRandomServerConnection()
    const signature = await connection.sendTransaction(transaction, {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    })
    await connection.confirmTransaction(signature, "confirmed")
    return signature
  }

  /**
   * Fetches the SOL balance of a public key.
   * @param publicKey The public key to check.
   * @returns The SOL balance in lamports.
   */
  async getBalance(publicKey: PublicKey): Promise<number> {
    const connection = this.getRandomServerConnection()
    return connection.getBalance(publicKey)
  }
}

export const rpcService = new RpcService()

// Export createServerConnection directly for compatibility
export function createServerConnection(): Connection {
  return rpcService.createServerConnectionInternal()
}
