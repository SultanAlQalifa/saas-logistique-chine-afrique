'use client'

import { useState } from 'react'
import { 
  Settings,
  Save,
  RefreshCw,
  Shield,
  Mail,
  Globe,
  Database,
  Key,
  Bell,
  Users,
  CreditCard,
  Truck,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff
} from 'lucide-react'

interface SystemConfig {
  general: {
    siteName: string
    siteUrl: string
    timezone: string
    language: string
    currency: string
    maintenanceMode: boolean
  }
  email: {
    provider: string
    host: string
    port: number
    username: string
    password: string
    encryption: string
    fromName: string
    fromEmail: string
  }
  payment: {
    defaultMethod: string
    cinetpayEnabled: boolean
    waveEnabled: boolean
    orangeMoneyEnabled: boolean
    stripeEnabled: boolean
    commissionRate: number
  }
  shipping: {
    defaultOrigin: string
    maxWeight: number
    maxDimensions: string
    insuranceRate: number
    trackingPrefix: string
  }
  security: {
    twoFactorRequired: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    passwordMinLength: number
    apiRateLimit: number
  }
}

const defaultConfig: SystemConfig = {
  general: {
    siteName: 'SaaS Logistique Chine-Afrique',
    siteUrl: 'https://logistics.africa',
    timezone: 'Africa/Dakar',
    language: 'fr',
    currency: 'XOF',
    maintenanceMode: false
  },
  email: {
    provider: 'smtp',
    host: 'smtp.gmail.com',
    port: 587,
    username: 'noreply@logistics.africa',
    password: '••••••••••••',
    encryption: 'tls',
    fromName: 'Logistics Africa',
    fromEmail: 'noreply@logistics.africa'
  },
  payment: {
    defaultMethod: 'wave',
    cinetpayEnabled: true,
    waveEnabled: true,
    orangeMoneyEnabled: true,
    stripeEnabled: false,
    commissionRate: 2.5
  },
  shipping: {
    defaultOrigin: 'Guangzhou, Chine',
    maxWeight: 1000,
    maxDimensions: '200x200x200',
    insuranceRate: 1.5,
    trackingPrefix: 'LAF'
  },
  security: {
    twoFactorRequired: false,
    sessionTimeout: 120,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    apiRateLimit: 1000
  }
}

