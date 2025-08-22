import { Coupon, Promotion, DiscountApplication, PromotionCondition, PromotionAction } from '@/types/promotions'
import { TransportMode } from '@prisma/client'

export class PromotionEngine {
  private coupons: Coupon[]
  private promotions: Promotion[]

  constructor(coupons: Coupon[] = [], promotions: Promotion[] = []) {
    this.coupons = coupons
    this.promotions = promotions
  }

  /**
   * Valider un code coupon
   */
  validateCoupon(
    couponCode: string,
    userId: string,
    orderAmount: number,
    transportMode?: TransportMode,
    destination?: string,
    clientType?: 'INDIVIDUAL' | 'BUSINESS',
    isFirstOrder?: boolean
  ): { valid: boolean; coupon?: Coupon; error?: string } {
    const coupon = this.coupons.find(c => 
      c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive
    )

    if (!coupon) {
      return { valid: false, error: 'Code coupon invalide' }
    }

    // Vérifier la validité temporelle
    const now = new Date()
    if (now < coupon.validFrom || now > coupon.validTo) {
      return { valid: false, error: 'Code coupon expiré' }
    }

    // Vérifier les limites d'utilisation
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, error: 'Code coupon épuisé' }
    }

    // Vérifier le montant minimum
    if (coupon.minimumAmount && orderAmount < coupon.minimumAmount) {
      return { 
        valid: false, 
        error: `Montant minimum requis: ${coupon.minimumAmount}€` 
      }
    }

    // Vérifier les restrictions de transport
    if (coupon.applicableTransportModes && transportMode && 
        !coupon.applicableTransportModes.includes(transportMode)) {
      return { 
        valid: false, 
        error: 'Code coupon non applicable à ce mode de transport' 
      }
    }

    // Vérifier les restrictions de destination
    if (coupon.applicableDestinations && destination && 
        !coupon.applicableDestinations.some(dest => 
          destination.toLowerCase().includes(dest.toLowerCase())
        )) {
      return { 
        valid: false, 
        error: 'Code coupon non applicable à cette destination' 
      }
    }

    // Vérifier le type de client
    if (coupon.applicableClientTypes && clientType && 
        !coupon.applicableClientTypes.includes(clientType)) {
      return { 
        valid: false, 
        error: 'Code coupon non applicable à votre type de compte' 
      }
    }

    // Vérifier si réservé aux nouveaux clients
    if (coupon.firstTimeOnly && !isFirstOrder) {
      return { 
        valid: false, 
        error: 'Code coupon réservé aux nouveaux clients' 
      }
    }

    return { valid: true, coupon }
  }

  /**
   * Calculer la réduction d'un coupon
   */
  calculateCouponDiscount(coupon: Coupon, orderAmount: number): DiscountApplication {
    let discountAmount = 0

    switch (coupon.type) {
      case 'PERCENTAGE':
        discountAmount = (orderAmount * coupon.value) / 100
        if (coupon.maximumDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maximumDiscount)
        }
        break

      case 'FIXED_AMOUNT':
        discountAmount = Math.min(coupon.value, orderAmount)
        break

      case 'FREE_SHIPPING':
        // La logique de livraison gratuite sera gérée ailleurs
        discountAmount = 0
        break
    }

    return {
      couponId: coupon.id,
      type: 'COUPON',
      name: coupon.name,
      discountType: coupon.type,
      originalAmount: orderAmount,
      discountAmount,
      finalAmount: orderAmount - discountAmount,
      description: coupon.description
    }
  }

  /**
   * Trouver les promotions automatiques applicables
   */
  findApplicablePromotions(
    orderAmount: number,
    transportMode?: TransportMode,
    destination?: string,
    clientType?: 'INDIVIDUAL' | 'BUSINESS',
    packageCount?: number,
    weight?: number,
    cbm?: number,
    isFirstOrder?: boolean,
    loyaltyTier?: string
  ): Promotion[] {
    const now = new Date()
    
    return this.promotions
      .filter(promo => 
        promo.isActive && 
        promo.type === 'AUTOMATIC' &&
        now >= promo.validFrom && 
        now <= promo.validTo &&
        (!promo.usageLimit || promo.usageCount < promo.usageLimit)
      )
      .filter(promo => 
        this.checkPromotionConditions(promo, {
          orderAmount,
          transportMode,
          destination,
          clientType,
          packageCount,
          weight,
          cbm,
          isFirstOrder,
          loyaltyTier
        })
      )
      .sort((a, b) => b.priority - a.priority) // Trier par priorité décroissante
  }

  /**
   * Vérifier les conditions d'une promotion
   */
  private checkPromotionConditions(
    promotion: Promotion,
    context: {
      orderAmount: number
      transportMode?: TransportMode
      destination?: string
      clientType?: 'INDIVIDUAL' | 'BUSINESS'
      packageCount?: number
      weight?: number
      cbm?: number
      isFirstOrder?: boolean
      loyaltyTier?: string
    }
  ): boolean {
    return promotion.conditions.every(condition => 
      this.evaluateCondition(condition, context)
    )
  }

  /**
   * Évaluer une condition spécifique
   */
  private evaluateCondition(
    condition: PromotionCondition,
    context: any
  ): boolean {
    const { type, operator, value } = condition

    switch (type) {
      case 'MIN_AMOUNT':
        return this.compareValues(context.orderAmount, operator, value as number)

      case 'TRANSPORT_MODE':
        if (!context.transportMode) return false
        return this.compareValues(context.transportMode, operator, value)

      case 'DESTINATION':
        if (!context.destination) return false
        return this.compareValues(context.destination.toLowerCase(), operator, value)

      case 'CLIENT_TYPE':
        if (!context.clientType) return false
        return this.compareValues(context.clientType, operator, value)

      case 'PACKAGE_COUNT':
        if (!context.packageCount) return false
        return this.compareValues(context.packageCount, operator, value as number)

      case 'WEIGHT_RANGE':
        if (!context.weight) return false
        return this.compareValues(context.weight, operator, value as number)

      case 'CBM_RANGE':
        if (!context.cbm) return false
        return this.compareValues(context.cbm, operator, value as number)

      case 'FIRST_ORDER':
        return context.isFirstOrder === Boolean(value)

      case 'LOYALTY_TIER':
        if (!context.loyaltyTier) return false
        return this.compareValues(context.loyaltyTier, operator, value)

      default:
        return false
    }
  }

  /**
   * Comparer des valeurs selon l'opérateur
   */
  private compareValues(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'EQUALS':
        return actual === expected

      case 'GREATER_THAN':
        return actual > expected

      case 'LESS_THAN':
        return actual < expected

      case 'IN':
        return Array.isArray(expected) && expected.includes(actual)

      case 'NOT_IN':
        return Array.isArray(expected) && !expected.includes(actual)

      default:
        return false
    }
  }

  /**
   * Calculer les réductions des promotions automatiques
   */
  calculatePromotionDiscounts(
    promotions: Promotion[],
    orderAmount: number
  ): DiscountApplication[] {
    return promotions.map(promotion => {
      let totalDiscount = 0
      let description = promotion.description

      // Appliquer toutes les actions de la promotion
      for (const action of promotion.actions) {
        totalDiscount += this.calculateActionDiscount(action, orderAmount)
      }

      return {
        promotionId: promotion.id,
        type: 'AUTOMATIC_PROMOTION',
        name: promotion.name,
        discountType: 'FIXED_AMOUNT', // Simplifié pour l'exemple
        originalAmount: orderAmount,
        discountAmount: totalDiscount,
        finalAmount: orderAmount - totalDiscount,
        description
      }
    })
  }

  /**
   * Calculer la réduction d'une action spécifique
   */
  private calculateActionDiscount(action: PromotionAction, orderAmount: number): number {
    switch (action.type) {
      case 'PERCENTAGE_DISCOUNT':
        let discount = (orderAmount * action.value) / 100
        if (action.maxDiscount) {
          discount = Math.min(discount, action.maxDiscount)
        }
        return discount

      case 'FIXED_DISCOUNT':
        return Math.min(action.value, orderAmount)

      case 'FREE_SHIPPING':
        // Sera géré dans le calcul des frais de port
        return 0

      case 'UPGRADE_TRANSPORT':
        // Sera géré dans la logique de transport
        return 0

      case 'BONUS_POINTS':
        // Sera géré dans le système de fidélité
        return 0

      default:
        return 0
    }
  }

  /**
   * Appliquer toutes les réductions disponibles
   */
  applyAllDiscounts(
    orderAmount: number,
    couponCode?: string,
    context?: {
      userId: string
      transportMode?: TransportMode
      destination?: string
      clientType?: 'INDIVIDUAL' | 'BUSINESS'
      packageCount?: number
      weight?: number
      cbm?: number
      isFirstOrder?: boolean
      loyaltyTier?: string
    }
  ): {
    originalAmount: number
    totalDiscount: number
    finalAmount: number
    appliedDiscounts: DiscountApplication[]
    errors: string[]
  } {
    const appliedDiscounts: DiscountApplication[] = []
    const errors: string[] = []
    let totalDiscount = 0

    // Appliquer le coupon si fourni
    if (couponCode && context) {
      const couponValidation = this.validateCoupon(
        couponCode,
        context.userId,
        orderAmount,
        context.transportMode,
        context.destination,
        context.clientType,
        context.isFirstOrder
      )

      if (couponValidation.valid && couponValidation.coupon) {
        const couponDiscount = this.calculateCouponDiscount(
          couponValidation.coupon,
          orderAmount
        )
        appliedDiscounts.push(couponDiscount)
        totalDiscount += couponDiscount.discountAmount
      } else {
        errors.push(couponValidation.error || 'Erreur coupon')
      }
    }

    // Appliquer les promotions automatiques
    if (context) {
      const applicablePromotions = this.findApplicablePromotions(
        orderAmount,
        context.transportMode,
        context.destination,
        context.clientType,
        context.packageCount,
        context.weight,
        context.cbm,
        context.isFirstOrder,
        context.loyaltyTier
      )

      const promotionDiscounts = this.calculatePromotionDiscounts(
        applicablePromotions,
        orderAmount - totalDiscount // Appliquer sur le montant après coupon
      )

      appliedDiscounts.push(...promotionDiscounts)
      totalDiscount += promotionDiscounts.reduce((sum, d) => sum + d.discountAmount, 0)
    }

    return {
      originalAmount: orderAmount,
      totalDiscount,
      finalAmount: Math.max(0, orderAmount - totalDiscount),
      appliedDiscounts,
      errors
    }
  }

  /**
   * Générer un code coupon aléatoire
   */
  static generateCouponCode(prefix: string = 'PROMO', length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = prefix
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * Ajouter un coupon
   */
  addCoupon(coupon: Coupon): void {
    this.coupons.push(coupon)
  }

  /**
   * Ajouter une promotion
   */
  addPromotion(promotion: Promotion): void {
    this.promotions.push(promotion)
  }

  /**
   * Obtenir tous les coupons actifs
   */
  getActiveCoupons(): Coupon[] {
    const now = new Date()
    return this.coupons.filter(c => 
      c.isActive && 
      now >= c.validFrom && 
      now <= c.validTo &&
      (!c.usageLimit || c.usageCount < c.usageLimit)
    )
  }

  /**
   * Obtenir toutes les promotions actives
   */
  getActivePromotions(): Promotion[] {
    const now = new Date()
    return this.promotions.filter(p => 
      p.isActive && 
      now >= p.validFrom && 
      now <= p.validTo &&
      (!p.usageLimit || p.usageCount < p.usageLimit)
    )
  }
}
