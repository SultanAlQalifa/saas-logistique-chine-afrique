'use client'

import { useState } from 'react'
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react'

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedGateway, setSelectedGateway] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock data pour les paiements
  const payments = [
    {
      id: 'PAY-001',
      amount: 125000,
      currency: 'FCFA',
      status: 'completed',
      gateway: 'CinetPay',
      client: 'Amadou Diallo',
      date: '2024-01-15',
      reference: 'PAY-2024-001',
      description: 'Paiement colis aérien via CinetPay'
    },
    {
      id: 'PAY-002',
      amount: 89500,
      currency: 'FCFA',
      status: 'pending',
      gateway: 'Kkiapay',
      client: 'Marie Kouassi',
      date: '2024-01-14',
      reference: 'PAY-2024-002',
      description: 'Paiement cargo maritime via Kkiapay'
    },
    {
      id: 'PAY-003',
      amount: 245000,
      currency: 'FCFA',
      status: 'failed',
      gateway: 'Stripe',
      client: 'Ibrahim Traoré',
      date: '2024-01-13',
      reference: 'PAY-2024-003',
      description: 'Paiement international via Stripe'
    },
    {
      id: 'PAY-004',
      amount: 156000,
      currency: 'FCFA',
      status: 'completed',
      gateway: 'PayTech',
      client: 'Fatou Sow',
      date: '2024-01-12',
      reference: 'PAY-2024-004',
      description: 'Paiement multiple colis via PayTech'
    }
  ]

  const gateways = [
    { name: 'CinetPay', status: 'active', commission: '2.5%', color: 'from-orange-500 to-red-500' },
    { name: 'Kkiapay', status: 'active', commission: '2.0%', color: 'from-yellow-500 to-orange-500' },
    { name: 'PayTech', status: 'active', commission: '2.2%', color: 'from-blue-500 to-indigo-500' },
    { name: 'Stripe', status: 'active', commission: '2.9%', color: 'from-purple-500 to-pink-500' }
  ]

  const stats = [
    {
      title: 'Revenus Totaux',
      value: '2,450,000 FCFA',
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Transactions',
      value: '1,247',
      change: '+8.2%',
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'Clients Actifs',
      value: '342',
      change: '+15.3%',
      icon: Users,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50'
    },
    {
      title: 'Taux de Succès',
      value: '94.8%',
      change: '+2.1%',
      icon: CheckCircle,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'from-cyan-50 to-blue-50'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getGatewayStatus = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus
    const matchesGateway = selectedGateway === 'all' || payment.gateway === selectedGateway
    
    return matchesSearch && matchesStatus && matchesGateway
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">💳 Gestion des Paiements</h1>
            <p className="text-yellow-100 text-lg">Passerelles de paiement & API - Gestion complète des transactions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-orange-600 hover:bg-orange-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Nouvelle Passerelle
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.bgColor} p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
                  </div>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Passerelles de Paiement */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg mr-3">
              🏦
            </span>
            Passerelles de Paiement
          </h2>
          <button 
            onClick={() => window.location.href = '/dashboard/finances/payments/provider-settings'}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Configurer API
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gateways.map((gateway, index) => (
            <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${gateway.color} p-3 rounded-lg`}>
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGatewayStatus(gateway.status)}`}>
                  {gateway.status}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{gateway.name}</h3>
              <p className="text-sm text-gray-600 mb-4">Commission: {gateway.commission}</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => window.location.href = '/dashboard/finances/payments/integrations'}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  Configurer
                </button>
                <button 
                  onClick={() => alert(`📊 Statistiques ${gateway.name}:\n\n• Transactions: ${Math.floor(Math.random() * 500) + 100}\n• Volume: ${(Math.random() * 1000000 + 500000).toLocaleString('fr-FR')} FCFA\n• Taux de succès: ${(Math.random() * 10 + 90).toFixed(1)}%\n• Commission moyenne: ${gateway.commission}`)}
                  className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Statistiques
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtres et Actions */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par client ou référence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full sm:w-80"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Complété</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoué</option>
            </select>

            <select
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Toutes les passerelles</option>
              {gateways.map((gateway) => (
                <option key={gateway.name} value={gateway.name}>{gateway.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              <Download className="h-4 w-4" />
              Exporter
            </button>
            <button className="bg-gradient-to-r from-gray-500 to-slate-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              <Filter className="h-4 w-4" />
              Filtres Avancés
            </button>
          </div>
        </div>

        {/* Table des Paiements */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passerelle</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{payment.reference}</div>
                    <div className="text-sm text-gray-500">{payment.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{payment.client}</div>
                    <div className="text-sm text-gray-500">{payment.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-lg text-gray-900">
                      {payment.amount.toLocaleString('fr-FR')} {payment.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Wallet className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium text-gray-900">{payment.gateway}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(payment.date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun paiement trouvé</p>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
