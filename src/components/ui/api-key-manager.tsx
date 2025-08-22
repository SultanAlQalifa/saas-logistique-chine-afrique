'use client'

import { useState, useEffect } from 'react'
import { Key, Save, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ApiKeyManagerProps {
  onApiKeyUpdated?: () => void
}

export function ApiKeyManager({ onApiKeyUpdated }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setStatus('error')
      setMessage('Veuillez entrer une clé API')
      return
    }

    if (!apiKey.startsWith('sk-')) {
      setStatus('error')
      setMessage('La clé API doit commencer par "sk-"')
      return
    }

    setSaving(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/ai-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openaiApiKey: apiKey
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
        setMessage('Clé API sauvegardée avec succès !')
        onApiKeyUpdated?.()
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 3000)
      } else {
        throw new Error(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
          <Key className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">🔑 Configuration Clé API OpenAI</h3>
          <p className="text-sm text-gray-600">Configurez votre clé API pour activer ChatGPT</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clé API OpenAI
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Obtenez votre clé API sur <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com</a>
          </p>
        </div>

        {/* Message de statut */}
        {message && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            status === 'success' ? 'bg-green-50 text-green-800' :
            status === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {status === 'success' && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
            {status === 'error' && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
            <span className="text-sm">{message}</span>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !apiKey.trim()}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Sauvegarder la Clé API
            </>
          )}
        </button>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📋 Instructions :</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Créez un compte sur <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a></li>
            <li>Allez dans <strong>API Keys</strong> dans votre tableau de bord</li>
            <li>Cliquez sur <strong>"Create new secret key"</strong></li>
            <li>Copiez la clé (commence par "sk-")</li>
            <li>Collez-la ci-dessus et cliquez sur "Sauvegarder"</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
