'use client'

import { useState } from 'react'
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Download,
  Send,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Building2
} from 'lucide-react'
import Link from 'next/link'

interface Invoice {
  id: string
  number: string
  client: string
  clientType: 'individual' | 'company'
  amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  createdDate: string
  description: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    client: 'Kouassi Jean-Baptiste',
    clientType: 'individual',
    amount: 125000,
    currency: 'XOF',
    status: 'sent',
    dueDate: '2024-02-15',
    createdDate: '2024-01-15',
    description: 'Transport colis CO-2024-001',
    items: [
      { description: 'Transport aérien (2.5kg)', quantity: 1, unitPrice: 125000, total: 125000 }
    ]
  },
  {
    id: '2',
    number: 'INV-2024-002',
    client: 'AfriTrade Solutions',
    clientType: 'company',
    amount: 450000,
    currency: 'XOF',
    status: 'paid',
    dueDate: '2024-02-10',
    createdDate: '2024-01-10',
    description: 'Transport cargo CG-2024-005',
    items: [
      { description: 'Transport maritime (15 CBM)', quantity: 1, unitPrice: 450000, total: 450000 }
    ]
  },
  {
    id: '3',
    number: 'INV-2024-003',
    client: 'Logistics Express',
    clientType: 'company',
    amount: 85000,
    currency: 'XOF',
    status: 'overdue',
    dueDate: '2024-01-25',
    createdDate: '2024-01-05',
    description: 'Transport express CO-2024-015',
    items: [
      { description: 'Transport aérien express (1.2kg)', quantity: 1, unitPrice: 85000, total: 85000 }
    ]
  },
  {
    id: '4',
    number: 'INV-2024-004',
    client: 'Marie Diallo Enterprise',
    clientType: 'company',
    amount: 275000,
    currency: 'XOF',
    status: 'draft',
    dueDate: '2024-02-20',
    createdDate: '2024-01-20',
    description: 'Transport multiple colis',
    items: [
      { description: 'Transport aérien (3.8kg)', quantity: 2, unitPrice: 137500, total: 275000 }
    ]
  }
]

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])

  // Filtrage des factures
  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Statistiques
  const stats = {
    total: mockInvoices.length,
    draft: mockInvoices.filter(i => i.status === 'draft').length,
    sent: mockInvoices.filter(i => i.status === 'sent').length,
    paid: mockInvoices.filter(i => i.status === 'paid').length,
    overdue: mockInvoices.filter(i => i.status === 'overdue').length,
    totalAmount: mockInvoices.reduce((sum, i) => sum + i.amount, 0),
    paidAmount: mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    pendingAmount: mockInvoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} FCFA`
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Brouillon' }
      case 'sent':
        return { color: 'bg-blue-100 text-blue-800', icon: Send, label: 'Envoyée' }
      case 'paid':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Payée' }
      case 'overdue':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'En retard' }
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Annulée' }
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Inconnu' }
    }
  }

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    )
  }

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(filteredInvoices.map(i => i.id))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">💰 Facturation</h1>
            <p className="text-blue-100">Gérez vos factures et paiements en toute simplicité</p>
          </div>
          <Link
            href="/dashboard/finances/billing/create"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Nouvelle Facture
          </Link>
        </div>
      </div>

      {/* Statistiques améliorées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-600 rounded-lg">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-700">Total Factures</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-xs text-blue-600">Ce mois</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-600 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-700">Montant Total</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalAmount)}</p>
              <p className="text-xs text-green-600">Toutes factures</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl shadow-lg border border-emerald-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-emerald-600 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-emerald-700">Payé</p>
              <p className="text-2xl font-bold text-emerald-900">{formatCurrency(stats.paidAmount)}</p>
              <p className="text-xs text-emerald-600">Encaissé</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-orange-600 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-700">En Attente</p>
              <p className="text-2xl font-bold text-orange-900">{formatCurrency(stats.pendingAmount)}</p>
              <p className="text-xs text-orange-600">À encaisser</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg border border-secondary-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par numéro, client ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtre par statut */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillons</option>
              <option value="sent">Envoyées</option>
              <option value="paid">Payées</option>
              <option value="overdue">En retard</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des factures */}
      <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">
              Factures ({filteredInvoices.length})
            </h3>
            {selectedInvoices.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-secondary-600">
                  {selectedInvoices.length} sélectionnée(s)
                </span>
                <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700">
                  Actions groupées
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Facture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Échéance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredInvoices.map((invoice) => {
                const statusConfig = getStatusConfig(invoice.status)
                const StatusIcon = statusConfig.icon
                const isOverdue = invoice.status === 'overdue'
                
                return (
                  <tr key={invoice.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => handleSelectInvoice(invoice.id)}
                        className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">
                          {invoice.number}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {invoice.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {invoice.clientType === 'company' ? (
                          <Building2 className="h-4 w-4 mr-2 text-secondary-400" />
                        ) : (
                          <User className="h-4 w-4 mr-2 text-secondary-400" />
                        )}
                        <span className="text-sm text-secondary-900">{invoice.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="h-4 w-4 mr-2" />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-secondary-400" />
                        <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                          {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-secondary-400 hover:text-secondary-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-secondary-400 hover:text-secondary-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-secondary-400 hover:text-secondary-600">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-sm font-medium text-secondary-900">Aucune facture trouvée</h3>
            <p className="mt-1 text-sm text-secondary-500">
              Aucune facture ne correspond à vos critères de recherche.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/finances/billing/create"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer une facture
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
