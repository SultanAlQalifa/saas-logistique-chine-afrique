'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Book, Search, Download, ChevronRight, ChevronDown, Play, FileText, Users, Settings, Package, CreditCard, BarChart3, MessageCircle, Globe, Truck, Ship, Plane, ArrowLeft, Code } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function DocumentationPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started'])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const documentationSections = [
    {
      id: 'getting-started',
      title: 'Premiers pas',
      icon: Play,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      content: [
        {
          title: 'Bienvenue sur NextMove Cargo',
          content: `
            <h3>🌍 ${t('doc.platform_title')}</h3>
            <p>${t('doc.platform_description')}</p>
            <ul>
              <li>📦 ${t('doc.manage_packages')}</li>
              <li>💰 ${t('doc.calculate_rates')}</li>
              <li>📊 ${t('doc.track_performance')}</li>
              <li>💬 ${t('doc.communicate_clients')}</li>
              <li>🔄 ${t('doc.automate_processes')}</li>
            </ul>
          `
        },
        {
          title: 'Configuration initiale',
          content: `
            <h3>⚙️ Paramétrage de votre compte</h3>
            <ol>
              <li><strong>Profil utilisateur :</strong> Complétez vos informations personnelles</li>
              <li><strong>Entreprise :</strong> Renseignez les détails de votre société</li>
              <li><strong>Préférences :</strong> Choisissez votre langue, devise et fuseau horaire</li>
              <li><strong>Notifications :</strong> Configurez vos alertes</li>
            </ol>
            <div class="bg-blue-50 p-4 rounded-lg mt-4">
              <p><strong>💡 Conseil :</strong> Une configuration complète améliore la précision des tarifs et des délais.</p>
            </div>
          `
        }
      ]
    },
    {
      id: 'packages',
      title: 'Gestion des colis',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      content: [
        {
          title: 'Créer un nouveau colis',
          content: `
            <h3>📦 Ajouter un colis</h3>
            <ol>
              <li>Accédez à <strong>Colis > Nouveau colis</strong></li>
              <li>Remplissez les informations obligatoires :
                <ul>
                  <li>Poids et dimensions</li>
                  <li>Valeur déclarée</li>
                  <li>Description du contenu</li>
                  <li>Adresses expéditeur/destinataire</li>
                </ul>
              </li>
              <li>Choisissez le mode de transport</li>
              <li>Validez et obtenez votre numéro de suivi</li>
            </ol>
          `
        },
        {
          title: 'Suivi des expéditions',
          content: `
            <h3>🔍 Suivre vos colis</h3>
            <p>Le suivi en temps réel vous permet de :</p>
            <ul>
              <li><strong>Localiser</strong> vos colis à tout moment</li>
              <li><strong>Recevoir</strong> des notifications automatiques</li>
              <li><strong>Informer</strong> vos clients proactivement</li>
              <li><strong>Anticiper</strong> les retards éventuels</li>
            </ul>
            <div class="bg-yellow-50 p-4 rounded-lg mt-4">
              <p><strong>⚡ Astuce :</strong> Utilisez l'API de suivi pour intégrer le tracking dans vos propres systèmes.</p>
            </div>
          `
        }
      ]
    },
    {
      id: 'pricing',
      title: 'Tarification',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      content: [
        {
          title: 'Calculateur de tarifs',
          content: `
            <h3>💰 Obtenir un devis instantané</h3>
            <p>Notre calculateur intelligent prend en compte :</p>
            <ul>
              <li><strong>Poids volumétrique</strong> vs poids réel</li>
              <li><strong>Distance</strong> et itinéraire</li>
              <li><strong>Mode de transport</strong> (maritime, aérien)</li>
              <li><strong>Services additionnels</strong> (assurance, douane)</li>
              <li><strong>Remises</strong> selon votre volume</li>
            </ul>
            
            <h4>🚢 Transport Maritime</h4>
            <ul>
              <li>Délai : 18-35 jours</li>
              <li>Tarif : À partir de 2€/kg</li>
              <li>Idéal pour : Gros volumes, produits non urgents</li>
            </ul>
            
            <h4>✈️ Transport Aérien</h4>
            <ul>
              <li>Délai : 3-7 jours</li>
              <li>Tarif : À partir de 8€/kg</li>
              <li>Idéal pour : Urgences, produits de valeur</li>
            </ul>
          `
        },
        {
          title: 'Grille tarifaire',
          content: `
            <h3>📊 Comprendre nos tarifs</h3>
            <table class="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 p-2">Zone</th>
                  <th class="border border-gray-300 p-2">Maritime (€/kg)</th>
                  <th class="border border-gray-300 p-2">Aérien (€/kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 p-2">Afrique de l'Ouest</td>
                  <td class="border border-gray-300 p-2">2.50 - 4.00</td>
                  <td class="border border-gray-300 p-2">8.00 - 12.00</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-2">Afrique Centrale</td>
                  <td class="border border-gray-300 p-2">3.00 - 4.50</td>
                  <td class="border border-gray-300 p-2">9.00 - 13.00</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-2">Afrique de l'Est</td>
                  <td class="border border-gray-300 p-2">2.80 - 4.20</td>
                  <td class="border border-gray-300 p-2">8.50 - 12.50</td>
                </tr>
              </tbody>
            </table>
          `
        }
      ]
    },
    {
      id: 'clients',
      title: 'Gestion clients',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      content: [
        {
          title: 'Base de données clients',
          content: `
            <h3>👥 Gérer vos clients</h3>
            <p>Centralisez toutes les informations de vos clients :</p>
            <ul>
              <li><strong>Profils complets</strong> avec historique</li>
              <li><strong>Segmentation</strong> par volume, région, type</li>
              <li><strong>Tarifs personnalisés</strong> selon les accords</li>
              <li><strong>Communications</strong> intégrées</li>
            </ul>
            
            <h4>🎯 Segmentation automatique</h4>
            <ul>
              <li><strong>VIP :</strong> +100 colis/mois</li>
              <li><strong>Régulier :</strong> 20-100 colis/mois</li>
              <li><strong>Occasionnel :</strong> &lt;20 colis/mois</li>
            </ul>
          `
        },
        {
          title: 'Communication client',
          content: `
            <h3>💬 Rester en contact</h3>
            <p>Outils de communication intégrés :</p>
            <ul>
              <li><strong>Chat en temps réel</strong> avec traduction automatique</li>
              <li><strong>Notifications SMS/Email</strong> personnalisées</li>
              <li><strong>WhatsApp Business</strong> pour un contact direct</li>
              <li><strong>Portail client</strong> en libre-service</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analyses et rapports',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      content: [
        {
          title: 'Tableau de bord',
          content: `
            <h3>📊 Vue d'ensemble de votre activité</h3>
            <p>Métriques clés disponibles :</p>
            <ul>
              <li><strong>Volume mensuel</strong> et évolution</li>
              <li><strong>Chiffre d'affaires</strong> par période</li>
              <li><strong>Performance des livraisons</strong></li>
              <li><strong>Satisfaction client</strong></li>
              <li><strong>Rentabilité par route</strong></li>
            </ul>
          `
        },
        {
          title: 'Rapports personnalisés',
          content: `
            <h3>📈 Analyses approfondies</h3>
            <p>Créez des rapports sur mesure :</p>
            <ul>
              <li><strong>Filtres avancés</strong> par date, client, route</li>
              <li><strong>Graphiques interactifs</strong> et tableaux</li>
              <li><strong>Export</strong> en PDF, Excel, CSV</li>
              <li><strong>Planification automatique</strong> d'envoi</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'ai-assistant',
      title: 'Assistant IA',
      icon: MessageCircle,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      content: [
        {
          title: 'Votre assistant personnel',
          content: `
            <h3>🤖 Assistant IA 24/7</h3>
            <p>Notre assistant IA vous aide à :</p>
            <ul>
              <li><strong>Répondre aux clients</strong> instantanément</li>
              <li><strong>Calculer des devis</strong> automatiquement</li>
              <li><strong>Suivre les colis</strong> et informer</li>
              <li><strong>Gérer les réclamations</strong> avec empathie</li>
              <li><strong>Prospecter</strong> de nouveaux clients</li>
            </ul>
            
            <div class="bg-green-50 p-4 rounded-lg mt-4">
              <p><strong>🌍 Noms adaptatifs :</strong> L'assistant prend un nom africain selon la localisation de votre interlocuteur (Amina, Kwame, Fatou, etc.)</p>
            </div>
          `
        },
        {
          title: 'Configuration de l\'IA',
          content: `
            <h3>⚙️ Personnaliser votre assistant</h3>
            <ul>
              <li><strong>Ton de communication :</strong> Formel, amical, professionnel</li>
              <li><strong>Langues supportées :</strong> Français, anglais, chinois, arabe</li>
              <li><strong>Seuils d'escalade :</strong> Quand transférer à un humain</li>
              <li><strong>Réponses automatiques :</strong> Templates personnalisés</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'integrations',
      title: 'Intégrations',
      icon: Globe,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      content: [
        {
          title: 'API et webhooks',
          content: `
            <h3>🔌 Connecter vos systèmes</h3>
            <p>Intégrations disponibles :</p>
            <ul>
              <li><strong>API REST</strong> complète avec documentation</li>
              <li><strong>Webhooks</strong> pour les événements temps réel</li>
              <li><strong>SDK</strong> JavaScript, Python, PHP</li>
              <li><strong>Plugins</strong> WooCommerce, Shopify, Magento</li>
            </ul>
            
            <h4>📱 Applications mobiles</h4>
            <ul>
              <li><strong>iOS/Android</strong> pour vos équipes terrain</li>
              <li><strong>Scanner QR/codes-barres</strong> intégré</li>
              <li><strong>Géolocalisation</strong> des livraisons</li>
            </ul>
          `
        },
        {
          title: 'API de la plateforme',
          content: `
            <h3>🚀 API NextMove Cargo</h3>
            <p>Notre API REST complète vous permet d'intégrer toutes les fonctionnalités :</p>
            
            <h4>📦 Gestion des colis</h4>
            <ul>
              <li><strong>POST /api/packages</strong> - Créer un nouveau colis</li>
              <li><strong>GET /api/packages/{id}</strong> - Récupérer un colis</li>
              <li><strong>PUT /api/packages/{id}</strong> - Modifier un colis</li>
              <li><strong>GET /api/packages/{id}/tracking</strong> - Suivi en temps réel</li>
            </ul>
            
            <h4>💰 Tarification</h4>
            <ul>
              <li><strong>POST /api/pricing/calculate</strong> - Calculer un tarif</li>
              <li><strong>GET /api/pricing/zones</strong> - Zones tarifaires</li>
              <li><strong>GET /api/pricing/rates</strong> - Grilles de prix</li>
            </ul>
            
            <h4>👥 Clients</h4>
            <ul>
              <li><strong>GET /api/clients</strong> - Liste des clients</li>
              <li><strong>POST /api/clients</strong> - Créer un client</li>
              <li><strong>GET /api/clients/{id}/packages</strong> - Colis d'un client</li>
            </ul>
            
            <h4>🔔 Webhooks disponibles</h4>
            <ul>
              <li><strong>package.created</strong> - Nouveau colis créé</li>
              <li><strong>package.status_changed</strong> - Changement de statut</li>
              <li><strong>package.delivered</strong> - Colis livré</li>
              <li><strong>payment.completed</strong> - Paiement confirmé</li>
            </ul>
            
            <div class="bg-blue-50 p-4 rounded-lg mt-4">
              <p><strong>🔑 Authentification :</strong> API Key + Bearer Token pour sécuriser vos requêtes</p>
              <p><strong>📊 Rate Limiting :</strong> 1000 requêtes/heure par défaut</p>
              <p><strong>📄 Format :</strong> JSON avec support UTF-8</p>
            </div>
          `
        },
        {
          title: 'Réseaux sociaux',
          content: `
            <h3>📱 Présence sociale</h3>
            <p>Gestion centralisée de vos réseaux :</p>
            <ul>
              <li><strong>Publication multi-plateformes</strong> (Facebook, Instagram, LinkedIn)</li>
              <li><strong>Réponses automatiques</strong> aux messages privés</li>
              <li><strong>Suivi des mentions</strong> de votre marque</li>
              <li><strong>Analytics sociales</strong> intégrées</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Dépannage',
      icon: Settings,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      content: [
        {
          title: 'Problèmes courants',
          content: `
            <h3>🔧 Solutions rapides</h3>
            
            <h4>❌ Le site ne se traduit pas</h4>
            <ol>
              <li>Vérifiez que JavaScript est activé</li>
              <li>Videz le cache de votre navigateur</li>
              <li>Rechargez la page après changement de langue</li>
              <li>Contactez le support si le problème persiste</li>
            </ol>
            
            <h4>📦 Colis non trouvé</h4>
            <ul>
              <li>Vérifiez le numéro de suivi (format : NM-XXXXXXXXX)</li>
              <li>Attendez 24h après création pour la première mise à jour</li>
              <li>Utilisez la recherche avancée avec d'autres critères</li>
            </ul>
            
            <h4>💳 Problème de paiement</h4>
            <ul>
              <li>Vérifiez les informations de votre carte</li>
              <li>Assurez-vous que les paiements internationaux sont autorisés</li>
              <li>Essayez un autre mode de paiement</li>
            </ul>
          `
        },
        {
          title: 'Support technique',
          content: `
            <h3>🆘 Obtenir de l'aide</h3>
            <p>Plusieurs canaux de support :</p>
            <ul>
              <li><strong>Chat en direct :</strong> Réponse immédiate 24/7</li>
              <li><strong>Email :</strong> support@nextmovecargo.com</li>
              <li><strong>WhatsApp :</strong> +225 XX XX XX XX</li>
              <li><strong>Téléphone :</strong> Lun-Ven 8h-18h GMT</li>
            </ul>
            
            <div class="bg-blue-50 p-4 rounded-lg mt-4">
              <p><strong>💡 Conseil :</strong> Joignez des captures d'écran et votre numéro de compte pour un support plus rapide.</p>
            </div>
          `
        }
      ]
    }
  ]

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.some(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
              
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('nav.documentation')}</h1>
                <p className="text-gray-600">{t('doc.complete_guide')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  // Scroll vers la section API
                  const apiSection = document.getElementById('integrations')
                  if (apiSection) {
                    apiSection.scrollIntoView({ behavior: 'smooth' })
                    if (!expandedSections.includes('integrations')) {
                      setExpandedSections(prev => [...prev, 'integrations'])
                    }
                  }
                }}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Code className="w-4 h-4" />
                <span>API</span>
              </button>
              
              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Télécharger PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('doc.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {documentationSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        expandedSections.includes(section.id)
                          ? `${section.bgColor} ${section.color}`
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 font-medium">{section.title}</span>
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {filteredSections.map((section) => {
                const Icon = section.icon
                const isExpanded = expandedSections.includes(section.id)
                
                return (
                  <div key={section.id} id={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className={`${section.bgColor} px-6 py-4 border-b border-gray-200`}>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${section.color}`} />
                        <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-6 space-y-6">
                        {section.content.map((item, index) => (
                          <div key={index} className="border-l-4 border-orange-200 pl-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                            <div 
                              className="prose prose-orange max-w-none"
                              dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 bg-gradient-to-r from-orange-500 to-green-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Actions rapides</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => window.location.href = '/dashboard/client-portal'}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-left transition-colors"
                >
                  <Truck className="w-6 h-6 mb-2" />
                  <div className="font-medium">Créer un colis</div>
                  <div className="text-sm opacity-90">Nouvelle expédition</div>
                </button>
                
                <button 
                  onClick={() => window.location.href = '/dashboard/client-portal?tab=quotes'}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-left transition-colors"
                >
                  <CreditCard className="w-6 h-6 mb-2" />
                  <div className="font-medium">Calculer tarif</div>
                  <div className="text-sm opacity-90">Devis instantané</div>
                </button>
                
                <button 
                  onClick={() => {
                    // Déclencher l'ouverture du chat widget
                    const chatEvent = new CustomEvent('openChat')
                    window.dispatchEvent(chatEvent)
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-left transition-colors"
                >
                  <MessageCircle className="w-6 h-6 mb-2" />
                  <div className="font-medium">Support</div>
                  <div className="text-sm opacity-90">Aide en direct</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
