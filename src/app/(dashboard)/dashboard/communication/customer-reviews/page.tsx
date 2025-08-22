'use client'

import { useState } from 'react'
import { 
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Settings,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Users,
  TrendingUp,
  BarChart3,
  MessageCircle,
  StarHalf,
  Smile,
  Frown,
  Award
} from 'lucide-react'
import BackButton from '@/components/ui/back-button'

interface Review {
  id: string
  customerName: string
  customerEmail: string
  customerType: 'individual' | 'business'
  rating: number
  title: string
  comment: string
  service: 'shipping' | 'support' | 'platform' | 'delivery'
  status: 'published' | 'pending' | 'hidden'
  isVerified: boolean
  createdAt: string
  updatedAt?: string
  helpful: number
  notHelpful: number
  response?: {
    message: string
    respondedBy: string
    respondedAt: string
  }
  tags: string[]
}

// Mock data
const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Marie Kouassi',
    customerEmail: 'marie.kouassi@email.com',
    customerType: 'individual',
    rating: 5,
    title: 'Service exceptionnel !',
    comment: 'J\'ai été impressionnée par la rapidité et la qualité du service. Mon colis est arrivé en parfait état et dans les délais annoncés. L\'équipe support est très réactive. Je recommande vivement !',
    service: 'shipping',
    status: 'published',
    isVerified: true,
    createdAt: '2024-01-20T14:30:00',
    helpful: 12,
    notHelpful: 1,
    response: {
      message: 'Merci beaucoup Marie pour ce retour positif ! Nous sommes ravis que votre expérience ait été à la hauteur de vos attentes.',
      respondedBy: 'Service Client',
      respondedAt: '2024-01-20T16:45:00'
    },
    tags: ['rapide', 'qualité', 'recommandé']
  },
  {
    id: '2',
    customerName: 'Entreprise SARL TECH',
    customerEmail: 'contact@sarltech.ci',
    customerType: 'business',
    rating: 4,
    title: 'Bon service mais peut mieux faire',
    comment: 'Globalement satisfait du service pour nos envois réguliers vers la Chine. Les tarifs sont compétitifs et le suivi est correct. Cependant, il y a eu quelques retards sur certaines livraisons.',
    service: 'shipping',
    status: 'published',
    isVerified: true,
    createdAt: '2024-01-19T10:15:00',
    helpful: 8,
    notHelpful: 2,
    tags: ['entreprise', 'tarifs', 'retards']
  },
  {
    id: '3',
    customerName: 'Koffi Asante',
    customerEmail: 'koffi.asante@gmail.com',
    customerType: 'individual',
    rating: 2,
    title: 'Déçu par le service client',
    comment: 'Mon colis a été perdu et il m\'a fallu plusieurs semaines pour avoir une réponse du service client. Très déçu de cette expérience.',
    service: 'support',
    status: 'published',
    isVerified: true,
    createdAt: '2024-01-18T09:20:00',
    helpful: 5,
    notHelpful: 8,
    response: {
      message: 'Nous nous excusons sincèrement pour cette expérience décevante. Nous avons pris des mesures pour améliorer notre service client et éviter ce type de situation à l\'avenir.',
      respondedBy: 'Direction',
      respondedAt: '2024-01-19T11:30:00'
    },
    tags: ['problème', 'service client', 'amélioration']
  },
  {
    id: '4',
    customerName: 'Fatou Diallo',
    customerEmail: 'fatou.diallo@yahoo.fr',
    customerType: 'individual',
    rating: 5,
    title: 'Parfait pour mes achats en ligne',
    comment: 'J\'utilise ce service pour tous mes achats en ligne depuis la Chine. Interface simple, prix transparents, et livraison toujours dans les temps. Rien à redire !',
    service: 'platform',
    status: 'published',
    isVerified: true,
    createdAt: '2024-01-17T16:45:00',
    helpful: 15,
    notHelpful: 0,
    tags: ['interface', 'prix', 'ponctualité']
  },
  {
    id: '5',
    customerName: 'Ibrahim Traoré',
    customerEmail: 'ibrahim.traore@outlook.com',
    customerType: 'individual',
    rating: 3,
    title: 'Moyen',
    comment: 'Le service fonctionne mais sans plus. Les délais sont respectés mais la communication pourrait être améliorée.',
    service: 'delivery',
    status: 'pending',
    isVerified: false,
    createdAt: '2024-01-21T11:00:00',
    helpful: 2,
    notHelpful: 1,
    tags: ['communication', 'délais']
  }
]

