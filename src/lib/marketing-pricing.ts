// Configuration des tarifs marketing pour les entreprises

export interface MarketingOperation {
  type: 'campaign' | 'promotion' | 'sponsoring' | 'boost'
  name: string
  baseCost: number
  costPerDay: number
  minDuration: number
  maxDuration: number
  features: string[]
}

export const MARKETING_PRICING = {
  campaign: {
    type: 'campaign' as const,
    name: 'Campagne Marketing',
    baseCost: 25000, // Coût de base en FCFA
    costPerDay: 5000, // Coût par jour
    minDuration: 3,
    maxDuration: 90,
    features: [
      'Diffusion multi-canaux',
      'Ciblage géographique',
      'Analytics détaillées',
      'Support prioritaire'
    ]
  },
  promotion: {
    type: 'promotion' as const,
    name: 'Promotion',
    baseCost: 15000,
    costPerDay: 3000,
    minDuration: 1,
    maxDuration: 30,
    features: [
      'Mise en avant des offres',
      'Badges promotionnels',
      'Notifications push',
      'Rapports de performance'
    ]
  },
  sponsoring: {
    type: 'sponsoring' as const,
    name: 'Sponsoring',
    baseCost: 50000,
    costPerDay: 8000,
    minDuration: 7,
    maxDuration: 365,
    features: [
      'Placement premium',
      'Logo partenaire',
      'Articles sponsorisés',
      'Visibilité maximale'
    ]
  },
  boost: {
    type: 'boost' as const,
    name: 'Boost d\'annonce',
    baseCost: 5000,
    costPerDay: 2000,
    minDuration: 1,
    maxDuration: 14,
    features: [
      'Visibilité accrue',
      'Placement prioritaire',
      'Statistiques temps réel',
      'Optimisation automatique'
    ]
  }
}

export const BOOST_TYPES = {
  visibility: {
    name: 'Visibilité Étendue',
    multiplier: 1.0,
    description: 'Augmente la portée de votre annonce'
  },
  priority: {
    name: 'Priorité Élevée',
    multiplier: 1.6,
    description: 'Place votre annonce en tête de liste'
  },
  featured: {
    name: 'Mise en Avant',
    multiplier: 2.4,
    description: 'Affichage dans la section vedette'
  },
  trending: {
    name: 'Tendance',
    multiplier: 3.0,
    description: 'Apparaît dans les tendances'
  }
}

export function calculateMarketingCost(
  operationType: keyof typeof MARKETING_PRICING,
  duration: number,
  boostType?: keyof typeof BOOST_TYPES
): number {
  const operation = MARKETING_PRICING[operationType]
  let totalCost = operation.baseCost + (operation.costPerDay * duration)

  // Appliquer le multiplicateur pour les boosts
  if (operationType === 'boost' && boostType) {
    const multiplier = BOOST_TYPES[boostType].multiplier
    totalCost = Math.round(totalCost * multiplier)
  }

  return totalCost
}

export function getOperationDetails(operationType: keyof typeof MARKETING_PRICING) {
  return MARKETING_PRICING[operationType]
}

export function validateDuration(operationType: keyof typeof MARKETING_PRICING, duration: number): boolean {
  const operation = MARKETING_PRICING[operationType]
  return duration >= operation.minDuration && duration <= operation.maxDuration
}

// Frais de plateforme (commission NextMove)
export const PLATFORM_FEES = {
  commission: 0.15, // 15% de commission sur toutes les opérations marketing
  processingFee: 1000, // Frais de traitement fixe en FCFA
  taxRate: 0.18 // TVA 18%
}

export function calculateTotalWithFees(baseCost: number): {
  baseCost: number
  commission: number
  processingFee: number
  subtotal: number
  tax: number
  total: number
} {
  const commission = Math.round(baseCost * PLATFORM_FEES.commission)
  const processingFee = PLATFORM_FEES.processingFee
  const subtotal = baseCost + commission + processingFee
  const tax = Math.round(subtotal * PLATFORM_FEES.taxRate)
  const total = subtotal + tax

  return {
    baseCost,
    commission,
    processingFee,
    subtotal,
    tax,
    total
  }
}
