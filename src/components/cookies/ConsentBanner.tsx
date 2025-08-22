'use client'

import { useState } from 'react'
import { X, Cookie, Info, Check, Shield } from 'lucide-react'
import useCookieConsent from '@/hooks/useCookieConsent'

interface ConsentBannerProps {
  onPolicyClick?: () => void
}

export function ConsentBanner({ onPolicyClick }: ConsentBannerProps) {
  const { shouldShowBanner, acceptCookies, declineCookies } = useCookieConsent()
  const [isVisible, setIsVisible] = useState(true)

  if (!shouldShowBanner || !isVisible) {
    return null
  }

  const handleAccept = () => {
    acceptCookies()
    setIsVisible(false)
  }

  const handleDecline = () => {
    declineCookies()
    setIsVisible(false)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  const handlePolicyClick = () => {
    if (onPolicyClick) {
      onPolicyClick()
    } else {
      // Default: navigate to legal page
      window.open('/legal', '_blank')
    }
  }

  return (
    <div data-testid="consent-banner" className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Content */}
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 mt-0.5">
              <Cookie className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">
                Cookies et confidentialité
              </p>
              <p className="text-gray-600">
                Nous utilisons des cookies techniques pour la connexion et vos préférences (thème, langue). 
                Aucune donnée personnelle n'est partagée avec des tiers.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              data-testid="consent-more"
              onClick={handlePolicyClick}
              className="text-sm text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
            >
              <Info className="h-3 w-3" />
              En savoir plus
            </button>
            
            <button
              data-testid="consent-decline"
              onClick={handleDecline}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Refuser
            </button>
            
            <button
              data-testid="consent-accept"
              onClick={handleAccept}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Check className="h-3 w-3" />
              Accepter
            </button>
            
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Données sécurisées
            </div>
            <div className="flex items-center gap-1">
              <Cookie className="h-3 w-3" />
              Cookies techniques uniquement
            </div>
            <div>
              Aucun tracking publicitaire
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsentBanner
