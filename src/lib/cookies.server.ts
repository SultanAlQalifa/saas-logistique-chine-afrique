import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export interface CookieOptions {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  path?: string
  maxAge?: number
  domain?: string
}

const isProd = process.env.NODE_ENV === 'production'

export class CookieService {
  // Default secure options
  private static getDefaultOptions(httpOnly = false): CookieOptions {
    return {
      httpOnly,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: httpOnly ? 60 * 60 * 24 * 7 : 60 * 60 * 24 * 180, // 7 days for session, 180 for prefs
    }
  }

  // Server-side cookie reading
  static getCookie(name: string): string | undefined {
    try {
      const cookieStore = cookies()
      return cookieStore.get(name)?.value
    } catch (error) {
      console.error(`Error reading cookie ${name}:`, error)
      return undefined
    }
  }

  // Server-side cookie setting (for API routes)
  static setCookie(response: NextResponse, name: string, value: string, options?: CookieOptions) {
    const opts = { ...this.getDefaultOptions(options?.httpOnly), ...options }
    
    const cookieString = this.buildCookieString(name, value, opts)
    response.headers.append('Set-Cookie', cookieString)
  }

  // Delete cookie
  static deleteCookie(response: NextResponse, name: string, path = '/') {
    const cookieString = `${name}=; Max-Age=0; Path=${path}; HttpOnly; Secure=${isProd}; SameSite=lax`
    response.headers.append('Set-Cookie', cookieString)
  }

  // Build cookie string
  private static buildCookieString(name: string, value: string, options: CookieOptions): string {
    let cookie = `${name}=${encodeURIComponent(value)}`
    
    if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`
    if (options.path) cookie += `; Path=${options.path}`
    if (options.domain) cookie += `; Domain=${options.domain}`
    if (options.secure) cookie += '; Secure'
    if (options.httpOnly) cookie += '; HttpOnly'
    if (options.sameSite) cookie += `; SameSite=${options.sameSite}`
    
    return cookie
  }

  // Session management
  static setSessionCookie(response: NextResponse, sessionData: string) {
    this.setCookie(response, 'nm_sess', sessionData, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  }

  static getSessionCookie(): string | undefined {
    return this.getCookie('nm_sess')
  }

  static deleteSessionCookie(response: NextResponse) {
    this.deleteCookie(response, 'nm_sess')
  }

  // Preferences management (non-HttpOnly for client access)
  static setPreferenceCookie(response: NextResponse, name: string, value: string) {
    this.setCookie(response, name, value, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 180, // 180 days
    })
  }

  // CSRF token management
  static setCSRFToken(response: NextResponse, token: string) {
    this.setCookie(response, 'nm_csrf', token, {
      httpOnly: false, // Needs to be readable by JS for headers
      secure: isProd,
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    })
  }

  static getCSRFToken(): string | undefined {
    return this.getCookie('nm_csrf')
  }

  // Consent management
  static setConsentCookie(response: NextResponse, consent: 'accepted' | 'declined') {
    this.setCookie(response, 'nm_consent', consent, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 180, // 180 days
    })
  }

  static getConsentCookie(): string | undefined {
    return this.getCookie('nm_consent')
  }

  // Multi-tenant domain handling
  static setTenantCookie(response: NextResponse, tenantId: string, domain?: string) {
    this.setCookie(response, 'nm_tenant', tenantId, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      domain: domain || undefined,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }

  // Validate cookie security
  static validateCookieSecurity(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent') || ''
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    
    // Basic security checks
    if (isProd && !request.url.startsWith('https://')) {
      return false
    }
    
    // Check for suspicious user agents
    if (userAgent.includes('bot') || userAgent.includes('crawler')) {
      return false
    }
    
    return true
  }
}

export default CookieService
