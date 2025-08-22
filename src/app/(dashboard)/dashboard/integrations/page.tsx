'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  Globe, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Plus,
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  X,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  category: 'payment' | 'marketing' | 'communication' | 'analytics' | 'shipping' | 'ai'
  status: 'connected' | 'available' | 'coming_soon'
  icon: React.ComponentType<any>
  color: string
  features: string[]
  setupUrl?: string
}

const integrations: Integration[] = [
  {
    id: 'openai',
    name: 'OpenAI ChatGPT',
    description: 'Intelligence artificielle pour l\'agent IA NextMove et réponses automatiques',
    category: 'ai',
    status: 'connected',
    icon: Zap,
    color: 'from-purple-500 to-indigo-600',
    features: ['GPT-4/5 API', 'Réponses automatiques', 'Agent IA', 'Support multilingue'],
    setupUrl: '/dashboard/config?tab=ai'
  },
  {
    id: 'cinetpay',
    name: 'CinetPay',
    description: 'Agrégateur de paiement panafricain avec support Mobile Money',
    category: 'payment',
    status: 'connected',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    features: ['Mobile Money', 'Cartes bancaires', 'Virements', 'API REST'],
    setupUrl: '/dashboard/finances/payments/integrations'
  },
  {
    id: 'kkiapay',
    name: 'Kkiapay',
    description: 'Solution de paiement spécialisée Afrique de l\'Ouest',
    category: 'payment',
    status: 'connected',
    icon: DollarSign,
    color: 'from-blue-500 to-cyan-600',
    features: ['Wave', 'MTN Money', 'Moov Money', 'Cartes Visa/Mastercard'],
    setupUrl: '/dashboard/finances/payments/integrations'
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads',
    description: 'Publicités Facebook et Instagram centralisées',
    category: 'marketing',
    status: 'connected',
    icon: TrendingUp,
    color: 'from-blue-600 to-purple-600',
    features: ['Facebook Ads', 'Instagram Ads', 'Audiences', 'Analytics'],
    setupUrl: '/dashboard/marketing/integrations'
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    description: 'Campagnes publicitaires Google Search et Display',
    category: 'marketing',
    status: 'connected',
    icon: TrendingUp,
    color: 'from-red-500 to-orange-600',
    features: ['Search Ads', 'Display', 'Shopping', 'Performance Max'],
    setupUrl: '/dashboard/marketing/integrations'
  },
  {
    id: 'tiktok-ads',
    name: 'TikTok Ads',
    description: 'Publicités TikTok for Business',
    category: 'marketing',
    status: 'connected',
    icon: TrendingUp,
    color: 'from-pink-500 to-rose-600',
    features: ['Video Ads', 'Lead Generation', 'App Install', 'Conversions'],
    setupUrl: '/dashboard/marketing/integrations'
  },
  {
    id: 'whatsapp-business',
    name: 'WhatsApp Business',
    description: 'Communication client via WhatsApp Business API',
    category: 'communication',
    status: 'connected',
    icon: Users,
    color: 'from-green-600 to-teal-600',
    features: ['Messages automatiques', 'Templates', 'Webhooks', 'Analytics'],
    setupUrl: '/dashboard/support/whatsapp'
  },
  {
    id: 'analytics',
    name: 'Analytics Avancées',
    description: 'Tableaux de bord et rapports personnalisés',
    category: 'analytics',
    status: 'available',
    icon: BarChart3,
    color: 'from-indigo-500 to-purple-600',
    features: ['Dashboards', 'Rapports', 'KPIs', 'Export données']
  },
  {
    id: 'fedapay',
    name: 'FedaPay',
    description: 'Solution de paiement simple et transparente',
    category: 'payment',
    status: 'available',
    icon: DollarSign,
    color: 'from-yellow-500 to-orange-600',
    features: ['Mobile Money', 'Cartes', 'API simple', 'Tarifs transparents']
  },
  {
    id: 'dhl-api',
    name: 'DHL Express API',
    description: 'Intégration directe avec DHL pour expéditions',
    category: 'shipping',
    status: 'coming_soon',
    icon: Globe,
    color: 'from-red-600 to-yellow-500',
    features: ['Tracking temps réel', 'Étiquettes', 'Tarifs', 'Livraison']
  }
]

const categoryLabels = {
  payment: 'Paiement',
  marketing: 'Marketing',
  communication: 'Communication',
  analytics: 'Analytics',
  shipping: 'Expédition',
  ai: 'Intelligence Artificielle'
}

const categoryColors = {
  payment: 'from-green-400 to-emerald-500',
  marketing: 'from-purple-400 to-pink-500',
  communication: 'from-blue-400 to-cyan-500',
  analytics: 'from-orange-400 to-red-500',
  shipping: 'from-indigo-400 to-purple-500',
  ai: 'from-purple-500 to-indigo-600'
}

