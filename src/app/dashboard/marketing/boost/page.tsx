'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Plus, BarChart3, Target, DollarSign, Eye, Settings, Play, Pause, Edit, TrendingUp, Clock, Gift } from 'lucide-react'
import { useSession } from 'next-auth/react'
import PaymentModal from '@/components/marketing/PaymentModal'
import { calculateMarketingCost, calculateTotalWithFees, BOOST_TYPES } from '@/lib/marketing-pricing'

interface BoostCampaign {
  id: string
  title: string
  originalContent: string
  contentType: 'package' | 'service' | 'announcement' | 'promotion'
  boostType: 'visibility' | 'priority' | 'featured' | 'trending'
  status: 'active' | 'paused' | 'completed' | 'pending'
  budget: number
  duration: number
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  cost: number
  targetAudience: string
  placement: string[]
}

export default function BoostPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'create' | 'analytics'>('overview')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<any>(null)
  
  const isEnterprise = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  
  if (!isEnterprise) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Restreint</h1>
          <p className="text-gray-600 mb-4">Le boost d'annonces est réservé aux entreprises uniquement.</p>
          <Button
            onClick={() => window.history.back()}
            className="bg-red-600 hover:bg-red-700"
          >
            Retour
          </Button>
        </div>
      </div>
    )
  }

  // Types de boost disponibles
  const boostTypes = [
    {
      id: 'visibility',
      name: 'Visibilité Étendue',
      description: 'Augmente la portée de votre annonce',
      price: 5000,
      icon: '👁️',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'priority',
      name: 'Priorité Élevée',
      description: 'Place votre annonce en tête de liste',
      price: 8000,
      icon: '⭐',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'featured',
      name: 'Mise en Avant',
      description: 'Affichage dans la section vedette',
      price: 12000,
      icon: '🔥',
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'trending',
      name: 'Tendance',
      description: 'Apparaît dans les tendances',
      price: 15000,
      icon: '📈',
      color: 'bg-green-100 text-green-800'
    }
  ]

  // Données mock des campagnes de boost
  const boostCampaigns: BoostCampaign[] = [
    {
      id: '1',
      title: 'Expédition Express Chine-Sénégal',
      originalContent: 'Service d\'expédition rapide en 5-7 jours avec suivi temps réel',
      contentType: 'service',
      boostType: 'featured',
      status: 'active',
      budget: 12000,
      duration: 7,
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      impressions: 15420,
      clicks: 892,
      ctr: 5.8,
      conversions: 34,
      cost: 8400,
      targetAudience: 'Importateurs Sénégal',
      placement: ['homepage', 'search_results', 'category_page']
    },
    {
      id: '2',
      title: 'Promotion Électronique -30%',
      originalContent: 'Réduction exceptionnelle sur tous les produits électroniques',
      contentType: 'promotion',
      boostType: 'trending',
      status: 'active',
      budget: 15000,
      duration: 14,
      startDate: '2024-01-10',
      endDate: '2024-01-24',
      impressions: 28350,
      clicks: 1456,
      ctr: 5.1,
      conversions: 67,
      cost: 11200,
      targetAudience: 'Particuliers Afrique',
      placement: ['homepage', 'trending_section']
    },
    {
      id: '3',
      title: 'Colis Textile Premium',
      originalContent: 'Expédition de 500kg de textiles haute qualité vers Abidjan',
      contentType: 'package',
      boostType: 'visibility',
      status: 'paused',
      budget: 5000,
      duration: 3,
      startDate: '2024-01-18',
      endDate: '2024-01-21',
      impressions: 8920,
      clicks: 445,
      ctr: 5.0,
      conversions: 12,
      cost: 3200,
      targetAudience: 'Grossistes Textile',
      placement: ['search_results']
    }
  ]

  // Calculs des métriques globales
  const totalCost = boostCampaigns.reduce((sum, campaign) => sum + campaign.cost, 0)
  const totalImpressions = boostCampaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
  const totalClicks = boostCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)
  const totalConversions = boostCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'package': return '📦'
      case 'service': return '🚚'
      case 'announcement': return '📢'
      case 'promotion': return '🎁'
      default: return '📄'
    }
  }

  const getBoostTypeText = (type: string) => {
    switch (type) {
      case 'visibility': return 'Visibilité'
      case 'priority': return 'Priorité'
      case 'featured': return 'Vedette'
      case 'trending': return 'Tendance'
      default: return type
    }
  }

  const getBoostTypeColor = (type: string) => {
    switch (type) {
      case 'visibility': return 'bg-blue-100 text-blue-800'
      case 'priority': return 'bg-yellow-100 text-yellow-800'
      case 'featured': return 'bg-red-100 text-red-800'
      case 'trending': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Event handlers for boost functionality
  const handleCreateBoost = () => {
    const baseCost = calculateMarketingCost('boost', 7, 'featured')
    const totalCost = calculateTotalWithFees(baseCost)
    
    setSelectedOperation({
      type: 'boost',
      name: 'Nouveau Boost d\'annonce',
      cost: totalCost.total,
      duration: 7,
      description: 'Boost avec mise en avant et optimisation automatique'
    })
    setShowPaymentModal(true)
  }

  const handleConfirmPayment = () => {
    alert('Boost créé avec succès ! Paiement confirmé.')
    setShowPaymentModal(false)
    setSelectedOperation(null)
  }

  const handlePauseBoost = (boostId: string) => {
    alert(`Boost ${boostId} mis en pause`)
  }

  const handleResumeBoost = (boostId: string) => {
    alert(`Boost ${boostId} repris`)
  }

  const handleEditBoost = (boostId: string) => {
    alert(`Redirection vers l'édition du boost ${boostId}`)
  }

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <Zap className="h-10 w-10 mr-3" />
              Boost
            </h1>
            <p className="text-orange-100 text-lg">
              Boostez vos annonces pour augmenter leur visibilité et performance
            </p>
          </div>
          <Button 
            className="bg-white text-orange-600 hover:bg-gray-100 font-semibold"
            size="lg"
            onClick={handleCreateBoost}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Boost
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
          { id: 'campaigns', label: 'Mes Boosts', icon: Zap },
          { id: 'create', label: 'Créer un Boost', icon: Plus },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              activeTab === tab.id
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Métriques globales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Budget Dépensé</p>
                    <p className="text-2xl font-bold text-orange-600">{totalCost.toLocaleString()} FCFA</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="text-2xl font-bold text-red-600">{totalImpressions.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clics</p>
                    <p className="text-2xl font-bold text-yellow-600">{totalClicks.toLocaleString()}</p>
                  </div>
                  <Target className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold text-green-600">{totalConversions.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Types de boost disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="h-6 w-6 mr-2 text-orange-600" />
                Types de Boost Disponibles
              </CardTitle>
              <CardDescription>
                Choisissez le type de boost qui correspond à vos objectifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {boostTypes.map((type) => (
                  <div key={type.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                    <div className="text-center">
                      <span className="text-lg font-bold text-orange-600">
                        {type.price.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mes Boosts */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Mes Campagnes de Boost</h2>
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={handleCreateBoost}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Boost
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Annonce
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type de Boost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coût
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {boostCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-xl mr-3">{getContentTypeIcon(campaign.contentType)}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{campaign.originalContent}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getBoostTypeColor(campaign.boostType)}>
                            {getBoostTypeText(campaign.boostType)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {campaign.impressions.toLocaleString()} vues
                          </div>
                          <div className="text-sm text-gray-500">
                            {campaign.clicks} clics • {campaign.ctr}% CTR
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {campaign.cost.toLocaleString()} FCFA
                          </div>
                          <div className="text-sm text-gray-500">
                            sur {campaign.budget.toLocaleString()} FCFA
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status === 'active' ? 'Actif' : 
                             campaign.status === 'paused' ? 'En pause' :
                             campaign.status === 'completed' ? 'Terminé' : 'En attente'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {campaign.status === 'active' ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePauseBoost(campaign.id)}
                              >
                                <Pause className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleResumeBoost(campaign.id)}
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditBoost(campaign.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Autres onglets */}
      {(activeTab === 'create' || activeTab === 'analytics') && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'create' ? 'Créateur de Boost' : 'Analytics Avancées'}
            </h3>
            <p className="text-gray-600 mb-6">
              Cette section sera développée avec des fonctionnalités complètes.
            </p>
            <div className="bg-orange-50 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-orange-900 mb-2">Fonctionnalités prévues :</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                {activeTab === 'create' ? (
                  <>
                    <li>• Assistant de création de boost</li>
                    <li>• Sélection de contenu existant</li>
                    <li>• Configuration avancée du ciblage</li>
                    <li>• Prévisualisation en temps réel</li>
                  </>
                ) : (
                  <>
                    <li>• Rapports détaillés par boost</li>
                    <li>• Analyse ROI par type de boost</li>
                    <li>• Comparaison de performance</li>
                    <li>• Recommandations d'optimisation</li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de paiement */}
      {selectedOperation && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedOperation(null)
          }}
          onConfirm={handleConfirmPayment}
          operation={selectedOperation}
        />
      )}
    </div>
  )
}
