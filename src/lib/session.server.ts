import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import CookieService from './cookies.server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
)

export interface SessionData {
  userId: string
  email: string
  role: string
  tenantId?: string
  iat: number
  exp: number
}

export class SessionService {
  // Create session token
  static async createSession(userData: Omit<SessionData, 'iat' | 'exp'>): Promise<string> {
    const now = Math.floor(Date.now() / 1000)
    const sessionData: SessionData = {
      ...userData,
      iat: now,
      exp: now + (60 * 60 * 24 * 7), // 7 days
    }

    const token = await new SignJWT(sessionData as any)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(sessionData.exp)
      .sign(JWT_SECRET)

    return token
  }

  // Verify and decode session token
  static async verifySession(token: string): Promise<SessionData | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      return payload as unknown as SessionData
    } catch (error) {
      console.error('Session verification failed:', error)
      return null
    }
  }

  // Get session from request
  static async getSession(request?: NextRequest): Promise<SessionData | null> {
    try {
      const sessionToken = CookieService.getSessionCookie()
      if (!sessionToken) return null

      return await this.verifySession(sessionToken)
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  // Set session cookie
  static async setSessionCookie(response: NextResponse, userData: Omit<SessionData, 'iat' | 'exp'>) {
    const token = await this.createSession(userData)
    CookieService.setSessionCookie(response, token)
  }

  // Refresh session (extend expiry)
  static async refreshSession(response: NextResponse, currentSession: SessionData) {
    const refreshedData = {
      userId: currentSession.userId,
      email: currentSession.email,
      role: currentSession.role,
      tenantId: currentSession.tenantId,
    }
    
    await this.setSessionCookie(response, refreshedData)
  }

  // Clear session
  static clearSession(response: NextResponse) {
    CookieService.deleteSessionCookie(response)
  }

  // Validate session security
  static validateSessionSecurity(session: SessionData, request: NextRequest): boolean {
    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (session.exp < now) {
      return false
    }

    // Check if session is too old (force re-auth after 30 days)
    const maxAge = 60 * 60 * 24 * 30 // 30 days
    if (now - session.iat > maxAge) {
      return false
    }

    // Additional security checks
    return CookieService.validateCookieSecurity(request)
  }

  // Create CSRF token tied to session
  static async createCSRFToken(session: SessionData): Promise<string> {
    const csrfData = {
      sessionId: session.userId,
      timestamp: Date.now(),
    }

    const token = await new SignJWT(csrfData)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(JWT_SECRET)

    return token
  }

  // Verify CSRF token
  static async verifyCSRFToken(token: string, session: SessionData): Promise<boolean> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      const csrfData = payload as { sessionId: string; timestamp: number }
      
      return csrfData.sessionId === session.userId
    } catch (error) {
      console.error('CSRF verification failed:', error)
      return false
    }
  }
}

export default SessionService
