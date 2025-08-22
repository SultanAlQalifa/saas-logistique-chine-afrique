'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  Paperclip,
  Smile,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Bot
} from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'user' | 'agent' | 'system'
  message: string
  timestamp: Date
  status?: 'sent' | 'delivered' | 'read'
  attachments?: string[]
}

interface ChatSession {
  id: string
  clientName: string
  clientEmail: string
  status: 'active' | 'waiting' | 'closed'
  lastMessage: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
  unreadCount: number
}

const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    clientName: 'Marie Diallo',
    clientEmail: 'marie.diallo@email.com',
    status: 'active',
    lastMessage: 'Bonjour, j\'ai une question sur mon colis',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    priority: 'high',
    unreadCount: 2
  },
  {
    id: '2',
    clientName: 'Ahmed Kone',
    clientEmail: 'ahmed.kone@email.com',
    status: 'waiting',
    lastMessage: 'Merci pour votre aide',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    priority: 'medium',
    unreadCount: 0
  },
  {
    id: '3',
    clientName: 'Fatou Sow',
    clientEmail: 'fatou.sow@email.com',
    status: 'active',
    lastMessage: 'Quand arrive mon colis ?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    priority: 'medium',
    unreadCount: 1
  }
]

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'user',
    message: 'Bonjour, j\'ai une question sur mon colis',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    status: 'read'
  },
  {
    id: '2',
    sender: 'agent',
    message: 'Bonjour Marie ! Je suis là pour vous aider. Pouvez-vous me donner votre numéro de suivi ?',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    status: 'read'
  },
  {
    id: '3',
    sender: 'user',
    message: 'Voici mon numéro : NMC2024-001234',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'read'
  },
  {
    id: '4',
    sender: 'agent',
    message: 'Parfait ! Je vérifie votre colis maintenant...',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    status: 'delivered'
  }
]

export default function LiveChatPage() {
  const { data: session } = useSession()
  const [selectedChat, setSelectedChat] = useState<string>('1')
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'agent',
      message: newMessage,
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages([...messages, message])
    setNewMessage('')

    // Simuler la réponse du client
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const clientResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'user',
          message: 'Merci pour votre réponse rapide !',
          timestamp: new Date(),
          status: 'read'
        }
        setMessages(prev => [...prev, clientResponse])
      }, 2000)
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'waiting': return 'bg-yellow-500'
      case 'closed': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const selectedSession = mockChatSessions.find(s => s.id === selectedChat)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              💬 Chat en Direct
            </h1>
            <p className="text-gray-600 mt-1">Support client temps réel</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              En ligne
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Chat Sessions Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto">
            {mockChatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setSelectedChat(session.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === session.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {session.clientName.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(session.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate">{session.clientName}</h3>
                        <AlertCircle className={`h-3 w-3 ${getPriorityColor(session.priority)}`} />
                      </div>
                      <p className="text-sm text-gray-500 truncate">{session.lastMessage}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{formatTime(session.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  {session.unreadCount > 0 && (
                    <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {session.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedSession && (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedSession.clientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedSession.clientName}</h3>
                      <p className="text-sm text-gray-500">{selectedSession.clientEmail}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedSession.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedSession.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedSession.status === 'active' ? 'Actif' :
                       selectedSession.status === 'waiting' ? 'En attente' : 'Fermé'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-xs lg:max-w-md ${
                      message.sender === 'agent' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                        message.sender === 'agent' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                          : 'bg-gradient-to-r from-green-500 to-teal-500'
                      }`}>
                        {message.sender === 'agent' ? session?.user?.name?.charAt(0) || 'A' : selectedSession.clientName.charAt(0)}
                      </div>
                      <div className={`rounded-lg px-4 py-2 ${
                        message.sender === 'agent'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          message.sender === 'agent' ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className={`text-xs ${
                            message.sender === 'agent' ? 'text-indigo-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </span>
                          {message.sender === 'agent' && (
                            <CheckCircle className={`h-3 w-3 ${
                              message.status === 'read' ? 'text-indigo-200' :
                              message.status === 'delivered' ? 'text-indigo-300' :
                              'text-indigo-400'
                            }`} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3 max-w-xs lg:max-w-md">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {selectedSession.clientName.charAt(0)}
                      </div>
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Tapez votre message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Client Info Sidebar */}
        {selectedSession && (
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="space-y-6">
              {/* Client Profile */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Client</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedSession.clientName}</p>
                      <p className="text-sm text-gray-500">{selectedSession.clientEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-900">Conversations: 3</p>
                      <p className="text-xs text-gray-500">Dernière: il y a 5 min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    📦 Vérifier les colis
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    💰 Historique des paiements
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    📋 Créer un ticket
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    📞 Programmer un appel
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Colis livré</p>
                      <p className="text-xs text-gray-500">Il y a 2 jours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Paiement reçu</p>
                      <p className="text-xs text-gray-500">Il y a 1 semaine</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Nouveau devis</p>
                      <p className="text-xs text-gray-500">Il y a 2 semaines</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
