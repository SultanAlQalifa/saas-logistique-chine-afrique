'use client'

import { useState } from 'react'
import { CompanyReview, CompanyRating } from '@/types/reviews'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Reply,
  CheckCircle,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react'

interface ReviewCardProps {
  review: CompanyReview
  onHelpful?: (reviewId: string) => void
  onReport?: (reviewId: string) => void
  onReply?: (reviewId: string, content: string) => void
  showActions?: boolean
}

export function ReviewCard({ 
  review, 
  onHelpful, 
  onReport, 
  onReply,
  showActions = true 
}: ReviewCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(review.id, replyContent)
      setReplyContent('')
      setShowReplyForm(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'SHIPPING': 'Expédition',
      'CUSTOMER_SERVICE': 'Service Client',
      'DELIVERY_TIME': 'Délai de Livraison',
      'PACKAGING': 'Emballage',
      'OVERALL': 'Global'
    }
    return labels[type] || type
  }

  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      {/* En-tête de l'avis */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Client Anonyme</span>
              {review.isVerified && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-3 w-3" />
              {review.createdAt.toLocaleDateString('fr-FR')}
              <span>•</span>
              <span>{getServiceTypeLabel(review.serviceType)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* Titre et commentaire */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* Points positifs et négatifs */}
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {review.pros.length > 0 && (
            <div>
              <h5 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                Points positifs
              </h5>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {review.cons.length > 0 && (
            <div>
              <h5 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                <ThumbsDown className="h-4 w-4" />
                Points à améliorer
              </h5>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Réponse de l'entreprise */}
      {review.companyResponse && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Réponse de l'entreprise</span>
            <span className="text-sm text-blue-600">
              {review.companyResponse.respondedAt.toLocaleDateString('fr-FR')}
            </span>
          </div>
          <p className="text-blue-800">{review.companyResponse.content}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onHelpful?.(review.id)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <ThumbsUp className="h-4 w-4" />
              Utile ({review.helpfulCount})
            </button>
            
            <button
              onClick={() => onReport?.(review.id)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <Flag className="h-4 w-4" />
              Signaler
            </button>
          </div>

          {!review.companyResponse && onReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Reply className="h-4 w-4" />
              Répondre
            </button>
          )}
        </div>
      )}

      {/* Formulaire de réponse */}
      {showReplyForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Rédigez votre réponse..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowReplyForm(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleReply}
              disabled={!replyContent.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Publier
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface RatingOverviewProps {
  rating: CompanyRating
  className?: string
}

export function RatingOverview({ rating, className = '' }: RatingOverviewProps) {
  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(score) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getRatingColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600'
    if (score >= 3.5) return 'text-yellow-600'
    if (score >= 2.5) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Évaluations clients</h3>
      
      {/* Note globale */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-2 ${getRatingColor(rating.overallRating)}`}>
          {rating.overallRating.toFixed(1)}
        </div>
        <div className="flex justify-center mb-2">
          {renderStars(rating.overallRating)}
        </div>
        <p className="text-gray-600">
          Basé sur {rating.totalReviews.toLocaleString('fr-FR')} avis
        </p>
      </div>

      {/* Distribution des notes */}
      <div className="space-y-2 mb-6">
        {[5, 4, 3, 2, 1].map(stars => {
          const count = rating.ratingDistribution[stars as keyof typeof rating.ratingDistribution]
          const percentage = rating.totalReviews > 0 ? (count / rating.totalReviews) * 100 : 0
          
          return (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{stars}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          )
        })}
      </div>

      {/* Notes par catégorie */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Notes par catégorie</h4>
        {Object.entries(rating.categoryRatings).map(([category, score]) => {
          const categoryLabels: Record<string, string> = {
            shipping: 'Expédition',
            customerService: 'Service Client',
            deliveryTime: 'Délai de Livraison',
            packaging: 'Emballage'
          }
          
          return (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{categoryLabels[category]}</span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(score)}
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {score.toFixed(1)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {rating.responseRate.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">Taux de réponse</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {rating.recommendationRate.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">Recommandations</div>
        </div>
      </div>
    </div>
  )
}

interface ReviewFormProps {
  onSubmit: (review: Partial<CompanyReview>) => void
  onCancel: () => void
  packageId?: string
  cargoId?: string
}

export function ReviewForm({ onSubmit, onCancel, packageId, cargoId }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [pros, setPros] = useState<string[]>([''])
  const [cons, setCons] = useState<string[]>([''])
  const [serviceType, setServiceType] = useState<string>('OVERALL')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0 || !title.trim() || !comment.trim()) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    onSubmit({
      rating,
      title: title.trim(),
      comment: comment.trim(),
      pros: pros.filter(p => p.trim()),
      cons: cons.filter(c => c.trim()),
      serviceType: serviceType as any,
      packageId,
      cargoId,
      isPublic: true
    })
  }

  const addProsCons = (type: 'pros' | 'cons') => {
    if (type === 'pros') {
      setPros([...pros, ''])
    } else {
      setCons([...cons, ''])
    }
  }

  const updateProsCons = (type: 'pros' | 'cons', index: number, value: string) => {
    if (type === 'pros') {
      const newPros = [...pros]
      newPros[index] = value
      setPros(newPros)
    } else {
      const newCons = [...cons]
      newCons[index] = value
      setCons(newCons)
    }
  }

  const removeProsCons = (type: 'pros' | 'cons', index: number) => {
    if (type === 'pros') {
      setPros(pros.filter((_, i) => i !== index))
    } else {
      setCons(cons.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Laisser un avis</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note globale *
          </label>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    i < (hoverRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 && `${rating}/5`}
            </span>
          </div>
        </div>

        {/* Type de service */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aspect évalué
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="OVERALL">Expérience globale</option>
            <option value="SHIPPING">Expédition</option>
            <option value="CUSTOMER_SERVICE">Service client</option>
            <option value="DELIVERY_TIME">Délai de livraison</option>
            <option value="PACKAGING">Emballage</option>
          </select>
        </div>

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'avis *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Résumez votre expérience en quelques mots"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre avis détaillé *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Décrivez votre expérience avec cette entreprise..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Points positifs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points positifs (optionnel)
          </label>
          {pros.map((pro, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={pro}
                onChange={(e) => updateProsCons('pros', index, e.target.value)}
                placeholder="Ce qui vous a plu..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {pros.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProsCons('pros', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addProsCons('pros')}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            + Ajouter un point positif
          </button>
        </div>

        {/* Points négatifs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points à améliorer (optionnel)
          </label>
          {cons.map((con, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={con}
                onChange={(e) => updateProsCons('cons', index, e.target.value)}
                placeholder="Ce qui pourrait être amélioré..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {cons.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProsCons('cons', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addProsCons('cons')}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            + Ajouter un point d'amélioration
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Publier l'avis
          </button>
        </div>
      </form>
    </div>
  )
}
