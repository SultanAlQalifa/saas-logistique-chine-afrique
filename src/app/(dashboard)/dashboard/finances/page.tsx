'use client'

import { useState } from 'react'
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Receipt,
  BarChart3,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Wallet,
  PieChart,
  FileText,
  Clock
} from 'lucide-react'
import Link from 'next/link'

// Données financières mock
const financialStats = {
  totalRevenue: 2450000,
  totalExpenses: 1850000,
  netProfit: 600000,
  pendingPayments: 125000,
  monthlyGrowth: 12.5,
  transactionVolume: 1247
}

const quickActions = [
  {
    title: 'Facturation',
    description: 'Gérer les factures et devis',
    icon: Receipt,
    href: '/dashboard/finances/billing',
    color: 'bg-blue-500',
    stats: '24 factures en attente'
  },
  {
    title: 'Paiements',
    description: 'Méthodes et transactions',
    icon: CreditCard,
    href: '/dashboard/finances/payments',
    color: 'bg-green-500',
    stats: '1,247 transactions ce mois'
  },
  {
    title: 'Commissionnements',
    description: 'Gestion des commissions',
    icon: TrendingUp,
    href: '/dashboard/finances/commissions',
    color: 'bg-purple-500',
    stats: '15 agents actifs'
  },
  {
    title: 'Rapports Financiers',
    description: 'Analytics et exports',
    icon: BarChart3,
    href: '/dashboard/finances/reports',
    color: 'bg-orange-500',
    stats: 'Croissance +12.5%'
  }
]

export default function FinancesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Données des transactions récentes
  const recentTransactions = [
    {
      id: '1',
      date: '2024-01-20',
      type: 'PAYMENT',
      amount: 125000,
      currency: 'XOF',
      method: 'Wave',
      status: 'COMPLETED',
      description: 'Paiement colis CO-2024-001',
      client: 'Kouassi Jean-Baptiste'
    },
    {
      id: '2',
      date: '2024-01-19',
      type: 'COMMISSION',
      amount: 15000,
      currency: 'XOF',
      method: 'Orange Money',
      status: 'COMPLETED',
      description: 'Commission agent Dakar',
      client: 'Marie Diallo'
    },
    {
      id: '3',
      date: '2024-01-18',
      type: 'REFUND',
      amount: -25000,
      currency: 'XOF',
      method: 'Wave',
      status: 'PENDING',
      description: 'Remboursement CO-2024-002',
      client: 'AfriTrade Solutions'
    },
    {
      id: '4',
      date: '2024-01-17',
      type: 'PAYMENT',
      amount: 85000,
      currency: 'XOF',
      method: 'CinetPay',
      status: 'COMPLETED',
      description: 'Paiement cargo CG-2024-005',
      client: 'Logistics Express'
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT': return ArrowDownRight
      case 'COMMISSION': return TrendingUp
      case 'REFUND': return ArrowUpRight
      default: return DollarSign
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Finances</h1>
          <p className="text-secondary-600 mt-1">
            Vue d'ensemble de vos finances et transactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* KPIs Financiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(financialStats.totalRevenue)}
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{financialStats.monthlyGrowth}% ce mois
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Dépenses</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(financialStats.totalExpenses)}
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                Frais opérationnels
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Bénéfice net</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(financialStats.netProfit)}
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Marge: {((financialStats.netProfit / financialStats.totalRevenue) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">En attente</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(financialStats.pendingPayments)}
              </p>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                À encaisser
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className="bg-white rounded-lg border border-secondary-200 p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-secondary-400 group-hover:text-secondary-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-secondary-600 mb-3">
                {action.description}
              </p>
              <p className="text-xs text-secondary-500 font-medium">
                {action.stats}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Transactions Récentes */}
      <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-secondary-900">
            Transactions Récentes
          </h3>
          <Link
            href="/dashboard/finances/payments"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Voir tout
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {recentTransactions.map((transaction) => {
                const Icon = getTransactionIcon(transaction.type)
                
                return (
                  <tr key={transaction.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Icon className="h-5 w-5 text-secondary-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-secondary-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(transaction.date).toLocaleDateString('fr-FR')}
                          </div>
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
                      <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'COMPLETED' ? 'Terminé' :
                         transaction.status === 'PENDING' ? 'En attente' : 'Échoué'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-secondary-400 hover:text-secondary-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {recentTransactions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-sm font-medium text-secondary-900">Aucune transaction</h3>
            <p className="mt-1 text-sm text-secondary-500">
              Les transactions apparaîtront ici une fois effectuées.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
