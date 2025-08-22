'use client'

import { useState } from 'react'
import { 
  Code, 
  Copy, 
  CheckCircle, 
  Book, 
  Key, 
  Package, 
  Users, 
  Building, 
  Webhook, 
  BarChart3,
  Globe,
  Smartphone,
  Monitor,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

export default function ApiDocumentationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('overview')

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const sections = [
    { id: 'overview', title: 'Vue d\'ensemble', icon: Book },
    { id: 'auth', title: 'Authentification', icon: Key },
    { id: 'packages', title: 'Colis', icon: Package },
    { id: 'tracking', title: 'Suivi', icon: Globe },
    { id: 'clients', title: 'Clients', icon: Users },
    { id: 'companies', title: 'Entreprises', icon: Building },
    { id: 'webhooks', title: 'Webhooks', icon: Webhook },
    { id: 'stats', title: 'Statistiques', icon: BarChart3 },
    { id: 'examples', title: 'Exemples', icon: Code }
  ]

  const CodeBlock = ({ code, language, id }: { code: string, language: string, id: string }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-400" />
              Copié
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copier
            </>
          )}
        </button>
      </div>
      <pre className="text-sm text-gray-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Code className="h-10 w-10" />
              🚀 API NextMove Cargo
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Documentation complète pour intégrer facilement les fonctionnalités de logistique Chine-Afrique dans vos applications
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Version: v1</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Format: JSON</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {section.title}
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">📋 Vue d'ensemble</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    L'API NextMove Cargo permet aux développeurs d'intégrer facilement les fonctionnalités de logistique Chine-Afrique dans leurs applications tierces.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Base URL</h3>
                    <code className="text-blue-700 bg-blue-100 px-2 py-1 rounded">
                      https://api.nextmovecargo.com/v1
                    </code>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                      <Package className="h-8 w-8 text-green-600 mb-3" />
                      <h3 className="font-semibold text-green-900 mb-2">Gestion des Colis</h3>
                      <p className="text-green-700 text-sm">Créez, modifiez et suivez vos expéditions</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                      <Globe className="h-8 w-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-blue-900 mb-2">Suivi en Temps Réel</h3>
                      <p className="text-blue-700 text-sm">Suivez vos colis de la Chine à l'Afrique</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                      <BarChart3 className="h-8 w-8 text-purple-600 mb-3" />
                      <h3 className="font-semibold text-purple-900 mb-2">Analytics</h3>
                      <p className="text-purple-700 text-sm">Statistiques détaillées et rapports</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Authentication Section */}
              {activeSection === 'auth' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">🔐 Authentification</h2>
                  <p className="text-gray-600 mb-6">
                    Toutes les requêtes API nécessitent une clé API valide dans l'en-tête :
                  </p>

                  <CodeBlock
                    code={`curl -H "X-API-Key: sk_live_nextmove_cargo_2024"`}
                    language="HTTP Header"
                    id="auth-header"
                  />

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-yellow-900 mb-3">Types de clés API</h3>
                    <ul className="space-y-2 text-yellow-800">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        <strong>Production:</strong> <code className="bg-yellow-100 px-1 rounded">sk_live_*</code> - Pour l'environnement de production
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Packages Section */}
              {activeSection === 'packages' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">📦 Endpoints Colis</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Récupérer tous les colis</h3>
                      <CodeBlock
                        code="GET /api/v1/packages"
                        language="HTTP"
                        id="get-packages"
                      />
                      
                      <h4 className="font-medium text-gray-900 mb-2">Paramètres de requête:</h4>
                      <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                        <li><code>status</code> (optionnel): PENDING, IN_TRANSIT, DELIVERED, CANCELLED</li>
                        <li><code>limit</code> (optionnel): Nombre max de résultats (défaut: 10)</li>
                        <li><code>offset</code> (optionnel): Décalage pour pagination (défaut: 0)</li>
                      </ul>

                      <h4 className="font-medium text-gray-900 mb-2">Exemple de réponse:</h4>
                      <CodeBlock
                        code={`{
  "success": true,
  "data": [
    {
      "id": "pkg_001",
      "trackingNumber": "TRK-2024-001",
      "senderName": "Jean Dupont",
      "senderEmail": "jean@example.com",
      "recipientName": "Marie Martin",
      "weight": 2.5,
      "status": "IN_TRANSIT",
      "origin": "Guangzhou, Chine",
      "destination": "Abidjan, Côte d'Ivoire",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}`}
                        language="JSON"
                        id="packages-response"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Créer un nouveau colis</h3>
                      <CodeBlock
                        code="POST /api/v1/packages"
                        language="HTTP"
                        id="create-package"
                      />
                      
                      <h4 className="font-medium text-gray-900 mb-2">Corps de la requête:</h4>
                      <CodeBlock
                        code={`{
  "senderName": "Jean Dupont",
  "senderEmail": "jean@example.com",
  "senderPhone": "+33123456789",
  "recipientName": "Marie Martin",
  "recipientEmail": "marie@example.com",
  "recipientPhone": "+225123456789",
  "recipientAddress": "123 Rue de la Paix, Abidjan",
  "weight": 2.5,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 15
  },
  "value": 150000,
  "currency": "FCFA",
  "origin": "Guangzhou, Chine",
  "destination": "Abidjan, Côte d'Ivoire"
}`}
                        language="JSON"
                        id="create-package-body"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tracking Section */}
              {activeSection === 'tracking' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">📍 Suivi de Colis</h2>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Suivre un colis</h3>
                    <CodeBlock
                      code="GET /api/v1/tracking/{trackingNumber}"
                      language="HTTP"
                      id="track-package"
                    />
                    
                    <h4 className="font-medium text-gray-900 mb-2">Exemple de réponse:</h4>
                    <CodeBlock
                      code={`{
  "success": true,
  "data": {
    "trackingNumber": "TRK-2024-001",
    "status": "IN_TRANSIT",
    "origin": "Guangzhou, Chine",
    "destination": "Abidjan, Côte d'Ivoire",
    "estimatedDelivery": "2024-01-25T00:00:00Z",
    "events": [
      {
        "timestamp": "2024-01-15T10:30:00Z",
        "location": "Guangzhou, Chine",
        "status": "PICKED_UP",
        "description": "Colis récupéré chez l'expéditeur"
      },
      {
        "timestamp": "2024-01-17T14:20:00Z",
        "location": "En mer - Route vers l'Afrique",
        "status": "IN_TRANSIT",
        "description": "Colis embarqué sur le navire cargo"
      }
    ]
  }
}`}
                      language="JSON"
                      id="tracking-response"
                    />
                  </div>
                </div>
              )}

              {/* Examples Section */}
              {activeSection === 'examples' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">📝 Exemples d'Intégration</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Monitor className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-xl font-semibold text-gray-900">JavaScript/Node.js</h3>
                      </div>
                      <CodeBlock
                        code={`const API_KEY = 'sk_live_nextmove_cargo_2024';
const BASE_URL = 'https://api.nextmovecargo.com/v1';

async function createPackage(packageData) {
  const response = await fetch(\`\${BASE_URL}/packages\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify(packageData)
  });
  
  return await response.json();
}

async function trackPackage(trackingNumber) {
  const response = await fetch(\`\${BASE_URL}/tracking/\${trackingNumber}\`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  
  return await response.json();
}`}
                        language="JavaScript"
                        id="js-example"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Code className="h-5 w-5 text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-900">Python</h3>
                      </div>
                      <CodeBlock
                        code={`import requests

API_KEY = 'sk_live_nextmove_cargo_2024'
BASE_URL = 'https://api.nextmovecargo.com/v1'

def create_package(package_data):
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    }
    
    response = requests.post(f'{BASE_URL}/packages', 
                           json=package_data, 
                           headers=headers)
    return response.json()

def track_package(tracking_number):
    headers = {'X-API-Key': API_KEY}
    response = requests.get(f'{BASE_URL}/tracking/{tracking_number}', 
                          headers=headers)
    return response.json()`}
                        language="Python"
                        id="python-example"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Smartphone className="h-5 w-5 text-purple-600" />
                        <h3 className="text-xl font-semibold text-gray-900">PHP</h3>
                      </div>
                      <CodeBlock
                        code={`<?php
$apiKey = 'sk_live_nextmove_cargo_2024';
$baseUrl = 'https://api.nextmovecargo.com/v1';

function createPackage($packageData) {
    global $apiKey, $baseUrl;
    
    $headers = [
        'Content-Type: application/json',
        'X-API-Key: ' . $apiKey
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . '/packages');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($packageData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}
?>`}
                        language="PHP"
                        id="php-example"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Codes */}
              <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-4">⚠️ Codes d'Erreur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">200</span>
                      <span className="text-sm text-gray-600">Succès</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">201</span>
                      <span className="text-sm text-gray-600">Créé avec succès</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">400</span>
                      <span className="text-sm text-gray-600">Requête invalide</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono text-sm bg-red-100 text-red-800 px-2 py-1 rounded">401</span>
                      <span className="text-sm text-gray-600">Non authentifié</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-sm bg-red-100 text-red-800 px-2 py-1 rounded">403</span>
                      <span className="text-sm text-gray-600">Accès refusé</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-sm bg-red-100 text-red-800 px-2 py-1 rounded">500</span>
                      <span className="text-sm text-gray-600">Erreur serveur</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4">📞 Support</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a href="mailto:api-support@nextmovecargo.com" className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
                    <ExternalLink className="h-4 w-4" />
                    Email Support
                  </a>
                  <a href="https://docs.nextmovecargo.com" className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
                    <ExternalLink className="h-4 w-4" />
                    Documentation
                  </a>
                  <a href="https://status.nextmovecargo.com" className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
                    <ExternalLink className="h-4 w-4" />
                    Status Page
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
