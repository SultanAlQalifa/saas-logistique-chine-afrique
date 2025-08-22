// Types pour la gestion du branding et de l'image de marque

export interface PageContent {
  title: string
  slug: string
  content: string
  seoTitle?: string
  seoDescription?: string
  isActive: boolean
}

export interface PlatformBranding {
  // Identité de base
  platformName: string
  tagline: string
  description: string
  
  // Pages du site
  pages: {
    home: PageContent
    about: PageContent
    contact: PageContent
    services: PageContent
    faq: PageContent
    [key: string]: PageContent
  }
  
  // Visuels
  logo: {
    light: string // URL ou chemin vers le logo en mode clair
    dark: string  // URL ou chemin vers le logo en mode sombre
    favicon: string
    appleTouchIcon: string
  }
  
  // Couleurs et thème
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  
  // Domaine et URLs
  domain: {
    main: string
    api: string
    cdn: string
    support: string
  }
  
  // Contact et support
  contact: {
    email: string
    phone: string
    address: {
      street: string
      city: string
      country: string
      postalCode: string
    }
  }
  
  // Réseaux sociaux
  socialMedia: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    youtube?: string
    github?: string
  }
  
  // Configuration email
  emailConfig: {
    smtpServer: string
    smtpPort: number
    smtpSecure: boolean
    fromEmail: string
    fromName: string
    replyTo: string
  }
  
  // Informations légales
  legal: {
    companyName: string
    registrationNumber: string
    vatNumber?: string
    termsOfServiceUrl: string
    privacyPolicyUrl: string
    cookiePolicyUrl: string
  }
  
  // SEO et métadonnées
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogImage: string
    twitterCard: string
  }
  
  // Paramètres avancés
  advanced: {
    googleAnalyticsId?: string
    facebookPixelId?: string
    intercomAppId?: string
    hotjarId?: string
    customCss?: string
    customJs?: string
  }
}

export interface BrandingSettings {
  id: string
  companyId: string
  branding: PlatformBranding
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Valeurs par défaut
export const defaultBranding: PlatformBranding = {
  platformName: 'SaaS Logistique Chine-Afrique',
  tagline: 'Votre partenaire logistique de confiance',
  pages: {
    home: {
      title: 'Accueil',
      slug: 'home',
      content: '<h1>Bienvenue sur notre plateforme logistique</h1>\n<p>Votre solution complète pour la gestion des expéditions Chine-Afrique.</p>',
      seoTitle: 'Plateforme Logistique Chine-Afrique - Accueil',
      seoDescription: 'Solution complète pour la gestion de vos expéditions entre la Chine et l\'Afrique',
      isActive: true
    },
    about: {
      title: 'À propos',
      slug: 'a-propos',
      content: '<h1>Notre histoire</h1>\n<p>Nous sommes spécialisés dans la logistique entre la Chine et l\'Afrique depuis plus de 10 ans.</p>',
      seoTitle: 'À propos de notre plateforme logistique',
      seoDescription: 'Découvrez notre expertise en logistique Chine-Afrique',
      isActive: true
    },
    contact: {
      title: 'Contact',
      slug: 'contact',
      content: '<h1>Contactez-nous</h1>\n<p>Notre équipe est à votre écoute pour répondre à toutes vos questions.</p>',
      seoTitle: 'Contact - Plateforme Logistique',
      seoDescription: 'Contactez notre équipe pour plus d\'informations',
      isActive: true
    },
    services: {
      title: 'Nos Services',
      slug: 'services',
      content: '<h1>Nos Services</h1>\n<p>Découvrez notre gamme complète de services logistiques.</p>',
      seoTitle: 'Nos Services Logistiques',
      seoDescription: 'Découvrez nos solutions logistiques sur mesure',
      isActive: true
    },
    faq: {
      title: 'FAQ',
      slug: 'faq',
      content: '<h1>Foire aux questions</h1>\n<p>Retrouvez les réponses aux questions fréquemment posées.</p>',
      seoTitle: 'FAQ - Questions fréquentes',
      seoDescription: 'Trouvez des réponses à vos questions sur nos services',
      isActive: true
    }
  },
  description: 'Plateforme de gestion logistique pour le fret entre la Chine et l\'Afrique',
  
  logo: {
    light: '/logos/logo-light.svg',
    dark: '/logos/logo-dark.svg',
    favicon: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png'
  },
  
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#1f2937'
  },
  
  domain: {
    main: 'logistics-platform.com',
    api: 'api.logistics-platform.com',
    cdn: 'cdn.logistics-platform.com',
    support: 'support.logistics-platform.com'
  },
  
  contact: {
    email: 'contact@logistics-platform.com',
    phone: '+33 1 23 45 67 89',
    address: {
      street: '123 Rue de la Logistique',
      city: 'Paris',
      country: 'France',
      postalCode: '75001'
    }
  },
  
  socialMedia: {
    facebook: 'https://facebook.com/logistics-platform',
    twitter: 'https://twitter.com/logistics_platform',
    linkedin: 'https://linkedin.com/company/logistics-platform',
    instagram: 'https://instagram.com/logistics_platform'
  },
  
  emailConfig: {
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    smtpSecure: true,
    fromEmail: 'noreply@logistics-platform.com',
    fromName: 'SaaS Logistique Chine-Afrique',
    replyTo: 'support@logistics-platform.com'
  },
  
  legal: {
    companyName: 'Logistics Platform SAS',
    registrationNumber: '123 456 789',
    vatNumber: 'FR12345678901',
    termsOfServiceUrl: '/legal/terms',
    privacyPolicyUrl: '/legal/privacy',
    cookiePolicyUrl: '/legal/cookies'
  },
  
  seo: {
    metaTitle: 'SaaS Logistique Chine-Afrique - Gestion du fret maritime et aérien',
    metaDescription: 'Plateforme SaaS pour la gestion du fret entre la Chine et l\'Afrique. Maritime, aérien, suivi en temps réel.',
    keywords: ['logistique', 'fret', 'chine', 'afrique', 'maritime', 'aérien', 'transport'],
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image'
  },
  
  advanced: {
    googleAnalyticsId: '',
    facebookPixelId: '',
    intercomAppId: '',
    hotjarId: '',
    customCss: '',
    customJs: ''
  }
}
