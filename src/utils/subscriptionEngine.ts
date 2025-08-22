import { 
  SubscriptionPlan, 
  UserSubscription, 
  SubscriptionUsage, 
  PlanLimitation,
  SubscriptionAnalytics,
  SubscriptionQuota,
  PlanMigration,
  SubscriptionEvent
} from '@/types/subscription'

export class SubscriptionEngine {
  private plans: Map<string, SubscriptionPlan> = new Map()
  private subscriptions: Map<string, UserSubscription> = new Map()
  private quotas: Map<string, SubscriptionQuota> = new Map()
  private events: SubscriptionEvent[] = []

  // Gestion des plans
  createPlan(planData: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>): SubscriptionPlan {
    const plan: SubscriptionPlan = {
      ...planData,
      id: `plan_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.plans.set(plan.id, plan)
    return plan
  }

  updatePlan(planId: string, updates: Partial<SubscriptionPlan>): SubscriptionPlan | null {
    const plan = this.plans.get(planId)
    if (!plan) return null

    const updatedPlan = {
      ...plan,
      ...updates,
      updatedAt: new Date()
    }

    this.plans.set(planId, updatedPlan)
    return updatedPlan
  }

  deletePlan(planId: string): boolean {
    // Vérifier qu'aucun abonnement actif n'utilise ce plan
    const activeSubscriptions = Array.from(this.subscriptions.values())
      .filter(sub => sub.planId === planId && sub.status === 'active')
    
    if (activeSubscriptions.length > 0) {
      throw new Error(`Cannot delete plan with ${activeSubscriptions.length} active subscriptions`)
    }

    return this.plans.delete(planId)
  }

  getPlan(planId: string): SubscriptionPlan | null {
    return this.plans.get(planId) || null
  }

  getAllPlans(): SubscriptionPlan[] {
    return Array.from(this.plans.values()).sort((a, b) => a.metadata.order - b.metadata.order)
  }

  getActivePlans(): SubscriptionPlan[] {
    return this.getAllPlans().filter(plan => plan.status === 'active')
  }

  // Gestion des abonnements
  createSubscription(userId: string, planId: string, options?: {
    trial?: boolean
    customizations?: any
    paymentMethod?: string
  }): UserSubscription {
    const plan = this.getPlan(planId)
    if (!plan) throw new Error('Plan not found')

    const now = new Date()
    const subscription: UserSubscription = {
      id: `sub_${Date.now()}`,
      userId,
      planId,
      status: options?.trial && plan.trial.enabled ? 'trial' : 'active',
      startDate: now,
      trialEndDate: options?.trial && plan.trial.enabled 
        ? new Date(now.getTime() + plan.trial.duration * 24 * 60 * 60 * 1000)
        : undefined,
      autoRenew: true,
      usage: this.initializeUsage(plan),
      billing: {
        nextBillingDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
        paymentMethod: options?.paymentMethod || 'card',
        invoices: []
      },
      customizations: options?.customizations,
      metadata: {
        source: 'signup'
      },
      createdAt: now,
      updatedAt: now
    }

    this.subscriptions.set(subscription.id, subscription)
    this.initializeQuota(subscription)
    this.recordEvent('created', subscription)

    return subscription
  }

  updateSubscription(subscriptionId: string, updates: Partial<UserSubscription>): UserSubscription | null {
    const subscription = this.subscriptions.get(subscriptionId)
    if (!subscription) return null

    const updatedSubscription = {
      ...subscription,
      ...updates,
      updatedAt: new Date()
    }

    this.subscriptions.set(subscriptionId, updatedSubscription)
    return updatedSubscription
  }

  cancelSubscription(subscriptionId: string, reason?: string): UserSubscription | null {
    const subscription = this.subscriptions.get(subscriptionId)
    if (!subscription) return null

    const updatedSubscription = {
      ...subscription,
      status: 'cancelled' as const,
      autoRenew: false,
      endDate: new Date(),
      metadata: {
        ...subscription.metadata,
        notes: reason
      },
      updatedAt: new Date()
    }

    this.subscriptions.set(subscriptionId, updatedSubscription)
    this.recordEvent('cancelled', updatedSubscription)

    return updatedSubscription
  }

  // Migration de plans
  migratePlan(subscriptionId: string, newPlanId: string, options?: {
    immediate?: boolean
    proration?: boolean
  }): PlanMigration {
    const subscription = this.subscriptions.get(subscriptionId)
    if (!subscription) throw new Error('Subscription not found')

    const currentPlan = this.getPlan(subscription.planId)
    const newPlan = this.getPlan(newPlanId)
    if (!currentPlan || !newPlan) throw new Error('Plan not found')

    const migration: PlanMigration = {
      id: `migration_${Date.now()}`,
      fromPlanId: subscription.planId,
      toPlanId: newPlanId,
      userId: subscription.userId,
      type: this.getMigrationType(currentPlan, newPlan),
      scheduledDate: options?.immediate ? new Date() : subscription.billing.nextBillingDate,
      status: 'scheduled',
      proration: {
        enabled: options?.proration || false,
        amount: this.calculateProration(subscription, newPlan),
        currency: currentPlan.pricing.currency
      },
      dataTransfer: {
        required: this.requiresDataTransfer(currentPlan, newPlan),
        completed: false,
        items: []
      },
      rollback: {
        possible: true,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      },
      createdAt: new Date()
    }

    if (options?.immediate) {
      this.executeMigration(migration.id)
    }

    return migration
  }

  private executeMigration(migrationId: string): void {
    // Implementation would execute the migration
    // This is a placeholder for the actual migration logic
  }

  private getMigrationType(currentPlan: SubscriptionPlan, newPlan: SubscriptionPlan): 'upgrade' | 'downgrade' | 'change' {
    if (newPlan.pricing.monthly > currentPlan.pricing.monthly) return 'upgrade'
    if (newPlan.pricing.monthly < currentPlan.pricing.monthly) return 'downgrade'
    return 'change'
  }

  private calculateProration(subscription: UserSubscription, newPlan: SubscriptionPlan): number {
    // Simplified proration calculation
    const daysRemaining = Math.ceil((subscription.billing.nextBillingDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    const dailyRate = newPlan.pricing.monthly / 30
    return dailyRate * daysRemaining
  }

  private requiresDataTransfer(currentPlan: SubscriptionPlan, newPlan: SubscriptionPlan): boolean {
    // Check if migration requires data transfer based on plan limitations
    return currentPlan.limitations.some(limit => 
      !newPlan.limitations.find(newLimit => 
        newLimit.type === limit.type && newLimit.value >= limit.value
      )
    )
  }

  // Gestion des quotas et usage
  private initializeUsage(plan: SubscriptionPlan): SubscriptionUsage {
    const now = new Date()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const metrics: { [key: string]: any } = {}
    plan.limitations.forEach(limit => {
      metrics[limit.type] = {
        current: 0,
        limit: limit.value,
        percentage: 0,
        unlimited: limit.unlimited
      }
    })

    return {
      period: {
        start: now,
        end: endOfMonth
      },
      metrics,
      overages: []
    }
  }

  private initializeQuota(subscription: UserSubscription): void {
    const plan = this.getPlan(subscription.planId)
    if (!plan) return

    const quota: SubscriptionQuota = {
      planId: subscription.planId,
      userId: subscription.userId,
      quotas: {},
      lastUpdated: new Date()
    }

    plan.limitations.forEach(limit => {
      quota.quotas[limit.type] = {
        used: 0,
        limit: limit.value,
        resetDate: this.calculateResetDate(limit.period),
        overage: 0
      }
    })

    this.quotas.set(subscription.userId, quota)
  }

  private calculateResetDate(period?: string): Date {
    const now = new Date()
    switch (period) {
      case 'daily':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      case 'weekly':
        const nextWeek = new Date(now)
        nextWeek.setDate(now.getDate() + (7 - now.getDay()))
        return nextWeek
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, 1)
      case 'yearly':
        return new Date(now.getFullYear() + 1, 0, 1)
      default:
        return new Date(now.getFullYear(), now.getMonth() + 1, 1)
    }
  }

  // Vérification des permissions
  checkPermission(userId: string, resource: string, action: string): boolean {
    const subscription = this.getUserSubscription(userId)
    if (!subscription || subscription.status !== 'active') return false

    const plan = this.getPlan(subscription.planId)
    if (!plan) return false

    const permission = plan.permissions.find(p => p.resource === resource)
    if (!permission) return false

    return permission.actions.includes(action as any)
  }

  // Vérification des limitations
  checkLimit(userId: string, limitType: string, requestedAmount: number = 1): {
    allowed: boolean
    remaining: number
    overage: number
  } {
    const quota = this.quotas.get(userId)
    if (!quota) return { allowed: false, remaining: 0, overage: 0 }

    const limit = quota.quotas[limitType]
    if (!limit) return { allowed: true, remaining: Infinity, overage: 0 }

    const remaining = Math.max(0, limit.limit - limit.used)
    const overage = Math.max(0, requestedAmount - remaining)
    const allowed = remaining >= requestedAmount || limit.limit === -1 // -1 = unlimited

    return { allowed, remaining, overage }
  }

  // Utilisation des quotas
  useQuota(userId: string, limitType: string, amount: number = 1): boolean {
    const quota = this.quotas.get(userId)
    if (!quota) return false

    const limit = quota.quotas[limitType]
    if (!limit) return true // No limit defined

    if (limit.limit === -1) return true // Unlimited

    const check = this.checkLimit(userId, limitType, amount)
    if (check.allowed) {
      limit.used += amount
      quota.lastUpdated = new Date()
      return true
    }

    // Handle overage if allowed
    const subscription = this.getUserSubscription(userId)
    const plan = subscription ? this.getPlan(subscription.planId) : null
    const planLimit = plan?.limitations.find(l => l.type === limitType)

    if (planLimit?.overage?.allowed) {
      limit.used += amount
      limit.overage += check.overage
      quota.lastUpdated = new Date()
      return true
    }

    return false
  }

  // Analytics
  getAnalytics(): SubscriptionAnalytics {
    const subscriptions = Array.from(this.subscriptions.values())
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
    const trialSubscriptions = subscriptions.filter(s => s.status === 'trial')

    // Calculate MRR (Monthly Recurring Revenue)
    const mrr = activeSubscriptions.reduce((total, sub) => {
      const plan = this.getPlan(sub.planId)
      return total + (plan?.pricing.monthly || 0)
    }, 0)

    // Group by plan
    const planGroups = new Map<string, UserSubscription[]>()
    activeSubscriptions.forEach(sub => {
      const existing = planGroups.get(sub.planId) || []
      planGroups.set(sub.planId, [...existing, sub])
    })

    const byPlan = Array.from(planGroups.entries()).map(([planId, subs]) => {
      const plan = this.getPlan(planId)
      return {
        planId,
        planName: plan?.name || 'Unknown',
        subscribers: subs.length,
        revenue: subs.length * (plan?.pricing.monthly || 0),
        churnRate: 0, // Would calculate based on historical data
        conversionRate: 0 // Would calculate based on trial conversions
      }
    })

    return {
      overview: {
        totalSubscriptions: subscriptions.length,
        activeSubscriptions: activeSubscriptions.length,
        trialSubscriptions: trialSubscriptions.length,
        churnRate: 0, // Would calculate based on historical data
        mrr,
        arr: mrr * 12
      },
      byPlan,
      growth: [], // Would populate with historical data
      retention: [] // Would populate with cohort analysis
    }
  }

  // Utilitaires
  getUserSubscription(userId: string): UserSubscription | null {
    return Array.from(this.subscriptions.values())
      .find(sub => sub.userId === userId && sub.status === 'active') || null
  }

  getSubscriptionsByPlan(planId: string): UserSubscription[] {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.planId === planId)
  }

  private recordEvent(type: SubscriptionEvent['type'], subscription: UserSubscription): void {
    const event: SubscriptionEvent = {
      id: `event_${Date.now()}`,
      type,
      subscriptionId: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      data: {},
      timestamp: new Date(),
      source: 'system'
    }

    this.events.push(event)
  }

  // Validation des plans
  validatePlan(plan: Partial<SubscriptionPlan>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!plan.name || plan.name.trim().length === 0) {
      errors.push('Plan name is required')
    }

    if (!plan.pricing?.monthly || plan.pricing.monthly < 0) {
      errors.push('Valid monthly pricing is required')
    }

    if (!plan.pricing?.yearly || plan.pricing.yearly < 0) {
      errors.push('Valid yearly pricing is required')
    }

    if (plan.pricing?.yearly && plan.pricing?.monthly && 
        plan.pricing.yearly >= plan.pricing.monthly * 12) {
      errors.push('Yearly pricing should be less than 12x monthly pricing')
    }

    if (!plan.features || plan.features.length === 0) {
      errors.push('At least one feature is required')
    }

    if (!plan.limitations || plan.limitations.length === 0) {
      errors.push('At least one limitation is required')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Comparaison de plans
  comparePlans(planIds: string[]): any {
    const plans = planIds.map(id => this.getPlan(id)).filter(Boolean) as SubscriptionPlan[]
    
    // Group features by category
    const featureCategories = new Map<string, any[]>()
    
    plans.forEach(plan => {
      plan.features.forEach(feature => {
        const category = feature.category
        const existing = featureCategories.get(category) || []
        
        const featureComparison = existing.find(f => f.name === feature.name)
        if (featureComparison) {
          featureComparison.plans[plan.id] = {
            included: feature.enabled,
            value: feature.value,
            unlimited: feature.unlimited
          }
        } else {
          const newFeature = {
            name: feature.name,
            description: feature.description,
            plans: {
              [plan.id]: {
                included: feature.enabled,
                value: feature.value,
                unlimited: feature.unlimited
              }
            }
          }
          existing.push(newFeature)
        }
        
        featureCategories.set(category, existing)
      })
    })

    return {
      plans,
      features: Array.from(featureCategories.entries()).map(([category, items]) => ({
        category,
        items
      }))
    }
  }

  // Reset quotas (appelé par un cron job)
  resetQuotas(): void {
    const now = new Date()
    
    this.quotas.forEach((quota, userId) => {
      Object.keys(quota.quotas).forEach(type => {
        const q = quota.quotas[type]
        if (q.resetDate <= now) {
          q.used = 0
          q.overage = 0
          
          // Calculate next reset date
          const subscription = this.getUserSubscription(userId)
          const plan = subscription ? this.getPlan(subscription.planId) : null
          const limitation = plan?.limitations.find(l => l.type === type)
          
          if (limitation) {
            q.resetDate = this.calculateResetDate(limitation.period)
          }
        }
      })
      
      quota.lastUpdated = now
    })
  }
}

// Instance singleton
export const subscriptionEngine = new SubscriptionEngine()
