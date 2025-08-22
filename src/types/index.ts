import { UserRole, TransportMode, CargoStatus, PackageStatus } from '@prisma/client'

// Additional enums for SaaS multi-tenant
export enum PlanType {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL'
}

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  companyId: string
  isActive: boolean
  company: Company
  affiliate?: Affiliate
  performance?: {
    packagesProcessed: number
    averageProcessingTime: string
    customerSatisfaction: number
    efficiency: number
    lastActivity: Date
    monthlyTarget: number
    completedTasks: number
  }
}

export interface Company {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  country?: string
  city?: string
  planType: PlanType
  subscriptionStatus: SubscriptionStatus
  trialEndsAt?: Date
  subscriptionEndsAt?: Date
  maxUsers: number
  maxPackagesPerMonth: number
  settings?: CompanySettings
  subscription?: Subscription
}

export interface CompanySettings {
  aerialPricePerKg: number
  maritimePricePerCbm: number
  aerialEtaDays: number
  aerialExpressEtaDays: number
  maritimeEtaDays: number
  maritimeExpressEtaDays: number
  logo?: string | null
  primaryColor: string
}

export interface Client {
  id: string
  clientId: string
  companyId: string
  name: string
  email?: string
  phone?: string
  address?: string
  country?: string
  city?: string
  createdAt: Date
  stats?: {
    totalPackages: number
    totalSpent: number
    averageOrderValue: number
    lastOrderDate: Date
    satisfaction: number
    activity: 'HIGH' | 'MEDIUM' | 'LOW'
    preferredTransport: string
  }
}

export interface Cargo {
  id: string
  cargoId: string
  companyId: string
  transportMode: TransportMode
  carrier?: string
  originPort: string
  destinationPort: string
  departureDate?: Date
  arrivalDate?: Date
  estimatedArrival?: Date
  status: CargoStatus
  packages?: Package[]
}

export interface Package {
  id: string
  packageId: string
  companyId: string
  clientId: string
  cargoId?: string
  description: string
  weight: number
  length?: number
  width?: number
  height?: number
  cbm?: number
  transportMode: TransportMode
  calculatedPrice?: number
  finalPrice?: number
  trackingPin: string
  qrCode?: string
  status: PackageStatus
  estimatedArrival?: Date
  actualArrival?: Date
  collectedAt?: Date
  client: Client
  cargo?: Cargo
  // Nouvelles propriétés pour POD et paiement
  podValidated?: boolean
  podValidatedAt?: Date
  podValidatedBy?: string
  paymentStatus: 'PENDING' | 'PARTIAL' | 'COMPLETED'
  paymentAmount?: number
  remainingAmount?: number
  canBeDelivered?: boolean
}

export interface DashboardStats {
  totalPackages: number
  packagesInTransit: number
  packagesArrived: number
  totalRevenue: number
  monthlyGrowth: number
}

export interface CreatePackageData {
  clientId: string
  cargoId?: string
  description: string
  weight: number
  length?: number
  width?: number
  height?: number
  transportMode: TransportMode
  finalPrice?: number
}

// SaaS Multi-tenant interfaces
export interface Subscription {
  id: string
  companyId: string
  planType: PlanType
  status: SubscriptionStatus
  monthlyPrice: number
  yearlyPrice?: number
  billingCycle: string
  nextBillingDate?: Date
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

export interface Invoice {
  id: string
  companyId: string
  invoiceNumber: string
  amount: number
  currency: string
  status: string
  dueDate: Date
  paidAt?: Date
  stripeInvoiceId?: string
}

export interface Affiliate {
  id: string
  userId: string
  referralCode: string
  commissionRate: number
  totalEarnings: number
  pendingEarnings: number
  bankAccount?: string
  paypalEmail?: string
  user: User
  referrals: AffiliateReferral[]
  payouts: AffiliatePayout[]
}

export interface AffiliateReferral {
  id: string
  affiliateId: string
  companyId: string
  commissionAmount: number
  status: string
  createdAt: Date
}

export interface AffiliatePayout {
  id: string
  affiliateId: string
  amount: number
  method: string
  status: string
  transactionId?: string
  paidAt?: Date
}

export interface CompanyAdminStats {
  totalUsers: number
  totalAgents: number
  totalClients: number
  totalPackages: number
  monthlyRevenue: number
  packageLimit: number
  userLimit: number
}

export interface PlatformAnalytics {
  id: string
  date: Date
  totalCompanies: number
  activeCompanies: number
  totalUsers: number
  totalPackages: number
  totalRevenue: number
  newSignups: number
  packageVolume: number
}

// Dashboard stats for different roles
export interface SuperAdminStats {
  totalCompanies: number
  activeCompanies: number
  totalRevenue: number
  monthlyGrowth: number
  totalUsers: number
  totalPackages: number
}

export interface CompanyAdminStats {
  totalUsers: number
  totalAgents: number
  totalClients: number
  totalPackages: number
  monthlyRevenue: number
  packageLimit: number
  userLimit: number
}

// Export Prisma enums
export { UserRole, TransportMode, CargoStatus, PackageStatus }
