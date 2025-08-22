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
import { Plus, Edit, Package, DollarSign, Eye, Settings } from 'lucide-react'
import { TenantAddon, OwnerAddon } from '@/lib/multi-tenant-pricing'

function AdminPricingAddonsPageContent() {
  const { data: session } = useSession()
  const [tenantAddons, setTenantAddons] = useState<TenantAddon[]>([])
  const [ownerAddons, setOwnerAddons] = useState<OwnerAddon[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAddon, setEditingAddon] = useState<TenantAddon | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newAddon, setNewAddon] = useState({
    ownerAddonId: '',
    pricingType: 'percentage' as 'percentage' | 'fixed' | 'per_unit',
    marginValue: 0,
    customPrice: 0,
    isActive: true,
    isPublic: true,
    customName: '',
    customDescription: ''
  })

  useEffect(() => {
    fetchAddons()
  }, [])

  const fetchAddons = async () => {
    try {
      const [tenantRes, ownerRes] = await Promise.all([
        fetch('/api/tenant/addons', {
          headers: { 'X-Tenant-ID': 'tenant-1' }
        }),
        fetch('/api/public/addons', {
          headers: { 'X-Tenant-ID': 'tenant-1' }
        })
      ])
      
      const tenantData = await tenantRes.json()
      const ownerData = await ownerRes.json()
      
      setTenantAddons(tenantData.addons || [])
      setOwnerAddons(ownerData.addons || [])
    } catch (error) {
      console.error('Erreur lors du chargement des add-ons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAddon = async () => {
    try {
      const response = await fetch('/api/tenant/addons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'tenant-1'
        },
        body: JSON.stringify(newAddon)
      })

      if (response.ok) {
        await fetchAddons()
        setShowCreateDialog(false)
        setNewAddon({
          ownerAddonId: '',
          pricingType: 'percentage',
          marginValue: 0,
          customPrice: 0,
          isActive: true,
          isPublic: true,
          customName: '',
          customDescription: ''
        })
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'add-on:', error)
    }
  }

  const handleUpdateAddon = async (addonId: string, updates: Partial<TenantAddon>) => {
    try {
      const response = await fetch(`/api/tenant/addons/${addonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'tenant-1'
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await fetchAddons()
        setEditingAddon(null)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'add-on:', error)
    }
  }

  const calculateResellPrice = (ownerAddon: OwnerAddon, tenantAddon: TenantAddon) => {
    if (tenantAddon.margin_mode === 'fixed') {
      return tenantAddon.price || 0
    }
    
    const basePrice = ownerAddon.price_month_eur || 0

    if (tenantAddon.margin_mode === 'percent') {
      return basePrice * (1 + (tenantAddon.margin_value || 0) / 100)
    }
    
    return basePrice + (tenantAddon.margin_value || 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const getPricingTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage': return 'Pourcentage'
      case 'fixed': return 'Prix Fixe'
      case 'per_unit': return 'Par Unité'
      default: return type
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
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">🎁 Gestion des Add-ons</h1>
            <p className="text-blue-100 text-lg">Configurez vos services additionnels et marges</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span className="font-medium">Add-ons Actifs</span>
            </div>
            <p className="text-2xl font-bold mt-1">{tenantAddons.filter(a => a.active).length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span className="font-medium">Add-ons Publics</span>
            </div>
            <p className="text-2xl font-bold mt-1">{tenantAddons.filter(a => a.is_public).length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Services Disponibles</span>
            </div>
            <p className="text-2xl font-bold mt-1">{ownerAddons.length}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Add-ons Configurés</h2>
          <p className="text-gray-600">Gérez vos services additionnels avec tarification personnalisée</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Add-on
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un Nouvel Add-on</DialogTitle>
              <DialogDescription>
                Configurez un service additionnel avec votre tarification personnalisée
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="ownerAddon">Service de Base</Label>
                <Select value={newAddon.ownerAddonId} onValueChange={(value) => setNewAddon({...newAddon, ownerAddonId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownerAddons.map((addon) => (
                      <SelectItem key={addon.id} value={addon.id}>
                        {addon.name} - {addon.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customName">Nom Personnalisé (optionnel)</Label>
                <Input
                  id="customName"
                  value={newAddon.customName}
                  onChange={(e) => setNewAddon({...newAddon, customName: e.target.value})}
                  placeholder="Nom personnalisé pour ce service"
                />
              </div>

              <div>
                <Label htmlFor="customDescription">Description Personnalisée</Label>
                <Textarea
                  id="customDescription"
                  value={newAddon.customDescription}
                  onChange={(e) => setNewAddon({...newAddon, customDescription: e.target.value})}
                  placeholder="Description personnalisée"
                  rows={3}
                />
              </div>

              <div>
                <Label>Type de Tarification</Label>
                <Select value={newAddon.pricingType} onValueChange={(value: 'percentage' | 'fixed' | 'per_unit') => setNewAddon({...newAddon, pricingType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Marge en Pourcentage</SelectItem>
                    <SelectItem value="per_unit">Marge par Unité</SelectItem>
                    <SelectItem value="fixed">Prix Fixe Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newAddon.pricingType === 'fixed' ? (
                <div>
                  <Label>Prix Personnalisé (FCFA)</Label>
                  <Input
                    type="number"
                    value={newAddon.customPrice}
                    onChange={(e) => setNewAddon({...newAddon, customPrice: parseFloat(e.target.value) || 0})}
                    placeholder="Prix fixe en FCFA"
                  />
                </div>
              ) : (
                <div>
                  <Label>
                    {newAddon.pricingType === 'percentage' ? 'Marge (%)' : 'Marge par Unité (FCFA)'}
                  </Label>
                  <Input
                    type="number"
                    value={newAddon.marginValue}
                    onChange={(e) => setNewAddon({...newAddon, marginValue: parseFloat(e.target.value) || 0})}
                    placeholder={newAddon.pricingType === 'percentage' ? '20' : '1000'}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={newAddon.isActive}
                    onCheckedChange={(checked) => setNewAddon({...newAddon, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Service Actif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={newAddon.isPublic}
                    onCheckedChange={(checked) => setNewAddon({...newAddon, isPublic: checked})}
                  />
                  <Label htmlFor="isPublic">Visible Publiquement</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateAddon} disabled={!newAddon.ownerAddonId}>
                Créer l'Add-on
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Addons List */}
      <div className="grid gap-6">
        {tenantAddons.map((addon) => {
          const ownerAddon = ownerAddons.find(oa => oa.id === addon.owner_service_addon_id)
          if (!ownerAddon) return null

          const resellPrice = calculateResellPrice(ownerAddon, addon)
          const basePrice = ownerAddon.price_month_eur || 0
          const profit = addon.margin_mode === 'fixed' 
            ? resellPrice - basePrice 
            : resellPrice - basePrice

          return (
            <Card key={addon.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {ownerAddon.name}
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
                          {getPricingTypeLabel(addon.margin_mode || 'fixed')}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {ownerAddon.description}
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
                    <Label className="text-sm font-medium text-gray-500">Prix de Gros</Label>
                    <p className="text-lg font-semibold">
                      {formatPrice(basePrice)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Configuration</Label>
                    <p className="text-lg font-semibold text-blue-600">
                      {addon.margin_mode === 'fixed' 
                        ? 'Prix fixe'
                        : addon.margin_mode === 'percent' 
                          ? `+${addon.margin_value}%`
                          : `+${formatPrice(addon.margin_value || 0)}`
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Prix Client</Label>
                    <p className="text-xl font-bold text-green-600">
                      {formatPrice(resellPrice)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Bénéfice</Label>
                    <p className="text-lg font-semibold text-purple-600">
                      {formatPrice(Math.max(0, profit))}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="text-sm text-gray-600 mt-1">{ownerAddon.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {tenantAddons.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun add-on configuré</h3>
            <p className="text-gray-600 mb-4">
              Commencez par créer votre premier service additionnel avec une tarification personnalisée.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer mon premier add-on
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingAddon && (
        <Dialog open={!!editingAddon} onOpenChange={() => setEditingAddon(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier l'Add-on</DialogTitle>
              <DialogDescription>
                Ajustez les paramètres de ce service additionnel
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCustomName">Nom Personnalisé</Label>
                <Input
                  id="editCustomName"
                  value={''}
                  onChange={(e) => {}}
                />
              </div>

              <div>
                <Label htmlFor="editCustomDescription">Description Personnalisée</Label>
                <Textarea
                  id="editCustomDescription"
                  value={''}
                  onChange={(e) => {}}
                  rows={3}
                />
              </div>

              <div>
                <Label>Type de Tarification</Label>
                <Select 
                  value={editingAddon.margin_mode} 
                  onValueChange={(value: 'percent' | 'fixed') => setEditingAddon({...editingAddon, margin_mode: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Marge en Pourcentage</SelectItem>
                    <SelectItem value="per_unit">Marge par Unité</SelectItem>
                    <SelectItem value="fixed">Prix Fixe Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingAddon.margin_mode === 'fixed' ? (
                <div>
                  <Label>Prix Personnalisé (FCFA)</Label>
                  <Input
                    type="number"
                    value={editingAddon.price || 0}
                    onChange={(e) => setEditingAddon({...editingAddon, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
              ) : (
                <div>
                  <Label>Marge (%)</Label>
                  <Input
                    type="number"
                    value={editingAddon.margin_value || 0}
                    onChange={(e) => setEditingAddon({...editingAddon, margin_value: parseFloat(e.target.value) || 0})}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editIsActive"
                    checked={editingAddon.active}
                    onCheckedChange={(checked) => setEditingAddon({...editingAddon, active: checked})}
                  />
                  <Label htmlFor="editIsActive">Service Actif</Label>
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

export default function AdminPricingAddonsPage() {
  return (
    <PermissionGuard 
      role="SUPER_ADMIN" 
      permission="pricing:admin"
      tenantRequired={false}
    >
      <AdminPricingAddonsPageContent />
    </PermissionGuard>
  )
}
