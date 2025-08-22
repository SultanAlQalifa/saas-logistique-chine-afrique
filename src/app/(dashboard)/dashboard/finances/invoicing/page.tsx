'use client'

import { useState } from 'react'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Download,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calculator,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react'

interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  client: {
    name: string
    email: string
    address: string
  }
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  paymentMethod?: string
  notes?: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Quote {
  id: string
  number: string
  date: string
  validUntil: string
  client: {
    name: string
    email: string
    address: string
  }
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  notes?: string
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: '2024-01-20',
    dueDate: '2024-02-19',
    client: {
      name: 'AfriTrade Solutions',
      email: 'contact@afritrade.com',
      address: 'Dakar, Sénégal'
    },
    items: [
      {
        id: '1',
        description: 'Transport maritime Chine-Dakar (20 pieds)',
        quantity: 1,
        unitPrice: 2500000,
        total: 2500000
      }
    ],
    subtotal: 2500000,
    tax: 450000,
    total: 2950000,
    status: 'PAID',
    paymentMethod: 'Wave'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    date: '2024-01-18',
    dueDate: '2024-02-17',
    client: {
      name: 'Logistics Express',
      email: 'admin@logexpress.ci',
      address: 'Abidjan, Côte d\'Ivoire'
    },
    items: [
      {
        id: '1',
        description: 'Transport aérien express Guangzhou-Abidjan',
        quantity: 2,
        unitPrice: 850000,
        total: 1700000
      },
      {
        id: '2',
        description: 'Assurance marchandise',
        quantity: 1,
        unitPrice: 125000,
        total: 125000
      }
    ],
    subtotal: 1825000,
    tax: 328500,
    total: 2153500,
    status: 'SENT'
  },
  {
    id: '3',
    number: 'INV-2024-003',
    date: '2024-01-15',
    dueDate: '2024-01-25',
    client: {
      name: 'Quick Transport',
      email: 'info@quicktransport.ma',
      address: 'Casablanca, Maroc'
    },
    items: [
      {
        id: '1',
        description: 'Dédouanement et formalités',
        quantity: 1,
        unitPrice: 450000,
        total: 450000
      }
    ],
    subtotal: 450000,
    tax: 81000,
    total: 531000,
    status: 'OVERDUE'
  }
]

const mockQuotes: Quote[] = [
  {
    id: '1',
    number: 'DEV-2024-001',
    date: '2024-01-22',
    validUntil: '2024-02-22',
    client: {
      name: 'Import Export Maghreb',
      email: 'contact@iemagreb.tn',
      address: 'Tunis, Tunisie'
    },
    items: [
      {
        id: '1',
        description: 'Transport maritime Shenzhen-Tunis (40 pieds)',
        quantity: 1,
        unitPrice: 3200000,
        total: 3200000
      }
    ],
    subtotal: 3200000,
    tax: 576000,
    total: 3776000,
    status: 'SENT'
  }
]

