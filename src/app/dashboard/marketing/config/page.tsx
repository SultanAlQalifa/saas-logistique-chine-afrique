'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Settings,
  Target,
  Mail,
  MessageSquare,
  Bell,
  Star,
  Award,
  ArrowLeft,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  Users,
  Gift
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function MarketingConfigPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)

  const [config, setConfig] = useState({
    // Général
    enableMarketing: true,
    autoSegmentation: true,
    maxCampaignsPerUser: 20,
    defaultSendTime: '10:00',
    
    // Email
    enableEmailMarketing: true,
    emailProvider: 'sendgrid',
    dailyEmailLimit: 1000,
    openRateThreshold: 20.0,
    
    // SMS
    enableSMSMarketing: false,
    smsProvider: 'twilio',
    dailySMSLimit: 500,
    smsOptInRequired: true,
    
    // Notifications
    enablePushNotifications: true,
    notifyLowPerformance: true,
    notifyHighEngagement: true,
    
    // Automatisation
    enableAutoResponders: true,
    enableDripCampaigns: true,
    enableBehaviorTriggers: true,
    
    // Analytics
    enableAdvancedAnalytics: true,
    retentionPeriodDays: 365,
    enableABTesting: true
  })

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    console.log('Saving marketing configuration:', config)
    setHasChanges(false)
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'automation', label: 'Automatisation', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Target className="h-10 w-10 mr-3" />
                Configuration Marketing
              </h1>
              <p className="text-pink-100 text-lg">
                🎯 Gérez les paramètres et stratégies marketing
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setHasChanges(false)}
                className="text-white hover:bg-white/20 border border-white/30"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Réinitialiser
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-white text-pink-600 hover:bg-gray-100 font-semibold"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Campagnes Actives</p>
                <p className="text-2xl font-bold text-pink-600">24</p>
              </div>
              <Target className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux d'Ouverture</p>
                <p className="text-2xl font-bold text-green-600">68.5%</p>
              </div>
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-blue-600">892</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ROI Moyen</p>
                <p className="text-2xl font-bold text-purple-600">340%</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Configuration Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>Configuration de base pour le marketing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Marketing activé</label>
                  <p className="text-sm text-gray-500">Activer les fonctionnalités marketing</p>
                </div>
                <Switch
                  checked={config.enableMarketing}
                  onCheckedChange={(checked) => updateConfig('enableMarketing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Segmentation automatique</label>
                  <p className="text-sm text-gray-500">Segmenter automatiquement les contacts</p>
                </div>
                <Switch
                  checked={config.autoSegmentation}
                  onCheckedChange={(checked) => updateConfig('autoSegmentation', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Maximum campagnes par utilisateur</label>
                <Input
                  type="number"
                  value={config.maxCampaignsPerUser}
                  onChange={(e) => updateConfig('maxCampaignsPerUser', parseInt(e.target.value))}
                  placeholder="Nombre maximum de campagnes"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Heure d'envoi par défaut</label>
                <Input
                  type="time"
                  value={config.defaultSendTime}
                  onChange={(e) => updateConfig('defaultSendTime', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'email' && (
          <Card>
            <CardHeader>
              <CardTitle>Configuration Email</CardTitle>
              <CardDescription>Paramètres pour les campagnes email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Email marketing activé</label>
                  <p className="text-sm text-gray-500">Permettre l'envoi d'emails marketing</p>
                </div>
                <Switch
                  checked={config.enableEmailMarketing}
                  onCheckedChange={(checked) => updateConfig('enableEmailMarketing', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Fournisseur email</label>
                <select
                  value={config.emailProvider}
                  onChange={(e) => updateConfig('emailProvider', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailchimp">Mailchimp</option>
                  <option value="ses">Amazon SES</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Limite quotidienne d'emails</label>
                <Input
                  type="number"
                  value={config.dailyEmailLimit}
                  onChange={(e) => updateConfig('dailyEmailLimit', parseInt(e.target.value))}
                  placeholder="Nombre maximum d'emails par jour"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'sms' && (
          <Card>
            <CardHeader>
              <CardTitle>Configuration SMS</CardTitle>
              <CardDescription>Paramètres pour les campagnes SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">SMS marketing activé</label>
                  <p className="text-sm text-gray-500">Permettre l'envoi de SMS marketing</p>
                </div>
                <Switch
                  checked={config.enableSMSMarketing}
                  onCheckedChange={(checked) => updateConfig('enableSMSMarketing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Opt-in obligatoire</label>
                  <p className="text-sm text-gray-500">Exiger le consentement explicite</p>
                </div>
                <Switch
                  checked={config.smsOptInRequired}
                  onCheckedChange={(checked) => updateConfig('smsOptInRequired', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Limite quotidienne de SMS</label>
                <Input
                  type="number"
                  value={config.dailySMSLimit}
                  onChange={(e) => updateConfig('dailySMSLimit', parseInt(e.target.value))}
                  placeholder="Nombre maximum de SMS par jour"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Paramètres de notification marketing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Notifications push</label>
                  <p className="text-sm text-gray-500">Activer les notifications push</p>
                </div>
                <Switch
                  checked={config.enablePushNotifications}
                  onCheckedChange={(checked) => updateConfig('enablePushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Alertes performance faible</label>
                  <p className="text-sm text-gray-500">Notifier en cas de faible performance</p>
                </div>
                <Switch
                  checked={config.notifyLowPerformance}
                  onCheckedChange={(checked) => updateConfig('notifyLowPerformance', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'automation' && (
          <Card>
            <CardHeader>
              <CardTitle>Automatisation</CardTitle>
              <CardDescription>Paramètres d'automatisation marketing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Répondeurs automatiques</label>
                  <p className="text-sm text-gray-500">Activer les réponses automatiques</p>
                </div>
                <Switch
                  checked={config.enableAutoResponders}
                  onCheckedChange={(checked) => updateConfig('enableAutoResponders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Campagnes goutte-à-goutte</label>
                  <p className="text-sm text-gray-500">Activer les séquences automatisées</p>
                </div>
                <Switch
                  checked={config.enableDripCampaigns}
                  onCheckedChange={(checked) => updateConfig('enableDripCampaigns', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Avancées</CardTitle>
              <CardDescription>Paramètres d'analyse et reporting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Analytics avancées</label>
                  <p className="text-sm text-gray-500">Activer les analyses détaillées</p>
                </div>
                <Switch
                  checked={config.enableAdvancedAnalytics}
                  onCheckedChange={(checked) => updateConfig('enableAdvancedAnalytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Tests A/B</label>
                  <p className="text-sm text-gray-500">Permettre les tests A/B</p>
                </div>
                <Switch
                  checked={config.enableABTesting}
                  onCheckedChange={(checked) => updateConfig('enableABTesting', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Période de rétention (jours)</label>
                <Input
                  type="number"
                  value={config.retentionPeriodDays}
                  onChange={(e) => updateConfig('retentionPeriodDays', parseInt(e.target.value))}
                  placeholder="Durée de conservation des données"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
