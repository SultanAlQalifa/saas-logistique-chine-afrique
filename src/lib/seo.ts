import { Metadata } from 'next'

// Configuration SEO centralisée
export const siteConfig = {
  name: 'NextMove Cargo',
  title: 'NextMove Cargo - Plateforme Logistique Chine-Afrique',
  description: 'Solution SaaS complète pour la logistique entre la Chine et l\'Afrique. Expédition maritime, aérienne, suivi en temps réel, POD électronique.',
  url: 'https://nextmove-cargo.com',
  ogImage: '/images/og-image.jpg',
  keywords: [
    'logistique',
    'chine afrique',
    'expédition maritime',
    'cargo aérien',
    'suivi colis',
    'import export',
    'transitaire',
    'fret international',
    'douane',
    'POD électronique'
  ],
  author: 'NextMove Cargo',
  creator: 'DJITTE Cheikh Abdoul Khadre Djeylani',
  publisher: 'NextMove Cargo SaaS',
  category: 'Logistique et Transport',
  language: 'fr-FR',
  alternateLanguages: ['en-US'],
  robots: 'index, follow',
  googleSiteVerification: '',
  bingVerification: '',
}

// Types pour les métadonnées de page
export interface PageSEO {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  noIndex?: boolean
  canonical?: string
  alternates?: {
    languages?: Record<string, string>
  }
}

// Générateur de métadonnées par page
export function generatePageMetadata(pageSEO?: PageSEO): Metadata {
  const title = pageSEO?.title 
    ? `${pageSEO.title} | ${siteConfig.name}`
    : siteConfig.title

  const description = pageSEO?.description || siteConfig.description
  const keywords = pageSEO?.keywords?.join(', ') || siteConfig.keywords.join(', ')
  const ogImage = pageSEO?.ogImage || siteConfig.ogImage

  return {
    title,
    description,
    keywords,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    category: siteConfig.category,
    robots: pageSEO?.noIndex ? 'noindex, nofollow' : siteConfig.robots,
    alternates: {
      canonical: pageSEO?.canonical,
      languages: pageSEO?.alternates?.languages || {
        'fr-FR': `${siteConfig.url}/fr`,
        'en-US': `${siteConfig.url}/en`,
      }
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.language,
      url: siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@nextmovecargo',
      site: '@nextmovecargo',
    },
    verification: {
      google: siteConfig.googleSiteVerification,
      other: {
        'msvalidate.01': siteConfig.bingVerification,
      }
    },
    other: {
      'application-name': siteConfig.name,
      'apple-mobile-web-app-title': siteConfig.name,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'theme-color': '#0ea5e9',
    }
  }
}

// Métadonnées spécifiques par page
export const pagesSEO: Record<string, PageSEO> = {
  home: {
    title: 'Accueil',
    description: 'Plateforme logistique leader pour vos expéditions entre la Chine et l\'Afrique. Solutions maritimes, aériennes avec suivi temps réel.',
    keywords: ['logistique chine afrique', 'expédition internationale', 'cargo maritime', 'fret aérien'],
  },
  
  dashboard: {
    title: 'Tableau de Bord',
    description: 'Gérez vos expéditions, suivez vos colis et analysez vos performances logistiques en temps réel.',
    noIndex: true, // Pages privées non indexées
  },
  
  pricing: {
    title: 'Tarification',
    description: 'Calculez vos coûts d\'expédition entre la Chine et l\'Afrique. Tarifs transparents pour maritime et aérien.',
    keywords: ['tarif logistique', 'prix expédition chine afrique', 'calculateur fret'],
  },
  
  tracking: {
    title: 'Suivi de Colis',
    description: 'Suivez vos colis en temps réel de la Chine vers l\'Afrique. Localisation GPS et notifications automatiques.',
    keywords: ['suivi colis', 'tracking international', 'localisation GPS'],
  },
  
  services: {
    title: 'Nos Services',
    description: 'Services logistiques complets : expédition maritime, aérienne, dédouanement, assurance et POD électronique.',
    keywords: ['services logistiques', 'dédouanement', 'assurance cargo', 'POD électronique'],
  },
  
  contact: {
    title: 'Contact',
    description: 'Contactez NextMove Cargo pour vos besoins logistiques. Support 24/7, devis gratuit et expertise Chine-Afrique.',
    keywords: ['contact logistique', 'devis gratuit', 'support client'],
  },
  
  about: {
    title: 'À Propos',
    description: 'NextMove Cargo, votre partenaire logistique de confiance pour les échanges commerciaux entre la Chine et l\'Afrique.',
    keywords: ['à propos nextmove', 'entreprise logistique', 'expertise chine afrique'],
  },
  
  blog: {
    title: 'Blog Logistique',
    description: 'Actualités, conseils et tendances du transport international entre la Chine et l\'Afrique.',
    keywords: ['blog logistique', 'actualités transport', 'conseils import export'],
  }
}

// Données structurées JSON-LD
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Service' | 'Article', data?: any) {
  const baseUrl = siteConfig.url

  switch (type) {
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        description: siteConfig.description,
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+221-77-658-1741',
          contactType: 'customer service',
          availableLanguage: ['French', 'English'],
          areaServed: ['Africa', 'China']
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'SN',
          addressLocality: 'Dakar',
          addressRegion: 'Dakar'
        },
        sameAs: [
          'https://facebook.com/nextmovecargo',
          'https://twitter.com/nextmovecargo',
          'https://linkedin.com/company/nextmovecargo'
        ]
      }

    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        description: siteConfig.description,
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: `${baseUrl}/images/logo.png`
        }
      }

    case 'Service':
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Services Logistiques Chine-Afrique',
        description: 'Services complets de logistique internationale entre la Chine et l\'Afrique',
        provider: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: baseUrl
        },
        serviceType: 'Logistique Internationale',
        areaServed: ['Africa', 'China'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services Logistiques',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Expédition Maritime',
                description: 'Transport maritime de marchandises entre la Chine et l\'Afrique'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Expédition Aérienne',
                description: 'Transport aérien rapide pour vos colis urgents'
              }
            }
          ]
        }
      }

    case 'Article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data?.title || siteConfig.title,
        description: data?.description || siteConfig.description,
        author: {
          '@type': 'Organization',
          name: siteConfig.name
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: `${baseUrl}/images/logo.png`
        },
        datePublished: data?.publishedAt || new Date().toISOString(),
        dateModified: data?.updatedAt || new Date().toISOString(),
        mainEntityOfPage: data?.url || baseUrl
      }

    default:
      return null
  }
}

// Hook pour utiliser les métadonnées dans les composants
export function useSEO(pageKey: string, customSEO?: PageSEO) {
  const pageSEO = pagesSEO[pageKey] || {}
  const finalSEO = { ...pageSEO, ...customSEO }
  
  return {
    metadata: generatePageMetadata(finalSEO),
    structuredData: generateStructuredData('WebSite'),
    pageTitle: finalSEO.title ? `${finalSEO.title} | ${siteConfig.name}` : siteConfig.title
  }
}
