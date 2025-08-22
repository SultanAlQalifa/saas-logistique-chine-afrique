'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  Package, 
  Search, 
  Eye, 
  MapPin, 
  Clock, 
  User, 
  Send,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Filter,
  X,
  Plus
} from 'lucide-react'

interface QuoteRequest {
  id: string
  clientName: string
  clientEmail: string
  description: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
    cbm: number
  }
  origin: string
  destination: string
  transportMode: 'AERIAL' | 'MARITIME' | 'AERIAL_EXPRESS' | 'MARITIME_EXPRESS'
  status: 'published' | 'quoted' | 'accepted' | 'expired'
  createdAt: Date
  expiresAt: Date
  urgency: 'low' | 'medium' | 'high'
  estimatedValue?: number
  notes?: string
  companyQuote?: {
    price: number
    deliveryTime: string
    conditions: string
    quotedAt: Date
  }
}

// Données de test - simulent les demandes de devis des clients
const mockQuoteRequests: QuoteRequest[] = [
  {
    id: 'req-001',
    clientName: 'Marie Kouassi',
    clientEmail: 'marie.kouassi@example.com',
    description: 'Équipements électroniques - Smartphones et accessoires',
    weight: 15.5,
    origin: 'Shenzhen, Chine',
    destination: 'Abidjan, Côte d\'Ivoire',
    transportMode: 'AERIAL',
    status: 'published',
    createdAt: new Date('2024-02-10'),
    expiresAt: new Date('2024-02-17'),
    urgency: 'high',
    estimatedValue: 2500000,
    notes: 'Produits fragiles, emballage renforcé requis'
  },
  {
    id: 'req-002',
    clientName: 'Ibrahim Diallo',
    clientEmail: 'ibrahim.diallo@example.com',
    description: 'Machines industrielles - Équipement textile',
    dimensions: {
      length: 200,
      width: 150,
      height: 180,
      cbm: 5.4
    },
    origin: 'Guangzhou, Chine',
    destination: 'Dakar, Sénégal',
    transportMode: 'MARITIME',
    status: 'published',
    createdAt: new Date('2024-02-09'),
    expiresAt: new Date('2024-02-16'),
    urgency: 'medium',
    estimatedValue: 8500000,
    notes: 'Livraison urgente pour projet en cours'
  },
  {
    id: 'req-003',
    clientName: 'Fatou Traoré',
    clientEmail: 'fatou.traore@example.com',
    description: 'Textiles et vêtements - Collection mode',
    weight: 45.0,
    origin: 'Shanghai, Chine',
    destination: 'Bamako, Mali',
    transportMode: 'AERIAL_EXPRESS',
    status: 'quoted',
    createdAt: new Date('2024-02-08'),
    expiresAt: new Date('2024-02-15'),
    urgency: 'high',
    estimatedValue: 1200000,
    companyQuote: {
      price: 450000,
      deliveryTime: '3-5 jours',
      conditions: 'Assurance incluse, suivi en temps réel',
      quotedAt: new Date('2024-02-09')
    }
  }
]

