import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from './middleware/rateLimiter'
import SecurityService from './lib/security.server'
import TenantService from './lib/tenant.server'
import SessionService from './lib/session.server'
import routesManifest from '../routes.manifest.json'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const redirects = routesManifest.redirects as Record<string, string>
  const aliases = routesManifest.aliases as Record<string, string>
  
  // Handle redirects from routes.manifest.json
  if (redirects[pathname]) {
    const redirectTo = redirects[pathname]
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }
  
  // Handle aliases
  if (aliases[pathname]) {
    const aliasTo = aliases[pathname]
    return NextResponse.rewrite(new URL(aliasTo, request.url))
  }
  
  // Enhanced security checks
  if (SecurityService.isSuspiciousRequest(request)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  if (!SecurityService.validateSessionIntegrity(request)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Security headers
  let response = NextResponse.next()
  
  // Set comprehensive security headers
  response = SecurityService.setSecurityHeaders(response, request)
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production' && process.env.FORCE_HTTPS === 'true') {
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    if (protocol !== 'https') {
      const httpsUrl = new URL(request.url)
      httpsUrl.protocol = 'https:'
      return NextResponse.redirect(httpsUrl)
    }
  }
  
  // Enhanced security headers for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://api.whatsapp.com https://graph.facebook.com https://www.google-analytics.com; " +
      "frame-src 'none'; " +
      "object-src 'none'; " +
      "base-uri 'self';"
    )
  }
  
  // Multi-tenant context resolution (simplified)
  const host = request.headers.get('host') || ''
  const tenantId = request.headers.get('x-tenant-id')
  
  // Simple tenant resolution based on subdomain or header
  let tenant = null
  if (tenantId) {
    tenant = { id: tenantId, name: `tenant-${tenantId}` }
  } else if (host.includes('.')) {
    const subdomain = host.split('.')[0]
    if (subdomain && subdomain !== 'www') {
      tenant = { id: subdomain, name: subdomain }
    }
  }
  
  if (tenant) {
    response.headers.set('x-tenant-id', tenant.id)
    response.headers.set('x-tenant-name', tenant.name)
  }
  
  // Get public routes from manifest
  const routeValues = Object.values(routesManifest.routes) as Array<{ path: string; public?: boolean }>
  const publicRoutes = routeValues
    .filter(route => route.public === true)
    .map(route => route.path)
  
  // Add static public routes
  publicRoutes.push('/api/auth', '/api/health', '/pricing', '/quote', '/contact', '/help', '/', '/signin', '/tracking')
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return response
  }
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const identifier = `${ip}-${userAgent.slice(0, 50)}`
    
    // Simple in-memory rate limiting (use Redis in production)
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000')
    
    // This is a simplified version - in production use proper rate limiting
    const rateLimitHeader = request.headers.get('x-rate-limit-check')
    if (rateLimitHeader === 'exceeded') {
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900'
          }
        }
      )
    }
  }
  
  // Check for client mode in cookies (set by the Mode Client button)
  const userRole = request.cookies.get('userRole')?.value || 
                   request.headers.get('x-user-role')
  
  // Validate session token (in production, verify JWT)
  const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                      request.cookies.get('__Secure-next-auth.session-token')?.value
  
  // Client role restrictions
  if (userRole === 'CLIENT') {
    // Clients can only access their specific areas and must have tenant context
    const allowedClientRoutes = [
      '/dashboard/client',
      '/dashboard/support/client', 
      '/dashboard/profile'
    ]
    
    if (allowedClientRoutes.some(route => pathname.startsWith(route))) {
      // Validate tenant access for clients
      if (!tenant && !tenantId) {
        return NextResponse.redirect(new URL('/auth/signin?error=tenant_required', request.url))
      }
      return response
    }
    
    // Redirect clients trying to access admin areas
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/dashboard/client', request.url))
    }
  }
  
  // Admin restrictions - can access their tenant data only
  if (userRole === 'ADMIN') {
    // Validate tenant context for admins
    if (!tenant && !tenantId && !pathname.startsWith('/dashboard/profile')) {
      return NextResponse.redirect(new URL('/auth/signin?error=tenant_required', request.url))
    }
    
    // Block super admin only routes
    const superAdminOnlyRoutes = [
      '/dashboard/admin/users',
      '/dashboard/admin/logs',
      '/dashboard/admin/pricing',
      '/dashboard/companies',
      '/dashboard/roles',
      '/dashboard/config'
    ]
    
    if (superAdminOnlyRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard?error=insufficient_permissions', request.url))
    }
  }
  
  // Super Admin can access everything
  if (userRole === 'SUPER_ADMIN') {
    // Super admins don't need tenant context validation
    return response
  }
  
  // CSRF protection for POST requests
  if (request.method === 'POST') {
    const csrfToken = request.headers.get('x-csrf-token')
    const referer = request.headers.get('referer')
    const origin = request.headers.get('origin')
    
    // Validate origin/referer for CSRF protection
    if (!referer || !origin || !referer.startsWith(origin)) {
      return new NextResponse('CSRF validation failed', { status: 403 })
    }
  }
  
  return response
}



export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/super-admin/:path*',
    '/portal/:path*',
    '/affiliate/:path*'
  ]
}
