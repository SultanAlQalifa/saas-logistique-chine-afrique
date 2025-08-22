'use client'

import { useState } from 'react'
import { 
  Settings, 
  CreditCard, 
  Building, 
  Users, 
  Key, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  Smartphone,
  Clock,
  AlertTriangle,
  Send,
  DollarSign,
  ArrowLeft,
  Edit
} from 'lucide-react'

interface AggregatorConfig {
  id: string
  name: string
  logo: string
  isEnabled: boolean
  apiCredentials?: {
    apiKey: string
    secretKey: string
    merchantId: string
  }
  fees: number
  supportedMethods: string[]
}

interface ProviderConfig {
  id: string
  name: string
  email: string
  phone: string
  address: string
  paymentMode: 'own_api' | 'delegated'
  isVip?: boolean
}

interface WithdrawalRequest {
  id: string
  providerId: string
  providerName: string
  amount: number
  currency: string
  method: string
  phoneNumber: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  requestDate: string
  approvedBy?: string
  completedDate?: string
  reason?: string
  availableBalance?: number
  totalEarned?: number
  description?: string
}

const mockProviders: ProviderConfig[] = [
  {
    id: '1',
    name: 'LogiTrans SARL',
    email: 'contact@logitrans.sn',
    phone: '+221 77 123 45 67',
    address: '123 Avenue Bourguiba, Dakar',
    paymentMode: 'delegated',
    isVip: false
  },
  {
    id: '2', 
    name: 'AfriShip Express',
    email: 'admin@afriship.ci',
    phone: '+225 07 89 12 34',
    address: '456 Boulevard Houphouët-Boigny, Abidjan',
    paymentMode: 'own_api',
    isVip: true
  }
]

const mockAggregators: AggregatorConfig[] = [
  {
    id: 'cinetpay',
    name: 'CinetPay',
    logo: '🏦',
    isEnabled: true,
    fees: 2.5,
    supportedMethods: ['Mobile Money', 'Cartes', 'Virements']
  },
  {
    id: 'kkiapay',
    name: 'Kkiapay', 
    logo: '📱',
    isEnabled: false,
    fees: 2.0,
    supportedMethods: ['Wave', 'MTN', 'Moov']
  },
  {
    id: 'paytech',
    name: 'PayTech',
    logo: '🟠',
    isEnabled: true,
    apiCredentials: {
      apiKey: 'pk_test_***************',
      secretKey: 'sk_live_***************',
      merchantId: 'MERCHANT_123456'
    },
    fees: 2.2,
    supportedMethods: ['Orange Money', 'Free Money', 'Wave']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '💳',
    isEnabled: true,
    fees: 2.9,
    supportedMethods: ['Visa', 'Mastercard']
  }
]

const mockWithdrawals: WithdrawalRequest[] = [
  {
    id: '1',
    providerId: '1',
    providerName: 'LogiTrans SARL',
    amount: 250000,
    currency: 'XOF',
    method: 'Orange Money',
    phoneNumber: '+221 77 123 45 67',
    status: 'pending',
    requestDate: '2024-01-20T10:30:00',
    availableBalance: 450000,
    totalEarned: 680000,
    description: 'Décaissement pour paiement fournisseurs'
  },
  {
    id: '2',
    providerId: '2', 
    providerName: 'AfriShip Express',
    amount: 150000,
    currency: 'XOF',
    method: 'Wave',
    phoneNumber: '+225 07 89 12 34',
    status: 'approved',
    requestDate: '2024-01-19T14:15:00',
    approvedBy: 'Admin Système',
    availableBalance: 320000,
    totalEarned: 500000,
    description: 'Salaires équipe logistique'
  },
  {
    id: '3',
    providerId: '1',
    providerName: 'LogiTrans SARL',
    amount: 500000,
    currency: 'XOF',
    method: 'Orange Money',
    phoneNumber: '+221 77 123 45 67',
    status: 'pending',
    requestDate: '2024-01-21T09:15:00',
    availableBalance: 450000,
    totalEarned: 680000,
    description: 'Investissement nouveau véhicule'
  }
]

