'use client'

import { useState, useEffect } from 'react'
import { Facebook, Instagram, Settings, TrendingUp, Users, Eye, MousePointer } from 'lucide-react'

interface MetaAdsConfig {
  facebookAccountId: string
  instagramAccountId: string
  businessName: string
  isConnected: boolean
}

interface MetaAdsCampaign {
  id: string
  name: string
  objective: 'REACH' | 'TRAFFIC' | 'ENGAGEMENT' | 'CONVERSIONS' | 'BRAND_AWARENESS'
  status: 'ACTIVE' | 'PAUSED' | 'DELETED'
  budget: number
  dailyBudget: number
  targeting: {
    ageMin: number
    ageMax: number
    genders: string[]
    locations: string[]
    interests: string[]
  }
  platforms: ('facebook' | 'instagram')[]
  metrics: {
    impressions: number
    clicks: number
    ctr: number
    cpc: number
    reach: number
    engagement: number
    conversions: number
    cost: number
  }
}

export default function MetaAdsIntegration() {
  const [config, setConfig] = useState<MetaAdsConfig>({
    facebookAccountId: '',
    instagramAccountId: '',
    businessName: '',
    isConnected: false
  })
  
  const [campaigns, setCampaigns] = useState<MetaAdsCampaign[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  // Mock data pour la démonstration
  useEffect(() => {
    const mockCampaigns: MetaAdsCampaign[] = [
      {
        id: 'meta_001',
        name: 'Promotion Services Logistique',
        objective: 'CONVERSIONS',
        status: 'ACTIVE',
        budget: 50000,
        dailyBudget: 2500,
        targeting: {
          ageMin: 25,
          ageMax: 55,
          genders: ['all'],
          locations: ['Sénégal', 'Côte d\'Ivoire', 'Mali'],
          interests: ['Import/Export', 'Commerce International', 'Logistique']
        },
        platforms: ['facebook', 'instagram'],
        metrics: {
          impressions: 125000,
          clicks: 3200,
          ctr: 2.56,
          cpc: 15.62,
          reach: 89000,
          engagement: 1850,
          conversions: 42,
          cost: 49984
        }
      },
      {
        id: 'meta_002',
        name: 'Acquisition Nouveaux Clients',
        objective: 'TRAFFIC',
        status: 'ACTIVE',
        budget: 75000,
        dailyBudget: 3750,
        targeting: {
          ageMin: 30,
          ageMax: 65,
          genders: ['all'],
          locations: ['France', 'Belgique', 'Suisse'],
          interests: ['E-commerce', 'Import Chine', 'Dropshipping']
        },
        platforms: ['facebook'],
        metrics: {
          impressions: 198000,
          clicks: 5400,
          ctr: 2.73,
          cpc: 13.89,
          reach: 142000,
          engagement: 2100,
          conversions: 67,
          cost: 75006
        }
      }
    ]
    
    if (config.isConnected) {
      setCampaigns(mockCampaigns)
    }
  }, [config.isConnected])

  const handleConnect = async () => {
    setIsConnecting(true)
    
    // Simulation de la connexion à Meta Ads API
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setConfig(prev => ({
        ...prev,
        isConnected: true,
        accessToken: 'mock_access_token_' + Date.now(),
        adAccountId: 'act_123456789',
        pageId: 'page_987654321',
        instagramAccountId: 'ig_456789123'
      }))
      
      console.log('✅ Connexion Meta Ads réussie')
    } catch (error) {
      console.error('❌ Erreur connexion Meta Ads:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setConfig({
      facebookAccountId: '',
      instagramAccountId: '',
      businessName: '',
      isConnected: false
    })
    setCampaigns([])
    console.log('🔌 Meta Ads déconnecté')
  }

  const createCampaign = async (campaignData: Partial<MetaAdsCampaign>) => {
    console.log('🚀 Création campagne Meta Ads:', campaignData)
    
    // Simulation création campagne
    const newCampaign: MetaAdsCampaign = {
      id: 'meta_' + Date.now(),
      name: campaignData.name || 'Nouvelle Campagne',
      objective: campaignData.objective || 'CONVERSIONS',
      status: 'ACTIVE',
      budget: campaignData.budget || 10000,
      dailyBudget: (campaignData.budget || 10000) / 20,
      targeting: campaignData.targeting || {
        ageMin: 18,
        ageMax: 65,
        genders: ['all'],
        locations: ['Sénégal'],
        interests: ['Logistique']
      },
      platforms: campaignData.platforms || ['facebook'],
      metrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        reach: 0,
        engagement: 0,
        conversions: 0,
        cost: 0
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
    console.log('⏸️ Campagne Meta Ads mise en pause:', campaignId)
  }

  const resumeCampaign = async (campaignId: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: 'ACTIVE' as const }
          : campaign
      )
    )
    console.log('▶️ Campagne Meta Ads reprise:', campaignId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Facebook className="h-8 w-8" />
              <Instagram className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">📱 Meta Ads Integration</h2>
              <p className="text-blue-100">Facebook & Instagram Advertising</p>
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
          <h3 className="text-lg font-semibold mb-4">⚙️ Configuration Meta Ads</h3>
          
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom de votre entreprise"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Compte Facebook
                  </label>
                  <input
                    type="text"
                    value={config.facebookAccountId}
                    onChange={(e) => setConfig(prev => ({ ...prev, facebookAccountId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="@votre_page_facebook"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Compte Instagram
                  </label>
                  <input
                    type="text"
                    value={config.instagramAccountId}
                    onChange={(e) => setConfig(prev => ({ ...prev, instagramAccountId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="@votre_compte_instagram"
                  />
                </div>
              </div>
              
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <Facebook className="h-4 w-4" />
                    <span>Connecter mes comptes Meta</span>
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
                  <div className="text-sm text-green-600">Facebook</div>
                  <div className="font-mono text-sm">{config.facebookAccountId}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600">Instagram</div>
                  <div className="font-mono text-sm">{config.instagramAccountId}</div>
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
          <h3 className="text-lg font-semibold mb-4">📊 Campagnes Meta Ads</h3>
          
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{campaign.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      {campaign.platforms.map(platform => (
                        <div key={platform} className="w-4 h-4">
                          {platform === 'facebook' ? <Facebook className="h-4 w-4 text-blue-600" /> : <Instagram className="h-4 w-4 text-pink-600" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {campaign.status === 'ACTIVE' ? (
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
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Budget: {campaign.budget.toLocaleString('fr-FR')} FCFA</span>
                    <span>Dépensé: {campaign.metrics.cost.toLocaleString('fr-FR')} FCFA</span>
                    <span>CPC: {campaign.metrics.cpc} FCFA</span>
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

// Export des fonctions pour utilisation externe
export { type MetaAdsConfig, type MetaAdsCampaign }
