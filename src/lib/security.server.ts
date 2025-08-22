import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import CookieService from './cookies.server'

const CSRF_SECRET = new TextEncoder().encode(
  process.env.CSRF_SECRET || 'fallback-csrf-secret-for-development'
)

export class SecurityService {
  // Generate CSRF token
  static async generateCSRFToken(sessionId: string): Promise<string> {
    const payload = {
      sessionId,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substr(2, 9),
    }

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(CSRF_SECRET)

    return token
  }

  // Verify CSRF token
  static async verifyCSRFToken(token: string, sessionId: string): Promise<boolean> {
    try {
      const { payload } = await jwtVerify(token, CSRF_SECRET)
      const csrfData = payload as { sessionId: string; timestamp: number }
      
      return csrfData.sessionId === sessionId
    } catch (error) {
      console.error('CSRF verification failed:', error)
      return false
    }
  }

  // Set security headers
  static setSecurityHeaders(response: NextResponse, request: NextRequest): NextResponse {
    const isProd = process.env.NODE_ENV === 'production'
    const url = new URL(request.url)
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts for Next.js
      "style-src 'self' 'unsafe-inline'", // Allow inline styles
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.openai.com https://api.wave.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')

    response.headers.set('Content-Security-Policy', csp)
    
    // Other security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    if (isProd) {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
    
    // Permissions Policy
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')
    
    return response
  }

  // Validate request origin
  static validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    const host = request.headers.get('host')
    
    if (!origin && !referer) {
      // Allow requests without origin/referer (direct navigation)
      return true
    }
    
    const allowedOrigins = [
      `https://${host}`,
      `http://${host}`, // Allow HTTP in development
      'http://localhost:3000',
      'https://nextmove-cargo.com',
      'https://*.nextmove.com',
    ]
    
    if (origin) {
      return allowedOrigins.some(allowed => 
        allowed.includes('*') ? 
          origin.includes(allowed.replace('*', '')) : 
          origin === allowed
      )
    }
    
    if (referer) {
      return allowedOrigins.some(allowed => 
        allowed.includes('*') ? 
          referer.includes(allowed.replace('*', '')) : 
          referer.startsWith(allowed)
      )
    }
    
    return false
  }

  // Rate limiting check
  static checkRateLimit(request: NextRequest, identifier: string): boolean {
    // This would integrate with your existing rate limiter
    // For now, basic implementation
    const userAgent = request.headers.get('user-agent') || ''
    
    // Block obvious bots
    if (userAgent.toLowerCase().includes('bot') || 
        userAgent.toLowerCase().includes('crawler') ||
        userAgent.toLowerCase().includes('spider')) {
      return false
    }
    
    return true
  }

  // Validate session integrity
  static validateSessionIntegrity(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent')
    const acceptLanguage = request.headers.get('accept-language')
    
    // Basic fingerprinting to detect session hijacking
    if (!userAgent || userAgent.length < 10) {
      return false
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      'sqlmap',
      'nikto',
      'nmap',
      'burp',
      'owasp',
    ]
    
    return !suspiciousPatterns.some(pattern => 
      userAgent.toLowerCase().includes(pattern)
    )
  }

  // Sanitize input
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential XSS
      .replace(/['"]/g, '') // Remove quotes
      .trim()
      .slice(0, 1000) // Limit length
  }

  // Check for suspicious requests
  static isSuspiciousRequest(request: NextRequest): boolean {
    const url = new URL(request.url)
    const path = url.pathname
    const query = url.search
    
    // Check for common attack patterns
    const attackPatterns = [
      'script',
      'javascript:',
      'vbscript:',
      'onload=',
      'onerror=',
      'eval(',
      'alert(',
      'document.cookie',
      'union select',
      'drop table',
      '../',
      '..\\',
      'etc/passwd',
      'cmd.exe',
    ]
    
    const fullUrl = path + query
    return attackPatterns.some(pattern => 
      fullUrl.toLowerCase().includes(pattern.toLowerCase())
    )
  }

  // Generate secure random string
  static generateSecureRandom(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  }

  // Hash sensitive data
  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}

export default SecurityService
