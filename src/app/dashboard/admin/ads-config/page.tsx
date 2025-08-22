'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Facebook, 
  Instagram, 
  Chrome, 
  Music, 
  Settings, 
  Save, 
  Eye, 
  Play,
  Pause,
  TrendingUp,
  DollarSign,
  Users,
  MousePointer,
  BarChart3
} from 'lucide-react'

interface AdsPlatform {
  id: string
  name: string
  icon: any
  connected: boolean
  campaigns: number
  spend: number
  impressions: number
  clicks: number
  conversions: number
}

interface Campaign {
  id: string
  name: string
  platform: string
  status: 'active' | 'paused' | 'draft'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
}

export default function AdsConfigPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [metaConnected, setMetaConnected] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [tiktokConnected, setTiktokConnected] = useState(false)

  const platforms: AdsPlatform[] = [
    {
      id: 'meta',
      name: 'Meta Ads',
      icon: Facebook,
      connected: metaConnected,
      campaigns: 8,
      spend: 125000,
      impressions: 450000,
      clicks: 12500,
      conversions: 387
    },
    {
      id: 'google',
      name: 'Google Ads',
      icon: Chrome,
      connected: googleConnected,
      campaigns: 12,
      spend: 89000,
      impressions: 320000,
      clicks: 9800,
      conversions: 245
    },
    {
      id: 'tiktok',
      name: 'TikTok Ads',
      icon: Music,
      connected: tiktokConnected,
      campaigns: 5,
      spend: 67000,
      impressions: 280000,
      clicks: 8400,
      conversions: 156
    }
  ]

  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Campagne Logistique Afrique',
      platform: 'Meta',
      status: 'active',
      budget: 50000,
      spent: 32500,
      impressions: 125000,
      clicks: 3750,
      conversions: 187,
      ctr: 3.0,
      cpc: 8.67
    },
    {
      id: '2',
      name: 'Transport Maritime Express',
      platform: 'Google',
      status: 'active',
      budget: 35000,
      spent: 28900,
      impressions: 89000,
      clicks: 2670,
      conversions: 134,
      ctr: 3.2,
      cpc: 10.82
    },
    {
      id: '3',
      name: 'Expédition Chine-Afrique',
      platform: 'TikTok',
      status: 'paused',
      budget: 25000,
      spent: 18750,
      impressions: 67000,
      clicks: 2010,
      conversions: 89,
      ctr: 3.0,
      cpc: 9.33
    }
  ]

  const connectPlatform = (platform: string) => {
    switch (platform) {
      case 'meta':
        setMetaConnected(true)
        break
      case 'google':
        setGoogleConnected(true)
        break
      case 'tiktok':
        setTiktokConnected(true)
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">📊 Configuration Publicités</h1>
              <p className="text-blue-100 text-lg">
                Gérez vos campagnes Meta Ads, Google Ads et TikTok Ads
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm font-medium">Budget Total</span>
              </div>
              <div className="text-2xl font-bold">281,000 FCFA</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Impressions</span>
              </div>
              <div className="text-2xl font-bold">1.05M</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="h-5 w-5" />
                <span className="text-sm font-medium">Clics</span>
              </div>
              <div className="text-2xl font-bold">30,700</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Conversions</span>
              </div>
              <div className="text-2xl font-bold">788</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="meta">Meta Ads</TabsTrigger>
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok Ads</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {platforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <Card key={platform.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle>{platform.name}</CardTitle>
                            <CardDescription>
                              {platform.campaigns} campagnes actives
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={platform.connected ? "default" : "secondary"}>
                          {platform.connected ? "Connecté" : "Déconnecté"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {platform.spend.toLocaleString()} FCFA
                          </div>
                          <div className="text-xs text-gray-500">Dépensé</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {platform.conversions}
                          </div>
                          <div className="text-xs text-gray-500">Conversions</div>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        variant={platform.connected ? "outline" : "default"}
                        onClick={() => connectPlatform(platform.id)}
                      >
                        {platform.connected ? "Gérer" : "Connecter"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campagnes Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant={campaign.status === 'active' ? "default" : "secondary"}>
                          {campaign.status}
                        </Badge>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-gray-500">{campaign.platform}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{campaign.conversions}</div>
                          <div className="text-gray-500">Conversions</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{campaign.ctr}%</div>
                          <div className="text-gray-500">CTR</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{campaign.cpc} FCFA</div>
                          <div className="text-gray-500">CPC</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  Configuration Meta Ads
                </CardTitle>
                <CardDescription>
                  Connectez votre compte Facebook Business pour gérer vos publicités
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!metaConnected ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="metaAppId">App ID Facebook</Label>
                        <Input id="metaAppId" placeholder="123456789012345" />
                      </div>
                      <div>
                        <Label htmlFor="metaAppSecret">App Secret</Label>
                        <Input id="metaAppSecret" type="password" placeholder="••••••••••••••••" />
                      </div>
                      <div>
                        <Label htmlFor="metaAccessToken">Access Token</Label>
                        <Input id="metaAccessToken" placeholder="EAABwzLixnjYBO..." />
                      </div>
                      <div>
                        <Label htmlFor="metaAdAccountId">Ad Account ID</Label>
                        <Input id="metaAdAccountId" placeholder="act_123456789" />
                      </div>
                    </div>
                    <Button onClick={() => connectPlatform('meta')} className="w-full">
                      <Facebook className="h-4 w-4 mr-2" />
                      Connecter Meta Ads
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Facebook className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-green-800">Meta Ads connecté</div>
                          <div className="text-sm text-green-600">Compte: NextMove Cargo Business</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Actif</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">8</div>
                        <div className="text-sm text-gray-600">Campagnes actives</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">125,000</div>
                        <div className="text-sm text-gray-600">Budget FCFA</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">387</div>
                        <div className="text-sm text-gray-600">Conversions</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="google" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Chrome className="h-5 w-5 text-red-600" />
                  Configuration Google Ads
                </CardTitle>
                <CardDescription>
                  Connectez votre compte Google Ads pour gérer vos campagnes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!googleConnected ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="googleClientId">Client ID</Label>
                        <Input id="googleClientId" placeholder="123456789-abc.apps.googleusercontent.com" />
                      </div>
                      <div>
                        <Label htmlFor="googleClientSecret">Client Secret</Label>
                        <Input id="googleClientSecret" type="password" placeholder="••••••••••••••••" />
                      </div>
                      <div>
                        <Label htmlFor="googleCustomerId">Customer ID</Label>
                        <Input id="googleCustomerId" placeholder="123-456-7890" />
                      </div>
                      <div>
                        <Label htmlFor="googleDeveloperToken">Developer Token</Label>
                        <Input id="googleDeveloperToken" placeholder="ABcdeFGhiJKlmNOpqR" />
                      </div>
                    </div>
                    <Button onClick={() => connectPlatform('google')} className="w-full">
                      <Chrome className="h-4 w-4 mr-2" />
                      Connecter Google Ads
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Chrome className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-green-800">Google Ads connecté</div>
                          <div className="text-sm text-green-600">Compte: NextMove Cargo</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Actif</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-sm text-gray-600">Campagnes actives</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">89,000</div>
                        <div className="text-sm text-gray-600">Budget FCFA</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">245</div>
                        <div className="text-sm text-gray-600">Conversions</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiktok" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-black" />
                  Configuration TikTok Ads
                </CardTitle>
                <CardDescription>
                  Connectez votre compte TikTok for Business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!tiktokConnected ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tiktokAppId">App ID</Label>
                        <Input id="tiktokAppId" placeholder="1234567890123456789" />
                      </div>
                      <div>
                        <Label htmlFor="tiktokSecret">Secret</Label>
                        <Input id="tiktokSecret" type="password" placeholder="••••••••••••••••" />
                      </div>
                      <div>
                        <Label htmlFor="tiktokAccessToken">Access Token</Label>
                        <Input id="tiktokAccessToken" placeholder="act.1234567890abcdef..." />
                      </div>
                      <div>
                        <Label htmlFor="tiktokAdvertiserId">Advertiser ID</Label>
                        <Input id="tiktokAdvertiserId" placeholder="1234567890123456789" />
                      </div>
                    </div>
                    <Button onClick={() => connectPlatform('tiktok')} className="w-full">
                      <Music className="h-4 w-4 mr-2" />
                      Connecter TikTok Ads
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Music className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-green-800">TikTok Ads connecté</div>
                          <div className="text-sm text-green-600">Compte: NextMove Cargo Business</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Actif</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">5</div>
                        <div className="text-sm text-gray-600">Campagnes actives</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">67,000</div>
                        <div className="text-sm text-gray-600">Budget FCFA</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">156</div>
                        <div className="text-sm text-gray-600">Conversions</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
