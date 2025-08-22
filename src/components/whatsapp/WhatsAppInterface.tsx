'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Search, MoreVertical, Phone, Video, Send, Paperclip, Smile, Mic, ArrowLeft, Check, CheckCheck, User, Users, Settings, Archive, Star } from 'lucide-react'
import WhatsAppChatBubbles from './WhatsAppChatBubbles'

interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  time: string
  unreadCount: number
  isOnline: boolean
  isGroup: boolean
  provider: 'super_admin' | 'company'
  companyName?: string
  status: 'sent' | 'delivered' | 'read'
}

interface Message {
  id: string
  text: string
  time: string
  sender: 'me' | 'other'
  status: 'sent' | 'delivered' | 'read'
}

export default function WhatsAppInterface() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Support NextMove',
      lastMessage: 'Votre colis est en cours de livraison',
      time: '14:23',
      unreadCount: 2,
      isOnline: true,
      isGroup: false,
      provider: 'super_admin',
      status: 'read'
    },
    {
      id: '2',
      name: 'LogiTrans Sénégal',
      lastMessage: 'Merci pour votre commande',
      time: '13:45',
      unreadCount: 0,
      isOnline: true,
      isGroup: false,
      provider: 'company',
      companyName: 'LogiTrans Sénégal',
      status: 'delivered'
    },
    {
      id: '3',
      name: 'Cargo Express Mali',
      lastMessage: 'Le délai de livraison est de 5-7 jours',
      time: '12:30',
      unreadCount: 1,
      isOnline: false,
      isGroup: false,
      provider: 'company',
      companyName: 'Cargo Express Mali',
      status: 'sent'
    },
    {
      id: '4',
      name: 'Support Technique',
      lastMessage: 'Nous avons résolu votre problème',
      time: '11:15',
      unreadCount: 0,
      isOnline: true,
      isGroup: false,
      provider: 'super_admin',
      status: 'read'
    },
    {
      id: '5',
      name: 'Groupe Expédition Dakar',
      lastMessage: 'Sarah: Nouvelle expédition disponible',
      time: '10:45',
      unreadCount: 5,
      isOnline: true,
      isGroup: true,
      provider: 'company',
      companyName: 'Multi-Entreprises',
      status: 'read'
    }
  ]

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: '1',
      text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      time: '14:20',
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      text: 'J\'aimerais suivre mon colis SVP',
      time: '14:21',
      sender: 'me',
      status: 'read'
    },
    {
      id: '3',
      text: 'Bien sûr ! Pouvez-vous me donner votre numéro de suivi ?',
      time: '14:22',
      sender: 'other',
      status: 'read'
    },
    {
      id: '4',
      text: 'NM2024-ABC123',
      time: '14:22',
      sender: 'me',
      status: 'delivered'
    },
    {
      id: '5',
      text: 'Parfait ! Votre colis est actuellement en transit et arrivera demain.',
      time: '14:23',
      sender: 'other',
      status: 'read'
    }
  ]

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Logique d'envoi de message
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-[600px] bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Panel gauche - Liste des conversations */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isLeftPanelCollapsed ? 'w-16' : 'w-80'
      } flex flex-col`}>
        
        {/* Header du panel gauche */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          {!isLeftPanelCollapsed ? (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Discussions</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setIsLeftPanelCollapsed(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button 
                onClick={() => setIsLeftPanelCollapsed(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Barre de recherche */}
        {!isLeftPanelCollapsed && (
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une discussion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto">
          {!isLeftPanelCollapsed ? (
            <div className="space-y-0">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-3 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedConversation === conv.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        conv.provider === 'super_admin' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {conv.isGroup ? (
                          <Users className="h-6 w-6" />
                        ) : (
                          conv.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Info conversation */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">{conv.time}</span>
                          {conv.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                          {conv.status === 'delivered' && <CheckCheck className="h-3 w-3 text-gray-400" />}
                          {conv.status === 'sent' && <Check className="h-3 w-3 text-gray-400" />}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      {conv.provider === 'company' && conv.companyName && (
                        <p className="text-xs text-green-600 mt-1">📦 {conv.companyName}</p>
                      )}
                      {conv.provider === 'super_admin' && (
                        <p className="text-xs text-blue-600 mt-1">🛡️ Support Officiel</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Version collapsed - juste les avatars
            <div className="space-y-2 p-2">
              {conversations.slice(0, 8).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv.id)
                    setIsLeftPanelCollapsed(false)
                  }}
                  className={`relative cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    selectedConversation === conv.id ? 'bg-green-100' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                    conv.provider === 'super_admin' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {conv.isGroup ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      conv.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unreadCount}
                    </div>
                  )}
                  {conv.isOnline && (
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel droit - Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Header du chat */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      selectedConv.provider === 'super_admin' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {selectedConv.isGroup ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        selectedConv.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {selectedConv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConv.name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedConv.isOnline ? 'En ligne' : 'Hors ligne'}
                      {selectedConv.provider === 'company' && selectedConv.companyName && (
                        <span className="ml-2 text-green-600">• {selectedConv.companyName}</span>
                      )}
                      {selectedConv.provider === 'super_admin' && (
                        <span className="ml-2 text-blue-600">• Support Officiel</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Video className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Zone de messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'me'
                        ? 'bg-green-500 text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        message.sender === 'me' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{message.time}</span>
                        {message.sender === 'me' && (
                          <>
                            {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-200" />}
                            {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                            {message.status === 'sent' && <Check className="h-3 w-3" />}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bulles de changement d'interlocuteur */}
                <WhatsAppChatBubbles 
                  conversationId={selectedConversation || ''}
                  currentMessage={newMessage}
                  onProviderChange={(provider) => {
                    console.log('Provider changed:', provider)
                  }}
                />
              </div>
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Tapez un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full border border-gray-300 rounded-full px-4 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Smile className="h-4 w-4" />
                    </button>
                    {newMessage.trim() ? (
                      <button 
                        onClick={handleSendMessage}
                        className="p-1 text-green-500 hover:text-green-600"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    ) : (
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Mic className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // État vide - aucune conversation sélectionnée
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp Business</h3>
              <p className="text-gray-600 mb-4">Sélectionnez une discussion pour commencer à chatter</p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Support Officiel</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Entreprises Partenaires</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
