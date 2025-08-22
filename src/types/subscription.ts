export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  type: 'free' | 'basic' | 'premium' | 'enterprise' | 'custom'
  status: 'active' | 'inactive' | 'deprecated'
  pricing: {
    monthly: number
    yearly: number
    currency: string
    discount?: {
      percentage: number
      description: string
    }
  }
  features: PlanFeature[]
  limitations: PlanLimitation[]
  permissions: PlanPermission[]
  trial: {
    enabled: boolean
    duration: number // days
    features: string[]
  }
  billing: {
    cycle: 'monthly' | 'yearly' | 'custom'
    invoicing: 'automatic' | 'manual'
    paymentMethods: string[]
  }
  metadata: {
    popular: boolean
    recommended: boolean
    customizable: boolean
    order: number
    color: string
    icon: string
  }
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface PlanFeature {
  id: string
  name: string
  description: string
  category: 'core' | 'advanced' | 'premium' | 'enterprise'
  enabled: boolean
  value?: string | number | boolean
  unit?: string
  unlimited?: boolean
}

export interface PlanLimitation {
  id: string
  type: 'packages' | 'storage' | 'users' | 'companies' | 'api_calls' | 'exports' | 'custom'
  name: string
  value: number
  unit: string
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  unlimited: boolean
  overage?: {
    allowed: boolean
    price: number
    unit: string
  }
}

export interface PlanPermission {
  id: string
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete' | 'export' | 'import')[]
  conditions?: {
    field: string
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
    value: any
  }[]
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'expired' | 'suspended' | 'trial'
  startDate: Date
  endDate?: Date
  trialEndDate?: Date
  autoRenew: boolean
  usage: SubscriptionUsage
  billing: {
    nextBillingDate: Date
    lastPaymentDate?: Date
    paymentMethod: string
    invoices: Invoice[]
  }
  customizations?: {
    features: Partial<PlanFeature>[]
    limitations: Partial<PlanLimitation>[]
    pricing?: {
      monthly?: number
      yearly?: number
    }
  }
  metadata: {
    source: 'signup' | 'upgrade' | 'downgrade' | 'admin'
    notes?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionUsage {
  period: {
    start: Date
    end: Date
  }
  metrics: {
    [key: string]: {
      current: number
      limit: number
      percentage: number
      unlimited: boolean
    }
  }
  overages: {
    type: string
    amount: number
    cost: number
    date: Date
  }[]
}

export interface Invoice {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  paidDate?: Date
  items: InvoiceItem[]
  taxes: {
    name: string
    rate: number
    amount: number
  }[]
  total: number
  paymentMethod?: string
  createdAt: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  type: 'subscription' | 'overage' | 'addon' | 'discount'
}

export interface SubscriptionAnalytics {
  overview: {
    totalSubscriptions: number
    activeSubscriptions: number
    trialSubscriptions: number
    churnRate: number
    mrr: number // Monthly Recurring Revenue
    arr: number // Annual Recurring Revenue
  }
  byPlan: {
    planId: string
    planName: string
    subscribers: number
    revenue: number
    churnRate: number
    conversionRate: number
  }[]
  growth: {
    date: Date
    newSubscriptions: number
    cancellations: number
    upgrades: number
    downgrades: number
    revenue: number
  }[]
  retention: {
    period: string
    cohort: Date
    subscribers: number
    retained: number
    rate: number
  }[]
}

export interface PlanComparison {
  plans: SubscriptionPlan[]
  features: {
    category: string
    items: {
      name: string
      description: string
      plans: {
        [planId: string]: {
          included: boolean
          value?: string | number
          limited?: boolean
          limit?: number
        }
      }
    }[]
  }[]
}

export interface SubscriptionEvent {
  id: string
  type: 'created' | 'activated' | 'cancelled' | 'expired' | 'upgraded' | 'downgraded' | 'renewed' | 'suspended'
  subscriptionId: string
  userId: string
  planId: string
  previousPlanId?: string
  data: any
  timestamp: Date
  source: 'user' | 'admin' | 'system' | 'payment'
}

export interface PlanTemplate {
  id: string
  name: string
  description: string
  category: 'saas' | 'marketplace' | 'enterprise' | 'custom'
  template: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
  variables: {
    name: string
    type: 'string' | 'number' | 'boolean'
    default: any
    description: string
  }[]
  createdAt: Date
}

export interface SubscriptionSettings {
  general: {
    allowTrials: boolean
    defaultTrialDuration: number
    allowDowngrades: boolean
    allowCancellations: boolean
    gracePeriod: number // days
    prorationEnabled: boolean
  }
  billing: {
    currency: string
    taxRate: number
    invoicePrefix: string
    paymentTerms: number // days
    reminderDays: number[]
  }
  notifications: {
    trialExpiring: boolean
    subscriptionExpiring: boolean
    paymentFailed: boolean
    invoiceGenerated: boolean
    planChanged: boolean
  }
  integrations: {
    paymentProviders: string[]
    emailProvider: string
    webhookUrl?: string
  }
}

export interface SubscriptionQuota {
  planId: string
  userId: string
  quotas: {
    [resource: string]: {
      used: number
      limit: number
      resetDate: Date
      overage: number
    }
  }
  lastUpdated: Date
}

export interface PlanMigration {
  id: string
  fromPlanId: string
  toPlanId: string
  userId: string
  type: 'upgrade' | 'downgrade' | 'change'
  scheduledDate: Date
  executedDate?: Date
  status: 'scheduled' | 'completed' | 'failed' | 'cancelled'
  proration: {
    enabled: boolean
    amount: number
    currency: string
  }
  dataTransfer: {
    required: boolean
    completed: boolean
    items: string[]
  }
  rollback: {
    possible: boolean
    deadline: Date
  }
  createdAt: Date
}
