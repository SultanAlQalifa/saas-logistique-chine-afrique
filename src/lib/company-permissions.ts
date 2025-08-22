export interface CompanyPermissions {
  id: string
  companyId: string
  hrModule: boolean
  marketingModule: boolean
  financeModule: boolean
  supportModule: boolean
  analyticsModule: boolean
  integrationsModule: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CompanyModuleConfig {
  module: string
  label: string
  description: string
  icon: string
  defaultEnabled: boolean
  requiresPlan?: string[]
}

export const COMPANY_MODULES: CompanyModuleConfig[] = [
  {
    module: 'hrModule',
    label: 'Ressources Humaines',
    description: 'Gestion des employés, recrutement, formations et administration RH',
    icon: 'Users',
    defaultEnabled: false,
    requiresPlan: ['ENTERPRISE', 'PREMIUM']
  },
  {
    module: 'marketingModule',
    label: 'Marketing & Publicité',
    description: 'Campagnes marketing, publicités centralisées et promotions',
    icon: 'TrendingUp',
    defaultEnabled: true
  },
  {
    module: 'financeModule',
    label: 'Finances & Comptabilité',
    description: 'Paiements, facturation, comptabilité et remboursements',
    icon: 'CreditCard',
    defaultEnabled: true
  },
  {
    module: 'supportModule',
    label: 'Support Client',
    description: 'Tickets, chat support, WhatsApp Business et assistance',
    icon: 'MessageSquare',
    defaultEnabled: true
  },
  {
    module: 'analyticsModule',
    label: 'Analytics & Rapports',
    description: 'Statistiques avancées, rapports et tableaux de bord',
    icon: 'BarChart3',
    defaultEnabled: true
  },
  {
    module: 'integrationsModule',
    label: 'Intégrations & APIs',
    description: 'Intégrations tierces, APIs et webhooks',
    icon: 'Globe',
    defaultEnabled: false,
    requiresPlan: ['ENTERPRISE']
  }
]

// Mock data pour les permissions des entreprises
export const mockCompanyPermissions: CompanyPermissions[] = [
  {
    id: 'perm-001',
    companyId: 'logitrans-senegal',
    hrModule: true,
    marketingModule: true,
    financeModule: true,
    supportModule: true,
    analyticsModule: true,
    integrationsModule: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'perm-002',
    companyId: 'sahara-express',
    hrModule: false,
    marketingModule: true,
    financeModule: true,
    supportModule: true,
    analyticsModule: false,
    integrationsModule: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  }
]

export class CompanyPermissionService {
  static getCompanyPermissions(companyId: string): CompanyPermissions | null {
    return mockCompanyPermissions.find(p => p.companyId === companyId) || null
  }

  static hasModuleAccess(companyId: string, module: keyof Omit<CompanyPermissions, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>): boolean {
    const permissions = this.getCompanyPermissions(companyId)
    if (!permissions) return false
    return permissions[module]
  }

  static updateModulePermission(
    companyId: string, 
    module: keyof Omit<CompanyPermissions, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>, 
    enabled: boolean
  ): boolean {
    const permissionIndex = mockCompanyPermissions.findIndex(p => p.companyId === companyId)
    if (permissionIndex === -1) return false

    mockCompanyPermissions[permissionIndex] = {
      ...mockCompanyPermissions[permissionIndex],
      [module]: enabled,
      updatedAt: new Date()
    }
    return true
  }

  static getAvailableModules(companyId: string): CompanyModuleConfig[] {
    const permissions = this.getCompanyPermissions(companyId)
    if (!permissions) return []

    return COMPANY_MODULES.filter(module => {
      const moduleKey = module.module as keyof Omit<CompanyPermissions, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>
      return permissions[moduleKey]
    })
  }

  static createDefaultPermissions(companyId: string): CompanyPermissions {
    const newPermissions: CompanyPermissions = {
      id: `perm-${Date.now()}`,
      companyId,
      hrModule: false,
      marketingModule: true,
      financeModule: true,
      supportModule: true,
      analyticsModule: true,
      integrationsModule: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    mockCompanyPermissions.push(newPermissions)
    return newPermissions
  }
}
