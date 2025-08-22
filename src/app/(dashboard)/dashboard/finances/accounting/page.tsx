'use client'

import { useState } from 'react'
import DateFilter, { DateRange } from '@/components/ui/date-filter'
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  FileText,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  Plus,
  Eye,
  Filter,
  Search,
  X
} from 'lucide-react'

interface AccountingEntry {
  id: string
  date: string
  reference: string
  description: string
  debit: number
  credit: number
  account: string
  category: 'REVENUE' | 'EXPENSE' | 'ASSET' | 'LIABILITY'
  status: 'VALIDATED' | 'PENDING' | 'DRAFT'
}

interface FinancialSummary {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  totalAssets: number
  totalLiabilities: number
  cashFlow: number
}

// Mock data
const mockEntries: AccountingEntry[] = [
  {
    id: '1',
    date: '2024-01-20',
    reference: 'JE-2024-001',
    description: 'Vente de services logistiques - Facture INV-001',
    debit: 0,
    credit: 2500000,
    account: '701 - Ventes de services',
    category: 'REVENUE',
    status: 'VALIDATED'
  },
  {
    id: '2',
    date: '2024-01-20',
    reference: 'JE-2024-002',
    description: 'Salaires du personnel - Janvier 2024',
    debit: 850000,
    credit: 0,
    account: '641 - Rémunérations du personnel',
    category: 'EXPENSE',
    status: 'VALIDATED'
  },
  {
    id: '3',
    date: '2024-01-19',
    reference: 'JE-2024-003',
    description: 'Achat équipement bureau',
    debit: 450000,
    credit: 0,
    account: '215 - Installations techniques',
    category: 'ASSET',
    status: 'VALIDATED'
  },
  {
    id: '4',
    date: '2024-01-18',
    reference: 'JE-2024-004',
    description: 'Emprunt bancaire - Capital',
    debit: 0,
    credit: 5000000,
    account: '164 - Emprunts auprès établissements crédit',
    category: 'LIABILITY',
    status: 'PENDING'
  }
]

