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

export default function WhatsAppWidgetInterface() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1') // Démarrer avec une conversation sélectionnée
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')

  // Mock conversations data - version widget plus compacte
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
    }
  ]

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: '1',
      text: 'Bonjour ! Comment puis-je vous aider ?',
      time: '14:20',
      sender: 'other',
      status: 'read'
    },
    {
      id: '2',
      text: 'J\'aimerais suivre mon colis',
      time: '14:21',
      sender: 'me',
      status: 'read'
    },
    {
      id: '3',
      text: 'Votre colis arrivera demain.',
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
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-80 bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Panel gauche - Liste des conversations (version widget compacte) */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isLeftPanelCollapsed ? 'w-12' : 'w-48'
      } flex flex-col`}>
        
        {/* Header du panel gauche */}
        <div className="p-2 border-b border-gray-200 bg-gray-50">
          {!isLeftPanelCollapsed ? (
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Discussions</h3>
              <button 
                onClick={() => setIsLeftPanelCollapsed(true)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button 
                onClick={() => setIsLeftPanelCollapsed(false)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                <MessageCircle className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Barre de recherche compacte */}
        {!isLeftPanelCollapsed && (
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-2 py-1 bg-gray-100 border-0 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        {/* Liste des conversations compacte */}
        <div className="flex-1 overflow-y-auto">
          {!isLeftPanelCollapsed ? (
            <div className="space-y-0">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-2 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedConversation === conv.id ? 'bg-green-50 border-l-2 border-l-green-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* Avatar compact */}
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                        conv.provider === 'super_admin' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {conv.isGroup ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          conv.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Info conversation compacte */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-gray-900 truncate">{conv.name}</h4>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">{conv.time}</span>
                          {conv.status === 'read' && <CheckCheck className="h-2 w-2 text-blue-500" />}
                          {conv.status === 'delivered' && <CheckCheck className="h-2 w-2 text-gray-400" />}
                          {conv.status === 'sent' && <Check className="h-2 w-2 text-gray-400" />}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-green-500 text-white text-xs rounded-full px-1 py-0.5 min-w-[16px] text-center leading-none">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      {conv.provider === 'company' && conv.companyName && (
                        <p className="text-xs text-green-600 mt-0.5 truncate">📦 {conv.companyName}</p>
                      )}
                      {conv.provider === 'super_admin' && (
                        <p className="text-xs text-blue-600 mt-0.5">🛡️ Support</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Version collapsed - avatars uniquement
            <div className="space-y-1 p-1">
              {conversations.slice(0, 6).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv.id)
                    setIsLeftPanelCollapsed(false)
                  }}
                  className={`relative cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors ${
                    selectedConversation === conv.id ? 'bg-green-100' : ''
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                    conv.provider === 'super_admin' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {conv.isGroup ? (
                      <Users className="h-3 w-3" />
                    ) : (
                      conv.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center leading-none">
                      {conv.unreadCount}
                    </div>
                  )}
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-400 border border-white rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel droit - Zone de chat compacte */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Header du chat compact */}
            <div className="p-2 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                      selectedConv.provider === 'super_admin' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {selectedConv.isGroup ? (
                        <Users className="h-3 w-3" />
                      ) : (
                        selectedConv.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {selectedConv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-400 border border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900">{selectedConv.name}</h4>
                    <p className="text-xs text-gray-600">
                      {selectedConv.isOnline ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                    <Phone className="h-3 w-3" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                    <MoreVertical className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Zone de messages compacte */}
            <div className="flex-1 overflow-y-auto p-2 bg-gray-50" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.2'%3E%3Cpath d='m20 20v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-20V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}>
              <div className="space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] px-2 py-1 rounded text-xs ${
                      message.sender === 'me'
                        ? 'bg-green-500 text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                    }`}>
                      <p>{message.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        message.sender === 'me' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{message.time}</span>
                        {message.sender === 'me' && (
                          <>
                            {message.status === 'read' && <CheckCheck className="h-2 w-2 text-blue-200" />}
                            {message.status === 'delivered' && <CheckCheck className="h-2 w-2" />}
                            {message.status === 'sent' && <Check className="h-2 w-2" />}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bulles de changement d'interlocuteur compactes */}
                <div className="scale-90 origin-left">
                  <WhatsAppChatBubbles 
                    conversationId={selectedConversation || ''}
                    currentMessage={newMessage}
                    onProviderChange={(provider) => {
                      console.log('Provider changed in widget:', provider)
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Zone de saisie compacte */}
            <div className="p-2 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                  <Paperclip className="h-3 w-3" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full border border-gray-300 rounded-full px-2 py-1 pr-12 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5">
                    <button className="p-0.5 text-gray-400 hover:text-gray-600">
                      <Smile className="h-3 w-3" />
                    </button>
                    {newMessage.trim() ? (
                      <button 
                        onClick={handleSendMessage}
                        className="p-0.5 text-green-500 hover:text-green-600"
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    ) : (
                      <button className="p-0.5 text-gray-400 hover:text-gray-600">
                        <Mic className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // État vide compact
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">WhatsApp Business</h4>
              <p className="text-xs text-gray-600">Sélectionnez une discussion</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
