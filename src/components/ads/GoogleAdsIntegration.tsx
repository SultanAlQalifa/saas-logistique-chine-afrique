'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, Users, Eye, MousePointer, Settings, BarChart3 } from 'lucide-react'

interface GoogleAdsConfig {
  googleAccountEmail: string
  businessName: string
  websiteUrl: string
  isConnected: boolean
}

interface GoogleAdsCampaign {
  id: string
  name: string
  type: 'SEARCH' | 'DISPLAY' | 'SHOPPING' | 'VIDEO' | 'PERFORMANCE_MAX'
  status: 'ENABLED' | 'PAUSED' | 'REMOVED'
  budget: number
  dailyBudget: number
  bidStrategy: 'MANUAL_CPC' | 'MAXIMIZE_CLICKS' | 'TARGET_CPA' | 'TARGET_ROAS'
  keywords: string[]
  negativeKeywords: string[]
  locations: string[]
  metrics: {
    impressions: number
    clicks: number
    ctr: number
    cpc: number
    conversions: number
    conversionRate: number
    cost: number
    qualityScore: number
  }
}

export default function GoogleAdsIntegration() {
  const [config, setConfig] = useState<GoogleAdsConfig>({
    googleAccountEmail: '',
    businessName: '',
    websiteUrl: '',
    isConnected: false
  })
  
  const [campaigns, setCampaigns] = useState<GoogleAdsCampaign[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  // Mock data pour la démonstration
  useEffect(() => {
    const mockCampaigns: GoogleAdsCampaign[] = [
      {
        id: 'google_001',
        name: 'Transport Chine Afrique - Recherche',
        type: 'SEARCH',
        status: 'ENABLED',
        budget: 80000,
        dailyBudget: 4000,
        bidStrategy: 'TARGET_CPA',
        keywords: [
          'transport chine afrique',
          'import chine sénégal',
          'logistique internationale',
          'fret maritime chine',
          'dédouanement import'
        ],
        negativeKeywords: [
          'gratuit',
          'pas cher',
          'occasion'
        ],
        locations: ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso'],
        metrics: {
          impressions: 245000,
          clicks: 4200,
          ctr: 1.71,
          cpc: 18.95,
          conversions: 89,
          conversionRate: 2.12,
          cost: 79590,
          qualityScore: 7.8
        }
      },
      {
        id: 'google_002',
        name: 'Services Logistique - Display',
        type: 'DISPLAY',
        status: 'ENABLED',
        budget: 45000,
        dailyBudget: 2250,
        bidStrategy: 'MAXIMIZE_CLICKS',
        keywords: [
          'e-commerce',
          'import export',
          'commerce international',
          'dropshipping'
        ],
        negativeKeywords: [
          'formation',
          'cours',
          'gratuit'
        ],
        locations: ['France', 'Belgique', 'Suisse', 'Canada'],
        metrics: {
          impressions: 890000,
          clicks: 2100,
          ctr: 0.24,
          cpc: 21.43,
          conversions: 34,
          conversionRate: 1.62,
          cost: 45003,
          qualityScore: 6.2
        }
      },
      {
        id: 'google_003',
        name: 'Performance Max - Tous Produits',
        type: 'PERFORMANCE_MAX',
        status: 'ENABLED',
        budget: 120000,
        dailyBudget: 6000,
        bidStrategy: 'TARGET_ROAS',
        keywords: [],
        negativeKeywords: [
          'concurrent',
          'comparaison',
          'avis négatif'
        ],
        locations: ['Worldwide'],
        metrics: {
          impressions: 1250000,
          clicks: 8900,
          ctr: 0.71,
          cpc: 13.48,
          conversions: 156,
          conversionRate: 1.75,
          cost: 119972,
          qualityScore: 8.4
        }
      }
    ]
    
    if (config.isConnected) {
      setCampaigns(mockCampaigns)
    }
  }, [config.isConnected])

  const handleConnect = async () => {
    setIsConnecting(true)
    
    try {
      // Validation des champs requis
      if (!config.googleAccountEmail || !config.businessName || !config.websiteUrl) {
        alert('⚠️ Veuillez remplir tous les champs obligatoires')
        return
      }
      
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      setConfig(prev => ({
        ...prev,
        isConnected: true
      }))
      
      alert('✅ Connexion Google Ads réussie ! Vos campagnes sont maintenant synchronisées.')
    } catch (error) {
      console.error('❌ Erreur connexion Google Ads:', error)
      alert('❌ Erreur lors de la connexion. Vérifiez vos identifiants.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    if (confirm('🔌 Êtes-vous sûr de vouloir déconnecter Google Ads ?')) {
      setConfig({
        googleAccountEmail: '',
        businessName: '',
        websiteUrl: '',
        isConnected: false
      })
      setCampaigns([])
      alert('🔌 Google Ads déconnecté avec succès')
    }
  }

  const createCampaign = async (campaignData: Partial<GoogleAdsCampaign>) => {
    console.log('🚀 Création campagne Google Ads:', campaignData)
    
    const newCampaign: GoogleAdsCampaign = {
      id: 'google_' + Date.now(),
      name: campaignData.name || 'Nouvelle Campagne',
      type: campaignData.type || 'SEARCH',
      status: 'ENABLED',
      budget: campaignData.budget || 20000,
      dailyBudget: (campaignData.budget || 20000) / 30,
      bidStrategy: campaignData.bidStrategy || 'MANUAL_CPC',
      keywords: campaignData.keywords || [],
      negativeKeywords: campaignData.negativeKeywords || [],
      locations: campaignData.locations || ['Sénégal'],
      metrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        conversions: 0,
        conversionRate: 0,
        cost: 0,
        qualityScore: 0
      }
    }
    
    setCampaigns(prev => [...prev, newCampaign])
    return newCampaign
  }

  const pauseCampaign = async (campaignId: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: 'PAUSED' as const }
          : campaign
      )
    )
    console.log('⏸️ Campagne Google Ads mise en pause:', campaignId)
  }

  const resumeCampaign = async (campaignId: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: 'ENABLED' as const }
          : campaign
      )
    )
    console.log('▶️ Campagne Google Ads reprise:', campaignId)
  }

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'SEARCH': return <Search className="h-4 w-4 text-blue-600" />
      case 'DISPLAY': return <Eye className="h-4 w-4 text-green-600" />
      case 'SHOPPING': return <BarChart3 className="h-4 w-4 text-orange-600" />
      case 'PERFORMANCE_MAX': return <TrendingUp className="h-4 w-4 text-purple-600" />
      default: return <Search className="h-4 w-4 text-gray-600" />
    }
  }

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'SEARCH': return 'bg-blue-100 text-blue-800'
      case 'DISPLAY': return 'bg-green-100 text-green-800'
      case 'SHOPPING': return 'bg-orange-100 text-orange-800'
      case 'PERFORMANCE_MAX': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-lg">
              <Search className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">🔍 Google Ads Integration</h2>
              <p className="text-red-100">Search, Display & Performance Max</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
            {config.isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm">Connecté</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-sm">Déconnecté</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration */}
      {showConfig && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">⚙️ Configuration Google Ads</h3>
          
          {!config.isConnected ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={config.businessName}
                  onChange={(e) => setConfig(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Nom de votre entreprise"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email du compte Google
                  </label>
                  <input
                    type="email"
                    value={config.googleAccountEmail}
                    onChange={(e) => setConfig(prev => ({ ...prev, googleAccountEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page entreprise sur la plateforme
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      https://plateforme.com/entreprise/
                    </span>
                    <input
                      type="text"
                      value={config.websiteUrl}
                      onChange={(e) => setConfig(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-red-500"
                      placeholder="nom-entreprise"
                    />
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Connecter mon compte Google</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600">Entreprise</div>
                  <div className="font-medium text-sm">{config.businessName}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600">Email Google</div>
                  <div className="font-mono text-sm">{config.googleAccountEmail}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600">Page Plateforme</div>
                  <div className="font-mono text-sm">https://plateforme.com/entreprise/{config.websiteUrl}</div>
                </div>
              </div>
              
              <button
                onClick={handleDisconnect}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                🔌 Déconnecter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Campagnes actives */}
      {config.isConnected && campaigns.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Campagnes Google Ads</h3>
          
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{campaign.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCampaignTypeColor(campaign.type)}`}>
                      {campaign.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'ENABLED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                    {getCampaignTypeIcon(campaign.type)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {campaign.status === 'ENABLED' ? (
                      <button
                        onClick={() => pauseCampaign(campaign.id)}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-sm"
                      >
                        ⏸️ Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => resumeCampaign(campaign.id)}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm"
                      >
                        ▶️ Reprendre
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-gray-500">Impressions</div>
                      <div className="font-semibold">{campaign.metrics.impressions.toLocaleString('fr-FR')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MousePointer className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="text-gray-500">Clics</div>
                      <div className="font-semibold">{campaign.metrics.clicks.toLocaleString('fr-FR')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="text-gray-500">CTR</div>
                      <div className="font-semibold">{campaign.metrics.ctr}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="text-gray-500">Conversions</div>
                      <div className="font-semibold">{campaign.metrics.conversions}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-indigo-500" />
                    <div>
                      <div className="text-gray-500">Quality Score</div>
                      <div className="font-semibold">{campaign.metrics.qualityScore}/10</div>
                    </div>
                  </div>
                </div>
                
                {/* Mots-clés */}
                {campaign.keywords.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-500 mb-1">Mots-clés principaux:</div>
                    <div className="flex flex-wrap gap-1">
                      {campaign.keywords.slice(0, 5).map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                      {campaign.keywords.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{campaign.keywords.length - 5} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Budget: {campaign.budget.toLocaleString('fr-FR')} FCFA</span>
                    <span>Dépensé: {campaign.metrics.cost.toLocaleString('fr-FR')} FCFA</span>
                    <span>CPC: {campaign.metrics.cpc} FCFA</span>
                    <span>Conv. Rate: {campaign.metrics.conversionRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { type GoogleAdsConfig, type GoogleAdsCampaign }
