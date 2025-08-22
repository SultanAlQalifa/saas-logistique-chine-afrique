'use client'

import { useState, useEffect } from 'react'
import { InvoiceTransaction } from '@/types/invoice'
import { generateMockInvoice } from '@/utils/invoiceUtils'
import InvoiceGenerator from '@/components/InvoiceGenerator'
import { 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  QrCode,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceTransaction[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceTransaction | null>(null)
  const [showGenerator, setShowGenerator] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  // Mock data
  useEffect(() => {
    const mockInvoices: InvoiceTransaction[] = [
      generateMockInvoice({
        status: 'paid',
        paymentStatus: 'paid',
        totalAmount: 245.50,
        to: { 
          name: 'Marie Kouassi', 
          company: 'Kouassi Import',
          address: '789 Rue du Commerce',
          city: 'Abidjan',
          country: 'Côte d\'Ivoire',
          email: 'marie@kouassi-import.ci'
        }
      }),
      generateMockInvoice({
        status: 'sent',
        paymentStatus: 'pending',
        totalAmount: 180.00,
        transportMode: 'AERIAL',
        to: { 
          name: 'Ahmed Ben Ali', 
          company: 'Atlas Trading',
          address: '321 Avenue Hassan II',
          city: 'Casablanca',
          country: 'Maroc',
          email: 'ahmed@atlas-trading.ma'
        }
      }),
      generateMockInvoice({
        status: 'overdue',
        paymentStatus: 'pending',
        totalAmount: 320.75,
        transportMode: 'MARITIME_EXPRESS',
        to: { 
          name: 'Fatou Diallo', 
          company: 'Diallo Logistics',
          address: '654 Boulevard de l\'Indépendance',
          city: 'Dakar',
          country: 'Sénégal',
          email: 'fatou@diallo-logistics.sn'
        }
      }),
      generateMockInvoice({
        status: 'draft',
        paymentStatus: 'pending',
        totalAmount: 150.00,
        to: { 
          name: 'John Mensah', 
          company: 'Gold Coast Shipping',
          address: '987 Independence Avenue',
          city: 'Accra',
          country: 'Ghana',
          email: 'john@goldcoast.gh'
        }
      })
    ]

    setInvoices(mockInvoices)
    setLoading(false)
  }, [])

  // Filtrage des factures
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.to.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.to.company?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    
    const matchesDate = dateFilter === 'all' || (() => {
      const now = new Date()
      const invoiceDate = new Date(invoice.date)
      switch (dateFilter) {
        case 'today':
          return invoiceDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return invoiceDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return invoiceDate >= monthAgo
        default:
          return true
      }
    })()

    return matchesSearch && matchesStatus && matchesDate
  })

  // Statistiques
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'sent').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'sent': return <Clock className="h-4 w-4 text-blue-600" />
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'draft': return <Edit className="h-4 w-4 text-gray-600" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-gray-600" />
      default: return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200'
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée'
      case 'sent': return 'Envoyée'
      case 'overdue': return 'En retard'
      case 'draft': return 'Brouillon'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  const handleCreateInvoice = () => {
    const newInvoice = generateMockInvoice({
      status: 'draft',
      to: {
        name: 'Nouveau Client',
        company: '',
        address: '',
        city: '',
        country: '',
        email: ''
      }
    })
    setSelectedInvoice(newInvoice)
    setShowGenerator(true)
  }

  const handleViewInvoice = (invoice: InvoiceTransaction) => {
    setSelectedInvoice(invoice)
    setShowGenerator(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  if (showGenerator && selectedInvoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowGenerator(false)}
            className="flex items-center text-secondary-600 hover:text-secondary-900"
          >
            ← Retour aux factures
          </button>
        </div>
        <InvoiceGenerator 
          invoice={selectedInvoice}
          onGenerate={(invoice) => {
            console.log('Facture générée:', invoice.invoiceNumber)
            setShowGenerator(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Factures</h1>
          <p className="text-secondary-600 mt-1">
            Gérez vos factures avec QR codes transactionnels
          </p>
        </div>
        <button
          onClick={handleCreateInvoice}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Total Factures</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Montant Total</p>
              <p className="text-2xl font-bold text-secondary-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Payées</p>
              <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">En Retard</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg border border-secondary-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="N° facture, client..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Statut
            </label>
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
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Période
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="flex items-center px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </button>
          </div>
        </div>
      </div>

      {/* Liste des factures */}
      <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Facture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Transport
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  QR Code
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-secondary-500">
                    Aucune facture trouvée
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">
                          {invoice.invoiceNumber}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {formatDate(invoice.date)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">
                          {invoice.to.name}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {invoice.to.company}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {invoice.to.city}, {invoice.to.country}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">
                        {invoice.transportMode.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {invoice.origin} → {invoice.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">
                        {formatCurrency(invoice.totalAmount)}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {invoice.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1">{getStatusLabel(invoice.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {invoice.qrCodeData ? (
                        <div className="flex items-center justify-center">
                          <QrCode className="h-5 w-5 text-green-600" />
                          <span className="ml-1 text-xs text-green-600">Inclus</span>
                        </div>
                      ) : (
                        <span className="text-xs text-secondary-400">Non généré</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Voir la facture"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-secondary-600 hover:text-secondary-900"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info QR Code */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <QrCode className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">QR Codes Transactionnels</h3>
            <p className="text-sm text-blue-700 mb-3">
              Chaque facture générée inclut un QR code unique contenant :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600">
              <div>
                <h4 className="font-medium mb-1">Informations de base :</h4>
                <ul className="space-y-1">
                  <li>• Numéro et montant de la facture</li>
                  <li>• Date d'émission et d'échéance</li>
                  <li>• Informations client et fournisseur</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Détails avancés :</h4>
                <ul className="space-y-1">
                  <li>• Articles et services détaillés</li>
                  <li>• Informations de transport</li>
                  <li>• Statut de paiement et méthode</li>
                  <li>• Hash de vérification d'authenticité</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
