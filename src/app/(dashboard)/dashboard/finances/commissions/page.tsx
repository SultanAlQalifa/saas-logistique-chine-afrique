'use client'

import { useState } from 'react'
import DateFilter, { DateRange } from '@/components/ui/date-filter'
import { 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Download,
  UserCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  CreditCard,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  location: string
  type: 'individual' | 'company'
  status: 'active' | 'inactive' | 'suspended'
  commissionRate: number
  totalEarned: number
  pendingAmount: number
  lastActivity: string
  joinedDate: string
}

interface Commission {
  id: string
  agentId: string
  agentName: string
  type: 'SHIPMENT' | 'REFERRAL' | 'BONUS'
  amount: number
  rate: number
  baseAmount: number
  currency: string
  status: 'pending' | 'paid' | 'cancelled'
  date: string
  description: string
  reference: string
  paymentDate?: string
}

// Mock data
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Marie Diallo',
    email: 'marie.diallo@agent.com',
    phone: '+221 77 456 789',
    location: 'Dakar, Sénégal',
    type: 'individual',
    status: 'active',
    commissionRate: 8.5,
    totalEarned: 450000,
    pendingAmount: 25000,
    lastActivity: '2024-01-20',
    joinedDate: '2023-06-15'
  },
  {
    id: '2',
    name: 'Express Logistics SARL',
    email: 'contact@expresslogistics.ci',
    phone: '+225 07 123 456',
    location: 'Abidjan, Côte d\'Ivoire',
    type: 'company',
    status: 'active',
    commissionRate: 12.0,
    totalEarned: 1250000,
    pendingAmount: 85000,
    lastActivity: '2024-01-19',
    joinedDate: '2023-03-10'
  },
  {
    id: '3',
    name: 'Amadou Traoré',
    email: 'amadou.traore@agent.com',
    phone: '+223 65 789 123',
    location: 'Bamako, Mali',
    type: 'individual',
    status: 'active',
    commissionRate: 7.0,
    totalEarned: 280000,
    pendingAmount: 15000,
    lastActivity: '2024-01-18',
    joinedDate: '2023-09-20'
  },
  {
    id: '4',
    name: 'Fatou Logistics',
    email: 'info@fatoulogistics.bf',
    phone: '+226 70 456 789',
    location: 'Ouagadougou, Burkina Faso',
    type: 'company',
    status: 'inactive',
    commissionRate: 10.0,
    totalEarned: 150000,
    pendingAmount: 0,
    lastActivity: '2023-12-15',
    joinedDate: '2023-08-05'
  }
]

const mockCommissions: Commission[] = [
  {
    id: '1',
    agentId: '1',
    agentName: 'Marie Diallo',
    type: 'SHIPMENT',
    amount: 25000,
    rate: 8.5,
    baseAmount: 294118,
    currency: 'XOF',
    status: 'pending',
    date: '2024-01-20',
    description: 'Commission transport CO-2024-001',
    reference: 'COM-2024-001'
  },
  {
    id: '2',
    agentId: '2',
    agentName: 'Express Logistics SARL',
    type: 'SHIPMENT',
    amount: 54000,
    rate: 12.0,
    baseAmount: 450000,
    currency: 'XOF',
    status: 'paid',
    date: '2024-01-19',
    description: 'Commission cargo CG-2024-005',
    reference: 'COM-2024-002',
    paymentDate: '2024-01-19'
  },
  {
    id: '3',
    agentId: '3',
    agentName: 'Amadou Traoré',
    type: 'REFERRAL',
    amount: 15000,
    rate: 7.0,
    baseAmount: 214286,
    currency: 'XOF',
    status: 'pending',
    date: '2024-01-18',
    description: 'Commission parrainage nouveau client',
    reference: 'COM-2024-003'
  },
  {
    id: '4',
    agentId: '1',
    agentName: 'Marie Diallo',
    type: 'BONUS',
    amount: 50000,
    rate: 0,
    baseAmount: 0,
    currency: 'XOF',
    status: 'paid',
    date: '2024-01-15',
    description: 'Bonus performance mensuelle',
    reference: 'COM-2024-004',
    paymentDate: '2024-01-16'
  }
]

