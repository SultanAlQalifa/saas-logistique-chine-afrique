export interface ServiceProvider {
  id: string
  name: string
  company: string
  rating: number
  reviewCount: number
  verified: boolean
  specialties: string[]
  coverageZones: string[]
  responseTime: string
  completedOrders: number
  avatar: string
  joinedDate: string
  languages: string[]
  certifications: string[]
}

export interface ServiceRequest {
  id: string
  title: string
  description: string
  category: ServiceCategory
  origin: Location
  destination: Location
  cargo: CargoDetails
  budget: BudgetRange
  timeline: Timeline
  requirements: string[]
  status: RequestStatus
  clientId: string
  clientName: string
  postedDate: string
  expiryDate: string
  bidsCount: number
  viewsCount: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface ServiceBid {
  id: string
  requestId: string
  providerId: string
  providerName: string
  providerRating: number
  price: number
  currency: string
  estimatedDuration: string
  proposal: string
  includedServices: string[]
  terms: string
  submittedDate: string
  status: BidStatus
  validUntil: string
  attachments?: string[]
}

export interface Location {
  country: string
  city: string
  address?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface CargoDetails {
  type: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  value: number
  currency: string
  fragile: boolean
  dangerous: boolean
  temperature: 'ambient' | 'refrigerated' | 'frozen'
  packaging: string
}

export interface BudgetRange {
  min: number
  max: number
  currency: string
  negotiable: boolean
}

export interface Timeline {
  pickupDate: string
  deliveryDate: string
  flexible: boolean
}

export type ServiceCategory = 
  | 'maritime'
  | 'aerien'
  | 'terrestre'
  | 'express'
  | 'groupage'
  | 'conteneur_complet'
  | 'douane'
  | 'assurance'
  | 'stockage'
  | 'emballage'

export type RequestStatus = 
  | 'active'
  | 'bidding'
  | 'awarded'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired'

export type BidStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'
  | 'expired'

export interface MarketplaceStats {
  totalRequests: number
  activeRequests: number
  totalProviders: number
  verifiedProviders: number
  averageResponseTime: string
  successRate: number
  totalValue: number
  averageSavings: number
}

// Mock data pour démonstration
export const mockServiceProviders: ServiceProvider[] = [
  {
    id: 'sp-001',
    name: 'Ahmed Traore',
    company: 'Sahel Logistics SARL',
    rating: 4.8,
    reviewCount: 156,
    verified: true,
    specialties: ['Maritime', 'Groupage', 'Douane'],
    coverageZones: ['Sénégal', 'Mali', 'Burkina Faso'],
    responseTime: '2h',
    completedOrders: 234,
    avatar: '/avatars/ahmed.jpg',
    joinedDate: '2022-03-15',
    languages: ['Français', 'Wolof', 'Bambara'],
    certifications: ['IATA', 'FIATA', 'ISO 9001']
  },
  {
    id: 'sp-002',
    name: 'Li Wei',
    company: 'Dragon Express Ltd',
    rating: 4.9,
    reviewCount: 203,
    verified: true,
    specialties: ['Aérien', 'Express', 'Fragile'],
    coverageZones: ['Chine', 'Hong Kong', 'Singapour'],
    responseTime: '1h',
    completedOrders: 312,
    avatar: '/avatars/li-wei.jpg',
    joinedDate: '2021-08-22',
    languages: ['中文', 'English', 'Français'],
    certifications: ['IATA', 'CATA', 'ISO 14001']
  },
  {
    id: 'sp-003',
    name: 'Fatou Diallo',
    company: 'Teranga Transport',
    rating: 4.7,
    reviewCount: 89,
    verified: true,
    specialties: ['Terrestre', 'Stockage', 'Distribution'],
    coverageZones: ['Côte d\'Ivoire', 'Ghana', 'Togo'],
    responseTime: '3h',
    completedOrders: 167,
    avatar: '/avatars/fatou.jpg',
    joinedDate: '2022-11-10',
    languages: ['Français', 'Dioula', 'English'],
    certifications: ['ECOWAS', 'ISO 9001']
  }
]

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'req-001',
    title: 'Transport maritime 2x20ft Guangzhou → Dakar',
    description: 'Besoin de transport maritime pour 2 conteneurs 20ft de produits électroniques depuis Guangzhou vers le port de Dakar. Marchandise de valeur, assurance requise.',
    category: 'maritime',
    origin: {
      country: 'Chine',
      city: 'Guangzhou',
      address: 'Port de Guangzhou'
    },
    destination: {
      country: 'Sénégal',
      city: 'Dakar',
      address: 'Port Autonome de Dakar'
    },
    cargo: {
      type: 'Électronique',
      weight: 15000,
      dimensions: { length: 590, width: 235, height: 260 },
      value: 45000,
      currency: 'USD',
      fragile: true,
      dangerous: false,
      temperature: 'ambient',
      packaging: 'Cartons renforcés'
    },
    budget: {
      min: 3500,
      max: 4500,
      currency: 'USD',
      negotiable: true
    },
    timeline: {
      pickupDate: '2024-02-15',
      deliveryDate: '2024-03-20',
      flexible: true
    },
    requirements: ['Assurance cargo', 'Suivi GPS', 'Dédouanement inclus'],
    status: 'active',
    clientId: 'client-001',
    clientName: 'TechImport SARL',
    postedDate: '2024-01-28',
    expiryDate: '2024-02-10',
    bidsCount: 7,
    viewsCount: 23,
    priority: 'high'
  },
  {
    id: 'req-002',
    title: 'Transport express Shanghai → Abidjan (5 jours max)',
    description: 'Urgence ! Transport aérien express pour pièces détachées automobiles. Délai critique de 5 jours maximum.',
    category: 'aerien',
    origin: {
      country: 'Chine',
      city: 'Shanghai',
      address: 'Aéroport Pudong'
    },
    destination: {
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      address: 'Aéroport Félix Houphouët-Boigny'
    },
    cargo: {
      type: 'Pièces automobiles',
      weight: 850,
      dimensions: { length: 120, width: 80, height: 60 },
      value: 12000,
      currency: 'EUR',
      fragile: false,
      dangerous: false,
      temperature: 'ambient',
      packaging: 'Caisses métalliques'
    },
    budget: {
      min: 2800,
      max: 3500,
      currency: 'EUR',
      negotiable: false
    },
    timeline: {
      pickupDate: '2024-02-01',
      deliveryDate: '2024-02-06',
      flexible: false
    },
    requirements: ['Express garanti', 'Livraison directe', 'Signature requise'],
    status: 'bidding',
    clientId: 'client-002',
    clientName: 'AutoParts CI',
    postedDate: '2024-01-30',
    expiryDate: '2024-02-02',
    bidsCount: 12,
    viewsCount: 45,
    priority: 'urgent'
  }
]

