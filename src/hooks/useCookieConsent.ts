'use client'

import { useState, useEffect, useCallback } from 'react'
import ClientCookieService from '@/lib/cookies.client'

export type ConsentStatus = 'unset' | 'accepted' | 'declined'

export function useCookieConsent() {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('unset')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load consent status on mount
  useEffect(() => {
    const loadConsent = () => {
      const consent = ClientCookieService.getCookie('nm_consent') as ConsentStatus || 'unset'
      setConsentStatus(consent)
      setIsLoaded(true)
    }

    loadConsent()
  }, [])

  // Accept cookies
  const acceptCookies = useCallback(() => {
    setConsentStatus('accepted')
    ClientCookieService.setCookie('nm_consent', 'accepted', {
      maxAge: 60 * 60 * 24 * 180, // 180 days
    })
  }, [])

  // Decline cookies
  const declineCookies = useCallback(() => {
    setConsentStatus('declined')
    ClientCookieService.setCookie('nm_consent', 'declined', {
      maxAge: 60 * 60 * 24 * 180, // 180 days
    })
  }, [])

  // Reset consent (for testing)
  const resetConsent = useCallback(() => {
    setConsentStatus('unset')
    ClientCookieService.deleteCookie('nm_consent')
  }, [])

  // Check if analytics should be enabled
  const analyticsEnabled = consentStatus === 'accepted'

  // Check if non-essential cookies should be set
  const nonEssentialCookiesAllowed = consentStatus === 'accepted'

  return {
    consentStatus,
    isLoaded,
    analyticsEnabled,
    nonEssentialCookiesAllowed,
    acceptCookies,
    declineCookies,
    resetConsent,
    shouldShowBanner: isLoaded && consentStatus === 'unset'
  }
}

export default useCookieConsent
