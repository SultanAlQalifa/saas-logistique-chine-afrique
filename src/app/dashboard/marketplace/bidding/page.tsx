'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft,
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  DollarSign,
  Package,
  Truck,
  Ship,
  Plane,
  Eye,
  MessageSquare,
  Star,
  Send,
  FileText,
  Calendar,
  User,
  Building,
  Award,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react'
import { useSession } from 'next-auth/react'

// Types
interface Bid {
  id: string
  requestId: string
  requestTitle: string
  amount: number
  currency: string
  deliveryTime: number
  deliveryUnit: 'days' | 'weeks'
  description: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  submittedAt: string
  validUntil: string
  provider: {
    name: string
    company: string
    rating: number
    completedJobs: number
    verified: boolean
  }
  client: {
    name: string
    company: string
    rating: number
  }
  attachments: string[]
  terms: string[]
}

interface BidRequest {
  id: string
  title: string
  category: string
  budget: number
  currency: string
  deadline: string
  location: {
    from: string
    to: string
  }
  client: {
    name: string
    company: string
    rating: number
  }
  bidsCount: number
  status: 'open' | 'closed'
}

// Mock data
const mockBids: Bid[] = [
  {
    id: 'BID-001',
    requestId: 'REQ-001',
    requestTitle: 'Transport de 500 cartons électroniques Shenzhen → Dakar',
    amount: 2200000,
    currency: 'FCFA',
    deliveryTime: 21,
    deliveryUnit: 'days',
    description: 'Transport maritime sécurisé avec assurance complète. Emballage renforcé inclus. Suivi GPS en temps réel.',
    status: 'pending',
    submittedAt: '2024-01-12T10:30:00Z',
    validUntil: '2024-01-20T23:59:59Z',
    provider: {
      name: 'Moussa Kone',
      company: 'AfriLogistics Express',
      rating: 4.8,
      completedJobs: 156,
      verified: true
    },
    client: {
      name: 'Amadou Diallo',
      company: 'TechImport SARL',
      rating: 4.8
    },
    attachments: ['certificat-assurance.pdf', 'references-clients.pdf'],
    terms: ['Paiement 50% à la commande, 50% à la livraison', 'Assurance tous risques incluse', 'Garantie de livraison sous 21 jours']
  },
  {
    id: 'BID-002',
    requestId: 'REQ-003',
    requestTitle: 'Stockage temporaire et distribution - Matériaux construction',
    amount: 650000,
    currency: 'FCFA',
    deliveryTime: 2,
    deliveryUnit: 'weeks',
    description: 'Entrepôt sécurisé de 1000m² avec service de distribution. Équipe dédiée pour manutention.',
    status: 'accepted',
    submittedAt: '2024-01-10T14:15:00Z',
    validUntil: '2024-01-25T23:59:59Z',
    provider: {
      name: 'Fatima Ouedraogo',
      company: 'StockSafe Togo',
      rating: 4.6,
      completedJobs: 89,
      verified: true
    },
    client: {
      name: 'Ibrahim Traore',
      company: 'BTP Solutions',
      rating: 4.2
    },
    attachments: ['plan-entrepot.pdf', 'certificat-securite.pdf'],
    terms: ['Stockage sécurisé 24h/24', 'Distribution selon planning client', 'Assurance marchandises incluse']
  },
  {
    id: 'BID-003',
    requestId: 'REQ-004',
    requestTitle: 'Transport express aérien - Échantillons médicaux',
    amount: 980000,
    currency: 'FCFA',
    deliveryTime: 3,
    deliveryUnit: 'days',
    description: 'Transport aérien express avec chaîne du froid maintenue. Certification pharmaceutique GDP.',
    status: 'rejected',
    submittedAt: '2024-01-09T16:45:00Z',
    validUntil: '2024-01-18T23:59:59Z',
    provider: {
      name: 'Dr. Kofi Asante',
      company: 'MedTransport Africa',
      rating: 4.9,
      completedJobs: 234,
      verified: true
    },
    client: {
      name: 'Dr. Aminata Sy',
      company: 'MediLab International',
      rating: 4.9
    },
    attachments: ['certification-gdp.pdf', 'equipements-froid.pdf'],
    terms: ['Chaîne du froid garantie', 'Livraison express 72h', 'Certification pharmaceutique']
  }
]

const mockAvailableRequests: BidRequest[] = [
  {
    id: 'REQ-005',
    title: 'Import de machines industrielles - Guangzhou vers Cotonou',
    category: 'Transport Maritime',
    budget: 3500000,
    currency: 'FCFA',
    deadline: '2024-02-28',
    location: {
      from: 'Guangzhou, Chine',
      to: 'Cotonou, Bénin'
    },
    client: {
      name: 'Saliou Diop',
      company: 'Industries du Bénin',
      rating: 4.3
    },
    bidsCount: 7,
    status: 'open'
  },
  {
    id: 'REQ-006',
    title: 'Dédouanement express - Produits cosmétiques',
    category: 'Dédouanement',
    budget: 280000,
    currency: 'FCFA',
    deadline: '2024-01-30',
    location: {
      from: 'Yiwu, Chine',
      to: 'Douala, Cameroun'
    },
    client: {
      name: 'Marie Ngozi',
      company: 'Beauty Africa',
      rating: 4.7
    },
    bidsCount: 12,
    status: 'open'
  }
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  pending: 'En attente',
  accepted: 'Acceptée',
  rejected: 'Rejetée',
  withdrawn: 'Retirée'
}