const mockSummary: FinancialSummary = {
  totalRevenue: 12500000,
  totalExpenses: 8750000,
  netProfit: 3750000,
  totalAssets: 25000000,
  totalLiabilities: 15000000,
  cashFlow: 2100000
}

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'journal' | 'reports'>('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState('month')
  const [dateFilterRange, setDateFilterRange] = useState<DateRange>({ startDate: null, endDate: null })
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null)
  const [showModal, setShowModal] = useState<{title: string, content: string} | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'REVENUE': return 'text-green-600 bg-green-50'
      case 'EXPENSE': return 'text-red-600 bg-red-50'
      case 'ASSET': return 'text-blue-600 bg-blue-50'
      case 'LIABILITY': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALIDATED': return 'text-green-600 bg-green-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'DRAFT': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredEntries = mockEntries.filter(entry => {
    const matchesSearch = entry.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.account.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Calculator className="h-10 w-10" />
                💰 Comptabilité & Finances
              </h1>
              <p className="text-emerald-100 text-lg">
                Gestion comptable complète pour votre entreprise
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setNotification({
                    message: '🆕 Fonctionnalité "Nouvelle Écriture" - Formulaire de saisie comptable ouvert',
                    type: 'info'
                  })
                  setTimeout(() => setNotification(null), 4000)
                  // TODO: Ouvrir modal de création d'écriture
                }}
                className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Nouvelle Écriture
              </button>
              <button 
                onClick={() => {
                  // Générer et télécharger CSV des données comptables
                  const csvData = [
                    ['Date', 'Référence', 'Description', 'Compte', 'Débit', 'Crédit', 'Statut'],
                    ...filteredEntries.map(entry => [
                      new Date(entry.date).toLocaleDateString('fr-FR'),
                      entry.reference,
                      entry.description,
                      entry.account,
                      entry.debit > 0 ? entry.debit.toString() : '0',
                      entry.credit > 0 ? entry.credit.toString() : '0',
                      entry.status
                    ])
                  ]
                  const csvContent = csvData.map(row => row.join(',')).join('\n')
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                  const link = document.createElement('a')
                  link.href = URL.createObjectURL(blob)
                  link.download = `ecritures-comptables-${new Date().toISOString().split('T')[0]}.csv`
                  link.click()
                  setNotification({
                    message: `✅ Export CSV généré avec succès! ${filteredEntries.length} écritures exportées`,
                    type: 'success'
                  })
                  setTimeout(() => setNotification(null), 4000)
                }}
                className="bg-white/20 text-white hover:bg-white/30 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200"
              >
                <Download className="h-5 w-5" />
                Exporter
              </button>
            </div>
          </div>
        </div>
        
        {/* Éléments décoratifs */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <PieChart className="h-4 w-4 inline mr-2" />
          Tableau de Bord
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'journal'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Journal des Écritures
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'reports'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Rapports
        </button>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* KPIs Financiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">💰 Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(mockSummary.totalRevenue)}</p>
                  <p className="text-green-600 text-sm mt-1">+12.5% ce mois</p>
                </div>
                <div className="bg-green-500 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl p-6 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">📉 Charges</p>
                  <p className="text-2xl font-bold text-red-900">{formatCurrency(mockSummary.totalExpenses)}</p>
                  <p className="text-red-600 text-sm mt-1">+5.2% ce mois</p>
                </div>
                <div className="bg-red-500 p-3 rounded-xl">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">💎 Bénéfice Net</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(mockSummary.netProfit)}</p>
                  <p className="text-blue-600 text-sm mt-1">+18.7% ce mois</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">🏢 Actifs Totaux</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(mockSummary.totalAssets)}</p>
                  <p className="text-purple-600 text-sm mt-1">+8.3% ce mois</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">⚖️ Passifs</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(mockSummary.totalLiabilities)}</p>
                  <p className="text-orange-600 text-sm mt-1">+3.1% ce mois</p>
                </div>
                <div className="bg-orange-500 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-6 border border-teal-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-600 text-sm font-medium">💧 Trésorerie</p>
                  <p className="text-2xl font-bold text-teal-900">{formatCurrency(mockSummary.cashFlow)}</p>
                  <p className="text-teal-600 text-sm mt-1">+15.4% ce mois</p>
                </div>
                <div className="bg-teal-500 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques et analyses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Évolution Mensuelle</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <p className="text-gray-500">Graphique des revenus/charges par mois</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🥧 Répartition des Charges</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <p className="text-gray-500">Graphique en secteurs des charges</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'journal' && (
        <div className="space-y-6">
          {/* Filtres et recherche */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher par référence, description ou compte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="VALIDATED">Validées</option>
                  <option value="PENDING">En attente</option>
                  <option value="DRAFT">Brouillon</option>
                </select>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
            </div>
          </div>

          {/* Journal des écritures */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                📅 Filtrer par période
              </h3>
              {(dateFilterRange.startDate || dateFilterRange.endDate) && (
                <button
                  onClick={() => setDateFilterRange({ startDate: null, endDate: null })}
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
                  value={dateFilterRange}
                  onChange={setDateFilterRange}
                  placeholder="Sélectionner une période"
                  className="w-full"
                />
              </div>
              <div className="text-sm text-gray-600">
                {dateFilterRange.startDate || dateFilterRange.endDate ? (
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <p className="font-medium text-emerald-800">Période active:</p>
                    <p className="text-emerald-700">
                      {dateFilterRange.startDate && dateFilterRange.endDate
                        ? `Du ${dateFilterRange.startDate.toLocaleDateString('fr-FR')} au ${dateFilterRange.endDate.toLocaleDateString('fr-FR')}`
                        : dateFilterRange.startDate
                        ? `À partir du ${dateFilterRange.startDate.toLocaleDateString('fr-FR')}`
                        : `Jusqu'au ${dateFilterRange.endDate?.toLocaleDateString('fr-FR')}`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-gray-600">Aucun filtre de date appliqué</p>
                    <p className="text-xs text-gray-500">Toutes les écritures sont affichées</p>
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
                    setDateFilterRange({ startDate: today, endDate: endOfDay })
                  }}
                  className="px-3 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
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
                    setDateFilterRange({ startDate: start, endDate: end })
                  }}
                  className="px-3 py-2 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                >
                  7 jours
                </button>
                <button
                  onClick={() => {
                    const now = new Date()
                    const start = new Date(now.getFullYear(), now.getMonth(), 1)
                    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
                    setDateFilterRange({ startDate: start, endDate: end })
                  }}
                  className="px-3 py-2 text-sm bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors"
                >
                  Ce mois
                </button>
              </div>
            </div>
          </div>

          {/* Tableau des écritures */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Référence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compte
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Débit
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crédit
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(entry.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm text-gray-500">{entry.reference}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {entry.description}
                        </div>
                        <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(entry.category)}`}>
                          {entry.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.account}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-600">
                        {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                        {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                          {entry.status === 'VALIDATED' ? 'Validée' : 
                           entry.status === 'PENDING' ? 'En attente' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button 
                          onClick={() => {
                            setShowModal({
                              title: `👁️ Détails de l'écriture ${entry.reference}`,
                              content: `Date: ${new Date(entry.date).toLocaleDateString('fr-FR')}\n\nDescription: ${entry.description}\n\nCompte: ${entry.account}\n\nDébit: ${entry.debit > 0 ? formatCurrency(entry.debit) : 'Aucun'}\n\nCrédit: ${entry.credit > 0 ? formatCurrency(entry.credit) : 'Aucun'}\n\nStatut: ${entry.status === 'VALIDATED' ? 'Validée' : entry.status === 'PENDING' ? 'En attente' : 'Brouillon'}\n\nCatégorie: ${entry.category}`
                            })
                          }}
                          className="text-emerald-600 hover:text-emerald-900 mr-3"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`📄 Voulez-vous modifier l'écriture ${entry.reference} ?`)) {
                              setNotification({
                                message: `🔧 Ouverture du formulaire de modification pour ${entry.reference}`,
                                type: 'info'
                              })
                              setTimeout(() => setNotification(null), 4000)
                              // TODO: Ouvrir modal de modification
                            }
                          }}
                          className="text-gray-600 hover:text-gray-900"
                          title="Modifier l'écriture"
                        >
                          <FileText className="h-4 w-4" />
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

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">📊 Bilan Comptable</h3>
                <PieChart className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Situation patrimoniale de l'entreprise
              </p>
              <button 
                onClick={() => {
                  setShowModal({
                    title: '📊 Bilan Comptable Généré',
                    content: `• Actifs Totaux: ${formatCurrency(mockSummary.totalAssets)}\n\n• Passifs Totaux: ${formatCurrency(mockSummary.totalLiabilities)}\n\n• Capitaux Propres: ${formatCurrency(mockSummary.totalAssets - mockSummary.totalLiabilities)}\n\n• Ratio d'endettement: ${((mockSummary.totalLiabilities / mockSummary.totalAssets) * 100).toFixed(1)}%\n\n✅ Bilan généré avec succès!`
                  })
                }}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Générer le Bilan
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">📈 Compte de Résultat</h3>
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Performance financière de l'exercice
              </p>
              <button 
                onClick={() => {
                  setShowModal({
                    title: '📈 Compte de Résultat Généré',
                    content: `• Chiffre d'Affaires: ${formatCurrency(mockSummary.totalRevenue)}\n\n• Charges Totales: ${formatCurrency(mockSummary.totalExpenses)}\n\n• Résultat Net: ${formatCurrency(mockSummary.netProfit)}\n\n• Marge Nette: ${((mockSummary.netProfit / mockSummary.totalRevenue) * 100).toFixed(1)}%\n\n• Rentabilité: ${mockSummary.netProfit > 0 ? 'Profitable' : 'Déficitaire'}\n\n✅ Compte de résultat généré avec succès!`
                  })
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Générer le Résultat
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">💧 Tableau de Trésorerie</h3>
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Flux de trésorerie et liquidités
              </p>
              <button 
                onClick={() => {
                  setShowModal({
                    title: '💧 Tableau de Trésorerie Généré',
                    content: `• Trésorerie Actuelle: ${formatCurrency(mockSummary.cashFlow)}\n\n• Flux d'Exploitation: +${formatCurrency(mockSummary.netProfit * 0.8)}\n\n• Flux d'Investissement: -${formatCurrency(450000)}\n\n• Flux de Financement: +${formatCurrency(5000000)}\n\n• Variation de Trésorerie: +${formatCurrency((mockSummary.netProfit * 0.8) - 450000 + 5000000)}\n\n✅ Tableau de trésorerie généré avec succès!`
                  })
                }}
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Générer Trésorerie
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        } animate-slide-in-right`}>
          <div className="flex items-center gap-2">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{showModal.title}</h3>
              <button 
                onClick={() => setShowModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
              {showModal.content}
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowModal(null)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
