'use client'

import Navigation from '@/components/Navigation'
import { useState } from 'react'
import { 
  Book, 
  Search, 
  ChevronRight, 
  FileText, 
  Video, 
  Code, 
  Download,
  ExternalLink,
  Users,
  Settings,
  Package,
  Truck,
  BarChart3,
  CreditCard,
  MessageSquare,
  Shield,
  Clock,
  Globe,
  Zap,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const categories = [
    { id: 'all', name: 'Tout', icon: Book },
    { id: 'getting-started', name: 'Démarrage', icon: Zap },
    { id: 'packages', name: 'Gestion Colis', icon: Package },
    { id: 'logistics', name: 'Logistique', icon: Truck },
    { id: 'clients', name: 'Clients & Support', icon: Users },
    { id: 'analytics', name: 'Analytics & Rapports', icon: BarChart3 },
    { id: 'billing', name: 'Finance & Comptabilité', icon: CreditCard },
    { id: 'communication', name: 'Communication & Marketing', icon: MessageSquare },
    { id: 'security', name: 'Sécurité & Audit', icon: Shield },
    { id: 'api', name: 'API & Développement', icon: Code },
    { id: 'integrations', name: 'Intégrations & Connecteurs', icon: Globe }
  ]

  const documentationItems = [
    // Getting Started
    {
      id: 1,
      title: "Guide de démarrage rapide",
      description: "Commencez avec NextMove Cargo en 5 minutes",
      category: "getting-started",
      type: "guide",
      readTime: "5 min",
      difficulty: "Débutant",
      tags: ["setup", "basics", "onboarding"]
    },
    {
      id: 2,
      title: "Configuration initiale de votre compte",
      description: "Paramétrez votre entreprise et vos préférences",
      category: "getting-started",
      type: "tutorial",
      readTime: "10 min",
      difficulty: "Débutant",
      tags: ["configuration", "account", "setup"]
    },
    {
      id: 3,
      title: "Comprendre les rôles et permissions",
      description: "Gérez les accès de votre équipe efficacement",
      category: "getting-started",
      type: "guide",
      readTime: "8 min",
      difficulty: "Intermédiaire",
      tags: ["roles", "permissions", "team"]
    },
    {
      id: 4,
      title: "Interface Super Admin",
      description: "Découvrez les fonctionnalités avancées d'administration",
      category: "getting-started",
      type: "guide",
      readTime: "12 min",
      difficulty: "Avancé",
      tags: ["super-admin", "administration", "advanced"]
    },

    // Package Management
    {
      id: 5,
      title: "Créer et gérer vos colis",
      description: "Guide complet pour la gestion des colis avec upload d'images",
      category: "packages",
      type: "tutorial",
      readTime: "15 min",
      difficulty: "Débutant",
      tags: ["packages", "creation", "management", "photos"]
    },
    {
      id: 6,
      title: "Calcul automatique des tarifs",
      description: "Comprendre le système de tarification en FCFA",
      category: "packages",
      type: "guide",
      readTime: "12 min",
      difficulty: "Intermédiaire",
      tags: ["pricing", "calculation", "rates", "fcfa"]
    },
    {
      id: 7,
      title: "Suivi en temps réel des expéditions",
      description: "Utilisez le système de tracking avancé avec API",
      category: "packages",
      type: "tutorial",
      readTime: "10 min",
      difficulty: "Débutant",
      tags: ["tracking", "monitoring", "status", "api"]
    },
    {
      id: 8,
      title: "Prise de photos et documentation",
      description: "Capturez et gérez les photos de vos colis",
      category: "packages",
      type: "tutorial",
      readTime: "8 min",
      difficulty: "Débutant",
      tags: ["photos", "camera", "documentation", "mobile"]
    },

    // Logistics
    {
      id: 9,
      title: "Gestion des cargos et conteneurs",
      description: "Optimisez vos expéditions groupées",
      category: "logistics",
      type: "guide",
      readTime: "20 min",
      difficulty: "Avancé",
      tags: ["cargo", "containers", "optimization"]
    },
    {
      id: 10,
      title: "Routes commerciales Chine-Afrique",
      description: "Découvrez nos corridors logistiques",
      category: "logistics",
      type: "reference",
      readTime: "8 min",
      difficulty: "Débutant",
      tags: ["routes", "china", "africa"]
    },

    // Client Management
    {
      id: 11,
      title: "Gestion de votre base clients",
      description: "Organisez et segmentez vos clients avec CRM avancé",
      category: "clients",
      type: "tutorial",
      readTime: "15 min",
      difficulty: "Intermédiaire",
      tags: ["clients", "crm", "segmentation"]
    },
    {
      id: 12,
      title: "Système de notifications clients",
      description: "Automatisez vos communications multi-canaux",
      category: "clients",
      type: "guide",
      readTime: "12 min",
      difficulty: "Intermédiaire",
      tags: ["notifications", "automation", "communication", "multi-channel"]
    },
    {
      id: 13,
      title: "Support client intelligent",
      description: "Utilisez le chatbot IA et l'allocation automatique",
      category: "clients",
      type: "tutorial",
      readTime: "18 min",
      difficulty: "Intermédiaire",
      tags: ["support", "chatbot", "ai", "allocation", "tickets"]
    },

    // Analytics
    {
      id: 14,
      title: "Tableaux de bord et rapports",
      description: "Analysez vos performances avec drill-down et personnalisation",
      category: "analytics",
      type: "tutorial",
      readTime: "18 min",
      difficulty: "Intermédiaire",
      tags: ["dashboard", "reports", "kpi", "drill-down", "customization"]
    },
    {
      id: 15,
      title: "Export de données et intégrations",
      description: "Connectez vos outils externes via API REST",
      category: "analytics",
      type: "guide",
      readTime: "14 min",
      difficulty: "Avancé",
      tags: ["export", "integration", "data", "api"]
    },
    {
      id: 16,
      title: "Analytics support et allocation",
      description: "Optimisez vos performances support avec métriques avancées",
      category: "analytics",
      type: "guide",
      readTime: "16 min",
      difficulty: "Avancé",
      tags: ["support", "analytics", "allocation", "performance"]
    },

    // Billing & Finance
    {
      id: 17,
      title: "Système comptable complet",
      description: "Gérez votre comptabilité avec journal et rapports financiers",
      category: "billing",
      type: "tutorial",
      readTime: "25 min",
      difficulty: "Avancé",
      tags: ["accounting", "journal", "financial-reports", "fcfa"]
    },
    {
      id: 18,
      title: "Facturation et devis",
      description: "Créez des devis et factures professionnels",
      category: "billing",
      type: "tutorial",
      readTime: "16 min",
      difficulty: "Intermédiaire",
      tags: ["billing", "invoices", "quotes", "templates"]
    },
    {
      id: 19,
      title: "Gestion des commissions agents",
      description: "Calculez et distribuez les commissions automatiquement",
      category: "billing",
      type: "guide",
      readTime: "12 min",
      difficulty: "Avancé",
      tags: ["commissions", "agents", "calculation", "automation"]
    },
    {
      id: 20,
      title: "Paiements Mobile Money",
      description: "Intégrez Orange Money, Free Money, Wave et MTN",
      category: "billing",
      type: "tutorial",
      readTime: "20 min",
      difficulty: "Intermédiaire",
      tags: ["mobile-money", "payments", "orange", "wave", "mtn"]
    },
    {
      id: 21,
      title: "Décaissements et retraits",
      description: "Gérez les demandes de décaissement des prestataires",
      category: "billing",
      type: "guide",
      readTime: "15 min",
      difficulty: "Intermédiaire",
      tags: ["withdrawal", "disbursement", "providers", "approval"]
    },

    // Communication
    {
      id: 22,
      title: "Système de communication complet",
      description: "Gérez notifications, campagnes et avis clients",
      category: "communication",
      type: "tutorial",
      readTime: "22 min",
      difficulty: "Intermédiaire",
      tags: ["notifications", "campaigns", "reviews", "templates"]
    },
    {
      id: 23,
      title: "Campagnes marketing automatisées",
      description: "Créez des campagnes multi-canaux ciblées",
      category: "communication",
      type: "guide",
      readTime: "20 min",
      difficulty: "Avancé",
      tags: ["marketing", "campaigns", "automation", "segmentation"]
    },
    {
      id: 24,
      title: "Gestion des avis clients",
      description: "Collectez et répondez aux avis de vos clients",
      category: "communication",
      type: "tutorial",
      readTime: "12 min",
      difficulty: "Débutant",
      tags: ["reviews", "feedback", "ratings", "response"]
    },
    {
      id: 25,
      title: "Chatbot IA et support automatisé",
      description: "Configurez l'assistant IA pour le support client",
      category: "communication",
      type: "guide",
      readTime: "18 min",
      difficulty: "Avancé",
      tags: ["chatbot", "ai", "automation", "support", "flows"]
    },

    // HR & Management
    {
      id: 26,
      title: "Gestion des ressources humaines",
      description: "Gérez employés, salaires et formation",
      category: "clients",
      type: "tutorial",
      readTime: "20 min",
      difficulty: "Intermédiaire",
      tags: ["hr", "employees", "payroll", "training"]
    },
    {
      id: 27,
      title: "Gestion de projets",
      description: "Planifiez et suivez vos projets logistiques",
      category: "clients",
      type: "guide",
      readTime: "16 min",
      difficulty: "Intermédiaire",
      tags: ["projects", "planning", "tracking", "teams"]
    },

    // Security
    {
      id: 28,
      title: "Sécurité et conformité",
      description: "Protégez vos données et respectez les réglementations",
      category: "security",
      type: "reference",
      readTime: "15 min",
      difficulty: "Intermédiaire",
      tags: ["security", "compliance", "gdpr"]
    },
    {
      id: 29,
      title: "Authentification à deux facteurs",
      description: "Renforcez la sécurité de vos comptes",
      category: "security",
      type: "tutorial",
      readTime: "8 min",
      difficulty: "Débutant",
      tags: ["2fa", "authentication", "security"]
    },
    {
      id: 30,
      title: "Gestion des logs et audit",
      description: "Surveillez l'activité système et les accès",
      category: "security",
      type: "guide",
      readTime: "14 min",
      difficulty: "Avancé",
      tags: ["logs", "audit", "monitoring", "security"]
    },

    // API & Integrations
    {
      id: 31,
      title: "API REST complète",
      description: "Intégrez NextMove Cargo avec l'API v1",
      category: "api",
      type: "reference",
      readTime: "35 min",
      difficulty: "Avancé",
      tags: ["api", "rest", "integration", "v1", "endpoints"]
    },
    {
      id: 32,
      title: "Authentification par clés API",
      description: "Sécurisez vos intégrations avec les clés API",
      category: "api",
      type: "tutorial",
      readTime: "15 min",
      difficulty: "Avancé",
      tags: ["api-keys", "authentication", "security", "integration"]
    },
    {
      id: 33,
      title: "Webhooks et événements",
      description: "Recevez des notifications en temps réel",
      category: "api",
      type: "tutorial",
      readTime: "25 min",
      difficulty: "Avancé",
      tags: ["webhooks", "events", "realtime", "notifications"]
    },
    {
      id: 34,
      title: "Interface d'administration API",
      description: "Gérez vos clés API et testez les endpoints",
      category: "api",
      type: "guide",
      readTime: "12 min",
      difficulty: "Intermédiaire",
      tags: ["api-management", "testing", "admin", "dashboard"]
    },

    // Integrations
    {
      id: 35,
      title: "Intégration WhatsApp Business",
      description: "Connectez votre compte WhatsApp pour la messagerie",
      category: "integrations",
      type: "tutorial",
      readTime: "12 min",
      difficulty: "Intermédiaire",
      tags: ["whatsapp", "messaging", "integration", "business"]
    },
    {
      id: 36,
      title: "Synchronisation avec les douanes",
      description: "Automatisez vos déclarations douanières",
      category: "integrations",
      type: "guide",
      readTime: "18 min",
      difficulty: "Avancé",
      tags: ["customs", "automation", "compliance", "declarations"]
    },
    {
      id: 37,
      title: "Intégrations e-commerce",
      description: "Connectez votre boutique en ligne via API",
      category: "integrations",
      type: "tutorial",
      readTime: "22 min",
      difficulty: "Avancé",
      tags: ["ecommerce", "api", "automation", "sync"]
    },
    {
      id: 38,
      title: "Configuration SMTP et emails",
      description: "Paramétrez l'envoi d'emails automatiques",
      category: "integrations",
      type: "guide",
      readTime: "10 min",
      difficulty: "Intermédiaire",
      tags: ["smtp", "email", "configuration", "automation"]
    }
  ]

  const filteredItems = documentationItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return Video
      case 'guide': return FileText
      case 'reference': return Book
      default: return FileText
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800'
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800'
      case 'Avancé': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleExpanded = (itemId: number) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main Content */}
      <div className="pt-20">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
        
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Book className="h-8 w-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">📚 Documentation</h1>
              </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Découvrez tout ce que vous devez savoir pour maîtriser NextMove Cargo. 
              Guides complets, API REST, chatbot IA, système comptable, mobile money et bien plus.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher dans la documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Categories */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📂 Catégories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  const isActive = selectedCategory === category.id
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                      {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </button>
                  )
                })}
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">🔗 Liens utiles</h4>
                <div className="space-y-2">
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                    <Download className="h-4 w-4" />
                    Télécharger PDF
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                    <ExternalLink className="h-4 w-4" />
                    API Reference
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                    <Video className="h-4 w-4" />
                    Tutoriels vidéo
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'Toute la documentation' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredItems.length} article{filteredItems.length > 1 ? 's' : ''} trouvé{filteredItems.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Documentation Grid */}
            <div className="grid gap-6">
              {filteredItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type)
                const isExpanded = expandedItems.includes(item.id)
                return (
                  <div key={item.id} id={`article-${item.id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <TypeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 
                              className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                              onClick={() => toggleExpanded(item.id)}
                            >
                              {item.title}
                            </h3>
                            <button 
                              onClick={() => toggleExpanded(item.id)}
                              className="p-1 hover:bg-gray-100 rounded transition-transform"
                            >
                              <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{item.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                              {item.difficulty}
                            </span>
                            <span className="text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.readTime}
                            </span>
                            <span className="text-gray-500 capitalize">{item.type}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Bouton Lire l'article - visible seulement quand fermé */}
                          {!isExpanded && (
                            <div className="flex gap-3 mt-6">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  console.log('Bouton cliqué pour article:', item.id)
                                  setExpandedItems(prev => [...prev, item.id])
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                              >
                                📖 Lire l'article
                              </button>
                            </div>
                          )}

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                              <div className="prose prose-sm max-w-none">
                                <h4 className="text-base font-semibold text-gray-900 mb-3">Contenu détaillé</h4>
                                <div className="space-y-4 text-gray-700">
                                  {/* Contenu dynamique basé sur la catégorie */}
                                  {item.category === 'getting-started' && (
                                    <div>
                                      <p>Ce guide vous accompagne dans la découverte de NextMove Cargo :</p>
                                      <ul className="list-disc list-inside space-y-1 mt-2">
                                        <li>Configuration de votre compte entreprise</li>
                                        <li>Paramétrage des utilisateurs et permissions</li>
                                        <li>Premier envoi de colis</li>
                                        <li>Navigation dans l'interface</li>
                                      </ul>
                                    </div>
                                  )}
                                  {item.category === 'packages' && (
                                    <div>
                                      <p>Maîtrisez la gestion complète de vos colis :</p>
                                      <ul className="list-disc list-inside space-y-1 mt-2">
                                        <li>Création de colis avec photos</li>
                                        <li>Calcul automatique des tarifs</li>
                                        <li>Suivi en temps réel</li>
                                        <li>Gestion des statuts et notifications</li>
                                      </ul>
                                    </div>
                                  )}
                                  {item.category === 'api' && (
                                    <div>
                                      <p>Intégrez NextMove Cargo avec votre système :</p>
                                      <ul className="list-disc list-inside space-y-1 mt-2">
                                        <li>Authentification par clés API</li>
                                        <li>Endpoints REST complets</li>
                                        <li>Documentation interactive</li>
                                        <li>SDK JavaScript et Python</li>
                                      </ul>
                                    </div>
                                  )}
                                  {item.category === 'billing' && (
                                    <div>
                                      <p>Gérez votre comptabilité et facturation :</p>
                                      <ul className="list-disc list-inside space-y-1 mt-2">
                                        <li>Journal comptable automatique</li>
                                        <li>Facturation en FCFA</li>
                                        <li>Intégration Mobile Money</li>
                                        <li>Rapports financiers détaillés</li>
                                      </ul>
                                    </div>
                                  )}
                                  {item.category === 'integrations' && (
                                    <div>
                                      <p>Connectez NextMove Cargo à vos outils :</p>
                                      <ul className="list-disc list-inside space-y-1 mt-2">
                                        <li>Intégrations e-commerce (Shopify, WooCommerce)</li>
                                        <li>Systèmes ERP et CRM</li>
                                        <li>Plateformes de paiement africaines</li>
                                        <li>Services de notification (SMS, WhatsApp)</li>
                                      </ul>
                                    </div>
                                  )}
                                  {item.category === 'troubleshooting' && (
                                    <div>
                                      <p>Solutions aux problèmes courants :</p>
                                      <ul className="list-disc list-inside space-y-1 mt-2">
                                        <li>Problèmes de connexion</li>
                                        <li>Erreurs de synchronisation</li>
                                        <li>Questions de facturation</li>
                                        <li>Support technique 24/7</li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* No Results */}
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-500">
                  Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      
      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🤝 Besoin d'aide supplémentaire ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Notre équipe support est là pour vous accompagner dans votre utilisation de NextMove Cargo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard/support/chatbot"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              💬 Contacter le support
            </a>
            <a
              href="/dashboard/support/tickets"
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              🎫 Créer un ticket
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
