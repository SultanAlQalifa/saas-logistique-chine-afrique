import { TransportMode } from '@prisma/client'
import { PricingRule, PricingCalculation, CBMCalculation, WeightCalculation, PricingZone, PricingModifier } from '@/types/pricing'
import { DELIVERY_DELAYS, calculateETARange, getDeliveryDelayText } from './calculations'

/**
 * Moteur de tarification avancé avec contrôle total
 */
export class PricingEngine {
  private rules: PricingRule[]
  private zones: PricingZone[]
  private modifiers: PricingModifier[]

  constructor(rules: PricingRule[], zones: PricingZone[] = [], modifiers: PricingModifier[] = []) {
    this.rules = rules
    this.zones = zones
    this.modifiers = modifiers
  }

  /**
   * Calcul CBM selon vos règles : dimensions en cm → m³
   */
  calculateCBM(length: number, width: number, height: number): CBMCalculation {
    // Conversion cm → m
    const lengthM = length / 100
    const widthM = width / 100
    const heightM = height / 100
    
    const cbm = lengthM * widthM * heightM
    
    return {
      length,
      width,
      height,
      cbm,
      formula: `(${length}cm × ${width}cm × ${height}cm) ÷ 1,000,000 = ${cbm.toFixed(6)} m³`
    }
  }

  /**
   * Calcul du poids facturable pour aérien (poids volumétrique vs réel)
   */
  calculateChargeableWeight(actualWeight: number, dimensions?: { length: number, width: number, height: number }): WeightCalculation {
    let volumetricWeight: number | undefined
    let chargeableWeight = actualWeight

    // Pour l'aérien, calculer le poids volumétrique (facteur 6000 standard)
    if (dimensions) {
      const volumeCm3 = dimensions.length * dimensions.width * dimensions.height
      volumetricWeight = volumeCm3 / 6000 // Facteur standard aérien
      chargeableWeight = Math.max(actualWeight, volumetricWeight)
    }

    return {
      actualWeight,
      volumetricWeight,
      chargeableWeight
    }
  }

  /**
   * Calcul de prix selon vos règles :
   * - Aérien/Aérien Express : basé sur le poids (kg)
   * - Maritime/Maritime Express : basé sur le CBM (m³)
   */
  calculatePrice(
    transportMode: TransportMode,
    weight: number,
    dimensions?: { length: number, width: number, height: number },
    destination?: string,
    departureDate?: Date
  ): PricingCalculation {
    // Trouver la règle active pour ce mode de transport
    const rule = this.rules.find(r => 
      r.transportMode === transportMode && 
      r.isActive &&
      new Date() >= r.validFrom &&
      (!r.validTo || new Date() <= r.validTo)
    )

    if (!rule) {
      throw new Error(`Aucune règle de tarification trouvée pour ${transportMode}`)
    }

    let calculationBase: number
    let calculationMethod: 'WEIGHT' | 'CBM'
    let unit: string

    // Application de vos règles de calcul
    if (transportMode === 'AERIAL' || transportMode === 'AERIAL_EXPRESS') {
      // Aérien : basé uniquement sur le poids réel (pas de poids volumétrique)
      calculationBase = weight
      calculationMethod = 'WEIGHT'
      unit = 'kg'
    } else {
      // Maritime : basé sur le CBM
      if (!dimensions) {
        throw new Error('Dimensions requises pour le calcul maritime')
      }
      const cbmCalc = this.calculateCBM(dimensions.length, dimensions.width, dimensions.height)
      calculationBase = cbmCalc.cbm
      calculationMethod = 'CBM'
      unit = 'm³'
    }

    // Calcul du prix de base
    let basePrice = calculationBase * rule.basePrice

    // Application du minimum
    if (basePrice < rule.minimumCharge) {
      basePrice = rule.minimumCharge
    }

    // Application du maximum si défini
    if (rule.maximumCharge && basePrice > rule.maximumCharge) {
      basePrice = rule.maximumCharge
    }

    // Application des modificateurs
    const appliedModifiers: Array<{
      name: string
      type: string
      value: number
      appliedAmount: number
    }> = []

    let modifiedPrice = basePrice

    for (const modifier of this.modifiers.filter(m => m.isActive)) {
      if (this.shouldApplyModifier(modifier, calculationBase, calculationMethod, destination)) {
        let appliedAmount = 0
        
        if (modifier.type === 'PERCENTAGE') {
          appliedAmount = modifiedPrice * (modifier.value / 100)
        } else {
          appliedAmount = modifier.value
        }

        modifiedPrice += appliedAmount
        
        appliedModifiers.push({
          name: modifier.name,
          type: modifier.type,
          value: modifier.value,
          appliedAmount
        })
      }
    }

    // Application du multiplicateur de zone
    let zoneMultiplier = 1
    if (destination) {
      const zone = this.zones.find(z => 
        z.isActive && z.countries.some(country => 
          country.toLowerCase().includes(destination.toLowerCase())
        )
      )
      if (zone) {
        zoneMultiplier = zone.multiplier
      }
    }

    const finalPrice = modifiedPrice * zoneMultiplier

    // Calcul des délais de livraison
    const delays = DELIVERY_DELAYS[transportMode]
    const deliveryDelay = delays ? {
      min: delays.min,
      max: delays.max,
      text: getDeliveryDelayText(transportMode)
    } : {
      min: 7,
      max: 7,
      text: '7 jours'
    }

    // Calcul des dates de livraison estimées
    const departure = departureDate || new Date()
    const etaRange = calculateETARange(transportMode, departure)

    return {
      basePrice,
      modifiers: appliedModifiers,
      zoneMultiplier,
      finalPrice,
      calculationMethod,
      calculationBase,
      unit,
      deliveryDelay,
      estimatedDelivery: {
        minDate: etaRange.minETA,
        maxDate: etaRange.maxETA,
        range: etaRange.delayRange
      }
    }
  }

