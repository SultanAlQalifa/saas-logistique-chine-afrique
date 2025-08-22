'use client'

import { useState, useEffect } from 'react'
import { 
  Mail, 
  Server, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Settings,
  Send,
  Eye,
  Edit,
  Plus,
  AlertTriangle
} from 'lucide-react'

interface SMTPConfig {
  id: string
  name: string
  host: string
  port: number
  secure: boolean
  username: string
  password: string
  fromEmail: string
  fromName: string
  isActive: boolean
  isDefault: boolean
  lastTest?: Date
  status: 'active' | 'error' | 'testing'
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  type: 'welcome' | 'password_reset' | 'invoice' | 'notification' | 'tracking'
  language: 'fr' | 'en'
  isActive: boolean
  lastModified: Date
}

export default function SMTPConfigPage() {
  const [smtpConfigs, setSMTPConfigs] = useState<SMTPConfig[]>([
    {
      id: '1',
      name: 'Configuration Principale',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      username: 'noreply@logistique-afrique.com',
      password: '••••••••',
      fromEmail: 'noreply@logistique-afrique.com',
      fromName: 'SaaS Logistique Chine-Afrique',
      isActive: true,
      isDefault: true,
      lastTest: new Date(),
      status: 'active'
    },
    {
      id: '2',
      name: 'Configuration Backup',
      host: 'smtp.mailgun.org',
      port: 587,
      secure: true,
      username: 'postmaster@mg.logistique-afrique.com',
      password: '••••••••',
      fromEmail: 'support@logistique-afrique.com',
      fromName: 'Support Logistique',
      isActive: false,
      isDefault: false,
      status: 'active'
    }
  ])

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Email de Bienvenue',
      subject: 'Bienvenue sur la plateforme logistique',
      type: 'welcome',
      language: 'fr',
      isActive: true,
      lastModified: new Date()
    },
    {
      id: '2',
      name: 'Réinitialisation Mot de Passe',
      subject: 'Réinitialisation de votre mot de passe',
      type: 'password_reset',
      language: 'fr',
      isActive: true,
      lastModified: new Date()
    },
    {
      id: '3',
      name: 'Notification Colis Arrivé',
      subject: 'Votre colis est arrivé - PIN: {tracking_pin}',
      type: 'tracking',
      language: 'fr',
      isActive: true,
      lastModified: new Date()
    }
  ])

  const [activeTab, setActiveTab] = useState<'smtp' | 'templates' | 'logs'>('smtp')
  const [showAddSMTP, setShowAddSMTP] = useState(false)
  const [testingConfig, setTestingConfig] = useState<string | null>(null)

  const testSMTPConnection = async (configId: string) => {
    setTestingConfig(configId)
    // Simuler un test de connexion
    setTimeout(() => {
      setSMTPConfigs(prev => prev.map(config => 
        config.id === configId 
          ? { ...config, status: 'active', lastTest: new Date() }
          : config
      ))
      setTestingConfig(null)
    }, 2000)
  }

  const getStatusIcon = (status: SMTPConfig['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'testing':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="h-7 w-7 text-green-600" />
            Configuration SMTP & Emails
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les serveurs SMTP et les templates d'emails transactionnels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">Service Actif</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('smtp')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'smtp'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Server className="h-4 w-4 inline mr-2" />
            Serveurs SMTP
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Logs & Stats
          </button>
        </nav>
      </div>

      {/* SMTP Configuration Tab */}
      {activeTab === 'smtp' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Configurations SMTP</h2>
            <button 
              onClick={() => setShowAddSMTP(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nouvelle Configuration</span>
              <span className="sm:hidden">Nouvelle</span>
            </button>
          </div>

          <div className="grid gap-4">
            {smtpConfigs.map((config) => (
              <div key={config.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
                      {config.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Par défaut
                        </span>
                      )}
                      {getStatusIcon(testingConfig === config.id ? 'testing' : config.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Serveur:</span>
                        <p className="font-medium">{config.host}:{config.port}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{config.fromEmail}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Sécurité:</span>
                        <p className="font-medium">{config.secure ? 'TLS/SSL' : 'Non sécurisé'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Dernier test:</span>
                        <p className="font-medium">
                          {config.lastTest ? config.lastTest.toLocaleDateString('fr-FR') : 'Jamais'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => testSMTPConnection(config.id)}
                      disabled={testingConfig === config.id}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Templates d'Emails</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nouveau Template</span>
              <span className="sm:hidden">Nouveau</span>
            </button>
          </div>

          <div className="grid gap-4">
            {emailTemplates.map((template) => (
              <div key={template.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        template.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {template.language.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Sujet:</span>
                        <p className="font-medium">{template.subject}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-medium capitalize">{template.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs & Stats Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Statistiques et Logs</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Emails Envoyés (24h)</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de Livraison</p>
                  <p className="text-2xl font-bold text-green-600">98.5%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Erreurs</p>
                  <p className="text-2xl font-bold text-red-600">18</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux d'Ouverture</p>
                  <p className="text-2xl font-bold text-purple-600">67.3%</p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Logs Récents</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { time: '14:32', type: 'success', message: 'Email de bienvenue envoyé à client@example.com', config: 'Configuration Principale' },
                { time: '14:28', type: 'success', message: 'Notification colis arrivé envoyée à user@example.com', config: 'Configuration Principale' },
                { time: '14:15', type: 'error', message: 'Échec envoi email à invalid@email.com - Adresse invalide', config: 'Configuration Backup' },
                { time: '13:45', type: 'success', message: 'Email de réinitialisation mot de passe envoyé', config: 'Configuration Principale' },
              ].map((log, index) => (
                <div key={index} className="p-4 flex items-center gap-4">
                  <div className="text-sm text-gray-500 w-16">{log.time}</div>
                  <div className="flex-shrink-0">
                    {log.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{log.message}</p>
                    <p className="text-xs text-gray-500">{log.config}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