export default function CommissionsPage() {
  const [activeTab, setActiveTab] = useState<'commissions' | 'agents'>('commissions')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [statsType, setStatsType] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null })

  // Filtrage des commissions
  const filteredCommissions = mockCommissions.filter(commission => {
    const matchesSearch = commission.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commission.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Filtrage des agents
  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Statistiques
  const stats = {
    totalAgents: mockAgents.length,
    activeAgents: mockAgents.filter(a => a.status === 'active').length,
    totalCommissions: mockCommissions.reduce((sum, c) => sum + c.amount, 0),
    paidCommissions: mockCommissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0),
    pendingCommissions: mockCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0),
    averageRate: mockAgents.reduce((sum, a) => sum + a.commissionRate, 0) / mockAgents.length
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid': 
        return 'bg-green-100 text-green-800'
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'suspended':
        return 'bg-orange-100 text-orange-800'
      default: 
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCommissionTypeColor = (type: string) => {
    switch (type) {
      case 'SHIPMENT': return 'bg-blue-100 text-blue-800'
      case 'REFERRAL': return 'bg-purple-100 text-purple-800'
      case 'BONUS': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec gradient amélioré */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              💰 Commissions & Agents
            </h1>
            <p className="text-green-100 text-lg">Gestion des commissions et performance des agents commerciaux</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-white text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Nouveau Paiement
            </button>
            <button 
              onClick={() => {
                const csvData = mockCommissions.map(c => ({
                  Reference: c.reference,
                  Agent: c.agentName,
                  Montant: c.amount,
                  Statut: c.status,
                  Date: c.date,
                  'Date Paiement': c.paymentDate || 'N/A'
                }))
                const csvContent = "data:text/csv;charset=utf-8," + 
                  Object.keys(csvData[0]).join(",") + "\n" +
                  csvData.map(row => Object.values(row).join(",")).join("\n")
                const encodedUri = encodeURI(csvContent)
                const link = document.createElement("a")
                link.setAttribute("href", encodedUri)
                link.setAttribute("download", "commissions_export.csv")
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                // Export réussi - pas de popup nécessaire
              }}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 border border-white/30"
            >
              <Download className="h-5 w-5" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Filtre de date */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            📅 Filtrer par période
          </h3>
          {(dateRange.startDate || dateRange.endDate) && (
            <button
              onClick={() => setDateRange({ startDate: null, endDate: null })}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Effacer le filtre
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <DateFilter
              value={dateRange}
              onChange={setDateRange}
              placeholder="Sélectionner une période"
              className="w-full"
            />
          </div>
          <div className="text-sm text-gray-600">
            {dateRange.startDate || dateRange.endDate ? (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="font-medium text-green-800">Période active:</p>
                <p className="text-green-700">
                  {dateRange.startDate && dateRange.endDate
                    ? `Du ${dateRange.startDate.toLocaleDateString('fr-FR')} au ${dateRange.endDate.toLocaleDateString('fr-FR')}`
                    : dateRange.startDate
                    ? `À partir du ${dateRange.startDate.toLocaleDateString('fr-FR')}`
                    : `Jusqu'au ${dateRange.endDate?.toLocaleDateString('fr-FR')}`
                  }
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-600">Aucun filtre de date appliqué</p>
                <p className="text-xs text-gray-500">Toutes les commissions sont affichées</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const endOfDay = new Date(today)
                endOfDay.setHours(23, 59, 59, 999)
                setDateRange({ startDate: today, endDate: endOfDay })
              }}
              className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => {
                const end = new Date()
                end.setHours(23, 59, 59, 999)
                const start = new Date()
                start.setDate(start.getDate() - 6)
                start.setHours(0, 0, 0, 0)
                setDateRange({ startDate: start, endDate: end })
              }}
              className="px-3 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              7 jours
            </button>
            <button
              onClick={() => {
                const now = new Date()
                const start = new Date(now.getFullYear(), now.getMonth(), 1)
                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
                setDateRange({ startDate: start, endDate: end })
              }}
              className="px-3 py-2 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
            >
              Ce mois
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commissionnements</h1>
          <p className="text-gray-600 mt-1">
            Gérez les commissions de vos agents et partenaires
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button 
            onClick={() => {
              const csvData = mockCommissions.map(c => ({
                Reference: c.reference,
                Agent: c.agentName,
                Type: c.type,
                Montant: c.amount,
                Statut: c.status,
                Date: c.date
              }))
              const csvContent = "data:text/csv;charset=utf-8," + 
                Object.keys(csvData[0]).join(",") + "\n" +
                csvData.map(row => Object.values(row).join(",")).join("\n")
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement("a")
              link.setAttribute("href", encodedUri)
              link.setAttribute("download", "commissions.csv")
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <Link
            href="/dashboard/contacts/agents/create"
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel agent
          </Link>
        </div>
      </div>

      {/* Statistiques avec drill-down */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Commissions</p>
              <p 
                className="text-3xl font-bold text-blue-900 hover:underline"
                onClick={() => {
                  setStatsType('total')
                  setShowStatsModal(true)
                }}
              >
                {formatCurrency(stats.totalCommissions)}
              </p>
              <p className="text-xs text-blue-500 mt-1">Ce mois</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-blue-500 mt-2 transition-opacity">Cliquez pour détails</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Commissions Payées</p>
              <p 
                className="text-3xl font-bold text-green-900 hover:underline"
                onClick={() => {
                  setStatsType('paid')
                  setShowStatsModal(true)
                }}
              >
                {formatCurrency(stats.paidCommissions)}
              </p>
              <p className="text-xs text-green-500 mt-1">Versées</p>
            </div>
            <div className="p-3 bg-green-600 rounded-xl">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-green-500 mt-2 transition-opacity">Voir paiements</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl shadow-lg border border-orange-200 hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">En Attente</p>
              <p 
                className="text-3xl font-bold text-orange-900 hover:underline"
                onClick={() => {
                  setStatsType('pending')
                  setShowStatsModal(true)
                }}
              >
                {formatCurrency(stats.pendingCommissions)}
              </p>
              <p className="text-xs text-orange-500 mt-1">À verser</p>
            </div>
            <div className="p-3 bg-orange-600 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-orange-500 mt-2 transition-opacity">Voir en attente</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Agents Actifs</p>
              <p 
                className="text-3xl font-bold text-purple-900 hover:underline"
                onClick={() => {
                  setStatsType('agents')
                  setShowStatsModal(true)
                }}
              >
                {stats.activeAgents}
              </p>
              <p className="text-xs text-purple-500 mt-1">Ce mois</p>
            </div>
            <div className="p-3 bg-purple-600 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-purple-500 mt-2 transition-opacity">Voir agents</div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('commissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'commissions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Commissions
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'agents'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Agents
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={activeTab === 'commissions' ? "Rechercher par référence, agent..." : "Rechercher par nom, email, localisation..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {activeTab === 'commissions' ? (
                  <>
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="paid">Payées</option>
                    <option value="cancelled">Annulées</option>
                  </>
                ) : (
                  <>
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Inactifs</option>
                    <option value="suspended">Suspendus</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {activeTab === 'commissions' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
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
                  {filteredCommissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {commission.reference}
                          </div>
                          <div className="text-sm text-gray-500">
                            {commission.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {commission.agentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCommissionTypeColor(commission.type)}`}>
                          {commission.type === 'SHIPMENT' ? 'Transport' :
                           commission.type === 'REFERRAL' ? 'Parrainage' : 'Bonus'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(commission.amount)}
                        </div>
                        {commission.rate > 0 && (
                          <div className="text-xs text-gray-500">
                            {commission.rate}% de {formatCurrency(commission.baseAmount)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commission.status)}`}>
                          {commission.status === 'pending' ? 'En attente' :
                           commission.status === 'paid' ? 'Payée' : 'Annulée'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(commission.date).toLocaleDateString('fr-FR')}
                        </div>
                        {commission.paymentDate && (
                          <div className="text-xs text-green-600">
                            Payée le {new Date(commission.paymentDate).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedCommission(commission)
                              setShowDetailsModal(true)
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            title="Voir détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {commission.status === 'pending' && (
                            <button 
                              onClick={() => {
                                // Marquer comme payée
                                const updatedCommissions = mockCommissions.map(c => 
                                  c.id === commission.id 
                                    ? { ...c, status: 'paid' as const, paymentDate: new Date().toISOString().split('T')[0] }
                                    : c
                                )
                                // Marquer comme payée - logique à implémenter
                                // Ici on mettrait à jour l'état si c'était un state
                              }}
                              className="text-green-600 hover:text-green-700"
                              title="Marquer comme payée"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCommissions.length === 0 && (
                <div className="text-center py-12">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commission trouvée</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Aucune commission ne correspond à vos critères de recherche.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <div key={agent.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {agent.type === 'company' ? (
                          <Building2 className="h-8 w-8 text-gray-400" />
                        ) : (
                          <UserCheck className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{agent.type}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                      {agent.status === 'active' ? 'Actif' :
                       agent.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {agent.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {agent.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {agent.location}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Taux commission</p>
                      <p className="text-sm font-semibold text-gray-900">{agent.commissionRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total gagné</p>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(agent.totalEarned)}</p>
                    </div>
                  </div>

                  {agent.pendingAmount > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-800">
                          {formatCurrency(agent.pendingAmount)} en attente
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Rejoint le {new Date(agent.joinedDate).toLocaleDateString('fr-FR')}</span>
                    <span>Actif le {new Date(agent.lastActivity).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/contacts/agents/${agent.id}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm text-center"
                    >
                      Voir détails
                    </Link>
                    <button className="px-3 py-2 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredAgents.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun agent trouvé</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Aucun agent ne correspond à vos critères de recherche.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/contacts/agents/create"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un agent
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Nouveau Paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Nouveau Paiement Commission</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Sélectionner un agent</option>
                  {mockAgents.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant (FCFA)
                </label>
                <input
                  type="number"
                  placeholder="25000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Méthode de paiement
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="virement">Virement bancaire</option>
                  <option value="especes">Espèces</option>
                  <option value="mobile">Mobile Money</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (optionnel)
                </label>
                <textarea
                  rows={3}
                  placeholder="Paiement commission transport..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('✅ Paiement enregistré avec succès!')
                    setShowPaymentModal(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <CreditCard className="h-4 w-4 mr-2 inline" />
                  Effectuer le paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détails Commission */}
      {showDetailsModal && selectedCommission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Détails de la Commission</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Informations Générales</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Référence:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedCommission.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Agent:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedCommission.agentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCommissionTypeColor(selectedCommission.type)}`}>
                        {selectedCommission.type === 'SHIPMENT' ? 'Transport' :
                         selectedCommission.type === 'REFERRAL' ? 'Parrainage' : 'Bonus'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Statut:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCommission.status)}`}>
                        {selectedCommission.status === 'pending' ? 'En attente' :
                         selectedCommission.status === 'paid' ? 'Payée' : 'Annulée'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Montants</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Montant commission:</span>
                      <span className="text-sm font-bold text-green-600">{formatCurrency(selectedCommission.amount)}</span>
                    </div>
                    {selectedCommission.rate > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Taux:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedCommission.rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Montant de base:</span>
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedCommission.baseAmount)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Devise:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedCommission.currency}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Dates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Date de création:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(selectedCommission.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {selectedCommission.paymentDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date de paiement:</span>
                      <span className="text-sm font-medium text-green-600">
                        {new Date(selectedCommission.paymentDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Description</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedCommission.description}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Fermer
              </button>
              {selectedCommission.status === 'pending' && (
                <button
                  onClick={() => {
                    alert(`✅ Commission ${selectedCommission.reference} marquée comme payée!`)
                    setShowDetailsModal(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2 inline" />
                  Marquer comme payée
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Statistiques */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {statsType === 'total' ? 'Total Commissions' :
                 statsType === 'paid' ? 'Commissions Payées' :
                 statsType === 'pending' ? 'Commissions En Attente' : 'Agents Actifs'}
              </h3>
              <button
                onClick={() => setShowStatsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {statsType === 'total' && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Montant Total</span>
                      <span className="text-lg font-bold text-blue-900">{formatCurrency(stats.totalCommissions)}</span>
                    </div>
                    <div className="text-xs text-blue-600">
                      • Source: Base commissions<br/>
                      • Période: Mois en cours<br/>
                      • Calcul: SUM(amount) FROM commissions
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-sm font-medium text-green-900">Payées</div>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(stats.paidCommissions)}</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <div className="text-sm font-medium text-orange-900">En attente</div>
                      <div className="text-lg font-bold text-orange-600">{formatCurrency(stats.pendingCommissions)}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Dernière MAJ: {new Date().toLocaleString('fr-FR')}
                  </div>
                </>
              )}
              
              {statsType === 'paid' && (
                <>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-900">Commissions Versées</span>
                      <span className="text-lg font-bold text-green-900">{formatCurrency(stats.paidCommissions)}</span>
                    </div>
                    <div className="text-xs text-green-600">
                      • Statut: Versées aux agents<br/>
                      • Nombre de paiements: {mockCommissions.filter(c => c.status === 'paid').length}<br/>
                      • Taux de paiement: {Math.round((stats.paidCommissions/stats.totalCommissions)*100)}%
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>Méthodes:</span>
                      <span>Virement, Espèces</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Délai moyen:</span>
                      <span>3 jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prochains paiements:</span>
                      <span className="font-medium text-orange-600">{formatCurrency(stats.pendingCommissions)}</span>
                    </div>
                  </div>
                </>
              )}
              
              {statsType === 'pending' && (
                <>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-orange-900">En Attente de Paiement</span>
                      <span className="text-lg font-bold text-orange-900">{formatCurrency(stats.pendingCommissions)}</span>
                    </div>
                    <div className="text-xs text-orange-600">
                      • Statut: À verser<br/>
                      • Nombre: {mockCommissions.filter(c => c.status === 'pending').length} commissions<br/>
                      • Agents concernés: {new Set(mockCommissions.filter(c => c.status === 'pending').map(c => c.agentName)).size}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>Délai prévu:</span>
                      <span>2-5 jours</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Validation requise:</span>
                      <span>Oui</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prochaine paie:</span>
                      <span className="font-medium">{new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </>
              )}
              
              {statsType === 'agents' && (
                <>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-900">Agents Actifs</span>
                      <span className="text-lg font-bold text-purple-900">{stats.activeAgents}</span>
                    </div>
                    <div className="text-xs text-purple-600">
                      • Période: Mois en cours<br/>
                      • Critère: Au moins 1 commission<br/>
                      • Performance moyenne: {Math.round(stats.totalCommissions/stats.activeAgents).toLocaleString('fr-FR')} FCFA/agent
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>Top performer:</span>
                      <span className="font-medium">{mockCommissions.reduce((top, c) => c.amount > (top?.amount || 0) ? c : top, mockCommissions[0]).agentName}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Nouveaux agents:</span>
                      <span>2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taux d'activité:</span>
                      <span className="font-medium text-green-600">85%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowStatsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
