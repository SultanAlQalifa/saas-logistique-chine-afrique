'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MessageCircle, Phone, Send, Settings, Key, Globe, Smartphone, Bot, AlertTriangle } from 'lucide-react'

interface MessagingConfig {
  sms: {
    provider: 'twilio' | 'nexmo' | 'africansms' | 'custom'
    apiKey: string
    apiSecret: string
    senderId: string
    enabled: boolean
  }
  whatsapp: {
    businessApiKey: string
    phoneNumberId: string
    webhookToken: string
    enabled: boolean
  }
  telegram: {
    botToken: string
    chatId: string
    enabled: boolean
  }
  slack: {
    webhookUrl: string
    channel: string
    enabled: boolean
  }
}

export default function MessagingConfigPage() {
  const { data: session } = useSession()

  // Vérifier si l'utilisateur est SUPER_ADMIN
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN'

  // Si pas SUPER_ADMIN, afficher message d'accès refusé
  if (session && !isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            Cette page est réservée aux Super Administrateurs uniquement.
            <br />
            Contactez votre administrateur système pour plus d'informations.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Votre rôle actuel : <span className="font-medium">{session?.user?.role || 'Non défini'}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const [config, setConfig] = useState<MessagingConfig>({
    sms: {
      provider: 'twilio',
      apiKey: '',
      apiSecret: '',
      senderId: 'NextMove',
      enabled: false
    },
    whatsapp: {
      businessApiKey: '',
      phoneNumberId: '',
      webhookToken: '',
      enabled: false
    },
    telegram: {
      botToken: '',
      chatId: '',
      enabled: false
    },
    slack: {
      webhookUrl: '',
      channel: '#general',
      enabled: false
    }
  })

  const [testResults, setTestResults] = useState<{ [key: string]: { success: boolean; message: string } }>({})
  const [isTestingService, setIsTestingService] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadMessagingConfig()
  }, [])

  const loadMessagingConfig = async () => {
    try {
      const response = await fetch('/api/admin/messaging/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Erreur chargement config messagerie:', error)
    }
  }

  const saveConfig = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/messaging/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        setTestResults(prev => ({
          ...prev,
          general: { success: true, message: 'Configuration sauvegardée avec succès' }
        }))
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        general: { success: false, message: 'Erreur lors de la sauvegarde' }
      }))
    } finally {
      setIsSaving(false)
    }
  }

  const testService = async (service: string) => {
    setIsTestingService(service)
    setTestResults(prev => ({ ...prev, [service]: { success: false, message: '' } }))
    
    try {
      const response = await fetch(`/api/admin/messaging/test/${service}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config[service as keyof MessagingConfig])
      })
      
      const result = await response.json()
      setTestResults(prev => ({ ...prev, [service]: result }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [service]: { success: false, message: 'Erreur lors du test' }
      }))
    } finally {
      setIsTestingService(null)
    }
  }

  const smsProviders = [
    { id: 'twilio', name: 'Twilio', description: 'Service SMS global fiable' },
    { id: 'nexmo', name: 'Vonage (Nexmo)', description: 'API SMS avec bonne couverture africaine' },
    { id: 'africansms', name: 'African SMS', description: 'Spécialisé pour l\'Afrique' },
    { id: 'custom', name: 'Personnalisé', description: 'Configuration manuelle' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration Messagerie</h1>
          <p className="text-gray-600">Gérez les paramètres de communication (SMS, WhatsApp, Telegram)</p>
        </div>
        
        <button
          onClick={saveConfig}
          disabled={isSaving}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder tout'}
        </button>
      </div>

      {/* General Test Result */}
      {testResults.general && (
        <div className={`p-4 rounded-lg border ${
          testResults.general.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <span className="font-medium">{testResults.general.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration SMS */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold">SMS</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.sms.enabled}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    sms: { ...prev.sms, enabled: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Activé</span>
              </label>
              
              <button
                onClick={() => testService('sms')}
                disabled={isTestingService === 'sms' || !config.sms.enabled}
                className="flex items-center gap-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg transition-colors"
              >
                <Send className="w-3 h-3" />
                {isTestingService === 'sms' ? 'Test...' : 'Tester'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fournisseur SMS
              </label>
              <select
                value={config.sms.provider}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  sms: { ...prev.sms, provider: e.target.value as any }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {smsProviders.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} - {provider.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={config.sms.apiKey}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    sms: { ...prev.sms, apiKey: e.target.value }
                  }))}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Secret
                </label>
                <input
                  type="password"
                  value={config.sms.apiSecret}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    sms: { ...prev.sms, apiSecret: e.target.value }
                  }))}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'expéditeur
              </label>
              <input
                type="text"
                value={config.sms.senderId}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  sms: { ...prev.sms, senderId: e.target.value }
                }))}
                placeholder="NextMove"
                maxLength={11}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 11 caractères</p>
            </div>
          </div>

          {testResults.sms && (
            <div className={`mt-4 p-3 rounded-lg ${
              testResults.sms.success 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              <p className="text-sm">{testResults.sms.message}</p>
            </div>
          )}
        </div>

        {/* Configuration WhatsApp */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold">WhatsApp Business</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.whatsapp.enabled}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    whatsapp: { ...prev.whatsapp, enabled: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">Activé</span>
              </label>
              
              <button
                onClick={() => testService('whatsapp')}
                disabled={isTestingService === 'whatsapp' || !config.whatsapp.enabled}
                className="flex items-center gap-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg transition-colors"
              >
                <Send className="w-3 h-3" />
                {isTestingService === 'whatsapp' ? 'Test...' : 'Tester'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business API Key
              </label>
              <input
                type="password"
                value={config.whatsapp.businessApiKey}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  whatsapp: { ...prev.whatsapp, businessApiKey: e.target.value }
                }))}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number ID
              </label>
              <input
                type="text"
                value={config.whatsapp.phoneNumberId}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  whatsapp: { ...prev.whatsapp, phoneNumberId: e.target.value }
                }))}
                placeholder="123456789012345"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook Token
              </label>
              <input
                type="password"
                value={config.whatsapp.webhookToken}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  whatsapp: { ...prev.whatsapp, webhookToken: e.target.value }
                }))}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {testResults.whatsapp && (
            <div className={`mt-4 p-3 rounded-lg ${
              testResults.whatsapp.success 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              <p className="text-sm">{testResults.whatsapp.message}</p>
            </div>
          )}
        </div>

        {/* Configuration Telegram */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold">Telegram Bot</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.telegram.enabled}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    telegram: { ...prev.telegram, enabled: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Activé</span>
              </label>
              
              <button
                onClick={() => testService('telegram')}
                disabled={isTestingService === 'telegram' || !config.telegram.enabled}
                className="flex items-center gap-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg transition-colors"
              >
                <Send className="w-3 h-3" />
                {isTestingService === 'telegram' ? 'Test...' : 'Tester'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bot Token
              </label>
              <input
                type="password"
                value={config.telegram.botToken}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  telegram: { ...prev.telegram, botToken: e.target.value }
                }))}
                placeholder="123456789:ABCdefGhIJKlmNoPQRsTuVwXyZ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Obtenez votre token auprès de @BotFather
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chat ID
              </label>
              <input
                type="text"
                value={config.telegram.chatId}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  telegram: { ...prev.telegram, chatId: e.target.value }
                }))}
                placeholder="-123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                ID du groupe ou canal de destination
              </p>
            </div>
          </div>

          {testResults.telegram && (
            <div className={`mt-4 p-3 rounded-lg ${
              testResults.telegram.success 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              <p className="text-sm">{testResults.telegram.message}</p>
            </div>
          )}
        </div>

        {/* Configuration Slack */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-purple-600" />
              <h2 className="text-lg font-semibold">Slack</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.slack.enabled}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    slack: { ...prev.slack, enabled: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">Activé</span>
              </label>
              
              <button
                onClick={() => testService('slack')}
                disabled={isTestingService === 'slack' || !config.slack.enabled}
                className="flex items-center gap-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-lg transition-colors"
              >
                <Send className="w-3 h-3" />
                {isTestingService === 'slack' ? 'Test...' : 'Tester'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="url"
                value={config.slack.webhookUrl}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  slack: { ...prev.slack, webhookUrl: e.target.value }
                }))}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Canal par défaut
              </label>
              <input
                type="text"
                value={config.slack.channel}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  slack: { ...prev.slack, channel: e.target.value }
                }))}
                placeholder="#general"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {testResults.slack && (
            <div className={`mt-4 p-3 rounded-lg ${
              testResults.slack.success 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              <p className="text-sm">{testResults.slack.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="font-medium text-orange-900 mb-3">Guide de configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-800">
          <div>
            <h4 className="font-medium mb-2">SMS (Twilio)</h4>
            <ul className="space-y-1">
              <li>• Créez un compte sur twilio.com</li>
              <li>• Récupérez votre Account SID (API Key)</li>
              <li>• Générez un Auth Token (API Secret)</li>
              <li>• Achetez un numéro de téléphone</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">WhatsApp Business</h4>
            <ul className="space-y-1">
              <li>• Inscrivez-vous à l'API WhatsApp Business</li>
              <li>• Configurez votre webhook</li>
              <li>• Vérifiez votre numéro de téléphone</li>
              <li>• Obtenez l'autorisation Meta</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Telegram Bot</h4>
            <ul className="space-y-1">
              <li>• Contactez @BotFather sur Telegram</li>
              <li>• Créez un nouveau bot avec /newbot</li>
              <li>• Récupérez le token du bot</li>
              <li>• Ajoutez le bot à votre groupe/canal</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Slack</h4>
            <ul className="space-y-1">
              <li>• Créez une app Slack</li>
              <li>• Activez les Incoming Webhooks</li>
              <li>• Copiez l'URL du webhook</li>
              <li>• Choisissez le canal de destination</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
