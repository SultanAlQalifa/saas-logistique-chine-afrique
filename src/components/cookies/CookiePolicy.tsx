'use client'

import { X, Cookie, Shield, Clock, Database, Globe } from 'lucide-react'

interface CookiePolicyProps {
  isOpen: boolean
  onClose: () => void
}

export function CookiePolicy({ isOpen, onClose }: CookiePolicyProps) {
  if (!isOpen) return null

  return (
    <div data-testid="cookie-policy-modal" className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Politique de Cookies - NextMove Cargo
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Introduction */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Qu'est-ce que les cookies ?
              </h3>
              <p className="text-gray-600">
                Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez notre site. 
                NextMove Cargo utilise uniquement des cookies essentiels et de confort pour améliorer votre expérience.
              </p>
            </div>

            {/* Types de cookies */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Types de cookies utilisés
              </h3>
              
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium text-gray-900">Cookies Essentiels</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      Toujours actifs
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Nécessaires au fonctionnement du site et à votre authentification.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• <code>nm_sess</code> - Session utilisateur sécurisée (7 jours)</li>
                    <li>• <code>nm_csrf</code> - Protection contre les attaques CSRF (1 heure)</li>
                  </ul>
                </div>

                {/* Preference Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium text-gray-900">Cookies de Préférences</h4>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      Confort
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Mémorisent vos préférences pour une meilleure expérience.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• <code>nm_theme</code> - Thème d'affichage (180 jours)</li>
                    <li>• <code>nm_lang</code> - Langue préférée (180 jours)</li>
                    <li>• <code>nm_sb</code> - État de la barre latérale (180 jours)</li>
                  </ul>
                </div>

                {/* Consent Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <h4 className="font-medium text-gray-900">Cookies de Consentement</h4>
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                      Mémorisation
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Mémorisent votre choix concernant l'utilisation des cookies.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• <code>nm_consent</code> - Statut du consentement (180 jours)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Multi-tenant */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Multi-tenant et Domaines
              </h3>
              <p className="text-gray-600">
                Si vous accédez à NextMove Cargo via différents sous-domaines, 
                des cookies spécifiques peuvent être définis pour chaque tenant, 
                garantissant l'isolation des données entre les entreprises.
              </p>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Sécurité et Confidentialité
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="text-sm text-green-700 space-y-2">
                  <li>✓ Aucune donnée personnelle sensible stockée dans les cookies</li>
                  <li>✓ Cookies de session chiffrés et sécurisés (HttpOnly, Secure, SameSite)</li>
                  <li>✓ Pas de partage avec des tiers publicitaires</li>
                  <li>✓ Pas de tracking cross-site</li>
                  <li>✓ Conformité RGPD et protection des données</li>
                </ul>
              </div>
            </div>

            {/* Gestion */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Gestion de vos Cookies
              </h3>
              <p className="text-gray-600 mb-3">
                Vous pouvez à tout moment :
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Modifier vos préférences via les paramètres de votre navigateur</li>
                <li>• Supprimer les cookies existants</li>
                <li>• Désactiver les cookies non essentiels</li>
                <li>• Utiliser le mode navigation privée</li>
              </ul>
              <p className="text-sm text-gray-500 mt-3">
                Note : La désactivation des cookies essentiels peut affecter le fonctionnement du site.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Questions sur notre politique des cookies ?
              </h4>
              <p className="text-sm text-gray-600">
                Contactez notre équipe à{' '}
                <a href="mailto:privacy@nextmove-cargo.com" className="text-blue-600 hover:underline">
                  privacy@nextmove-cargo.com
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              J'ai compris
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicy
