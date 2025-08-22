'use client'

import { useState, useEffect } from 'react'
import { CompanyReview, CompanyRating, ReviewStats, ReviewFilter } from '@/types/reviews'
import { 
  Star, 
  Filter, 
  Search, 
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Users,
  Award,
  Calendar,
  ChevronDown
} from 'lucide-react'
import { ReviewCard, RatingOverview } from '@/components/reviews/ReviewSystem'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<CompanyReview[]>([])
  const [rating, setRating] = useState<CompanyRating | null>(null)
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ReviewFilter>({
    sortBy: 'NEWEST'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data
  useEffect(() => {
    const mockReviews: CompanyReview[] = [
      {
        id: '1',
        companyId: 'company-1',
        clientId: 'client-1',
        packageId: 'pkg-001',
        rating: 5,
        title: 'Service excellent, livraison rapide',
        comment: 'Très satisfait du service. Mon colis est arrivé en parfait état et dans les délais prévus. L\'équipe est très professionnelle et réactive.',
        pros: ['Livraison rapide', 'Emballage soigné', 'Communication claire'],
        cons: [],
        serviceType: 'OVERALL',
        isVerified: true,
        isPublic: true,
        helpfulCount: 12,
        reportCount: 0,
        companyResponse: {
          content: 'Merci beaucoup pour votre retour positif ! Nous sommes ravis que notre service vous ait satisfait.',
          respondedAt: new Date('2024-03-02'),
          respondedBy: 'Service Client'
        },
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: '2',
        companyId: 'company-1',
        clientId: 'client-2',
        packageId: 'pkg-002',
        rating: 4,
        title: 'Bon service mais délai un peu long',
        comment: 'Dans l\'ensemble, je suis satisfait du service. Le colis est arrivé en bon état mais avec quelques jours de retard par rapport à l\'estimation initiale.',
        pros: ['Colis en bon état', 'Prix compétitif', 'Suivi en ligne'],
        cons: ['Délai plus long que prévu', 'Communication du retard tardive'],
        serviceType: 'DELIVERY_TIME',
        isVerified: true,
        isPublic: true,
        helpfulCount: 8,
        reportCount: 0,
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-02-28')
      },
      {
        id: '3',
        companyId: 'company-1',
        clientId: 'client-3',
        rating: 3,
        title: 'Service correct mais améliorable',
        comment: 'Le service fait le travail mais il y a de la place pour des améliorations, notamment au niveau de la communication client.',
        pros: ['Prix raisonnable'],
        cons: ['Communication insuffisante', 'Délais non respectés'],
        serviceType: 'CUSTOMER_SERVICE',
        isVerified: false,
        isPublic: true,
        helpfulCount: 3,
        reportCount: 1,
        createdAt: new Date('2024-02-25'),
        updatedAt: new Date('2024-02-25')
      }
    ]

    const mockRating: CompanyRating = {
      companyId: 'company-1',
      overallRating: 4.2,
      totalReviews: 156,
      ratingDistribution: {
        1: 8,
        2: 12,
        3: 25,
        4: 67,
        5: 44
      },
      categoryRatings: {
        shipping: 4.3,
        customerService: 3.9,
        deliveryTime: 4.0,
        packaging: 4.5
      },
      verifiedReviewsCount: 134,
      averageResponseTime: 24,
      responseRate: 78,
      recommendationRate: 85,
      updatedAt: new Date()
    }

    const mockStats: ReviewStats = {
      totalReviews: 156,
      averageRating: 4.2,
      recentReviews: mockReviews,
      topRatedCompanies: [
        { companyId: 'company-1', companyName: 'Ma Société', rating: 4.2, reviewCount: 156 },
        { companyId: 'company-2', companyName: 'Concurrent A', rating: 4.5, reviewCount: 89 },
        { companyId: 'company-3', companyName: 'Concurrent B', rating: 3.8, reviewCount: 234 }
      ],
      reviewTrends: [
        { month: 'Jan 2024', averageRating: 4.1, reviewCount: 23 },
        { month: 'Fév 2024', averageRating: 4.3, reviewCount: 31 },
        { month: 'Mar 2024', averageRating: 4.2, reviewCount: 28 }
      ]
    }

    setReviews(mockReviews)
    setRating(mockRating)
    setStats(mockStats)
    setLoading(false)
  }, [])

  const handleHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpfulCount: review.helpfulCount + 1 }
        : review
    ))
  }

  const handleReport = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, reportCount: review.reportCount + 1 }
        : review
    ))
  }

  const handleReply = (reviewId: string, content: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            companyResponse: {
              content,
              respondedAt: new Date(),
              respondedBy: 'Service Client'
            }
          }
        : review
    ))
  }

  const filteredReviews = reviews.filter(review => {
    if (searchTerm && !review.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !review.comment.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    
    if (filter.rating && !filter.rating.includes(review.rating)) {
      return false
    }
    
    if (filter.serviceType && !filter.serviceType.includes(review.serviceType)) {
      return false
    }
    
    if (filter.isVerified !== undefined && review.isVerified !== filter.isVerified) {
      return false
    }
    
    return true
  }).sort((a, b) => {
    switch (filter.sortBy) {
      case 'OLDEST':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'HIGHEST_RATED':
        return b.rating - a.rating
      case 'LOWEST_RATED':
        return a.rating - b.rating
      case 'MOST_HELPFUL':
        return b.helpfulCount - a.helpfulCount
      default: // NEWEST
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avis Clients</h1>
          <p className="text-gray-600">Gérez les avis et évaluations de votre entreprise</p>
        </div>
      </div>

      {/* Statistiques rapides */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Avis</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de Réponse</p>
                <p className="text-2xl font-bold text-gray-900">{rating?.responseRate}%</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recommandations</p>
                <p className="text-2xl font-bold text-gray-900">{rating?.recommendationRate}%</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vue d'ensemble des notes */}
        <div className="lg:col-span-1">
          {rating && <RatingOverview rating={rating} />}
        </div>

        {/* Liste des avis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recherche et filtres */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher dans les avis..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filter.sortBy}
                  onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="NEWEST">Plus récents</option>
                  <option value="OLDEST">Plus anciens</option>
                  <option value="HIGHEST_RATED">Mieux notés</option>
                  <option value="LOWEST_RATED">Moins bien notés</option>
                  <option value="MOST_HELPFUL">Plus utiles</option>
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filtres
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                  <select
                    value={filter.rating?.[0] || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      rating: e.target.value ? [parseInt(e.target.value)] : undefined 
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Toutes les notes</option>
                    <option value="5">5 étoiles</option>
                    <option value="4">4 étoiles</option>
                    <option value="3">3 étoiles</option>
                    <option value="2">2 étoiles</option>
                    <option value="1">1 étoile</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de service</label>
                  <select
                    value={filter.serviceType?.[0] || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      serviceType: e.target.value ? [e.target.value] : undefined 
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Tous les services</option>
                    <option value="OVERALL">Global</option>
                    <option value="SHIPPING">Expédition</option>
                    <option value="CUSTOMER_SERVICE">Service Client</option>
                    <option value="DELIVERY_TIME">Délai de Livraison</option>
                    <option value="PACKAGING">Emballage</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vérification</label>
                  <select
                    value={filter.isVerified === undefined ? '' : filter.isVerified.toString()}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      isVerified: e.target.value === '' ? undefined : e.target.value === 'true'
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Tous les avis</option>
                    <option value="true">Avis vérifiés</option>
                    <option value="false">Avis non vérifiés</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Liste des avis */}
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onHelpful={handleHelpful}
                  onReport={handleReport}
                  onReply={handleReply}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun avis trouvé</h3>
                <p className="text-gray-600">
                  {searchTerm || Object.keys(filter).some(key => filter[key as keyof ReviewFilter] !== undefined && key !== 'sortBy')
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Les avis de vos clients apparaîtront ici'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredReviews.length > 10 && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Précédent
                </button>
                <span className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</span>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
