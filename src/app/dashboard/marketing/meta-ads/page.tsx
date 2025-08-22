'use client'

import React, { useState } from 'react'
import { Facebook, Plus, BarChart3, Target, DollarSign, Eye, ArrowLeft, Settings, Play, Pause, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface MetaCampaign {
  id: string
  name: string
  objective: string
  status: 'active' | 'paused' | 'draft' | 'completed'
  budget: number
  budgetType: 'daily' | 'lifetime'
  startDate: string
  endDate: string
  reach: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
  spent: number
  platforms: ('facebook' | 'instagram' | 'messenger' | 'audience_network')[]
}

export default function MetaAdsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  
  const isEnterprise = session?.user?.role === 'ADMIN'
  
  if (!isEnterprise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Restreint</h1>
          <p className="text-gray-600 mb-4">Meta Ads est réservé aux entreprises uniquement.</p>
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

  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([
    {
      id: '1',
      name: 'Campagne Logistique Afrique',
      objective: 'traffic',
      status: 'active',
      budget: 50000,
      budgetType: 'daily',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      reach: 125000,
      impressions: 450000,
      clicks: 12500,
      ctr: 2.78,
      cpc: 4.0,
      conversions: 850,
      spent: 1250000,
      platforms: ['facebook', 'instagram']
    },
    {
      id: '2',
      name: 'Promotion Services Express',
      objective: 'conversions',
      status: 'active',
      budget: 75000,
      budgetType: 'daily',
      startDate: '2024-01-20',
      endDate: '2024-03-20',
      reach: 89000,
      impressions: 320000,
      clicks: 8900,
      ctr: 2.78,
      cpc: 5.5,
      conversions: 450,
      spent: 890000,
      platforms: ['facebook', 'instagram', 'messenger']
    }
  ])

  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'audiences' | 'creatives'>('overview')

  // Event handlers for button functionality
  const handleCreateCampaign = () => {
    alert('Redirection vers la création de campagne Meta Ads')
  }

  const handleEditCampaign = (campaignId: string) => {
    alert(`Édition de la campagne ${campaignId}`)
  }

  const handlePauseCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'paused' as const }
        : campaign
    ))
    alert(`Campagne ${campaignId} mise en pause`)
  }

  const handlePlayCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'active' as const }
        : campaign
    ))
    alert(`Campagne ${campaignId} activée`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getObjectiveText = (objective: string) => {
    switch (objective) {
      case 'traffic': return 'Trafic'
      case 'conversions': return 'Conversions'
      case 'reach': return 'Portée'
      case 'engagement': return 'Engagement'
      case 'app_installs': return 'Installations App'
      case 'video_views': return 'Vues Vidéo'
      default: return objective
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘'
      case 'instagram': return '📷'
      case 'messenger': return '💬'
      case 'audience_network': return '🌐'
      default: return '📱'
    }
  }

  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-white/50 transition-colors flex items-center text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <Facebook className="w-8 h-8 mr-3 text-blue-600" />
            Meta Ads (Facebook & Instagram)
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos campagnes publicitaires Facebook et Instagram
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'campaigns', label: 'Campagnes', icon: Target },
            { id: 'audiences', label: 'Audiences', icon: Eye },
            { id: 'creatives', label: 'Créatifs', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
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
                    <p className="text-sm text-gray-600">Dépenses Totales</p>
                    <p className="text-2xl font-bold text-blue-600">{totalSpent.toLocaleString()} FCFA</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="text-2xl font-bold text-purple-600">{totalImpressions.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-600" />
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
                    <p className="text-sm text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold text-orange-600">{totalConversions.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Graphique de performance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Performance des 30 derniers jours</h3>
              <div className="h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Graphique de performance</p>
                  <p className="text-sm">Intégration avec Meta Business API</p>
                </div>
              </div>
            </div>

            {/* Campagnes récentes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Campagnes Actives</h3>
                <button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
                  onClick={handleCreateCampaign}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Campagne
                </button>
              </div>

              <div className="space-y-4">
                {campaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-600">{getObjectiveText(campaign.objective)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status === 'active' ? 'Active' : campaign.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <p className="font-medium">{campaign.budget.toLocaleString()} FCFA/{campaign.budgetType === 'daily' ? 'jour' : 'total'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Impressions:</span>
                        <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">CTR:</span>
                        <p className="font-medium">{campaign.ctr}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Plateformes:</span>
                        <p className="font-medium">
                          {campaign.platforms.map(p => getPlatformIcon(p)).join(' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Campagnes */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des Campagnes</h2>
              <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
                onClick={handleCreateCampaign}
              >
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
                        Objectif
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
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
                            <div className="text-sm text-gray-500">
                              {campaign.platforms.map(p => getPlatformIcon(p)).join(' ')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getObjectiveText(campaign.objective)}
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
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status === 'active' ? 'Active' : campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => handleEditCampaign(campaign.id)}
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {campaign.status === 'paused' ? (
                              <button 
                                className="text-green-600 hover:text-green-900"
                                onClick={() => handlePlayCampaign(campaign.id)}
                                title="Activer"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                className="text-yellow-600 hover:text-yellow-900"
                                onClick={() => handlePauseCampaign(campaign.id)}
                                title="Mettre en pause"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            )}
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
        {(activeTab === 'audiences' || activeTab === 'creatives') && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'audiences' ? 'Gestion des Audiences' : 'Créatifs Publicitaires'}
            </h3>
            <p className="text-gray-600 mb-6">
              Cette section sera disponible avec l'intégration complète de l'API Meta Business.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-blue-900 mb-2">Fonctionnalités prévues :</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {activeTab === 'audiences' ? (
                  <>
                    <li>• Création d'audiences personnalisées</li>
                    <li>• Audiences similaires (Lookalike)</li>
                    <li>• Ciblage géographique et démographique</li>
                    <li>• Retargeting pixel Facebook</li>
                  </>
                ) : (
                  <>
                    <li>• Bibliothèque de créatifs</li>
                    <li>• Tests A/B automatisés</li>
                    <li>• Formats vidéo et carrousel</li>
                    <li>• Optimisation automatique</li>
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
