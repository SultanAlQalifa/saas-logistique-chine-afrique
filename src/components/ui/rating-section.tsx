'use client'

import { useState } from 'react'
import { Star, MessageCircle, ThumbsUp, Flag } from 'lucide-react'
import { StarRating, RatingDisplay } from './star-rating'
import { ReviewModal } from './review-modal'

interface Review {
  id: string
  author: string
  rating: number
  title: string
  comment: string
  date: string
  recommend: boolean
  helpful: number
  verified: boolean
}

interface RatingStats {
  average: number
  total: number
  distribution: { [key: number]: number }
}

interface RatingSectionProps {
  type: 'platform' | 'company'
  targetName: string
  stats: RatingStats
  reviews: Review[]
  canReview?: boolean
  onReviewSubmit?: (review: any) => void
}

export function RatingSection({
  type,
  targetName,
  stats,
  reviews,
  canReview = true,
  onReviewSubmit
}: RatingSectionProps) {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent')

  const handleReviewSubmit = (reviewData: any) => {
    if (onReviewSubmit) {
      onReviewSubmit(reviewData)
    }
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'helpful':
        return b.helpful - a.helpful
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {type === 'platform' ? '⭐ Évaluations de la plateforme' : `⭐ Évaluations de ${targetName}`}
        </h3>
        {canReview && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            Laisser un avis
          </button>
        )}
      </div>

      {/* Rating Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {stats.average.toFixed(1)}
          </div>
          <StarRating rating={stats.average} readonly size="lg" />
          <p className="text-sm text-gray-600 mt-2">
            Basé sur {stats.total} avis
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.distribution[rating] || 0
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">
                  {rating}★
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div>
          {/* Sort Options */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              Avis clients ({reviews.length})
            </h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Plus récents</option>
              <option value="rating">Note la plus élevée</option>
              <option value="helpful">Plus utiles</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {sortedReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {review.author}
                        </span>
                        {review.verified && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Vérifié
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} readonly size="sm" />
                        <span className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Flag className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                {review.title && (
                  <h5 className="font-medium text-gray-900 mb-2">
                    {review.title}
                  </h5>
                )}

                <p className="text-gray-700 text-sm mb-3">
                  {review.comment}
                </p>

                {review.recommend && (
                  <div className="flex items-center gap-1 text-green-600 text-sm mb-3">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Recommande</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    Utile ({review.helpful})
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    Répondre
                  </button>
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 5 && (
            <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Voir tous les avis ({reviews.length})
            </button>
          )}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        type={type}
        targetName={targetName}
        onSubmit={handleReviewSubmit}
      />
    </div>
  )
}
