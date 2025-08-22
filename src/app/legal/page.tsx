'use client'

import { useState } from 'react'
import { Shield, Cookie, Eye, Lock, FileText, Users, Globe, Mail } from 'lucide-react'

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState('cookies')

  const sections = [
    { id: 'cookies', label: 'Politique Cookies', icon: Cookie },
    { id: 'privacy', label: 'Confidentialité', icon: Eye },
    { id: 'terms', label: 'Conditions d\'utilisation', icon: FileText },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mentions Légales</h1>
              <p className="text-gray-600">Politique de confidentialité et conditions d'utilisation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {activeSection === 'cookies' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Cookie className="h-6 w-6 text-orange-500" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      🍪 Politique de Cookies — NextMove
                    </h2>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">
                      Notre plateforme utilise uniquement des cookies techniques et de confort.
                      Nous ne déposons aucun cookie publicitaire ni traceur tiers.
                    </p>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">Types de cookies utilisés</h3>

                    <div className="space-y-6">
                      {/* Cookies de session */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-5 w-5 text-green-500" />
                          <h4 className="font-medium text-gray-900">Cookies de session (sécurisés)</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Finalité :</strong> assurer la connexion et la sécurité des utilisateurs.
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Durée :</strong> supprimés automatiquement à la déconnexion ou après expiration.
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Contenu :</strong> identifiant technique anonyme (aucune donnée sensible).
                        </p>
                      </div>

                      {/* Cookies de préférences */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-5 w-5 text-blue-500" />
                          <h4 className="font-medium text-gray-900">Cookies de préférences</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Finalité :</strong> mémoriser vos choix (langue, thème, affichage de la barre latérale).
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Durée :</strong> maximum 6 mois.
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Contenu :</strong> valeurs simples (ex. "dark" pour le thème).
                        </p>
                      </div>

                      {/* Cookie de consentement */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-purple-500" />
                          <h4 className="font-medium text-gray-900">Cookie de consentement</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Finalité :</strong> stocker votre choix "Accepter" ou "Refuser" les cookies optionnels.
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Durée :</strong> 6 mois.
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Contenu :</strong> "accepted" / "declined".
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-4 mt-8">Vos choix</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Au premier accès, un bandeau vous propose Accepter ou Refuser.</li>
                      <li>• Vous pouvez modifier vos préférences à tout moment via la page Paramètres Cookies.</li>
                    </ul>

                    <h3 className="text-lg font-medium text-gray-900 mb-4 mt-8">Garanties</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <ul className="text-green-700 space-y-2">
                        <li>✓ Aucune donnée personnelle ou bancaire n'est stockée dans nos cookies.</li>
                        <li>✓ En cas de refus, la plateforme reste utilisable (avec un mode dégradé minimal).</li>
                        <li>✓ Nos cookies sont limités à nos domaines et ne servent pas au suivi publicitaire.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="h-6 w-6 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Politique de Confidentialité</h2>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">
                      NextMove Cargo s'engage à protéger votre vie privée et vos données personnelles.
                    </p>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">Données collectées</h3>
                    <ul className="text-gray-700 space-y-2 mb-6">
                      <li>• Informations de compte (email, nom, entreprise)</li>
                      <li>• Données de colis et expéditions</li>
                      <li>• Logs de connexion et d'utilisation</li>
                      <li>• Préférences d'interface utilisateur</li>
                    </ul>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">Utilisation des données</h3>
                    <ul className="text-gray-700 space-y-2 mb-6">
                      <li>• Fourniture du service de logistique</li>
                      <li>• Support client et assistance</li>
                      <li>• Amélioration de la plateforme</li>
                      <li>• Conformité légale et réglementaire</li>
                    </ul>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vos droits</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <ul className="text-blue-700 space-y-2">
                        <li>✓ Droit d'accès à vos données</li>
                        <li>✓ Droit de rectification</li>
                        <li>✓ Droit à l'effacement</li>
                        <li>✓ Droit à la portabilité</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'terms' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-gray-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Conditions d'Utilisation</h2>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">
                      En utilisant NextMove Cargo, vous acceptez les présentes conditions d'utilisation.
                    </p>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">Service fourni</h3>
                    <p className="text-gray-700 mb-6">
                      NextMove Cargo est une plateforme SaaS de gestion logistique pour les expéditions entre la Chine et l'Afrique.
                    </p>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">Responsabilités</h3>
                    <ul className="text-gray-700 space-y-2 mb-6">
                      <li>• Utilisation conforme aux lois en vigueur</li>
                      <li>• Protection de vos identifiants de connexion</li>
                      <li>• Exactitude des informations fournies</li>
                      <li>• Respect des autres utilisateurs</li>
                    </ul>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">Limitation de responsabilité</h3>
                    <p className="text-gray-700">
                      NextMove Cargo ne peut être tenu responsable des dommages indirects ou des pertes de données.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-6 w-6 text-green-500" />
                    <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">
                      La sécurité de vos données est notre priorité absolue.
                    </p>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">Mesures de sécurité</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Chiffrement</h4>
                        <p className="text-sm text-gray-600">
                          Toutes les données sont chiffrées en transit (HTTPS) et au repos.
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Authentification</h4>
                        <p className="text-sm text-gray-600">
                          Sessions sécurisées avec tokens JWT et protection CSRF.
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Monitoring</h4>
                        <p className="text-sm text-gray-600">
                          Surveillance continue avec Sentry pour détecter les anomalies.
                        </p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Accès</h4>
                        <p className="text-sm text-gray-600">
                          Contrôle d'accès granulaire par rôles et permissions.
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-4">Conformité</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <ul className="text-green-700 space-y-2">
                        <li>✓ Conformité RGPD</li>
                        <li>✓ Standards de sécurité ISO 27001</li>
                        <li>✓ Audits de sécurité réguliers</li>
                        <li>✓ Plan de continuité d'activité</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-900">Contact</h3>
                </div>
                <p className="text-gray-600">
                  Pour toute question concernant cette politique, contactez-nous à{' '}
                  <a href="mailto:legal@nextmove-cargo.com" className="text-blue-600 hover:underline">
                    legal@nextmove-cargo.com
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
