'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  RefreshCw, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  CreditCard,
  Calendar,
  User,
  Package,
  MessageSquare
} from 'lucide-react'

interface RefundRequest {
  id: string
  requestNumber: string
  clientName: string
  clientEmail: string
  packageId: string
  packageTrackingNumber: string
  originalAmount: number
  refundAmount: number
  reason: string
  category: 'damaged' | 'lost' | 'delay' | 'cancellation' | 'other'
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requestDate: string
  processedDate?: string
  completedDate?: string
  assignedTo?: string
  notes: string
  attachments: string[]
  refundMethod: 'original_payment' | 'bank_transfer' | 'mobile_money' | 'store_credit'
}

export default function RefundsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RefundRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  // Mock data
  const mockRefundRequests: RefundRequest[] = [
    {
      id: '1',
      requestNumber: 'REF-2024-001',
      clientName: 'Aminata Diallo',
      clientEmail: 'aminata.diallo@email.com',
      packageId: 'PKG-001',
      packageTrackingNumber: 'NMC240001',
      originalAmount: 75000,
      refundAmount: 75000,
      reason: 'Colis endommagé à la livraison',
      category: 'damaged',
      status: 'pending',
      priority: 'high',
      requestDate: '2024-01-15',
      assignedTo: 'Fatou Sall',
      notes: 'Photos des dommages fournies par le client',
      attachments: ['damage_photo_1.jpg', 'damage_photo_2.jpg'],
      refundMethod: 'original_payment'
    },
    {
      id: '2',
      requestNumber: 'REF-2024-002',
      clientName: 'Moussa Keita',
      clientEmail: 'moussa.keita@email.com',
      packageId: 'PKG-002',
      packageTrackingNumber: 'NMC240002',
      originalAmount: 120000,
      refundAmount: 60000,
      reason: 'Livraison en retard de plus de 10 jours',
      category: 'delay',
      status: 'approved',
      priority: 'medium',
      requestDate: '2024-01-14',
      processedDate: '2024-01-16',
      assignedTo: 'Ibrahim Sow',
      notes: 'Remboursement partiel selon politique de retard',
      attachments: [],
      refundMethod: 'mobile_money'
    },
    {
      id: '3',
      requestNumber: 'REF-2024-003',
      clientName: 'Aïcha Ba',
      clientEmail: 'aicha.ba@email.com',
      packageId: 'PKG-003',
      packageTrackingNumber: 'NMC240003',
      originalAmount: 95000,
      refundAmount: 95000,
      reason: 'Colis perdu en transit',
      category: 'lost',
      status: 'completed',
      priority: 'urgent',
      requestDate: '2024-01-10',
      processedDate: '2024-01-12',
      completedDate: '2024-01-15',
      assignedTo: 'Ousmane Diop',
      notes: 'Remboursement intégral effectué',
      attachments: ['investigation_report.pdf'],
      refundMethod: 'bank_transfer'
    },
    {
      id: '4',
      requestNumber: 'REF-2024-004',
      clientName: 'Sekou Touré',
      clientEmail: 'sekou.toure@email.com',
      packageId: 'PKG-004',
      packageTrackingNumber: 'NMC240004',
      originalAmount: 45000,
      refundAmount: 0,
      reason: 'Demande non justifiée',
      category: 'other',
      status: 'rejected',
      priority: 'low',
      requestDate: '2024-01-12',
      processedDate: '2024-01-14',
      assignedTo: 'Fatou Sall',
      notes: 'Colis livré en bon état et dans les délais',
      attachments: ['delivery_proof.jpg'],
      refundMethod: 'original_payment'
    }
  ]

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Simulate loading
    setTimeout(() => {
      setRefundRequests(mockRefundRequests)
      setFilteredRequests(mockRefundRequests)
      setLoading(false)
    }, 1000)
  }, [session, status, router])

  useEffect(() => {
    let filtered = refundRequests

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.packageTrackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(request => request.category === categoryFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => request.priority === priorityFilter)
    }

    setFilteredRequests(filtered)
  }, [searchTerm, statusFilter, categoryFilter, priorityFilter, refundRequests])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'damaged': return <AlertCircle className="h-4 w-4" />
      case 'lost': return <XCircle className="h-4 w-4" />
      case 'delay': return <Clock className="h-4 w-4" />
      case 'cancellation': return <RefreshCw className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const stats = {
    total: refundRequests.length,
    pending: refundRequests.filter(r => r.status === 'pending').length,
    approved: refundRequests.filter(r => r.status === 'approved').length,
    completed: refundRequests.filter(r => r.status === 'completed').length,
    totalAmount: refundRequests.reduce((sum, r) => sum + r.refundAmount, 0),
    avgProcessingTime: '2.5 jours'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <RefreshCw className="h-10 w-10" />
              💰 Gestion des Remboursements
            </h1>
            <p className="text-red-100 text-lg">
              Système complet de traitement des demandes de remboursement
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nouvelle Demande
            </button>
            <button className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Demandes</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">En Attente</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Approuvées</p>
              <p className="text-3xl font-bold text-purple-900">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Complétées</p>
              <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Montant Total</p>
              <p className="text-2xl font-bold text-red-900">{stats.totalAmount.toLocaleString('fr-FR')} FCFA</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">Temps Moyen</p>
              <p className="text-2xl font-bold text-indigo-900">{stats.avgProcessingTime}</p>
            </div>
            <Calendar className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par numéro, client, tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvée</option>
              <option value="processing">En traitement</option>
              <option value="completed">Complétée</option>
              <option value="rejected">Rejetée</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="damaged">Endommagé</option>
              <option value="lost">Perdu</option>
              <option value="delay">Retard</option>
              <option value="cancellation">Annulation</option>
              <option value="other">Autre</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Toutes priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Refund Requests Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Demande</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Colis</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Montant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priorité</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{request.requestNumber}</p>
                      <p className="text-sm text-gray-500">{request.requestDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{request.clientName}</p>
                      <p className="text-sm text-gray-500">{request.clientEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{request.packageTrackingNumber}</p>
                      <p className="text-sm text-gray-500">ID: {request.packageId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{request.refundAmount.toLocaleString('fr-FR')} FCFA</p>
                      <p className="text-sm text-gray-500">sur {request.originalAmount.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(request.category)}
                      <span className="text-sm text-gray-700 capitalize">{request.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowDetails(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Traiter"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Message"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Détails de la demande {selectedRequest.requestNumber}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Informations Client</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nom:</span> {selectedRequest.clientName}</p>
                    <p><span className="font-medium">Email:</span> {selectedRequest.clientEmail}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Informations Colis</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Tracking:</span> {selectedRequest.packageTrackingNumber}</p>
                    <p><span className="font-medium">ID Colis:</span> {selectedRequest.packageId}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Détails du Remboursement</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">Montant Original</p>
                    <p className="text-lg text-gray-900">{selectedRequest.originalAmount.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                  <div>
                    <p className="font-medium">Montant Remboursement</p>
                    <p className="text-lg text-green-600">{selectedRequest.refundAmount.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                  <div>
                    <p className="font-medium">Méthode de Remboursement</p>
                    <p className="text-lg text-gray-900">{selectedRequest.refundMethod}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Raison</h4>
                <p className="text-gray-700">{selectedRequest.reason}</p>
              </div>
              
              {selectedRequest.notes && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Notes</h4>
                  <p className="text-gray-700">{selectedRequest.notes}</p>
                </div>
              )}
              
              {selectedRequest.attachments.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Pièces Jointes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.attachments.map((attachment, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                        {attachment}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
