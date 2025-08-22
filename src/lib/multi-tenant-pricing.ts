// Types pour le système de tarification multi-tenant
// Propriétaire → Entreprises → Clients finaux

export type PricingType = 'fixed' | 'per_kg' | 'per_m3' | 'percent_of_value'
export type RateBasis = 'per_kg' | 'per_m3'
export type TransportMode = 'air' | 'sea' | 'road'
export type MarginMode = 'fixed' | 'percent'
export type Currency = 'EUR' | 'XOF' | 'USD'

// ===== COUCHE PROPRIÉTAIRE (Wholesale vers Entreprises) =====

export interface OwnerPlan {
  id: string
  name: string
  slug: string
  price_month_eur: number
  price_year_eur: number
  features: string[]
  limits: {
    max_shipments_month?: number
    max_users?: number
    max_storage_gb?: number
    api_calls_month?: number
    support_level: 'basic' | 'premium' | 'enterprise'
  }
  active: boolean
  highlighted: boolean
  display_order: number
  created_at: string
  updated_at: string
}

// Add-ons SaaS (fonctionnalités plateforme facturées aux Entreprises)
export interface OwnerFeatureAddon {
  id: string
  name: string
  slug: string
  description: string
  category: 'API' | 'White-label' | 'Integrations' | 'Support' | 'Personnalisation' | 'Analytics'
  price_month_eur: number
  price_year_eur: number
  active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

// Add-ons Métier (services logistiques de base du propriétaire)
export interface OwnerServiceAddon {
  id: string
  name: string
  slug: string
  description: string
  pricing_type: PricingType
  price_eur: number // ou taux si percent_of_value
  unit_label: string // "€/kg", "€/m³", "%", "€/unité"
  taxable: boolean
  active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface BillingSettings {
  id: string
  vat_rate: number // 20% = 0.20
  annual_discount_rate: number // 10% = 0.10
  currency_default: Currency
  fx_eur_to_xof: number
  fx_eur_to_usd: number
  fx_updated_at: string
  created_at: string
  updated_at: string
}

// ===== COUCHE ENTREPRISE (Tenant) =====

export interface TenantPlan {
  id: string
  tenant_id: string
  owner_plan_id: string
  resell_price_month: number
  resell_price_year: number
  margin_mode: MarginMode
  margin_value: number
  active: boolean
  is_public: boolean
  notes?: string
  created_at: string
  updated_at: string
  // Relations
  owner_plan?: OwnerPlan
}

// Add-ons SaaS souscrits par l'Entreprise (relation avec OwnerFeatureAddon)
export interface TenantFeatureSubscription {
  id: string
  tenant_id: string
  owner_feature_addon_id: string
  subscribed_at: string
  expires_at?: string
  active: boolean
  // Relations
  owner_feature_addon?: OwnerFeatureAddon
}

// Add-ons Métier configurés par l'Entreprise (services vendus aux clients finaux)
export interface TenantServiceAddon {
  id: string
  tenant_id: string
  name: string
  slug: string
  description: string
  pricing_type: PricingType
  price: number // prix final client en devise locale
  currency: Currency
  unit_label: string
  taxable: boolean
  active: boolean
  is_public: boolean
  display_order: number
  // Optionnel: basé sur un service propriétaire
  owner_service_addon_id?: string
  margin_mode?: MarginMode
  margin_value?: number
  created_at: string
  updated_at: string
  // Relations
  owner_service_addon?: OwnerServiceAddon
}

export interface TenantRateCard {
  id: string
  tenant_id: string
  mode: TransportMode
  origin_region: string
  origin_country: string
  origin_city?: string
  destination_region: string
  destination_country: string
  destination_city?: string
  rate_basis: RateBasis
  // Paliers tarifaires
  tiers: Array<{
    min: number
    max: number | null // null = illimité
    price: number
  }>
  min_charge: number
  // Surcharges
  fuel_surcharge_percent: number
  security_surcharge_percent: number
  peak_season_surcharge_percent: number
  currency: Currency
  active: boolean
  valid_from: string
  valid_until?: string
  created_at: string
  updated_at: string
}

export interface TenantRateRules {
  id: string
  tenant_id: string
  // Règles globales
  rounding_mode: 'up' | 'down' | 'nearest'
  rounding_precision: number // 0.01 pour centimes
  min_invoice_amount: number
  volume_discount_tiers: Array<{
    min_volume: number
    discount_percent: number
  }>
  // SLA optionnels
  sla_options: Array<{
    name: string
    days: number
    price_multiplier: number
  }>
  currency: Currency
  created_at: string
  updated_at: string
}

// ===== TYPES DE CALCUL =====

export interface RateCalculationRequest {
  tenant_id: string
  mode: TransportMode
  origin: string
  destination: string
  rate_basis: RateBasis
  weight_kg: number
  volume_m3: number
  declared_value?: number
  currency?: Currency
}

export interface RateCalculationResult {
  base_rate: number
  base_amount: number
  min_charge_applied: boolean
  min_charge_amount: number
  surcharges: {
    fuel: number
    security: number
    peak_season: number
    total: number
  }
  subtotal: number
  vat_rate: number
  vat_amount: number
  total: number
  currency: Currency
  rate_card_used: {
    id: string
    tier_applied: {
      min: number
      max: number | null
      price: number
    }
  }
}

export interface AddonCalculationResult {
  addon_id: string
  name: string
  pricing_type: PricingType
  unit_price: number
  quantity: number
  amount: number
  taxable: boolean
}

export interface QuoteCalculation {
  shipping: RateCalculationResult
  addons: AddonCalculationResult[]
  subtotal: number
  vat_amount: number
  total: number
  currency: Currency
  breakdown: {
    base_shipping: number
    surcharges: number
    addons: number
    vat: number
  }
}

// ===== CONTEXTE TENANT =====

export interface TenantContext {
  id: string
  name: string
  slug: string
  domain?: string
  currency_default: Currency
  vat_rate: number
  active: boolean
  settings: {
    allow_public_quotes: boolean
    require_registration: boolean
    auto_approve_quotes: boolean
    whatsapp_notifications: boolean
  }
}

// ===== MOCK DATA FACTORY =====

export class MultiTenantPricingMockData {
  static createOwnerPlans(): OwnerPlan[] {
    return [
      {
        id: 'owner-plan-1',
        name: 'Starter',
        slug: 'starter',
        price_month_eur: 29,
        price_year_eur: 290,
        features: ['50 expéditions/mois', '2 utilisateurs', 'Support email'],
        limits: {
          max_shipments_month: 50,
          max_users: 2,
          max_storage_gb: 5,
          api_calls_month: 1000,
          support_level: 'basic'
        },
        active: true,
        highlighted: false,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'owner-plan-2',
        name: 'Business',
        slug: 'business',
        price_month_eur: 79,
        price_year_eur: 790,
        features: ['200 expéditions/mois', '10 utilisateurs', 'Support prioritaire', 'API avancée'],
        limits: {
          max_shipments_month: 200,
          max_users: 10,
          max_storage_gb: 50,
          api_calls_month: 10000,
          support_level: 'premium'
        },
        active: true,
        highlighted: true,
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'owner-plan-3',
        name: 'Enterprise',
        slug: 'enterprise',
        price_month_eur: 199,
        price_year_eur: 1990,
        features: ['Expéditions illimitées', 'Utilisateurs illimités', 'Support dédié', 'Intégrations personnalisées'],
        limits: {
          max_users: -1,
          max_storage_gb: -1,
          api_calls_month: -1,
          support_level: 'enterprise'
        },
        active: true,
        highlighted: false,
        display_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  static createOwnerFeatureAddons(): OwnerFeatureAddon[] {
    return [
      {
        id: 'owner-feature-1',
        name: 'API Avancée',
        slug: 'advanced-api',
        description: 'Accès complet aux API avec webhooks et intégrations personnalisées',
        category: 'API',
        price_month_eur: 29,
        price_year_eur: 290,
        active: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'owner-feature-2',
        name: 'White-label Branding',
        slug: 'white-label',
        description: 'Personnalisation complète avec votre marque et domaine',
        category: 'White-label',
        price_month_eur: 199,
        price_year_eur: 1990,
        active: true,
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'owner-feature-3',
        name: 'Intégration ERP',
        slug: 'erp-integration',
        description: 'Connecteurs pour SAP, Oracle, Microsoft Dynamics',
        category: 'Integrations',
        price_month_eur: 99,
        price_year_eur: 990,
        active: true,
        display_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'owner-feature-4',
        name: 'Analytics Avancés',
        slug: 'advanced-analytics',
        description: 'Tableaux de bord personnalisés et rapports détaillés',
        category: 'Analytics',
        price_month_eur: 49,
        price_year_eur: 490,
        active: true,
        display_order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'owner-feature-5',
        name: 'SLA Garanti',
        slug: 'sla-guarantee',
        description: 'Support prioritaire avec SLA 99.9% et assistance dédiée',
        category: 'Support',
        price_month_eur: 79,
        price_year_eur: 790,
        active: true,
        display_order: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  static createOwnerServiceAddons(): OwnerServiceAddon[] {
    return [
      {
        id: 'owner-service-1',
        name: 'Assurance Transport',
        slug: 'insurance',
        description: 'Couverture complète des marchandises en transit',
        pricing_type: 'percent_of_value',
        price_eur: 0.02, // 2%
        unit_label: '% de la valeur',
        taxable: true,
        active: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'owner-service-2',
        name: 'Emballage Renforcé',
        slug: 'packaging',
        description: 'Emballage professionnel sécurisé',
        pricing_type: 'fixed',
        price_eur: 15,
        unit_label: '€/colis',
        taxable: true,
        active: true,
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'owner-service-3',
        name: 'Livraison Express',
        slug: 'express',
        description: 'Livraison prioritaire sous 48h',
        pricing_type: 'per_kg',
        price_eur: 2,
        unit_label: '€/kg',
        taxable: true,
        active: true,
        display_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'owner-service-4',
        name: 'Stockage Temporaire',
        slug: 'storage',
        description: 'Stockage en entrepôt jusqu\'à 30 jours',
        pricing_type: 'per_m3',
        price_eur: 5,
        unit_label: '€/m³/jour',
        taxable: true,
        active: true,
        display_order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  static createBillingSettings(): BillingSettings {
    return {
      id: 'billing-1',
      vat_rate: 0.20,
      annual_discount_rate: 0.10,
      currency_default: 'EUR',
      fx_eur_to_xof: 655.957,
      fx_eur_to_usd: 1.08,
      fx_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  static createTenantPlans(tenantId: string): TenantPlan[] {
    const ownerPlans = this.createOwnerPlans()
    return ownerPlans.map(plan => ({
      id: `tenant-plan-${plan.id}`,
      tenant_id: tenantId,
      owner_plan_id: plan.id,
      resell_price_month: Math.round(plan.price_month_eur * 1.35), // 35% de marge
      resell_price_year: Math.round(plan.price_year_eur * 1.35),
      margin_mode: 'percent' as MarginMode,
      margin_value: 35,
      active: true,
      is_public: true,
      notes: `Plan revendu avec marge de 35%`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_plan: plan
    }))
  }

  static createTenantFeatureSubscriptions(tenantId: string): TenantFeatureSubscription[] {
    // Exemple: l'entreprise a souscrit à 2 add-ons SaaS
    return [
      {
        id: `tenant-feature-sub-1`,
        tenant_id: tenantId,
        owner_feature_addon_id: 'owner-feature-1', // API Avancée
        subscribed_at: new Date().toISOString(),
        active: true
      },
      {
        id: `tenant-feature-sub-2`,
        tenant_id: tenantId,
        owner_feature_addon_id: 'owner-feature-4', // Analytics Avancés
        subscribed_at: new Date().toISOString(),
        active: true
      }
    ]
  }

  static createTenantServiceAddons(tenantId: string): TenantServiceAddon[] {
    // Services métier créés par l'entreprise pour ses clients finaux
    return [
      {
        id: `tenant-service-1`,
        tenant_id: tenantId,
        name: 'Assurance Cargo Premium',
        slug: 'assurance-cargo',
        description: 'Couverture complète jusqu\'à 50 000€ avec garantie vol et casse',
        pricing_type: 'percent_of_value',
        price: 0.025, // 2.5% en FCFA
        currency: 'XOF',
        unit_label: '% de la valeur déclarée',
        taxable: true,
        active: true,
        is_public: true,
        display_order: 1,
        owner_service_addon_id: 'owner-service-1',
        margin_mode: 'percent',
        margin_value: 25,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `tenant-service-2`,
        tenant_id: tenantId,
        name: 'Emballage Sécurisé',
        slug: 'emballage-securise',
        description: 'Emballage professionnel avec film plastique et marquage fragile',
        pricing_type: 'fixed',
        price: 5250, // 15€ * 350 (taux EUR->XOF approximatif)
        currency: 'XOF',
        unit_label: 'FCFA/colis',
        taxable: true,
        active: true,
        is_public: true,
        display_order: 2,
        owner_service_addon_id: 'owner-service-2',
        margin_mode: 'percent',
        margin_value: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `tenant-service-3`,
        tenant_id: tenantId,
        name: 'Livraison à Domicile',
        slug: 'livraison-domicile',
        description: 'Livraison directe à votre domicile dans Dakar et banlieue',
        pricing_type: 'fixed',
        price: 15750, // Service local, prix fixe
        currency: 'XOF',
        unit_label: 'FCFA/livraison',
        taxable: true,
        active: true,
        is_public: true,
        display_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `tenant-service-4`,
        tenant_id: tenantId,
        name: 'Stockage Temporaire',
        slug: 'stockage-temporaire',
        description: 'Stockage sécurisé en entrepôt climatisé jusqu\'à 30 jours',
        pricing_type: 'per_m3',
        price: 1050, // 3€ * 350
        currency: 'XOF',
        unit_label: 'FCFA/m³/jour',
        taxable: true,
        active: true,
        is_public: true,
        display_order: 4,
        owner_service_addon_id: 'owner-service-4',
        margin_mode: 'percent',
        margin_value: 40,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `tenant-service-5`,
        tenant_id: tenantId,
        name: 'Dédouanement Express',
        slug: 'dedouanement-express',
        description: 'Procédures douanières accélérées avec suivi prioritaire',
        pricing_type: 'fixed',
        price: 26250, // Service local premium
        currency: 'XOF',
        unit_label: 'FCFA/dossier',
        taxable: true,
        active: true,
        is_public: true,
        display_order: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  static createTenantRateCards(tenantId: string): TenantRateCard[] {
    return [
      // Chine → Sénégal par avion
      {
        id: `rate-card-1`,
        tenant_id: tenantId,
        mode: 'air',
        origin_region: 'Asia',
        origin_country: 'China',
        origin_city: 'Shenzhen',
        destination_region: 'Africa',
        destination_country: 'Senegal',
        destination_city: 'Dakar',
        rate_basis: 'per_kg',
        tiers: [
          { min: 0, max: 100, price: 6.50 },
          { min: 100, max: 500, price: 5.80 },
          { min: 500, max: null, price: 5.20 }
        ],
        min_charge: 50,
        fuel_surcharge_percent: 8,
        security_surcharge_percent: 2,
        peak_season_surcharge_percent: 0,
        currency: 'EUR',
        active: true,
        valid_from: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      // Chine → Sénégal par mer
      {
        id: `rate-card-2`,
        tenant_id: tenantId,
        mode: 'sea',
        origin_region: 'Asia',
        origin_country: 'China',
        origin_city: 'Guangzhou',
        destination_region: 'Africa',
        destination_country: 'Senegal',
        destination_city: 'Dakar',
        rate_basis: 'per_m3',
        tiers: [
          { min: 0, max: 10, price: 85 },
          { min: 10, max: 50, price: 75 },
          { min: 50, max: null, price: 65 }
        ],
        min_charge: 120,
        fuel_surcharge_percent: 15,
        security_surcharge_percent: 3,
        peak_season_surcharge_percent: 5,
        currency: 'EUR',
        active: true,
        valid_from: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      // Chine → Côte d'Ivoire par avion
      {
        id: `rate-card-3`,
        tenant_id: tenantId,
        mode: 'air',
        origin_region: 'Asia',
        origin_country: 'China',
        destination_region: 'Africa',
        destination_country: 'Ivory Coast',
        destination_city: 'Abidjan',
        rate_basis: 'per_kg',
        tiers: [
          { min: 0, max: 100, price: 7.20 },
          { min: 100, max: 500, price: 6.50 },
          { min: 500, max: null, price: 5.90 }
        ],
        min_charge: 60,
        fuel_surcharge_percent: 8,
        security_surcharge_percent: 2,
        peak_season_surcharge_percent: 0,
        currency: 'EUR',
        active: true,
        valid_from: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  static createTenantRateRules(tenantId: string): TenantRateRules {
    return {
      id: `rate-rules-${tenantId}`,
      tenant_id: tenantId,
      rounding_mode: 'up',
      rounding_precision: 0.01,
      min_invoice_amount: 25,
      volume_discount_tiers: [
        { min_volume: 1000, discount_percent: 5 },
        { min_volume: 5000, discount_percent: 10 },
        { min_volume: 10000, discount_percent: 15 }
      ],
      sla_options: [
        { name: 'Standard', days: 15, price_multiplier: 1.0 },
        { name: 'Express', days: 7, price_multiplier: 1.5 },
        { name: 'Urgent', days: 3, price_multiplier: 2.0 }
      ],
      currency: 'EUR',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  static createTenantContext(id: string): TenantContext {
    return {
      id,
      name: 'NextMove Cargo Chine-Afrique',
      slug: 'nextmove-chine-afrique',
      domain: 'ch-afrique.nextmove.com',
      currency_default: 'EUR',
      vat_rate: 0.20,
      active: true,
      settings: {
        allow_public_quotes: true,
        require_registration: false,
        auto_approve_quotes: false,
        whatsapp_notifications: true
      }
    }
  }
}

// ===== CALCULATEUR DE TARIFS =====

// Exports pour compatibilité avec les pages existantes
export const mockOwnerPlans = MultiTenantPricingMockData.createOwnerPlans()
export const mockOwnerFeatureAddons = MultiTenantPricingMockData.createOwnerFeatureAddons()

// Alias pour TenantAddon (utilise TenantServiceAddon)
export type TenantAddon = TenantServiceAddon
// Alias pour OwnerAddon (utilise OwnerFeatureAddon)
export type OwnerAddon = OwnerFeatureAddon

export class PricingCalculator {
  static calculateShippingRate(
    request: RateCalculationRequest, 
    rateCard: TenantRateCard,
    rules: TenantRateRules
  ): RateCalculationResult {
    const quantity = request.rate_basis === 'per_kg' ? request.weight_kg : request.volume_m3
    
    // Trouver le palier applicable
    const tier = rateCard.tiers.find(t => 
      quantity >= t.min && (t.max === null || quantity <= t.max)
    ) || rateCard.tiers[rateCard.tiers.length - 1]

    // Calcul de base
    const baseAmount = quantity * tier.price
    const minChargeApplied = baseAmount < rateCard.min_charge
    const chargeableAmount = Math.max(baseAmount, rateCard.min_charge)

    // Surcharges
    const fuelSurcharge = chargeableAmount * (rateCard.fuel_surcharge_percent / 100)
    const securitySurcharge = chargeableAmount * (rateCard.security_surcharge_percent / 100)
    const peakSeasonSurcharge = chargeableAmount * (rateCard.peak_season_surcharge_percent / 100)
    const totalSurcharges = fuelSurcharge + securitySurcharge + peakSeasonSurcharge

    const subtotal = chargeableAmount + totalSurcharges
    
    // TVA (peut être différente selon le tenant)
    const vatRate = 0.20 // À récupérer depuis le contexte tenant
    const vatAmount = subtotal * vatRate
    const total = subtotal + vatAmount

    return {
      base_rate: tier.price,
      base_amount: baseAmount,
      min_charge_applied: minChargeApplied,
      min_charge_amount: rateCard.min_charge,
      surcharges: {
        fuel: fuelSurcharge,
        security: securitySurcharge,
        peak_season: peakSeasonSurcharge,
        total: totalSurcharges
      },
      subtotal,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      total,
      currency: rateCard.currency,
      rate_card_used: {
        id: rateCard.id,
        tier_applied: tier
      }
    }
  }

  static calculateServiceAddon(
    addon: TenantServiceAddon,
    quantity: number,
    weight_kg: number,
    volume_m3: number,
    declared_value: number = 0
  ): AddonCalculationResult {
    let amount = 0
    let unitPrice = addon.price

    switch (addon.pricing_type) {
      case 'fixed':
        amount = unitPrice * quantity
        break
      case 'per_kg':
        amount = unitPrice * weight_kg
        quantity = weight_kg
        break
      case 'per_m3':
        amount = unitPrice * volume_m3
        quantity = volume_m3
        break
      case 'percent_of_value':
        amount = declared_value * unitPrice
        quantity = 1
        unitPrice = amount
        break
    }

    return {
      addon_id: addon.id,
      name: addon.name,
      pricing_type: addon.pricing_type,
      unit_price: unitPrice,
      quantity,
      amount,
      taxable: addon.taxable
    }
  }

  static calculateQuote(
    shippingResult: RateCalculationResult,
    addonResults: AddonCalculationResult[],
    vatRate: number = 0.20
  ): QuoteCalculation {
    const shippingSubtotal = shippingResult.subtotal - shippingResult.vat_amount
    const addonsSubtotal = addonResults.reduce((sum, addon) => sum + addon.amount, 0)
    
    const subtotal = shippingSubtotal + addonsSubtotal
    const vatAmount = subtotal * vatRate
    const total = subtotal + vatAmount

    return {
      shipping: shippingResult,
      addons: addonResults,
      subtotal,
      vat_amount: vatAmount,
      total,
      currency: shippingResult.currency,
      breakdown: {
        base_shipping: shippingSubtotal,
        surcharges: shippingResult.surcharges.total,
        addons: addonsSubtotal,
        vat: vatAmount
      }
    }
  }
}
