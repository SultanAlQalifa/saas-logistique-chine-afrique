'use client'

import { useEffect } from 'react'
import { setCurrentLanguage } from '@/lib/i18n'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Forcer l'initialisation de la langue française par défaut
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('language')
      if (!storedLang) {
        setCurrentLanguage('fr')
      }
    }
  }, [])

  return <>{children}</>
}