export default function QuoteRequestsPage() {
  const { data: session, status } = useSession()
  const [requests, setRequests] = useState<QuoteRequest[]>(mockQuoteRequests)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all')
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [quoteForm, setQuoteForm] = useState({
    price: '',
    deliveryTime: '',
    conditions: ''
  })

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-64">Chargement...</div>
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'CLIENT')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Restreint</h2>
          <p className="text-gray-600">Cette page est réservée aux utilisateurs connectés.</p>
        </div>
      </div>
    )
  }

  // Vue différente selon le rôle
  const isSuperAdmin = session.user.role === 'SUPER_ADMIN'
  const isClient = session.user.role === 'CLIENT'

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.destination.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter
    const matchesUrgency = urgencyFilter === 'all' || req.urgency === urgencyFilter
    
    return matchesSearch && matchesStatus && matchesUrgency
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-blue-100 text-blue-800'
      case 'quoted': return 'bg-green-100 text-green-800'
      case 'accepted': return 'bg-purple-100 text-purple-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Nouvelle'
      case 'quoted': return 'Devis envoyé'
      case 'accepted': return 'Acceptée'
      case 'expired': return 'Expirée'
      default: return 'Inconnue'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Urgent'
      case 'medium': return 'Moyen'
      case 'low': return 'Faible'
      default: return 'Normal'
    }
  }

  const getTransportModeLabel = (mode: string) => {
    switch (mode) {
      case 'AERIAL': return '✈️ Aérien'
      case 'AERIAL_EXPRESS': return '✈️ Aérien Express'
      case 'MARITIME': return '🚢 Maritime'
      case 'MARITIME_EXPRESS': return '🚢 Maritime Express'
      default: return mode
    }
  }

  const submitQuote = () => {
    if (!selectedRequest || !quoteForm.price || !quoteForm.deliveryTime) return

    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: 'quoted' as const,
          companyQuote: {
            price: parseFloat(quoteForm.price),
            deliveryTime: quoteForm.deliveryTime,
            conditions: quoteForm.conditions || 'Conditions standards',
            quotedAt: new Date()
          }
        }
      }
      return req
    })

    setRequests(updatedRequests)
    setShowQuoteModal(false)
    setSelectedRequest(null)
    setQuoteForm({ price: '', deliveryTime: '', conditions: '' })
  }

  const openQuoteModal = (request: QuoteRequest) => {
    setSelectedRequest(request)
    setShowQuoteModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Send className="h-8 w-8" />
              📋 Demandes de Devis Clients
            </h1>
            <p className="text-purple-100 text-lg">
              Consultez et répondez aux demandes de transport de vos clients
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{filteredRequests.length}</div>
            <div className="text-purple-200 text-sm">Demandes actives</div>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nouvelles</p>
              <p className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status === 'published').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Devis envoyés</p>
              <p className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'quoted').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgentes</p>
              <p className="text-2xl font-bold text-red-600">
                {requests.filter(r => r.urgency === 'high').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valeur totale</p>
              <p className="text-2xl font-bold text-purple-600">
                {(requests.reduce((sum, r) => sum + (r.estimatedValue || 0), 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Nouvelles</option>
            <option value="quoted">Devis envoyés</option>
            <option value="accepted">Acceptées</option>
            <option value="expired">Expirées</option>
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Toutes urgences</option>
            <option value="high">Urgent</option>
            <option value="medium">Moyen</option>
            <option value="low">Faible</option>
          </select>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            {filteredRequests.length} résultat(s)
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Demandes de Devis</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {request.clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{request.clientName}</h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                          {getUrgencyLabel(request.urgency)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.origin} → {request.destination}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {getTransportModeLabel(request.transportMode)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Expire le {request.expiresAt.toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.weight && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Poids:</strong> {request.weight} kg
                    </div>
                  )}

                  {request.dimensions && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Dimensions:</strong> {request.dimensions.length}×{request.dimensions.width}×{request.dimensions.height} cm ({request.dimensions.cbm} m³)
                    </div>
                  )}

                  {request.estimatedValue && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Valeur estimée:</strong> {request.estimatedValue.toLocaleString('fr-FR')} FCFA
                    </div>
                  )}

                  {request.notes && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Notes:</strong> {request.notes}
                    </div>
                  )}

                  {request.companyQuote && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm font-medium text-green-900 mb-1">Votre devis:</div>
                      <div className="text-sm text-green-700">
                        <strong>{request.companyQuote.price.toLocaleString('fr-FR')} FCFA</strong> - {request.companyQuote.deliveryTime}
                      </div>
                      <div className="text-xs text-green-600 mt-1">{request.companyQuote.conditions}</div>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Détails
                  </button>
                  
                  {request.status === 'published' && (
                    <button
                      onClick={() => openQuoteModal(request)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <DollarSign className="h-4 w-4" />
                      Faire un devis
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de détails */}
      {selectedRequest && !showQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Détails de la Demande</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">👤 Informations Client</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Nom:</span>
                      <div className="font-semibold">{selectedRequest.clientName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <div className="font-semibold">{selectedRequest.clientEmail}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">📦 Détails du Colis</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-700">Description:</span>
                      <div className="font-medium">{selectedRequest.description}</div>
                    </div>
                    {selectedRequest.weight && (
                      <div>
                        <span className="text-blue-700">Poids:</span>
                        <div className="font-medium">{selectedRequest.weight} kg</div>
                      </div>
                    )}
                    {selectedRequest.dimensions && (
                      <div>
                        <span className="text-blue-700">Dimensions:</span>
                        <div className="font-medium">
                          {selectedRequest.dimensions.length}×{selectedRequest.dimensions.width}×{selectedRequest.dimensions.height} cm 
                          ({selectedRequest.dimensions.cbm} m³)
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-blue-700">Mode de transport:</span>
                      <div className="font-medium">{getTransportModeLabel(selectedRequest.transportMode)}</div>
                    </div>
                  </div>
                </div>

                {selectedRequest.companyQuote ? (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-3">💰 Votre Devis</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-700">Prix:</span>
                        <span className="font-bold text-green-900">{selectedRequest.companyQuote.price.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Délai:</span>
                        <span className="font-medium">{selectedRequest.companyQuote.deliveryTime}</span>
                      </div>
                      <div>
                        <span className="text-green-700">Conditions:</span>
                        <div className="font-medium">{selectedRequest.companyQuote.conditions}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <button
                      onClick={() => openQuoteModal(selectedRequest)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <DollarSign className="h-5 w-5" />
                      Faire un devis pour cette demande
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de devis */}
      {showQuoteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Créer un Devis</h2>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <strong>Client:</strong> {selectedRequest.clientName}<br/>
                  <strong>Trajet:</strong> {selectedRequest.origin} → {selectedRequest.destination}<br/>
                  <strong>Transport:</strong> {getTransportModeLabel(selectedRequest.transportMode)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={quoteForm.price}
                    onChange={(e) => setQuoteForm({...quoteForm, price: e.target.value})}
                    placeholder="Ex: 450000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai de livraison *
                  </label>
                  <input
                    type="text"
                    value={quoteForm.deliveryTime}
                    onChange={(e) => setQuoteForm({...quoteForm, deliveryTime: e.target.value})}
                    placeholder="Ex: 3-5 jours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conditions et notes
                  </label>
                  <textarea
                    value={quoteForm.conditions}
                    onChange={(e) => setQuoteForm({...quoteForm, conditions: e.target.value})}
                    placeholder="Ex: Assurance incluse, suivi en temps réel..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowQuoteModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={submitQuote}
                    disabled={!quoteForm.price || !quoteForm.deliveryTime}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Envoyer le Devis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
