import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { PackageStatus, TransportMode } from '@/types'
import { PermissionService, applyCompanyFilter, Permission } from '@/lib/permissions'
import { UserRole } from '@prisma/client'

export interface UsePermissionsReturn {
  hasPermission: (permissionId: string) => boolean
  canAccessResource: (resource: string, action: string) => boolean
  isCompanyScoped: boolean
  userPermissions: Permission[]
  userRole: UserRole | null
  userCompanyId: string | null
  filterCompanyData: <T extends { companyId?: string }>(data: T[]) => T[]
  canAccessCompanyData: (targetCompanyId: string) => boolean
}

export function usePermissions(): UsePermissionsReturn {
  const { data: session } = useSession()
  
  const userRole = session?.user?.role as UserRole | null
  const userCompanyId = session?.user?.companyId as string | null

  const permissionHelpers = useMemo(() => {
    if (!userRole) {
      return {
        hasPermission: () => false,
        canAccessResource: () => false,
        isCompanyScoped: false,
        userPermissions: [],
        filterCompanyData: <T extends { companyId?: string }>(data: T[]) => [],
        canAccessCompanyData: () => false
      }
    }

    return {
      hasPermission: (permissionId: string) => 
        PermissionService.hasPermission(userRole, permissionId),
      
      canAccessResource: (resource: string, action: string) =>
        PermissionService.canAccessResource(userRole, resource, action),
      
      isCompanyScoped: PermissionService.isCompanyScoped(userRole),
      
      userPermissions: PermissionService.getUserPermissions(userRole),
      
      filterCompanyData: <T extends { companyId?: string }>(data: T[]) => {
        if (!userCompanyId) return []
        return applyCompanyFilter(data, userRole, userCompanyId)
      },
      
      canAccessCompanyData: (targetCompanyId: string) => {
        if (!userCompanyId) return false
        return PermissionService.canAccessCompanyData(userRole, userCompanyId, targetCompanyId)
      }
    }
  }, [userRole, userCompanyId])

  return {
    ...permissionHelpers,
    userRole,
    userCompanyId
  }
}

// Hook pour les données clients filtrées par entreprise
export function useCompanyClients() {
  const { filterCompanyData, canAccessResource } = usePermissions()
  
  // Mock data - en production, ceci viendrait d'une API
  const allClients = [
    { id: '1', name: 'Client A', companyId: 'company-1', email: 'clienta@test.com' },
    { id: '2', name: 'Client B', companyId: 'company-1', email: 'clientb@test.com' },
    { id: '3', name: 'Client C', companyId: 'company-2', email: 'clientc@test.com' },
    { id: '4', name: 'Client D', companyId: 'company-2', email: 'clientd@test.com' }
  ]

  const filteredClients = useMemo(() => {
    if (!canAccessResource('clients', 'view')) return []
    return filterCompanyData(allClients)
  }, [filterCompanyData, canAccessResource])

  return {
    clients: filteredClients,
    canViewClients: canAccessResource('clients', 'view'),
    canCreateClients: canAccessResource('clients', 'create'),
    canEditClients: canAccessResource('clients', 'edit'),
    canDeleteClients: canAccessResource('clients', 'delete')
  }
}

// Hook pour les employés filtrés par entreprise
export function useCompanyEmployees() {
  const { filterCompanyData, canAccessResource } = usePermissions()
  
  // Mock data - en production, ceci viendrait d'une API
  const allEmployees = [
    { id: '1', firstName: 'Marie', lastName: 'Diallo', name: 'Marie Diallo', email: 'marie@company1.com', companyId: 'company-1', position: 'Manager', department: 'Logistique', status: 'ACTIVE' as const, salary: 850000, hireDate: '2023-03-15', role: 'ADMIN' as const },
    { id: '2', firstName: 'Amadou', lastName: 'Sow', name: 'Amadou Sow', email: 'amadou@company1.com', companyId: 'company-1', position: 'Agent', department: 'Opérations', status: 'ACTIVE' as const, salary: 650000, hireDate: '2023-06-20', role: 'AGENT' as const },
    { id: '3', firstName: 'Fatou', lastName: 'Kane', name: 'Fatou Kane', email: 'fatou@company2.com', companyId: 'company-2', position: 'Responsable', department: 'Commercial', status: 'ACTIVE' as const, salary: 750000, hireDate: '2023-01-10', role: 'ADMIN' as const },
    { id: '4', firstName: 'Ibrahim', lastName: 'Diop', name: 'Ibrahim Diop', email: 'ibrahim@company2.com', companyId: 'company-2', position: 'Comptable', department: 'Finance', status: 'ON_LEAVE' as const, salary: 700000, hireDate: '2022-11-05', role: 'AGENT' as const }
  ]

  const filteredEmployees = useMemo(() => {
    if (!canAccessResource('employees', 'view')) return []
    return filterCompanyData(allEmployees)
  }, [filterCompanyData, canAccessResource])

  return {
    employees: filteredEmployees,
    canViewEmployees: canAccessResource('employees', 'view'),
    canManageEmployees: canAccessResource('employees', 'manage')
  }
}

