import { TransportMode } from '@prisma/client'
import { CompanySettings } from '@/types'

/**
 * Calculate CBM (Cubic Meter) for maritime shipping
 * @param length Length value
 * @param width Width value
 * @param height Height value
 * @param unit Unit of measurement ('cm' or 'm')
 * @returns CBM in m³
 */
export function calculateCBM(length: number, width: number, height: number, unit: 'cm' | 'm' = 'cm'): number {
  let lengthM: number, widthM: number, heightM: number

  if (unit === 'cm') {
    // Convert cm to m
    lengthM = length / 100
    widthM = width / 100
    heightM = height / 100
  } else {
    // Already in meters
    lengthM = length
    widthM = width
    heightM = height
  }

  // Calculate volume in m³
  return lengthM * widthM * heightM
}

/**
 * Calculate CBM with detailed information including conversion details
 * @param length Length value
 * @param width Width value  
 * @param height Height value
 * @param unit Unit of measurement ('cm' or 'm')
 * @returns Object with CBM result and conversion details
 */
export function calculateCBMWithDetails(
  length: number, 
  width: number, 
  height: number, 
  unit: 'cm' | 'm' = 'cm'
): {
  cbm: number
  unit: string
  formula: string
  conversion?: string
  dimensions: {
    length: number
    width: number
    height: number
    unit: 'cm' | 'm'
  }
  dimensionsInMeters: {
    length: number
    width: number
    height: number
  }
} {
  let lengthM: number, widthM: number, heightM: number
  let conversion: string | undefined

  if (unit === 'cm') {
    // Convert cm to m
    lengthM = length / 100
    widthM = width / 100
    heightM = height / 100
    conversion = `Conversion: ${length}cm × ${width}cm × ${height}cm → ${lengthM}m × ${widthM}m × ${heightM}m`
  } else {
    // Already in meters
    lengthM = length
    widthM = width
    heightM = height
  }

  const cbm = lengthM * widthM * heightM

  return {
    cbm,
    unit: 'm³',
    formula: `${lengthM}m × ${widthM}m × ${heightM}m = ${cbm.toFixed(6)} m³`,
    conversion,
    dimensions: {
      length,
      width,
      height,
      unit
    },
    dimensionsInMeters: {
      length: lengthM,
      width: widthM,
      height: heightM
    }
  }
}

/**
 * Calculate shipping price based on transport mode and new pricing rules
 * Aérien/Aérien Express: basé sur le poids (kg)
 * Maritime/Maritime Express: basé sur le CBM (m³)
 */
export function calculateShippingPrice(
  transportMode: TransportMode,
  weight: number,
  cbm: number | null,
  settings: CompanySettings,
  customRates?: {
    aerialPerKg?: number
    aerialExpressPerKg?: number
    maritimePerCbm?: number
    maritimeExpressPerCbm?: number
  }
): number {
  const rates = {
    aerialPerKg: customRates?.aerialPerKg || settings.aerialPricePerKg,
    aerialExpressPerKg: customRates?.aerialExpressPerKg || settings.aerialPricePerKg * 1.5,
    maritimePerCbm: customRates?.maritimePerCbm || settings.maritimePricePerCbm,
    maritimeExpressPerCbm: customRates?.maritimeExpressPerCbm || settings.maritimePricePerCbm * 1.3
  }

  switch (transportMode) {
    case 'AERIAL':
      return weight * rates.aerialPerKg
    
    case 'AERIAL_EXPRESS':
      return weight * rates.aerialExpressPerKg
    
    case 'MARITIME':
      if (!cbm) return 0
      return cbm * rates.maritimePerCbm
    
    case 'MARITIME_EXPRESS':
      if (!cbm) return 0
      return cbm * rates.maritimeExpressPerCbm
    
    default:
      return 0
  }
}

/**
 * Délais de livraison par mode de transport
 */
export const DELIVERY_DELAYS = {
  AERIAL: { min: 4, max: 7 }, // 4 à 7 jours
  AERIAL_EXPRESS: { min: 1, max: 3 }, // 1 à 3 jours
  MARITIME: { min: 45, max: 60 }, // 45 à 60 jours
  MARITIME_EXPRESS: { min: 30, max: 45 } // 30 à 45 jours
} as const

