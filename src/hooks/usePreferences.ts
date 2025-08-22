'use client'

import { useState, useEffect, useCallback } from 'react'
import ClientCookieService from '@/lib/cookies.client'

export type Theme = 'light' | 'dark' | 'system'
export type Language = 'fr' | 'en'
export type SidebarState = 'rail' | 'expanded'

interface PreferencesState {
  theme: Theme
  language: Language
  sidebar: SidebarState
}

const DEFAULT_PREFERENCES: PreferencesState = {
  theme: 'system',
  language: 'fr',
  sidebar: 'expanded'
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<PreferencesState>(DEFAULT_PREFERENCES)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = () => {
      const theme = ClientCookieService.getWithFallback('nm_theme', 'nextmove_theme') as Theme || DEFAULT_PREFERENCES.theme
      const language = ClientCookieService.getWithFallback('nm_lang', 'nextmove_language') as Language || DEFAULT_PREFERENCES.language
      const sidebar = ClientCookieService.getWithFallback('nm_sb', 'nextmove_sidebar') as SidebarState || DEFAULT_PREFERENCES.sidebar

      setPreferences({ theme, language, sidebar })
      setIsLoaded(true)
    }

    loadPreferences()
  }, [])

  // Set theme preference
  const setTheme = useCallback((theme: Theme) => {
    setPreferences(prev => ({ ...prev, theme }))
    ClientCookieService.setWithFallback('nm_theme', 'nextmove_theme', theme)
  }, [])

  // Set language preference
  const setLanguage = useCallback((language: Language) => {
    setPreferences(prev => ({ ...prev, language }))
    ClientCookieService.setWithFallback('nm_lang', 'nextmove_language', language)
  }, [])

  // Set sidebar preference
  const setSidebar = useCallback((sidebar: SidebarState) => {
    setPreferences(prev => ({ ...prev, sidebar }))
    ClientCookieService.setWithFallback('nm_sb', 'nextmove_sidebar', sidebar)
  }, [])

  // Reset all preferences
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES)
    ClientCookieService.deleteCookie('nm_theme')
    ClientCookieService.deleteCookie('nm_lang')
    ClientCookieService.deleteCookie('nm_sb')
    
    // Also clear localStorage fallbacks
    try {
      localStorage.removeItem('nextmove_theme')
      localStorage.removeItem('nextmove_language')
      localStorage.removeItem('nextmove_sidebar')
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Check if cookies are available
  const cookiesEnabled = ClientCookieService.areCookiesEnabled()

  return {
    // State
    theme: preferences.theme,
    language: preferences.language,
    sidebar: preferences.sidebar,
    isLoaded,
    cookiesEnabled,
    
    // Actions
    setTheme,
    setLanguage,
    setSidebar,
    resetPreferences,
    
    // Utilities
    preferences,
    setPreferences: (newPrefs: Partial<PreferencesState>) => {
      const updated = { ...preferences, ...newPrefs }
      setPreferences(updated)
      
      if (newPrefs.theme) ClientCookieService.setWithFallback('nm_theme', 'nextmove_theme', newPrefs.theme)
      if (newPrefs.language) ClientCookieService.setWithFallback('nm_lang', 'nextmove_language', newPrefs.language)
      if (newPrefs.sidebar) ClientCookieService.setWithFallback('nm_sb', 'nextmove_sidebar', newPrefs.sidebar)
    }
  }
}

export default usePreferences
