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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Eye, Settings, DollarSign, Users, Zap } from 'lucide-react'
import { TenantPlan, OwnerPlan } from '@/lib/multi-tenant-pricing'

function AdminPricingPlansPageContent() {
  const { data: session } = useSession()
  const [tenantPlans, setTenantPlans] = useState<TenantPlan[]>([])
  const [ownerPlans, setOwnerPlans] = useState<OwnerPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState<TenantPlan | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newPlan, setNewPlan] = useState({
    ownerPlanId: '',
    marginType: 'percentage' as 'percentage' | 'fixed',
    marginValue: 0,
    isActive: true,
    isPublic: true,
    customName: '',
    customDescription: ''
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const [tenantRes, ownerRes] = await Promise.all([
        fetch('/api/tenant/plans', {
          headers: { 'X-Tenant-ID': 'tenant-1' }
        }),
        fetch('/api/public/plans', {
          headers: { 'X-Tenant-ID': 'tenant-1' }
        })
      ])
      
      const tenantData = await tenantRes.json()
      const ownerData = await ownerRes.json()
      
      setTenantPlans(tenantData.plans || [])
      setOwnerPlans(ownerData.plans || [])
    } catch (error) {
      console.error('Erreur lors du chargement des plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = async () => {
    try {
      const response = await fetch('/api/tenant/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'tenant-1'
        },
        body: JSON.stringify(newPlan)
      })

      if (response.ok) {
        await fetchPlans()
        setShowCreateDialog(false)
        setNewPlan({
          ownerPlanId: '',
          marginType: 'percentage',
          marginValue: 0,
          isActive: true,
          isPublic: true,
          customName: '',
          customDescription: ''
        })
      }
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error)
    }
  }

  const handleUpdatePlan = async (planId: string, updates: Partial<TenantPlan>) => {
    try {
      const response = await fetch(`/api/tenant/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'tenant-1'
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await fetchPlans()
        setEditingPlan(null)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plan:', error)
    }
  }

  const calculateResellPrice = (ownerPrice: number, marginType: string, marginValue: number) => {
    if (marginType === 'percentage') {
      return ownerPrice * (1 + marginValue / 100)
    }
    return ownerPrice + marginValue
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
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
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <DollarSign className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">📋 Gestion des Plans</h1>
            <p className="text-purple-100 text-lg">Configurez vos plans d'abonnement et marges</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="font-medium">Plans Actifs</span>
            </div>
            <p className="text-2xl font-bold mt-1">{tenantPlans.filter(p => p.active).length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span className="font-medium">Plans Publics</span>
            </div>
            <p className="text-2xl font-bold mt-1">{tenantPlans.filter(p => p.is_public).length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Plans Disponibles</span>
            </div>
            <p className="text-2xl font-bold mt-1">{ownerPlans.length}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Plans Configurés</h2>
          <p className="text-gray-600">Gérez vos plans d'abonnement avec marges personnalisées</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Plan</DialogTitle>
              <DialogDescription>
                Configurez un plan d'abonnement avec vos marges personnalisées
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="ownerPlan">Plan de Base</Label>
                <Select value={newPlan.ownerPlanId} onValueChange={(value) => setNewPlan({...newPlan, ownerPlanId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownerPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {formatPrice(plan.price_month_eur)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customName">Nom Personnalisé (optionnel)</Label>
                <Input
                  id="customName"
                  value={newPlan.customName}
                  onChange={(e) => setNewPlan({...newPlan, customName: e.target.value})}
                  placeholder="Nom personnalisé pour ce plan"
                />
              </div>

              <div>
                <Label htmlFor="customDescription">Description Personnalisée</Label>
                <Textarea
                  id="customDescription"
                  value={newPlan.customDescription}
                  onChange={(e) => setNewPlan({...newPlan, customDescription: e.target.value})}
                  placeholder="Description personnalisée"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de Marge</Label>
                  <Select value={newPlan.marginType} onValueChange={(value: 'percentage' | 'fixed') => setNewPlan({...newPlan, marginType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Pourcentage</SelectItem>
                      <SelectItem value="fixed">Montant Fixe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valeur de Marge</Label>
                  <Input
                    type="number"
                    value={newPlan.marginValue}
                    onChange={(e) => setNewPlan({...newPlan, marginValue: parseFloat(e.target.value) || 0})}
                    placeholder={newPlan.marginType === 'percentage' ? '20' : '5000'}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={newPlan.isActive}
                    onCheckedChange={(checked) => setNewPlan({...newPlan, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Plan Actif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={newPlan.isPublic}
                    onCheckedChange={(checked) => setNewPlan({...newPlan, isPublic: checked})}
                  />
                  <Label htmlFor="isPublic">Visible Publiquement</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreatePlan} disabled={!newPlan.ownerPlanId}>
                Créer le Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plans List */}
      <div className="grid gap-6">
        {tenantPlans.map((plan) => {
          const ownerPlan = ownerPlans.find(op => op.id === plan.owner_plan_id)
          if (!ownerPlan) return null

          const resellPrice = calculateResellPrice(ownerPlan.price_month_eur, plan.margin_mode, plan.margin_value)
          const profit = resellPrice - ownerPlan.price_month_eur

          return (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {ownerPlan.name}
                      <div className="flex gap-2">
                        {plan.active ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                        {plan.is_public && (
                          <Badge variant="outline" className="border-blue-200 text-blue-800">Public</Badge>
                        )}
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {ownerPlan.name} - Plan d'abonnement
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPlan(plan)}
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
                    <p className="text-lg font-semibold">{formatPrice(ownerPlan.price_month_eur)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Marge</Label>
                    <p className="text-lg font-semibold text-blue-600">
                      {plan.margin_mode === 'percent' 
                        ? `+${plan.margin_value}%` 
                        : `+${formatPrice(plan.margin_value)}`
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Prix de Vente</Label>
                    <p className="text-xl font-bold text-green-600">{formatPrice(resellPrice)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Bénéfice</Label>
                    <p className="text-lg font-semibold text-purple-600">{formatPrice(profit)}</p>
                  </div>
                </div>

                {ownerPlan.features && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-500">Fonctionnalités</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ownerPlan.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {tenantPlans.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun plan configuré</h3>
            <p className="text-gray-600 mb-4">
              Commencez par créer votre premier plan d'abonnement avec des marges personnalisées.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer mon premier plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingPlan && (
        <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier le Plan</DialogTitle>
              <DialogDescription>
                Ajustez les paramètres de ce plan d'abonnement
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de Marge</Label>
                  <Select 
                    value={editingPlan.margin_mode} 
                    onValueChange={(value: 'percent' | 'fixed') => setEditingPlan({...editingPlan, margin_mode: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Pourcentage</SelectItem>
                      <SelectItem value="fixed">Montant Fixe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valeur de Marge</Label>
                  <Input
                    type="number"
                    value={editingPlan.margin_value}
                    onChange={(e) => setEditingPlan({...editingPlan, margin_value: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editIsActive"
                    checked={editingPlan.active}
                    onCheckedChange={(checked) => setEditingPlan({...editingPlan, active: checked})}
                  />
                  <Label htmlFor="editIsActive">Plan Actif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editIsPublic"
                    checked={editingPlan.is_public}
                    onCheckedChange={(checked) => setEditingPlan({...editingPlan, is_public: checked})}
                  />
                  <Label htmlFor="editIsPublic">Visible Publiquement</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPlan(null)}>
                Annuler
              </Button>
              <Button onClick={() => handleUpdatePlan(editingPlan.id, editingPlan)}>
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function AdminPricingPlansPage() {
  return (
    <PermissionGuard 
      role="SUPER_ADMIN" 
      permission="pricing:admin"
      tenantRequired={false}
    >
      <AdminPricingPlansPageContent />
    </PermissionGuard>
  )
}
