export interface Coupon {
  id: string
  code: string
  name: string
  description: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'
  value: number // Pourcentage ou montant fixe
  minimumAmount?: number // Montant minimum pour utiliser le coupon
  maximumDiscount?: number // Réduction maximum pour les pourcentages
  
  // Conditions d'utilisation
  usageLimit?: number // Nombre max d'utilisations
  usageCount: number // Nombre d'utilisations actuelles
  usagePerUser?: number // Limite par utilisateur
  
  // Validité
  validFrom: Date
  validTo: Date
  isActive: boolean
  
  // Restrictions
  applicableTransportModes?: ('AERIAL' | 'AERIAL_EXPRESS' | 'MARITIME' | 'MARITIME_EXPRESS')[]
  applicableDestinations?: string[]
  applicableClientTypes?: ('INDIVIDUAL' | 'BUSINESS')[]
  firstTimeOnly?: boolean // Réservé aux nouveaux clients
  
  // Métadonnées
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Promotion {
  id: string
  name: string
  description: string
  type: 'AUTOMATIC' | 'COUPON_BASED'
  
  // Conditions de déclenchement
  conditions: PromotionCondition[]
  
  // Actions/réductions
  actions: PromotionAction[]
  
  // Validité
  validFrom: Date
  validTo: Date
  isActive: boolean
  
  // Limites
  usageLimit?: number
  usageCount: number
  
  // Priorité (pour les promotions multiples)
  priority: number
  
  // Métadonnées
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PromotionCondition {
  id: string
  type: 'MIN_AMOUNT' | 'TRANSPORT_MODE' | 'DESTINATION' | 'CLIENT_TYPE' | 'PACKAGE_COUNT' | 'WEIGHT_RANGE' | 'CBM_RANGE' | 'FIRST_ORDER' | 'LOYALTY_TIER'
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN'
  value: string | number | string[]
  description: string
}

export interface PromotionAction {
  id: string
  type: 'PERCENTAGE_DISCOUNT' | 'FIXED_DISCOUNT' | 'FREE_SHIPPING' | 'UPGRADE_TRANSPORT' | 'BONUS_POINTS'
  value: number
  description: string
  maxDiscount?: number // Pour les pourcentages
}

export interface DiscountApplication {
  couponId?: string
  promotionId?: string
  type: 'COUPON' | 'AUTOMATIC_PROMOTION'
  name: string
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'
  originalAmount: number
  discountAmount: number
  finalAmount: number
  description: string
}

export interface CouponUsage {
  id: string
  couponId: string
  userId: string
  orderId: string
  usedAt: Date
  discountAmount: number
  originalAmount: number
}

export interface PromotionStats {
  id: string
  promotionId?: string
  couponId?: string
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  date: Date
  
  // Statistiques d'utilisation
  totalUsages: number
  totalDiscountGiven: number
  totalRevenue: number
  
  // Conversion
  viewsCount: number
  applicationsCount: number
  conversionRate: number
  
  // Top utilisateurs
  topUsers: {
    userId: string
    userName: string
    usageCount: number
    totalDiscount: number
  }[]
}

export interface LoyaltyProgram {
  id: string
  name: string
  description: string
  isActive: boolean
  
  // Niveaux de fidélité
  tiers: LoyaltyTier[]
  
  // Règles de points
  pointsPerEuro: number
  pointsExpiration?: number // Jours avant expiration
  
  // Métadonnées
  createdAt: Date
  updatedAt: Date
}

export interface LoyaltyTier {
  id: string
  name: string
  minPoints: number
  benefits: {
    discountPercentage?: number
    freeShippingThreshold?: number
    prioritySupport?: boolean
    exclusiveOffers?: boolean
  }
  color: string
  icon: string
}

export interface CustomerLoyalty {
  userId: string
  currentPoints: number
  totalPointsEarned: number
  currentTier: string
  tierSince: Date
  
  // Historique des points
  pointsHistory: {
    id: string
    date: Date
    points: number
    type: 'EARNED' | 'REDEEMED' | 'EXPIRED'
    description: string
    orderId?: string
  }[]
}

export interface SeasonalCampaign {
  id: string
  name: string
  description: string
  theme: string // Ex: "Nouvel An Chinois", "Ramadan", "Black Friday"
  
  // Période
  startDate: Date
  endDate: Date
  
  // Promotions associées
  promotions: string[] // IDs des promotions
  coupons: string[] // IDs des coupons
  
  // Visuels
  bannerImage?: string
  backgroundColor: string
  textColor: string
  
  // Métadonnées
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FlashSale {
  id: string
  name: string
  description: string
  
  // Timing
  startTime: Date
  endTime: Date
  duration: number // en minutes
  
  // Réduction
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
  
  // Limites
  maxUsages?: number
  currentUsages: number
  
  // Conditions
  applicableServices?: string[]
  minimumAmount?: number
  
  // État
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDED'
  isActive: boolean
  
  createdAt: Date
  updatedAt: Date
}