/**
 * Calculate estimated arrival date based on transport mode with new delivery delays
 * Retourne une plage de dates (min-max)
 */
export function calculateETA(
  transportMode: TransportMode,
  departureDate: Date,
  useMinDelay: boolean = false
): Date {
  const eta = new Date(departureDate)
  const delays = DELIVERY_DELAYS[transportMode]
  
  if (!delays) {
    // Fallback pour les anciens modes
    eta.setDate(eta.getDate() + 7)
    return eta
  }
  
  // Utiliser le délai minimum ou maximum selon le paramètre
  const daysToAdd = useMinDelay ? delays.min : delays.max
  eta.setDate(eta.getDate() + daysToAdd)
  
  return eta
}

/**
 * Calculate ETA range (min and max dates)
 */
export function calculateETARange(
  transportMode: TransportMode,
  departureDate: Date
): { minETA: Date; maxETA: Date; delayRange: string } {
  const delays = DELIVERY_DELAYS[transportMode]
  
  if (!delays) {
    const fallbackETA = new Date(departureDate)
    fallbackETA.setDate(fallbackETA.getDate() + 7)
    return {
      minETA: fallbackETA,
      maxETA: fallbackETA,
      delayRange: '7 jours'
    }
  }
  
  const minETA = new Date(departureDate)
  const maxETA = new Date(departureDate)
  
  minETA.setDate(minETA.getDate() + delays.min)
  maxETA.setDate(maxETA.getDate() + delays.max)
  
  return {
    minETA,
    maxETA,
    delayRange: `${delays.min} à ${delays.max} jours`
  }
}

/**
 * Generate auto-incremented IDs
 */
export function generateClientId(lastId: string | null): string {
  if (!lastId) return 'CL-001'
  
  const match = lastId.match(/CL-(\d+)/)
  if (!match) return 'CL-001'
  
  const num = parseInt(match[1]) + 1
  return `CL-${num.toString().padStart(3, '0')}`
}

export function generatePackageId(lastId: string | null): string {
  if (!lastId) return 'CO-001'
  
  const match = lastId.match(/CO-(\d+)/)
  if (!match) return 'CO-001'
  
  const num = parseInt(match[1]) + 1
  return `CO-${num.toString().padStart(3, '0')}`
}

export function generateCargoId(lastId: string | null): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  
  if (!lastId) return `CG${year}${month}001`
  
  const match = lastId.match(/CG\d{4}(\d+)/)
  if (!match) return `CG${year}${month}001`
  
  const num = parseInt(match[1]) + 1
  return `CG${year}${month}${num.toString().padStart(3, '0')}`
}

/**
 * Generate 6-character alphanumeric tracking PIN
 */
export function generateTrackingPin(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency = '€'): string {
  return `${currency}${amount.toFixed(2)}`
}

/**
 * Format weight
 */
export function formatWeight(weight: number): string {
  return `${weight} kg`
}

/**
 * Format CBM
 */
export function formatCBM(cbm: number): string {
  return `${cbm.toFixed(3)} m³`
}

/**
 * Format ETA range
 */
export function formatETARange(minETA: Date, maxETA: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }
  
  const minDate = minETA.toLocaleDateString('fr-FR', options)
  const maxDate = maxETA.toLocaleDateString('fr-FR', options)
  
  return `${minDate} - ${maxDate}`
}

/**
 * Get transport mode label in French
 */
export function getTransportModeLabel(mode: TransportMode): string {
  const labels: Record<TransportMode, string> = {
    AERIAL: 'Aérien',
    AERIAL_EXPRESS: 'Aérien Express',
    MARITIME: 'Maritime',
    MARITIME_EXPRESS: 'Maritime Express'
  }
  
  return labels[mode] || mode
}

/**
 * Get delivery delay text
 */
export function getDeliveryDelayText(mode: TransportMode): string {
  const delays = DELIVERY_DELAYS[mode]
  if (!delays) return 'Délai non défini'
  
  return `${delays.min} à ${delays.max} jours`
}
