import { useState, useEffect } from 'react'

export const translations = {
  fr: {
    // Navigation
    'nav.track': 'Suivre un colis',
    'nav.pricing': 'Tarifs',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.language': 'Langue',
    
    // Hero Section
    'hero.title': 'SaaS Logistique',
    'hero.subtitle': 'Chine-Afrique',
    'hero.description': 'La plateforme de référence pour vos échanges commerciaux entre la Chine et l\'Afrique. Suivi en temps réel, transparence totale, livraison garantie.',
    'hero.cta_trial': 'Essai gratuit 14 jours',
    'hero.cta_track': 'Suivre un colis',
    
    // Stats
    'stats.packages': 'Colis traités',
    'stats.countries': 'Pays UEMOA/CEMAC',
    'stats.delivery_rate': 'Taux de livraison',
    'stats.support': 'Support client',
    
    // Features
    'features.title': 'Pourquoi choisir notre plateforme ?',
    'features.subtitle': 'Une solution complète et innovante pour optimiser vos échanges commerciaux',
    'features.coverage.title': 'Couverture Totale',
    'features.coverage.description': 'Présent dans tous les pays UEMOA et CEMAC avec un réseau de partenaires fiables',
    'features.performance.title': 'Performance Exceptionnelle',
    'features.performance.description': 'Des résultats qui parlent d\'eux-mêmes avec une satisfaction client inégalée',
    'features.security.title': 'Sécurité Maximale',
    'features.security.description': 'Vos marchandises sont protégées à chaque étape du processus',
    
    // Routes
    'routes.title': 'Nos Routes Commerciales',
    'routes.subtitle': 'Connexions directes entre les principales villes chinoises et africaines',
    
    // Testimonials
    'testimonials.title': 'Ce que disent nos clients',
    'testimonials.subtitle': 'La satisfaction de nos clients est notre priorité absolue',
    
    // CTA
    'cta.title': 'Prêt à révolutionner votre logistique ?',
    'cta.subtitle': 'Rejoignez des milliers d\'entreprises qui nous font confiance',
    'cta.start': 'Commencer maintenant',
    'cta.demo': 'Voir une démo',
    
    // Rating System
    'rating.title': 'Évaluations et Avis',
    'rating.subtitle': 'Découvrez ce que nos utilisateurs pensent de notre plateforme et de nos entreprises partenaires',
    'rating.platform_title': 'Noter la Plateforme',
    'rating.platform_description': 'Partagez votre expérience globale avec NextMove',
    'rating.companies_title': 'Entreprises Partenaires',
    'rating.companies_description': 'Évaluez les entreprises de logistique',
    'rating.based_on': 'Basé sur',
    'rating.reviews': 'avis',
    'rating.rate_platform': 'Noter la plateforme',
    'rating.view_all_companies': 'Voir toutes les entreprises',
    'rating.recent_reviews': 'Avis récents de nos utilisateurs',
    
    // Footer
    'footer.services': 'Services',
    'footer.package_management': 'Gestion des Colis',
    'footer.cargo_management': 'Gestion des Cargos',
    'footer.client_management': 'Gestion Clients',
    'footer.tracking': 'Suivi de Colis',
    'footer.support': 'Support',
    'footer.help_center': 'Centre d\'Aide',
    'footer.contact': 'Contact',
    'footer.documentation': 'Documentation',
    'footer.contact_info': 'Informations de Contact',
    'footer.address': 'Dakar, Côte d\'Ivoire',
    'footer.phone': '+221 33 123 45 67',
    'footer.email': 'contact@nextmove.com',
    'footer.support_24_7': 'Support 24/7',
    'footer.description': 'La plateforme de référence pour vos échanges commerciaux Chine-Afrique',
    'footer.rights': 'Tous droits réservés.'
  },
  
  en: {
    // Navigation
    'nav.track': 'Track Package',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.language': 'Language',
    
    // Hero Section
    'hero.title': 'SaaS Logistics',
    'hero.subtitle': 'China-Africa',
    'hero.description': 'The reference platform for your trade exchanges between China and Africa. Real-time tracking, total transparency, guaranteed delivery.',
    'hero.cta_trial': '14-day free trial',
    'hero.cta_track': 'Track a package',
    
    // Stats
    'stats.packages': 'Packages processed',
    'stats.countries': 'UEMOA/CEMAC countries',
    'stats.delivery_rate': 'Delivery rate',
    'stats.support': 'Customer support',
    
    // Features
    'features.title': 'Why choose our platform?',
    'features.subtitle': 'A complete and innovative solution to optimize your trade exchanges',
    'features.coverage.title': 'Total Coverage',
    'features.coverage.description': 'Present in all UEMOA and CEMAC countries with a network of reliable partners',
    'features.performance.title': 'Exceptional Performance',
    'features.performance.description': 'Results that speak for themselves with unmatched customer satisfaction',
    'features.security.title': 'Maximum Security',
    'features.security.description': 'Your goods are protected at every step of the process',
    
    // Routes
    'routes.title': 'Our Trade Routes',
    'routes.subtitle': 'Direct connections between major Chinese and African cities',
    
    // Testimonials
    'testimonials.title': 'What our customers say',
    'testimonials.subtitle': 'Customer satisfaction is our absolute priority',
    
    // CTA
    'cta.title': 'Ready to revolutionize your logistics?',
    'cta.subtitle': 'Join thousands of companies that trust us',
    'cta.start': 'Start now',
    'cta.demo': 'See a demo',
    
    // Rating System
    'rating.title': 'Reviews and Ratings',
    'rating.subtitle': 'Discover what our users think about our platform and partner companies',
    'rating.platform_title': 'Rate the Platform',
    'rating.platform_description': 'Share your overall experience with NextMove',
    'rating.companies_title': 'Partner Companies',
    'rating.companies_description': 'Rate logistics companies',
    'rating.based_on': 'Based on',
    'rating.reviews': 'reviews',
    'rating.rate_platform': 'Rate platform',
    'rating.view_all_companies': 'View all companies',
    'rating.recent_reviews': 'Recent reviews from our users',
    
    // Footer
    'footer.services': 'Services',
    'footer.package_management': 'Package Management',
    'footer.cargo_management': 'Cargo Management',
    'footer.client_management': 'Client Management',
    'footer.tracking': 'Tracking',
    'footer.support': 'Support',
    'footer.help_center': 'Help Center',
    'footer.contact': 'Contact',
    'footer.documentation': 'Documentation',
    'footer.contact_info': 'Contact Information',
    'footer.address': 'Dakar, Ivory Coast',
    'footer.phone': '+221 33 123 45 67',
    'footer.email': 'contact@nextmove.com',
    'footer.support_24_7': '24/7 Support',
    'footer.description': 'The reference platform for your China-Africa trade exchanges',
    'footer.rights': 'All rights reserved.'
  }
}

let currentLanguage = 'fr'

export function getCurrentLanguage() {
  return currentLanguage
}

export function setLanguage(lang: string) {
  currentLanguage = lang
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }))
  }
}

export function t(key: string): string {
  const langTranslations = translations[currentLanguage as keyof typeof translations] || translations.fr
  const keys = key.split('.')
  let value: any = langTranslations
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}

export function useTranslation() {
  const [, forceUpdate] = useState({})
  
  useEffect(() => {
    // Initialize language from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language')
      if (stored && translations[stored as keyof typeof translations]) {
        currentLanguage = stored
      } else {
        localStorage.setItem('language', 'fr')
      }
    }
    
    const handleLanguageChange = (event: CustomEvent) => {
      currentLanguage = event.detail
      forceUpdate({})
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('languageChanged', handleLanguageChange as EventListener)
      return () => {
        window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
      }
    }
  }, [])
  
  return {
    t,
    currentLang: currentLanguage,
    setLanguage
  }
}
