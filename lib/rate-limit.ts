interface RateLimitOptions {
  intervalMs: number // Time interval in milliseconds
  maxCalls: number // Maximum calls within the interval
}

interface CallRecord {
  timestamp: number
}

const rateLimiters = new Map<string, { calls: CallRecord[]; options: RateLimitOptions }>()

export function createRateLimiter(name: string, options: RateLimitOptions) {
  if (rateLimiters.has(name)) {
    // If a limiter with this name already exists, return it.
    // This prevents re-creating the same limiter on hot reloads in development.
    return rateLimiters.get(name)!
  }

  const limiter = {
    calls: [] as CallRecord[],
    options,
  }
  rateLimiters.set(name, limiter)

  return limiter
}

export function canCall(name: string): boolean {
  const limiter = rateLimiters.get(name)
  if (!limiter) {
    // If no limiter is defined for this name, allow the call by default
    // or throw an error if strict definition is required.
    console.warn(`Rate limiter "${name}" not found. Call allowed.`)
    return true
  }

  const now = Date.now()
  // Remove old calls that are outside the current interval
  limiter.calls = limiter.calls.filter((call) => now - call.timestamp < limiter.options.intervalMs)

  if (limiter.calls.length < limiter.options.maxCalls) {
    limiter.calls.push({ timestamp: now })
    return true
  }
  return false
}

export function getRemainingTime(name: string): number {
  const limiter = rateLimiters.get(name)
  if (!limiter || limiter.calls.length < limiter.options.maxCalls) {
    return 0
  }

  // Calculate time until the oldest call expires, allowing a new call
  const oldestCallTime = limiter.calls[0].timestamp
  const timePassed = Date.now() - oldestCallTime
  const timeLeft = limiter.options.intervalMs - timePassed
  return Math.max(0, timeLeft)
}
