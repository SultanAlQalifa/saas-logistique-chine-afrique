'use client'

import { useState, useEffect } from 'react'
import { Play, TrendingUp, Users, Eye, MousePointer, Settings, Heart, Share2 } from 'lucide-react'

interface TikTokAdsConfig {
  tiktokUsername: string
  businessName: string
  websiteUrl: string
  isConnected: boolean
}

interface TikTokAdsCampaign {
  id: string
  name: string
  objective: 'REACH' | 'TRAFFIC' | 'CONVERSIONS' | 'APP_PROMOTION' | 'VIDEO_VIEWS' | 'LEAD_GENERATION'
  status: 'ENABLE' | 'DISABLE' | 'DELETE'
  budget: number
  dailyBudget: number
  targeting: {
    ageMin: number
    ageMax: number
    genders: string[]
    locations: string[]
    interests: string[]
    languages: string[]
  }
  creativeFormat: 'SINGLE_VIDEO' | 'SINGLE_IMAGE' | 'CAROUSEL' | 'COLLECTION'
  metrics: {
    impressions: number
    clicks: number
    ctr: number
    cpc: number
    videoViews: number
    videoViewRate: number
    likes: number
    shares: number
    comments: number
    conversions: number
    cost: number
    cpm: number
  }
}

export default function TikTokAdsIntegration() {
  const [config, setConfig] = useState<TikTokAdsConfig>({
    tiktokUsername: '',
    businessName: '',
    websiteUrl: '',
    isConnected: false
  })
  
  const [campaigns, setCampaigns] = useState<TikTokAdsCampaign[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  // Mock data pour la démonstration
  useEffect(() => {
    const mockCampaigns: TikTokAdsCampaign[] = [
      {
        id: 'tiktok_001',
        name: 'Transport Express - Vidéo Virale',
        objective: 'VIDEO_VIEWS',
        status: 'ENABLE',
        budget: 60000,
        dailyBudget: 3000,
        targeting: {
          ageMin: 18,
          ageMax: 35,
          genders: ['MALE', 'FEMALE'],
          locations: ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso'],
          interests: ['Business', 'E-commerce', 'Entrepreneurship', 'Technology'],
          languages: ['Français', 'Wolof', 'English']
        },
        creativeFormat: 'SINGLE_VIDEO',
        metrics: {
          impressions: 890000,
          clicks: 12400,
          ctr: 1.39,
          cpc: 4.84,
          videoViews: 156000,
          videoViewRate: 17.5,
          likes: 8900,
          shares: 1200,
          comments: 450,
          conversions: 89,
          cost: 60012,
          cpm: 67.42
        }
      },
      {
        id: 'tiktok_002',
        name: 'Services Logistique - Génération Leads',
        objective: 'LEAD_GENERATION',
        status: 'ENABLE',
        budget: 40000,
        dailyBudget: 2000,
        targeting: {
          ageMin: 25,
          ageMax: 45,
          genders: ['MALE', 'FEMALE'],
          locations: ['France', 'Belgique', 'Suisse', 'Canada'],
          interests: ['Import Export', 'Business', 'Logistics', 'International Trade'],
          languages: ['Français', 'English']
        },
        creativeFormat: 'CAROUSEL',
        metrics: {
          impressions: 450000,
          clicks: 5600,
          ctr: 1.24,
          cpc: 7.14,
          videoViews: 89000,
          videoViewRate: 19.8,
          likes: 3400,
          shares: 890,
          comments: 234,
          conversions: 67,
          cost: 39984,
          cpm: 88.85
        }
      },
      {
        id: 'tiktok_003',
        name: 'Promotion App Mobile - Install',
        objective: 'APP_PROMOTION',
        status: 'ENABLE',
        budget: 35000,
        dailyBudget: 1750,
        targeting: {
          ageMin: 20,
          ageMax: 40,
          genders: ['MALE', 'FEMALE'],
          locations: ['Afrique de l\'Ouest', 'Maghreb'],
          interests: ['Mobile Apps', 'Shopping', 'Technology', 'Business'],
          languages: ['Français', 'Arabe', 'English']
        },
        creativeFormat: 'SINGLE_VIDEO',
        metrics: {
          impressions: 670000,
          clicks: 8900,
          ctr: 1.33,
          cpc: 3.93,
          videoViews: 134000,
          videoViewRate: 20.0,
          likes: 5600,
          shares: 780,
          comments: 189,
          conversions: 156,
          cost: 34977,
          cpm: 52.20
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
      if (!config.tiktokUsername || !config.businessName || !config.websiteUrl) {
        alert('⚠️ Veuillez remplir tous les champs obligatoires')
        return
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setConfig(prev => ({
        ...prev,
        isConnected: true
      }))
      
      alert('✅ Connexion TikTok Ads réussie ! Vos campagnes sont maintenant synchronisées.')
    } catch (error) {
      console.error('❌ Erreur connexion TikTok Ads:', error)
      alert('❌ Erreur lors de la connexion. Vérifiez vos identifiants TikTok for Business.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    if (confirm('🔌 Êtes-vous sûr de vouloir déconnecter TikTok Ads ?')) {
      setConfig({
        tiktokUsername: '',
        businessName: '',
        websiteUrl: '',
        isConnected: false
      })
      setCampaigns([])
      alert('🔌 TikTok Ads déconnecté avec succès')
    }
  }

  const createCampaign = async (campaignData: Partial<TikTokAdsCampaign>) => {
    console.log('🚀 Création campagne TikTok Ads:', campaignData)
    
    const newCampaign: TikTokAdsCampaign = {
      id: 'tiktok_' + Date.now(),
      name: campaignData.name || 'Nouvelle Campagne',
      objective: campaignData.objective || 'VIDEO_VIEWS',
      status: 'ENABLE',
      budget: campaignData.budget || 15000,
      dailyBudget: (campaignData.budget || 15000) / 20,
      targeting: campaignData.targeting || {
        ageMin: 18,
        ageMax: 35,
        genders: ['MALE', 'FEMALE'],
        locations: ['Sénégal'],
        interests: ['Business'],
        languages: ['Français']
      },
      creativeFormat: campaignData.creativeFormat || 'SINGLE_VIDEO',
      metrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        videoViews: 0,
        videoViewRate: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        conversions: 0,
        cost: 0,
        cpm: 0
      }
    }
    
    setCampaigns(prev => [...prev, newCampaign])
    return newCampaign
  }

  const pauseCampaign = async (campaignId: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: 'DISABLE' as const }
          : campaign
      )
    )
    console.log('⏸️ Campagne TikTok Ads mise en pause:', campaignId)
  }

  const resumeCampaign = async (campaignId: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: 'ENABLE' as const }
          : campaign
      )
    )
    console.log('▶️ Campagne TikTok Ads reprise:', campaignId)
  }

  const getObjectiveColor = (objective: string) => {
    switch (objective) {
      case 'VIDEO_VIEWS': return 'bg-pink-100 text-pink-800'
      case 'LEAD_GENERATION': return 'bg-green-100 text-green-800'
      case 'APP_PROMOTION': return 'bg-purple-100 text-purple-800'
      case 'CONVERSIONS': return 'bg-blue-100 text-blue-800'
      case 'TRAFFIC': return 'bg-orange-100 text-orange-800'
      case 'REACH': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-lg">
              <Play className="h-8 w-8 text-pink-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">🎵 TikTok Ads Integration</h2>
              <p className="text-pink-100">Video Marketing & Lead Generation</p>
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
          <h3 className="text-lg font-semibold mb-4">⚙️ Configuration TikTok Ads</h3>
          
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="Nom de votre entreprise"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur TikTok
                  </label>
                  <input
                    type="text"
                    value={config.tiktokUsername}
                    onChange={(e) => setConfig(prev => ({ ...prev, tiktokUsername: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="@votre_compte_tiktok"
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="nom-entreprise"
                    />
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Connecter mon compte TikTok</span>
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
                  <div className="text-sm text-green-600">TikTok</div>
                  <div className="font-mono text-sm">{config.tiktokUsername}</div>
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
          <h3 className="text-lg font-semibold mb-4">📊 Campagnes TikTok Ads</h3>
          
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{campaign.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getObjectiveColor(campaign.objective)}`}>
                      {campaign.objective}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'ENABLE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                    <Play className="h-4 w-4 text-pink-500" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {campaign.status === 'ENABLE' ? (
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
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-gray-500">Impressions</div>
                      <div className="font-semibold">{campaign.metrics.impressions.toLocaleString('fr-FR')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Play className="h-4 w-4 text-pink-500" />
                    <div>
                      <div className="text-gray-500">Vues Vidéo</div>
                      <div className="font-semibold">{campaign.metrics.videoViews.toLocaleString('fr-FR')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="text-gray-500">Likes</div>
                      <div className="font-semibold">{campaign.metrics.likes.toLocaleString('fr-FR')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="text-gray-500">Partages</div>
                      <div className="font-semibold">{campaign.metrics.shares.toLocaleString('fr-FR')}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div className="flex items-center space-x-2">
                    <MousePointer className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="text-gray-500">Clics</div>
                      <div className="font-semibold">{campaign.metrics.clicks.toLocaleString('fr-FR')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="text-gray-500">CTR</div>
                      <div className="font-semibold">{campaign.metrics.ctr}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-indigo-500" />
                    <div>
                      <div className="text-gray-500">Conversions</div>
                      <div className="font-semibold">{campaign.metrics.conversions}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-teal-500" />
                    <div>
                      <div className="text-gray-500">View Rate</div>
                      <div className="font-semibold">{campaign.metrics.videoViewRate}%</div>
                    </div>
                  </div>
                </div>
                
                {/* Ciblage */}
                <div className="mb-3">
                  <div className="text-sm text-gray-500 mb-1">Ciblage:</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      {campaign.targeting.ageMin}-{campaign.targeting.ageMax} ans
                    </span>
                    {campaign.targeting.locations.slice(0, 3).map((location, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {location}
                      </span>
                    ))}
                    {campaign.targeting.locations.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{campaign.targeting.locations.length - 3} autres
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Budget: {campaign.budget.toLocaleString('fr-FR')} FCFA</span>
                    <span>Dépensé: {campaign.metrics.cost.toLocaleString('fr-FR')} FCFA</span>
                    <span>CPC: {campaign.metrics.cpc} FCFA</span>
                    <span>CPM: {campaign.metrics.cpm} FCFA</span>
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

export { type TikTokAdsConfig, type TikTokAdsCampaign }
