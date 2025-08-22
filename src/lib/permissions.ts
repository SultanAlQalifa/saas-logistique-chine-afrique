import { UserRole } from '@prisma/client'

export interface Permission {
  id: string
  name: string
  description: string
  category: string
  resource: string
  action: string
}

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
  companyScoped: boolean // Si true, l'utilisateur ne voit que les données de son entreprise
}

// Permissions système
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: {
    id: 'dashboard.view',
    name: 'Voir le dashboard',
    description: 'Accès au tableau de bord principal',
    category: 'Dashboard',
    resource: 'dashboard',
    action: 'view'
  },
  DASHBOARD_MANAGE: {
    id: 'dashboard.manage',
    name: 'Gérer le dashboard',
    description: 'Personnaliser et configurer le dashboard',
    category: 'Dashboard',
    resource: 'dashboard',
    action: 'manage'
  },

  // Clients - Scoped par entreprise
  CLIENTS_VIEW: {
    id: 'clients.view',
    name: 'Voir les clients',
    description: 'Consulter la liste des clients de l\'entreprise',
    category: 'Clients',
    resource: 'clients',
    action: 'view'
  },
  CLIENTS_CREATE: {
    id: 'clients.create',
    name: 'Créer des clients',
    description: 'Ajouter de nouveaux clients',
    category: 'Clients',
    resource: 'clients',
    action: 'create'
  },
  CLIENTS_EDIT: {
    id: 'clients.edit',
    name: 'Modifier les clients',
    description: 'Éditer les informations clients',
    category: 'Clients',
    resource: 'clients',
    action: 'edit'
  },
  CLIENTS_DELETE: {
    id: 'clients.delete',
    name: 'Supprimer les clients',
    description: 'Supprimer des clients',
    category: 'Clients',
    resource: 'clients',
    action: 'delete'
  },

  // RH - Scoped par entreprise
  HR_EMPLOYEES_VIEW: {
    id: 'hr.employees.view',
    name: 'Voir les employés',
    description: 'Consulter la liste des employés de l\'entreprise',
    category: 'RH',
    resource: 'employees',
    action: 'view'
  },
  HR_EMPLOYEES_MANAGE: {
    id: 'hr.employees.manage',
    name: 'Gérer les employés',
    description: 'Créer, modifier et supprimer des employés',
    category: 'RH',
    resource: 'employees',
    action: 'manage'
  },
  HR_POLICIES_VIEW: {
    id: 'hr.policies.view',
    name: 'Voir les politiques RH',
    description: 'Consulter les politiques RH de l\'entreprise',
    category: 'RH',
    resource: 'policies',
    action: 'view'
  },
  HR_POLICIES_MANAGE: {
    id: 'hr.policies.manage',
    name: 'Gérer les politiques RH',
    description: 'Créer et modifier les politiques RH',
    category: 'RH',
    resource: 'policies',
    action: 'manage'
  },
  HR_PAYROLL_VIEW: {
    id: 'hr.payroll.view',
    name: 'Voir la paie',
    description: 'Consulter les informations de paie',
    category: 'RH',
    resource: 'payroll',
    action: 'view'
  },
  HR_PAYROLL_MANAGE: {
    id: 'hr.payroll.manage',
    name: 'Gérer la paie',
    description: 'Gérer les salaires et la paie',
    category: 'RH',
    resource: 'payroll',
    action: 'manage'
  },

  // Colis - Scoped par entreprise
  PACKAGES_VIEW: {
    id: 'packages.view',
    name: 'Voir les colis',
    description: 'Consulter les colis de l\'entreprise',
    category: 'Colis',
    resource: 'packages',
    action: 'view'
  },
  PACKAGES_CREATE: {
    id: 'packages.create',
    name: 'Créer des colis',
    description: 'Créer de nouveaux colis',
    category: 'Colis',
    resource: 'packages',
    action: 'create'
  },
  PACKAGES_EDIT: {
    id: 'packages.edit',
    name: 'Modifier les colis',
    description: 'Éditer les informations des colis',
    category: 'Colis',
    resource: 'packages',
    action: 'edit'
  },

  // Finances - Scoped par entreprise
  FINANCES_VIEW: {
    id: 'finances.view',
    name: 'Voir les finances',
    description: 'Consulter les données financières de l\'entreprise',
    category: 'Finances',
    resource: 'finances',
    action: 'view'
  },
  FINANCES_MANAGE: {
    id: 'finances.manage',
    name: 'Gérer les finances',
    description: 'Gérer les finances de l\'entreprise',
    category: 'Finances',
    resource: 'finances',
    action: 'manage'
  },

  // Services - Scoped par entreprise
  SERVICES_VIEW: {
    id: 'services.view',
    name: 'Voir les services',
    description: 'Consulter les services de l\'entreprise',
    category: 'Services',
    resource: 'services',
    action: 'view'
  },
  SERVICES_MANAGE: {
    id: 'services.manage',
    name: 'Gérer les services',
    description: 'Gérer les services de l\'entreprise',
    category: 'Services',
    resource: 'services',
    action: 'manage'
  },

  // Administration système (SUPER_ADMIN uniquement)
  SYSTEM_USERS_MANAGE: {
    id: 'system.users.manage',
    name: 'Gérer tous les utilisateurs',
    description: 'Gérer tous les utilisateurs du système',
    category: 'Système',
    resource: 'system_users',
    action: 'manage'
  },
  SYSTEM_COMPANIES_MANAGE: {
    id: 'system.companies.manage',
    name: 'Gérer les entreprises',
    description: 'Créer et gérer les entreprises',
    category: 'Système',
    resource: 'companies',
    action: 'manage'
  },
  SYSTEM_SETTINGS_MANAGE: {
    id: 'system.settings.manage',
    name: 'Gérer les paramètres système',
    description: 'Configurer les paramètres globaux',
    category: 'Système',
    resource: 'system_settings',
    action: 'manage'
  }
} as const

