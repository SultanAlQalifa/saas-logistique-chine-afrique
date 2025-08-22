'use client'

import { useState } from 'react'
import { 
  CreditCard, 
  Settings, 
  Check, 
  X, 
  Eye, 
  EyeOff,
  Globe,
  Smartphone,
  Building,
  Shield,
  Key,
  Link,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  ArrowLeft
} from 'lucide-react'

interface PaymentAggregator {
  id: string
  name: string
  logo: string
  description: string
  region: string
  isConnected: boolean
  isActive: boolean
  supportedMethods: string[]
  fees: {
    mobile: number
    card: number
    bank: number
  }
  countries: string[]
  features: string[]
  apiEndpoint: string
  documentation: string
}

interface AggregatorConfig {
  [key: string]: {
    apiKey: string
    secretKey: string
    merchantId: string
    webhookUrl: string
    environment: 'sandbox' | 'production'
  }
}

// Mock data des agrégateurs populaires en Afrique
const mockAggregators: PaymentAggregator[] = [
  {
    id: 'cinetpay',
    name: 'CinetPay',
    logo: '🏦',
    description: 'Agrégateur panafricain avec forte présence francophone',
    region: 'Afrique Francophone',
    isConnected: false,
    isActive: false,
    supportedMethods: ['Mobile Money', 'Cartes Bancaires', 'Virements'],
    fees: { mobile: 2.5, card: 3.2, bank: 1.8 },
    countries: ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 'Cameroun'],
    features: ['API Robuste', 'Plugins CMS', 'Dashboard Analytics', 'Webhooks'],
    apiEndpoint: 'https://api.cinetpay.com',
    documentation: 'https://docs.cinetpay.com'
  },
  {
    id: 'kkiapay',
    name: 'Kkiapay',
    logo: '📱',
    description: 'Solution adaptée aux startups et PME, conforme PCI DSS',
    region: 'Afrique de l\'Ouest',
    isConnected: false,
    isActive: false,
    supportedMethods: ['Mobile Money', 'Wave', 'MTN', 'Moov'],
    fees: { mobile: 2.0, card: 2.8, bank: 1.5 },
    countries: ['Bénin', 'Togo', 'Sénégal', 'Côte d\'Ivoire'],
    features: ['Intégration Rapide', 'Paiements Récurrents', 'Liens de Paiement', 'PCI DSS'],
    apiEndpoint: 'https://api.kkiapay.me',
    documentation: 'https://docs.kkiapay.me'
  },
  {
    id: 'fedapay',
    name: 'FedaPay',
    logo: '💳',
    description: 'Interface simplifiée pour petits commerçants et entrepreneurs',
    region: 'Afrique de l\'Ouest',
    isConnected: false,
    isActive: false,
    supportedMethods: ['Mobile Money', 'Cartes', 'Facturation'],
    fees: { mobile: 1.8, card: 2.5, bank: 1.2 },
    countries: ['Bénin', 'Togo', 'Côte d\'Ivoire'],
    features: ['Interface Conviviale', 'Transparence Tarifaire', 'Support Français', 'Facturation'],
    apiEndpoint: 'https://api.fedapay.com',
    documentation: 'https://docs.fedapay.com'
  },
  {
    id: 'paydunya',
    name: 'PayDunya',
    logo: '🌍',
    description: 'E-commerce local avec émission de factures numériques',
    region: 'Afrique de l\'Ouest',
    isConnected: false,
    isActive: false,
    supportedMethods: ['Wave', 'Orange Money', 'MTN', 'Cartes'],
    fees: { mobile: 2.2, card: 3.0, bank: 1.6 },
    countries: ['Sénégal', 'Ghana', 'Côte d\'Ivoire'],
    features: ['Boutiques en Ligne', 'Factures Numériques', 'PCI DSS', 'Multi-langues'],
    apiEndpoint: 'https://api.paydunya.com',
    documentation: 'https://docs.paydunya.com'
  },
  {
    id: 'paytech',
    name: 'PayTech',
    logo: '🏦',
    description: 'Solution de paiement sénégalaise innovante',
    region: 'Afrique de l\'Ouest',
    isConnected: false,
    isActive: false,
    supportedMethods: ['Mobile Money', 'Orange Money', 'Wave', 'Cartes Bancaires'],
    fees: { mobile: 2.2, card: 2.8, bank: 1.5 },
    countries: ['Sénégal', 'Mali', 'Burkina Faso', 'Côte d\'Ivoire'],
    features: ['API Simple', 'Mobile Money', 'Paiements Locaux', 'Support Français'],
    apiEndpoint: 'https://paytech.sn/api',
    documentation: 'https://paytech.sn/docs'
  }
]

