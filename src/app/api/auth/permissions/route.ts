import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { TenantContextManager, AVAILABLE_PERMISSIONS, ROLE_PERMISSIONS } from '@/lib/tenant-context'

// GET /api/auth/permissions - Obtenir les permissions de l'utilisateur actuel
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const manager = TenantContextManager.getInstance()
    const tenantId = request.headers.get('x-tenant-id')
    
    // Créer le contexte utilisateur
    const userContext = manager.createUserContext(
      session.user.id || '',
      session.user.role || 'CLIENT',
      tenantId || session.user.companyId
    )
    
    manager.setUserPermissions(userContext)
    
    // Résoudre le tenant si disponible
    let tenant = null
    if (tenantId) {
      tenant = manager.resolveTenant(undefined, tenantId)
      if (tenant) {
        manager.setCurrentTenant(tenant)
      }
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        role: session.user.role,
        tenantId: userContext.tenantId
      },
      permissions: userContext.permissions,
      restrictions: userContext.restrictions,
      tenant: tenant ? {
        id: tenant.id,
        name: tenant.name,
        settings: tenant.settings
      } : null,
      availablePermissions: AVAILABLE_PERMISSIONS
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des permissions:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/auth/permissions/check - Vérifier une permission spécifique
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { permission, resource, action } = await request.json()
    
    const manager = TenantContextManager.getInstance()
    const tenantId = request.headers.get('x-tenant-id')
    
    // Créer le contexte utilisateur
    const userContext = manager.createUserContext(
      session.user.id || '',
      session.user.role || 'CLIENT',
      tenantId || session.user.companyId
    )
    
    manager.setUserPermissions(userContext)

    let hasPermission = false
    
    if (permission) {
      // Vérifier une permission directe
      hasPermission = manager.hasPermission(permission)
    } else if (resource && action) {
      // Vérifier l'accès à une ressource avec action
      hasPermission = manager.canAccessResource(resource, action)
    }

    return NextResponse.json({
      hasPermission,
      userRole: session.user.role,
      checkedPermission: permission || `${resource}:${action}`
    })
  } catch (error) {
    console.error('Erreur lors de la vérification des permissions:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
