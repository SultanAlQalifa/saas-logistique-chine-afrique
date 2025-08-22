// Système de contexte multi-tenant et permissions
export interface TenantContext {
  id: string
  name: string
  domain: string
  subdomain?: string
  settings: {
    currency: string
    vatRate: number
    timezone: string
    language: string
    features: string[]
  }
  subscription: {
    planId: string
    status: 'active' | 'suspended' | 'cancelled'
    expiresAt: string
  }
  branding?: {
    logo?: string
    primaryColor?: string
    secondaryColor?: string
  }
}

export interface UserPermissions {
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT'
  tenantId?: string
  permissions: string[]
  restrictions?: {
    maxClients?: number
    maxPackages?: number
    features?: string[]
  }
}

export interface Permission {
  id: string
  name: string
  description: string
  category: 'pricing' | 'admin' | 'operations' | 'finance' | 'support'
  level: 'read' | 'write' | 'delete' | 'admin'
}

// Permissions disponibles dans le système
export const AVAILABLE_PERMISSIONS: Permission[] = [
  // Permissions Tarification
  {
    id: 'pricing:read',
    name: 'Consulter les tarifs',
    description: 'Voir les plans, add-ons et grilles tarifaires',
    category: 'pricing',
    level: 'read'
  },
  {
    id: 'pricing:write',
    name: 'Modifier les tarifs',
    description: 'Créer et modifier les plans et add-ons',
    category: 'pricing',
    level: 'write'
  },
  {
    id: 'pricing:admin',
    name: 'Administration tarifs',
    description: 'Gérer les grilles tarifaires et marges',
    category: 'pricing',
    level: 'admin'
  },
  
  // Permissions Administration
  {
    id: 'admin:users',
    name: 'Gestion utilisateurs',
    description: 'Créer, modifier et supprimer des utilisateurs',
    category: 'admin',
    level: 'admin'
  },
  {
    id: 'admin:roles',
    name: 'Gestion des rôles',
    description: 'Attribuer et modifier les rôles utilisateurs',
    category: 'admin',
    level: 'admin'
  },
  {
    id: 'admin:system',
    name: 'Administration système',
    description: 'Configuration système et logs',
    category: 'admin',
    level: 'admin'
  },
  
  // Permissions Opérations
  {
    id: 'operations:packages',
    name: 'Gestion des colis',
    description: 'Créer, modifier et suivre les colis',
    category: 'operations',
    level: 'write'
  },
  {
    id: 'operations:quotes',
    name: 'Gestion des devis',
    description: 'Créer et traiter les demandes de devis',
    category: 'operations',
    level: 'write'
  },
  {
    id: 'operations:clients',
    name: 'Gestion des clients',
    description: 'Gérer les informations clients',
    category: 'operations',
    level: 'write'
  },
  
  // Permissions Finances
  {
    id: 'finance:billing',
    name: 'Facturation',
    description: 'Générer et gérer les factures',
    category: 'finance',
    level: 'write'
  },
  {
    id: 'finance:payments',
    name: 'Paiements',
    description: 'Traiter les paiements et remboursements',
    category: 'finance',
    level: 'write'
  },
  {
    id: 'finance:reports',
    name: 'Rapports financiers',
    description: 'Consulter les rapports financiers',
    category: 'finance',
    level: 'read'
  },
  
  // Permissions Support
  {
    id: 'support:tickets',
    name: 'Gestion des tickets',
    description: 'Créer et traiter les tickets de support',
    category: 'support',
    level: 'write'
  },
  {
    id: 'support:chatbot',
    name: 'Configuration chatbot',
    description: 'Configurer l\'assistant IA',
    category: 'support',
    level: 'admin'
  },
  
  // Permissions Services
  {
    id: 'services:manage',
    name: 'Gestion des services',
    description: 'Gérer les services optionnels et tarifications',
    category: 'operations',
    level: 'write'
  }
]

