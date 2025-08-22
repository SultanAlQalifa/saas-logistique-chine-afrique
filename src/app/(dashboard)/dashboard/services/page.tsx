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
import { Plus, Edit, Package, DollarSign, Eye, Settings, Shield, Truck, Home, Clock, FileText } from 'lucide-react'
import { TenantServiceAddon, MultiTenantPricingMockData, PricingType, Currency } from '@/lib/multi-tenant-pricing'

function ServicesPageContent() {
  const { data: session } = useSession()
  const [serviceAddons, setServiceAddons] = useState<TenantServiceAddon[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAddon, setEditingAddon] = useState<TenantServiceAddon | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newAddon, setNewAddon] = useState({
    name: '',
    slug: '',
    description: '',
    pricing_type: 'fixed' as PricingType,
    price: 0,
    currency: 'XOF' as Currency,
    unit_label: '',
    taxable: true,
    active: true,
    is_public: true
  })

  useEffect(() => {
    fetchServiceAddons()
  }, [])

  const fetchServiceAddons = async () => {
    try {
      // Simulation avec mock data
      const mockData = MultiTenantPricingMockData.createTenantServiceAddons('tenant-1')
      setServiceAddons(mockData)
    } catch (error) {
      console.error('Erreur lors du chargement des services optionnels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAddon = async () => {
    try {
      const newServiceAddon: TenantServiceAddon = {
        id: `tenant-service-${Date.now()}`,
        tenant_id: 'tenant-1',
        ...newAddon,
        slug: newAddon.name.toLowerCase().replace(/\s+/g, '-'),
        display_order: serviceAddons.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setServiceAddons([...serviceAddons, newServiceAddon])
      setShowCreateDialog(false)
      setNewAddon({
        name: '',
        slug: '',
        description: '',
        pricing_type: 'fixed',
        price: 0,
        currency: 'XOF',
        unit_label: '',
        taxable: true,
        active: true,
        is_public: true
      })
    } catch (error) {
      console.error('Erreur lors de la création du service optionnel:', error)
    }
  }

  const handleUpdateAddon = async (addonId: string, updates: Partial<TenantServiceAddon>) => {
    try {
      setServiceAddons(serviceAddons.map(addon => 
        addon.id === addonId ? { ...addon, ...updates, updated_at: new Date().toISOString() } : addon
      ))
      setEditingAddon(null)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service optionnel:', error)
    }
  }

  const formatPrice = (price: number, currency: Currency) => {
    if (currency === 'XOF') {
      return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
    }
    return new Intl.NumberFormat('fr-FR').format(price) + ' €'
  }

  const getPricingTypeLabel = (type: PricingType) => {
    switch (type) {
      case 'fixed': return 'Prix Fixe'
      case 'per_kg': return 'Par Kg'
      case 'per_m3': return 'Par m³'
      case 'percent_of_value': return 'Pourcentage'
      default: return type
    }
  }

  const getServiceIcon = (name: string) => {
    if (name.toLowerCase().includes('assurance')) return Shield
    if (name.toLowerCase().includes('emballage')) return Package
    if (name.toLowerCase().includes('livraison')) return Home
    if (name.toLowerCase().includes('stockage')) return Clock
    if (name.toLowerCase().includes('douane')) return FileText
    return Truck
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">📦 Services Optionnels</h1>
            <p className="text-blue-100 text-lg">Services métier proposés à vos clients finaux</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span className="font-medium">Services Actifs</span>
            </div>
            <p className="text-2xl font-bold mt-1">{serviceAddons.filter(a => a.active).length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span className="font-medium">Services Publics</span>
            </div>
            <p className="text-2xl font-bold mt-1">{serviceAddons.filter(a => a.is_public).length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="font-medium">Prix Moyen</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {serviceAddons.length > 0 ? formatPrice(
                serviceAddons.filter(a => a.pricing_type === 'fixed').reduce((sum, a) => sum + a.price, 0) / 
                Math.max(1, serviceAddons.filter(a => a.pricing_type === 'fixed').length), 
                'XOF'
              ) : '0 FCFA'}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Total Services</span>
            </div>
            <p className="text-2xl font-bold mt-1">{serviceAddons.length}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Services Configurés</h2>
          <p className="text-gray-600">Services logistiques optionnels proposés à vos clients</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un Service Optionnel</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau service logistique pour vos clients
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du Service</Label>
                <Input
                  id="name"
                  value={newAddon.name}
                  onChange={(e) => setNewAddon({...newAddon, name: e.target.value})}
                  placeholder="Ex: Assurance Cargo, Livraison Express"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAddon.description}
                  onChange={(e) => setNewAddon({...newAddon, description: e.target.value})}
                  placeholder="Description détaillée du service"
                  rows={3}
                />
              </div>

              <div>
                <Label>Type de Tarification</Label>
                <Select value={newAddon.pricing_type} onValueChange={(value: PricingType) => setNewAddon({...newAddon, pricing_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">💰 Prix Fixe</SelectItem>
                    <SelectItem value="per_kg">⚖️ Par Kilogramme</SelectItem>
                    <SelectItem value="per_m3">📦 Par Mètre Cube</SelectItem>
                    <SelectItem value="percent_of_value">📊 Pourcentage de la Valeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prix</Label>
                  <Input
                    type="number"
                    value={newAddon.price}
                    onChange={(e) => setNewAddon({...newAddon, price: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Devise</Label>
                  <Select value={newAddon.currency} onValueChange={(value: Currency) => setNewAddon({...newAddon, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">🇸🇳 FCFA</SelectItem>
                      <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                      <SelectItem value="USD">🇺🇸 USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="unit_label">Libellé d'Unité</Label>
                <Input
                  id="unit_label"
                  value={newAddon.unit_label}
                  onChange={(e) => setNewAddon({...newAddon, unit_label: e.target.value})}
                  placeholder="Ex: FCFA/colis, FCFA/kg, % de la valeur"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="taxable"
                    checked={newAddon.taxable}
                    onCheckedChange={(checked) => setNewAddon({...newAddon, taxable: checked})}
                  />
                  <Label htmlFor="taxable">Soumis à TVA</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newAddon.active}
                    onCheckedChange={(checked) => setNewAddon({...newAddon, active: checked})}
                  />
                  <Label htmlFor="active">Service Actif</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={newAddon.is_public}
                  onCheckedChange={(checked) => setNewAddon({...newAddon, is_public: checked})}
                />
                <Label htmlFor="is_public">Visible Publiquement</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateAddon} disabled={!newAddon.name || !newAddon.description}>
                Créer le Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services List */}
      <div className="grid gap-6">
        {serviceAddons.map((addon) => {
          const ServiceIcon = getServiceIcon(addon.name)

          return (
            <Card key={addon.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <ServiceIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      {addon.name}
                      <div className="flex gap-2">
                        {addon.active ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                        {addon.is_public && (
                          <Badge variant="outline" className="border-blue-200 text-blue-800">Public</Badge>
                        )}
                        <Badge variant="outline" className="border-purple-200 text-purple-800">
                          {getPricingTypeLabel(addon.pricing_type)}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Prix Client</Label>
                    <p className="text-xl font-bold text-blue-600">
                      {addon.pricing_type === 'percent_of_value' 
                        ? `${addon.price * 100}%`
                        : formatPrice(addon.price, addon.currency)
                      }
                    </p>
                    <p className="text-sm text-gray-500">{addon.unit_label}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Type</Label>
                    <p className="text-lg font-semibold">
                      {getPricingTypeLabel(addon.pricing_type)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">TVA</Label>
                    <p className="text-lg font-semibold">
                      {addon.taxable ? (
                        <span className="text-orange-600">Incluse</span>
                      ) : (
                        <span className="text-gray-500">Exonérée</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Devise</Label>
                    <p className="text-lg font-semibold">
                      {addon.currency === 'XOF' ? '🇸🇳 FCFA' : 
                       addon.currency === 'EUR' ? '🇪🇺 EUR' : '🇺🇸 USD'}
                    </p>
                  </div>
                </div>

                {addon.owner_service_addon_id && addon.margin_value && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <Label className="text-sm font-medium text-green-700">Marge Appliquée</Label>
                    <p className="text-sm text-green-600">
                      +{addon.margin_value}% par rapport au service de base
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {serviceAddons.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun service optionnel configuré</h3>
            <p className="text-gray-600 mb-4">
              Créez votre premier service optionnel pour enrichir votre offre logistique.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer mon premier service
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingAddon && (
        <Dialog open={!!editingAddon} onOpenChange={() => setEditingAddon(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier le Service</DialogTitle>
              <DialogDescription>
                Ajustez les paramètres de ce service optionnel
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
                <Label>Type de Tarification</Label>
                <Select 
                  value={editingAddon.pricing_type} 
                  onValueChange={(value: PricingType) => setEditingAddon({...editingAddon, pricing_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">💰 Prix Fixe</SelectItem>
                    <SelectItem value="per_kg">⚖️ Par Kilogramme</SelectItem>
                    <SelectItem value="per_m3">📦 Par Mètre Cube</SelectItem>
                    <SelectItem value="percent_of_value">📊 Pourcentage de la Valeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prix</Label>
                  <Input
                    type="number"
                    value={editingAddon.price}
                    onChange={(e) => setEditingAddon({...editingAddon, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Devise</Label>
                  <Select 
                    value={editingAddon.currency} 
                    onValueChange={(value: Currency) => setEditingAddon({...editingAddon, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">🇸🇳 FCFA</SelectItem>
                      <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                      <SelectItem value="USD">🇺🇸 USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="editUnitLabel">Libellé d'Unité</Label>
                <Input
                  id="editUnitLabel"
                  value={editingAddon.unit_label}
                  onChange={(e) => setEditingAddon({...editingAddon, unit_label: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editTaxable"
                    checked={editingAddon.taxable}
                    onCheckedChange={(checked) => setEditingAddon({...editingAddon, taxable: checked})}
                  />
                  <Label htmlFor="editTaxable">Soumis à TVA</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editActive"
                    checked={editingAddon.active}
                    onCheckedChange={(checked) => setEditingAddon({...editingAddon, active: checked})}
                  />
                  <Label htmlFor="editActive">Service Actif</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsPublic"
                  checked={editingAddon.is_public}
                  onCheckedChange={(checked) => setEditingAddon({...editingAddon, is_public: checked})}
                />
                <Label htmlFor="editIsPublic">Visible Publiquement</Label>
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

export default function ServicesPage() {
  return (
    <PermissionGuard 
      permission="services:manage"
      tenantRequired={false}
    >
      <ServicesPageContent />
    </PermissionGuard>
  )
}
