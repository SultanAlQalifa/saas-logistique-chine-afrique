'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Package, 
  Zap, 
  Crown, 
  Building,
  ArrowLeft,
  Eye,
  Users,
  DollarSign,
  BarChart3,
  Shield
} from 'lucide-react'
import { MARKETING_ADDONS } from '@/lib/marketing-addons'

interface AddonConfig {
  id: string
  name: string
  description: string
  category: 'basic' | 'professional' | 'premium' | 'enterprise'
  monthlyPrice: number
  annualPrice: number
  popular: boolean
  features: string[]
  benefits: string[]
  limits: {
    campaigns: number
    promotions: number
    sponsorships: number
    boosts: number
  }
}

export default function AdminMarketingAddonsPage() {
  const [addons, setAddons] = useState<AddonConfig[]>(Object.values(MARKETING_ADDONS).map(addon => ({
    ...addon,
    popular: addon.popular || false
  })))
  const [editingAddon, setEditingAddon] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAddon, setNewAddon] = useState<Partial<AddonConfig>>({
    name: '',
    description: '',
    category: 'basic',
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    features: [],
    benefits: [],
    limits: {
      campaigns: 0,
      promotions: 0,
      sponsorships: 0,
      boosts: 0
    }
  })

  const getAddonIcon = (category: string) => {
    switch (category) {
      case 'basic': return <Package className="h-6 w-6" />
      case 'professional': return <Zap className="h-6 w-6" />
      case 'premium': return <Crown className="h-6 w-6" />
      case 'enterprise': return <Building className="h-6 w-6" />
      default: return <Package className="h-6 w-6" />
    }
  }

  const getAddonColor = (category: string) => {
    switch (category) {
      case 'basic': return 'from-blue-500 to-blue-600'
      case 'professional': return 'from-purple-500 to-purple-600'
      case 'premium': return 'from-orange-500 to-orange-600'
      case 'enterprise': return 'from-gray-800 to-gray-900'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const handleSaveAddon = (addonId: string, updatedData: Partial<AddonConfig>) => {
    setAddons(prev => prev.map(addon => 
      addon.id === addonId ? { ...addon, ...updatedData } : addon
    ))
    setEditingAddon(null)
  }

  const handleDeleteAddon = (addonId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet add-on ?')) {
      setAddons(prev => prev.filter(addon => addon.id !== addonId))
    }
  }

  const handleCreateAddon = () => {
    if (newAddon.name && newAddon.description) {
      const id = newAddon.name.toLowerCase().replace(/\s+/g, '-')
      const addon: AddonConfig = {
        id,
        name: newAddon.name!,
        description: newAddon.description!,
        category: newAddon.category!,
        monthlyPrice: newAddon.monthlyPrice!,
        annualPrice: newAddon.annualPrice!,
        popular: newAddon.popular!,
        features: newAddon.features!,
        benefits: newAddon.benefits!,
        limits: newAddon.limits!
      }
      setAddons(prev => [...prev, addon])
      setNewAddon({
        name: '',
        description: '',
        category: 'basic',
        monthlyPrice: 0,
        annualPrice: 0,
        popular: false,
        features: [],
        benefits: [],
        limits: { campaigns: 0, promotions: 0, sponsorships: 0, boosts: 0 }
      })
      setShowCreateForm(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header avec bouton retour */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings className="h-8 w-8 text-indigo-600" />
              Configuration Add-ons Marketing
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les packages marketing proposés aux entreprises
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Add-on
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('/dashboard/marketing/addons', '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Vue Entreprise
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Add-ons</p>
                <p className="text-2xl font-bold">{addons.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Abonnements Actifs</p>
                <p className="text-2xl font-bold">247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenus Mensuels</p>
                <p className="text-2xl font-bold">18.5M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux Conversion</p>
                <p className="text-2xl font-bold">12.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Créer un nouvel Add-on</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={newAddon.name}
                  onChange={(e) => setNewAddon(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Marketing Pro"
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  value={newAddon.category}
                  onChange={(e) => setNewAddon(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="basic">Basic</option>
                  <option value="professional">Professional</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAddon.description}
                onChange={(e) => setNewAddon(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de l'add-on..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyPrice">Prix Mensuel (FCFA)</Label>
                <Input
                  id="monthlyPrice"
                  type="number"
                  value={newAddon.monthlyPrice}
                  onChange={(e) => setNewAddon(prev => ({ ...prev, monthlyPrice: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="annualPrice">Prix Annuel (FCFA)</Label>
                <Input
                  id="annualPrice"
                  type="number"
                  value={newAddon.annualPrice}
                  onChange={(e) => setNewAddon(prev => ({ ...prev, annualPrice: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateAddon}>
                <Save className="h-4 w-4 mr-2" />
                Créer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des add-ons */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {addons.map((addon) => (
          <Card key={addon.id} className="relative">
            {addon.popular && (
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                POPULAIRE
              </div>
            )}
            
            <CardHeader className={`bg-gradient-to-r ${getAddonColor(addon.category)} text-white`}>
              <div className="flex items-center justify-between">
                <div className="text-white">
                  {getAddonIcon(addon.category)}
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  {addon.category.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-white">{addon.name}</CardTitle>
              <CardDescription className="text-white/80">
                {addon.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold">
                      {addon.monthlyPrice.toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-1">FCFA/mois</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      {addon.annualPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">FCFA/an</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Campagnes: <strong>{addon.limits.campaigns === -1 ? '∞' : addon.limits.campaigns}</strong></div>
                  <div>Promotions: <strong>{addon.limits.promotions === -1 ? '∞' : addon.limits.promotions}</strong></div>
                  <div>Sponsorships: <strong>{addon.limits.sponsorships === -1 ? '∞' : addon.limits.sponsorships}</strong></div>
                  <div>Boosts: <strong>{addon.limits.boosts === -1 ? '∞' : addon.limits.boosts}</strong></div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingAddon(addon.id)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAddon(addon.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informations système */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-blue-900">Configuration Système</h3>
              <p className="text-blue-700 text-sm">
                Les modifications sont appliquées en temps réel. Les entreprises verront immédiatement les nouveaux packages.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
