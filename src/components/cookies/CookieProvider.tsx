'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import ConsentBanner from './ConsentBanner'
import CookiePolicy from './CookiePolicy'
import useCookieConsent from '@/hooks/useCookieConsent'
import usePreferences from '@/hooks/usePreferences'

interface CookieContextType {
  // Consent
  consentStatus: 'unset' | 'accepted' | 'declined'
  acceptCookies: () => void
  declineCookies: () => void
  
  // Preferences
  theme: 'light' | 'dark' | 'system'
  language: 'fr' | 'en'
  sidebar: 'rail' | 'expanded'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLanguage: (language: 'fr' | 'en') => void
  setSidebar: (sidebar: 'rail' | 'expanded') => void
  
  // Status
  cookiesEnabled: boolean
  analyticsEnabled: boolean
  isLoaded: boolean
  
  // Policy
  showPolicy: () => void
}

const CookieContext = createContext<CookieContextType | undefined>(undefined)

interface CookieProviderProps {
  children: ReactNode
}

export function CookieProvider({ children }: CookieProviderProps) {
  const consent = useCookieConsent()
  const preferences = usePreferences()
  const [showPolicyModal, setShowPolicyModal] = useState(false)

  const contextValue: CookieContextType = {
    // Consent
    consentStatus: consent.consentStatus,
    acceptCookies: consent.acceptCookies,
    declineCookies: consent.declineCookies,
    
    // Preferences
    theme: preferences.theme,
    language: preferences.language,
    sidebar: preferences.sidebar,
    setTheme: preferences.setTheme,
    setLanguage: preferences.setLanguage,
    setSidebar: preferences.setSidebar,
    
    // Status
    cookiesEnabled: preferences.cookiesEnabled,
    analyticsEnabled: consent.analyticsEnabled,
    isLoaded: consent.isLoaded && preferences.isLoaded,
    
    // Policy
    showPolicy: () => setShowPolicyModal(true),
  }

  return (
    <CookieContext.Provider value={contextValue}>
      {children}
      
      {/* Consent Banner */}
      <ConsentBanner onPolicyClick={() => setShowPolicyModal(true)} />
      
      {/* Cookie Policy Modal */}
      <CookiePolicy 
        isOpen={showPolicyModal} 
        onClose={() => setShowPolicyModal(false)} 
      />
    </CookieContext.Provider>
  )
}

export function useCookies() {
  const context = useContext(CookieContext)
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider')
  }
  return context
}

export default CookieProvider
