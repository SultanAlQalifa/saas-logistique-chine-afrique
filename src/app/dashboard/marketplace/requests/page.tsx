'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  Settings
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Types
interface ServiceRequest {
  id: string
  title: string
  description: string
  category: string
  budget: number
  currency: string
  location: {
    from: string
    to: string
  }
  deadline: string
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  client: {
    name: string
    company: string
    rating: number
    verified: boolean
  }
  proposals: number
  createdAt: string
  tags: string[]
}

// Mock data
const mockRequests: ServiceRequest[] = [
  {
    id: 'REQ-001',
    title: 'Transport de 500 cartons électroniques Shenzhen → Dakar',
    description: 'Recherche prestataire fiable pour transport maritime de composants électroniques. Emballage sécurisé requis, assurance obligatoire.',
    category: 'Transport Maritime',
    budget: 2500000,
    currency: 'FCFA',
    location: {
      from: 'Shenzhen, Chine',
      to: 'Dakar, Sénégal'
    },
    deadline: '2024-02-15',
    status: 'open',
    priority: 'high',
    client: {
      name: 'Amadou Diallo',
      company: 'TechImport SARL',
      rating: 4.8,
      verified: true
    },
    proposals: 12,
    createdAt: '2024-01-10',
    tags: ['Électronique', 'Fragile', 'Assurance']
  },
  {
    id: 'REQ-002',
    title: 'Dédouanement urgent - Conteneur textile Guangzhou',
    description: 'Besoin d\'un agent en douane expérimenté pour dédouanement rapide d\'un conteneur 40 pieds de textiles.',
    category: 'Dédouanement',
    budget: 450000,
    currency: 'FCFA',
    location: {
      from: 'Guangzhou, Chine',
      to: 'Abidjan, Côte d\'Ivoire'
    },
    deadline: '2024-01-25',
    status: 'in_progress',
    priority: 'urgent',
    client: {
      name: 'Fatou Kone',
      company: 'Mode Africaine',
      rating: 4.5,
      verified: true
    },
    proposals: 8,
    createdAt: '2024-01-08',
    tags: ['Urgent', 'Textile', 'Douane']
  },
  {
    id: 'REQ-003',
    title: 'Stockage temporaire et distribution - Matériaux construction',
    description: 'Recherche entrepôt sécurisé pour stockage de 200 tonnes de matériaux de construction avec service de distribution.',
    category: 'Stockage',
    budget: 800000,
    currency: 'FCFA',
    location: {
      from: 'Ningbo, Chine',
      to: 'Lomé, Togo'
    },
    deadline: '2024-03-01',
    status: 'open',
    priority: 'medium',
    client: {
      name: 'Ibrahim Traore',
      company: 'BTP Solutions',
      rating: 4.2,
      verified: false
    },
    proposals: 5,
    createdAt: '2024-01-12',
    tags: ['Construction', 'Stockage', 'Distribution']
  },
  {
    id: 'REQ-004',
    title: 'Transport express aérien - Échantillons médicaux',
    description: 'Transport urgent d\'échantillons médicaux avec chaîne du froid. Certification pharmaceutique requise.',
    category: 'Transport Aérien',
    budget: 1200000,
    currency: 'FCFA',
    location: {
      from: 'Shanghai, Chine',
      to: 'Bamako, Mali'
    },
    deadline: '2024-01-20',
    status: 'open',
    priority: 'urgent',
    client: {
      name: 'Dr. Aminata Sy',
      company: 'MediLab International',
      rating: 4.9,
      verified: true
    },
    proposals: 15,
    createdAt: '2024-01-09',
    tags: ['Médical', 'Urgent', 'Chaîne froid']
  }
]

const categories = [
  'Tous',
  'Transport Maritime',
  'Transport Aérien',
  'Transport Routier',
  'Dédouanement',
  'Stockage',
  'Assurance',
  'Consultation'
]

const statusColors = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

const statusLabels = {
  open: 'Ouvert',
  in_progress: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé'
}

const priorityLabels = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Élevée',
  urgent: 'Urgent'
}

export default function MarketplaceRequestsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')

  const isEnterprise = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  const isProvider = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  // Filter requests
  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.client.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'Tous' || request.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || request.priority === selectedPriority
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transport Maritime': return <Ship className="h-4 w-4" />
      case 'Transport Aérien': return <Plane className="h-4 w-4" />
      case 'Transport Routier': return <Truck className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XOF' : currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
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
                <Package className="h-10 w-10 mr-3" />
                Demandes de Services
              </h1>
              <p className="text-blue-100 text-lg">
                📋 Découvrez les opportunités d'affaires dans la logistique Chine-Afrique
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isProvider && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => router.push('/dashboard/marketplace/requests/config')}
                className="text-white hover:bg-white/20 border border-white/30"
              >
                <Settings className="h-5 w-5 mr-2" />
                Configuration
              </Button>
            )}
            {isEnterprise && (
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Publier une demande
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Demandes ouvertes</p>
                <p className="text-2xl font-bold">{mockRequests.filter(r => r.status === 'open').length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Budget total</p>
                <p className="text-2xl font-bold">{formatCurrency(mockRequests.reduce((sum, r) => sum + r.budget, 0), 'FCFA')}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Propositions totales</p>
                <p className="text-2xl font-bold">{mockRequests.reduce((sum, r) => sum + r.proposals, 0)}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Note moyenne clients</p>
                <p className="text-2xl font-bold flex items-center">
                  4.6 <Star className="h-5 w-5 ml-1 fill-current" />
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {filteredRequests.length} demande{filteredRequests.length > 1 ? 's' : ''} trouvée{filteredRequests.length > 1 ? 's' : ''}
        </h2>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getCategoryIcon(request.category)}
                    <Badge variant="secondary">{request.category}</Badge>
                    <Badge className={statusColors[request.status]}>
                      {statusLabels[request.status]}
                    </Badge>
                    <Badge className={priorityColors[request.priority]}>
                      {priorityLabels[request.priority]}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{request.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-2">{request.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{request.location.from} → {request.location.to}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span className="font-semibold text-green-600">
                    {formatCurrency(request.budget, request.currency)}
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
                    {request.client.verified && (
                      <Badge variant="outline" className="text-xs">✓ Vérifié</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4" />
                    <span>{request.proposals} propositions</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-2">
                  {request.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détails
                  </Button>
                  <Button size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Faire une proposition
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Aucune demande trouvée
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche ou de filtrage.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
