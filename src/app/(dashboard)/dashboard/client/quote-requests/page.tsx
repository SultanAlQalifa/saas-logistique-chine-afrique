'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Calendar,
  Package,
  DollarSign,
  Filter,
  Search,
  Download
} from 'lucide-react'

interface QuoteRequest {
  id: string
  requestNumber: string
  description: string
  status: 'PENDING' | 'REVIEWED' | 'QUOTED' | 'ACCEPTED' | 'REJECTED'
  createdAt: Date
  estimatedPrice?: number
  transportMode: string
  weight: number
  urgency: string
  senderName: string
  receiverName: string
  receiverAddress: string
}

export default function QuoteRequestsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data pour les demandes de devis
    const mockRequests: QuoteRequest[] = [
      {
        id: '1',
        requestNumber: 'DQ-2024-001',
        description: 'Électroniques - Smartphones et accessoires',
        status: 'QUOTED',
        createdAt: new Date('2024-01-15'),
        estimatedPrice: 125000,
        transportMode: 'AERIAL',
        weight: 5.2,
        urgency: 'EXPRESS',
        senderName: 'Jean Dupont',
        receiverName: 'Li Wei',
        receiverAddress: 'Guangzhou, Chine'
      },
      {
        id: '2',
        requestNumber: 'DQ-2024-002',
        description: 'Textiles - Vêtements traditionnels',
        status: 'PENDING',
        createdAt: new Date('2024-01-18'),
        transportMode: 'MARITIME',
        weight: 15.8,
        urgency: 'STANDARD',
        senderName: 'Marie Sow',
        receiverName: 'Chen Ming',
        receiverAddress: 'Shanghai, Chine'
      },
      {
        id: '3',
        requestNumber: 'DQ-2024-003',
        description: 'Produits cosmétiques et soins',
        status: 'ACCEPTED',
        createdAt: new Date('2024-01-20'),
        estimatedPrice: 85000,
        transportMode: 'MARITIME_EXPRESS',
        weight: 8.5,
        urgency: 'STANDARD',
        senderName: 'Fatou Diallo',
        receiverName: 'Wang Xiu',
        receiverAddress: 'Beijing, Chine'
      }
    ]
    
    setRequests(mockRequests)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'REVIEWED': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'QUOTED': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'REVIEWED': return <Eye className="h-4 w-4" />
      case 'QUOTED': return <FileText className="h-4 w-4" />
      case 'ACCEPTED': return <CheckCircle className="h-4 w-4" />
      case 'REJECTED': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente'
      case 'REVIEWED': return 'Examinée'
      case 'QUOTED': return 'Devis envoyé'
      case 'ACCEPTED': return 'Acceptée'
      case 'REJECTED': return 'Rejetée'
      default: return status
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'ALL' || request.status === filter
    const matchesSearch = request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    quoted: requests.filter(r => r.status === 'QUOTED').length,
    accepted: requests.filter(r => r.status === 'ACCEPTED').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">📋 Mes Demandes de Devis</h1>
            <p className="text-green-100 text-lg">Suivez l'état de vos demandes de devis en temps réel</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/client/new-quote')}
            className="bg-white text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Nouvelle Demande
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl shadow-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">En attente</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Devis reçus</p>
              <p className="text-2xl font-bold text-purple-900">{stats.quoted}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Acceptées</p>
              <p className="text-2xl font-bold text-green-900">{stats.accepted}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="REVIEWED">Examinées</option>
                <option value="QUOTED">Devis reçus</option>
                <option value="ACCEPTED">Acceptées</option>
                <option value="REJECTED">Rejetées</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher par description ou numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Liste des Demandes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-500 mb-6">
              {requests.length === 0 
                ? "Vous n'avez pas encore créé de demande de devis."
                : "Aucune demande ne correspond à vos critères de recherche."
              }
            </p>
            <button
              onClick={() => router.push('/dashboard/client/new-quote')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Créer une demande
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix estimé
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
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.requestNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.weight} kg
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {request.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.senderName} → {request.receiverName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.transportMode === 'AERIAL' && '✈️ Aérien'}
                        {request.transportMode === 'MARITIME' && '🚢 Maritime'}
                        {request.transportMode === 'MARITIME_EXPRESS' && '🚢 Maritime Express'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.urgency === 'URGENT' && '🔴 Urgent'}
                        {request.urgency === 'EXPRESS' && '🟡 Express'}
                        {request.urgency === 'STANDARD' && '🟢 Standard'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.estimatedPrice ? (
                        <div className="text-sm font-medium text-green-600">
                          {request.estimatedPrice.toLocaleString('fr-FR')} FCFA
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">En attente</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {request.createdAt.toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Détails de la demande ${request.requestNumber}`)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {request.status === 'QUOTED' && (
                          <button
                            onClick={() => alert(`Accepter le devis de ${request.estimatedPrice?.toLocaleString('fr-FR')} FCFA ?`)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Accepter le devis"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => alert('Téléchargement du PDF...')}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                          title="Télécharger PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