export default function CustomerReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseText, setResponseText] = useState('')

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
    const matchesService = serviceFilter === 'all' || review.service === serviceFilter
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    
    return matchesSearch && matchesRating && matchesService && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'hidden': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'shipping': return 'bg-blue-100 text-blue-800'
      case 'support': return 'bg-purple-100 text-purple-800'
      case 'platform': return 'bg-green-100 text-green-800'
      case 'delivery': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />)
      }
    }
    return stars
  }

  const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length
  const totalReviews = mockReviews.length
  const positiveReviews = mockReviews.filter(r => r.rating >= 4).length
  const negativeReviews = mockReviews.filter(r => r.rating <= 2).length

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(r => r.rating === rating).length,
    percentage: Math.round((mockReviews.filter(r => r.rating === rating).length / totalReviews) * 100)
  }))

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <BackButton href="/dashboard/communication" label="Retour à Communication" />
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              ⭐ Avis Clients
            </h1>
            <p className="text-purple-100 text-lg">
              Consultez et gérez les retours de vos clients
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
            <div className="text-purple-200 text-sm">{totalReviews} avis clients</div>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">😊 Avis Positifs</p>
              <p className="text-2xl font-bold text-green-900">{positiveReviews}</p>
              <p className="text-green-700 text-sm">{Math.round((positiveReviews/totalReviews)*100)}% du total</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <Smile className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">😞 Avis Négatifs</p>
              <p className="text-2xl font-bold text-red-900">{negativeReviews}</p>
              <p className="text-red-700 text-sm">{Math.round((negativeReviews/totalReviews)*100)}% du total</p>
            </div>
            <div className="p-3 bg-red-500 rounded-lg">
              <Frown className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">📊 Note Moyenne</p>
              <p className="text-2xl font-bold text-blue-900">{averageRating.toFixed(1)}</p>
              <p className="text-blue-700 text-sm">Sur 5 étoiles</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">🏆 Taux de Réponse</p>
              <p className="text-2xl font-bold text-amber-900">60%</p>
              <p className="text-amber-700 text-sm">Avis avec réponse</p>
            </div>
            <div className="p-3 bg-amber-500 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Distribution des notes */}
      <div className="bg-white rounded-lg border border-secondary-200 p-6">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Distribution des notes</h2>
        <div className="space-y-3">
          {ratingDistribution.map((item) => (
            <div key={item.rating} className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 w-16">
                <span className="text-sm font-medium">{item.rating}</span>
                <Star className="h-4 w-4" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-secondary-600 w-12">{item.count}</span>
              <span className="text-sm text-secondary-500 w-12">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions et filtres */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Demander un avis
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 text-secondary-600 border border-secondary-300 rounded-lg hover:bg-secondary-50">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-secondary-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, titre ou commentaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Toutes les notes</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous les services</option>
            <option value="shipping">Expédition</option>
            <option value="support">Support</option>
            <option value="platform">Plateforme</option>
            <option value="delivery">Livraison</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="pending">En attente</option>
            <option value="hidden">Masqués</option>
          </select>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-secondary-900">{review.customerName}</h3>
                    {review.isVerified && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${review.customerType === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {review.customerType === 'business' ? 'Entreprise' : 'Particulier'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-secondary-500">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <h4 className="font-medium text-secondary-900 mb-2">{review.title}</h4>
                  <p className="text-secondary-600 mb-3">{review.comment}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    {review.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getServiceColor(review.service)}`}>
                  {review.service === 'shipping' ? 'Expédition' :
                   review.service === 'support' ? 'Support' :
                   review.service === 'platform' ? 'Plateforme' : 'Livraison'}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(review.status)}`}>
                  {review.status === 'published' ? 'Publié' :
                   review.status === 'pending' ? 'En attente' : 'Masqué'}
                </span>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => {
                      setSelectedReview(review)
                      setShowResponseModal(true)
                    }}
                    className="p-2 text-secondary-400 hover:text-secondary-600"
                    title="Répondre"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-secondary-400 hover:text-secondary-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Réponse existante */}
            {review.response && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      SC
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-blue-900">{review.response.respondedBy}</span>
                      <span className="text-xs text-blue-600">
                        {new Date(review.response.respondedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-blue-800">{review.response.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions utiles */}
            <div className="flex items-center justify-between text-sm text-secondary-500">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 hover:text-green-600">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{review.helpful}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-red-600">
                  <ThumbsDown className="h-4 w-4" />
                  <span>{review.notHelpful}</span>
                </button>
              </div>
              <div className="text-xs">
                ID: {review.id} • {review.customerEmail}
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <Star className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-sm font-medium text-secondary-900">Aucun avis trouvé</h3>
            <p className="mt-1 text-sm text-secondary-500">
              Aucun avis ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>

      {/* Modal de réponse */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-secondary-900">
                Répondre à {selectedReview.customerName}
              </h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  {renderStars(selectedReview.rating)}
                </div>
                <h4 className="font-medium text-secondary-900 mb-1">{selectedReview.title}</h4>
                <p className="text-sm text-secondary-600">{selectedReview.comment}</p>
              </div>
              
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Votre réponse
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="Rédigez votre réponse..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Ici on sauvegarderait la réponse
                  console.log('Réponse envoyée:', responseText)
                  setShowResponseModal(false)
                  setResponseText('')
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
              >
                Envoyer la réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
