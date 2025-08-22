import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserRole } from '@prisma/client'

// Role-based route permissions
const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/super-admin': [UserRole.SUPER_ADMIN],
  '/admin': [UserRole.ADMIN],
  '/dashboard': [UserRole.ADMIN, UserRole.AGENT],
  '/portal': [UserRole.CLIENT],
  '/affiliate': [UserRole.AFFILIATE],
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/track',
  '/auth/signin',
  '/auth/signup',
  '/api/auth',
]

export async function authMiddleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Redirect to signin if no token
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check role-based permissions
  const userRole = token.role as UserRole
  
  for (const route in ROUTE_PERMISSIONS) {
    if (pathname.startsWith(route)) {
      const allowedRoles = ROUTE_PERMISSIONS[route]
      
      if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        const redirectUrl = getRoleBasedRedirect(userRole, request.url)
        return NextResponse.redirect(redirectUrl)
      }
      
      // Check tenant isolation (except for SUPER_ADMIN)
      if (userRole !== UserRole.SUPER_ADMIN) {
        // Add tenant_id to headers for data isolation
        const response = NextResponse.next()
        response.headers.set('x-tenant-id', token.companyId as string)
        response.headers.set('x-user-role', userRole)
        response.headers.set('x-user-id', token.sub as string)
        return response
      }
    }
  }

  return NextResponse.next()
}

function getRoleBasedRedirect(role: UserRole, currentUrl: string): URL {
  const baseUrl = new URL(currentUrl).origin
  
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return new URL('/super-admin', baseUrl)
    case UserRole.ADMIN:
      return new URL('/admin', baseUrl)
    case UserRole.AGENT:
      return new URL('/dashboard', baseUrl)
    case UserRole.CLIENT:
      return new URL('/portal', baseUrl)
    case UserRole.AFFILIATE:
      return new URL('/affiliate', baseUrl)
    default:
      return new URL('/auth/signin', baseUrl)
  }
}

// Utility function to check if user has permission for specific action
export function hasPermission(
  userRole: UserRole, 
  action: string, 
  resource?: string
): boolean {
  switch (userRole) {
    case UserRole.SUPER_ADMIN:
      return true // Super admin has all permissions
      
    case UserRole.ADMIN:
      // Company admin can manage their company's data
      return [
        'read:company',
        'update:company',
        'create:user',
        'read:user',
        'update:user',
        'delete:user',
        'read:package',
        'create:package',
        'update:package',
        'read:cargo',
        'create:cargo',
        'update:cargo',
        'read:client',
        'create:client',
        'update:client',
        'read:reports'
      ].includes(action)
      
    case UserRole.AGENT:
      // Agents can manage packages and clients
      return [
        'read:package',
        'create:package',
        'update:package',
        'read:cargo',
        'read:client',
        'create:client',
        'update:client'
      ].includes(action)
      
    case UserRole.CLIENT:
      // Clients can only read their own packages
      return ['read:own:package'].includes(action)
      
    case UserRole.AFFILIATE:
      // Affiliates can manage their referrals and earnings
      return [
        'read:affiliate',
        'update:affiliate',
        'read:referral',
        'read:payout'
      ].includes(action)
      
    default:
      return false
  }
}

// Tenant isolation utility
export function getTenantFilter(tenantId: string) {
  return {
    companyId: tenantId
  }
}
