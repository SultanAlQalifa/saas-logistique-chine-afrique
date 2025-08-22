'use client'

import React, { useState } from 'react'
import { Music, Plus, BarChart3, Target, DollarSign, Eye, ArrowLeft, Settings, Play, Pause, Edit, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface TikTokCampaign {
  id: string
  name: string
  objective: 'reach' | 'traffic' | 'video_views' | 'conversions' | 'app_installs'
  status: 'active' | 'paused' | 'draft' | 'completed'
  budget: number
  budgetType: 'daily' | 'lifetime'
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  videoViews: number
  videoViewRate: number
  ctr: number
  cpm: number
  conversions: number
  cost: number
  targetAudience: string
}

export default function TikTokAdsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  
  const isEnterprise = session?.user?.role === 'ADMIN'
  
  if (!isEnterprise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Restreint</h1>
          <p className="text-gray-600 mb-4">TikTok Ads est réservé aux entreprises uniquement.</p>
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

  const [campaigns, setCampaigns] = useState<TikTokCampaign[]>([
    {
      id: '1',
      name: 'Logistique TikTok Gen Z',
      objective: 'video_views',
      status: 'active',
      budget: 40000,
      budgetType: 'daily',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      impressions: 890000,
      clicks: 12500,
      videoViews: 450000,
      videoViewRate: 50.6,
      ctr: 1.4,
      cpm: 89.0,
      conversions: 320,
      cost: 980000,
      targetAudience: '18-34 ans, Afrique de l\'Ouest'
    },
    {
      id: '2',
      name: 'Express Delivery Challenge',
      objective: 'conversions',
      status: 'active',
      budget: 60000,
      budgetType: 'daily',
      startDate: '2024-01-20',
      endDate: '2024-03-20',
      impressions: 1200000,
      clicks: 18000,
      videoViews: 720000,
      videoViewRate: 60.0,
      ctr: 1.5,
      cpm: 75.0,
      conversions: 540,
      cost: 1350000,
      targetAudience: '25-45 ans, Entrepreneurs'
    }
  ])

  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'creatives' | 'audiences'>('overview')

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
      case 'reach': return 'Portée'
      case 'traffic': return 'Trafic'
      case 'video_views': return 'Vues Vidéo'
      case 'conversions': return 'Conversions'
      case 'app_installs': return 'Installations App'
      default: return objective
    }
  }

  const getObjectiveIcon = (objective: string) => {
    switch (objective) {
      case 'reach': return '👥'
      case 'traffic': return '🌐'
      case 'video_views': return '📹'
      case 'conversions': return '💰'
      case 'app_installs': return '📱'
      default: return '🎯'
    }
  }

  const totalCost = campaigns.reduce((sum, c) => sum + c.cost, 0)
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)
  const totalVideoViews = campaigns.reduce((sum, c) => sum + c.videoViews, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgVideoViewRate = campaigns.length > 0 ? campaigns.reduce((sum, c) => sum + c.videoViewRate, 0) / campaigns.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-white/50 transition-colors flex items-center text-gray-600 hover:text-pink-600"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <Music className="w-8 h-8 mr-3 text-pink-600" />
            TikTok Ads
          </h1>
          <p className="text-gray-600 mt-2">
            Créez des campagnes vidéo engageantes sur TikTok
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'campaigns', label: 'Campagnes', icon: Target },
            { id: 'creatives', label: 'Créatifs Vidéo', icon: Video },
            { id: 'audiences', label: 'Audiences', icon: Eye }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-600 hover:text-pink-600'
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
                    <p className="text-2xl font-bold text-pink-600">{totalCost.toLocaleString()} FCFA</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-pink-600" />
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
                    <p className="text-sm text-gray-600">Vues Vidéo</p>
                    <p className="text-2xl font-bold text-indigo-600">{totalVideoViews.toLocaleString()}</p>
                  </div>
                  <Video className="w-8 h-8 text-indigo-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversions</p>
                    <p className="text-2xl font-bold text-green-600">{totalConversions.toLocaleString()}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Métriques spécifiques TikTok */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Taux de Vue Vidéo</h3>
                <div className="text-3xl font-bold text-pink-600">{avgVideoViewRate.toFixed(1)}%</div>
                <p className="text-sm text-gray-600 mt-2">Moyenne des campagnes</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">CPM Moyen</h3>
                <div className="text-3xl font-bold text-purple-600">
                  {campaigns.length > 0 ? (campaigns.reduce((sum, c) => sum + c.cpm, 0) / campaigns.length).toFixed(0) : 0} FCFA
                </div>
                <p className="text-sm text-gray-600 mt-2">Coût pour mille impressions</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Engagement Rate</h3>
                <div className="text-3xl font-bold text-indigo-600">
                  {totalImpressions > 0 ? ((totalVideoViews / totalImpressions) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-sm text-gray-600 mt-2">Vues / Impressions</p>
              </div>
            </div>

            {/* Tendances TikTok */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Tendances & Recommandations TikTok</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">🔥 Tendances Actuelles</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-pink-50 rounded">
                      <span>#LogistiqueAfrique</span>
                      <span className="text-pink-600 font-medium">+250% vues</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span>#ExpressDelivery</span>
                      <span className="text-purple-600 font-medium">+180% engagement</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-indigo-50 rounded">
                      <span>#BusinessTips</span>
                      <span className="text-indigo-600 font-medium">+120% partages</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">💡 Recommandations</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Utilisez des vidéos verticales 9:16</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Durée optimale : 15-30 secondes</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Ajoutez des sous-titres automatiques</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Publiez entre 18h-22h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campagnes */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des Campagnes TikTok</h2>
              <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all flex items-center">
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
                        Performance Vidéo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Audience
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
                            <span className="mr-2">{getObjectiveIcon(campaign.objective)}</span>
                            <span className="text-sm text-gray-900">{getObjectiveText(campaign.objective)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{campaign.budget.toLocaleString()} FCFA</div>
                          <div className="text-gray-500">
                            {campaign.budgetType === 'daily' ? 'Quotidien' : 'Total'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{campaign.videoViews.toLocaleString()} vues</div>
                          <div className="text-purple-600">{campaign.videoViewRate}% taux de vue</div>
                          <div className="text-green-600">{campaign.conversions} conversions</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="max-w-32 truncate">{campaign.targetAudience}</div>
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
        {(activeTab === 'creatives' || activeTab === 'audiences') && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'creatives' ? 'Créatifs Vidéo' : 'Gestion des Audiences'}
            </h3>
            <p className="text-gray-600 mb-6">
              Cette section sera disponible avec l'intégration complète de l'API TikTok for Business.
            </p>
            <div className="bg-pink-50 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-pink-900 mb-2">Fonctionnalités prévues :</h4>
              <ul className="text-sm text-pink-800 space-y-1">
                {activeTab === 'creatives' ? (
                  <>
                    <li>• Bibliothèque de vidéos</li>
                    <li>• Éditeur vidéo intégré</li>
                    <li>• Templates tendances</li>
                    <li>• Tests A/B créatifs</li>
                  </>
                ) : (
                  <>
                    <li>• Audiences personnalisées</li>
                    <li>• Audiences similaires</li>
                    <li>• Ciblage par intérêts</li>
                    <li>• Retargeting vidéo</li>
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
