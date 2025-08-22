'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  ArrowRight, 
  Check, 
  Star, 
  Users, 
  Package,
  CreditCard,
  Shield,
  Zap,
  AlertCircle,
  Crown
} from 'lucide-react'
import { OwnerPlan, mockOwnerPlans } from '@/lib/multi-tenant-pricing'

interface ConversionStep {
  id: string
  title: string
  description: string
  completed: boolean
  current: boolean
}

export default function ClientToEnterprisePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [plans, setPlans] = useState<OwnerPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    size: '',
    description: ''
  })

  const conversionSteps: ConversionStep[] = [
    {
      id: '1',
      title: 'Informations Entreprise',
      description: 'Renseignez les détails de votre entreprise',
      completed: currentStep > 1,
      current: currentStep === 1
    },
    {
      id: '2',
      title: 'Choix du Plan',
      description: 'Sélectionnez votre plan d\'abonnement SaaS',
      completed: currentStep > 2,
      current: currentStep === 2
    },
    {
      id: '3',
      title: 'Configuration',
      description: 'Configurez votre espace entreprise',
      completed: currentStep > 3,
      current: currentStep === 3
    },
    {
      id: '4',
      title: 'Confirmation',
      description: 'Finalisez votre conversion',
      completed: currentStep > 4,
      current: currentStep === 4
    }
  ]

  useEffect(() => {
    // Vérifier que l'utilisateur est bien un client
    if (session?.user?.role !== 'CLIENT') {
      router.push('/dashboard')
      return
    }

    setPlans(mockOwnerPlans)
  }, [session, router])

  const handleCompanyInfoChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleConversion = async () => {
    setLoading(true)
    try {
      // TODO: Appeler l'API pour convertir le client en entreprise
      console.log('Converting client to enterprise:', {
        companyInfo,
        selectedPlan,
        userId: session?.user?.id
      })
      
      // Simulation de conversion
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      alert('Conversion réussie! Vous êtes maintenant une entreprise.')
      router.push('/dashboard')
    } catch (error) {
      console.error('Erreur lors de la conversion:', error)
      alert('Erreur lors de la conversion')
    } finally {
      setLoading(false)
    }
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

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return companyInfo.name && companyInfo.email && companyInfo.phone
      case 2:
        return selectedPlan !== ''
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  if (session?.user?.role !== 'CLIENT') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès Restreint</h2>
            <p className="text-gray-600">
              Cette page est réservée aux clients souhaitant devenir entreprise.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Devenir Entreprise</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Transformez votre compte client en compte entreprise et accédez à toutes les fonctionnalités SaaS
        </p>
      </div>

      {/* Étapes de progression */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {conversionSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.completed ? 'bg-green-500 text-white' :
                    step.current ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {step.completed ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="text-center mt-2">
                    <p className={`text-sm font-medium ${step.current ? 'text-blue-600' : 'text-gray-600'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < conversionSteps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenu des étapes */}
      <Card>
        <CardContent className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Informations de votre Entreprise</h2>
                <p className="text-gray-600">
                  Renseignez les détails de votre entreprise pour créer votre compte professionnel
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom de l'entreprise *</label>
                  <Input
                    value={companyInfo.name}
                    onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                    placeholder="Ex: LogiTrans SARL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email professionnel *</label>
                  <Input
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                    placeholder="contact@votre-entreprise.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone *</label>
                  <Input
                    value={companyInfo.phone}
                    onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                    placeholder="+221 77 123 45 67"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secteur d'activité</label>
                  <select
                    value={companyInfo.industry}
                    onChange={(e) => handleCompanyInfoChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionnez un secteur</option>
                    <option value="logistics">Logistique</option>
                    <option value="transport">Transport</option>
                    <option value="commerce">Commerce</option>
                    <option value="import-export">Import/Export</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Adresse</label>
                  <Input
                    value={companyInfo.address}
                    onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                    placeholder="Adresse complète de l'entreprise"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description de l'activité</label>
                  <textarea
                    value={companyInfo.description}
                    onChange={(e) => handleCompanyInfoChange('description', e.target.value)}
                    placeholder="Décrivez brièvement votre activité..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Choisissez votre Plan SaaS</h2>
                <p className="text-gray-600">
                  Sélectionnez le plan qui correspond le mieux à vos besoins
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedPlan === plan.id ? 'border-2 border-blue-500 bg-blue-50' : 'hover:border-blue-200'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
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
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
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
                      
                      {selectedPlan === plan.id && (
                        <div className="pt-2">
                          <Badge className="w-full justify-center bg-blue-600">
                            <Check className="h-4 w-4 mr-2" />
                            Sélectionné
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Configuration de votre Espace</h2>
                <p className="text-gray-600">
                  Votre espace entreprise sera configuré automatiquement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Gestion des Utilisateurs</h3>
                      <p className="text-sm text-gray-600">Invitez et gérez votre équipe</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Inclus
                  </Badge>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Gestion des Colis</h3>
                      <p className="text-sm text-gray-600">Suivi et gestion avancés</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Inclus
                  </Badge>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Facturation</h3>
                      <p className="text-sm text-gray-600">Système de facturation intégré</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Inclus
                  </Badge>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">API & Intégrations</h3>
                      <p className="text-sm text-gray-600">Connectez vos outils</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Inclus
                  </Badge>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Récapitulatif de Conversion</h2>
                <p className="text-gray-600">
                  Vérifiez les informations avant de finaliser votre conversion
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Entreprise</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Nom:</strong> {companyInfo.name}</p>
                    <p><strong>Email:</strong> {companyInfo.email}</p>
                    <p><strong>Téléphone:</strong> {companyInfo.phone}</p>
                    <p><strong>Secteur:</strong> {companyInfo.industry || 'Non spécifié'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Plan Sélectionné</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPlan && (
                      <div className="space-y-2">
                        <p><strong>Plan:</strong> {plans.find(p => p.id === selectedPlan)?.name}</p>
                        <p><strong>Prix:</strong> {plans.find(p => p.id === selectedPlan)?.price_month_eur}€/mois</p>
                        <p><strong>Limites:</strong></p>
                        <ul className="text-sm text-gray-600 ml-4">
                          <li>• {plans.find(p => p.id === selectedPlan)?.limits.max_shipments_month || 'Illimité'} colis/mois</li>
                          <li>• {plans.find(p => p.id === selectedPlan)?.limits.max_users || 'Illimité'} utilisateurs</li>
                          <li>• Clients illimités</li>
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">Important</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Votre compte client sera converti en compte entreprise</li>
                        <li>• Vous aurez accès à toutes les fonctionnalités SaaS</li>
                        <li>• La facturation commencera immédiatement</li>
                        <li>• Vous pourrez inviter des utilisateurs dans votre équipe</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex justify-between pt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              disabled={currentStep === 1}
            >
              Précédent
            </Button>
            
            {currentStep < 4 ? (
              <Button 
                onClick={handleNextStep}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleConversion}
                disabled={loading || !isStepValid()}
                className="bg-gradient-to-r from-green-600 to-blue-600"
              >
                {loading ? 'Conversion en cours...' : 'Finaliser la Conversion'}
                <Building2 className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
