'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { TenantContextManager, usePermissions } from '@/lib/tenant-context'
import { Shield, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: string
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT'
  tenantRequired?: boolean
  fallback?: React.ReactNode
}

export function PermissionGuard({ 
  children, 
  permission, 
  role, 
  tenantRequired = true,
  fallback 
}: PermissionGuardProps) {
  const { data: session, status } = useSession()
  const { hasPermission, isRole } = usePermissions()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    const manager = TenantContextManager.getInstance()
    
    // Vérifier l'authentification
    if (!session?.user) {
      setIsAuthorized(false)
      setIsLoading(false)
      return
    }

    // Initialiser le contexte utilisateur
    const userContext = manager.createUserContext(
      session.user.id || '',
      session.user.role || 'CLIENT',
      session.user.companyId
    )
    manager.setUserPermissions(userContext)

    // Si un tenant est requis, vérifier la présence
    if (tenantRequired && !session.user.companyId && session.user.role !== 'SUPER_ADMIN') {
      setIsAuthorized(false)
      setIsLoading(false)
      return
    }

    // Vérifier le rôle si spécifié
    if (role && !isRole(role)) {
      setIsAuthorized(false)
      setIsLoading(false)
      return
    }

    // Vérifier la permission si spécifiée
    if (permission && !hasPermission(permission)) {
      setIsAuthorized(false)
      setIsLoading(false)
      return
    }

    setIsAuthorized(true)
    setIsLoading(false)
  }, [session, status, permission, role, tenantRequired, hasPermission, isRole])

  // État de chargement
  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  // Non authentifié
  if (!session?.user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentification requise</h3>
          <p className="text-gray-600 mb-4">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <Link href="/auth/signin">
            <Button>Se connecter</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  // Non autorisé
  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Accès non autorisé</h3>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            {role && (
              <p>Rôle requis: <span className="font-medium">{role}</span></p>
            )}
            {permission && (
              <p>Permission requise: <span className="font-medium">{permission}</span></p>
            )}
            <p>Votre rôle: <span className="font-medium">{session.user.role}</span></p>
          </div>
          <div className="mt-4 space-x-2">
            <Link href="/dashboard">
              <Button variant="outline">Retour au tableau de bord</Button>
            </Link>
            <Link href="/dashboard/support/client">
              <Button>Contacter le support</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Autorisé - afficher le contenu
  return <>{children}</>
}

// Composant pour protéger des sections spécifiques
export function PermissionSection({ 
  children, 
  permission, 
  role, 
  fallback = null 
}: Omit<PermissionGuardProps, 'tenantRequired'>) {
  const { hasPermission, isRole } = usePermissions()

  // Vérifier le rôle
  if (role && !isRole(role)) {
    return <>{fallback}</>
  }

  // Vérifier la permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Hook pour les redirections conditionnelles
export function useAuthRedirect() {
  const { data: session } = useSession()
  const { isRole } = usePermissions()

  const redirectBasedOnRole = () => {
    if (!session?.user) return '/auth/signin'

    switch (session.user.role) {
      case 'SUPER_ADMIN':
        return '/dashboard'
      case 'ADMIN':
        return '/dashboard'
      case 'CLIENT':
        return '/dashboard/client'
      default:
        return '/dashboard'
    }
  }

  const canAccessAdminRoutes = () => {
    return isRole('SUPER_ADMIN') || isRole('ADMIN')
  }

  const canAccessSuperAdminRoutes = () => {
    return isRole('SUPER_ADMIN')
  }

  return {
    redirectBasedOnRole,
    canAccessAdminRoutes,
    canAccessSuperAdminRoutes
  }
}
