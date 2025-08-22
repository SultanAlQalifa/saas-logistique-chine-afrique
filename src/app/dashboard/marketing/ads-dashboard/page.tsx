'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Target, 
  DollarSign,
  Play,
  Pause,
  Settings,
  Plus,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { UnifiedAdsManager, AdsCampaign, AdsMetrics } from '@/lib/ads-services'

export default function AdsDashboard() {
  const [campaigns, setCampaigns] = useState<AdsCampaign[]>([])
  const [metrics, setMetrics] = useState<AdsMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [dateRange, setDateRange] = useState('30d')

  // Initialisation du gestionnaire unifié
  const adsManager = new UnifiedAdsManager()

  useEffect(() => {
    loadDashboardData()
  }, [selectedPlatform, dateRange])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Simulation de chargement des données
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const allCampaigns = await adsManager.getAllCampaigns()
      const totalMetrics = await adsManager.getTotalMetrics()
      
      // Filtrer par plateforme si nécessaire
      const filteredCampaigns = selectedPlatform === 'all' 
        ? allCampaigns 
        : allCampaigns.filter(c => c.platform.toLowerCase() === selectedPlatform)
      
      setCampaigns(filteredCampaigns)
      setMetrics(totalMetrics)
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCampaignAction = async (campaignId: string, action: 'pause' | 'resume' | 'edit') => {
    try {
      // Simulation d'action sur campagne
      const updatedCampaigns = campaigns.map(campaign => {
        if (campaign.id === campaignId) {
          if (action === 'pause') {
            return { ...campaign, status: 'paused' as const }
          } else if (action === 'resume') {
            return { ...campaign, status: 'active' as const }
          }
        }
        return campaign
      })
      setCampaigns(updatedCampaigns)
    } catch (error) {
      console.error('Erreur action campagne:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'draft': return 'bg-gray-500'
      case 'completed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'meta': return '📘'
      case 'google': return '🔍'
      case 'tiktok': return '🎵'
      default: return '📊'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-lg">Chargement du dashboard publicitaire...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">📊 Dashboard Publicitaire Unifié</h1>
            <p className="text-purple-100 text-lg">
              Gérez toutes vos campagnes publicitaires depuis une interface centralisée
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Campagne
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Métriques globales */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Impressions Totales</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {metrics.impressions.toLocaleString('fr-FR')}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                +12.5% vs mois dernier
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Clics Totaux</CardTitle>
              <MousePointer className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {metrics.clicks.toLocaleString('fr-FR')}
              </div>
              <p className="text-xs text-green-600 mt-1">
                CTR: {metrics.ctr.toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Conversions</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {metrics.conversions.toLocaleString('fr-FR')}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                CPA: {metrics.cpa.toFixed(0)} FCFA
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Dépenses Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {metrics.spend.toLocaleString('fr-FR')} FCFA
              </div>
              <p className="text-xs text-orange-600 mt-1">
                ROAS: {metrics.roas.toFixed(1)}x
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres et contrôles */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select 
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Toutes les plateformes</option>
              <option value="meta">Meta (Facebook/Instagram)</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok Ads</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">1 an</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Onglets du dashboard */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audiences">Audiences</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getPlatformIcon(campaign.platform)}</span>
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          <span>•</span>
                          <span>{campaign.platform}</span>
                          <span>•</span>
                          <span>{campaign.objective}</span>
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'active' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCampaignAction(campaign.id, 'pause')}
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCampaignAction(campaign.id, 'resume')}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Reprendre
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {campaign.impressions.toLocaleString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500">Impressions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {campaign.clicks.toLocaleString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500">Clics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {campaign.conversions}
                      </div>
                      <div className="text-xs text-gray-500">Conversions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {campaign.ctr.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {campaign.cpc.toFixed(2)} FCFA
                      </div>
                      <div className="text-xs text-gray-500">CPC</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {campaign.spent.toLocaleString('fr-FR')} FCFA
                      </div>
                      <div className="text-xs text-gray-500">Dépensé</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget utilisé</span>
                      <span>{((campaign.spent / campaign.budget) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(campaign.spent / campaign.budget) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{campaign.spent.toLocaleString('fr-FR')} FCFA dépensé</span>
                      <span>{campaign.budget.toLocaleString('fr-FR')} FCFA budget</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Performance par Plateforme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Meta', 'Google', 'TikTok'].map((platform) => {
                    const platformCampaigns = campaigns.filter(c => c.platform === platform)
                    const totalSpent = platformCampaigns.reduce((sum, c) => sum + c.spent, 0)
                    const totalConversions = platformCampaigns.reduce((sum, c) => sum + c.conversions, 0)
                    
                    return (
                      <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{getPlatformIcon(platform)}</span>
                          <div>
                            <div className="font-medium">{platform}</div>
                            <div className="text-sm text-gray-500">
                              {platformCampaigns.length} campagne(s)
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{totalSpent.toLocaleString('fr-FR')} FCFA</div>
                          <div className="text-sm text-gray-500">{totalConversions} conversions</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Tendances Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>CTR en hausse</span>
                    </div>
                    <Badge className="bg-green-500">+15%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span>Conversions améliorées</span>
                    </div>
                    <Badge className="bg-blue-500">+8%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <span>CPC en légère hausse</span>
                    </div>
                    <Badge className="bg-yellow-500">+3%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audiences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Audiences</CardTitle>
              <CardDescription>
                Performances par segment d'audience et recommandations d'optimisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analyse des audiences en cours de développement</p>
                <p className="text-sm">Cette fonctionnalité sera disponible prochainement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insights et Recommandations</CardTitle>
              <CardDescription>
                Analyses automatiques et suggestions d'optimisation basées sur l'IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Insights IA en cours de développement</p>
                <p className="text-sm">Cette fonctionnalité sera disponible prochainement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
