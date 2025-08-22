import { NextRequest } from 'next/server'
import CookieService from './cookies.server'

export interface TenantConfig {
  id: string
  domain: string
  subdomain?: string
  name: string
  settings: {
    cookieDomain?: string
    sessionDuration?: number
    allowCrossTenant?: boolean
  }
}

export class TenantService {
  // Extract tenant from request
  static getTenantFromRequest(request: NextRequest): string | null {
    const url = new URL(request.url)
    const hostname = url.hostname
    
    // Check for subdomain pattern (tenant.nextmove.com)
    const subdomainMatch = hostname.match(/^([^.]+)\.nextmove\./)
    if (subdomainMatch) {
      return subdomainMatch[1]
    }
    
    // Check for custom domain mapping
    const customTenant = this.getCustomDomainTenant(hostname)
    if (customTenant) {
      return customTenant
    }
    
    // Check for tenant header (for API calls)
    const tenantHeader = request.headers.get('x-tenant-id')
    if (tenantHeader) {
      return tenantHeader
    }
    
    // Check for tenant cookie
    const tenantCookie = CookieService.getCookie('nm_tenant')
    if (tenantCookie) {
      return tenantCookie
    }
    
    // Default tenant for main domain
    if (hostname.includes('nextmove') || hostname === 'localhost') {
      return 'default'
    }
    
    return null
  }

  // Map custom domains to tenants
  private static getCustomDomainTenant(domain: string): string | null {
    const domainMapping: Record<string, string> = {
      'logitrans.nextmove.com': 'logitrans',
      'cargo-express.nextmove.com': 'cargo-express',
      'africa-logistics.nextmove.com': 'africa-logistics',
      // Add more custom domain mappings as needed
    }
    
    return domainMapping[domain] || null
  }

  // Get tenant configuration
  static getTenantConfig(tenantId: string): TenantConfig | null {
    const tenantConfigs: Record<string, TenantConfig> = {
      'default': {
        id: 'default',
        domain: 'nextmove.com',
        name: 'NextMove Cargo',
        settings: {
          cookieDomain: '.nextmove.com',
          sessionDuration: 60 * 60 * 24 * 7, // 7 days
          allowCrossTenant: false,
        }
      },
      'logitrans': {
        id: 'logitrans',
        domain: 'logitrans.nextmove.com',
        subdomain: 'logitrans',
        name: 'LogiTrans',
        settings: {
          cookieDomain: '.nextmove.com',
          sessionDuration: 60 * 60 * 24 * 30, // 30 days
          allowCrossTenant: false,
        }
      },
      'cargo-express': {
        id: 'cargo-express',
        domain: 'cargo-express.nextmove.com',
        subdomain: 'cargo-express',
        name: 'Cargo Express',
        settings: {
          cookieDomain: '.nextmove.com',
          sessionDuration: 60 * 60 * 24 * 14, // 14 days
          allowCrossTenant: false,
        }
      }
    }
    
    return tenantConfigs[tenantId] || null
  }

  // Validate tenant access
  static validateTenantAccess(tenantId: string, userId: string): boolean {
    // In production, check database for user-tenant relationship
    // For now, basic validation
    if (!tenantId || !userId) return false
    
    // Check if user has access to this tenant
    // This would typically query your user-tenant relationship table
    return true
  }

  // Get cookie domain for tenant
  static getCookieDomain(tenantId: string): string | undefined {
    const config = this.getTenantConfig(tenantId)
    return config?.settings.cookieDomain
  }

  // Check if cross-tenant access is allowed
  static isCrossTenantAllowed(tenantId: string): boolean {
    const config = this.getTenantConfig(tenantId)
    return config?.settings.allowCrossTenant || false
  }

  // Get session duration for tenant
  static getSessionDuration(tenantId: string): number {
    const config = this.getTenantConfig(tenantId)
    return config?.settings.sessionDuration || 60 * 60 * 24 * 7 // Default 7 days
  }

  // Validate tenant domain security
  static validateTenantSecurity(request: NextRequest, tenantId: string): boolean {
    const url = new URL(request.url)
    const config = this.getTenantConfig(tenantId)
    
    if (!config) return false
    
    // Check if request is coming from correct domain
    const expectedDomain = config.domain
    const actualDomain = url.hostname
    
    // Allow localhost for development
    if (actualDomain === 'localhost' && process.env.NODE_ENV === 'development') {
      return true
    }
    
    // Check domain match
    if (actualDomain === expectedDomain) {
      return true
    }
    
    // Check subdomain match
    if (config.subdomain && actualDomain.endsWith(`.${expectedDomain.split('.').slice(-2).join('.')}`)) {
      return true
    }
    
    return false
  }

  // Generate tenant-specific cookie name
  static getTenantCookieName(baseName: string, tenantId: string): string {
    if (tenantId === 'default') {
      return baseName
    }
    return `${baseName}_${tenantId}`
  }

  // Clean tenant ID (sanitize)
  static sanitizeTenantId(tenantId: string): string {
    return tenantId.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase()
  }
}

export default TenantService
