'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MessageSquare, Send, Phone, Clock, CheckCircle, AlertCircle, Users, Zap, Settings } from 'lucide-react'
import { WhatsAppMessage, WhatsAppTemplate } from '@/lib/whatsapp-business'

export default function WhatsAppSupportPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'messages' | 'templates' | 'settings'>('messages')
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [templateParams, setTemplateParams] = useState<string[]>([])

  // Statistiques mock
  const stats = {
    totalMessages: 1247,
    messagesDelivered: 1189,
    messagesRead: 1056,
    responseRate: 84.7,
    avgResponseTime: '2.3 min'
  }

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages()
    } else if (activeTab === 'templates') {
      fetchTemplates()
    }
  }, [activeTab])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/whatsapp/messages')
      const data = await response.json()
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/whatsapp/templates')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.data)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!phoneNumber || (!newMessage && !selectedTemplate)) return

    setLoading(true)
    try {
      const payload = selectedTemplate 
        ? {
            to: phoneNumber,
            messageType: 'template',
            templateName: selectedTemplate,
            templateLanguage: 'fr',
            templateParameters: templateParams.filter(p => p.trim())
          }
        : {
            to: phoneNumber,
            message: newMessage
          }

      const response = await fetch('/api/whatsapp/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (data.success) {
        setNewMessage('')
        setPhoneNumber('')
        setSelectedTemplate('')
        setTemplateParams([])
        fetchMessages()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="h-4 w-4 text-blue-500" />
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'read': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const formatPhoneNumber = (phone: string) => {
    return phone.startsWith('221') ? `+${phone}` : phone
  }

  if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Restreint</h2>
          <p className="text-gray-600">Seuls les administrateurs peuvent accéder à WhatsApp Business.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">WhatsApp Business</h1>
            <p className="text-green-100">Communication client centralisée via Meta Cloud API</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg p-3">
              <MessageSquare className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Messages Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Livrés</p>
              <p className="text-2xl font-bold text-green-600">{stats.messagesDelivered.toLocaleString()}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lus</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.messagesRead.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux Réponse</p>
              <p className="text-2xl font-bold text-purple-600">{stats.responseRate}%</p>
            </div>
            <Zap className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temps Moyen</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgResponseTime}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Configuration
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Messages */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Formulaire d'envoi */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Envoyer un message</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="221776581741"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template (optionnel)
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => {
                        setSelectedTemplate(e.target.value)
                        if (e.target.value) {
                          const template = templates.find(t => t.name === e.target.value)
                          const paramCount = template?.components
                            .find(c => c.type === 'BODY')?.text
                            .match(/\{\{\d+\}\}/g)?.length || 0
                          setTemplateParams(new Array(paramCount).fill(''))
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Message libre</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.name}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedTemplate ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Paramètres du template
                    </label>
                    {templateParams.map((param, index) => (
                      <input
                        key={index}
                        type="text"
                        value={param}
                        onChange={(e) => {
                          const newParams = [...templateParams]
                          newParams[index] = e.target.value
                          setTemplateParams(newParams)
                        }}
                        placeholder={`Paramètre ${index + 1}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}

                <button
                  onClick={sendMessage}
                  disabled={loading || !phoneNumber || (!newMessage && !selectedTemplate)}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{loading ? 'Envoi...' : 'Envoyer'}</span>
                </button>
              </div>

              {/* Liste des messages */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Historique des messages</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map(message => (
                      <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">
                                {formatPhoneNumber(message.to)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleString('fr-FR')}
                              </span>
                              {getStatusIcon(message.status)}
                            </div>
                            
                            <div className="text-sm text-gray-900">
                              {message.message_type === 'template' ? (
                                <div>
                                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                                    Template: {message.content.template_name}
                                  </span>
                                  <div>Paramètres: {message.content.parameters?.join(', ')}</div>
                                </div>
                              ) : (
                                message.content.text
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Templates disponibles</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map(template => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{template.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          template.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800'
                            : template.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {template.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <strong>Catégorie:</strong> {template.category}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Langue:</strong> {template.language}
                        </div>
                        
                        {template.components.map((component, index) => (
                          <div key={index} className="text-sm">
                            <strong>{component.type}:</strong>
                            <div className="bg-gray-50 p-2 rounded mt-1 text-xs">
                              {component.text || component.format || 'Contenu multimédia'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Onglet Configuration */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Configuration WhatsApp Business</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Settings className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Configuration requise</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Les variables d'environnement suivantes doivent être configurées :
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• WHATSAPP_PHONE_NUMBER_ID</li>
                      <li>• WHATSAPP_ACCESS_TOKEN</li>
                      <li>• WHATSAPP_APP_ID</li>
                      <li>• WHATSAPP_APP_SECRET</li>
                      <li>• WHATSAPP_WEBHOOK_VERIFY_TOKEN</li>
                      <li>• WHATSAPP_BUSINESS_ACCOUNT_ID</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">URL Webhook</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Configurez cette URL dans votre application Meta :
                    </p>
                    <code className="text-sm bg-white px-2 py-1 rounded mt-2 block">
                      {typeof window !== 'undefined' ? `${window.location.origin}/api/whatsapp/webhook` : '/api/whatsapp/webhook'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
