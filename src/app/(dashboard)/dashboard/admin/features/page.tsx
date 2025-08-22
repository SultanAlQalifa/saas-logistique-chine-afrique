'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  Users,
  Package,
  Zap,
  Shield
} from 'lucide-react'
import { NextMoveSaaSFeatures, Feature } from '@/lib/feature-flags'

interface FeatureWithStatus extends Feature {
  enabled?: boolean
  tenantCount?: number
}

interface TenantFeatureMapping {
  tenantId: string
  tenantName: string
  features: string[]
  planId: string
  planName: string
  addonIds: string[]
}

export default function AdminFeaturesPage() {
  const { data: session } = useSession()
  
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès Restreint</h2>
            <p className="text-gray-600">
              Cette page est réservée aux Super Administrateurs.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <AdminFeaturesPageContent />
}

function AdminFeaturesPageContent() {
  const [features, setFeatures] = useState<FeatureWithStatus[]>([])
  const [tenantMappings, setTenantMappings] = useState<TenantFeatureMapping[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedModule, setSelectedModule] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  // Charger les données initiales
  useEffect(() => {
    loadFeatures()
    loadTenantMappings()
  }, [])

  const loadFeatures = async () => {
    try {
      // Pour l'instant, utiliser les données mock
      const allFeatures = NextMoveSaaSFeatures.getAllFeatures()
      const featuresWithStats = allFeatures.map(feature => ({
        ...feature,
        enabled: true,
        tenantCount: Math.floor(Math.random() * 10) + 1
      }))
      setFeatures(featuresWithStats)
    } catch (error) {
      console.error('Erreur lors du chargement des features:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTenantMappings = async () => {
    try {
      // Données mock pour les mappings tenant-features
      const mockMappings: TenantFeatureMapping[] = [
        {
          tenantId: 'tenant_1',
          tenantName: 'LogiTrans SARL',
          features: ['DASHBOARD_ANALYTICS', 'PACKAGE_TRACKING', 'CLIENT_MANAGEMENT'],
          planId: 'starter',
          planName: 'Starter',
          addonIds: ['analytics_pro']
        },
        {
          tenantId: 'tenant_2', 
          tenantName: 'Cargo Express',
          features: ['DASHBOARD_ANALYTICS', 'PACKAGE_TRACKING', 'CLIENT_MANAGEMENT', 'ADVANCED_REPORTS'],
          planId: 'professional',
          planName: 'Professional',
          addonIds: []
        }
      ]
      setTenantMappings(mockMappings)
    } catch (error) {
      console.error('Erreur lors du chargement des mappings:', error)
    }
  }

  // Filtrer les features
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory
    const matchesModule = selectedModule === 'all' || feature.category === selectedModule
    
    return matchesSearch && matchesCategory && matchesModule
  })

  // Obtenir les catégories et modules uniques
  const categories = Array.from(new Set(features.map(f => f.category)))
  const modules = Array.from(new Set(features.map(f => f.category)))

  const stats = {
    totalFeatures: features.length,
    activeFeatures: features.filter(f => f.active).length,
    totalTenants: tenantMappings.length,
    avgFeaturesPerTenant: tenantMappings.length > 0 
      ? Math.round(tenantMappings.reduce((sum, t) => sum + t.features.length, 0) / tenantMappings.length)
      : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des features...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Gestion des Features</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Configuration centralisée des fonctionnalités SaaS et contrôle d'accès par tenant
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalFeatures}</p>
                <p className="text-sm text-gray-600">Features Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ToggleRight className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.activeFeatures}</p>
                <p className="text-sm text-gray-600">Features Actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.totalTenants}</p>
                <p className="text-sm text-gray-600">Tenants Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.avgFeaturesPerTenant}</p>
                <p className="text-sm text-gray-600">Moy. Features/Tenant</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Features Disponibles</TabsTrigger>
          <TabsTrigger value="mappings">Mappings Tenants</TabsTrigger>
          <TabsTrigger value="plans">Plans & Add-ons</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {/* Filtres et recherche */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une feature..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Tous les modules</option>
                  {modules.map(mod => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Feature
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des features */}
          <div className="grid gap-4">
            {filteredFeatures.map((feature) => (
              <Card key={feature.code} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{feature.name}</h3>
                        <Badge variant={feature.active ? 'default' : 'secondary'}>
                          {feature.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">{feature.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{feature.description}</p>
                      <p className="text-sm text-gray-500">
                        Code: <code className="bg-gray-100 px-2 py-1 rounded">{feature.code}</code>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <p className="text-sm text-gray-500">Utilisé par</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {feature.tenantCount} tenants
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={feature.active ? "outline" : "default"} 
                        size="sm"
                      >
                        {feature.active ? (
                          <ToggleLeft className="h-4 w-4" />
                        ) : (
                          <ToggleRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mappings" className="space-y-6">
          <div className="grid gap-4">
            {tenantMappings.map((mapping) => (
              <Card key={mapping.tenantId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{mapping.tenantName}</span>
                    <div className="flex gap-2">
                      <Badge>{mapping.planName}</Badge>
                      <Badge variant="outline">{mapping.features.length} features</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Features Actives:</h4>
                      <div className="flex flex-wrap gap-2">
                        {mapping.features.map(featureCode => {
                          const feature = features.find(f => f.code === featureCode)
                          return (
                            <Badge key={featureCode} variant="secondary">
                              {feature?.name || featureCode}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                    {mapping.addonIds.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Add-ons:</h4>
                        <div className="flex flex-wrap gap-2">
                          {mapping.addonIds.map(addonId => (
                            <Badge key={addonId} variant="outline">
                              {addonId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Modifier Features
                      </Button>
                      <Button variant="outline" size="sm">
                        Synchroniser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Configuration Plans & Add-ons</h3>
                <p className="text-gray-600 mb-4">
                  Gérez les mappings entre les plans, add-ons et features disponibles.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Configurer les Mappings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
