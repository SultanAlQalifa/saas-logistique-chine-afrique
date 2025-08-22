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
  Package,
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
  Clock,
  DollarSign,
  Users,
  Filter,
  MessageSquare
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RequestsConfigPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)

  const [config, setConfig] = useState({
    // Général
    autoApproval: false,
    requireVerification: true,
    maxRequestsPerUser: 10,
    minBudgetRequired: 50000,
    
    // Validation
    enableAutoValidation: true,
    requireDetailedDescription: true,
    mandatoryFields: ['title', 'description', 'budget', 'deadline'],
    
    // Qualité
    enableQualityControl: true,
    autoRejectLowBudget: true,
    budgetThreshold: 25000,
    reviewPeriodDays: 7,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    notifyNewRequests: true,
    notifyProposals: true,
    
    // Commissions
    platformCommissionRate: 5.0,
    urgentRequestSurcharge: 2.0,
    minimumCommission: 5000,
    
    // Modération
    enableModeration: true,
    autoModerationKeywords: ['urgent', 'gratuit', 'rapide'],
    requireManualReview: true
  })

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    console.log('Saving requests configuration:', config)
    setHasChanges(false)
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'validation', label: 'Validation', icon: Shield },
    { id: 'quality', label: 'Qualité', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'commissions', label: 'Commissions', icon: TrendingUp },
    { id: 'moderation', label: 'Modération', icon: Award }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white">
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
                <Package className="h-10 w-10 mr-3" />
                Configuration Demandes
              </h1>
              <p className="text-purple-100 text-lg">
                📋 Gérez les paramètres et règles pour les demandes de services
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
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
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
                <p className="text-sm text-gray-600">Demandes Actives</p>
                <p className="text-2xl font-bold text-purple-600">156</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Validation</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Moyen</p>
                <p className="text-2xl font-bold text-green-600">1.2M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejetées</p>
                <p className="text-2xl font-bold text-red-600">8</p>
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
                  ? 'bg-white text-purple-600 shadow-sm'
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
                <CardDescription>Configuration de base pour les demandes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Approbation automatique</label>
                    <p className="text-sm text-gray-500">Approuver automatiquement les nouvelles demandes</p>
                  </div>
                  <Switch
                    checked={config.autoApproval}
                    onCheckedChange={(checked) => updateConfig('autoApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Vérification obligatoire</label>
                    <p className="text-sm text-gray-500">Exiger une vérification avant publication</p>
                  </div>
                  <Switch
                    checked={config.requireVerification}
                    onCheckedChange={(checked) => updateConfig('requireVerification', checked)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Maximum par utilisateur</label>
                  <Input
                    type="number"
                    value={config.maxRequestsPerUser}
                    onChange={(e) => updateConfig('maxRequestsPerUser', parseInt(e.target.value))}
                    placeholder="Nombre maximum de demandes par utilisateur"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Budget minimum (FCFA)</label>
                  <Input
                    type="number"
                    value={config.minBudgetRequired}
                    onChange={(e) => updateConfig('minBudgetRequired', parseInt(e.target.value))}
                    placeholder="Budget minimum pour une demande"
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
                      <span className="text-sm font-medium">Taux d'approbation</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      94.2%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Croissance mensuelle</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      +18%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium">Propositions moyennes</span>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      8.4
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'validation' && (
          <Card>
            <CardHeader>
              <CardTitle>Règles de Validation</CardTitle>
              <CardDescription>Paramètres pour la validation des demandes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Validation automatique</label>
                  <p className="text-sm text-gray-500">Valider automatiquement les demandes conformes</p>
                </div>
                <Switch
                  checked={config.enableAutoValidation}
                  onCheckedChange={(checked) => updateConfig('enableAutoValidation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Description détaillée obligatoire</label>
                  <p className="text-sm text-gray-500">Exiger une description complète</p>
                </div>
                <Switch
                  checked={config.requireDetailedDescription}
                  onCheckedChange={(checked) => updateConfig('requireDetailedDescription', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Champs obligatoires</label>
                <div className="grid grid-cols-2 gap-2">
                  {['title', 'description', 'budget', 'deadline', 'location', 'category'].map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={field}
                        checked={config.mandatoryFields.includes(field)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateConfig('mandatoryFields', [...config.mandatoryFields, field])
                          } else {
                            updateConfig('mandatoryFields', config.mandatoryFields.filter(f => f !== field))
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={field} className="text-sm capitalize">{field}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'quality' && (
          <Card>
            <CardHeader>
              <CardTitle>Contrôle Qualité</CardTitle>
              <CardDescription>Paramètres de qualité et filtrage</CardDescription>
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
                  <label className="text-sm font-medium">Rejet automatique budget faible</label>
                  <p className="text-sm text-gray-500">Rejeter automatiquement les budgets trop bas</p>
                </div>
                <Switch
                  checked={config.autoRejectLowBudget}
                  onCheckedChange={(checked) => updateConfig('autoRejectLowBudget', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Seuil budget minimum (FCFA)</label>
                <Input
                  type="number"
                  value={config.budgetThreshold}
                  onChange={(e) => updateConfig('budgetThreshold', parseInt(e.target.value))}
                  placeholder="Budget en dessous duquel rejeter"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Période de révision (jours)</label>
                <Input
                  type="number"
                  value={config.reviewPeriodDays}
                  onChange={(e) => updateConfig('reviewPeriodDays', parseInt(e.target.value))}
                  placeholder="Nombre de jours pour la révision"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Notification</CardTitle>
              <CardDescription>Gérer les notifications pour les demandes</CardDescription>
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

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Nouvelles demandes</label>
                  <p className="text-sm text-gray-500">Notifier les nouvelles demandes</p>
                </div>
                <Switch
                  checked={config.notifyNewRequests}
                  onCheckedChange={(checked) => updateConfig('notifyNewRequests', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Nouvelles propositions</label>
                  <p className="text-sm text-gray-500">Notifier les nouvelles propositions</p>
                </div>
                <Switch
                  checked={config.notifyProposals}
                  onCheckedChange={(checked) => updateConfig('notifyProposals', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'commissions' && (
          <Card>
            <CardHeader>
              <CardTitle>Structure des Commissions</CardTitle>
              <CardDescription>Paramètres de facturation pour les demandes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Taux de commission plateforme (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={config.platformCommissionRate}
                  onChange={(e) => updateConfig('platformCommissionRate', parseFloat(e.target.value))}
                  placeholder="Taux de commission de la plateforme"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Surcharge demandes urgentes (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={config.urgentRequestSurcharge}
                  onChange={(e) => updateConfig('urgentRequestSurcharge', parseFloat(e.target.value))}
                  placeholder="Surcharge pour les demandes urgentes"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Commission minimum (FCFA)</label>
                <Input
                  type="number"
                  min="0"
                  value={config.minimumCommission}
                  onChange={(e) => updateConfig('minimumCommission', parseInt(e.target.value))}
                  placeholder="Commission minimum par transaction"
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

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Révision manuelle</label>
                  <p className="text-sm text-gray-500">Exiger une révision manuelle</p>
                </div>
                <Switch
                  checked={config.requireManualReview}
                  onCheckedChange={(checked) => updateConfig('requireManualReview', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Mots-clés de modération</label>
                <Textarea
                  value={config.autoModerationKeywords.join(', ')}
                  onChange={(e) => updateConfig('autoModerationKeywords', e.target.value.split(', '))}
                  placeholder="Mots-clés séparés par des virgules"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Les demandes contenant ces mots-clés seront automatiquement signalées
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
