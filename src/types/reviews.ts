export interface CompanyReview {
  id: string
  companyId: string
  clientId: string
  packageId?: string
  cargoId?: string
  rating: number // 1-5 étoiles
  title: string
  comment: string
  pros: string[]
  cons: string[]
  serviceType: 'SHIPPING' | 'CUSTOMER_SERVICE' | 'DELIVERY_TIME' | 'PACKAGING' | 'OVERALL'
  isVerified: boolean
  isPublic: boolean
  helpfulCount: number
  reportCount: number
  companyResponse?: {
    content: string
    respondedAt: Date
    respondedBy: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface CompanyRating {
  companyId: string
  overallRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  categoryRatings: {
    shipping: number
    customerService: number
    deliveryTime: number
    packaging: number
  }
  verifiedReviewsCount: number
  averageResponseTime: number // en heures
  responseRate: number // pourcentage
  recommendationRate: number // pourcentage
  updatedAt: Date
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  recentReviews: CompanyReview[]
  topRatedCompanies: {
    companyId: string
    companyName: string
    rating: number
    reviewCount: number
  }[]
  reviewTrends: {
    month: string
    averageRating: number
    reviewCount: number
  }[]
}

export interface ReviewFilter {
  rating?: number[]
  serviceType?: string[]
  isVerified?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  sortBy: 'NEWEST' | 'OLDEST' | 'HIGHEST_RATED' | 'LOWEST_RATED' | 'MOST_HELPFUL'
}

export interface ReviewResponse {
  id: string
  reviewId: string
  companyId: string
  content: string
  respondedBy: string
  respondedAt: Date
  isPublic: boolean
}

export interface ReviewModeration {
  id: string
  reviewId: string
  reason: 'SPAM' | 'INAPPROPRIATE' | 'FAKE' | 'OFFENSIVE' | 'OTHER'
  description: string
  reportedBy: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  moderatedBy?: string
  moderatedAt?: Date
  createdAt: Date
}
