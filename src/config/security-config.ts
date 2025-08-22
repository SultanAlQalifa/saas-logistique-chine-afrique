// Configuration de sécurité et conformité RGPD
// Paramètres de sécurité pour NextMove Cargo

export const SECURITY_CONFIG = {
  // Paramètres de session
  session: {
    maxAge: 24 * 60 * 60, // 24 heures
    secure: true,
    httpOnly: true,
    sameSite: 'strict' as const,
    domain: process.env.NODE_ENV === 'production' ? '.nextmovecargo.com' : 'localhost'
  },

  // Paramètres de mot de passe
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAttempts: 5,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes
    historyCount: 5 // Ne pas réutiliser les 5 derniers mots de passe
  },

  // Authentification à deux facteurs
  twoFactor: {
    required: true, // Obligatoire pour tous les comptes
    methods: ['totp', 'sms', 'email'],
    backupCodes: 10,
    tokenExpiry: 5 * 60 * 1000 // 5 minutes
  },

  // Chiffrement
  encryption: {
    algorithm: 'aes-256-gcm',
    keyRotationDays: 90,
    saltRounds: 12
  },

  // Audit et logs
  audit: {
    retentionDays: 2555, // 7 ans (conformité RGPD)
    logLevel: 'info',
    sensitiveFields: [
      'password',
      'token',
      'apiKey',
      'creditCard',
      'bankAccount',
      'socialSecurityNumber'
    ],
    requiredEvents: [
      'login',
      'logout',
      'password_change',
      'data_access',
      'data_modification',
      'data_deletion',
      'export',
      'admin_action'
    ]
  },

  // Limites de taux (Rate limiting)
  rateLimiting: {
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 1000
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5
    },
    upload: {
      windowMs: 60 * 60 * 1000, // 1 heure
      maxRequests: 50
    }
  },

  // Validation des fichiers
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    scanForMalware: true,
    quarantineDays: 30
  },

  // Headers de sécurité
  securityHeaders: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com"
  }
} as const

// Configuration RGPD
export const GDPR_CONFIG = {
  // Informations du DPO (Data Protection Officer)
  dpo: {
    name: 'Cheikh Abdoul Khadre Djeylani DJITTE',
    email: 'dpo@nextmovecargo.com',
    phone: '+221776581741',
    address: 'Dakar, Sénégal'
  },

  // Base légale pour le traitement des données
  legalBasis: {
    contracts: 'Art. 6(1)(b) RGPD - Exécution du contrat',
    legitimateInterest: 'Art. 6(1)(f) RGPD - Intérêt légitime',
    consent: 'Art. 6(1)(a) RGPD - Consentement',
    legalObligation: 'Art. 6(1)(c) RGPD - Obligation légale'
  },

  // Catégories de données personnelles
  dataCategories: {
    identity: {
      name: 'Données d\'identité',
      fields: ['firstName', 'lastName', 'email', 'phone'],
      retention: 7 * 365, // 7 ans
      legalBasis: 'contracts'
    },
    financial: {
      name: 'Données financières',
      fields: ['bankAccount', 'paymentMethod', 'transactions'],
      retention: 10 * 365, // 10 ans (obligation comptable)
      legalBasis: 'legalObligation'
    },
    logistics: {
      name: 'Données logistiques',
      fields: ['packages', 'addresses', 'tracking'],
      retention: 5 * 365, // 5 ans
      legalBasis: 'contracts'
    },
    technical: {
      name: 'Données techniques',
      fields: ['ipAddress', 'userAgent', 'cookies'],
      retention: 13 * 30, // 13 mois
      legalBasis: 'legitimateInterest'
    }
  },

  // Droits des personnes concernées
  dataSubjectRights: {
    access: {
      name: 'Droit d\'accès',
      responseTime: 30, // jours
      format: ['pdf', 'json', 'csv']
    },
    rectification: {
      name: 'Droit de rectification',
      responseTime: 30, // jours
      automated: true
    },
    erasure: {
      name: 'Droit à l\'effacement',
      responseTime: 30, // jours
      exceptions: ['legal_obligation', 'contract_execution']
    },
    portability: {
      name: 'Droit à la portabilité',
      responseTime: 30, // jours
      format: ['json', 'csv', 'xml']
    },
    objection: {
      name: 'Droit d\'opposition',
      responseTime: 30, // jours
      automated: false
    },
    restriction: {
      name: 'Droit à la limitation',
      responseTime: 30, // jours
      automated: false
    }
  },

  // Transferts internationaux
  internationalTransfers: {
    adequacyDecisions: ['EU', 'UK', 'Switzerland'],
    safeguards: ['Standard Contractual Clauses', 'Binding Corporate Rules'],
    thirdCountries: ['China', 'USA'],
    assessmentRequired: true
  },

  // Violation de données
  dataBreachProcedure: {
    detectionTime: 24, // heures max pour détecter
    notificationTime: 72, // heures max pour notifier CNIL
    communicationTime: 72, // heures max pour informer les personnes
    riskAssessment: true,
    documentation: true
  }
} as const

// Fonctions utilitaires de sécurité
export function isStrongPassword(password: string): boolean {
  const config = SECURITY_CONFIG.password
  
  if (password.length < config.minLength) return false
  if (config.requireUppercase && !/[A-Z]/.test(password)) return false
  if (config.requireLowercase && !/[a-z]/.test(password)) return false
  if (config.requireNumbers && !/\d/.test(password)) return false
  if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false
  
  return true
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Supprime les balises HTML
    .replace(/['"]/g, '') // Supprime les guillemets
    .trim()
}

export function maskSensitiveData(data: any, field: string): any {
  if (SECURITY_CONFIG.audit.sensitiveFields.includes(field as any)) {
    if (typeof data === 'string') {
      return data.replace(/./g, '*')
    }
    return '[MASKED]'
  }
  return data
}

export function shouldRetainData(category: keyof typeof GDPR_CONFIG.dataCategories, createdAt: Date): boolean {
  const config = GDPR_CONFIG.dataCategories[category]
  const retentionDays = config.retention
  const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  
  return daysSinceCreation < retentionDays
}
