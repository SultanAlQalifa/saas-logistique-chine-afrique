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
  Users,
  Shield,
  Bell,
  Star,
  Award,
  ArrowLeft,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProvidersConfigPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)

  const [config, setConfig] = useState({
    autoApproval: true,
    requireVerification: true,
    maxProvidersPerZone: 50,
    minRatingRequired: 4.0,
    allowProfileEditing: true,
    requireCertifications: true,
    enableQualityControl: true,
    autoSuspendLowRating: true,
    suspensionThreshold: 3.0,
    emailNotifications: true,
    smsNotifications: false,
    defaultCommissionRate: 8.5,
    enableModeration: true
  })

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    console.log('Saving provider configuration:', config)
    setHasChanges(false)
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'profile', label: 'Profil', icon: Users },
    { id: 'quality', label: 'Qualité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'commissions', label: 'Commissions', icon: TrendingUp },
    { id: 'moderation', label: 'Modération', icon: Award }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
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
                <Settings className="h-10 w-10 mr-3" />
                Configuration Prestataires
              </h1>
              <p className="text-blue-100 text-lg">
                🔧 Gérez les paramètres et règles pour les prestataires logistiques
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
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
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
                <p className="text-sm text-gray-600">Prestataires Actifs</p>
                <p className="text-2xl font-bold text-blue-600">247</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note Moyenne</p>
                <p className="text-2xl font-bold text-green-600">4.6</p>
              </div>
              <Star className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspendus</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
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
                  ? 'bg-white text-blue-600 shadow-sm'
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Généraux</CardTitle>
                <CardDescription>Configuration de base pour les prestataires</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Approbation automatique</label>
                    <p className="text-sm text-gray-500">Approuver automatiquement les nouveaux prestataires</p>
                  </div>
                  <Switch
                    checked={config.autoApproval}
                    onCheckedChange={(checked) => updateConfig('autoApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Vérification obligatoire</label>
                    <p className="text-sm text-gray-500">Exiger une vérification avant activation</p>
                  </div>
                  <Switch
                    checked={config.requireVerification}
                    onCheckedChange={(checked) => updateConfig('requireVerification', checked)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Maximum par zone</label>
                  <Input
                    type="number"
                    value={config.maxProvidersPerZone}
                    onChange={(e) => updateConfig('maxProvidersPerZone', parseInt(e.target.value))}
                    placeholder="Nombre maximum de prestataires par zone"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Note minimum requise</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={config.minRatingRequired}
                    onChange={(e) => updateConfig('minRatingRequired', parseFloat(e.target.value))}
                    placeholder="Note minimum pour rester actif"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
                <CardDescription>Aperçu des performances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Prestataires vérifiés</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      98.5%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Croissance mensuelle</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      +12%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Profils</CardTitle>
              <CardDescription>Paramètres pour les profils prestataires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Édition de profil autorisée</label>
                  <p className="text-sm text-gray-500">Permettre aux prestataires de modifier leur profil</p>
                </div>
                <Switch
                  checked={config.allowProfileEditing}
                  onCheckedChange={(checked) => updateConfig('allowProfileEditing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Certifications obligatoires</label>
                  <p className="text-sm text-gray-500">Exiger des certifications valides</p>
                </div>
                <Switch
                  checked={config.requireCertifications}
                  onCheckedChange={(checked) => updateConfig('requireCertifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'quality' && (
          <Card>
            <CardHeader>
              <CardTitle>Contrôle Qualité</CardTitle>
              <CardDescription>Paramètres de qualité et performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Contrôle qualité activé</label>
                  <p className="text-sm text-gray-500">Surveiller automatiquement la qualité</p>
                </div>
                <Switch
                  checked={config.enableQualityControl}
                  onCheckedChange={(checked) => updateConfig('enableQualityControl', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Suspension automatique</label>
                  <p className="text-sm text-gray-500">Suspendre si note trop basse</p>
                </div>
                <Switch
                  checked={config.autoSuspendLowRating}
                  onCheckedChange={(checked) => updateConfig('autoSuspendLowRating', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Seuil de suspension</label>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={config.suspensionThreshold}
                  onChange={(e) => updateConfig('suspensionThreshold', parseFloat(e.target.value))}
                  placeholder="Note en dessous de laquelle suspendre"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Notification</CardTitle>
              <CardDescription>Gérer les notifications aux prestataires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Notifications email</label>
                  <p className="text-sm text-gray-500">Envoyer des notifications par email</p>
                </div>
                <Switch
                  checked={config.emailNotifications}
                  onCheckedChange={(checked) => updateConfig('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Notifications SMS</label>
                  <p className="text-sm text-gray-500">Envoyer des notifications par SMS</p>
                </div>
                <Switch
                  checked={config.smsNotifications}
                  onCheckedChange={(checked) => updateConfig('smsNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'commissions' && (
          <Card>
            <CardHeader>
              <CardTitle>Structure des Commissions</CardTitle>
              <CardDescription>Paramètres de facturation et commissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Taux de commission standard (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={config.defaultCommissionRate}
                  onChange={(e) => updateConfig('defaultCommissionRate', parseFloat(e.target.value))}
                  placeholder="Taux de commission par défaut"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'moderation' && (
          <Card>
            <CardHeader>
              <CardTitle>Modération Automatique</CardTitle>
              <CardDescription>Paramètres de modération et contrôle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Modération activée</label>
                  <p className="text-sm text-gray-500">Activer la modération automatique</p>
                </div>
                <Switch
                  checked={config.enableModeration}
                  onCheckedChange={(checked) => updateConfig('enableModeration', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