  /**
   * Vérifie si un modificateur doit être appliqué
   */
  private shouldApplyModifier(
    modifier: PricingModifier,
    calculationBase: number,
    calculationMethod: 'WEIGHT' | 'CBM',
    destination?: string
  ): boolean {
    switch (modifier.condition) {
      case 'WEIGHT_RANGE':
        if (calculationMethod !== 'WEIGHT') return false
        const [minWeight, maxWeight] = modifier.conditionValue.split('-').map(Number)
        return calculationBase >= minWeight && calculationBase <= maxWeight

      case 'CBM_RANGE':
        if (calculationMethod !== 'CBM') return false
        const [minCbm, maxCbm] = modifier.conditionValue.split('-').map(Number)
        return calculationBase >= minCbm && calculationBase <= maxCbm

      case 'DESTINATION':
        if (!destination) return false
        return destination.toLowerCase().includes(modifier.conditionValue.toLowerCase())

      case 'URGENCY':
        // À implémenter selon vos besoins
        return false

      case 'PACKAGE_TYPE':
        // À implémenter selon vos besoins
        return false

      default:
        return false
    }
  }

  /**
   * Ajouter une nouvelle règle de tarification
   */
  addRule(rule: PricingRule): void {
    this.rules.push(rule)
  }

  /**
   * Mettre à jour une règle existante
   */
  updateRule(ruleId: string, updates: Partial<PricingRule>): void {
    const index = this.rules.findIndex(r => r.id === ruleId)
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates, updatedAt: new Date() }
    }
  }

  /**
   * Désactiver une règle
   */
  deactivateRule(ruleId: string): void {
    this.updateRule(ruleId, { isActive: false })
  }

  /**
   * Obtenir toutes les règles actives
   */
  getActiveRules(): PricingRule[] {
    return this.rules.filter(r => r.isActive)
  }

  /**
   * Obtenir les règles par mode de transport
   */
  getRulesByTransportMode(transportMode: TransportMode): PricingRule[] {
    return this.rules.filter(r => r.transportMode === transportMode && r.isActive)
  }
}

/**
 * Instance par défaut avec règles de base
 */
export function createDefaultPricingEngine(): PricingEngine {
  const defaultRules: PricingRule[] = [
    {
      id: 'aerial-basic',
      name: 'Aérien Standard',
      transportMode: 'AERIAL',
      calculationMethod: 'WEIGHT',
      basePrice: 8.50, // €/kg
      unit: 'kg',
      minimumCharge: 50,
      maximumCharge: 1000,
      isActive: true,
      validFrom: new Date(),
      description: 'Tarif aérien standard basé sur le poids',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'aerial-express',
      name: 'Aérien Express',
      transportMode: 'AERIAL_EXPRESS',
      calculationMethod: 'WEIGHT',
      basePrice: 12.75, // €/kg
      unit: 'kg',
      minimumCharge: 75,
      maximumCharge: 1500,
      isActive: true,
      validFrom: new Date(),
      description: 'Tarif aérien express basé sur le poids',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'maritime-basic',
      name: 'Maritime Standard',
      transportMode: 'MARITIME',
      calculationMethod: 'CBM',
      basePrice: 150, // €/m³
      unit: 'm3',
      minimumCharge: 100,
      maximumCharge: 5000,
      isActive: true,
      validFrom: new Date(),
      description: 'Tarif maritime standard basé sur le CBM',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'maritime-express',
      name: 'Maritime Express',
      transportMode: 'MARITIME_EXPRESS',
      calculationMethod: 'CBM',
      basePrice: 195, // €/m³
      unit: 'm3',
      minimumCharge: 130,
      maximumCharge: 6500,
      isActive: true,
      validFrom: new Date(),
      description: 'Tarif maritime express basé sur le CBM',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  const defaultZones: PricingZone[] = [
    {
      id: 'afrique-ouest',
      name: 'Afrique de l\'Ouest',
      countries: ['Sénégal', 'Côte d\'Ivoire', 'Ghana', 'Nigeria', 'Bénin', 'Togo'],
      multiplier: 1.0,
      isActive: true,
      description: 'Zone standard Afrique de l\'Ouest'
    },
    {
      id: 'afrique-centrale',
      name: 'Afrique Centrale',
      countries: ['Cameroun', 'Gabon', 'Congo', 'RDC', 'Tchad'],
      multiplier: 1.2,
      isActive: true,
      description: 'Zone Afrique Centrale avec supplément'
    }
  ]

  const defaultModifiers: PricingModifier[] = [
    {
      id: 'heavy-package',
      name: 'Colis lourd',
      type: 'PERCENTAGE',
      value: 15, // +15%
      condition: 'WEIGHT_RANGE',
      conditionValue: '100-1000',
      isActive: true,
      description: 'Supplément pour colis de 100kg à 1000kg'
    },
    {
      id: 'large-volume',
      name: 'Gros volume',
      type: 'PERCENTAGE',
      value: 10, // +10%
      condition: 'CBM_RANGE',
      conditionValue: '5-50',
      isActive: true,
      description: 'Supplément pour volumes de 5m³ à 50m³'
    }
  ]

  return new PricingEngine(defaultRules, defaultZones, defaultModifiers)
}
