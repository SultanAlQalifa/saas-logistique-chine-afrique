'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import SEOHead from '@/components/seo/SEOHead'
import { generateStructuredData } from '@/lib/seo'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import HomeBanner from '@/components/advertising/HomeBanner'
import PricingPOS from '@/components/pos/PricingPOS'
import { 
  ChevronDown, 
  Menu, 
  X, 
  Globe,
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  Package, 
  Star,
  CheckCircle,
  MapPin,
  Truck,
  Ship,
  Plane,
  LogIn,
  Languages,
  Building2,
  Zap,
  GraduationCap,
  BarChart3,
  Phone,
  Mail
} from 'lucide-react'
// Système de traduction direct intégré

// Traductions directes
const translations = {
  fr: {
    'nav.track': 'Suivre un colis',
    'nav.pricing': 'Tarifs',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.dashboard': 'Tableau de bord',
    'nav.account': 'Mon Compte',
    'nav.language': 'Langue',
    'hero.title': 'SaaS Logistique',
    'hero.subtitle': 'Chine-Afrique',
    'hero.description': 'La plateforme de référence pour vos échanges commerciaux entre la Chine et l\'Afrique. Suivi en temps réel, transparence totale, livraison garantie.',
    'hero.cta_trial': 'Essai gratuit 14 jours',
    'hero.cta_track': 'Suivre un colis',
    'stats.packages': 'Colis traités',
    'stats.countries': 'Pays UEMOA/CEMAC',
    'stats.delivery_rate': 'Taux de livraison',
    'stats.support': 'Support client',
    'features.title': 'Pourquoi choisir notre plateforme ?',
    'features.subtitle': 'Une solution complète et innovante pour optimiser vos échanges commerciaux',
    'features.coverage.title': 'Couverture Totale',
    'features.coverage.description': 'Présent dans tous les pays UEMOA et CEMAC avec un réseau de partenaires fiables',
    'features.performance.title': 'Performance Exceptionnelle',
    'features.performance.description': 'Des résultats qui parlent d\'eux-mêmes avec une satisfaction client inégalée',
    'features.security.title': 'Sécurité Maximale',
    'features.security.description': 'Vos marchandises sont protégées à chaque étape du processus',
    'routes.title': 'Nos Routes Commerciales',
    'routes.subtitle': 'Connexions directes entre les principales villes chinoises et africaines',
    'testimonials.title': 'Ce que disent nos clients',
    'testimonials.subtitle': 'La satisfaction de nos clients est notre priorité absolue',
    'cta.title': 'Prêt à révolutionner votre logistique ?',
    'cta.subtitle': 'Rejoignez des milliers d\'entreprises qui nous font confiance',
    'cta.start': 'Commencer maintenant',
    'cta.demo': 'Voir une démo',
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
    'nav.track': 'Track Package',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    'nav.account': 'My Account',
    'nav.language': 'Language',
    'hero.title': 'SaaS Logistics',
    'hero.subtitle': 'China-Africa',
    'hero.description': 'The reference platform for your trade exchanges between China and Africa. Real-time tracking, total transparency, guaranteed delivery.',
    'hero.cta_trial': '14-day free trial',
    'hero.cta_track': 'Track a package',
    'stats.packages': 'Packages processed',
    'stats.countries': 'UEMOA/CEMAC countries',
    'stats.delivery_rate': 'Delivery rate',
    'stats.support': 'Customer support',
    'features.title': 'Why choose our platform?',
    'features.subtitle': 'A complete and innovative solution to optimize your trade exchanges',
    'features.coverage.title': 'Total Coverage',
    'features.coverage.description': 'Present in all UEMOA and CEMAC countries with a network of reliable partners',
    'features.performance.title': 'Exceptional Performance',
    'features.performance.description': 'Results that speak for themselves with unmatched customer satisfaction',
    'features.security.title': 'Maximum Security',
    'features.security.description': 'Your goods are protected at every step of the process',
    'routes.title': 'Our Trade Routes',
    'routes.subtitle': 'Direct connections between major Chinese and African cities',
    'testimonials.title': 'What our customers say',
    'testimonials.subtitle': 'Customer satisfaction is our absolute priority',
    'cta.title': 'Ready to revolutionize your logistics?',
    'cta.subtitle': 'Join thousands of companies that trust us',
    'cta.start': 'Start now',
    'cta.demo': 'See a demo',
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

export default function HomePage() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('FR')
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Fonction pour vérifier l'état de connexion
  const checkUserAuthentication = () => {
    const token = localStorage.getItem('authToken') || 
                  sessionStorage.getItem('authToken') ||
                  document.cookie.includes('auth-token')
    
    const isDashboardContext = window.location.pathname.includes('/dashboard/')
    
    return !!(token || isDashboardContext || session)
  }

  useEffect(() => {
    setIsLoggedIn(checkUserAuthentication())
  }, [session])

  const [currentStat, setCurrentStat] = useState(0)
  
  // Fonction de traduction simple
  const t = (key: string) => {
    const lang = currentLanguage.toLowerCase()
    const langTranslations = translations[lang as keyof typeof translations] || translations.fr
    return langTranslations[key as keyof typeof langTranslations] || key
  }
  
  // Synchroniser avec le système i18n
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('language') || 'fr'
      setCurrentLanguage(storedLang.toUpperCase())
    }
    
    const handleLanguageChange = (event: CustomEvent) => {
      const newLang = event.detail
      setCurrentLanguage(newLang.toUpperCase())
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('languageChanged', handleLanguageChange as EventListener)
      return () => {
        window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
      }
    }
  }, [])

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  const stats = [
    { number: "50,000+", label: t('stats.packages'), icon: Package },
    { number: "15", label: t('stats.countries'), icon: Globe },
    { number: "99.8%", label: t('stats.delivery_rate'), icon: CheckCircle },
    { number: "24/7", label: t('stats.support'), icon: Clock }
  ]

  const testimonials = [
    {
      name: "Amadou Diallo",
      company: "Import-Export Sahel",
      text: "Cette plateforme a révolutionné notre gestion logistique. Suivi en temps réel et transparence totale.",
      rating: 5
    },
    {
      name: "Marie Kouassi",
      company: "Trading Côte d'Ivoire",
      text: "Excellent service ! Nos colis arrivent toujours à temps et en parfait état.",
      rating: 5
    },
    {
      name: "Ibrahim Traoré",
      company: "Commerce International Mali",
      text: "Interface intuitive et équipe support réactive. Je recommande vivement !",
      rating: 5
    }
  ]

  const routes = [
    { from: "Guangzhou", to: "Abidjan", mode: "Maritime", duration: "25 jours" },
    { from: "Shenzhen", to: "Lagos", mode: "Aérien", duration: "3 jours" },
    { from: "Shanghai", to: "Dakar", mode: "Maritime Express", duration: "18 jours" },
    { from: "Beijing", to: "Casablanca", mode: "Aérien Express", duration: "1 jour" }
  ]

  useEffect(() => {
    setIsVisible(true)
    
    // Initialiser la langue par défaut si pas définie
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('language')
      if (!storedLang) {
        localStorage.setItem('language', 'fr')
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: 'fr' }))
      }
    }
    
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Maritime': return Ship
      case 'Maritime Express': return Ship
      case 'Aérien': return Plane
      case 'Aérien Express': return Plane
      default: return Truck
    }
  }

  return (
    <>
      {/* SEO Head */}
      <SEOHead
        title="Accueil"
        description="Plateforme logistique leader pour vos expéditions entre la Chine et l'Afrique. Solutions maritimes, aériennes avec suivi temps réel."
        keywords={['logistique chine afrique', 'expédition internationale', 'cargo maritime', 'fret aérien']}
        structuredDataType="WebSite"
        structuredData={generateStructuredData('Organization')}
      />
      
      {/* Google Analytics */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      
      <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600/30 to-blue-600/30 hover:from-emerald-600/90 hover:to-blue-600/90 backdrop-blur-sm border-b border-emerald-500/20 hover:border-emerald-500/30 shadow-sm transition-all duration-500 group">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 cursor-pointer hover:bg-white/95 transition-colors">
                  <Image 
                    src="/logo-nextmove-new.svg" 
                    alt="NextMove" 
                    width={160} 
                    height={48}
                    className="w-40 h-12"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              <Link href="/track" className="text-white/90 hover:text-white font-medium text-sm transition-colors">
                {t('nav.track')}
              </Link>
              <Link href="/pricing" className="text-white/90 hover:text-white font-medium text-sm transition-colors">
                {t('nav.pricing')}
              </Link>
              <Link href="/about" className="text-white/90 hover:text-white font-medium text-sm transition-colors">
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="text-white/90 hover:text-white font-medium text-sm transition-colors">
                {t('nav.contact')}
              </Link>
              <Link href="/documentation" className="text-white/90 hover:text-white font-medium text-sm flex items-center gap-1 transition-colors">
                📚 Documentation
              </Link>
              
              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="flex items-center gap-1 text-white/90 hover:text-white font-medium text-sm transition-colors"
                >
                  <Languages className="w-3 h-3" />
                  {languages.find(lang => lang.code.toUpperCase() === currentLanguage)?.flag} {currentLanguage}
                </button>
                {languageDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setLanguageDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLanguage(lang.code.toUpperCase())
                        localStorage.setItem('language', lang.code)
                        setLanguageDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                    </div>
                  </>
                )}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/signin"}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex items-center gap-1 border border-white/20"
                >
                  <LogIn className="w-3 h-3" />
                  {isLoggedIn ? t('nav.dashboard') : t('nav.login')}
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/90 hover:text-white transition-colors opacity-40 group-hover:opacity-100 transition-opacity duration-500"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
              <div className="px-4 py-4 space-y-4">
                <Link href="/track" className="block text-gray-600 hover:text-blue-600 font-medium">
                  {t('nav.track')}
                </Link>
                <Link href="/pricing" className="block text-gray-600 hover:text-blue-600 font-medium">
                  {t('nav.pricing')}
                </Link>
                <Link href="/about" className="block text-gray-600 hover:text-blue-600 font-medium">
                  {t('nav.about')}
                </Link>
                <Link href="/contact" className="block text-gray-600 hover:text-blue-600 font-medium">
                  {t('nav.contact')}
                </Link>
                <Link href="/documentation" className="block text-gray-600 hover:text-blue-600 font-medium">
                  📚 Documentation
                </Link>
                
                {/* Mobile Language Selector */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">{t('nav.language')}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLanguage(lang.code.toUpperCase())
                          localStorage.setItem('language', lang.code)
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                          currentLanguage === lang.code.toUpperCase() ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="border-t pt-4 space-y-3">
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/signin"}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center transition-colors"
                  >
                    {isLoggedIn ? t('nav.dashboard') : t('nav.login')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>


      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
        </div>

        <div className={`relative z-10 text-center space-y-8 max-w-6xl mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
            <br />
            <span className="text-yellow-400">{t('hero.subtitle')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-2"
            >
              {t('hero.cta_trial')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/tracking"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold py-4 px-8 rounded-full transition-all duration-300"
            >
              {t('hero.cta_track')}
            </Link>
          </div>

          {/* Animated stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index}
                  className={`text-center transition-all duration-500 ${currentStat === index ? 'scale-110 text-yellow-400' : 'text-white'}`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold">{stat.number}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>


      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('features.coverage.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('features.coverage.description')}
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 15 pays couverts</li>
                <li>• 50+ partenaires locaux</li>
                <li>• Support multilingue</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('features.performance.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('features.performance.description')}
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 99.8% de livraisons réussies</li>
                <li>• Délais respectés à 95%</li>
                <li>• 0 colis perdus en 2024</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('features.security.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('features.security.description')}
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Assurance tous risques</li>
                <li>• Suivi GPS en temps réel</li>
                <li>• Certification ISO 9001</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Routes Map Section */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('routes.title')}
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              {t('routes.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {routes.map((route, index) => {
              const Icon = getModeIcon(route.mode)
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">{route.mode}</span>
                    </div>
                    <span className="text-blue-200 text-sm">{route.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {route.from}
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-300" />
                    <div className="text-white">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {route.to}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl relative">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {t('cta.start')}
            </Link>
            <Link
              href="/tracking"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-full transition-all duration-300"
            >
              {t('cta.demo')}
            </Link>
          </div>
        </div>
      </section>

      {/* Rating Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('rating.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('rating.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Platform Rating */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-yellow-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white fill-current" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('rating.platform_title')}
                </h3>
                <p className="text-gray-600">
                  {t('rating.platform_description')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">4.8</div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= 4.8 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {t('rating.based_on')} 2,847 {t('rating.reviews')}
                </p>
                <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium">
                  {t('rating.rate_platform')}
                </button>
              </div>
            </div>

            {/* Companies Rating */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('rating.companies_title')}
                </h3>
                <p className="text-gray-600">
                  {t('rating.companies_description')}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      L
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">LogiTrans</div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= 4.9 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">4.9</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">234 avis</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      A
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">AfricaCargo</div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= 4.7 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">4.7</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">189 avis</span>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium">
                  {t('rating.view_all_companies')}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {t('rating.recent_reviews')}
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Mamadou K.</div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  "Excellent service ! Mes colis arrivent toujours en parfait état et dans les délais. Je recommande vivement cette plateforme."
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Aminata D.</div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  "Interface très intuitive et équipe support très réactive. Quelques améliorations possibles mais globalement très satisfaite."
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    I
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Ibrahim S.</div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  "Parfait pour mes importations depuis la Chine. Suivi en temps réel et tarifs compétitifs. Rien à redire !"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section promotionnelle en bas */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <GraduationCap className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">🎓 Formation Logistique Internationale</h3>
              <p className="text-xl text-white/90 mb-6">Devenez expert en import-export avec nos formations certifiées</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-colors">
                  Voir les formations
                </button>
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">4,200+ professionnels formés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Link href="/">
                  <Image 
                    src="/logo-nextmove-new.svg" 
                    alt="NextMove" 
                    width={384} 
                    height={128}
                    className="w-96 h-32 cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <p className="text-gray-400 mb-4">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard/packages" className="hover:text-white">{t('footer.package_management')}</Link></li>
                <li><Link href="/dashboard/cargos" className="hover:text-white">{t('footer.cargo_management')}</Link></li>
                <li><Link href="/dashboard/contacts/clients" className="hover:text-white">{t('footer.client_management')}</Link></li>
                <li><Link href="/tracking" className="hover:text-white">{t('footer.tracking')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">{t('footer.help_center')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.contact')}</a></li>
                <li><a href="#" className="hover:text-white">{t('footer.documentation')}</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.contact_info')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 {t('footer.email')}</li>
                <li>📞 {t('footer.phone')}</li>
                <li>📍 {t('footer.address')}</li>
                <li>🕒 {t('footer.support_24_7')}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NextMove Chine-Afrique. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>

      {/* POS/PDV Floating Button */}
      <PricingPOS />

    </div>
    </>
  )
}