// Rôles prédéfinis avec permissions
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [
    'pricing:read', 'pricing:write', 'pricing:admin',
    'admin:users', 'admin:roles', 'admin:system',
    'operations:packages', 'operations:quotes', 'operations:clients',
    'finance:billing', 'finance:payments', 'finance:reports',
    'support:tickets', 'support:chatbot', 'services:manage'
  ],
  ADMIN: [
    'pricing:read', 'pricing:write',
    'operations:packages', 'operations:quotes', 'operations:clients',
    'finance:billing', 'finance:payments', 'finance:reports',
    'support:tickets', 'services:manage'
  ],
  CLIENT: [
    'operations:quotes', 'support:tickets'
  ]
}

// Mock data pour les tenants
export const MOCK_TENANTS: TenantContext[] = [
  {
    id: 'tenant-1',
    name: 'Entreprise Logistique Sénégal',
    domain: 'logistique-senegal.com',
    subdomain: 'senegal',
    settings: {
      currency: 'XOF',
      vatRate: 18,
      timezone: 'Africa/Dakar',
      language: 'fr',
      features: ['multi-currency', 'advanced-reporting', 'whatsapp-integration']
    },
    subscription: {
      planId: 'business',
      status: 'active',
      expiresAt: '2024-12-31T23:59:59Z'
    },
    branding: {
      logo: '/tenant-logos/senegal.png',
      primaryColor: '#10B981',
      secondaryColor: '#059669'
    }
  },
  {
    id: 'tenant-2',
    name: 'Mali Express Cargo',
    domain: 'mali-express.com',
    subdomain: 'mali',
    settings: {
      currency: 'XOF',
      vatRate: 18,
      timezone: 'Africa/Bamako',
      language: 'fr',
      features: ['basic-reporting', 'email-notifications']
    },
    subscription: {
      planId: 'basic',
      status: 'active',
      expiresAt: '2024-12-31T23:59:59Z'
    },
    branding: {
      logo: '/tenant-logos/mali.png',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706'
    }
  }
]

// Classe pour gérer le contexte tenant
export class TenantContextManager {
  private static instance: TenantContextManager
  private currentTenant: TenantContext | null = null
  private userPermissions: UserPermissions | null = null

  static getInstance(): TenantContextManager {
    if (!TenantContextManager.instance) {
      TenantContextManager.instance = new TenantContextManager()
    }
    return TenantContextManager.instance
  }

  // Résoudre le tenant depuis le domaine ou header
  resolveTenant(domain?: string, tenantId?: string): TenantContext | null {
    if (tenantId) {
      return MOCK_TENANTS.find(t => t.id === tenantId) || null
    }
    
    if (domain) {
      return MOCK_TENANTS.find(t => 
        t.domain === domain || 
        (t.subdomain && domain.includes(t.subdomain))
      ) || null
    }
    
    return null
  }

  // Définir le contexte tenant actuel
  setCurrentTenant(tenant: TenantContext) {
    this.currentTenant = tenant
  }

  // Obtenir le contexte tenant actuel
  getCurrentTenant(): TenantContext | null {
    return this.currentTenant
  }

  // Définir les permissions utilisateur
  setUserPermissions(permissions: UserPermissions) {
    this.userPermissions = permissions
  }

  // Obtenir les permissions utilisateur
  getUserPermissions(): UserPermissions | null {
    return this.userPermissions
  }

  // Vérifier si l'utilisateur a une permission
  hasPermission(permission: string): boolean {
    if (!this.userPermissions) return false
    
    // Super admin a toutes les permissions
    if (this.userPermissions.role === 'SUPER_ADMIN') return true
    
    return this.userPermissions.permissions.includes(permission)
  }

  // Vérifier si l'utilisateur peut accéder à une ressource
  canAccessResource(resource: string, action: 'read' | 'write' | 'delete' = 'read'): boolean {
    const permission = `${resource}:${action}`
    return this.hasPermission(permission)
  }

