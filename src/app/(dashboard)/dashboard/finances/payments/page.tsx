'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Smartphone,
  Building,
  Globe,
  Settings,
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react'

interface PaymentMethod {
  id: string
  type: 'MOBILE' | 'CARD' | 'BANK' | 'CRYPTO'
  provider: string
  name: string
  details: string
  isDefault: boolean
  isActive: boolean
  fees: number
  logo: string
}

interface Transaction {
  id: string
  date: string
  type: 'PAYMENT' | 'REFUND' | 'COMMISSION'
  amount: number
  currency: string
  method: string
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
  description: string
  client: string
  reference: string
}

// Agrégateurs de paiement
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'BANK',
    provider: 'CINETPAY',
    name: 'CinetPay',
    details: 'Agrégateur panafricain - Mobile Money, Cartes, Virements',
    isDefault: true,
    isActive: true,
    fees: 2.5,
    logo: '🏦'
  },
  {
    id: '2',
    type: 'MOBILE',
    provider: 'KKIAPAY',
    name: 'Kkiapay',
    details: 'Spécialiste Afrique de l\'Ouest - Wave, MTN, Moov, Cartes',
    isDefault: false,
    isActive: true,
    fees: 2.0,
    logo: '📱'
  },
  {
    id: '3',
    type: 'MOBILE',
    provider: 'PAYTECH',
    name: 'PayTech',
    details: 'Groupe InTouch Sénégal - Orange Money, Free Money, Wave',
    isDefault: false,
    isActive: true,
    fees: 2.2,
    logo: '🟠'
  },
  {
    id: '4',
    type: 'CARD',
    provider: 'STRIPE',
    name: 'Stripe',
    details: 'Paiements internationaux - Cartes Visa/Mastercard',
    isDefault: false,
    isActive: true,
    fees: 2.9,
    logo: '💳'
  }
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    reference: 'PAY-2024-001',
    client: 'Amadou Diallo',
    amount: 125000,
    method: 'CinetPay',
    status: 'COMPLETED',
    date: '2024-01-15',
    description: 'Paiement colis aérien via CinetPay',
    type: 'PAYMENT',
    currency: 'XOF'
  },
  {
    id: '2',
    reference: 'PAY-2024-002',
    client: 'Marie Kouassi',
    amount: 89500,
    method: 'Kkiapay',
    status: 'PENDING',
    date: '2024-01-14',
    description: 'Paiement cargo maritime via Kkiapay',
    type: 'PAYMENT',
    currency: 'XOF'
  },
  {
    id: '3',
    reference: 'PAY-2024-003',
    client: 'Ibrahim Traoré',
    amount: 245000,
    method: 'Stripe',
    status: 'FAILED',
    date: '2024-01-13',
    description: 'Paiement international via Stripe',
    type: 'PAYMENT',
    currency: 'XOF'
  },
  {
    id: '4',
    reference: 'PAY-2024-004',
    client: 'Fatou Sow',
    amount: 156000,
    method: 'PayTech',
    status: 'COMPLETED',
    date: '2024-01-12',
    description: 'Paiement multiple colis via PayTech',
    type: 'PAYMENT',
    currency: 'XOF'
  },
  {
    id: '5',
    reference: 'PAY-2024-005',
    client: 'Ousmane Ba',
    amount: 78000,
    method: 'CinetPay',
    status: 'COMPLETED',
    date: '2024-01-11',
    description: 'Paiement transport routier via CinetPay',
    type: 'PAYMENT',
    currency: 'XOF'
  }
]