export default function PaymentIntegrationsPage() {
  const [aggregators, setAggregators] = useState<PaymentAggregator[]>(mockAggregators)
  const [selectedAggregator, setSelectedAggregator] = useState<PaymentAggregator | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [configs, setConfigs] = useState<AggregatorConfig>({})
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({})
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async (aggregator: PaymentAggregator) => {
    const config = configs[aggregator.id]
    // PayTech n'utilise pas de merchantId, seulement API Key et Secret
    const requiredFields = aggregator.id === 'paytech' 
      ? ['apiKey', 'secretKey']
      : ['apiKey', 'secretKey', 'merchantId']
    
    const missingFields = requiredFields.filter(field => !config?.[field as keyof typeof config])
    if (missingFields.length > 0) {
      alert('⚠️ Veuillez remplir tous les champs de configuration obligatoires')
      return
    }

    setIsConnecting(true)
    try {
      // Simulation de connexion
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setAggregators(prev => 
        prev.map(agg => 
          agg.id === aggregator.id 
            ? { ...agg, isConnected: true, isActive: true }
            : agg
        )
      )
      
      alert(`✅ Connexion réussie avec ${aggregator.name} !\n\n🔗 Votre plateforme peut maintenant accepter les paiements via cet agrégateur.`)
      setShowConfig(false)
      setSelectedAggregator(null)
    } catch (error) {
      alert(`❌ Erreur de connexion avec ${aggregator.name}. Vérifiez vos identifiants.`)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = (aggregator: PaymentAggregator) => {
    if (confirm(`🔌 Déconnecter ${aggregator.name} ?\n\n⚠️ Les paiements via cet agrégateur seront désactivés.`)) {
      setAggregators(prev => 
        prev.map(agg => 
          agg.id === aggregator.id 
            ? { ...agg, isConnected: false, isActive: false }
            : agg
        )
      )
      
      // Supprimer la config
      const newConfigs = { ...configs }
      delete newConfigs[aggregator.id]
      setConfigs(newConfigs)
      
      alert(`🔌 ${aggregator.name} déconnecté avec succès !`)
    }
  }

  const handleToggleActive = (aggregator: PaymentAggregator) => {
    if (!aggregator.isConnected) {
      alert('⚠️ Vous devez d\'abord connecter cet agrégateur')
      return
    }

    setAggregators(prev => 
      prev.map(agg => 
        agg.id === aggregator.id 
          ? { ...agg, isActive: !agg.isActive }
          : agg
      )
    )
    
    const status = !aggregator.isActive ? 'activé' : 'désactivé'
    alert(`${!aggregator.isActive ? '✅' : '⏸️'} ${aggregator.name} ${status} !`)
  }

  const handleConfigChange = (aggregatorId: string, field: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [aggregatorId]: {
        ...prev[aggregatorId],
        [field]: value
      }
    }))
  }

  const toggleShowSecret = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const connectedCount = aggregators.filter(agg => agg.isConnected).length
  const activeCount = aggregators.filter(agg => agg.isActive).length
  const totalFees = aggregators.filter(agg => agg.isActive).reduce((sum, agg) => sum + agg.fees.mobile, 0) / activeCount || 0

  return (
    <div className="space-y-8">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          {/* Bouton Retour */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/dashboard/finances/payments';
              }
            }}
            className="mb-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl inline-flex items-center gap-2 transition-all duration-200 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Globe className="h-10 w-10" />
                🌍 Intégrations Paiements
              </h1>
              <p className="text-purple-100 text-lg">
                Connectez-vous aux meilleurs agrégateurs de paiement africains
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{connectedCount}/{aggregators.length}</div>
              <div className="text-purple-200 text-sm">Agrégateurs connectés</div>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">🔗 Connectés</p>
              <p className="text-2xl font-bold text-blue-900">{connectedCount}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <Link className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">✅ Actifs</p>
              <p className="text-2xl font-bold text-green-900">{activeCount}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6 border border-yellow-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">💰 Frais Moyen</p>
              <p className="text-2xl font-bold text-yellow-900">{totalFees.toFixed(1)}%</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">🌍 Couverture</p>
              <p className="text-2xl font-bold text-purple-900">15+</p>
              <p className="text-xs text-purple-600">Pays</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <Globe className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des agrégateurs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🏦 Agrégateurs de Paiement Disponibles
          </h2>
          <p className="text-gray-600 mt-1">
            Sélectionnez et configurez vos agrégateurs préférés
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aggregators.map((aggregator) => (
              <div 
                key={aggregator.id}
                className={`border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                  aggregator.isConnected 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-white hover:border-purple-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{aggregator.logo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{aggregator.name}</h3>
                      <p className="text-sm text-gray-600">{aggregator.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {aggregator.isConnected && (
                      <div className={`w-3 h-3 rounded-full ${aggregator.isActive ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      aggregator.isConnected 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {aggregator.isConnected ? 'Connecté' : 'Non connecté'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{aggregator.description}</p>

                {/* Méthodes supportées */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">💳 Méthodes supportées:</p>
                  <div className="flex flex-wrap gap-2">
                    {aggregator.supportedMethods.map((method) => (
                      <span key={method} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Frais */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">💰 Frais:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium">Mobile</div>
                      <div className="text-gray-600">{aggregator.fees.mobile}%</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium">Carte</div>
                      <div className="text-gray-600">{aggregator.fees.card}%</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium">Banque</div>
                      <div className="text-gray-600">{aggregator.fees.bank}%</div>
                    </div>
                  </div>
                </div>

                {/* Pays couverts */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-900 mb-2">🌍 Pays couverts:</p>
                  <div className="flex flex-wrap gap-1">
                    {aggregator.countries.slice(0, 3).map((country) => (
                      <span key={country} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        {country}
                      </span>
                    ))}
                    {aggregator.countries.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{aggregator.countries.length - 3} autres
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!aggregator.isConnected ? (
                    <button
                      onClick={() => {
                        setSelectedAggregator(aggregator)
                        setShowConfig(true)
                      }}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Configurer
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggleActive(aggregator)}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          aggregator.isActive
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {aggregator.isActive ? '⏸️ Désactiver' : '▶️ Activer'}
                      </button>
                      <button
                        onClick={() => handleDisconnect(aggregator)}
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        🔌 Déconnecter
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de configuration */}
      {showConfig && selectedAggregator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedAggregator.logo}</div>
                  <div>
                    <h3 className="text-xl font-bold">Configuration {selectedAggregator.name}</h3>
                    <p className="text-gray-600">Configurez vos identifiants API</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowConfig(false)
                    setSelectedAggregator(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Informations importantes</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Vous devez créer un compte sur {selectedAggregator.name} et obtenir vos clés API.
                    </p>
                    <a 
                      href={selectedAggregator.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline mt-2 inline-block"
                    >
                      📖 Consulter la documentation
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulaire de configuration */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔑 Clé API *
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.apiKey ? 'text' : 'password'}
                      placeholder="Votre clé API"
                      value={configs[selectedAggregator.id]?.apiKey || ''}
                      onChange={(e) => handleConfigChange(selectedAggregator.id, 'apiKey', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowSecret('apiKey')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.apiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔐 Clé Secrète *
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.secretKey ? 'text' : 'password'}
                      placeholder="Votre clé secrète"
                      value={configs[selectedAggregator.id]?.secretKey || ''}
                      onChange={(e) => handleConfigChange(selectedAggregator.id, 'secretKey', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowSecret('secretKey')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets.secretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* ID Marchand - pas nécessaire pour PayTech */}
                {selectedAggregator.id !== 'paytech' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏪 ID Marchand *
                    </label>
                    <input
                      type="text"
                      placeholder="Votre identifiant marchand"
                      value={configs[selectedAggregator.id]?.merchantId || ''}
                      onChange={(e) => handleConfigChange(selectedAggregator.id, 'merchantId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔗 URL Webhook
                  </label>
                  <input
                    type="url"
                    placeholder="https://votre-site.com/webhook"
                    value={configs[selectedAggregator.id]?.webhookUrl || ''}
                    onChange={(e) => handleConfigChange(selectedAggregator.id, 'webhookUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌍 Environnement
                  </label>
                  <select
                    value={configs[selectedAggregator.id]?.environment || 'sandbox'}
                    onChange={(e) => handleConfigChange(selectedAggregator.id, 'environment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="sandbox">🧪 Test (Sandbox)</option>
                    <option value="production">🚀 Production</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowConfig(false)
                    setSelectedAggregator(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleConnect(selectedAggregator)}
                  disabled={isConnecting}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Connexion...
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4" />
                      Connecter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