// Configuration des rôles avec leurs permissions
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    companyScoped: false, // Voit tout le système
    permissions: Object.values(PERMISSIONS)
  },
  
  ADMIN: {
    role: 'ADMIN',
    companyScoped: true, // Limité à son entreprise
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DASHBOARD_MANAGE,
      PERMISSIONS.CLIENTS_VIEW,
      PERMISSIONS.CLIENTS_CREATE,
      PERMISSIONS.CLIENTS_EDIT,
      PERMISSIONS.CLIENTS_DELETE,
      PERMISSIONS.HR_EMPLOYEES_VIEW,
      PERMISSIONS.HR_EMPLOYEES_MANAGE,
      PERMISSIONS.HR_POLICIES_VIEW,
      PERMISSIONS.HR_POLICIES_MANAGE,
      PERMISSIONS.HR_PAYROLL_VIEW,
      PERMISSIONS.HR_PAYROLL_MANAGE,
      PERMISSIONS.PACKAGES_VIEW,
      PERMISSIONS.PACKAGES_CREATE,
      PERMISSIONS.PACKAGES_EDIT,
      PERMISSIONS.SERVICES_VIEW,
      PERMISSIONS.SERVICES_MANAGE,
      PERMISSIONS.FINANCES_VIEW,
      PERMISSIONS.FINANCES_MANAGE
    ]
  },

  AGENT: {
    role: 'AGENT',
    companyScoped: true, // Limité à son entreprise
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.CLIENTS_VIEW,
      PERMISSIONS.CLIENTS_CREATE,
      PERMISSIONS.CLIENTS_EDIT,
      PERMISSIONS.HR_EMPLOYEES_VIEW,
      PERMISSIONS.HR_POLICIES_VIEW,
      PERMISSIONS.PACKAGES_VIEW,
      PERMISSIONS.PACKAGES_CREATE,
      PERMISSIONS.PACKAGES_EDIT,
      PERMISSIONS.FINANCES_VIEW
    ]
  },

  AFFILIATE: {
    role: 'AFFILIATE',
    companyScoped: true, // Limité à son entreprise
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.CLIENTS_VIEW,
      PERMISSIONS.PACKAGES_VIEW,
      PERMISSIONS.PACKAGES_CREATE,
      PERMISSIONS.HR_POLICIES_VIEW
    ]
  },

  CLIENT: {
    role: 'CLIENT',
    companyScoped: true, // Voit uniquement ses propres données
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PACKAGES_VIEW
    ]
  }
}

// Service de vérification des permissions
export class PermissionService {
  static hasPermission(userRole: UserRole, permissionId: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole]
    return rolePermissions.permissions.some(p => p.id === permissionId)
  }

  static isCompanyScoped(userRole: UserRole): boolean {
    return ROLE_PERMISSIONS[userRole].companyScoped
  }

  static getUserPermissions(userRole: UserRole): Permission[] {
    return ROLE_PERMISSIONS[userRole].permissions
  }

  static canAccessResource(userRole: UserRole, resource: string, action: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole]
    return rolePermissions.permissions.some(p => 
      p.resource === resource && p.action === action
    )
  }

  // Vérifie si l'utilisateur peut accéder aux données d'une autre entreprise
  static canAccessCompanyData(userRole: UserRole, userCompanyId: string, targetCompanyId: string): boolean {
    // SUPER_ADMIN peut tout voir
    if (userRole === 'SUPER_ADMIN') return true
    
    // Les autres rôles ne peuvent voir que leur propre entreprise
    return userCompanyId === targetCompanyId
  }
}

// Types pour les filtres de données
export interface DataFilter {
  companyId?: string
  userId?: string
  role?: UserRole
}

// Middleware pour filtrer les données selon les permissions
export function applyCompanyFilter<T extends { companyId?: string }>(
  data: T[],
  userRole: UserRole,
  userCompanyId: string
): T[] {
  // SUPER_ADMIN voit tout
  if (userRole === 'SUPER_ADMIN') {
    return data
  }

  // Les autres rôles ne voient que les données de leur entreprise
  return data.filter(item => item.companyId === userCompanyId)
}
