'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Target, 
  TrendingUp, 
  Users, 
  Mail, 
  MessageSquare, 
  Settings, 
  Save, 
  Eye, 
  Edit,
  Plus,
  Trash2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Music,
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Zap
} from 'lucide-react'

interface MarketingCampaign {
  id: string
  name: string
  type: 'email' | 'social' | 'sms' | 'push'
  status: 'active' | 'paused' | 'draft' | 'completed'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  startDate: string
  endDate: string
  targetAudience: string
  platforms: string[]
}

interface MarketingTemplate {
  id: string
  name: string
  type: 'email' | 'social' | 'sms' | 'push'
  subject: string
  content: string
  variables: string[]
  isActive: boolean
}

export default function MarketingConfigPage() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)

  // Mock data
  const campaigns: MarketingCampaign[] = [
    {
      id: '1',
      name: 'Campagne Rentrée 2024',
      type: 'email',
      status: 'active',
      budget: 50000,
      spent: 32500,
      impressions: 125000,
      clicks: 3750,
      conversions: 187,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      targetAudience: 'Importateurs Afrique de l\'Ouest',
      platforms: ['Email', 'Facebook', 'LinkedIn']
    },
    {
      id: '2',
      name: 'Promotion Maritime Express',
      type: 'social',
      status: 'active',
      budget: 75000,
      spent: 45600,
      impressions: 89000,
      clicks: 2670,
      conversions: 134,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      targetAudience: 'Entreprises Import-Export',
      platforms: ['Facebook', 'Instagram', 'Twitter']
    },
    {
      id: '3',
      name: 'SMS Notifications Colis',
      type: 'sms',
      status: 'paused',
      budget: 25000,
      spent: 18750,
      impressions: 45000,
      clicks: 0,
      conversions: 89,
      startDate: '2024-01-05',
      endDate: '2024-02-05',
      targetAudience: 'Clients Existants',
      platforms: ['SMS']
    }
  ]

  const templates: MarketingTemplate[] = [
    {
      id: '1',
      name: 'Bienvenue Nouveau Client',
      type: 'email',
      subject: 'Bienvenue chez NextMove Cargo, {{firstName}} !',
      content: 'Bonjour {{firstName}}, merci de nous faire confiance pour vos expéditions Chine-Afrique...',
      variables: ['firstName', 'lastName', 'companyName'],
      isActive: true
    },
    {
      id: '2',
      name: 'Notification Livraison',
      type: 'sms',
      subject: 'Votre colis est arrivé',
      content: 'Votre colis {{trackingNumber}} est arrivé à {{destination}}. Récupérez-le avant le {{deadline}}.',
      variables: ['trackingNumber', 'destination', 'deadline'],
      isActive: true
    },
    {
      id: '3',
      name: 'Post Social Promotion',
      type: 'social',
      subject: 'Promotion Maritime Express',
      content: '🚢 Profitez de -20% sur nos expéditions maritimes express ! Livraison en 18 jours garantie. #LogistiqueAfrique',
      variables: ['discount', 'validUntil'],
      isActive: false
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'paused': return 'bg-yellow-100 text-yellow-700'
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail
      case 'social': return MessageSquare
      case 'sms': return Smartphone
      case 'push': return Monitor
      default: return Target
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Facebook
      case 'instagram': return Instagram
      case 'twitter': return Twitter
      case 'linkedin': return Linkedin
      case 'youtube': return Youtube
      case 'tiktok': return Music
      case 'email': return Mail
      case 'sms': return Smartphone
      default: return Globe
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">🎯 Configuration Marketing</h1>
              <p className="text-purple-100 text-lg">
                Gérez vos campagnes, templates et stratégies marketing
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Campagnes Actives</span>
              </div>
              <div className="text-2xl font-bold">
                {campaigns.filter(c => c.status === 'active').length}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Impressions Totales</span>
              </div>
              <div className="text-2xl font-bold">
                {campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString()}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">Taux de Conversion</span>
              </div>
              <div className="text-2xl font-bold">
                {((campaigns.reduce((sum, c) => sum + c.conversions, 0) / campaigns.reduce((sum, c) => sum + c.clicks, 0)) * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5" />
                <span className="text-sm font-medium">Budget Utilisé</span>
              </div>
              <div className="text-2xl font-bold">
                {((campaigns.reduce((sum, c) => sum + c.spent, 0) / campaigns.reduce((sum, c) => sum + c.budget, 0)) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="automation">Automatisation</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Campagnes</h2>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Campagne
              </Button>
            </div>

            <div className="grid gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {(() => {
                            const Icon = getTypeIcon(campaign.type)
                            return <Icon className="h-5 w-5 text-purple-600" />
                          })()}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{campaign.name}</CardTitle>
                          <CardDescription>{campaign.targetAudience}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {campaign.impressions.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Impressions</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {campaign.clicks.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Clics</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {campaign.conversions}
                        </div>
                        <div className="text-sm text-gray-600">Conversions</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {campaign.spent.toLocaleString()} FCFA
                        </div>
                        <div className="text-sm text-gray-600">
                          / {campaign.budget.toLocaleString()} FCFA
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Plateformes:</span>
                        <div className="flex gap-1">
                          {campaign.platforms.map((platform, index) => {
                            const Icon = getPlatformIcon(platform)
                            return (
                              <div key={index} className="p-1 bg-gray-100 rounded">
                                <Icon className="h-4 w-4 text-gray-600" />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {campaign.startDate} → {campaign.endDate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Templates Marketing</h2>
              <Button className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Template
              </Button>
            </div>

            <div className="grid gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          {(() => {
                            const Icon = getTypeIcon(template.type)
                            return <Icon className="h-5 w-5 text-pink-600" />
                          })()}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.subject}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={template.isActive} />
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Contenu:</span>
                        <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-lg">
                          {template.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Variables:</span>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map((variable, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {`{{${variable}}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automatisation Marketing</CardTitle>
                <CardDescription>
                  Configurez des workflows automatiques pour vos campagnes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Email de Bienvenue</h3>
                        <p className="text-sm text-gray-600">Envoyé automatiquement aux nouveaux clients</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Switch defaultChecked />
                      <Button size="sm" variant="outline">Configurer</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Smartphone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">SMS de Livraison</h3>
                        <p className="text-sm text-gray-600">Notification automatique à la livraison</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Switch defaultChecked />
                      <Button size="sm" variant="outline">Configurer</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Retargeting Social</h3>
                        <p className="text-sm text-gray-600">Campagnes automatiques pour clients inactifs</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Switch />
                      <Button size="sm" variant="outline">Configurer</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Target className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Promotions Saisonnières</h3>
                        <p className="text-sm text-gray-600">Campagnes automatiques selon les saisons</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Switch />
                      <Button size="sm" variant="outline">Configurer</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Marketing Globaux</CardTitle>
                <CardDescription>
                  Configuration générale des campagnes et communications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Nom de l'Entreprise</Label>
                    <Input
                      id="companyName"
                      defaultValue="NextMove Cargo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderEmail">Email Expéditeur</Label>
                    <Input
                      id="senderEmail"
                      defaultValue="marketing@nextmovecargo.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderName">Nom Expéditeur</Label>
                    <Input
                      id="senderName"
                      defaultValue="Équipe NextMove Cargo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="replyEmail">Email de Réponse</Label>
                    <Input
                      id="replyEmail"
                      defaultValue="support@nextmovecargo.com"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="signature">Signature Email</Label>
                  <Textarea
                    id="signature"
                    defaultValue="Cordialement,&#10;L'équipe NextMove Cargo&#10;📧 support@nextmovecargo.com&#10;📞 +221 77 658 17 41"
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Intégrations Sociales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Facebook className="h-5 w-5 text-blue-600" />
                        <span>Facebook Ads</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Instagram className="h-5 w-5 text-pink-600" />
                        <span>Instagram Ads</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Linkedin className="h-5 w-5 text-blue-700" />
                        <span>LinkedIn Ads</span>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Music className="h-5 w-5 text-black" />
                        <span>TikTok Ads</span>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <Button className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les Paramètres
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