export const mockServiceBids: ServiceBid[] = [
  {
    id: 'bid-001',
    requestId: 'req-001',
    providerId: 'sp-001',
    providerName: 'Sahel Logistics SARL',
    providerRating: 4.8,
    price: 4200,
    currency: 'USD',
    estimatedDuration: '28 jours',
    proposal: 'Nous proposons un service maritime complet avec assurance cargo incluse. Notre équipe expérimentée garantit un suivi 24/7 et un dédouanement rapide à Dakar.',
    includedServices: ['Transport maritime', 'Assurance cargo', 'Dédouanement', 'Livraison finale'],
    terms: 'Paiement 30% à la commande, 70% à la livraison. Garantie de livraison sous 30 jours.',
    submittedDate: '2024-01-29',
    status: 'pending',
    validUntil: '2024-02-05',
    attachments: ['certificat-assurance.pdf', 'references-clients.pdf']
  },
  {
    id: 'bid-002',
    requestId: 'req-002',
    providerId: 'sp-002',
    providerName: 'Dragon Express Ltd',
    providerRating: 4.9,
    price: 3200,
    currency: 'EUR',
    estimatedDuration: '4 jours',
    proposal: 'Service express premium avec vol direct Shanghai-Abidjan. Livraison garantie en 4 jours avec suivi temps réel.',
    includedServices: ['Transport aérien express', 'Suivi GPS', 'Livraison directe', 'Assurance express'],
    terms: 'Paiement intégral à la commande. Remboursement si délai non respecté.',
    submittedDate: '2024-01-30',
    status: 'pending',
    validUntil: '2024-02-01',
    attachments: ['planning-vol.pdf']
  }
]