export default function IntegrationsPage() {
  const { data: session } = useSession()
  const role = session?.user?.role
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [financeMode, setFinanceMode] = useState<'propre' | 'centralisee'>('centralisee')
  const [showOpenAIModal, setShowOpenAIModal] = useState(false)
  const [openaiConfig, setOpenaiConfig] = useState({
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Charger le choix de mode financier pour les entreprises (CLIENT)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem('financeMode') as 'propre' | 'centralisee' | null
    if (saved === 'propre' || saved === 'centralisee') {
      setFinanceMode(saved)
    }
  }, [])

  const updateFinanceMode = (mode: 'propre' | 'centralisee') => {
    setFinanceMode(mode)
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('financeMode', mode)
      }
    } catch (e) {
      console.warn('Persist finance mode failed', e)
    }
  }
  
  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory)

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const availableCount = integrations.filter(i => i.status === 'available').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'available':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'coming_soon':
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connecté</Badge>
      case 'available':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Disponible</Badge>
      case 'coming_soon':
        return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">Bientôt</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🔗 Intégrations</h1>
            <p className="text-purple-100 text-lg">
              Connectez vos outils favoris à NextMove Cargo
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{connectedCount}</div>
            <div className="text-purple-200 text-sm">Intégrations actives</div>
          </div>
        </div>
      </div>

      {/* Modal OpenAI Configuration */}
      {showOpenAIModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Configuration OpenAI</h3>
                  <p className="text-gray-600 text-sm">Configurez votre clé API ChatGPT</p>
                </div>
              </div>
              <button
                onClick={() => setShowOpenAIModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* API Key */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  🔑 Clé API OpenAI *
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={openaiConfig.apiKey}
                    onChange={(e) => setOpenaiConfig({...openaiConfig, apiKey: e.target.value})}
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="sk-proj-..."
                    required
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {openaiConfig.apiKey && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(openaiConfig.apiKey)
                          setCopiedKey(true)
                          setTimeout(() => setCopiedKey(false), 2000)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedKey ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Obtenez votre clé API sur <a href="https://platform.openai.com/api-keys" target="_blank" className="text-purple-600 hover:underline">platform.openai.com</a>
                </p>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  🤖 Modèle IA
                </label>
                <select
                  value={openaiConfig.model}
                  onChange={(e) => setOpenaiConfig({...openaiConfig, model: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="gpt-4">GPT-4 (Recommandé)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  🌡️ Créativité (Temperature): {openaiConfig.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={openaiConfig.temperature}
                  onChange={(e) => setOpenaiConfig({...openaiConfig, temperature: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Précis (0.0)</span>
                  <span>Créatif (1.0)</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  📝 Longueur max réponse
                </label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  value={openaiConfig.maxTokens}
                  onChange={(e) => setOpenaiConfig({...openaiConfig, maxTokens: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Nombre maximum de tokens pour les réponses (100-4000)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowOpenAIModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (!openaiConfig.apiKey.trim()) {
                    alert('Veuillez saisir une clé API OpenAI')
                    return
                  }
                  
                  setIsSaving(true)
                  try {
                    // TODO: Sauvegarder la configuration via API
                    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
                    alert('✅ Configuration OpenAI sauvegardée avec succès!')
                    setShowOpenAIModal(false)
                  } catch (error) {
                    alert('❌ Erreur lors de la sauvegarde')
                  } finally {
                    setIsSaving(false)
                  }
                }}
                disabled={isSaving || !openaiConfig.apiKey.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur de mode financier pour Entreprises (CLIENT) */}
      {role === 'CLIENT' && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-amber-700">Paramètre requis</p>
                <p className="text-amber-900">Pour utiliser un agrégateur de paiement, choisissez « Gestion financière propre ».</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={financeMode === 'centralisee' ? 'default' : 'outline'}
                  onClick={() => updateFinanceMode('centralisee')}
                  className={financeMode === 'centralisee' ? 'bg-slate-600 hover:bg-slate-700 text-white' : ''}
                >
                  Gestion centralisée
                </Button>
                <Button
                  variant={financeMode === 'propre' ? 'default' : 'outline'}
                  onClick={() => updateFinanceMode('propre')}
                  className={financeMode === 'propre' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                >
                  Gestion propre (requis)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Connectées</p>
                <p className="text-2xl font-bold text-green-900">{connectedCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Disponibles</p>
                <p className="text-2xl font-bold text-yellow-900">{availableCount}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Plus className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Catégories</p>
                <p className="text-2xl font-bold text-blue-900">{Object.keys(categoryLabels).length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Économies</p>
                <p className="text-2xl font-bold text-purple-900">2.5h/jour</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          className="rounded-full"
        >
          Toutes les catégories
        </Button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(key)}
            className="rounded-full"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className={`bg-gradient-to-r ${integration.color} p-3 rounded-xl shadow-lg`}>
                  <integration.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(integration.status)}
                  {getStatusBadge(integration.status)}
                </div>
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {integration.name}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {integration.description}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Category Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[integration.category]} text-white`}>
                  {categoryLabels[integration.category]}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Fonctionnalités :</p>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {/* Règle: les entreprises (CLIENT) ne peuvent utiliser les intégrations de paiement que si financeMode = 'propre' */}
                  {integration.category === 'payment' && role === 'CLIENT' && financeMode !== 'propre' ? (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled
                      title="Choisissez Gestion propre pour activer les agrégateurs de paiement"
                    >
                      Non autorisé — choisir « Gestion propre »
                    </Button>
                  ) : integration.status === 'connected' && integration.setupUrl ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      onClick={() => {
                        if (integration.id === 'openai') {
                          setShowOpenAIModal(true)
                        } else {
                          integration.setupUrl && (window.location.href = integration.setupUrl)
                        }
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurer
                    </Button>
                  ) : integration.status === 'available' ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      onClick={() => {
                        // TODO: Implement connection flow
                        alert('Fonctionnalité de connexion en développement')
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Connecter
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Bientôt disponible
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
              <ExternalLink className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                Besoin d'aide avec les intégrations ?
              </h3>
              <p className="text-blue-700 mb-4">
                Notre équipe peut vous aider à configurer et optimiser vos intégrations pour maximiser votre efficacité.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Contacter le support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
