'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Zap, DollarSign, Eye, Settings, Code, Palette, Network, BarChart3, Headphones } from 'lucide-react'
import { OwnerFeatureAddon, MultiTenantPricingMockData } from '@/lib/multi-tenant-pricing'

function AdminSaasFeaturesPageContent() {
  const { data: session } = useSession()
  const [featureAddons, setFeatureAddons] = useState<OwnerFeatureAddon[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAddon, setEditingAddon] = useState<OwnerFeatureAddon | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newAddon, setNewAddon] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'API' as OwnerFeatureAddon['category'],
    price_month_eur: 0,
    price_year_eur: 0,
    active: true
  })

  useEffect(() => {
    fetchFeatureAddons()
  }, [])

  const fetchFeatureAddons = async () => {
    try {
      // Simulation avec mock data
      const mockData = MultiTenantPricingMockData.createOwnerFeatureAddons()
      setFeatureAddons(mockData)
    } catch (error) {
      console.error('Erreur lors du chargement des add-ons SaaS:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAddon = async () => {
    try {
      const newFeatureAddon: OwnerFeatureAddon = {
        id: `owner-feature-${Date.now()}`,
        ...newAddon,
        slug: newAddon.name.toLowerCase().replace(/\s+/g, '-'),
        display_order: featureAddons.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setFeatureAddons([...featureAddons, newFeatureAddon])
      setShowCreateDialog(false)
      setNewAddon({
        name: '',
        slug: '',
        description: '',
        category: 'API',
        price_month_eur: 0,
        price_year_eur: 0,
        active: true
      })
    } catch (error) {
      console.error('Erreur lors de la création de l\'add-on SaaS:', error)
    }
  }

  const handleUpdateAddon = async (addonId: string, updates: Partial<OwnerFeatureAddon>) => {
    try {
      setFeatureAddons(featureAddons.map(addon => 
        addon.id === addonId ? { ...addon, ...updates, updated_at: new Date().toISOString() } : addon
      ))
      setEditingAddon(null)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'add-on SaaS:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' €'
  }

  const getCategoryIcon = (category: OwnerFeatureAddon['category']) => {
    switch (category) {
      case 'API': return Code
      case 'White-label': return Palette
      case 'Integrations': return Network
      case 'Support': return Headphones
      case 'Analytics': return BarChart3
      case 'Personnalisation': return Settings
      default: return Zap
    }
  }

  const getCategoryColor = (category: OwnerFeatureAddon['category']) => {
    switch (category) {
      case 'API': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'White-label': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Integrations': return 'bg-green-100 text-green-800 border-green-200'
      case 'Support': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Analytics': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'Personnalisation': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Zap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">⚡ Add-ons SaaS Plateforme</h1>
            <p className="text-blue-100 text-lg">Fonctionnalités avancées facturées aux Entreprises</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Add-ons Actifs</span>
            </div>
            <p className="text-2xl font-bold mt-1">{featureAddons.filter(a => a.active).length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="font-medium">Revenus Mensuels</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {formatPrice(featureAddons.filter(a => a.active).reduce((sum, a) => sum + a.price_month_eur, 0))}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Catégories</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {new Set(featureAddons.map(a => a.category)).size}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Prix Moyen</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {formatPrice(featureAddons.length > 0 ? featureAddons.reduce((sum, a) => sum + a.price_month_eur, 0) / featureAddons.length : 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Add-ons SaaS Configurés</h2>
          <p className="text-gray-600">Fonctionnalités avancées de la plateforme vendues aux entreprises</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Add-on SaaS
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un Add-on SaaS</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle fonctionnalité avancée de la plateforme
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la Fonctionnalité</Label>
                <Input
                  id="name"
                  value={newAddon.name}
                  onChange={(e) => setNewAddon({...newAddon, name: e.target.value})}
                  placeholder="Ex: API Avancée, White-label Branding"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAddon.description}
                  onChange={(e) => setNewAddon({...newAddon, description: e.target.value})}
                  placeholder="Description détaillée de la fonctionnalité"
                  rows={3}
                />
              </div>

              <div>
                <Label>Catégorie</Label>
                <Select value={newAddon.category} onValueChange={(value: OwnerFeatureAddon['category']) => setNewAddon({...newAddon, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="API">🔌 API</SelectItem>
                    <SelectItem value="White-label">🎨 White-label</SelectItem>
                    <SelectItem value="Integrations">🔗 Intégrations</SelectItem>
                    <SelectItem value="Support">🎧 Support</SelectItem>
                    <SelectItem value="Analytics">📊 Analytics</SelectItem>
                    <SelectItem value="Personnalisation">⚙️ Personnalisation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prix Mensuel (€)</Label>
                  <Input
                    type="number"
                    value={newAddon.price_month_eur}
                    onChange={(e) => setNewAddon({...newAddon, price_month_eur: parseFloat(e.target.value) || 0})}
                    placeholder="29"
                  />
                </div>
                <div>
                  <Label>Prix Annuel (€)</Label>
                  <Input
                    type="number"
                    value={newAddon.price_year_eur}
                    onChange={(e) => setNewAddon({...newAddon, price_year_eur: parseFloat(e.target.value) || 0})}
                    placeholder="290"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newAddon.active}
                  onCheckedChange={(checked) => setNewAddon({...newAddon, active: checked})}
                />
                <Label htmlFor="active">Fonctionnalité Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateAddon} disabled={!newAddon.name || !newAddon.description}>
                Créer l'Add-on
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Addons List */}
      <div className="grid gap-6">
        {featureAddons.map((addon) => {
          const CategoryIcon = getCategoryIcon(addon.category)
          const discount = addon.price_year_eur > 0 ? Math.round((1 - (addon.price_year_eur / 12) / addon.price_month_eur) * 100) : 0

          return (
            <Card key={addon.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <CategoryIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      {addon.name}
                      <div className="flex gap-2">
                        {addon.active ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                        <Badge variant="outline" className={getCategoryColor(addon.category)}>
                          {addon.category}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {addon.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAddon(addon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Prix Mensuel</Label>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatPrice(addon.price_month_eur)}/mois
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Prix Annuel</Label>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatPrice(addon.price_year_eur)}/an
                      </p>
                      {discount > 0 && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          -{discount}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Économie Annuelle</Label>
                    <p className="text-lg font-semibold text-green-600">
                      {formatPrice(Math.max(0, (addon.price_month_eur * 12) - addon.price_year_eur))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {featureAddons.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun add-on SaaS configuré</h3>
            <p className="text-gray-600 mb-4">
              Créez votre première fonctionnalité avancée à vendre aux entreprises.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer mon premier add-on SaaS
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingAddon && (
        <Dialog open={!!editingAddon} onOpenChange={() => setEditingAddon(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier l'Add-on SaaS</DialogTitle>
              <DialogDescription>
                Ajustez les paramètres de cette fonctionnalité
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Nom</Label>
                <Input
                  id="editName"
                  value={editingAddon.name}
                  onChange={(e) => setEditingAddon({...editingAddon, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editingAddon.description}
                  onChange={(e) => setEditingAddon({...editingAddon, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label>Catégorie</Label>
                <Select 
                  value={editingAddon.category} 
                  onValueChange={(value: OwnerFeatureAddon['category']) => setEditingAddon({...editingAddon, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="API">🔌 API</SelectItem>
                    <SelectItem value="White-label">🎨 White-label</SelectItem>
                    <SelectItem value="Integrations">🔗 Intégrations</SelectItem>
                    <SelectItem value="Support">🎧 Support</SelectItem>
                    <SelectItem value="Analytics">📊 Analytics</SelectItem>
                    <SelectItem value="Personnalisation">⚙️ Personnalisation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prix Mensuel (€)</Label>
                  <Input
                    type="number"
                    value={editingAddon.price_month_eur}
                    onChange={(e) => setEditingAddon({...editingAddon, price_month_eur: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Prix Annuel (€)</Label>
                  <Input
                    type="number"
                    value={editingAddon.price_year_eur}
                    onChange={(e) => setEditingAddon({...editingAddon, price_year_eur: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="editActive"
                  checked={editingAddon.active}
                  onCheckedChange={(checked) => setEditingAddon({...editingAddon, active: checked})}
                />
                <Label htmlFor="editActive">Fonctionnalité Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingAddon(null)}>
                Annuler
              </Button>
              <Button onClick={() => handleUpdateAddon(editingAddon.id, editingAddon)}>
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function AdminSaasFeaturesPage() {
  return (
    <PermissionGuard 
      role="SUPER_ADMIN" 
      permission="pricing:admin"
      tenantRequired={false}
    >
      <AdminSaasFeaturesPageContent />
    </PermissionGuard>
  )
}
