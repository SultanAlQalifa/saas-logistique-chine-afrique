'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MessageCircle, Settings, CheckCircle, AlertCircle, Eye, EyeOff, Save, RefreshCw, Phone, Users, Zap, Shield } from 'lucide-react'

interface WhatsAppConfig {
  phone_number_id: string
  access_token: string
  webhook_verify_token: string
  app_id: string
  app_secret: string
  business_account_id: string
  phone_number: string
  display_name: string
  status: 'pending' | 'approved' | 'rejected'
  verified: boolean
}

export default function CompanyWhatsAppPage() {
  const { data: session } = useSession()
  const [config, setConfig] = useState<WhatsAppConfig>({
    phone_number_id: '',
    access_token: '',
    webhook_verify_token: '',
    app_id: '',
    app_secret: '',
    business_account_id: '',
    phone_number: '',
    display_name: '',
    status: 'pending',
    verified: false
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showTokens, setShowTokens] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // Statistiques mock
  const stats = {
    messagesEnvoyes: 1247,
    messagesLivres: 1189,
    tauxLivraison: 95.3,
    tempsReponse: '2.1 min',
    conversationsActives: 23,
    clientsUniques: 156
  }

  useEffect(() => {
    loadWhatsAppConfig()
  }, [])

  const loadWhatsAppConfig = async () => {
    setLoading(true)
    try {
      // Simulation de chargement de la configuration
      setTimeout(() => {
        setConfig({
          phone_number_id: '123456789012345',
          access_token: 'EAAG...hidden',
          webhook_verify_token: 'verify_token_123',
          app_id: '987654321',
          app_secret: 'app_secret_hidden',
          business_account_id: '456789123',
          phone_number: '+221 77 123 45 67',
          display_name: 'NextMove Cargo Support',
          status: 'approved',
          verified: true
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Ici, envoyer les données au backend
      console.log('Configuration sauvegardée:', config)
      
      // Notification de succès
      setTestResult({ success: true, message: 'Configuration sauvegardée avec succès !' })
      
    } catch (error) {
      setTestResult({ success: false, message: 'Erreur lors de la sauvegarde' })
    } finally {
      setSaving(false)
    }
  }

  const testConnection = async () => {
    setLoading(true)
    try {
      // Simulation de test de connexion
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      if (config.access_token && config.phone_number_id) {
        setTestResult({ 
          success: true, 
          message: 'Connexion WhatsApp Business réussie ! ✅' 
        })
        setConfig(prev => ({ ...prev, verified: true, status: 'approved' }))
      } else {
        setTestResult({ 
          success: false, 
          message: 'Veuillez remplir tous les champs obligatoires' 
        })
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: 'Erreur de connexion à WhatsApp Business' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof WhatsAppConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
    setTestResult(null) // Reset test result when config changes
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Refusé</h2>
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  // Vérifier si l'utilisateur est ADMIN ou COMPANY_ADMIN
  const userRole = session.user?.role
  if (!['ADMIN', 'COMPANY_ADMIN'].includes(userRole || '')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Restreint</h2>
          <p className="text-gray-600">Seuls les administrateurs d'entreprise peuvent configurer WhatsApp Business.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">📱 Configuration WhatsApp Business</h1>
            <p className="text-green-100">Configurez votre compte WhatsApp Business pour votre entreprise</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.conversationsActives}</div>
              <div className="text-sm text-green-100">Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.tauxLivraison}%</div>
              <div className="text-sm text-green-100">Livraison</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Messages Envoyés</p>
              <p className="text-xl font-bold text-gray-900">{stats.messagesEnvoyes.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Messages Livrés</p>
              <p className="text-xl font-bold text-gray-900">{stats.messagesLivres.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Taux Livraison</p>
              <p className="text-xl font-bold text-gray-900">{stats.tauxLivraison}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <RefreshCw className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Temps Réponse</p>
              <p className="text-xl font-bold text-gray-900">{stats.tempsReponse}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <MessageCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversations</p>
              <p className="text-xl font-bold text-gray-900">{stats.conversationsActives}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Clients Uniques</p>
              <p className="text-xl font-bold text-gray-900">{stats.clientsUniques}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statut de la configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">📊 Statut de la Configuration</h2>
          <div className="flex items-center gap-2">
            {config.verified ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">Vérifié</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-orange-600 font-medium">En attente</span>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Numéro WhatsApp</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{config.phone_number || 'Non configuré'}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Nom d'affichage</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{config.display_name || 'Non configuré'}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Statut Meta</span>
            </div>
            <div className="flex items-center gap-2">
              {config.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
              {config.status === 'pending' && <RefreshCw className="h-4 w-4 text-orange-500" />}
              {config.status === 'rejected' && <AlertCircle className="h-4 w-4 text-red-500" />}
              <span className={`text-sm font-medium ${
                config.status === 'approved' ? 'text-green-600' :
                config.status === 'pending' ? 'text-orange-600' : 'text-red-600'
              }`}>
                {config.status === 'approved' ? 'Approuvé' :
                 config.status === 'pending' ? 'En attente' : 'Rejeté'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">⚙️ Configuration Meta Business</h2>
          <button
            onClick={() => setShowTokens(!showTokens)}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {showTokens ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showTokens ? 'Masquer' : 'Afficher'} les tokens
          </button>
        </div>

        <div className="space-y-6">
          {/* Informations de base */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">📱 Informations WhatsApp Business</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone *
                </label>
                <input
                  type="text"
                  value={config.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  placeholder="+221 77 123 45 67"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'affichage *
                </label>
                <input
                  type="text"
                  value={config.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  placeholder="NextMove Cargo Support"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Identifiants Meta */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">🔑 Identifiants Meta Cloud API</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number ID *
                </label>
                <input
                  type="text"
                  value={config.phone_number_id}
                  onChange={(e) => handleInputChange('phone_number_id', e.target.value)}
                  placeholder="123456789012345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Account ID *
                </label>
                <input
                  type="text"
                  value={config.business_account_id}
                  onChange={(e) => handleInputChange('business_account_id', e.target.value)}
                  placeholder="456789123456789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App ID *
                </label>
                <input
                  type="text"
                  value={config.app_id}
                  onChange={(e) => handleInputChange('app_id', e.target.value)}
                  placeholder="987654321"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Verify Token *
                </label>
                <input
                  type={showTokens ? "text" : "password"}
                  value={config.webhook_verify_token}
                  onChange={(e) => handleInputChange('webhook_verify_token', e.target.value)}
                  placeholder="verify_token_secure_123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tokens sécurisés */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">🔐 Tokens Sécurisés</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Token *
                </label>
                <input
                  type={showTokens ? "text" : "password"}
                  value={config.access_token}
                  onChange={(e) => handleInputChange('access_token', e.target.value)}
                  placeholder="EAAG..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Secret *
                </label>
                <input
                  type={showTokens ? "text" : "password"}
                  value={config.app_secret}
                  onChange={(e) => handleInputChange('app_secret', e.target.value)}
                  placeholder="app_secret_..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Résultat du test */}
        {testResult && (
          <div className={`mt-6 p-4 rounded-lg ${
            testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span className={`font-medium ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.message}
              </span>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={testConnection}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            Tester la connexion
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Aide et documentation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📚 Aide à la Configuration</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <p>
            <strong>1. Créez un compte Meta Business :</strong> Rendez-vous sur{' '}
            <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">
              business.facebook.com
            </a>
          </p>
          <p>
            <strong>2. Configurez WhatsApp Business API :</strong> Suivez le guide{' '}
            <a href="https://developers.facebook.com/docs/whatsapp" target="_blank" rel="noopener noreferrer" className="underline">
              Meta for Developers
            </a>
          </p>
          <p>
            <strong>3. Obtenez vos identifiants :</strong> Phone Number ID, Access Token, et App Secret depuis votre tableau de bord Meta
          </p>
          <p>
            <strong>4. Configurez les webhooks :</strong> URL de webhook fournie après validation par notre équipe
          </p>
        </div>
      </div>
    </div>
  )
}
