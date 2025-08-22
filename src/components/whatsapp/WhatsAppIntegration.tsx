'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { QrCode, MessageCircle, CheckCircle, AlertCircle, Copy, ExternalLink, Check, CheckCheck, Clock, Phone, Send } from 'lucide-react'

interface WhatsAppMessage {
  id: string
  content: string
  sender: 'user' | 'business'
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'document' | 'location'
  mediaUrl?: string
}

interface WhatsAppIntegrationProps {
  businessNumber: string
  apiKey: string
  onMessageReceived?: (message: WhatsAppMessage) => void
}

export default function WhatsAppIntegration({ 
  businessNumber, 
  apiKey, 
  onMessageReceived 
}: WhatsAppIntegrationProps) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [selectedContact, setSelectedContact] = useState<string | null>(null)

  useEffect(() => {
    // Initialiser la connexion WhatsApp Business API
    initializeWhatsApp()
  }, [])

  const initializeWhatsApp = async () => {
    try {
      // Simulation de l'initialisation WhatsApp Business API
      // Dans un vrai projet, utiliser l'API officielle WhatsApp Business
      
      // Générer un QR code pour l'authentification
      const qrCodeData = await generateQRCode()
      setQrCode(qrCodeData)
      
      // Simuler la connexion après scan du QR code
      setTimeout(() => {
        setIsConnected(true)
        setQrCode(null)
        loadContacts()
      }, 5000)
      
    } catch (error) {
      console.error('Erreur initialisation WhatsApp:', error)
    }
  }

  const generateQRCode = async (): Promise<string> => {
    // Simulation de génération QR code
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="black"/>
        <rect x="40" y="40" width="120" height="120" fill="white"/>
        <text x="100" y="105" text-anchor="middle" font-size="12" fill="black">QR Code WhatsApp</text>
      </svg>
    `)}`
  }

  const loadContacts = async () => {
    // Simulation de chargement des contacts
    const mockContacts = [
      {
        id: '1',
        name: 'Client Import-Export',
        phone: '+225123456789',
        lastMessage: 'Bonjour, j\'aimerais avoir des informations sur vos services',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        unread: 2
      },
      {
        id: '2',
        name: 'Fournisseur Guangzhou',
        phone: '+8613812345678',
        lastMessage: 'Les marchandises sont prêtes pour expédition',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unread: 0
      }
    ]
    
    setContacts(mockContacts)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return

    const message: WhatsAppMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'business',
      timestamp: new Date(),
      status: 'sent',
      type: 'text'
    }

    try {
      // Envoyer via WhatsApp Business API
      await sendWhatsAppMessage(selectedContact, newMessage)
      
      setMessages(prev => [...prev, message])
      setNewMessage('')
      
      // Simuler la livraison
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: 'delivered' } : m
        ))
      }, 1000)
      
      // Simuler la lecture
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: 'read' } : m
        ))
      }, 3000)
      
    } catch (error) {
      console.error('Erreur envoi message WhatsApp:', error)
    }
  }

  const sendWhatsAppMessage = async (contactId: string, message: string) => {
    // Simulation d'envoi via WhatsApp Business API
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        to: contactId,
        message: message,
        type: 'text'
      })
    })
    
    if (!response.ok) {
      throw new Error('Erreur envoi message WhatsApp')
    }
    
    return response.json()
  }

  const sendTemplate = async (templateName: string, contactId: string, params: any[]) => {
    try {
      const response = await fetch('/api/whatsapp/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          to: contactId,
          template: templateName,
          parameters: params
        })
      })
      
      if (!response.ok) {
        throw new Error('Erreur envoi template WhatsApp')
      }
      
    } catch (error) {
      console.error('Erreur envoi template:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      default:
        return <Clock className="w-3 h-3 text-gray-400" />
    }
  }

  if (!isConnected && qrCode) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
        <MessageCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Connexion WhatsApp Business</h3>
        <p className="text-gray-600 mb-6 text-center">
          Scannez ce QR code avec WhatsApp sur votre téléphone pour connecter votre compte business
        </p>
        
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
          <Image 
            src={qrCode} 
            alt="QR Code WhatsApp" 
            width={192} 
            height={192}
            className="w-48 h-48" 
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
          <span>En attente de scan...</span>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-2">Connexion à WhatsApp...</span>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Liste des contacts */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-green-500 text-white">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold">WhatsApp Business</h3>
          </div>
          <p className="text-sm opacity-90">{businessNumber}</p>
        </div>
        
        <div className="overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 ${
                selectedContact === contact.id ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{contact.name}</span>
                {contact.unread > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                    {contact.unread}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
              <p className="text-xs text-gray-400 mt-1">
                {contact.timestamp.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header conversation */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">
                    {contacts.find(c => c.id === selectedContact)?.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {contacts.find(c => c.id === selectedContact)?.phone}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'business' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'business'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      message.sender === 'business' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">
                        {message.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {message.sender === 'business' && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Templates rapides */}
            <div className="px-4 py-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Messages rapides :</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Bonjour ! Comment puis-je vous aider ?',
                  'Merci pour votre message, je reviens vers vous rapidement',
                  'Votre colis est en cours de traitement',
                  'Avez-vous d\'autres questions ?'
                ].map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setNewMessage(template)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  >
                    {template.substring(0, 20)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
