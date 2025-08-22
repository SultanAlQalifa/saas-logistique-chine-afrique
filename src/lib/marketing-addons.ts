// Configuration des add-ons marketing pour les entreprises

export interface MarketingAddon {
  id: string
  name: string
  description: string
  category: 'basic' | 'professional' | 'premium' | 'enterprise'
  monthlyPrice: number
  annualPrice: number
  features: string[]
  limits: {
    campaigns: number
    promotions: number
    sponsorships: number
    boosts: number
    emailsPerMonth: number
    analyticsRetention: number // en mois
  }
  benefits: string[]
  popular?: boolean
}

export const MARKETING_ADDONS: Record<string, MarketingAddon> = {
  basic: {
    id: 'basic',
    name: 'Marketing Starter',
    description: 'Pack de base pour débuter votre marketing digital',
    category: 'basic',
    monthlyPrice: 25000,
    annualPrice: 250000, // 2 mois gratuits
    features: [
      '5 campagnes par mois',
      '10 promotions par mois',
      '2 partenariats sponsoring',
      '20 boosts d\'annonces',
      'Analytics de base',
      'Support email'
    ],
    limits: {
      campaigns: 5,
      promotions: 10,
      sponsorships: 2,
      boosts: 20,
      emailsPerMonth: 1000,
      analyticsRetention: 3
    },
    benefits: [
      'Réduction 20% sur toutes les opérations',
      'Templates de campagnes prêts',
      'Rapports mensuels automatiques'
    ]
  },
  professional: {
    id: 'professional',
    name: 'Marketing Pro',
    description: 'Solution complète pour entreprises en croissance',
    category: 'professional',
    monthlyPrice: 75000,
    annualPrice: 750000, // 2 mois gratuits
    popular: true,
    features: [
      '20 campagnes par mois',
      '50 promotions par mois',
      '10 partenariats sponsoring',
      '100 boosts d\'annonces',
      'Analytics avancées',
      'A/B Testing',
      'Support prioritaire',
      'Gestionnaire de compte dédié'
    ],
    limits: {
      campaigns: 20,
      promotions: 50,
      sponsorships: 10,
      boosts: 100,
      emailsPerMonth: 10000,
      analyticsRetention: 12
    },
    benefits: [
      'Réduction 35% sur toutes les opérations',
      'Ciblage géographique avancé',
      'Automation marketing',
      'Intégrations API complètes'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Marketing Elite',
    description: 'Package premium pour grandes entreprises',
    category: 'premium',
    monthlyPrice: 150000,
    annualPrice: 1500000, // 2 mois gratuits
    features: [
      'Campagnes illimitées',
      'Promotions illimitées',
      'Sponsorships illimités',
      'Boosts illimités',
      'Analytics en temps réel',
      'IA Marketing Assistant',
      'Support 24/7',
      'Consultant marketing dédié',
      'Rapports personnalisés'
    ],
    limits: {
      campaigns: -1, // illimité
      promotions: -1,
      sponsorships: -1,
      boosts: -1,
      emailsPerMonth: 100000,
      analyticsRetention: 24
    },
    benefits: [
      'Réduction 50% sur toutes les opérations',
      'Placement prioritaire garanti',
      'Stratégies marketing personnalisées',
      'Formation équipe incluse'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Marketing Corporate',
    description: 'Solution sur-mesure pour multinationales',
    category: 'enterprise',
    monthlyPrice: 300000,
    annualPrice: 3000000, // 2 mois gratuits
    features: [
      'Tout illimité',
      'Plateforme white-label',
      'API dédiée',
      'Infrastructure dédiée',
      'SLA 99.9%',
      'Équipe dédiée',
      'Formation complète',
      'Intégrations sur-mesure'
    ],
    limits: {
      campaigns: -1,
      promotions: -1,
      sponsorships: -1,
      boosts: -1,
      emailsPerMonth: -1,
      analyticsRetention: -1
    },
    benefits: [
      'Réduction 60% sur toutes les opérations',
      'Placement premium exclusif',
      'Développements personnalisés',
      'Support technique dédié'
    ]
  },
  social_media: {
    id: 'social_media',
    name: 'Social Media Manager',
    description: 'Gestion complète des réseaux sociaux et influence',
    category: 'professional',
    monthlyPrice: 45000,
    annualPrice: 450000,
    features: [
      '15 posts automatisés/jour',
      'Gestion 5 plateformes sociales',
      'Analytics réseaux sociaux',
      'Planification de contenu',
      'Engagement automatique',
      'Hashtags optimisés',
      'Stories et Reels'
    ],
    limits: {
      campaigns: 10,
      promotions: 25,
      sponsorships: 5,
      boosts: 50,
      emailsPerMonth: 5000,
      analyticsRetention: 6
    },
    benefits: [
      'Croissance followers garantie +20%',
      'Templates de contenu viral',
      'Calendrier éditorial automatique',
      'Veille concurrentielle'
    ]
  },
  seo_optimizer: {
    id: 'seo_optimizer',
    name: 'SEO & Référencement',
    description: 'Optimisation SEO et visibilité web avancée',
    category: 'professional',
    monthlyPrice: 55000,
    annualPrice: 550000,
    features: [
      'Audit SEO complet',
      'Optimisation 50 mots-clés',
      'Backlinks de qualité',
      'Suivi positions Google',
      'Optimisation technique',
      'Content marketing SEO',
      'Rapports de performance'
    ],
    limits: {
      campaigns: 15,
      promotions: 30,
      sponsorships: 8,
      boosts: 75,
      emailsPerMonth: 7500,
      analyticsRetention: 12
    },
    benefits: [
      'Amélioration ranking +40%',
      'Trafic organique garanti',
      'Optimisation mobile incluse',
      'Formation SEO équipe'
    ]
  },
  email_marketing: {
    id: 'email_marketing',
    name: 'Email Marketing Pro',
    description: 'Campagnes email automatisées et personnalisées',
    category: 'basic',
    monthlyPrice: 35000,
    annualPrice: 350000,
    features: [
      '50,000 emails/mois',
      'Automation workflows',
      'Segmentation avancée',
      'A/B testing emails',
      'Templates responsive',
      'Analytics détaillées',
      'Intégration CRM'
    ],
    limits: {
      campaigns: 8,
      promotions: 20,
      sponsorships: 3,
      boosts: 40,
      emailsPerMonth: 50000,
      analyticsRetention: 6
    },
    benefits: [
      'Taux d\'ouverture +25%',
      'Délivrabilité optimisée',
      'Support anti-spam',
      'RGPD compliant'
    ]
  },
  influencer_network: {
    id: 'influencer_network',
    name: 'Réseau Influenceurs',
    description: 'Accès exclusif au réseau d\'influenceurs Afrique',
    category: 'premium',
    monthlyPrice: 120000,
    annualPrice: 1200000,
    popular: true,
    features: [
      'Base 10,000+ influenceurs',
      'Matching automatique',
      'Gestion campagnes influenceurs',
      'Tracking performances',
      'Négociation tarifs',
      'Contrats automatisés',
      'ROI tracking'
    ],
    limits: {
      campaigns: 25,
      promotions: 60,
      sponsorships: 15,
      boosts: 150,
      emailsPerMonth: 25000,
      analyticsRetention: 18
    },
    benefits: [
      'Accès influenceurs premium',
      'Tarifs négociés -30%',
      'Campagnes virales garanties',
      'Support juridique inclus'
    ]
  },
  marketplace_ads: {
    id: 'marketplace_ads',
    name: 'Publicités Marketplace',
    description: 'Optimisation publicitaire sur toutes les plateformes',
    category: 'professional',
    monthlyPrice: 65000,
    annualPrice: 650000,
    features: [
      'Google Ads optimisé',
      'Facebook/Instagram Ads',
      'LinkedIn Ads B2B',
      'TikTok Ads',
      'Gestion budgets automatique',
      'Retargeting avancé',
      'Conversion tracking'
    ],
    limits: {
      campaigns: 30,
      promotions: 75,
      sponsorships: 12,
      boosts: 200,
      emailsPerMonth: 15000,
      analyticsRetention: 12
    },
    benefits: [
      'ROI moyen +150%',
      'CPC optimisé -40%',
      'Audiences lookalike',
      'Pixel tracking avancé'
    ]
  },
  content_creator: {
    id: 'content_creator',
    name: 'Studio Création Contenu',
    description: 'Production de contenu visuel et vidéo professionnel',
    category: 'premium',
    monthlyPrice: 85000,
    annualPrice: 850000,
    features: [
      '20 visuels/mois',
      '5 vidéos courtes/mois',
      'Design graphique pro',
      'Animation 2D/3D',
      'Shooting photo produits',
      'Montage vidéo avancé',
      'Brand guidelines'
    ],
    limits: {
      campaigns: 18,
      promotions: 45,
      sponsorships: 10,
      boosts: 90,
      emailsPerMonth: 12000,
      analyticsRetention: 12
    },
    benefits: [
      'Équipe créative dédiée',
      'Révisions illimitées',
      'Formats multi-plateformes',
      'Banque d\'images premium'
    ]
  },
  analytics_ai: {
    id: 'analytics_ai',
    name: 'Analytics IA Avancée',
    description: 'Intelligence artificielle pour analyses prédictives',
    category: 'premium',
    monthlyPrice: 95000,
    annualPrice: 950000,
    features: [
      'Prédictions IA',
      'Analyses comportementales',
      'Recommandations automatiques',
      'Dashboards temps réel',
      'Alertes intelligentes',
      'Rapports automatisés',
      'Intégration multi-sources'
    ],
    limits: {
      campaigns: 35,
      promotions: 80,
      sponsorships: 20,
      boosts: 250,
      emailsPerMonth: 30000,
      analyticsRetention: 24
    },
    benefits: [
      'Prédictions 95% précises',
      'Optimisation automatique',
      'Insights actionnables',
      'ROI prédictif'
    ]
  }
}

export interface AddonSubscription {
  id: string
  companyId: string
  addonId: string
  status: 'active' | 'inactive' | 'suspended' | 'cancelled'
  billingCycle: 'monthly' | 'annual'
  startDate: string
  endDate: string
  autoRenew: boolean
  usage: {
    campaigns: number
    promotions: number
    sponsorships: number
    boosts: number
    emailsSent: number
  }
  totalPaid: number
  nextBillingDate: string
}

export function calculateAddonDiscount(addonId: string, operationCost: number): number {
  const addon = MARKETING_ADDONS[addonId]
  if (!addon) return 0

  let discountRate = 0
  switch (addon.category) {
    case 'basic': discountRate = 0.20; break
    case 'professional': discountRate = 0.35; break
    case 'premium': discountRate = 0.50; break
    case 'enterprise': discountRate = 0.60; break
  }

  return Math.round(operationCost * discountRate)
}

export function checkAddonLimits(
  subscription: AddonSubscription, 
  operationType: 'campaigns' | 'promotions' | 'sponsorships' | 'boosts'
): { allowed: boolean; remaining: number } {
  const addon = MARKETING_ADDONS[subscription.addonId]
  if (!addon) return { allowed: false, remaining: 0 }

  const limit = addon.limits[operationType]
  const used = subscription.usage[operationType]

  if (limit === -1) {
    return { allowed: true, remaining: -1 } // illimité
  }

  const remaining = limit - used
  return { 
    allowed: remaining > 0, 
    remaining: Math.max(0, remaining) 
  }
}

export function getAddonFeatures(addonId: string): string[] {
  const addon = MARKETING_ADDONS[addonId]
  return addon ? addon.features : []
}

export function calculateAnnualSavings(monthlyPrice: number, annualPrice: number): number {
  return (monthlyPrice * 12) - annualPrice
}

export function getAddonRecommendation(
  monthlyOperations: {
    campaigns: number
    promotions: number
    sponsorships: number
    boosts: number
  }
): string {
  const totalOperations = Object.values(monthlyOperations).reduce((sum, count) => sum + count, 0)

  if (totalOperations <= 37) return 'basic' // 5+10+2+20
  if (totalOperations <= 180) return 'professional' // 20+50+10+100
  return 'premium'
}
