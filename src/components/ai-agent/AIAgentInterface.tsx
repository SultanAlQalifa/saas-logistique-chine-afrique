'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Phone, Mail, MessageCircle, Zap, Brain, Clock, RotateCcw } from 'lucide-react'
import { mainAIAgent } from '@/lib/ai-agent'

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
  typing?: boolean
}

interface AIAgentInterfaceProps {
  userId: string
  userProfile?: {
    name?: string
    company?: string
    country?: string
    language: string
    timezone: string
    previousInteractions?: number
  }
  onConversationUpdate?: (messages: Message[]) => void
}

export default function AIAgentInterface({ 
  userId, 
  userProfile, 
  onConversationUpdate 
}: AIAgentInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [agentStatus, setAgentStatus] = useState<'online' | 'busy' | 'offline'>('online')
  const [responseTime, setResponseTime] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Message de bienvenue automatique avec nom africain adaptatif
    const welcomeMessage: Message = {
      id: 'welcome',
      content: '',
      sender: 'agent',
      timestamp: new Date()
    }
    
    // Obtenir l'introduction personnalisée avec nom africain
    const personalizedIntro = mainAIAgent.getPersonalizedIntroduction({
      country: userProfile?.country,
      language: userProfile?.language,
      preferredGender: 'unisex' // Par défaut, peut être adapté selon les préférences
    })
    
    welcomeMessage.content = personalizedIntro
    setMessages([welcomeMessage])
  }, [userId, userProfile])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (onConversationUpdate) {
      onConversationUpdate(messages)
    }
  }, [messages, onConversationUpdate])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)
    setAgentStatus('busy')

    const startTime = Date.now()

    try {
      // Simuler un délai de frappe réaliste
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

      const response = await mainAIAgent.processMessage(userId, newMessage, {
        userId,
        userRole: 'PROSPECT',
        conversationHistory: messages.map(m => ({
          id: m.id,
          content: m.content,
          sender: m.sender,
          timestamp: m.timestamp
        })),
        userProfile: userProfile ? {
          ...userProfile,
          previousInteractions: userProfile.previousInteractions || 0
        } : undefined,
        currentIntent: 'INFORMATION',
        urgencyLevel: 'LOW'
      })

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'agent',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, agentMessage])
      setResponseTime(Date.now() - startTime)
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?',
        sender: 'agent',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      setAgentStatus('online')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetConversation = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser la conversation ? Tous les messages seront supprimés.')) {
      // Réinitialiser avec le message de bienvenue
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        content: '',
        sender: 'agent',
        timestamp: new Date()
      }
      
      // Obtenir l'introduction personnalisée avec nom africain
      const personalizedIntro = mainAIAgent.getPersonalizedIntroduction({
        country: userProfile?.country,
        language: userProfile?.language,
        preferredGender: 'unisex'
      })
      
      welcomeMessage.content = personalizedIntro
      setMessages([welcomeMessage])
      setNewMessage('')
      setIsTyping(false)
      setAgentStatus('online')
      setResponseTime(0)
    }
  }

  const quickActions = [
    { label: 'Demander un devis', action: 'Je souhaiterais avoir un devis pour mes expéditions' },
    { label: 'Voir les tarifs', action: 'Quels sont vos tarifs de transport ?' },
    { label: 'Suivre un colis', action: 'Comment puis-je suivre mon colis ?' },
    { label: 'Parler à un humain', action: 'Je souhaiterais parler à un conseiller humain' }
  ]

  const sendQuickAction = (action: string) => {
    setNewMessage(action)
    setTimeout(() => sendMessage(), 100)
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header avec statut de l'agent */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              agentStatus === 'online' ? 'bg-green-500' : 
              agentStatus === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}></div>
          </div>
          <div>
            <h3 className="font-semibold">Alex - Assistant IA</h3>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Brain className="w-3 h-3" />
              <span>{agentStatus === 'online' ? 'En ligne' : agentStatus === 'busy' ? 'En cours de réponse...' : 'Hors ligne'}</span>
              {responseTime > 0 && (
                <>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{(responseTime / 1000).toFixed(1)}s</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-xs lg:max-w-md ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              }`}>
                {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Indicateur de frappe */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 max-w-xs lg:max-w-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Actions rapides */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Actions rapides :</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => sendQuickAction(action.action)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button 
            onClick={resetConversation}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex-shrink-0"
            title="Réinitialiser la conversation"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span>Réponse en moins de 3 secondes</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-3 h-3 text-green-500" />
            <span>Disponible 24/7</span>
          </div>
        </div>
      </div>
    </div>
  )
}
