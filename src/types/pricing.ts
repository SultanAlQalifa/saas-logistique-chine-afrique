export interface PricingRule {
  id: string
  name: string
  transportMode: 'AERIAL' | 'AERIAL_EXPRESS' | 'MARITIME' | 'MARITIME_EXPRESS'
  calculationMethod: 'WEIGHT' | 'CBM'
  basePrice: number
  unit: 'kg' | 'm3'
  minimumCharge: number
  maximumCharge?: number
  isActive: boolean
  validFrom: Date
  validTo?: Date
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface PricingZone {
  id: string
  name: string
  countries: string[]
  multiplier: number
  isActive: boolean
  description?: string
}

export interface PricingModifier {
  id: string
  name: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number
  condition: 'WEIGHT_RANGE' | 'CBM_RANGE' | 'DESTINATION' | 'URGENCY' | 'PACKAGE_TYPE'
  conditionValue: string
  isActive: boolean
  description?: string
}

export interface PricingCalculation {
  basePrice: number
  modifiers: {
    name: string
    type: string
    value: number
    appliedAmount: number
  }[]
  zoneMultiplier: number
  finalPrice: number
  calculationMethod: 'WEIGHT' | 'CBM'
  calculationBase: number
  unit: string
  deliveryDelay: {
    min: number
    max: number
    text: string
  }
  estimatedDelivery: {
    minDate: Date
    maxDate: Date
    range: string
  }
}

export interface PricingSettings {
  companyId: string
  currency: string
  taxRate: number
  defaultRules: PricingRule[]
  zones: PricingZone[]
  modifiers: PricingModifier[]
  autoCalculation: boolean
  allowManualOverride: boolean
  requireApprovalThreshold?: number
  updatedAt: Date
}

export interface PricingHistory {
  id: string
  packageId: string
  originalPrice: number
  finalPrice: number
  appliedRules: string[]
  modifiedBy: string
  modifiedAt: Date
  reason?: string
}

export interface CBMCalculation {
  length: number // en cm
  width: number  // en cm
  height: number // en cm
  cbm: number    // en m³
  formula: string
}

export interface WeightCalculation {
  actualWeight: number    // en kg
  volumetricWeight?: number // en kg (pour aérien)
  chargeableWeight: number  // poids facturable
}

export interface PricingQuote {
  id: string
  clientId: string
  transportMode: 'AERIAL' | 'AERIAL_EXPRESS' | 'MARITIME' | 'MARITIME_EXPRESS'
  origin: string
  destination: string
  weight: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  cbm?: number
  calculatedPrice: PricingCalculation
  validUntil: Date
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'EXPIRED'
  createdAt: Date
  createdBy: string
}