export default function MarketplaceBiddingPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'my-bids' | 'available-requests' | 'create-bid'>('my-bids')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showBidForm, setShowBidForm] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<BidRequest | null>(null)

  // Bid form state
  const [bidAmount, setBidAmount] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [deliveryUnit, setDeliveryUnit] = useState<'days' | 'weeks'>('days')
  const [bidDescription, setBidDescription] = useState('')
  const [bidTerms, setBidTerms] = useState('')

  const isProvider = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  // Filter bids
  const filteredBids = mockBids.filter(bid => {
    const matchesSearch = bid.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bid.client.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || bid.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XOF' : currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleSubmitBid = () => {
    // Logic to submit bid
    console.log('Submitting bid:', {
      requestId: selectedRequest?.id,
      amount: bidAmount,
      deliveryTime,
      deliveryUnit,
      description: bidDescription,
      terms: bidTerms
    })
    setShowBidForm(false)
    setSelectedRequest(null)
    // Reset form
    setBidAmount('')
    setDeliveryTime('')
    setBidDescription('')
    setBidTerms('')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <MessageSquare className="h-10 w-10 mr-3" />
                Enchères & Propositions
              </h1>
              <p className="text-purple-100 text-lg">
                💼 Gérez vos propositions commerciales et participez aux appels d'offres
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.href = '/dashboard/marketplace/config'}
              className="bg-white/20 text-white hover:bg-white/30 border-white/30"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Mes propositions</p>
                <p className="text-2xl font-bold">{mockBids.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Acceptées</p>
                <p className="text-2xl font-bold">{mockBids.filter(b => b.status === 'accepted').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">En attente</p>
                <p className="text-2xl font-bold">{mockBids.filter(b => b.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Taux de succès</p>
                <p className="text-2xl font-bold">33%</p>
              </div>
              <Award className="h-8 w-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('my-bids')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'my-bids'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="h-4 w-4 inline mr-2" />
          Mes Propositions
        </button>
        <button
          onClick={() => setActiveTab('available-requests')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'available-requests'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="h-4 w-4 inline mr-2" />
          Demandes Disponibles
        </button>
      </div>

      {/* My Bids Tab */}
      {activeTab === 'my-bids' && (
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="accepted">Acceptée</option>
                  <option value="rejected">Rejetée</option>
                  <option value="withdrawn">Retirée</option>
                </select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bids List */}
          <div className="space-y-4">
            {filteredBids.map((bid) => (
              <Card key={bid.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={statusColors[bid.status]}>
                          {statusLabels[bid.status]}
                        </Badge>
                        <span className="text-sm text-gray-500">#{bid.id}</span>
                      </div>
                      <CardTitle className="text-lg">{bid.requestTitle}</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(bid.amount, bid.currency)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Livraison: {bid.deliveryTime} {bid.deliveryUnit === 'days' ? 'jours' : 'semaines'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{bid.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Client</h4>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{bid.client.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{bid.client.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{bid.client.company}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Détails</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Soumise le {new Date(bid.submittedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Valide jusqu'au {new Date(bid.validUntil).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {bid.terms.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Conditions</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {bid.terms.map((term, index) => (
                          <li key={index}>{term}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex space-x-2">
                      {bid.attachments.map((attachment, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {attachment}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      {bid.status === 'pending' && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Retirer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Requests Tab */}
      {activeTab === 'available-requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {mockAvailableRequests.length} demande{mockAvailableRequests.length > 1 ? 's' : ''} disponible{mockAvailableRequests.length > 1 ? 's' : ''}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockAvailableRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary">{request.category}</Badge>
                        <Badge className="bg-green-100 text-green-800">Ouvert</Badge>
                      </div>
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{request.location.from} → {request.location.to}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="font-semibold text-green-600">
                        Budget: {formatCurrency(request.budget, request.currency)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Échéance: {new Date(request.deadline).toLocaleDateString('fr-FR')}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{request.client.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{request.client.company}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <MessageSquare className="h-4 w-4" />
                        <span>{request.bidsCount} propositions</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowBidForm(true)
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Faire une proposition
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bid Form Modal */}
      {showBidForm && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Faire une proposition</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBidForm(false)}
                >
                  ✕
                </Button>
              </CardTitle>
              <p className="text-gray-600">{selectedRequest.title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Montant proposé (FCFA)</label>
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Ex: 2500000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Délai de livraison</label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      placeholder="Ex: 21"
                      className="flex-1"
                    />
                    <select
                      value={deliveryUnit}
                      onChange={(e) => setDeliveryUnit(e.target.value as 'days' | 'weeks')}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="days">Jours</option>
                      <option value="weeks">Semaines</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description de votre proposition</label>
                <Textarea
                  value={bidDescription}
                  onChange={(e) => setBidDescription(e.target.value)}
                  placeholder="Décrivez votre approche, vos avantages concurrentiels..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Conditions et termes</label>
                <Textarea
                  value={bidTerms}
                  onChange={(e) => setBidTerms(e.target.value)}
                  placeholder="Conditions de paiement, garanties, assurances..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowBidForm(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmitBid}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer la proposition
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
