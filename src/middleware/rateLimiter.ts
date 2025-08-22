import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  public readonly maxRequests: number
  public readonly windowMs: number
  private requests: Map<string, number[]>

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = new Map()
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const key = identifier

    // Get current timestamps for this identifier
    let timestamps = this.requests.get(key) || []
    
    // Remove expired timestamps
    timestamps = timestamps.filter(timestamp => now - timestamp < this.windowMs)
    
    // Check if limit exceeded
    if (timestamps.length >= this.maxRequests) {
      return true
    }
    
    // Add current timestamp
    timestamps.push(now)
    this.requests.set(key, timestamps)
    
    return false
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const timestamps = this.requests.get(identifier) || []
    const validTimestamps = timestamps.filter(timestamp => now - timestamp < this.windowMs)
    return Math.max(0, this.maxRequests - validTimestamps.length)
  }

  getResetTime(identifier: string): number {
    const now = Date.now()
    const timestamps = this.requests.get(identifier) || []
    const validTimestamps = timestamps.filter(timestamp => now - timestamp < this.windowMs)
    
    if (validTimestamps.length === 0) {
      return now + this.windowMs
    }
    
    // Return when the oldest timestamp will expire
    return Math.min(...validTimestamps) + this.windowMs
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000')
)

export function rateLimit(req: NextRequest): NextResponse | null {
  // Get client identifier (IP + User-Agent for better uniqueness)
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown'
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const identifier = `${ip}-${userAgent.slice(0, 50)}`

  // Check rate limit
  if (rateLimiter.isRateLimited(identifier)) {
    const resetTime = rateLimiter.getResetTime(identifier)
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000)

    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': rateLimiter.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString()
        }
      }
    )
  }

  // Add rate limit headers to successful responses
  const remaining = rateLimiter.getRemainingRequests(identifier)
  const resetTime = rateLimiter.getResetTime(identifier)

  return NextResponse.next({
    headers: {
      'X-RateLimit-Limit': rateLimiter.maxRequests.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': resetTime.toString()
    }
  })
}

export default rateLimiter
