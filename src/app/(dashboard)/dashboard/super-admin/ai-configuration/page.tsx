'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Bot, 
  Save, 
  TestTube, 
  Settings, 
  MessageSquare,
  Zap,
  Brain,
  Key,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { ApiKeyManager } from '@/components/ui/api-key-manager'

interface AIConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  enableStreaming: boolean
  enableAnalytics: boolean
  responseCategories: string[]
}

export default function AIConfigurationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [testResponse, setTestResponse] = useState('')
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid'>('checking')

  const [config, setConfig] = useState<AIConfig>({
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: `Tu es l'assistant IA de NextMove Cargo, une plateforme de logistique entre la Chine et l'Afrique.

Contexte de l'entreprise:
- NextMove Cargo est une plateforme SaaS de logistique
- Spécialisée dans les échanges commerciaux Chine-Afrique
- Services: suivi de colis, gestion des expéditions, documentation douanière
- Zones couvertes: Afrique de l'Ouest et Centrale

Instructions:
- Réponds toujours en français
- Sois professionnel mais accessible
- Fournis des informations précises sur la logistique
- Propose des solutions concrètes
- Mentionne les services NextMove Cargo quand pertinent
- Si tu ne connais pas une information, recommande de contacter le support`,
    enableStreaming: true,
    enableAnalytics: true,
    responseCategories: ['Suivi', 'Tarifs', 'Documentation', 'Support', 'Général']
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard')
      return
    }

    loadConfig()
    checkApiKey()
    setLoading(false)
  }, [session, status, router])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/ai-config')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.config) {
          setConfig(data.config)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error)
    }
  }

  const checkApiKey = async () => {
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'test', type: 'general' })
      })
      
      setApiKeyStatus(response.ok ? 'valid' : 'invalid')
    } catch {
      setApiKeyStatus('invalid')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert('✅ Configuration IA sauvegardée avec succès!')
      } else {
        throw new Error(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      alert(`❌ Erreur lors de la sauvegarde: ${errorMessage}`)
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    if (!testMessage.trim()) return

    setTesting(true)
    setTestResponse('')

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testMessage,
          type: 'logistics'
        })
      })

      if (!response.ok) throw new Error('Erreur réseau')

      const data = await response.json()
      setTestResponse(data.response)
    } catch (error) {
      setTestResponse('Erreur lors du test. Vérifiez votre configuration.')
    } finally {
      setTesting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚫 Accès Restreint</h2>
          <p className="text-gray-600">Cette page est réservée aux super administrateurs.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Bot className="h-10 w-10" />
              🤖 Configuration IA
            </h1>
            <p className="text-indigo-100 text-lg">
              Configurez et optimisez l'assistant IA NextMove Cargo
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              apiKeyStatus === 'valid' ? 'bg-green-500/20' : 
              apiKeyStatus === 'invalid' ? 'bg-red-500/20' : 'bg-yellow-500/20'
            }`}>
              {apiKeyStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin" />}
              {apiKeyStatus === 'valid' && <CheckCircle className="h-4 w-4" />}
              {apiKeyStatus === 'invalid' && <AlertCircle className="h-4 w-4" />}
              <span className="text-sm">
                {apiKeyStatus === 'checking' && 'Vérification...'}
                {apiKeyStatus === 'valid' && 'API OpenAI OK'}
                {apiKeyStatus === 'invalid' && 'API OpenAI Erreur'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Manager */}
      <ApiKeyManager onApiKeyUpdated={() => {
        checkApiKey()
        loadConfig()
      }} />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Settings className="h-6 w-6" />
            Configuration du Modèle
          </h2>

          <div className="space-y-6">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modèle OpenAI
              </label>
              <select
                value={config.model}
                onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="gpt-4-turbo-preview">GPT-4 Turbo (Recommandé)</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Température: {config.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Précis (0)</span>
                <span>Créatif (2)</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre maximum de tokens
              </label>
              <input
                type="number"
                min="100"
                max="4000"
                value={config.maxTokens}
                onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.enableStreaming}
                  onChange={(e) => setConfig(prev => ({ ...prev, enableStreaming: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Activer le streaming</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.enableAnalytics}
                  onChange={(e) => setConfig(prev => ({ ...prev, enableAnalytics: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Activer les analytics</span>
              </label>
            </div>
          </div>
        </div>

        {/* Test Interface */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <TestTube className="h-6 w-6" />
            Test de l'Assistant
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message de test
              </label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Posez une question sur la logistique..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleTest}
              disabled={!testMessage.trim() || testing}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Tester l'IA
                </>
              )}
            </button>

            {testResponse && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Réponse de l'IA:</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{testResponse}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Brain className="h-6 w-6" />
          Prompt Système
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions pour l'assistant IA
          </label>
          <textarea
            value={config.systemPrompt}
            onChange={(e) => setConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
            placeholder="Définissez le comportement et les instructions pour l'assistant IA..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Ce prompt définit le comportement de l'assistant IA et ses connaissances sur NextMove Cargo.
          </p>
        </div>
      </div>

      {/* API Key Warning */}
      {apiKeyStatus === 'invalid' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Configuration API OpenAI</h3>
          </div>
          <p className="text-red-700 mb-4">
            La clé API OpenAI n'est pas configurée ou invalide. Ajoutez votre clé API dans les variables d'environnement:
          </p>
          <div className="bg-red-100 p-3 rounded-lg font-mono text-sm text-red-800">
            OPENAI_API_KEY=sk-your-openai-api-key-here
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 text-lg font-semibold"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder la Configuration'}
        </button>
      </div>
    </div>
  )
}
