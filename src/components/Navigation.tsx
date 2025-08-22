'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Menu, 
  X, 
  LogIn,
  Languages
} from 'lucide-react'

// Traductions directes
const translations = {
  fr: {
    'nav.track': 'Suivre un colis',
    'nav.pricing': 'Tarifs',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.language': 'Langue',
  },
  en: {
    'nav.track': 'Track Package',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.language': 'Language',
  }
}

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

export default function Navigation() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('FR')
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language')
      if (savedLang) {
        setCurrentLanguage(savedLang.toUpperCase())
      }
    }
  }, [])

  const t = (key: string) => {
    const langTranslations = translations[currentLanguage.toLowerCase() as keyof typeof translations] || translations.fr
    return langTranslations[key as keyof typeof langTranslations] || key
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600/30 to-blue-600/30 backdrop-blur-sm border-b border-emerald-500/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
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
          <div className="hidden md:flex items-center gap-6">
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
            <Link href="/blog" className="text-white/90 hover:text-white font-medium text-sm transition-colors">
              Blog
            </Link>
            <Link href="/community" className="text-white/90 hover:text-white font-medium text-sm transition-colors">
              Communauté
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
                      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang.code.toUpperCase() }))
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
                href={session ? "/dashboard" : "/signin"}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex items-center gap-1 border border-white/20"
              >
                <LogIn className="w-3 h-3" />
                {t('nav.login')}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/90 hover:text-white transition-colors"
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
              <Link href="/blog" className="block text-gray-600 hover:text-blue-600 font-medium">
                Blog
              </Link>
              <Link href="/community" className="block text-gray-600 hover:text-blue-600 font-medium">
                Communauté
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
                        window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang.code.toUpperCase() }))
                        setMobileMenuOpen(false)
                      }}
                      className={`p-2 rounded-lg border text-sm flex items-center gap-2 ${
                        currentLanguage === lang.code.toUpperCase()
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mobile Auth Button */}
              <div className="border-t pt-4">
                <Link
                  href={session ? "/dashboard" : "/signin"}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  {t('nav.login')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
