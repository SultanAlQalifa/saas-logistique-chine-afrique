import { useRouter } from 'next/navigation'
import routesManifest from '../../routes.manifest.json'
type RouteEntry = { path: string; component?: string; public?: boolean; guards?: string[] }
const routesByName = routesManifest.routes as Record<string, RouteEntry>

export interface RouteParams {
  [key: string]: string | number
}

export interface NavigationOptions {
  name: string
  params?: RouteParams
  query?: Record<string, string>
  replace?: boolean
}

/**
 * Safe navigation utility that uses route names instead of hardcoded paths
 */
export function useAppRouter() {
  const router = useRouter()

  const navigateTo = ({ name, params = {}, query = {}, replace = false }: NavigationOptions) => {
    const route = routesByName[name]
    
    if (!route) {
      console.error(`Route "${name}" not found in routes manifest`)
      return
    }

    let path = route.path
    
    // Replace path parameters
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value))
    })

    // Add query parameters
    const queryString = new URLSearchParams(
      Object.entries(query).reduce((acc, [key, value]) => {
        acc[key] = String(value)
        return acc
      }, {} as Record<string, string>)
    ).toString()

    const finalPath = queryString ? `${path}?${queryString}` : path

    if (replace) {
      router.replace(finalPath)
    } else {
      router.push(finalPath)
    }
  }

  const goBack = () => {
    router.back()
  }

  const refresh = () => {
    router.refresh()
  }

  return {
    navigateTo,
    goBack,
    refresh,
    router
  }
}

/**
 * Generate URL from route name and parameters
 */
export function generateUrl(name: string, params: RouteParams = {}): string {
  const route = routesByName[name]
  
  if (!route) {
    console.error(`Route "${name}" not found in routes manifest`)
    return '/'
  }

  let path = route.path
  
  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, String(value))
  })

  return path
}

/**
 * Check if current path matches route
 */
export function isActiveRoute(pathname: string, routeName: string, params: RouteParams = {}): boolean {
  const expectedPath = generateUrl(routeName, params)
  return pathname === expectedPath || pathname.startsWith(expectedPath + '/')
}

/**
 * Get route metadata
 */
export function getRouteInfo(name: string) {
  return routesByName[name] || null
}

/**
 * Validate route guards
 */
export function validateRouteAccess(routeName: string, userRole?: string, features?: string[]): boolean {
  const route = routesByName[routeName]
  
  if (!route) return false
  if (route.public) return true
  if (!route.guards) return true

  // Check authentication guard
  if (route.guards.includes('auth') && !userRole) {
    return false
  }

  // Check role guards
  const roleGuards = route.guards.filter(guard => guard.startsWith('role:'))
  if (roleGuards.length > 0 && userRole) {
    const allowedRoles = roleGuards[0].split(':')[1].split('|')
    if (!allowedRoles.includes(userRole)) {
      return false
    }
  }

  // Check feature guards
  const featureGuards = route.guards.filter(guard => guard.startsWith('feature:'))
  if (featureGuards.length > 0 && features) {
    const requiredFeatures = featureGuards.map(guard => guard.split(':')[1])
    if (!requiredFeatures.every(feature => features.includes(feature))) {
      return false
    }
  }

  return true
}
