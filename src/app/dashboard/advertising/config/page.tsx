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
  Megaphone,
  Eye,
  DollarSign,
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
  Target
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdvertisingConfigPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)

  const [config, setConfig] = useState({
    // Général
    enableAdvertising: true,
    autoApproval: false,
    maxAdsPerUser: 10,
    defaultDuration: 30,
    
    // Espaces publicitaires
    enableBannerAds: true,
    enableVideoAds: true,
    enableNativeAds: true,
    maxFileSize: 10, // MB
    
    // Tarification
    basePricePerDay: 5000, // FCFA
    premiumMultiplier: 2.5,
    discountThreshold: 7, // jours
    bulkDiscount: 15, // %
    
    // Modération
    requireApproval: true,
    autoRejectKeywords: ['spam', 'fake', 'scam'],
    maxRejections: 3,
    
    // Notifications
    notifyNewAds: true,
    notifyApprovals: true,
    notifyExpirations: true,
    
    // Analytics
    enableDetailedStats: true,
    trackClicks: true,
    trackImpressions: true,
    retentionDays: 90
  })

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    console.log('Saving advertising configuration:', config)
    setHasChanges(false)
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'spaces', label: 'Espaces', icon: Eye },
    { id: 'pricing', label: 'Tarification', icon: DollarSign },
    { id: 'moderation', label: 'Modération', icon: CheckCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl p-8 text-white">
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
                <Megaphone className="h-10 w-10 mr-3" />
                Configuration Publicité
              </h1>
              <p className="text-orange-100 text-lg">
                📢 Gérez les espaces publicitaires et paramètres
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
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold"
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
                <p className="text-sm text-gray-600">Espaces Actifs</p>
                <p className="text-2xl font-bold text-orange-600">18</p>
              </div>
              <Eye className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus Mensuels</p>
                <p className="text-2xl font-bold text-green-600">2.8M FCFA</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de Clic</p>
                <p className="text-2xl font-bold text-blue-600">4.2%</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-purple-600">125K</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
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
                  ? 'bg-white text-orange-600 shadow-sm'
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
              <CardDescription>Configuration de base pour la publicité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Publicité activée</label>
                  <p className="text-sm text-gray-500">Activer le système publicitaire</p>
                </div>
                <Switch
                  checked={config.enableAdvertising}
                  onCheckedChange={(checked) => updateConfig('enableAdvertising', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Approbation automatique</label>
                  <p className="text-sm text-gray-500">Approuver automatiquement les annonces</p>
                </div>
                <Switch
                  checked={config.autoApproval}
                  onCheckedChange={(checked) => updateConfig('autoApproval', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Maximum annonces par utilisateur</label>
                <Input
                  type="number"
                  value={config.maxAdsPerUser}
                  onChange={(e) => updateConfig('maxAdsPerUser', parseInt(e.target.value))}
                  placeholder="Nombre maximum d'annonces"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Durée par défaut (jours)</label>
                <Input
                  type="number"
                  value={config.defaultDuration}
                  onChange={(e) => updateConfig('defaultDuration', parseInt(e.target.value))}
                  placeholder="Durée par défaut en jours"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'spaces' && (
          <Card>
            <CardHeader>
              <CardTitle>Espaces Publicitaires</CardTitle>
              <CardDescription>Configuration des types d'espaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Bannières publicitaires</label>
                  <p className="text-sm text-gray-500">Activer les bannières display</p>
                </div>
                <Switch
                  checked={config.enableBannerAds}
                  onCheckedChange={(checked) => updateConfig('enableBannerAds', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Publicités vidéo</label>
                  <p className="text-sm text-gray-500">Permettre les annonces vidéo</p>
                </div>
                <Switch
                  checked={config.enableVideoAds}
                  onCheckedChange={(checked) => updateConfig('enableVideoAds', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Publicités natives</label>
                  <p className="text-sm text-gray-500">Activer les annonces intégrées</p>
                </div>
                <Switch
                  checked={config.enableNativeAds}
                  onCheckedChange={(checked) => updateConfig('enableNativeAds', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Taille maximum fichier (MB)</label>
                <Input
                  type="number"
                  value={config.maxFileSize}
                  onChange={(e) => updateConfig('maxFileSize', parseInt(e.target.value))}
                  placeholder="Taille maximum en MB"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'pricing' && (
          <Card>
            <CardHeader>
              <CardTitle>Tarification</CardTitle>
              <CardDescription>Configuration des prix et remises</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Prix de base par jour (FCFA)</label>
                <Input
                  type="number"
                  value={config.basePricePerDay}
                  onChange={(e) => updateConfig('basePricePerDay', parseInt(e.target.value))}
                  placeholder="Prix de base en FCFA"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Multiplicateur premium</label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.premiumMultiplier}
                  onChange={(e) => updateConfig('premiumMultiplier', parseFloat(e.target.value))}
                  placeholder="Multiplicateur pour espaces premium"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Seuil remise (jours)</label>
                <Input
                  type="number"
                  value={config.discountThreshold}
                  onChange={(e) => updateConfig('discountThreshold', parseInt(e.target.value))}
                  placeholder="Nombre de jours pour déclencher remise"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Remise en volume (%)</label>
                <Input
                  type="number"
                  value={config.bulkDiscount}
                  onChange={(e) => updateConfig('bulkDiscount', parseInt(e.target.value))}
                  placeholder="Pourcentage de remise"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'moderation' && (
          <Card>
            <CardHeader>
              <CardTitle>Modération</CardTitle>
              <CardDescription>Paramètres de modération des annonces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Approbation requise</label>
                  <p className="text-sm text-gray-500">Exiger une validation manuelle</p>
                </div>
                <Switch
                  checked={config.requireApproval}
                  onCheckedChange={(checked) => updateConfig('requireApproval', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Mots-clés interdits</label>
                <Textarea
                  value={config.autoRejectKeywords.join(', ')}
                  onChange={(e) => updateConfig('autoRejectKeywords', e.target.value.split(', '))}
                  placeholder="Mots-clés séparés par des virgules"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Maximum rejets autorisés</label>
                <Input
                  type="number"
                  value={config.maxRejections}
                  onChange={(e) => updateConfig('maxRejections', parseInt(e.target.value))}
                  placeholder="Nombre maximum de rejets"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Paramètres de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Nouvelles annonces</label>
                  <p className="text-sm text-gray-500">Notifier les nouvelles soumissions</p>
                </div>
                <Switch
                  checked={config.notifyNewAds}
                  onCheckedChange={(checked) => updateConfig('notifyNewAds', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Approbations</label>
                  <p className="text-sm text-gray-500">Notifier les approbations/rejets</p>
                </div>
                <Switch
                  checked={config.notifyApprovals}
                  onCheckedChange={(checked) => updateConfig('notifyApprovals', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Expirations</label>
                  <p className="text-sm text-gray-500">Alerter avant expiration</p>
                </div>
                <Switch
                  checked={config.notifyExpirations}
                  onCheckedChange={(checked) => updateConfig('notifyExpirations', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Paramètres de suivi et analyse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Statistiques détaillées</label>
                  <p className="text-sm text-gray-500">Activer les analyses avancées</p>
                </div>
                <Switch
                  checked={config.enableDetailedStats}
                  onCheckedChange={(checked) => updateConfig('enableDetailedStats', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Suivi des clics</label>
                  <p className="text-sm text-gray-500">Tracker les clics sur annonces</p>
                </div>
                <Switch
                  checked={config.trackClicks}
                  onCheckedChange={(checked) => updateConfig('trackClicks', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Suivi des impressions</label>
                  <p className="text-sm text-gray-500">Compter les affichages</p>
                </div>
                <Switch
                  checked={config.trackImpressions}
                  onCheckedChange={(checked) => updateConfig('trackImpressions', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Rétention données (jours)</label>
                <Input
                  type="number"
                  value={config.retentionDays}
                  onChange={(e) => updateConfig('retentionDays', parseInt(e.target.value))}
                  placeholder="Durée de conservation"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