function PaymentsPageContent() {
  const searchParams = useSearchParams()
  const timestamp = Date.now()
  const [activeTab, setActiveTab] = useState<'transactions' | 'methods' | 'subscription'>('transactions')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')
  const [showAddMethod, setShowAddMethod] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  // Paramètres d'abonnement depuis l'URL
  const planId = searchParams.get('plan')
  const planPrice = searchParams.get('price')
  const planPeriod = searchParams.get('period')
  
  // Détecter si on vient pour un paiement d'abonnement
  const isSubscriptionPayment = planId && planPrice && planPeriod
  
  useEffect(() => {
    if (isSubscriptionPayment) {
      setActiveTab('subscription')
    }
  }, [planId, planPrice, planPeriod, isSubscriptionPayment])

  // Filtrage des transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Statistiques
  const stats = {
    totalTransactions: transactions.length,
    completedTransactions: transactions.filter(t => t.status === 'COMPLETED').length,
    pendingTransactions: transactions.filter(t => t.status === 'PENDING').length,
    failedTransactions: transactions.filter(t => t.status === 'FAILED').length,
    totalVolume: transactions.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0),
    activeMethods: paymentMethods.filter(m => m.isActive).length
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'MOBILE': return Smartphone
      case 'CARD': return CreditCard
      case 'BANK': return Building
      case 'CRYPTO': return Globe
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'PAYMENT': return 'text-green-600'
      case 'COMMISSION': return 'text-blue-600'
      case 'REFUND': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Fonctions pour gérer les actions
  const handleViewTransaction = (transaction: Transaction) => {
    alert(`📄 Détails de la transaction:\n\nRéférence: ${transaction.reference}\nClient: ${transaction.client}\nMontant: ${formatCurrency(transaction.amount)}\nStatut: ${transaction.status}\nDate: ${new Date(transaction.date).toLocaleDateString('fr-FR')}\nDescription: ${transaction.description}`)
  }

  const handleEditMethod = (method: PaymentMethod) => {
    const newName = prompt(`✏️ Modifier le nom de la méthode:`, method.name)
    if (newName && newName.trim()) {
      setPaymentMethods(prev => 
        prev.map(m => m.id === method.id ? { ...m, name: newName.trim() } : m)
      )
      alert(`✅ Méthode "${newName}" mise à jour avec succès !`)
    }
  }

  const handleDeleteMethod = (method: PaymentMethod) => {
    if (confirm(`🗑️ Êtes-vous sûr de vouloir supprimer la méthode "${method.name}" ?\n\n⚠️ Cette action est irréversible.`)) {
      setPaymentMethods(prev => prev.filter(m => m.id !== method.id))
      alert(`🗑️ Méthode "${method.name}" supprimée avec succès !`)
    }
  }

  const handleToggleMethodStatus = (method: PaymentMethod) => {
    const newStatus = !method.isActive
    setPaymentMethods(prev => 
      prev.map(m => m.id === method.id ? { ...m, isActive: newStatus } : m)
    )
    alert(`${newStatus ? '✅' : '❌'} Méthode "${method.name}" ${newStatus ? 'activée' : 'désactivée'} !`)
  }

  const handleConfigureAggregator = () => {
    window.location.href = '/dashboard/finances/payments/provider-settings'
  }

  const handleExportTransactions = () => {
    const csvContent = [
      ['Référence', 'Client', 'Montant', 'Méthode', 'Statut', 'Date', 'Description'].join(','),
      ...filteredTransactions.map(t => [
        t.reference,
        t.client,
        t.amount,
        t.method,
        t.status,
        new Date(t.date).toLocaleDateString('fr-FR'),
        t.description
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    alert('📊 Export CSV des transactions téléchargé avec succès !')
  }

  const handleAdvancedFilters = () => {
    alert('🔍 Filtres avancés:\n\n• Filtrage par période\n• Filtrage par montant\n• Filtrage par méthode de paiement\n• Filtrage par type de transaction\n\n🚧 Fonctionnalité en développement...')
  }

  // Vue simplifiée pour paiement d'abonnement
  if (isSubscriptionPayment) {
    return (
      <div className="space-y-8">
        {/* Header simplifié pour paiement */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                <CreditCard className="h-10 w-10" />
                👑 Paiement Abonnement
              </h1>
              <p className="text-purple-100 text-lg">
                Finaliser votre abonnement {planId} - {planPrice}€/{planPeriod === 'monthly' ? 'mois' : 'an'}
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        </div>

        {/* Interface de paiement */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* Résumé de l'abonnement - Centré */}
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">📋 Résumé de l'abonnement</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Plan:</span>
                    <span className="font-bold capitalize text-purple-600">{planId}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Prix:</span>
                    <span className="font-bold text-gray-900">{planPrice}€</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Période:</span>
                    <span className="font-bold text-gray-900">{planPeriod === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between items-center py-3 bg-purple-50 rounded-lg px-4">
                    <span className="text-lg font-bold text-purple-700">Total à payer:</span>
                    <span className="text-2xl font-bold text-purple-700">{planPrice}€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Méthodes de paiement - En bas */}
            <div className="mt-12">
              <h4 className="text-xl font-bold text-gray-900 text-center mb-8">💳 Choisissez votre méthode de paiement</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {paymentMethods.filter(m => m.isActive).map((method) => (
                  <div
                    key={method.id}
                    className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-500 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => {
                      setSelectedMethod(method.id)
                      setShowPaymentModal(true)
                    }}
                  >
                    <div className="text-center space-y-4">
                      <div className="h-16 flex items-center justify-center">
                        <img 
                          src={method.id === 'cinetpay' ? 'https://docs.cinetpay.com/images/logo-new.png' :
                               method.id === 'kkiapay' ? 'https://kkiapay.me/assets/images/logo.png' :
                               method.id === 'paytech' ? 'https://paytech.sn/assets/img/logo.png' :
                               method.id === 'stripe' ? 'https://logos-world.net/wp-content/uploads/2021/03/Stripe-Logo.png' :
                               method.logo}
                          alt={method.name}
                          className="max-h-12 max-w-full object-contain"
                          onError={(e) => {
                            // Fallback vers emoji si l'image ne charge pas
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="text-4xl">${method.logo}</div>`;
                            }
                          }}
                        />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{method.name}</h5>
                        <p className="text-xs text-gray-500 mt-1">{method.details}</p>
                      </div>
                      <div className="bg-gray-100 group-hover:bg-purple-100 rounded-lg py-2 px-3 transition-colors">
                        <span className="text-xs font-bold text-gray-600 group-hover:text-purple-600">
                          Frais: {method.fees}%
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 max-w-2xl mx-auto p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">🔒 Paiements sécurisés • Traitement instantané • Support 24/7</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">🔒 Paiement sécurisé</p>
                  <p>Vos informations de paiement sont protégées par un chiffrement SSL 256-bit. Nous ne stockons aucune donnée de carte bancaire.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmation de paiement */}
        {showPaymentModal && selectedMethod && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center space-y-6">
                <div className="h-16 flex items-center justify-center">
                  <img 
                    src={selectedMethod === 'cinetpay' ? 'https://docs.cinetpay.com/images/logo-new.png' :
                         selectedMethod === 'kkiapay' ? 'https://kkiapay.me/assets/images/logo.png' :
                         selectedMethod === 'paytech' ? 'https://paytech.sn/assets/img/logo.png' :
                         selectedMethod === 'stripe' ? 'https://logos-world.net/wp-content/uploads/2021/03/Stripe-Logo.png' :
                         ''}
                    alt={paymentMethods.find(m => m.id === selectedMethod)?.name}
                    className="max-h-12 max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="text-6xl">${paymentMethods.find(m => m.id === selectedMethod)?.logo}</div>`;
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Confirmer le paiement
                  </h3>
                  <p className="text-gray-600">
                    Vous allez être redirigé vers {paymentMethods.find(m => m.id === selectedMethod)?.name} pour finaliser votre paiement de <span className="font-bold">{planPrice}€</span>
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Plan:</span>
                    <span className="font-medium capitalize">{planId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Montant:</span>
                    <span className="font-medium">{planPrice}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frais:</span>
                    <span className="font-medium">{paymentMethods.find(m => m.id === selectedMethod)?.fees}%</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{(parseFloat(planPrice || '0') * (1 + (paymentMethods.find(m => m.id === selectedMethod)?.fees || 0) / 100)).toFixed(2)}€</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false)
                      setSelectedMethod(null)
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
                      const redirectUrl = selectedMethodData?.id === 'cinetpay' ? 'https://cinetpay.com' :
                                        selectedMethodData?.id === 'kkiapay' ? 'https://kkiapay.me' :
                                        selectedMethodData?.id === 'paytech' ? 'https://paytech.sn' :
                                        selectedMethodData?.id === 'stripe' ? 'https://stripe.com' :
                                        '#';
                      
                      // Rediriger dans la même page
                      window.location.href = redirectUrl;
                      
                      // Fermer modal immédiatement
                      setShowPaymentModal(false);
                      setSelectedMethod(null);
                    }}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Vue gestionnaire plateforme (pour les autres cas)
  return (
    <div className="space-y-8">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <CreditCard className="h-10 w-10" />
                🌍 Agrégateurs de Paiement
              </h1>
              <p className="text-purple-100 text-lg">
                CinetPay, Kkiapay, PayTech et Stripe - Les meilleurs pour l'Afrique
              </p>
            </div>
            <button
              onClick={handleConfigureAggregator}
              className="bg-white text-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <Settings className="h-5 w-5" />
              🌍 Configurer Agrégateurs
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">💰 Transactions</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalTransactions}</p>
              <p className="text-xs text-green-600 mt-1">
                {stats.completedTransactions} réussies
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">📈 Volume Total</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(stats.totalVolume)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Transactions réussies
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6 border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">⏳ En Attente</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pendingTransactions}</p>
              <p className="text-xs text-yellow-600 mt-1">
                À traiter
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-xl shadow-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">🔧 Méthodes Actives</p>
              <p className="text-2xl font-bold text-purple-900">{stats.activeMethods}</p>
              <p className="text-xs text-purple-600 mt-1">
                Configurées
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
      </div>
      <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
    </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">💰 Transactions</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalTransactions}</p>
              <p className="text-xs text-green-600 mt-1">
                {stats.completedTransactions} réussies
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">📈 Volume Total</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(stats.totalVolume)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Transactions réussies
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">⏳ En Attente</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pendingTransactions}</p>
              <p className="text-xs text-yellow-600 mt-1">
                À traiter
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">🔧 Méthodes Actives</p>
              <p className="text-2xl font-bold text-purple-900">{stats.activeMethods}</p>
              <p className="text-xs text-purple-600 mt-1">
                Configurées
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'transactions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💳 Transactions
            </button>
            <button
              onClick={() => setActiveTab('methods')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'methods'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏦 Méthodes de Paiement
            </button>
            {planId && planPrice && planPeriod && (
              <button
                onClick={() => setActiveTab('subscription')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'subscription'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👑 Paiement Abonnement
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Filtres et actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par référence, client ou description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'pending' | 'failed')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="completed">Terminées</option>
                    <option value="pending">En attente</option>
                    <option value="failed">Échouées</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportTransactions}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    📊 Exporter
                  </button>
                  <button
                    onClick={handleAdvancedFilters}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filtres
                  </button>
                </div>
              </div>

              {/* Liste des transactions */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Méthode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.reference}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                          {transaction.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                          {transaction.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={getTransactionTypeColor(transaction.type)}>
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status === 'COMPLETED' ? 'Terminée' :
                             transaction.status === 'PENDING' ? 'En attente' : 'Échouée'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(transaction.date).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleViewTransaction(transaction)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune transaction trouvée</h3>
                  <p className="mt-1 text-sm text-secondary-500">
                    Aucune transaction ne correspond à vos critères de recherche.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'methods' && (
            <div className="space-y-6">
              {/* Actions pour les méthodes */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">🌍 Agrégateurs Actifs</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {paymentMethods.filter(m => m.isActive).length} actifs
                  </span>
                </div>
                <button
                  onClick={handleConfigureAggregator}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Configurer
                </button>
              </div>
              
              {/* Liste des méthodes de paiement */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => {
                  const Icon = getTypeIcon(method.type)
                  
                  return (
                    <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{method.logo}</div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                            <p className="text-sm text-gray-500">{method.details}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.isDefault && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                              Par défaut
                            </span>
                          )}
                          <div className={`w-3 h-3 rounded-full ${method.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>Frais: {method.fees}%</span>
                        <span className={method.isActive ? 'text-green-600' : 'text-red-600'}>
                          {method.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditMethod(method)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm transition-colors"
                        >
                          <Edit className="h-4 w-4 inline mr-1" />
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleToggleMethodStatus(method)}
                          className={`px-3 py-2 rounded text-sm transition-colors ${
                            method.isActive 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={method.isActive ? 'Désactiver' : 'Activer'}
                        >
                          {method.isActive ? '⏸️' : '▶️'}
                        </button>
                        <button 
                          onClick={() => handleDeleteMethod(method)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {paymentMethods.length === 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-8 text-center border border-purple-200">
                  <div className="text-4xl mb-4">🌍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Agrégateurs Recommandés</h3>
                  <p className="text-gray-600 mb-6">
                    CinetPay, Kkiapay et Stripe sont les 3 meilleurs agrégateurs pour l'Afrique.
                    <br />Ils couvrent tous les moyens de paiement locaux et internationaux.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl mb-2">🏦</div>
                      <div className="font-semibold text-gray-900">CinetPay</div>
                      <div className="text-sm text-gray-600">Panafricain</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl mb-2">📱</div>
                      <div className="font-semibold text-gray-900">Kkiapay</div>
                      <div className="text-sm text-gray-600">Afrique Ouest</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl mb-2">💳</div>
                      <div className="font-semibold text-gray-900">Stripe</div>
                      <div className="text-sm text-gray-600">International</div>
                    </div>
                  </div>
                  <button
                    onClick={handleConfigureAggregator}
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold shadow-lg"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Configurer les Agrégateurs
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'subscription' && planId && planPrice && planPeriod && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">👑 Paiement Abonnement</h3>
                <p className="text-purple-100">Finaliser votre abonnement {planId} - {planPrice}€/{planPeriod === 'monthly' ? 'mois' : 'an'}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Résumé de l'abonnement */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Résumé de l'abonnement</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium capitalize">{planId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix:</span>
                      <span className="font-medium">{planPrice}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Période:</span>
                      <span className="font-medium">{planPeriod === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{planPrice}€</span>
                    </div>
                  </div>
                </div>

                {/* Méthodes de paiement */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">💳 Choisir une méthode de paiement</h4>
                  <div className="space-y-3">
                    {paymentMethods.filter(m => m.isActive).map((method) => (
                      <button
                        key={method.id}
                        className="w-full p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                        onClick={() => {
                          alert(`💳 Redirection vers ${method.name} pour le paiement de ${planPrice}€...`)
                          // Ici on redirigerait vers l'API de paiement
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{method.logo}</span>
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-500">{method.details}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            Frais: {method.fees}%
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">🔒 Paiement sécurisé</p>
                    <p>Vos informations de paiement sont protégées par un chiffrement SSL 256-bit. Nous ne stockons aucune donnée de carte bancaire.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>}>
      <PaymentsPageContent />
    </Suspense>
  )
}