export default function InvoicingPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'quotes'>('invoices')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-600 bg-green-100'
      case 'SENT': return 'text-blue-600 bg-blue-100'
      case 'DRAFT': return 'text-gray-600 bg-gray-100'
      case 'OVERDUE': return 'text-red-600 bg-red-100'
      case 'CANCELLED': return 'text-red-600 bg-red-100'
      case 'ACCEPTED': return 'text-green-600 bg-green-100'
      case 'REJECTED': return 'text-red-600 bg-red-100'
      case 'EXPIRED': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="h-4 w-4" />
      case 'SENT': return <Send className="h-4 w-4" />
      case 'DRAFT': return <Edit className="h-4 w-4" />
      case 'OVERDUE': return <AlertCircle className="h-4 w-4" />
      case 'CANCELLED': return <XCircle className="h-4 w-4" />
      case 'ACCEPTED': return <CheckCircle className="h-4 w-4" />
      case 'REJECTED': return <XCircle className="h-4 w-4" />
      case 'EXPIRED': return <Clock className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const filteredQuotes = mockQuotes.filter(quote => {
    const matchesSearch = quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Statistiques
  const invoiceStats = {
    total: mockInvoices.length,
    paid: mockInvoices.filter(i => i.status === 'PAID').length,
    pending: mockInvoices.filter(i => i.status === 'SENT').length,
    overdue: mockInvoices.filter(i => i.status === 'OVERDUE').length,
    totalAmount: mockInvoices.reduce((sum, inv) => sum + inv.total, 0),
    paidAmount: mockInvoices.filter(i => i.status === 'PAID').reduce((sum, inv) => sum + inv.total, 0)
  }

  return (
    <div className="space-y-8">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <FileText className="h-10 w-10" />
                📄 Devis & Facturation
              </h1>
              <p className="text-blue-100 text-lg">
                Gestion complète de vos devis et factures
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Nouveau Document
              </button>
              <button className="bg-white/20 text-white hover:bg-white/30 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200">
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">💰 Factures Payées</p>
              <p className="text-2xl font-bold text-green-900">{invoiceStats.paid}</p>
              <p className="text-green-600 text-sm mt-1">{formatCurrency(invoiceStats.paidAmount)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">📤 En Attente</p>
              <p className="text-2xl font-bold text-blue-900">{invoiceStats.pending}</p>
              <p className="text-blue-600 text-sm mt-1">Factures envoyées</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <Send className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-2xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">⚠️ En Retard</p>
              <p className="text-2xl font-bold text-red-900">{invoiceStats.overdue}</p>
              <p className="text-red-600 text-sm mt-1">Nécessitent relance</p>
            </div>
            <div className="bg-red-500 p-3 rounded-xl">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">💎 CA Total</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(invoiceStats.totalAmount)}</p>
              <p className="text-purple-600 text-sm mt-1">Toutes factures</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'invoices'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Factures ({mockInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'quotes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calculator className="h-4 w-4 inline mr-2" />
          Devis ({mockQuotes.length})
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par numéro ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              {activeTab === 'invoices' ? (
                <>
                  <option value="DRAFT">Brouillon</option>
                  <option value="SENT">Envoyées</option>
                  <option value="PAID">Payées</option>
                  <option value="OVERDUE">En retard</option>
                  <option value="CANCELLED">Annulées</option>
                </>
              ) : (
                <>
                  <option value="DRAFT">Brouillon</option>
                  <option value="SENT">Envoyés</option>
                  <option value="ACCEPTED">Acceptés</option>
                  <option value="REJECTED">Rejetés</option>
                  <option value="EXPIRED">Expirés</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'invoices' ? 'Facture' : 'Devis'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
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
              {activeTab === 'invoices' && filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                      <div className="text-sm text-gray-500">
                        Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.client.name}</div>
                      <div className="text-sm text-gray-500">{invoice.client.address}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1">
                        {invoice.status === 'PAID' ? 'Payée' : 
                         invoice.status === 'SENT' ? 'Envoyée' : 
                         invoice.status === 'DRAFT' ? 'Brouillon' : 
                         invoice.status === 'OVERDUE' ? 'En retard' : 'Annulée'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Download className="h-4 w-4" />
                      </button>
                      {invoice.status === 'DRAFT' && (
                        <button className="text-purple-600 hover:text-purple-900">
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'quotes' && filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quote.number}</div>
                      <div className="text-sm text-gray-500">
                        Valide jusqu'au: {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quote.client.name}</div>
                      <div className="text-sm text-gray-500">{quote.client.address}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(quote.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(quote.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusIcon(quote.status)}
                      <span className="ml-1">
                        {quote.status === 'SENT' ? 'Envoyé' : 
                         quote.status === 'DRAFT' ? 'Brouillon' : 
                         quote.status === 'ACCEPTED' ? 'Accepté' : 
                         quote.status === 'REJECTED' ? 'Rejeté' : 'Expiré'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Download className="h-4 w-4" />
                      </button>
                      {quote.status === 'ACCEPTED' && (
                        <button className="text-purple-600 hover:text-purple-900" title="Convertir en facture">
                          <FileText className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {((activeTab === 'invoices' && filteredInvoices.length === 0) || 
          (activeTab === 'quotes' && filteredQuotes.length === 0)) && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun {activeTab === 'invoices' ? 'facture' : 'devis'} trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer votre premier {activeTab === 'invoices' ? 'facture' : 'devis'}.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer {activeTab === 'invoices' ? 'une facture' : 'un devis'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
