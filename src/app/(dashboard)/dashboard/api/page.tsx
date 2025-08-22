'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Code, 
  Copy, 
  Eye, 
  EyeOff, 
  Key, 
  Book, 
  Download, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Terminal,
  Globe,
  Lock,
  Zap,
  X
} from 'lucide-react'

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  description: string
  parameters?: string[]
  example: string
  response: string
}

const apiEndpoints: APIEndpoint[] = [
  {
    method: 'GET',
    endpoint: '/api/packages/track/{trackingId}',
    description: 'Suivre un colis par son ID de suivi',
    parameters: ['trackingId (string)'],
    example: `curl -X GET "https://api.logistique-ca.com/api/packages/track/CO-001234" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    response: `{
  "success": true,
  "data": {
    "packageId": "CO-001234",
    "status": "in_transit",
    "location": "Port de Guangzhou",
    "estimatedArrival": "2024-02-15T10:00:00Z",
    "trackingHistory": [...]
  }
}`
  },
  {
    method: 'POST',
    endpoint: '/api/quotes/request',
    description: 'Créer une nouvelle demande de devis',
    parameters: ['description', 'origin', 'destination', 'weight', 'transportMode'],
    example: `curl -X POST "https://api.logistique-ca.com/api/quotes/request" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "Électroniques",
    "origin": "Guangzhou, Chine",
    "destination": "Abidjan, Côte d'Ivoire",
    "weight": 25.5,
    "transportMode": "AERIAL"
  }'`,
    response: `{
  "success": true,
  "data": {
    "quoteId": "QT-001",
    "status": "published",
    "expiresAt": "2024-02-22T10:00:00Z"
  }
}`
  },
  {
    method: 'GET',
    endpoint: '/api/quotes/list',
    description: 'Récupérer la liste des devis',
    parameters: ['status (optional)', 'limit (optional)', 'offset (optional)'],
    example: `curl -X GET "https://api.logistique-ca.com/api/quotes/list?status=published&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    response: `{
  "success": true,
  "data": {
    "quotes": [...],
    "total": 25,
    "hasMore": true
  }
}`
  },
  {
    method: 'POST',
    endpoint: '/api/packages/create',
    description: 'Créer un nouveau colis',
    parameters: ['description', 'weight', 'dimensions', 'origin', 'destination'],
    example: `curl -X POST "https://api.logistique-ca.com/api/packages/create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "Électroniques",
    "weight": 2.5,
    "dimensions": {"length": 30, "width": 20, "height": 15},
    "origin": "Guangzhou",
    "destination": "Abidjan"
  }'`,
    response: `{
  "success": true,
  "data": {
    "packageId": "CO-001235",
    "trackingPin": "A3X9K2",
    "estimatedDelivery": "2024-02-20T10:00:00Z"
  }
}`
  }
]

export default function APIPage() {
  const { data: session } = useSession()
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Clé API simulée
  const apiKey = 'lca_live_sk_1234567890abcdef1234567890abcdef'

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(type)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-700 border-green-200'
      case 'POST': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'PUT': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès restreint</h3>
          <p className="text-gray-600">Connectez-vous pour accéder à la documentation API</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Code className="h-8 w-8" />
              Documentation API
            </h1>
            <p className="text-purple-100 mt-2">
              Intégrez notre plateforme logistique dans vos applications
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">REST</div>
            <div className="text-purple-100">API v1.0</div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Authentication */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Key className="h-5 w-5" />
              Authentification
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre clé API
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <button
                    onClick={() => copyToClipboard(apiKey, 'apikey')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copiedText === 'apikey' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Sécurité</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Gardez votre clé API secrète. Utilisez-la uniquement côté serveur, jamais dans le code client.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Exemple d'authentification</h4>
                <pre className="text-sm text-gray-700 font-mono">
{`Authorization: Bearer ${apiKey}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Endpoints */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Points de terminaison
            </h2>

            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEndpoint(endpoint)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-gray-700">
                        {endpoint.endpoint}
                      </code>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">{endpoint.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Liens rapides</h3>
            <div className="space-y-3">
              <a 
                href="#" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Guide de démarrage rapide - Fonctionnalité en développement')
                }}
              >
                <Zap className="h-4 w-4" />
                Guide de démarrage rapide
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Exemples de code - Fonctionnalité en développement')
                }}
              >
                <Code className="h-4 w-4" />
                Exemples de code
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Collection Postman - Fonctionnalité en développement')
                }}
              >
                <Download className="h-4 w-4" />
                Collection Postman
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Support développeurs - Fonctionnalité en développement')
                }}
              >
                <Book className="h-4 w-4" />
                Support développeurs
              </a>
            </div>
          </div>

          {/* API Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Statut de l'API</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Disponibilité</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">99.9%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Temps de réponse</span>
                <span className="text-sm font-medium text-gray-900">~150ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium text-gray-900">v1.0</span>
              </div>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Limites de taux</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Requêtes/minute</span>
                <span className="text-sm font-medium text-gray-900">1000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Requêtes/heure</span>
                <span className="text-sm font-medium text-gray-900">10,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Requêtes/jour</span>
                <span className="text-sm font-medium text-gray-900">100,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Details Modal */}
      {selectedEndpoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded border ${getMethodColor(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-700">
                    {selectedEndpoint.endpoint}
                  </code>
                </div>
                <button
                  onClick={() => setSelectedEndpoint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">{selectedEndpoint.description}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Parameters */}
              {selectedEndpoint.parameters && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Paramètres</h3>
                  <div className="space-y-2">
                    {selectedEndpoint.parameters.map((param, index) => (
                      <div key={index} className="bg-gray-50 px-3 py-2 rounded border">
                        <code className="text-sm text-gray-700">{param}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Example Request */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Exemple de requête</h3>
                  <button
                    onClick={() => copyToClipboard(selectedEndpoint.example, 'example')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {copiedText === 'example' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copier
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {selectedEndpoint.example}
                </pre>
              </div>

              {/* Example Response */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Exemple de réponse</h3>
                  <button
                    onClick={() => copyToClipboard(selectedEndpoint.response, 'response')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {copiedText === 'response' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copier
                  </button>
                </div>
                <pre className="bg-gray-50 text-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                  {selectedEndpoint.response}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
