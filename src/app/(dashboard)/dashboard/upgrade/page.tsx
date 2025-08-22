'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowUp,
  Plus, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Package,
  CreditCard,
  Crown,
  Sparkles
} from 'lucide-react'
import { OwnerPlan, OwnerFeatureAddon, mockOwnerPlans, mockOwnerFeatureAddons } from '@/lib/multi-tenant-pricing'

export default function UpgradePage() {
  const { data: session } = useSession()
  const [plans, setPlans] = useState<OwnerPlan[]>([])
  const [addons, setAddons] = useState<OwnerFeatureAddon[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [currentPlan, setCurrentPlan] = useState<string>('starter')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Charger les plans et add-ons disponibles
    setPlans(mockOwnerPlans)
    setAddons(mockOwnerFeatureAddons)
    
    // Simuler le plan actuel du tenant
    if (session?.user?.companyId) {
      setCurrentPlan('starter') // Plan actuel simulé
    }
  }, [session])

  const handlePlanUpgrade = async (planId: string) => {
    setLoading(true)
    try {
      // TODO: Appeler l'API pour mettre à niveau le plan
      console.log('Upgrading to plan:', planId)
      
      // Simulation d'upgrade
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setCurrentPlan(planId)
      alert('Plan mis à niveau avec succès!')
    } catch (error) {
      console.error('Erreur lors de la mise à niveau:', error)
      alert('Erreur lors de la mise à niveau')
    } finally {
      setLoading(false)
    }
  }

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  const calculateTotal = () => {
    const plan = plans.find(p => p.id === selectedPlan)
    const selectedAddonsList = addons.filter(a => selectedAddons.includes(a.id))
    
    const planPrice = plan ? plan.price_month_eur : 0
    const addonsPrice = selectedAddonsList.reduce((sum, addon) => sum + addon.price_month_eur, 0)
    
    return planPrice + addonsPrice
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter': return <Package className="h-6 w-6" />
      case 'professional': return <Users className="h-6 w-6" />
      case 'enterprise': return <Shield className="h-6 w-6" />
      case 'ultimate': return <Crown className="h-6 w-6" />
      default: return <Package className="h-6 w-6" />
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'starter': return 'from-blue-500 to-cyan-500'
      case 'professional': return 'from-purple-500 to-pink-500'
      case 'enterprise': return 'from-orange-500 to-red-500'
      case 'ultimate': return 'from-yellow-400 to-orange-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <ArrowUp className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Mise à Niveau</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Débloquez de nouvelles fonctionnalités et augmentez vos limites
        </p>
      </div>

      {/* Plan actuel */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {getPlanIcon(currentPlan)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Plan Actuel</h3>
                <p className="text-blue-600 font-medium">
                  {plans.find(p => p.id === currentPlan)?.name || 'Starter'}
                </p>
              </div>
            </div>
            <Badge className="bg-blue-600">Actuel</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Plans d'Abonnement</TabsTrigger>
          <TabsTrigger value="addons">Add-ons Fonctionnels</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlan
              const isUpgrade = plans.findIndex(p => p.id === plan.id) > plans.findIndex(p => p.id === currentPlan)
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden transition-all hover:shadow-lg ${
                    isCurrentPlan ? 'border-2 border-blue-500 bg-blue-50' : 
                    isUpgrade ? 'border-2 border-green-200 hover:border-green-400' : 
                    'opacity-60'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                      <Star className="h-3 w-3 inline mr-1" />
                      POPULAIRE
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getPlanColor(plan.id)} rounded-2xl flex items-center justify-center text-white mx-auto mb-4`}>
                      {getPlanIcon(plan.id)}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-blue-600">
                        {plan.price_month_eur}€
                      </p>
                      <p className="text-sm text-gray-500">/mois</p>
                      <p className="text-xs text-gray-400">
                        {plan.price_year_eur}€/an (économisez {Math.round((1 - plan.price_year_eur / (plan.price_month_eur * 12)) * 100)}%)
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 text-center">
                      Plan {plan.name} avec {plan.features.length} fonctionnalités incluses
                    </p>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Limites incluses:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {plan.limits.max_shipments_month || 'Illimité'} colis/mois
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          {plan.limits.max_users || 'Illimité'} utilisateurs
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Clients illimités
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Support {plan.limits.support_level}
                        </li>
                      </ul>
                    </div>
                    
                    <div className="pt-4">
                      {isCurrentPlan ? (
                        <Button disabled className="w-full">
                          <Check className="h-4 w-4 mr-2" />
                          Plan Actuel
                        </Button>
                      ) : isUpgrade ? (
                        <Button 
                          onClick={() => handlePlanUpgrade(plan.id)}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          <ArrowUp className="h-4 w-4 mr-2" />
                          {loading ? 'Mise à niveau...' : 'Mettre à Niveau'}
                        </Button>
                      ) : (
                        <Button disabled variant="outline" className="w-full">
                          Rétrogradation
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="addons" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addons.map((addon) => (
              <Card key={addon.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{addon.name}</CardTitle>
                        <Badge variant="outline">{addon.category}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">
                        {addon.price_month_eur}€
                      </p>
                      <p className="text-xs text-gray-500">/mois</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {addon.description}
                  </p>
                  
                  <Button 
                    variant={selectedAddons.includes(addon.id) ? "default" : "outline"}
                    onClick={() => handleAddonToggle(addon.id)}
                    className="w-full"
                  >
                    {selectedAddons.includes(addon.id) ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Sélectionné
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedAddons.length > 0 && (
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Add-ons Sélectionnés</h3>
                    <p className="text-sm text-gray-600">
                      {selectedAddons.length} add-on(s) sélectionné(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">
                      {addons.filter(a => selectedAddons.includes(a.id))
                        .reduce((sum, addon) => sum + addon.price_month_eur, 0)}€
                    </p>
                    <p className="text-sm text-gray-500">/mois supplémentaires</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Activer les Add-ons
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Section de contact */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Besoin d'un Plan Personnalisé ?</h3>
          <p className="text-gray-600 mb-4">
            Contactez notre équipe commerciale pour des besoins spécifiques ou des volumes importants.
          </p>
          <Button variant="outline" className="bg-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Contacter l'Équipe Commerciale
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