export default function ProviderSettingsPage() {
  const [selectedProvider, setSelectedProvider] = useState<ProviderConfig>(mockProviders[0])
  const [providers, setProviders] = useState<ProviderConfig[]>(mockProviders)
  const [aggregators, setAggregators] = useState<AggregatorConfig[]>(mockAggregators)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawals)
  const [showCredentials, setShowCredentials] = useState<{[key: string]: boolean}>({})
  const [activeTab, setActiveTab] = useState<'general' | 'aggregators' | 'withdrawals'>('general')
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const handleModeChange = (mode: 'own_api' | 'delegated') => {
    console.log(
      `🔄 Changement de mode pour ${selectedProvider.name}:`,
      `${selectedProvider.paymentMode} → ${mode}`
    )
    setSelectedProvider(prev => ({ ...prev, paymentMode: mode }))
    
    const modeText = mode === 'own_api' ? 'API Propre' : 'Gestion Centralisée'
    alert(`✅ Mode de paiement "${modeText}" configuré pour ${selectedProvider.name}`)
  }

  const handleAggregatorToggle = (aggregatorId: string) => {
    const aggregator = aggregators.find(a => a.id === aggregatorId)
    const newStatus = !aggregator?.isEnabled
    
    // Vérifier la limite d'agrégateurs si on essaie d'activer
    if (newStatus) {
      const currentlyEnabled = aggregators.filter(a => a.isEnabled).length
      const maxAggregators = selectedProvider.isVip ? Infinity : 2
      
      if (currentlyEnabled >= maxAggregators) {
        alert(`❌ Limite atteinte ! ${selectedProvider.isVip ? 'Erreur système.' : 'Les entreprises standard peuvent activer maximum 2 agrégateurs. Passez en VIP pour plus d\'agrégateurs.'}`)
        return
      }
    }
    
    setAggregators(prev => 
      prev.map(agg => 
        agg.id === aggregatorId 
          ? { ...agg, isEnabled: newStatus }
          : agg
      )
    )
    
    alert(`${newStatus ? '✅' : '❌'} ${aggregator?.name} ${newStatus ? 'activé' : 'désactivé'} !`)
  }

  const handleCredentialChange = (aggregatorId: string, field: string, value: string) => {
    setAggregators(prev =>
      prev.map(agg =>
        agg.id === aggregatorId
          ? {
              ...agg,
              apiCredentials: {
                ...agg.apiCredentials,
                [field]: value
              } as any
            }
          : agg
      )
    )
  }

  const handleWithdrawalAction = (withdrawalId: string, action: 'approve' | 'reject', reason?: string) => {
    setWithdrawals(prev =>
      prev.map(w =>
        w.id === withdrawalId
          ? {
              ...w,
              status: action === 'approve' ? 'approved' : 'rejected',
              approvedBy: 'Admin Système',
              reason: action === 'reject' ? reason : undefined
            }
          : w
      )
    )
    
    const withdrawal = withdrawals.find(w => w.id === withdrawalId)
    const actionText = action === 'approve' ? 'approuvée' : 'rejetée'
    alert(`✅ Demande de décaissement de ${formatCurrency(withdrawal?.amount || 0)} ${actionText} !`)
    setShowDetailsModal(false)
    setSelectedWithdrawal(null)
  }

  const openWithdrawalDetails = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal)
    setShowDetailsModal(true)
  }

  const handleEditWithdrawal = (withdrawal: WithdrawalRequest) => {
    const newAmount = prompt(`Modifier le montant (actuel: ${formatCurrency(withdrawal.amount)}):`, withdrawal.amount.toString())
    if (newAmount && !isNaN(Number(newAmount))) {
      const amount = Number(newAmount)
      if (amount >= 1000) {
        setWithdrawals(prev => 
          prev.map(w => 
            w.id === withdrawal.id 
              ? { ...w, amount }
              : w
          )
        )
        alert(`✅ Montant modifié avec succès : ${formatCurrency(amount)}`)
      } else {
        alert('❌ Le montant minimum est de 1 000 FCFA')
      }
    }
  }

  const handleCancelWithdrawal = (withdrawalId: string) => {
    if (confirm('⚠️ Êtes-vous sûr de vouloir annuler cette demande de décaissement ?')) {
      setWithdrawals(prev => prev.filter(w => w.id !== withdrawalId))
      alert('✅ Demande de décaissement annulée avec succès')
    }
  }

  const canApproveWithdrawal = (withdrawal: WithdrawalRequest) => {
    return withdrawal.amount <= (withdrawal.availableBalance || 0)
  }

  const handleSendMoney = (withdrawalId: string) => {
    setWithdrawals(prev =>
      prev.map(w =>
        w.id === withdrawalId
          ? {
              ...w,
              status: 'completed',
              completedDate: new Date().toISOString()
            }
          : w
      )
    )
    
    const withdrawal = withdrawals.find(w => w.id === withdrawalId)
    alert(`💸 Envoi de ${formatCurrency(withdrawal?.amount || 0)} effectué vers ${withdrawal?.phoneNumber} !`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length
  const approvedWithdrawals = withdrawals.filter(w => w.status === 'approved').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/dashboard/finances/payments'}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm"
                title="Retour aux paiements"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Retour</span>
              </button>
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  <Building className="h-10 w-10" />
                  💳 Configuration Paiements
                </h1>
                <p className="text-blue-100 text-lg">
                  Gestion des agrégateurs et décaissements pour votre entreprise
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{pendingWithdrawals}</div>
              <div className="text-blue-200 text-sm">Demandes en attente</div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations entreprise */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="h-6 w-6" />
          🏢 Votre Entreprise
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{selectedProvider.name}</h3>
              <p className="text-sm text-gray-500">{selectedProvider.email}</p>
              <div className="flex gap-2 mt-2">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  selectedProvider.paymentMode === 'own_api' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedProvider.paymentMode === 'own_api' ? '🔑 Mode API Propre' : '🛡️ Mode Délégué'}
                </div>
                {selectedProvider.isVip && (
                  <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    ⭐ Accès VIP
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Configuration actuelle</div>
              <div className={`text-lg font-bold ${
                selectedProvider.paymentMode === 'own_api' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {selectedProvider.paymentMode === 'own_api' ? 'Autonome' : 'Délégué'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⚙️ Configuration Générale
            </button>
            <button
              onClick={() => setActiveTab('aggregators')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'aggregators'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔧 Gestion Agrégateurs
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'withdrawals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💸 Demandes de Décaissement
              {pendingWithdrawals > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {pendingWithdrawals}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  ⚙️ Configuration de Paiement pour : {selectedProvider.name}
                </h3>
                <p className="text-blue-700 mb-6">
                  Choisissez le mode de gestion des paiements pour ce prestataire/client :
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mode API Propre */}
                  <div 
                    onClick={() => handleModeChange('own_api')}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedProvider.paymentMode === 'own_api'
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-full ${
                        selectedProvider.paymentMode === 'own_api' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Key className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">🔑 API Propre</h4>
                        <p className="text-sm text-gray-600">Ils gèrent leurs propres paiements</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Le prestataire utilise ses propres identifiants API pour chaque agrégateur. 
                      Il a un contrôle total sur ses transactions.
                    </p>
                  </div>

                  {/* Mode Délégué */}
                  <div 
                    onClick={() => handleModeChange('delegated')}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedProvider.paymentMode === 'delegated'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-full ${
                        selectedProvider.paymentMode === 'delegated' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">🛡️ Gestion Centralisée</h4>
                        <p className="text-sm text-gray-600">La plateforme gère les paiements</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      La plateforme gère tous les paiements avec ses propres agrégateurs. 
                      Solution clé en main pour l'entreprise cliente.
                    </p>
                  </div>
                </div>

                {/* Configuration spécifique selon le mode */}
                {selectedProvider.paymentMode === 'own_api' && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      ✅ Mode API Propre Activé
                    </h4>
                    <p className="text-green-700 text-sm">
                      {selectedProvider.name} doit configurer ses propres identifiants API dans l'onglet "Gestion Agrégateurs".
                    </p>
                  </div>
                )}

                {selectedProvider.paymentMode === 'delegated' && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      🛡️ Mode Délégué Activé
                    </h4>
                    <p className="text-blue-700 text-sm">
                      La plateforme gère automatiquement tous les paiements pour {selectedProvider.name} 
                      avec nos agrégateurs configurés.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'aggregators' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  🔧 Gestion des Agrégateurs
                </h3>
                <p className="text-yellow-700 text-sm">
                  {selectedProvider.paymentMode === 'own_api' 
                    ? `Configuration des identifiants API de ${selectedProvider.name} pour chaque agrégateur.`
                    : `Gestion des agrégateurs disponibles pour la plateforme (mode délégué pour ${selectedProvider.name}).`
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aggregators.map((aggregator) => (
                  <div key={aggregator.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{aggregator.logo}</span>
                        <div>
                          <h3 className="font-bold text-gray-900">{aggregator.name}</h3>
                          <p className="text-sm text-gray-500">{aggregator.fees}% de frais</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={aggregator.isEnabled}
                          onChange={() => handleAggregatorToggle(aggregator.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => handleAggregatorToggle(aggregator.id)}
                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                          aggregator.isEnabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {aggregator.isEnabled ? '❌ Désactiver' : '✅ Activer'}
                      </button>

                      {selectedProvider.paymentMode === 'own_api' && aggregator.isEnabled && (
                        <div className="space-y-3 pt-3 border-t border-gray-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              🔑 Clé API de {selectedProvider.name}
                            </label>
                            <div className="relative">
                              <input
                                type={showCredentials[`${aggregator.id}_api`] ? 'text' : 'password'}
                                value={aggregator.apiCredentials?.apiKey || ''}
                                onChange={(e) => handleCredentialChange(aggregator.id, 'apiKey', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                placeholder="Clé API du prestataire"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCredentials(prev => ({
                                  ...prev,
                                  [`${aggregator.id}_api`]: !prev[`${aggregator.id}_api`]
                                }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              >
                                {showCredentials[`${aggregator.id}_api`] ? 
                                  <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                                }
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              🔐 Clé Secrète de {selectedProvider.name}
                            </label>
                            <div className="relative">
                              <input
                                type={showCredentials[`${aggregator.id}_secret`] ? 'text' : 'password'}
                                value={aggregator.apiCredentials?.secretKey || ''}
                                onChange={(e) => handleCredentialChange(aggregator.id, 'secretKey', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                placeholder="Clé secrète du prestataire"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCredentials(prev => ({
                                  ...prev,
                                  [`${aggregator.id}_secret`]: !prev[`${aggregator.id}_secret`]
                                }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              >
                                {showCredentials[`${aggregator.id}_secret`] ? 
                                  <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedProvider.paymentMode === 'delegated' && aggregator.isEnabled && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-blue-700 text-sm">
                            🛡️ Géré automatiquement par la plateforme avec nos identifiants {aggregator.name}.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Méthodes supportées:</p>
                      <div className="flex flex-wrap gap-1">
                        {aggregator.supportedMethods.map((method) => (
                          <span key={method} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'aggregators' && selectedProvider.paymentMode === 'delegated' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Mode API Propre Requis</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Pour gérer vos agrégateurs, vous devez configurer le mode "API Propre" 
                      dans l'onglet Configuration Générale.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedProvider.isVip && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Limite Agrégateurs - Compte Standard</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Vous pouvez activer maximum <strong>2 agrégateurs</strong>. 
                    Passez en VIP pour un accès illimité aux agrégateurs.
                  </p>
                  <div className="mt-2 text-xs text-blue-600">
                    Agrégateurs actifs: <strong>{aggregators.filter(a => a.isEnabled).length}/2</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Mode API Propre Requis</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Pour gérer vos agrégateurs, vous devez configurer le mode "API Propre" 
                      dans l'onglet Configuration Générale.
                    </p>
                  </div>
                </div>
              </div>
              
              {!selectedProvider.isVip && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Limite Agrégateurs - Compte Standard</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        Vous pouvez activer maximum <strong>2 agrégateurs</strong>. 
                        Passez en VIP pour un accès illimité aux agrégateurs.
                      </p>
                      <div className="mt-2 text-xs text-blue-600">
                        Agrégateurs actifs: <strong>{aggregators.filter(a => a.isEnabled).length}/2</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prestataire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Méthode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {withdrawal.providerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {withdrawal.phoneNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(withdrawal.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900">{withdrawal.method}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(withdrawal.status)}`}>
                            {withdrawal.status === 'pending' ? 'En attente' :
                             withdrawal.status === 'approved' ? 'Approuvée' :
                             withdrawal.status === 'completed' ? 'Envoyée' : 'Rejetée'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(withdrawal.requestDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openWithdrawalDetails(withdrawal)}
                              className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs"
                            >
                              <Eye className="h-3 w-3" />
                              Voir
                            </button>
                            {withdrawal.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleEditWithdrawal(withdrawal)}
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                                >
                                  <Edit className="h-3 w-3" />
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleCancelWithdrawal(withdrawal.id)}
                                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
                                >
                                  <XCircle className="h-3 w-3" />
                                  Annuler
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails de décaissement */}
      {showDetailsModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Smartphone className="h-6 w-6" />
                  💸 Détails de la Demande
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Informations du prestataire */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  👤 Informations Prestataire
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nom:</span>
                    <div className="font-medium">{selectedWithdrawal.providerName}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Téléphone:</span>
                    <div className="font-medium">{selectedWithdrawal.phoneNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Méthode:</span>
                    <div className="font-medium">{selectedWithdrawal.method}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Date demande:</span>
                    <div className="font-medium">{new Date(selectedWithdrawal.requestDate).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              </div>

              {/* Détails financiers */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  💰 Situation Financière
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Montant demandé:</span>
                    <div className="font-bold text-lg text-blue-900">{formatCurrency(selectedWithdrawal.amount)}</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Solde disponible:</span>
                    <div className="font-bold text-lg text-blue-900">{formatCurrency(selectedWithdrawal.availableBalance || 0)}</div>
                  </div>
                  <div>
                    <span className="text-blue-600">Total gagné:</span>
                    <div className="font-medium text-blue-800">{formatCurrency(selectedWithdrawal.totalEarned || 0)}</div>
                  </div>
                </div>
              </div>

              {/* Validation du montant */}
              <div className={`rounded-lg p-4 mb-6 ${
                canApproveWithdrawal(selectedWithdrawal) 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  {canApproveWithdrawal(selectedWithdrawal) ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-medium ${
                      canApproveWithdrawal(selectedWithdrawal) ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {canApproveWithdrawal(selectedWithdrawal) 
                        ? '✅ Demande Valide' 
                        : '❌ Demande Non Valide'
                      }
                    </h4>
                    <p className={`text-sm mt-1 ${
                      canApproveWithdrawal(selectedWithdrawal) ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {canApproveWithdrawal(selectedWithdrawal)
                        ? 'Le montant demandé est inférieur ou égal au solde disponible.'
                        : `Montant insuffisant ! Demande: ${formatCurrency(selectedWithdrawal.amount)}, Disponible: ${formatCurrency(selectedWithdrawal.availableBalance || 0)}`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedWithdrawal.description && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    📝 Raison du décaissement
                  </h3>
                  <p className="text-gray-700">{selectedWithdrawal.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fermer
                </button>
                {selectedWithdrawal.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        handleEditWithdrawal(selectedWithdrawal)
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        handleCancelWithdrawal(selectedWithdrawal.id)
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Annuler
                    </button>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex-1 mr-3">
                      <p className="text-orange-700 text-sm">
                        ⏳ En attente de validation par les administrateurs.
                      </p>
                    </div>
                  </>
                )}
                {selectedWithdrawal.status === 'approved' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-1 mr-3">
                    <p className="text-blue-700 text-sm">
                      ✅ Demande approuvée. En attente d'envoi par les administrateurs.
                    </p>
                  </div>
                )}
                {selectedWithdrawal.status === 'completed' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex-1 mr-3">
                    <p className="text-green-700 text-sm">
                      💸 Fonds envoyés avec succès !
                    </p>
                  </div>
                )}
                {selectedWithdrawal.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex-1 mr-3">
                    <p className="text-red-700 text-sm">
                      ❌ Demande rejetée{selectedWithdrawal.reason ? ` : ${selectedWithdrawal.reason}` : '.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
