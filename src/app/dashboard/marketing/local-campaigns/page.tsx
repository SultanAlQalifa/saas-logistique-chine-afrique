'use client'

import React, { useState } from 'react'
import { MapPin, Plus, BarChart3, Target, DollarSign, Eye, ArrowLeft, Settings, Play, Pause, Edit, Users, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface LocalCampaign {
  id: string
  name: string
  type: 'banner' | 'newsletter' | 'push' | 'popup' | 'sponsored_content'
  status: 'active' | 'paused' | 'draft' | 'completed'
  budget: number
  startDate: string
  endDate: string
  targetRegions: string[]
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  cost: number
  audience: string
  placement: string
}

export default function LocalCampaignsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  
  const isEnterprise = session?.user?.role === 'ADMIN'
  
  if (!isEnterprise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Restreint</h1>
          <p className="text-gray-600 mb-4">Les campagnes locales sont réservées aux entreprises uniquement.</p>
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

  const [campaigns, setCampaigns] = useState<LocalCampaign[]>([
    {
      id: '1',
      name: 'Promotion Express Dakar',
      type: 'banner',
      status: 'active',
      budget: 150000,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      targetRegions: ['Dakar', 'Thiès', 'Rufisque'],
      impressions: 45000,
      clicks: 1350,
      ctr: 3.0,
      conversions: 95,
      cost: 125000,
      audience: 'Entreprises import-export',
      placement: 'Header principal'
    },
    {
      id: '2',
      name: 'Newsletter Logistique Abidjan',
      type: 'newsletter',
      status: 'active',
      budget: 80000,
      startDate: '2024-01-20',
      endDate: '2024-03-20',
      targetRegions: ['Abidjan', 'Bouaké', 'San Pedro'],
      impressions: 12000,
      clicks: 840,
      ctr: 7.0,
      conversions: 126,
      cost: 65000,
      audience: 'PME locales',
      placement: 'Newsletter hebdomadaire'
    },
    {
      id: '3',
      name: 'Push Notifications Casablanca',
      type: 'push',
      status: 'paused',
      budget: 100000,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      targetRegions: ['Casablanca', 'Rabat', 'Tangier'],
      impressions: 28000,
      clicks: 560,
      ctr: 2.0,
      conversions: 42,
      cost: 75000,
      audience: 'Utilisateurs mobiles actifs',
      placement: 'Notifications push'
    }
  ])

  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'regions' | 'analytics'>('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCampaignTypeText = (type: string) => {
    switch (type) {
      case 'banner': return 'Bannière'
      case 'newsletter': return 'Newsletter'
      case 'push': return 'Push Notification'
      case 'popup': return 'Popup'
      case 'sponsored_content': return 'Contenu Sponsorisé'
      default: return type
    }
  }

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'banner': return '🖼️'
      case 'newsletter': return '📧'
      case 'push': return '📱'
      case 'popup': return '💬'
      case 'sponsored_content': return '📝'
      default: return '📊'
    }
  }

  const totalCost = campaigns.reduce((sum, c) => sum + c.cost, 0)
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions * 100) : 0

  // Données par région
  const regionStats = campaigns.reduce((acc, campaign) => {
    campaign.targetRegions.forEach(region => {
      if (!acc[region]) {
        acc[region] = { impressions: 0, clicks: 0, conversions: 0, campaigns: 0 }
      }
      acc[region].impressions += Math.floor(campaign.impressions / campaign.targetRegions.length)
      acc[region].clicks += Math.floor(campaign.clicks / campaign.targetRegions.length)
      acc[region].conversions += Math.floor(campaign.conversions / campaign.targetRegions.length)
      acc[region].campaigns += 1
    })
    return acc
  }, {} as Record<string, any>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-white/50 transition-colors flex items-center text-gray-600 hover:text-green-600"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center">
            <MapPin className="w-8 h-8 mr-3 text-green-600" />
            Campagnes Publicitaires Locales
          </h1>
          <p className="text-gray-600 mt-2">
            Créez et gérez vos campagnes publicitaires sur la plateforme NextMove
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'campaigns', label: 'Campagnes', icon: Target },
            { id: 'regions', label: 'Ciblage Régional', icon: MapPin },
            { id: 'analytics', label: 'Analytics', icon: Eye }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
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
                    <p className="text-sm text-gray-600">Budget Dépensé</p>
                    <p className="text-2xl font-bold text-green-600">{totalCost.toLocaleString()} FCFA</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="text-2xl font-bold text-teal-600">{totalImpressions.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-teal-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clics</p>
                    <p className="text-2xl font-bold text-cyan-600">{totalClicks.toLocaleString()}</p>
                  </div>
                  <Target className="w-8 h-8 text-cyan-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold text-blue-600">{totalConversions.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Performance par type de campagne */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Performance par Type de Campagne</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['banner', 'newsletter', 'push'].map((type) => {
                  const typeCampaigns = campaigns.filter(c => c.type === type)
                  const typeClicks = typeCampaigns.reduce((sum, c) => sum + c.clicks, 0)
                  const typeConversions = typeCampaigns.reduce((sum, c) => sum + c.conversions, 0)
                  const typeCost = typeCampaigns.reduce((sum, c) => sum + c.cost, 0)
                  
                  return (
                    <div key={type} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-2">{getCampaignTypeIcon(type)}</span>
                        <h4 className="font-medium">{getCampaignTypeText(type)}</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Campagnes:</span>
                          <span className="font-medium">{typeCampaigns.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Clics:</span>
                          <span className="font-medium">{typeClicks.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conversions:</span>
                          <span className="font-medium text-green-600">{typeConversions}</span>
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

            {/* Top régions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Performance par Région</h3>
              <div className="space-y-3">
                {Object.entries(regionStats)
                  .sort(([,a], [,b]) => b.conversions - a.conversions)
                  .slice(0, 5)
                  .map(([region, stats]) => (
                    <div key={region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">{region}</h4>
                          <p className="text-sm text-gray-600">{stats.campaigns} campagne(s)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{stats.conversions} conversions</div>
                        <div className="text-sm text-gray-600">{stats.clicks.toLocaleString()} clics</div>
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
              <h2 className="text-xl font-semibold">Gestion des Campagnes Locales</h2>
              <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all flex items-center">
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
                        Régions Ciblées
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
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
                            <div className="text-sm text-gray-500">{campaign.placement}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="mr-2">{getCampaignTypeIcon(campaign.type)}</span>
                            <span className="text-sm text-gray-900">{getCampaignTypeText(campaign.type)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex flex-wrap gap-1">
                            {campaign.targetRegions.slice(0, 2).map(region => (
                              <span key={region} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {region}
                              </span>
                            ))}
                            {campaign.targetRegions.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{campaign.targetRegions.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{campaign.impressions.toLocaleString()} impressions</div>
                          <div>{campaign.clicks.toLocaleString()} clics ({campaign.ctr}%)</div>
                          <div className="text-green-600">{campaign.conversions} conversions</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-medium">{campaign.budget.toLocaleString()} FCFA</div>
                          <div className="text-gray-500">Dépensé: {campaign.cost.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status === 'active' ? 'Active' : 
                             campaign.status === 'paused' ? 'En pause' : 
                             campaign.status === 'completed' ? 'Terminée' : campaign.status}
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
        {(activeTab === 'regions' || activeTab === 'analytics') && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'regions' ? 'Ciblage Régional Avancé' : 'Analytics Détaillées'}
            </h3>
            <p className="text-gray-600 mb-6">
              Cette section sera développée avec des fonctionnalités avancées.
            </p>
            <div className="bg-green-50 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-green-900 mb-2">Fonctionnalités prévues :</h4>
              <ul className="text-sm text-green-800 space-y-1">
                {activeTab === 'regions' ? (
                  <>
                    <li>• Carte interactive des régions</li>
                    <li>• Ciblage par ville/quartier</li>
                    <li>• Données démographiques</li>
                    <li>• Analyse de la concurrence locale</li>
                  </>
                ) : (
                  <>
                    <li>• Rapports détaillés par campagne</li>
                    <li>• Analyse de cohorte</li>
                    <li>• Attribution multi-touch</li>
                    <li>• ROI par région</li>
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
