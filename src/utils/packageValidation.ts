import { Package } from '@/types'

/**
 * Vérifie si un colis peut être livré ou récupéré
 * Conditions requises :
 * 1. POD validé (podValidated = true)
 * 2. Paiement 100% effectué (paymentStatus = 'COMPLETED')
 */
export function canPackageBeDelivered(pkg: Package): boolean {
  const isPodValidated = pkg.podValidated === true
  const isPaymentCompleted = pkg.paymentStatus === 'COMPLETED'
  
  return isPodValidated && isPaymentCompleted
}

/**
 * Calcule le statut de livraison d'un colis avec les raisons du blocage
 */
export function getDeliveryStatus(pkg: Package): {
  canDeliver: boolean
  reasons: string[]
  status: 'READY' | 'BLOCKED' | 'PARTIAL'
} {
  const reasons: string[] = []
  
  if (!pkg.podValidated) {
    reasons.push('POD non validé')
  }
  
  if (pkg.paymentStatus !== 'COMPLETED') {
    if (pkg.paymentStatus === 'PENDING') {
      reasons.push('Paiement en attente')
    } else if (pkg.paymentStatus === 'PARTIAL') {
      reasons.push('Paiement partiel - solde requis')
    }
  }
  
  const canDeliver = reasons.length === 0
  
  return {
    canDeliver,
    reasons,
    status: canDeliver ? 'READY' : (reasons.length === 1 ? 'PARTIAL' : 'BLOCKED')
  }
}

/**
 * Met à jour le statut de livraison d'un colis
 */
export function updatePackageDeliveryStatus(pkg: Package): Package {
  const deliveryStatus = getDeliveryStatus(pkg)
  
  return {
    ...pkg,
    canBeDelivered: deliveryStatus.canDeliver
  }
}

/**
 * Valide le POD d'un colis
 */
export function validatePOD(pkg: Package, validatedBy: string): Package {
  return {
    ...pkg,
    podValidated: true,
    podValidatedAt: new Date(),
    podValidatedBy: validatedBy,
    canBeDelivered: canPackageBeDelivered({
      ...pkg,
      podValidated: true
    })
  }
}

/**
 * Met à jour le statut de paiement d'un colis
 */
export function updatePaymentStatus(
  pkg: Package, 
  paymentAmount: number, 
  paymentStatus: 'PENDING' | 'PARTIAL' | 'COMPLETED'
): Package {
  const finalPrice = pkg.finalPrice || 0
  const remainingAmount = Math.max(0, finalPrice - paymentAmount)
  
  const updatedPackage = {
    ...pkg,
    paymentAmount,
    paymentStatus,
    remainingAmount,
  }
  
  return {
    ...updatedPackage,
    canBeDelivered: canPackageBeDelivered(updatedPackage)
  }
}
