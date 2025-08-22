'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { 
  ArrowLeft,
  Settings,
  Clock,
  DollarSign,
  Shield,
  Bell,
  Save,
  RotateCcw,
  CheckCircle,
  Ban,
  Award,
  Info,
  TrendingUp
} from 'lucide-react'

interface BiddingConfig {
  general: {
    enableBidding: boolean
    autoApproval: boolean
    maxBidsPerRequest: number
    bidValidityDays: number
    minBidAmount: number
    maxBidAmount: number
    allowBidWithdrawal: boolean
    requireBidDeposit: boolean
    bidDepositPercentage: number
  }
  timing: {
    bidSubmissionDeadlineHours: number
    evaluationPeriodDays: number
    responseTimeHours: number
    extensionAllowed: boolean
    maxExtensionDays: number
  }
  fees: {
    platformFeePercentage: number
    successFeePercentage: number
    withdrawalFeeFixed: number
    listingFeeFixed: number
    premiumListingFeeFixed: number
  }
  quality: {
    requireVerifiedProviders: boolean
    minProviderRating: number
    requireInsurance: boolean
    requireCertifications: boolean
    blacklistEnabled: boolean
    autoRejectLowRatings: boolean
    minCompletedJobs: number
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    whatsappNotifications: boolean
    pushNotifications: boolean
    notifyOnNewBid: boolean
    notifyOnBidAccepted: boolean
    notifyOnBidRejected: boolean
    notifyOnDeadlineApproaching: boolean
  }
  moderation: {
    autoModerationEnabled: boolean
    requireManualApproval: boolean
    flagSuspiciousBids: boolean
    duplicateBidDetection: boolean
    priceAnomalyDetection: boolean
    spamDetectionEnabled: boolean
  }
}

const defaultConfig: BiddingConfig = {
  general: {
    enableBidding: true,
    autoApproval: false,
    maxBidsPerRequest: 20,
    bidValidityDays: 7,
    minBidAmount: 50000,
    maxBidAmount: 50000000,
    allowBidWithdrawal: true,
    requireBidDeposit: false,
    bidDepositPercentage: 5
  },
  timing: {
    bidSubmissionDeadlineHours: 72,
    evaluationPeriodDays: 5,
    responseTimeHours: 24,
    extensionAllowed: true,
    maxExtensionDays: 3
  },
  fees: {
    platformFeePercentage: 2.5,
    successFeePercentage: 3.0,
    withdrawalFeeFixed: 5000,
    listingFeeFixed: 10000,
    premiumListingFeeFixed: 25000
  },
  quality: {
    requireVerifiedProviders: true,
    minProviderRating: 3.0,
    requireInsurance: true,
    requireCertifications: false,
    blacklistEnabled: true,
    autoRejectLowRatings: true,
    minCompletedJobs: 5
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: true,
    pushNotifications: true,
    notifyOnNewBid: true,
    notifyOnBidAccepted: true,
    notifyOnBidRejected: true,
    notifyOnDeadlineApproaching: true
  },
  moderation: {
    autoModerationEnabled: true,
    requireManualApproval: false,
    flagSuspiciousBids: true,
    duplicateBidDetection: true,
    priceAnomalyDetection: true,
    spamDetectionEnabled: true
  }
}