  // Filtrer les données selon le contexte tenant
  filterByTenant<T extends { tenantId?: string }>(data: T[]): T[] {
    if (!this.currentTenant) return []
    
    // Super admin voit tout
    if (this.userPermissions?.role === 'SUPER_ADMIN') return data
    
    // Filtrer par tenant
    return data.filter(item => item.tenantId === this.currentTenant?.id)
  }

  // Valider l'accès à un tenant
  validateTenantAccess(targetTenantId: string): boolean {
    if (!this.userPermissions) return false
    
    // Super admin peut accéder à tous les tenants
    if (this.userPermissions.role === 'SUPER_ADMIN') return true
    
    // Utilisateur ne peut accéder qu'à son tenant
    return this.userPermissions.tenantId === targetTenantId
  }

  // Obtenir les permissions par rôle
  getPermissionsByRole(role: string): string[] {
    return ROLE_PERMISSIONS[role] || []
  }

  // Créer un contexte utilisateur
  createUserContext(userId: string, role: string, tenantId?: string): UserPermissions {
    return {
      role: role as 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT',
      tenantId,
      permissions: this.getPermissionsByRole(role),
      restrictions: this.getRoleRestrictions(role, tenantId)
    }
  }

  // Obtenir les restrictions par rôle
  private getRoleRestrictions(role: string, tenantId?: string): UserPermissions['restrictions'] {
    const tenant = tenantId ? this.resolveTenant(undefined, tenantId) : null
    
    switch (role) {
      case 'CLIENT':
        return {
          maxClients: 0, // Les clients ne peuvent pas créer d'autres clients
          maxPackages: 50,
          features: ['basic-tracking', 'quote-requests']
        }
      case 'ADMIN':
        return {
          maxClients: 1000,
          maxPackages: 10000,
          features: tenant?.settings.features || ['basic-reporting']
        }
      case 'SUPER_ADMIN':
        return undefined // Aucune restriction
      default:
        return {
          maxClients: 0,
          maxPackages: 0,
          features: []
        }
    }
  }
}

// Utilitaires pour les composants React
export const useTenantContext = () => {
  const manager = TenantContextManager.getInstance()
  return {
    tenant: manager.getCurrentTenant(),
    permissions: manager.getUserPermissions(),
    hasPermission: (permission: string) => manager.hasPermission(permission),
    canAccess: (resource: string, action: 'read' | 'write' | 'delete' = 'read') => 
      manager.canAccessResource(resource, action)
  }
}

// Middleware pour les API routes
export const withTenantContext = (handler: any) => {
  return async (req: any, res: any) => {
    const manager = TenantContextManager.getInstance()
    
    // Résoudre le tenant depuis les headers
    const tenantId = req.headers['x-tenant-id']
    const domain = req.headers['host']
    
    const tenant = manager.resolveTenant(domain, tenantId)
    if (tenant) {
      manager.setCurrentTenant(tenant)
    }
    
    // Ajouter le contexte à la requête
    req.tenantContext = {
      tenant,
      manager
    }
    
    return handler(req, res)
  }
}

// Hook pour vérifier les permissions dans les composants
export const usePermissions = () => {
  const manager = TenantContextManager.getInstance()
  
  return {
    hasPermission: (permission: string) => manager.hasPermission(permission),
    canRead: (resource: string) => manager.canAccessResource(resource, 'read'),
    canWrite: (resource: string) => manager.canAccessResource(resource, 'write'),
    canDelete: (resource: string) => manager.canAccessResource(resource, 'delete'),
    isRole: (role: string) => manager.getUserPermissions()?.role === role,
    isSuperAdmin: () => manager.getUserPermissions()?.role === 'SUPER_ADMIN',
    isAdmin: () => manager.getUserPermissions()?.role === 'ADMIN',
    isClient: () => manager.getUserPermissions()?.role === 'CLIENT'
  }
}