export default function SystemSettingsPage() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig)
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulation de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
    setHasChanges(false)
  }

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const tabs = [
    { id: 'general', name: 'Général', icon: Settings },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'payment', name: 'Paiements', icon: CreditCard },
    { id: 'shipping', name: 'Expédition', icon: Truck },
    { id: 'security', name: 'Sécurité', icon: Shield }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Paramètres Système</h1>
          <p className="text-secondary-600 mt-1">
            Configuration générale de la plateforme
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <div className="flex items-center text-sm text-orange-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Modifications non sauvegardées
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-secondary-200">
        {/* Onglets */}
        <div className="border-b border-secondary-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Général */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Configuration générale</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nom du site
                    </label>
                    <input
                      type="text"
                      value={config.general.siteName}
                      onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      URL du site
                    </label>
                    <input
                      type="url"
                      value={config.general.siteUrl}
                      onChange={(e) => updateConfig('general', 'siteUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Fuseau horaire
                    </label>
                    <select
                      value={config.general.timezone}
                      onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Africa/Dakar">Afrique/Dakar (GMT+0)</option>
                      <option value="Africa/Abidjan">Afrique/Abidjan (GMT+0)</option>
                      <option value="Africa/Bamako">Afrique/Bamako (GMT+0)</option>
                      <option value="Asia/Shanghai">Asie/Shanghai (GMT+8)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Devise par défaut
                    </label>
                    <select
                      value={config.general.currency}
                      onChange={(e) => updateConfig('general', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="XOF">Franc CFA (XOF)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="USD">Dollar US (USD)</option>
                      <option value="CNY">Yuan Chinois (CNY)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-secondary-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900">Mode maintenance</h4>
                    <p className="text-sm text-secondary-500">Désactiver temporairement l'accès public</p>
                  </div>
                  <button
                    onClick={() => updateConfig('general', 'maintenanceMode', !config.general.maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      config.general.maintenanceMode ? 'bg-primary-600' : 'bg-secondary-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        config.general.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Email */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Configuration SMTP</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Serveur SMTP
                    </label>
                    <input
                      type="text"
                      value={config.email.host}
                      onChange={(e) => updateConfig('email', 'host', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Port
                    </label>
                    <input
                      type="number"
                      value={config.email.port}
                      onChange={(e) => updateConfig('email', 'port', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nom d'utilisateur
                    </label>
                    <input
                      type="email"
                      value={config.email.username}
                      onChange={(e) => updateConfig('email', 'username', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={config.email.password}
                        onChange={(e) => updateConfig('email', 'password', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-secondary-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-secondary-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-secondary-200 pt-6">
                <h4 className="text-sm font-medium text-secondary-900 mb-4">Expéditeur par défaut</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nom de l'expéditeur
                    </label>
                    <input
                      type="text"
                      value={config.email.fromName}
                      onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email de l'expéditeur
                    </label>
                    <input
                      type="email"
                      value={config.email.fromEmail}
                      onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Paiements */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Méthodes de paiement</h3>
                <div className="space-y-4">
                  {[
                    { key: 'waveEnabled', name: 'Wave', description: 'Paiements Wave Money' },
                    { key: 'orangeMoneyEnabled', name: 'Orange Money', description: 'Paiements Orange Money' },
                    { key: 'cinetpayEnabled', name: 'CinetPay', description: 'Passerelle CinetPay' },
                    { key: 'stripeEnabled', name: 'Stripe', description: 'Cartes bancaires via Stripe' }
                  ].map((method) => (
                    <div key={method.key} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-secondary-900">{method.name}</h4>
                        <p className="text-sm text-secondary-500">{method.description}</p>
                      </div>
                      <button
                        onClick={() => updateConfig('payment', method.key, !config.payment[method.key as keyof typeof config.payment])}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          config.payment[method.key as keyof typeof config.payment] ? 'bg-primary-600' : 'bg-secondary-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.payment[method.key as keyof typeof config.payment] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-secondary-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Taux de commission (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={config.payment.commissionRate}
                      onChange={(e) => updateConfig('payment', 'commissionRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Expédition */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Paramètres d'expédition</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Origine par défaut
                    </label>
                    <input
                      type="text"
                      value={config.shipping.defaultOrigin}
                      onChange={(e) => updateConfig('shipping', 'defaultOrigin', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Poids maximum (kg)
                    </label>
                    <input
                      type="number"
                      value={config.shipping.maxWeight}
                      onChange={(e) => updateConfig('shipping', 'maxWeight', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Dimensions max (LxlxH cm)
                    </label>
                    <input
                      type="text"
                      value={config.shipping.maxDimensions}
                      onChange={(e) => updateConfig('shipping', 'maxDimensions', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Préfixe de suivi
                    </label>
                    <input
                      type="text"
                      value={config.shipping.trackingPrefix}
                      onChange={(e) => updateConfig('shipping', 'trackingPrefix', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Paramètres de sécurité</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Timeout de session (minutes)
                    </label>
                    <input
                      type="number"
                      value={config.security.sessionTimeout}
                      onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Tentatives de connexion max
                    </label>
                    <input
                      type="number"
                      value={config.security.maxLoginAttempts}
                      onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Longueur min mot de passe
                    </label>
                    <input
                      type="number"
                      value={config.security.passwordMinLength}
                      onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Limite API (req/h)
                    </label>
                    <input
                      type="number"
                      value={config.security.apiRateLimit}
                      onChange={(e) => updateConfig('security', 'apiRateLimit', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-secondary-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900">Authentification à deux facteurs obligatoire</h4>
                    <p className="text-sm text-secondary-500">Forcer la 2FA pour tous les utilisateurs</p>
                  </div>
                  <button
                    onClick={() => updateConfig('security', 'twoFactorRequired', !config.security.twoFactorRequired)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      config.security.twoFactorRequired ? 'bg-primary-600' : 'bg-secondary-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        config.security.twoFactorRequired ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
