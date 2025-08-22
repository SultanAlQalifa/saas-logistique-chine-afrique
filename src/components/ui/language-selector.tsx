'use client'

import { useState, useEffect } from 'react'
import { Languages } from 'lucide-react'

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

interface LanguageSelectorProps {
  variant?: 'default' | 'compact'
  className?: string
}

export default function LanguageSelector({ variant = 'default', className = '' }: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState('FR')
  const [isOpen, setIsOpen] = useState(false)

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

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode.toUpperCase())
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', langCode)
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: langCode }))
    }
    setIsOpen(false)
  }

  const currentLangData = languages.find(lang => lang.code.toUpperCase() === currentLanguage)

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {currentLangData?.flag} {currentLanguage}
        </button>
        
        {isOpen && (
          <>
            {/* Overlay pour fermer le dropdown */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                    currentLanguage === lang.code.toUpperCase() ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
      >
        <Languages className="w-4 h-4" />
        {currentLangData?.flag} {currentLanguage}
      </button>
      
      {isOpen && (
        <>
          {/* Overlay pour fermer le dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
            }}
          />
          
          {/* Dropdown */}
          <div 
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLanguageChange(lang.code)
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  currentLanguage === lang.code.toUpperCase() ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <span>{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
