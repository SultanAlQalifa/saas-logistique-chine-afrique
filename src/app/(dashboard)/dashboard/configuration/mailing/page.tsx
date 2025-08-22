'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Mail, Server, Shield, Key, Send, TestTube, CheckCircle, AlertCircle, Settings, AlertTriangle } from 'lucide-react'

interface MailingConfig {
  smtp: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
  from: {
    name: string
    email: string
  }
  templates: {
    [key: string]: {
      subject: string
      html: string
      text: string
    }
  }
}

export default function MailingConfigPage() {
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

  const [config, setConfig] = useState<MailingConfig>({
    smtp: {
      host: '',
      port: 587,
      secure: false,
      auth: {
        user: '',
        pass: ''
      }
    },
    from: {
      name: 'NextMove Cargo',
      email: ''
    },
    templates: {}
  })
  
  const [testEmail, setTestEmail] = useState('')
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadMailingConfig()
  }, [])

  const loadMailingConfig = async () => {
    try {
      const response = await fetch('/api/admin/mailing/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Erreur chargement config mailing:', error)
    }
  }

  const saveConfig = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/mailing/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        setTestResult({ success: true, message: 'Configuration sauvegardée avec succès' })
      } else {
        throw new Error('Erreur sauvegarde')
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Erreur lors de la sauvegarde' })
    } finally {
      setIsSaving(false)
    }
  }

  const testConnection = async () => {
    setIsTestingConnection(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/admin/mailing/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, testEmail })
      })
      
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({ success: false, message: 'Erreur lors du test de connexion' })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const presetConfigs = [
    {
      name: 'Gmail',
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false
      }
    },
    {
      name: 'Outlook',
      config: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false
      }
    },
    {
      name: 'Yahoo',
      config: {
        host: 'smtp.mail.yahoo.com',
        port: 587,
        secure: false
      }
    },
    {
      name: 'SendGrid',
      config: {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false
      }
    }
  ]

  const applyPreset = (preset: any) => {
    setConfig(prev => ({
      ...prev,
      smtp: {
        ...prev.smtp,
        ...preset.config
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration Mailing</h1>
          <p className="text-gray-600">Gérez les paramètres de messagerie électronique</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={testConnection}
            disabled={isTestingConnection || !config.smtp.host}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <TestTube className="w-4 h-4" />
            {isTestingConnection ? 'Test en cours...' : 'Tester'}
          </button>
          
          <button
            onClick={saveConfig}
            disabled={isSaving}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`p-4 rounded-lg border ${
          testResult.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{testResult.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration SMTP */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold">Serveur SMTP</h2>
          </div>

          {/* Presets */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Configurations prédéfinies
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetConfigs.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serveur SMTP *
              </label>
              <input
                type="text"
                value={config.smtp.host}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  smtp: { ...prev.smtp, host: e.target.value }
                }))}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port *
                </label>
                <input
                  type="number"
                  value={config.smtp.port}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    smtp: { ...prev.smtp, port: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.smtp.secure}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      smtp: { ...prev.smtp, secure: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">SSL/TLS</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Authentification */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold">Authentification</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur / Email *
              </label>
              <input
                type="email"
                value={config.smtp.auth.user}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  smtp: {
                    ...prev.smtp,
                    auth: { ...prev.smtp.auth, user: e.target.value }
                  }
                }))}
                placeholder="votre-email@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe / Token *
              </label>
              <input
                type="password"
                value={config.smtp.auth.pass}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  smtp: {
                    ...prev.smtp,
                    auth: { ...prev.smtp.auth, pass: e.target.value }
                  }
                }))}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Pour Gmail, utilisez un mot de passe d'application
              </p>
            </div>
          </div>
        </div>

        {/* Expéditeur */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-semibold">Expéditeur par défaut</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'expéditeur *
              </label>
              <input
                type="text"
                value={config.from.name}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  from: { ...prev.from, name: e.target.value }
                }))}
                placeholder="NextMove Cargo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de l'expéditeur *
              </label>
              <input
                type="email"
                value={config.from.email}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  from: { ...prev.from, email: e.target.value }
                }))}
                placeholder="noreply@nextmovecargo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Test d'envoi */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Send className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-semibold">Test d'envoi</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de test
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={testConnection}
              disabled={isTestingConnection || !testEmail || !config.smtp.host}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              {isTestingConnection ? 'Envoi en cours...' : 'Envoyer email de test'}
            </button>
          </div>
        </div>
      </div>

      {/* Informations importantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Informations importantes</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Pour Gmail, activez l'authentification à 2 facteurs et utilisez un mot de passe d'application</li>
          <li>• Pour Outlook, utilisez votre mot de passe habituel ou un token d'application</li>
          <li>• Vérifiez que votre fournisseur autorise les connexions SMTP</li>
          <li>• Les paramètres sont chiffrés et stockés de manière sécurisée</li>
        </ul>
      </div>
    </div>
  )
}
