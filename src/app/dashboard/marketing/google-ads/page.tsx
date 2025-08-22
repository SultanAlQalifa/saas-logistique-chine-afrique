'use client'

import React, { useState } from 'react'
import { Chrome, Plus, BarChart3, Target, DollarSign, Eye, ArrowLeft, Settings, Play, Pause, Edit, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface GoogleAdsCampaign {
  id: string
  name: string
  type: 'search' | 'display' | 'shopping' | 'video' | 'performance_max'
  status: 'active' | 'paused' | 'draft' | 'ended'
  budget: number
  budgetType: 'daily' | 'total'
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  ctr: number
  avgCpc: number
  conversions: number
  conversionRate: number
  cost: number
  roas: number
}

export default function GoogleAdsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  
  const isEnterprise = session?.user?.role === 'ADMIN'
  
  if (!isEnterprise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Restreint</h1>
          <p className="text-gray-600 mb-4">Google Ads est réservé aux entreprises uniquement.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    )
  }

  const [campaigns, setCampaigns] = useState<GoogleAdsCampaign[]>([
    {
      id: '1',
      name: 'Logistique Express Afrique',
      type: 'search',
      status: 'active',
      budget: 75000,
      budgetType: 'daily',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      impressions: 125000,
      clicks: 3750,
      ctr: 3.0,
      avgCpc: 20.0,
      conversions: 225,
      conversionRate: 6.0,
      cost: 1875000,
      roas: 4.2
    },
    {
      id: '2',
      name: 'Display Réseau Transport',
      type: 'display',
      status: 'active',
      budget: 50000,
      budgetType: 'daily',
      startDate: '2024-01-20',
      endDate: '2024-02-20',
      impressions: 450000,
      clicks: 2250,
      ctr: 0.5,
      avgCpc: 11.1,
      conversions: 90,
      conversionRate: 4.0,
      cost: 625000,
      roas: 3.8
    },
    {
      id: '3',
      name: 'Shopping Produits Logistique',
      type: 'shopping',
      status: 'paused',
      budget: 100000,
      budgetType: 'daily',
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      impressions: 89000,
      clicks: 1780,
      ctr: 2.0,
      avgCpc: 28.1,
      conversions: 142,
      conversionRate: 8.0,
      cost: 1250000,
      roas: 5.1
    }
  ])

  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'keywords' | 'extensions'>('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'ended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCampaignTypeText = (type: string) => {
    switch (type) {
      case 'search': return 'Recherche'
      case 'display': return 'Display'
      case 'shopping': return 'Shopping'
      case 'video': return 'Vidéo'
      case 'performance_max': return 'Performance Max'
      default: return type
    }
  }

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'search': return '🔍'
      case 'display': return '🖼️'
      case 'shopping': return '🛒'
      case 'video': return '📹'
      case 'performance_max': return '⚡'
      default: return '📊'
    }
  }

  const totalCost = campaigns.reduce((sum, c) => sum + c.cost, 0)
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions * 100) : 0
  const avgROAS = campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-white/50 transition-colors flex items-center text-gray-600 hover:text-red-600"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center">
            <Chrome className="w-8 h-8 mr-3 text-red-600" />
            Google Ads
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos campagnes publicitaires Google Ads
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'campaigns', label: 'Campagnes', icon: Target },
            { id: 'keywords', label: 'Mots-clés', icon: Search },
            { id: 'extensions', label: 'Extensions', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-red-600'
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Coût Total</p>
                    <p className="text-2xl font-bold text-red-600">{totalCost.toLocaleString()} FCFA</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="text-2xl font-bold text-orange-600">{totalImpressions.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clics</p>
                    <p className="text-2xl font-bold text-green-600">{totalClicks.toLocaleString()}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ROAS Moyen</p>
                    <p className="text-2xl font-bold text-purple-600">{avgROAS.toFixed(1)}x</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Métriques secondaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">CTR Moyen</h3>
                <div className="text-3xl font-bold text-blue-600">{avgCTR.toFixed(2)}%</div>
                <p className="text-sm text-gray-600 mt-2">Taux de clic global</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Conversions</h3>
                <div className="text-3xl font-bold text-green-600">{totalConversions}</div>
                <p className="text-sm text-gray-600 mt-2">Total des conversions</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">CPC Moyen</h3>
                <div className="text-3xl font-bold text-orange-600">
                  {totalClicks > 0 ? (totalCost / totalClicks).toFixed(0) : 0} FCFA
                </div>
                <p className="text-sm text-gray-600 mt-2">Coût par clic</p>
              </div>
            </div>

            {/* Répartition par type de campagne */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Répartition par Type de Campagne</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['search', 'display', 'shopping'].map((type) => {
                  const typeCampaigns = campaigns.filter(c => c.type === type)
                  const typeClicks = typeCampaigns.reduce((sum, c) => sum + c.clicks, 0)
                  const typeCost = typeCampaigns.reduce((sum, c) => sum + c.cost, 0)
                  
                  return (
                    <div key={type} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{getCampaignTypeIcon(type)}</span>
                        <h4 className="font-medium">{getCampaignTypeText(type)}</h4>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Campagnes:</span>
                          <span className="font-medium">{typeCampaigns.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Clics:</span>
                          <span className="font-medium">{typeClicks.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coût:</span>
                          <span className="font-medium">{typeCost.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Campagnes */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des Campagnes</h2>
              <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Créer une Campagne
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campagne
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ROAS
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
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">ID: {campaign.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="mr-2">{getCampaignTypeIcon(campaign.type)}</span>
                            <span className="text-sm text-gray-900">{getCampaignTypeText(campaign.type)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{campaign.budget.toLocaleString()} FCFA</div>
                          <div className="text-gray-500">
                            {campaign.budgetType === 'daily' ? 'Quotidien' : 'Total'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{campaign.impressions.toLocaleString()} impressions</div>
                          <div>{campaign.clicks.toLocaleString()} clics ({campaign.ctr}%)</div>
                          <div className="text-green-600">{campaign.conversions} conversions</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-lg font-bold ${
                            campaign.roas >= 4 ? 'text-green-600' : 
                            campaign.roas >= 2 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {campaign.roas.toFixed(1)}x
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status === 'active' ? 'Active' : 
                             campaign.status === 'paused' ? 'En pause' : 
                             campaign.status === 'ended' ? 'Terminée' : campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Play className="w-4 h-4" />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900">
                              <Pause className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Autres onglets */}
        {(activeTab === 'keywords' || activeTab === 'extensions') && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'keywords' ? 'Gestion des Mots-clés' : 'Extensions d\'Annonces'}
            </h3>
            <p className="text-gray-600 mb-6">
              Cette section sera disponible avec l'intégration complète de l'API Google Ads.
            </p>
            <div className="bg-red-50 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-red-900 mb-2">Fonctionnalités prévues :</h4>
              <ul className="text-sm text-red-800 space-y-1">
                {activeTab === 'keywords' ? (
                  <>
                    <li>• Recherche de mots-clés</li>
                    <li>• Analyse de la concurrence</li>
                    <li>• Enchères automatisées</li>
                    <li>• Mots-clés négatifs</li>
                  </>
                ) : (
                  <>
                    <li>• Extensions de liens annexes</li>
                    <li>• Extensions d'accroche</li>
                    <li>• Extensions de lieu</li>
                    <li>• Extensions d'appel</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
