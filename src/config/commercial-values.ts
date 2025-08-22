// Configuration des valeurs commerciales pour le lancement
// Tarifs et paramètres commerciaux de NextMove Cargo

export const COMMERCIAL_CONFIG = {
  // Informations de l'entreprise
  company: {
    name: 'NextMove Cargo',
    legalName: 'NextMove Cargo SARL',
    address: 'Dakar, Sénégal',
    phone: '+221776581741',
    email: 'contact@nextmovecargo.com',
    website: 'https://nextmovecargo.com',
    siret: 'SN-2024-NMC-001', // À remplacer par le vrai SIRET
    tva: 'SN123456789', // À remplacer par le vrai numéro TVA
  },

  // Tarification transport (en FCFA)
  shipping: {
    // Tarifs par kg Chine -> Afrique
    pricePerKg: {
      maritime: 850, // FCFA/kg par voie maritime
      aerien: 2500,  // FCFA/kg par voie aérienne
      express: 4200  // FCFA/kg express
    },
    
    // Frais fixes
    fixedFees: {
      handling: 5000,        // Frais de manutention
      documentation: 3000,   // Frais de documentation
      insurance: 2000,       // Assurance de base
      customs: 8000,         // Frais de douane
      delivery: 4000         // Livraison locale
    },
    
    // Seuils de poids pour tarification dégressive
    weightTiers: [
      { min: 0, max: 10, discount: 0 },      // 0-10kg: tarif normal
      { min: 10, max: 50, discount: 0.05 },  // 10-50kg: -5%
      { min: 50, max: 100, discount: 0.10 }, // 50-100kg: -10%
      { min: 100, max: 500, discount: 0.15 }, // 100-500kg: -15%
      { min: 500, max: Infinity, discount: 0.20 } // +500kg: -20%
    ],
    
    // Zones de livraison
    deliveryZones: {
      dakar: { price: 2000, name: 'Dakar' },
      banlieue: { price: 3500, name: 'Banlieue Dakar' },
      regions: { price: 8000, name: 'Régions Sénégal' },
      international: { price: 15000, name: 'International' }
    }
  },

  // Commissions agents (en pourcentage)
  commissions: {
    agent: 0.08,        // 8% pour les agents
    superAgent: 0.12,   // 12% pour les super agents
    partner: 0.15,      // 15% pour les partenaires
    referral: 0.03      // 3% pour les parrainages
  },

  // Paramètres de paiement
  payment: {
    // Mobile Money - Frais en pourcentage
    mobileMoney: {
      orangeMoney: 0.015,  // 1.5%
      freeMoney: 0.012,    // 1.2%
      wave: 0.01,          // 1%
      mtnMoney: 0.018      // 1.8%
    },
    
    // Seuils de paiement
    minimumAmount: 1000,    // Montant minimum 1000 FCFA
    maximumAmount: 5000000, // Montant maximum 5M FCFA
    
    // Délais de traitement
    processingDays: {
      standard: 2,  // 2 jours ouvrés
      express: 1,   // 1 jour ouvré
      urgent: 0     // Même jour
    }
  },

  // TVA et taxes
  taxes: {
    tva: 0.18,           // TVA 18% Sénégal
    customsDuty: 0.20,   // Droits de douane 20%
    handlingTax: 0.05    // Taxe de manutention 5%
  },

  // Limites opérationnelles
  limits: {
    maxPackageWeight: 1000,    // 1000kg max par colis
    maxPackageValue: 10000000, // 10M FCFA max par colis
    maxMonthlyVolume: 50000,   // 50 tonnes max par mois
    minInsuranceValue: 50000   // Assurance minimum 50k FCFA
  },

  // Paramètres de service
  service: {
    // Horaires d'ouverture
    businessHours: {
      start: '08:00',
      end: '18:00',
      timezone: 'Africa/Dakar',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    
    // SLA (Service Level Agreement)
    sla: {
      responseTime: 2,      // 2h max pour répondre
      resolutionTime: 24,   // 24h max pour résoudre
      trackingUpdates: 6    // Mise à jour tracking toutes les 6h
    },
    
    // Support client
    support: {
      phone: '+221776581741',
      email: 'support@nextmovecargo.com',
      whatsapp: '+221776581741',
      languages: ['fr', 'en', 'wo'] // Français, Anglais, Wolof
    }
  }
} as const

// Fonction pour calculer le prix d'un envoi
export function calculateShippingPrice(
  weight: number,
  shippingType: 'maritime' | 'aerien' | 'express',
  deliveryZone: keyof typeof COMMERCIAL_CONFIG.shipping.deliveryZones,
  insuranceValue?: number
): {
  basePrice: number
  fees: number
  discount: number
  deliveryFee: number
  insurance: number
  taxes: number
  total: number
} {
  const config = COMMERCIAL_CONFIG.shipping
  
  // Prix de base
  const basePrice = weight * config.pricePerKg[shippingType]
  
  // Frais fixes
  const fees = Object.values(config.fixedFees).reduce((sum, fee) => sum + fee, 0)
  
  // Remise selon le poids
  const tier = config.weightTiers.find(t => weight >= t.min && weight < t.max)
  const discount = tier ? basePrice * tier.discount : 0
  
  // Frais de livraison
  const deliveryFee = config.deliveryZones[deliveryZone].price
  
  // Assurance
  const insurance = insuranceValue ? Math.max(insuranceValue * 0.02, config.fixedFees.insurance) : config.fixedFees.insurance
  
  // Sous-total avant taxes
  const subtotal = basePrice - discount + fees + deliveryFee + insurance
  
  // Taxes
  const taxes = subtotal * COMMERCIAL_CONFIG.taxes.tva
  
  // Total
  const total = subtotal + taxes
  
  return {
    basePrice,
    fees,
    discount,
    deliveryFee,
    insurance,
    taxes,
    total: Math.round(total)
  }
}

// Fonction pour calculer les commissions
export function calculateCommission(
  amount: number,
  agentType: keyof typeof COMMERCIAL_CONFIG.commissions
): number {
  return Math.round(amount * COMMERCIAL_CONFIG.commissions[agentType])
}

// Fonction pour formater les prix en FCFA
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}
