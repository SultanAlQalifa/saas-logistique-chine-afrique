'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Package, 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Building, 
  Calendar,
  CreditCard,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Headphones,
  Rocket,
  ArrowLeft,
  Settings,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Plus
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { MARKETING_ADDONS, calculateAnnualSavings, getAddonRecommendation } from '@/lib/marketing-addons'
import AddonSubscriptionModal from '@/components/marketing/AddonSubscriptionModal'

export default function MarketingAddonsPage() {
  const { data: session } = useSession()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [viewMode, setViewMode] = useState<'enterprise' | 'config'>('enterprise')
  const [editingAddon, setEditingAddon] = useState<string | null>(null)
  const [managedAddons, setManagedAddons] = useState(Object.values(MARKETING_ADDONS))
  const [editForm, setEditForm] = useState<any>({})

  const isEnterprise = true // Temporairement activé pour tous les utilisateurs

  // Fonctions de gestion des add-ons
  const handleEditAddon = (addonId: string) => {
    const addon = managedAddons.find(a => a.id === addonId)
    if (addon) {
      setEditForm(addon)
      setEditingAddon(addonId)
    }
  }

  const handleCancelEdit = () => {
    setEditingAddon(null)
    setEditForm({})
  }

  const handleRestoreAddons = () => {
    setManagedAddons(Object.values(MARKETING_ADDONS))
  }

  const handleDeleteAddon = (addonId: string) => {
    const addon = managedAddons.find(a => a.id === addonId)
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'add-on "${addon?.name}" ? Cette action est irréversible.`)) {
      setManagedAddons(prev => prev.filter(addon => addon.id !== addonId))
    }
  }

  const handleSaveAddon = () => {
    if (editingAddon) {
      setManagedAddons(prev => prev.map(addon => 
        addon.id === editingAddon ? { ...addon, ...editForm } : addon
      ))
      setEditingAddon(null)
      setEditForm({})
    }
  }

  if (!isEnterprise) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Restreint</h1>
          <p className="text-gray-600 mb-4">Les add-ons marketing sont réservés aux entreprises uniquement.</p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Retour au dashboard
          </Button>
        </div>
      </div>
    )
  }

  const handleSubscribe = (addonId: string) => {
    setSelectedAddon(addonId)
    setShowSubscriptionModal(true)
  }

  const handleConfirmSubscription = (addonId: string, billingCycle: 'monthly' | 'annual') => {
    alert(`Abonnement ${MARKETING_ADDONS[addonId].name} (${billingCycle}) confirmé avec succès !`)
    setShowSubscriptionModal(false)
    setSelectedAddon(null)
  }

  const currentUsage = {
    campaigns: 12,
    promotions: 25,
    sponsorships: 3,
    boosts: 45
  }

  const recommendedAddonId = getAddonRecommendation(currentUsage)
  const recommendedAddon = MARKETING_ADDONS[recommendedAddonId]

  return (
    <div className="space-y-8">
      {/* Header avec bouton retour intégré */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative">
        {/* Bouton retour repositionné */}
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white hover:bg-white/20 border-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour
          </Button>
        </div>

        {/* Boutons de basculement de vue */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant={viewMode === 'enterprise' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('enterprise')}
            className={`flex items-center gap-2 ${
              viewMode === 'enterprise' 
                ? 'bg-white text-indigo-600 hover:bg-gray-100' 
                : 'text-white hover:bg-white/20 border-white/30'
            }`}
          >
            <Eye className="h-4 w-4" />
            Vue Entreprise
          </Button>
          <Button
            variant={viewMode === 'config' ? 'secondary' : 'ghost'}
            onClick={() => setViewMode('config')}
            className={`flex items-center gap-2 ${
              viewMode === 'config' 
                ? 'bg-white text-indigo-600 hover:bg-gray-100' 
                : 'text-white hover:bg-white/20 border-white/30'
            }`}
          >
            <Settings className="h-4 w-4" />
            Configuration
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <Rocket className="h-10 w-10 mr-3" />
            Add-ons Marketing
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Boostez votre marketing avec nos packages tout-inclus. Économisez jusqu'à 60% sur vos opérations marketing.
          </p>
        </div>
      </div>

      {/* Toggle de facturation */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-1 shadow-sm border">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'annual'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            Annuel
            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
              2 mois gratuits
            </Badge>
          </button>
        </div>
      </div>

      {/* Recommandation */}
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="font-semibold text-yellow-800">Recommandation personnalisée</h3>
              <p className="text-yellow-700">
                Basé sur votre utilisation actuelle ({currentUsage.campaigns + currentUsage.promotions + currentUsage.sponsorships + currentUsage.boosts} opérations/mois), 
                nous recommandons le package <strong>{recommendedAddon.name}</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vue conditionnelle selon le mode */}
      {viewMode === 'enterprise' ? (
        /* Vue Entreprise - Packages disponibles */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Object.values(MARKETING_ADDONS).map((addon) => (
            <Card key={addon.id} className="relative hover:shadow-lg transition-shadow">
              {addon.popular && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                  POPULAIRE
                </div>
              )}
              <CardHeader className={`bg-gradient-to-r ${
                addon.category === 'basic' ? 'from-blue-500 to-blue-600' :
                addon.category === 'professional' ? 'from-purple-500 to-purple-600' :
                addon.category === 'premium' ? 'from-orange-500 to-orange-600' :
                'from-gray-800 to-gray-900'
              } text-white`}>
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    {addon.category === 'basic' && <Package className="h-6 w-6" />}
                    {addon.category === 'professional' && <Zap className="h-6 w-6" />}
                    {addon.category === 'premium' && <Crown className="h-6 w-6" />}
                    {addon.category === 'enterprise' && <Building className="h-6 w-6" />}
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
                        {billingCycle === 'monthly' 
                          ? addon.monthlyPrice.toLocaleString()
                          : Math.round(addon.annualPrice / 12).toLocaleString()
                        }
                      </span>
                      <span className="text-gray-500 ml-1">FCFA/mois</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          -{calculateAnnualSavings(addon.monthlyPrice, addon.annualPrice).toLocaleString()} FCFA
                        </div>
                        <div className="text-xs text-gray-500">économie annuelle</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {addon.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {addon.features.length > 4 && (
                      <div className="text-xs text-gray-500">
                        +{addon.features.length - 4} autres fonctionnalités
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedAddon(addon.id)
                      setShowSubscriptionModal(true)
                    }}
                    className={`w-full ${
                      addon.popular 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    Choisir ce package
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Vue Configuration - Interface Admin */
        <div className="space-y-8">
          {/* Statistiques Admin */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Add-ons</p>
                    <p className="text-2xl font-bold text-gray-900">{managedAddons.length}</p>
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
                  <CreditCard className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenus Mensuels</p>
                    <p className="text-2xl font-bold">18.5M FCFA</p>
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

          {/* Actions Admin */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Gestion des Add-ons</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleRestoreAddons}
                className="text-blue-600 hover:text-blue-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restaurer tous
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Créer un Add-on
              </Button>
            </div>
          </div>

          {/* Configuration des Add-ons */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {managedAddons.map((addon) => (
              <Card key={addon.id} className="relative">
                {addon.popular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    POPULAIRE
                  </div>
                )}
                
                <CardHeader className={`bg-gradient-to-r ${
                  addon.category === 'basic' ? 'from-blue-500 to-blue-600' :
                  addon.category === 'professional' ? 'from-purple-500 to-purple-600' :
                  addon.category === 'premium' ? 'from-orange-500 to-orange-600' :
                  'from-gray-800 to-gray-900'
                } text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      {addon.category === 'basic' && <Package className="h-6 w-6" />}
                      {addon.category === 'professional' && <Zap className="h-6 w-6" />}
                      {addon.category === 'premium' && <Crown className="h-6 w-6" />}
                      {addon.category === 'enterprise' && <Building className="h-6 w-6" />}
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
                  {editingAddon === addon.id ? (
                    /* Mode édition */
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nom</Label>
                        <Input
                          id="name"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm((prev: any) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm((prev: any) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="monthlyPrice">Prix Mensuel</Label>
                          <Input
                            id="monthlyPrice"
                            type="number"
                            value={editForm.monthlyPrice || 0}
                            onChange={(e) => setEditForm((prev: any) => ({ ...prev, monthlyPrice: parseInt(e.target.value) }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="annualPrice">Prix Annuel</Label>
                          <Input
                            id="annualPrice"
                            type="number"
                            value={editForm.annualPrice || 0}
                            onChange={(e) => setEditForm((prev: any) => ({ ...prev, annualPrice: parseInt(e.target.value) }))}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={handleCancelEdit}
                        >
                          Annuler
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={handleSaveAddon}
                        >
                          Sauvegarder
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Mode affichage */
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
                          className="flex-1"
                          onClick={() => handleEditAddon(addon.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteAddon(addon.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
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
      )}

      {/* Comparaison des fonctionnalités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            Comparaison détaillée
          </CardTitle>
          <CardDescription>
            Comparez les limites et fonctionnalités de chaque package
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Fonctionnalité</th>
                  {Object.values(MARKETING_ADDONS).map(addon => (
                    <th key={addon.id} className="text-center py-3 px-4 min-w-[120px]">
                      {addon.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 px-4 font-medium">Campagnes/mois</td>
                  {Object.values(MARKETING_ADDONS).map(addon => (
                    <td key={addon.id} className="text-center py-3 px-4">
                      {addon.limits.campaigns === -1 ? 'Illimité' : addon.limits.campaigns}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Promotions/mois</td>
                  {Object.values(MARKETING_ADDONS).map(addon => (
                    <td key={addon.id} className="text-center py-3 px-4">
                      {addon.limits.promotions === -1 ? 'Illimité' : addon.limits.promotions}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Sponsorships/mois</td>
                  {Object.values(MARKETING_ADDONS).map(addon => (
                    <td key={addon.id} className="text-center py-3 px-4">
                      {addon.limits.sponsorships === -1 ? 'Illimité' : addon.limits.sponsorships}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Boosts/mois</td>
                  {Object.values(MARKETING_ADDONS).map(addon => (
                    <td key={addon.id} className="text-center py-3 px-4">
                      {addon.limits.boosts === -1 ? 'Illimité' : addon.limits.boosts}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Réduction</td>
                  {Object.values(MARKETING_ADDONS).map(addon => (
                    <td key={addon.id} className="text-center py-3 px-4">
                      {addon.category === 'basic' ? '20%' : 
                       addon.category === 'professional' ? '35%' : 
                       addon.category === 'premium' ? '50%' : '60%'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Vue conditionnelle selon le mode */}
      {viewMode === 'enterprise' && (
        <>
          {/* Recommandations personnalisées */}
          {recommendedAddon && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-800">Recommandé pour vous</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-900">{recommendedAddon.name}</h4>
                    <p className="text-green-700 text-sm">{recommendedAddon.description}</p>
                    <p className="text-green-600 text-xs mt-1">
                      Basé sur votre utilisation actuelle : {currentUsage.campaigns} campagnes, {currentUsage.promotions} promotions
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedAddon(recommendedAddon.id)
                      setShowSubscriptionModal(true)
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Choisir ce package
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Support et contact */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Headphones className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-blue-900">Besoin d'aide pour choisir ?</h3>
                <p className="text-blue-700">
                  Nos experts marketing vous accompagnent dans le choix du package idéal
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              <Users className="h-4 w-4 mr-2" />
              Contacter un expert
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'abonnement */}
      {selectedAddon && (
        <AddonSubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => {
            setShowSubscriptionModal(false)
            setSelectedAddon(null)
          }}
          onConfirm={handleConfirmSubscription}
          addonId={selectedAddon}
        />
      )}
    </div>
  )
}