// Hook pour les colis filtrés par entreprise
export function useCompanyPackages() {
  const { filterCompanyData, canAccessResource, userRole } = usePermissions()
  
  // Mock data - en production, ceci viendrait d'une API
  const allPackages = [
    { 
      id: '1', 
      packageId: 'PKG001',
      trackingNumber: 'PKG001', 
      companyId: 'company-1', 
      status: 'IN_TRANSIT' as PackageStatus, 
      clientId: '1',
      description: 'Colis électronique',
      weight: 2.5,
      transportMode: 'AERIAL' as TransportMode,
      trackingPin: 'A1B2C3',
      paymentStatus: 'PENDING' as const,
      client: { id: '1', clientId: 'CLI001', name: 'Jean Dupont', email: 'jean@example.com', phone: '+221701234567', companyId: 'company-1', createdAt: new Date() }
    },
    { 
      id: '2', 
      packageId: 'PKG002',
      trackingNumber: 'PKG002', 
      companyId: 'company-1', 
      status: 'ARRIVED' as PackageStatus, 
      clientId: '2',
      description: 'Vêtements',
      weight: 1.8,
      transportMode: 'MARITIME' as TransportMode,
      trackingPin: 'D4E5F6',
      paymentStatus: 'COMPLETED' as const,
      client: { id: '2', clientId: 'CLI002', name: 'Marie Martin', email: 'marie@example.com', phone: '+221702345678', companyId: 'company-1', createdAt: new Date() }
    },
    { 
      id: '3', 
      packageId: 'PKG003',
      trackingNumber: 'PKG003', 
      companyId: 'company-2', 
      status: 'PLANNED' as PackageStatus, 
      clientId: '3',
      description: 'Documents',
      weight: 0.5,
      transportMode: 'AERIAL_EXPRESS' as TransportMode,
      trackingPin: 'G7H8I9',
      paymentStatus: 'PENDING' as const,
      client: { id: '3', clientId: 'CLI003', name: 'Ahmed Diallo', email: 'ahmed@example.com', phone: '+221703456789', companyId: 'company-2', createdAt: new Date() }
    },
    { 
      id: '4', 
      packageId: 'PKG004',
      trackingNumber: 'PKG004', 
      companyId: 'company-2', 
      status: 'IN_TRANSIT' as PackageStatus, 
      clientId: '4',
      description: 'Produits cosmétiques',
      weight: 3.2,
      transportMode: 'MARITIME_EXPRESS' as TransportMode,
      trackingPin: 'J1K2L3',
      paymentStatus: 'PARTIAL' as const,
      client: { id: '4', clientId: 'CLI004', name: 'Fatou Seck', email: 'fatou@example.com', phone: '+221704567890', companyId: 'company-2', createdAt: new Date() }
    }
  ]

  const filteredPackages = useMemo(() => {
    if (!canAccessResource('packages', 'view')) return []
    
    let packages = filterCompanyData(allPackages)
    
    // Si c'est un CLIENT, ne montrer que ses propres colis
    if (userRole === 'CLIENT') {
      // En production, filtrer par session?.user?.id
      packages = packages.filter(pkg => pkg.clientId === '1') // Mock client ID
    }
    
    return packages
  }, [filterCompanyData, canAccessResource, userRole])

  return {
    packages: filteredPackages,
    canViewPackages: canAccessResource('packages', 'view'),
    canCreatePackages: canAccessResource('packages', 'create'),
    canEditPackages: canAccessResource('packages', 'edit')
  }
}

// Hook pour les statistiques filtrées par entreprise
export function useCompanyStats() {
  const { userRole, userCompanyId, canAccessResource } = usePermissions()
  
  // Mock data - en production, ceci viendrait d'une API avec filtrage côté serveur
  const allStats = {
    'company-1': {
      totalPackages: 156,
      revenue: 45600,
      inTransit: 23,
      delivered: 133,
      clients: 45,
      employees: 12
    },
    'company-2': {
      totalPackages: 89,
      revenue: 28900,
      inTransit: 15,
      delivered: 74,
      clients: 28,
      employees: 8
    }
  }

  const companyStats = useMemo(() => {
    if (!canAccessResource('dashboard', 'view')) return null
    
    if (userRole === 'SUPER_ADMIN') {
      // SUPER_ADMIN voit les stats globales
      const globalStats = Object.values(allStats).reduce((acc, stats) => ({
        totalPackages: acc.totalPackages + stats.totalPackages,
        revenue: acc.revenue + stats.revenue,
        inTransit: acc.inTransit + stats.inTransit,
        delivered: acc.delivered + stats.delivered,
        clients: acc.clients + stats.clients,
        employees: acc.employees + stats.employees
      }), { totalPackages: 0, revenue: 0, inTransit: 0, delivered: 0, clients: 0, employees: 0 })
      
      return globalStats
    }
    
    // Les autres rôles voient uniquement les stats de leur entreprise
    return userCompanyId ? allStats[userCompanyId as keyof typeof allStats] || null : null
  }, [userRole, userCompanyId, canAccessResource])

  return {
    stats: companyStats,
    canViewStats: canAccessResource('dashboard', 'view')
  }
}
