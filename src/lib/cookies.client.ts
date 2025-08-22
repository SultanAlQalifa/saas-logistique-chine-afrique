'use client'

export interface ClientCookieOptions {
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

const isProd = process.env.NODE_ENV === 'production'

export class ClientCookieService {
  // Check if cookies are enabled
  static areCookiesEnabled(): boolean {
    try {
      document.cookie = 'cookietest=1; SameSite=Lax'
      const enabled = document.cookie.indexOf('cookietest=') !== -1
      // Clean up test cookie
      document.cookie = 'cookietest=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      return enabled
    } catch {
      return false
    }
  }

  // Get cookie value
  static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    
    try {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift()
        return cookieValue ? decodeURIComponent(cookieValue) : null
      }
    } catch (error) {
      console.error(`Error reading cookie ${name}:`, error)
    }
    return null
  }

  // Set cookie value
  static setCookie(name: string, value: string, options: ClientCookieOptions = {}): boolean {
    if (typeof document === 'undefined') return false
    
    try {
      const opts = {
        maxAge: 60 * 60 * 24 * 180, // 180 days default
        path: '/',
        secure: isProd,
        sameSite: 'lax' as const,
        ...options
      }

      let cookieString = `${name}=${encodeURIComponent(value)}`
      
      if (opts.maxAge) cookieString += `; max-age=${opts.maxAge}`
      if (opts.path) cookieString += `; path=${opts.path}`
      if (opts.domain) cookieString += `; domain=${opts.domain}`
      if (opts.secure) cookieString += '; secure'
      if (opts.sameSite) cookieString += `; samesite=${opts.sameSite}`

      document.cookie = cookieString
      return true
    } catch (error) {
      console.error(`Error setting cookie ${name}:`, error)
      return false
    }
  }

  // Delete cookie
  static deleteCookie(name: string, path = '/'): void {
    if (typeof document === 'undefined') return
    
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
    } catch (error) {
      console.error(`Error deleting cookie ${name}:`, error)
    }
  }

  // Fallback to localStorage if cookies disabled
  static getWithFallback(cookieName: string, localStorageKey: string): string | null {
    if (this.areCookiesEnabled()) {
      return this.getCookie(cookieName)
    }
    
    // Fallback to localStorage
    try {
      return localStorage.getItem(localStorageKey)
    } catch {
      return null
    }
  }

  // Set with fallback to localStorage
  static setWithFallback(
    cookieName: string, 
    localStorageKey: string, 
    value: string, 
    options?: ClientCookieOptions
  ): boolean {
    if (this.areCookiesEnabled()) {
      return this.setCookie(cookieName, value, options)
    }
    
    // Fallback to localStorage
    try {
      localStorage.setItem(localStorageKey, value)
      return true
    } catch {
      return false
    }
  }
}

export default ClientCookieService