export default function MarketplaceConfigPage() {
  const [config, setConfig] = useState<BiddingConfig>(defaultConfig)
  const [activeTab, setActiveTab] = useState<'general' | 'timing' | 'fees' | 'quality' | 'notifications' | 'moderation'>('general')
  const [hasChanges, setHasChanges] = useState(false)

  const updateConfig = (section: keyof BiddingConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    console.log('Saving configuration:', config)
    setHasChanges(false)
    alert('Configuration sauvegardée avec succès !')
  }

  const handleReset = () => {
    setConfig(defaultConfig)
    setHasChanges(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Settings className="h-10 w-10 mr-3" />
                Configuration des Enchères
              </h1>
              <p className="text-indigo-100 text-lg">
                ⚙️ Paramétrez le système d'enchères et de propositions commerciales
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {hasChanges && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Système d'enchères</p>
                <p className="text-2xl font-bold">
                  {config.general.enableBidding ? 'Activé' : 'Désactivé'}
                </p>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                config.general.enableBidding ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {config.general.enableBidding ? <CheckCircle className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Frais plateforme</p>
                <p className="text-2xl font-bold">{config.fees.platformFeePercentage}%</p>
              </div>
              <DollarSign className="h-8 w-8 text-indigo-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Note minimum</p>
                <p className="text-2xl font-bold">{config.quality.minProviderRating}/5</p>
              </div>
              <Award className="h-8 w-8 text-indigo-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Modération auto</p>
                <p className="text-2xl font-bold">
                  {config.moderation.autoModerationEnabled ? 'ON' : 'OFF'}
                </p>
              </div>
              <Shield className="h-8 w-8 text-indigo-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'general', label: 'Général', icon: Settings },
          { id: 'timing', label: 'Délais', icon: Clock },
          { id: 'fees', label: 'Frais', icon: DollarSign },
          { id: 'quality', label: 'Qualité', icon: Award },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'moderation', label: 'Modération', icon: Shield }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Configuration Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {activeTab === 'general' && <><Settings className="h-5 w-5 mr-2" />Paramètres Généraux</>}
            {activeTab === 'timing' && <><Clock className="h-5 w-5 mr-2" />Gestion des Délais</>}
            {activeTab === 'fees' && <><DollarSign className="h-5 w-5 mr-2" />Structure des Frais</>}
            {activeTab === 'quality' && <><Award className="h-5 w-5 mr-2" />Contrôle Qualité</>}
            {activeTab === 'notifications' && <><Bell className="h-5 w-5 mr-2" />Notifications</>}
            {activeTab === 'moderation' && <><Shield className="h-5 w-5 mr-2" />Modération</>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Tab Content */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Activer le système d'enchères</label>
                    <p className="text-xs text-gray-500">Permet aux prestataires de faire des propositions</p>
                  </div>
                  <Switch
                    checked={config.general.enableBidding}
                    onCheckedChange={(checked) => updateConfig('general', 'enableBidding', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Approbation automatique</label>
                    <p className="text-xs text-gray-500">Approuver automatiquement les propositions</p>
                  </div>
                  <Switch
                    checked={config.general.autoApproval}
                    onCheckedChange={(checked) => updateConfig('general', 'autoApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Autoriser le retrait de propositions</label>
                    <p className="text-xs text-gray-500">Les prestataires peuvent retirer leurs propositions</p>
                  </div>
                  <Switch
                    checked={config.general.allowBidWithdrawal}
                    onCheckedChange={(checked) => updateConfig('general', 'allowBidWithdrawal', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Exiger un dépôt de garantie</label>
                    <p className="text-xs text-gray-500">Dépôt obligatoire pour faire une proposition</p>
                  </div>
                  <Switch
                    checked={config.general.requireBidDeposit}
                    onCheckedChange={(checked) => updateConfig('general', 'requireBidDeposit', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre max de propositions par demande</label>
                  <Input
                    type="number"
                    value={config.general.maxBidsPerRequest}
                    onChange={(e) => updateConfig('general', 'maxBidsPerRequest', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Validité des propositions (jours)</label>
                  <Input
                    type="number"
                    value={config.general.bidValidityDays}
                    onChange={(e) => updateConfig('general', 'bidValidityDays', parseInt(e.target.value))}
                    min="1"
                    max="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Montant minimum (FCFA)</label>
                  <Input
                    type="number"
                    value={config.general.minBidAmount}
                    onChange={(e) => updateConfig('general', 'minBidAmount', parseInt(e.target.value))}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Montant maximum (FCFA)</label>
                  <Input
                    type="number"
                    value={config.general.maxBidAmount}
                    onChange={(e) => updateConfig('general', 'maxBidAmount', parseInt(e.target.value))}
                    min="0"
                  />
                </div>

                {config.general.requireBidDeposit && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Pourcentage du dépôt de garantie (%)</label>
                    <Input
                      type="number"
                      value={config.general.bidDepositPercentage}
                      onChange={(e) => updateConfig('general', 'bidDepositPercentage', parseFloat(e.target.value))}
                      min="0"
                      max="20"
                      step="0.1"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs content would be implemented similarly */}
          {activeTab !== 'general' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Section en développement</h3>
              <p className="text-gray-500">Cette section sera bientôt disponible.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
