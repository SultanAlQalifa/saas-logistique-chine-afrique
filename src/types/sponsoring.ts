export interface SponsoringBanner {
  id: string
  companyId: string
  title: string
  description: string
  imageUrl?: string
  ctaText: string
  ctaUrl?: string
  type: 'OFFER' | 'DEPARTURE_ANNOUNCEMENT' | 'GENERAL_AD'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  targetAudience: 'ALL' | 'CLIENTS' | 'AGENTS' | 'COMPANIES'
  startDate: Date
  endDate: Date
  isActive: boolean
  budget: number
  clickCount: number
  impressionCount: number
  createdAt: Date
  updatedAt: Date
}

export interface DepartureAnnouncement {
  id: string
  cargoId: string
  companyId: string
  title: string
  description: string
  originPort: string
  destinationPort: string
  departureDate: Date
  estimatedArrival: Date
  availableSpace: number
  pricePerCBM: number
  contactInfo: string
  isSponsored: boolean
  sponsorshipLevel: 'BASIC' | 'PREMIUM' | 'FEATURED'
  createdAt: Date
  updatedAt: Date
}

export interface SponsoringPackage {
  id: string
  name: string
  description: string
  price: number
  duration: number // en jours
  features: string[]
  bannerSlots: number
  priorityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  targetReach: number
  isActive: boolean
}

export interface SponsoringStats {
  totalImpressions: number
  totalClicks: number
  clickThroughRate: number
  totalSpent: number
  averageCostPerClick: number
  topPerformingBanner: SponsoringBanner | null
  recentActivity: {
    date: Date
    impressions: number
    clicks: number
    spent: number
  }[]
}
