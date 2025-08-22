'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TenantContextManager, TenantContext, MOCK_TENANTS } from '@/lib/tenant-context'
import { Building, Globe, Settings } from 'lucide-react'

interface TenantSelectorProps {
  onTenantChange?: (tenant: TenantContext | null) => void
  showFullInfo?: boolean
  className?: string
}

export function TenantSelector({ onTenantChange, showFullInfo = false, className }: TenantSelectorProps) {
  const { data: session } = useSession()
  const [selectedTenant, setSelectedTenant] = useState<TenantContext | null>(null)
  const [availableTenants, setAvailableTenants] = useState<TenantContext[]>([])

  useEffect(() => {
    const manager = TenantContextManager.getInstance()
    
    // Super Admin peut voir tous les tenants
    if (session?.user?.role === 'SUPER_ADMIN') {
      setAvailableTenants(MOCK_TENANTS)
    } else if (session?.user?.companyId) {
      // Autres rôles ne voient que leur tenant
      const userTenant = manager.resolveTenant(undefined, session.user.companyId)
      setAvailableTenants(userTenant ? [userTenant] : [])
      setSelectedTenant(userTenant)
    }
  }, [session])

  const handleTenantChange = (tenantId: string) => {
    const tenant = availableTenants.find(t => t.id === tenantId) || null
    setSelectedTenant(tenant)
    
    // Mettre à jour le contexte global
    const manager = TenantContextManager.getInstance()
    if (tenant) {
      manager.setCurrentTenant(tenant)
    }
    
    onTenantChange?.(tenant)
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency
  }

  if (availableTenants.length === 0) {
    return null
  }

  // Si un seul tenant disponible, afficher juste les infos
  if (availableTenants.length === 1 && !showFullInfo) {
    const tenant = availableTenants[0]
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Building className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">{tenant.name}</span>
        <Badge variant="outline" className="text-xs">
          {tenant.settings.currency}
        </Badge>
      </div>
    )
  }

  return (
    <div className={className}>
      {showFullInfo ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="h-5 w-5" />
              Contexte Tenant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Sélectionner un tenant
              </label>
              <Select value={selectedTenant?.id || ''} onValueChange={handleTenantChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un tenant..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{tenant.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {tenant.settings.currency}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTenant && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nom:</span>
                  <span className="text-sm">{selectedTenant.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Domaine:</span>
                  <span className="text-sm text-blue-600">{selectedTenant.domain}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Devise:</span>
                  <Badge variant="outline">{selectedTenant.settings.currency}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">TVA:</span>
                  <span className="text-sm">{selectedTenant.settings.vatRate}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fuseau:</span>
                  <span className="text-sm">{selectedTenant.settings.timezone}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Plan:</span>
                  <Badge 
                    variant={selectedTenant.subscription.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {selectedTenant.subscription.planId} - {selectedTenant.subscription.status}
                  </Badge>
                </div>
                
                {selectedTenant.settings.features.length > 0 && (
                  <div>
                    <span className="text-sm font-medium block mb-2">Fonctionnalités:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedTenant.settings.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Select value={selectedTenant?.id || ''} onValueChange={handleTenantChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Sélectionner un tenant..." />
          </SelectTrigger>
          <SelectContent>
            {availableTenants.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.id}>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>{tenant.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {tenant.settings.currency}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

// Hook pour utiliser le tenant sélectionné
export function useSelectedTenant() {
  const manager = TenantContextManager.getInstance()
  const [tenant, setTenant] = useState<TenantContext | null>(manager.getCurrentTenant())

  useEffect(() => {
    // Écouter les changements de tenant
    const interval = setInterval(() => {
      const currentTenant = manager.getCurrentTenant()
      if (currentTenant?.id !== tenant?.id) {
        setTenant(currentTenant)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [tenant])

  return tenant
}
