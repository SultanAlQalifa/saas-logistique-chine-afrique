// Types pour le système publicitaire
export interface Advertisement {
  id: string
  companyId: string
  companyName: string
  title: string
  description: string
  imageUrl: string
  targetUrl: string
  position: 'header' | 'sidebar' | 'footer' | 'dashboard'
  dimensions: {
    width: number
    height: number
  }
  status: 'pending' | 'approved' | 'active' | 'paused' | 'rejected' | 'expired'
  startDate: string
  endDate: string
  budget: number
  spent: number
  clicks: number
  impressions: number
  ctr: number // Click-through rate
  createdAt: string
  updatedAt: string
}

export interface AdSpace {
  id: string
  name: string
  position: 'header' | 'sidebar' | 'footer' | 'dashboard'
  dimensions: {
    width: number
    height: number
  }
  pricePerDay: number
  pricePerWeek: number
  pricePerMonth: number
  currency: 'XOF'
  maxAds: number
  active: boolean
  description: string
}

export interface AdPayment {
  id: string
  advertisementId: string
  companyId: string
  amount: number
  currency: 'XOF'
  duration: number // en jours
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  createdAt: string
  paidAt?: string
}

export interface AdStats {
  advertisementId: string
  date: string
  impressions: number
  clicks: number
  ctr: number
  cost: number
}

export interface AdCampaign {
  id: string
  companyId: string
  name: string
  advertisements: Advertisement[]
  totalBudget: number
  totalSpent: number
  status: 'draft' | 'active' | 'paused' | 'completed'
  startDate: string
  endDate: string
  createdAt: string
}

// Dimensions prescrites pour les espaces publicitaires
export const AD_DIMENSIONS = {
  HEADER_BANNER: { width: 728, height: 90 }, // Leaderboard
  SIDEBAR_BANNER: { width: 300, height: 250 }, // Medium Rectangle
  FOOTER_BANNER: { width: 970, height: 90 }, // Super Banner
  DASHBOARD_CARD: { width: 320, height: 180 }, // Card format
  MOBILE_BANNER: { width: 320, height: 50 }, // Mobile Banner
  SQUARE: { width: 250, height: 250 } // Square
} as const

export type AdDimensionType = keyof typeof AD_DIMENSIONS
