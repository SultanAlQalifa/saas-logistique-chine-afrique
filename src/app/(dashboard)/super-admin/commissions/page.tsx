'use client'

import { useState, useEffect } from 'react'
import { 
  Percent, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Building2,
  Calendar,
  Download,
  Edit,
  Plus,
  Filter,
  Search
} from 'lucide-react'

interface CommissionPlan {
  id: string
  planType: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  platformCommission: number // Pourcentage prélevé par la plateforme
  affiliateCommission: number // Pourcentage pour les affiliés
  minRevenue: number // Revenu minimum pour déclencher la commission
  isActive: boolean
}

interface AffiliateCommission {
  id: string
  affiliateId: string
  affiliateName: string
  companyId: string
  companyName: string
  amount: number
  commissionRate: number
  status: 'pending' | 'paid' | 'cancelled'
  createdAt: Date
  paidAt?: Date
}

export default function CommissionsPage() {
  const [commissionPlans, setCommissionPlans] = useState<CommissionPlan[]>([
    {
      id: '1',
      planType: 'FREE',
      platformCommission: 0,
      affiliateCommission: 0,
      minRevenue: 0,
      isActive: true
    },
    {
      id: '2',
      planType: 'STARTER',
      platformCommission: 5,
      affiliateCommission: 2,
      minRevenue: 10000,
      isActive: true
    },
    {
      id: '3',
      planType: 'PROFESSIONAL',
      platformCommission: 3,
      affiliateCommission: 1.5,
      minRevenue: 50000,
      isActive: true
    },
    {
      id: '4',
      planType: 'ENTERPRISE',
      platformCommission: 2,
      affiliateCommission: 1,
      minRevenue: 200000,
      isActive: true
    }
  ])

  const [affiliateCommissions, setAffiliateCommissions] = useState<AffiliateCommission[]>([
    {
      id: '1',
      affiliateId: 'aff-001',
      affiliateName: 'Jean Kouassi',
      companyId: 'comp-001',
      companyName: 'Import Export Abidjan',
      amount: 2500,
      commissionRate: 2,
      status: 'pending',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      affiliateId: 'aff-002',
      affiliateName: 'Marie Diallo',
      companyId: 'comp-002',
      companyName: 'Logistics Dakar',
      amount: 1800,
      commissionRate: 1.5,
      status: 'paid',
      createdAt: new Date('2024-01-10'),
      paidAt: new Date('2024-01-20')
    }
  ])

  const [activeTab, setActiveTab] = useState<'plans' | 'affiliates' | 'analytics'>('plans')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all')

  const totalCommissions = affiliateCommissions.reduce((sum, comm) => sum + comm.amount, 0)
  const pendingCommissions = affiliateCommissions.filter(c => c.status === 'pending').reduce((sum, comm) => sum + comm.amount, 0)
  const paidCommissions = affiliateCommissions.filter(c => c.status === 'paid').reduce((sum, comm) => sum + comm.amount, 0)

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'FREE': return 'bg-gray-100 text-gray-800'
      case 'STARTER': return 'bg-blue-100 text-blue-800'
      case 'PROFESSIONAL': return 'bg-purple-100 text-purple-800'
      case 'ENTERPRISE': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCommissions = affiliateCommissions.filter(commission => {
    const matchesSearch = commission.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Percent className="h-7 w-7 text-yellow-600" />
            Gestion des Commissionnements
          </h1>
          <p className="text-gray-600 mt-1">
            Configurez les taux de commission et gérez les paiements d'affiliés
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter Rapport</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Total Commissions</p>
              <p className="text-2xl font-bold">{totalCommissions.toLocaleString('fr-FR')} XOF</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">En Attente</p>
              <p className="text-2xl font-bold">{pendingCommissions.toLocaleString('fr-FR')} XOF</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Payées</p>
              <p className="text-2xl font-bold">{paidCommissions.toLocaleString('fr-FR')} XOF</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Affiliés Actifs</p>
              <p className="text-2xl font-bold">{new Set(affiliateCommissions.map(c => c.affiliateId)).size}</p>
            </div>
            <Users className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plans'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="h-4 w-4 inline mr-2" />
            Plans de Commission
          </button>
          <button
            onClick={() => setActiveTab('affiliates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'affiliates'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Commissions Affiliés
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Analytiques
          </button>
        </nav>
      </div>

      {/* Plans de Commission Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Configuration des Taux de Commission</h2>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nouveau Plan</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
          </div>

          <div className="grid gap-4">
            {commissionPlans.map((plan) => (
              <div key={plan.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Plan {plan.planType}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPlanColor(plan.planType)}`}>
                        {plan.planType}
                      </span>
                      {plan.isActive && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Actif
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Commission Plateforme</div>
                        <div className="text-2xl font-bold text-yellow-600">{plan.platformCommission}%</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Commission Affilié</div>
                        <div className="text-2xl font-bold text-blue-600">{plan.affiliateCommission}%</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Revenu Minimum</div>
                        <div className="text-2xl font-bold text-purple-600">{plan.minRevenue.toLocaleString('fr-FR')} XOF</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commissions Affiliés Tab */}
      {activeTab === 'affiliates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Commissions des Affiliés</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="paid">Payé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Affilié
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entreprise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taux
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCommissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commission.affiliateName}</div>
                        <div className="text-sm text-gray-500">{commission.affiliateId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{commission.companyName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commission.amount.toLocaleString('fr-FR')} XOF</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{commission.commissionRate}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commission.status)}`}>
                          {commission.status === 'pending' ? 'En attente' : 
                           commission.status === 'paid' ? 'Payé' : 'Annulé'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {commission.createdAt.toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {commission.status === 'pending' && (
                          <button className="text-green-600 hover:text-green-900 mr-2">
                            Payer
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Analytiques des Commissions</h2>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des Commissions</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Graphique des commissions par mois (à implémenter avec Recharts)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Affiliés</h3>
              <div className="space-y-3">
                {affiliateCommissions.slice(0, 5).map((commission, index) => (
                  <div key={commission.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-medium text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{commission.affiliateName}</div>
                        <div className="text-xs text-gray-500">{commission.companyName}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{commission.amount.toLocaleString('fr-FR')} XOF</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par Plan</h3>
              <div className="space-y-3">
                {commissionPlans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(plan.planType)}`}>
                        {plan.planType}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{plan.platformCommission}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