export const mockMarketplaceStats: MarketplaceStats = {
  totalRequests: 1247,
  activeRequests: 89,
  totalProviders: 156,
  verifiedProviders: 98,
  averageResponseTime: '2.5h',
  successRate: 94.2,
  totalValue: 12500000,
  averageSavings: 18.5
}

// Fonctions utilitaires
export const getServiceCategoryLabel = (category: ServiceCategory): string => {
  const labels: Record<ServiceCategory, string> = {
    maritime: 'Maritime',
    aerien: 'Aérien',
    terrestre: 'Terrestre',
    express: 'Express',
    groupage: 'Groupage',
    conteneur_complet: 'Conteneur Complet',
    douane: 'Dédouanement',
    assurance: 'Assurance',
    stockage: 'Stockage',
    emballage: 'Emballage'
  }
  return labels[category]
}

export const getRequestStatusLabel = (status: RequestStatus): string => {
  const labels: Record<RequestStatus, string> = {
    active: 'Actif',
    bidding: 'En cours d\'enchères',
    awarded: 'Attribué',
    in_progress: 'En cours',
    completed: 'Terminé',
    cancelled: 'Annulé',
    expired: 'Expiré'
  }
  return labels[status]
}

export const getBidStatusLabel = (status: BidStatus): string => {
  const labels: Record<BidStatus, string> = {
    pending: 'En attente',
    accepted: 'Accepté',
    rejected: 'Rejeté',
    withdrawn: 'Retiré',
    expired: 'Expiré'
  }
  return labels[status]
}

export const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const formatCurrency = (amount: number, currency: string): string => {
  const formatters: Record<string, Intl.NumberFormat> = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    EUR: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }),
    FCFA: new Intl.NumberFormat('fr-FR', { style: 'decimal' })
  }
  
  if (currency === 'FCFA') {
    return `${formatters.FCFA.format(amount)} FCFA`
  }
  
  return formatters[currency]?.format(amount) || `${amount} ${currency}`
}

export class MarketplaceService {
  static async createServiceRequest(request: Omit<ServiceRequest, 'id' | 'postedDate' | 'bidsCount' | 'viewsCount'>): Promise<ServiceRequest> {
    // Simulation de création
    const newRequest: ServiceRequest = {
      ...request,
      id: `req-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      bidsCount: 0,
      viewsCount: 0
    }
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(newRequest), 1000)
    })
  }

  static async submitBid(bid: Omit<ServiceBid, 'id' | 'submittedDate' | 'status'>): Promise<ServiceBid> {
    // Simulation de soumission d'enchère
    const newBid: ServiceBid = {
      ...bid,
      id: `bid-${Date.now()}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    }
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(newBid), 800)
    })
  }

  static async getRecommendedProviders(requestId: string): Promise<ServiceProvider[]> {
    // Simulation de recommandations IA
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockServiceProviders.slice(0, 3)), 600)
    })
  }

  static async calculateEstimatedCost(request: Partial<ServiceRequest>): Promise<{ min: number; max: number; currency: string }> {
    // Simulation de calcul de coût
    const baseCost = request.cargo?.weight || 1000
    const multiplier = request.category === 'aerien' ? 3.5 : request.category === 'maritime' ? 1.2 : 2.0
    
    const min = Math.round(baseCost * multiplier * 0.8)
    const max = Math.round(baseCost * multiplier * 1.3)
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ min, max, currency: 'USD' }), 400)
    })
  }
}
