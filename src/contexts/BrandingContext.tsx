'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PlatformBranding, defaultBranding } from '@/types/branding'

interface BrandingContextType {
  branding: PlatformBranding
  updateBranding: (newBranding: Partial<PlatformBranding>) => void
  resetToDefault: () => void
  saveBranding: () => Promise<void>
  isLoading: boolean
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined)

interface BrandingProviderProps {
  children: ReactNode
}

export function BrandingProvider({ children }: BrandingProviderProps) {
  const [branding, setBranding] = useState<PlatformBranding>(defaultBranding)
  const [isLoading, setIsLoading] = useState(false)

  // Charger le branding depuis le localStorage au démarrage
  useEffect(() => {
    const savedBranding = localStorage.getItem('platform-branding')
    if (savedBranding) {
      try {
        const parsed = JSON.parse(savedBranding)
        // Deep merge to ensure nested objects like pages are properly merged
        const mergedBranding = {
          ...defaultBranding,
          ...parsed,
          // Ensure pages object exists and has all required pages
          pages: {
            ...defaultBranding.pages,
            ...(parsed.pages || {})
          }
        }
        setBranding(mergedBranding)
      } catch (error) {
        console.error('Erreur lors du chargement du branding:', error)
      }
    }
  }, [])

  // Appliquer les couleurs CSS personnalisées
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', branding.colors.primary)
    root.style.setProperty('--color-secondary', branding.colors.secondary)
    root.style.setProperty('--color-accent', branding.colors.accent)
    root.style.setProperty('--color-background', branding.colors.background)
    root.style.setProperty('--color-text', branding.colors.text)

    // Mettre à jour le titre de la page
    document.title = branding.seo.metaTitle

    // Mettre à jour le favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (favicon) {
      favicon.href = branding.logo.favicon
    }

    // Mettre à jour les meta tags
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement
    if (metaDescription) {
      metaDescription.content = branding.seo.metaDescription
    }

    // Appliquer le CSS personnalisé
    if (branding.advanced.customCss) {
      let customStyleElement = document.getElementById('custom-branding-css')
      if (!customStyleElement) {
        customStyleElement = document.createElement('style')
        customStyleElement.id = 'custom-branding-css'
        document.head.appendChild(customStyleElement)
      }
      customStyleElement.textContent = branding.advanced.customCss
    }

    // Appliquer le JS personnalisé
    if (branding.advanced.customJs) {
      let customScriptElement = document.getElementById('custom-branding-js')
      if (!customScriptElement) {
        customScriptElement = document.createElement('script')
        customScriptElement.id = 'custom-branding-js'
        document.head.appendChild(customScriptElement)
      }
      customScriptElement.textContent = branding.advanced.customJs
    }
  }, [branding])

  const updateBranding = (newBranding: Partial<PlatformBranding>) => {
    setBranding(prev => ({
      ...prev,
      ...newBranding
    }))
  }

  const resetToDefault = () => {
    setBranding(defaultBranding)
    localStorage.removeItem('platform-branding')
  }

  const saveBranding = async () => {
    setIsLoading(true)
    try {
      // Sauvegarder dans le localStorage (en attendant l'API)
      localStorage.setItem('platform-branding', JSON.stringify(branding))
      
      // TODO: Implémenter l'appel API pour sauvegarder en base de données
      // await fetch('/api/branding', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(branding)
      // })
      
      console.log('Branding sauvegardé avec succès')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du branding:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: BrandingContextType = {
    branding,
    updateBranding,
    resetToDefault,
    saveBranding,
    isLoading
  }

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding() {
  const context = useContext(BrandingContext)
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider')
  }
  return context
}

// Hook pour obtenir facilement le logo actuel
export function useLogo() {
  const { branding } = useBranding()
  return {
    light: branding.logo.light,
    dark: branding.logo.dark,
    favicon: branding.logo.favicon
  }
}

// Hook pour obtenir les couleurs du thème
export function useThemeColors() {
  const { branding } = useBranding()
  return branding.colors
}
