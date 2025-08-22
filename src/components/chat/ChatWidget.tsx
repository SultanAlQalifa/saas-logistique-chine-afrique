'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Phone,
  Mail,
  FileText
} from 'lucide-react'
import { nextMoveAI } from '@/lib/nextmove-ai'
import { useSession } from 'next-auth/react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: 'Bonjour ! Je suis votre assistant virtuel pour la logistique Chine-Afrique. Comment puis-je vous aider aujourd\'hui ?',
    timestamp: new Date(),
    suggestions: [
      'Calculer un devis de transport',
      'Suivre un colis',
      'Contacter le support',
      'Voir la documentation API'
    ]
  }
]

const botResponses: Record<string, Message> = {
  'devis': {
    id: Date.now().toString(),
    type: 'bot',
    content: 'Pour obtenir un devis personnalisé, vous pouvez :\n\n• Utiliser notre portail client pour créer une demande de devis\n• Nos entreprises partenaires vous répondront avec des prix compétitifs\n• Délai de réponse : 24-48h maximum\n\nSouhaitez-vous que je vous redirige vers le portail client ?',
    timestamp: new Date(),
    suggestions: ['Aller au portail client', 'En savoir plus sur les tarifs', 'Contacter un expert']
  },
  'suivi': {
    id: Date.now().toString(),
    type: 'bot',
    content: 'Pour suivre votre colis :\n\n• Connectez-vous à votre espace client\n• Utilisez votre numéro de suivi (ex: CO-001234)\n• Consultez le statut en temps réel\n\nBesoin d\'aide pour vous connecter ?',
    timestamp: new Date(),
    suggestions: ['Aller au portail client', 'Problème de connexion', 'Numéro de suivi perdu']
  },
  'support': {
    id: Date.now().toString(),
    type: 'bot',
    content: 'Notre équipe support est disponible :\n\n📞 **Téléphone**: +225 XX XX XX XX\n📧 **Email**: support@logistique-ca.com\n⏰ **Horaires**: Lun-Ven 8h-18h (GMT)\n\nVous pouvez aussi utiliser ce chat pour une assistance immédiate !',
    timestamp: new Date(),
    suggestions: ['Urgence technique', 'Question commerciale', 'Réclamation']
  },
  'api': {
    id: Date.now().toString(),
    type: 'bot',
    content: 'Documentation API disponible :\n\n📚 **Guide développeur**: /docs/api\n🔑 **Clés API**: Disponibles dans votre dashboard\n💻 **Exemples de code**: Python, JavaScript, PHP\n\nQuel langage vous intéresse ?',
    timestamp: new Date(),
    suggestions: ['Documentation complète', 'Exemples Python', 'Exemples JavaScript', 'Support technique']
  },
  'default': {
    id: Date.now().toString(),
    type: 'bot',
    content: 'Je comprends votre question. Voici comment je peux vous aider :\n\n• **Devis et tarification** - Obtenez des prix personnalisés\n• **Suivi de colis** - Localisez vos expéditions\n• **Support technique** - Assistance pour la plateforme\n• **Documentation** - Guides et API\n\nQue souhaitez-vous faire ?',
    timestamp: new Date(),
    suggestions: ['Demander un devis', 'Suivre un colis', 'Contacter le support', 'Voir la documentation']
  }
}

export default function ChatWidget() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Écouter l'événement d'ouverture du chat depuis d'autres composants
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true)
      setIsMinimized(false)
    }
    
    window.addEventListener('openChat', handleOpenChat)
    return () => window.removeEventListener('openChat', handleOpenChat)
  }, [])

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      container.scrollTop = container.scrollHeight
    }
  }

  // Force scroll to bottom immédiatement après chaque changement
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Auto-scroll quand le chat s'ouvre ou se déminimise
  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Plusieurs tentatives pour s'assurer que le scroll fonctionne
      scrollToBottom()
      setTimeout(scrollToBottom, 50)
      setTimeout(scrollToBottom, 150)
      setTimeout(scrollToBottom, 300)
    }
  }, [isOpen, isMinimized])

  // Observer les changements de taille du conteneur
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const resizeObserver = new ResizeObserver(() => {
        scrollToBottom()
      })
      
      resizeObserver.observe(container)
      
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [isOpen, isMinimized])

  const getBotResponse = async (userMessage: string): Promise<Message> => {
    try {
      const userId = session?.user?.email || 'anonymous'
      const channelId = 'widget'
      const locale = 'fr'
      const response = await nextMoveAI.processMessage(userMessage, userId, channelId, { locale })
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        suggestions: response.ctas?.map(c => c.text)
      }
    } catch (e) {
      // Fallback to previous heuristic responses
      const message = userMessage.toLowerCase()
      if (message.includes('devis') || message.includes('prix') || message.includes('tarif') || message.includes('coût')) {
        return { ...botResponses.devis, id: Date.now().toString() }
      }
      if (message.includes('suivi') || message.includes('track') || message.includes('colis') || message.includes('package')) {
        return { ...botResponses.suivi, id: Date.now().toString() }
      }
      if (message.includes('support') || message.includes('aide') || message.includes('help') || message.includes('contact')) {
        return { ...botResponses.support, id: Date.now().toString() }
      }
      if (message.includes('api') || message.includes('documentation') || message.includes('doc') || message.includes('développeur')) {
        return { ...botResponses.api, id: Date.now().toString() }
      }
      return { ...botResponses.default, id: Date.now().toString() }
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simuler le délai de réponse du bot
    setTimeout(() => {
      ;(async () => {
        const botResponse = await getBotResponse(userMessage.content)
        setMessages(prev => [...prev, botResponse])
        setIsTyping(false)
        // Force scroll après ajout du message bot
        setTimeout(scrollToBottom, 100)
      })()
    }, 1000 + Math.random() * 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    // Exécuter directement l'action sans passer par l'input
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // Simuler le délai de réponse du bot
    setTimeout(() => {
      ;(async () => {
        const botResponse = await getBotResponse(suggestion)
        setMessages(prev => [...prev, botResponse])
        setIsTyping(false)
        setTimeout(scrollToBottom, 100)
      })()
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 group"
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          !
        </div>
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Besoin d'aide ? Cliquez pour discuter !
        </div>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Assistant Logistique</h3>
              <p className="text-xs text-blue-100">En ligne • Répond en ~1min</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/80 hover:text-white transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth min-h-0">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`px-4 py-2 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm border">
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

            {/* Quick Actions */}
            <div className="flex-shrink-0 px-4 py-2 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => handleSuggestionClick('Contacter le support')}
                  className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  Support
                </button>
                <button
                  onClick={() => handleSuggestionClick('Voir la documentation API')}
                  className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                >
                  <FileText className="h-3 w-3" />
                  Docs
                </button>
                <button
                  onClick={() => handleSuggestionClick('Calculer un devis')}
                  className="flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-full transition-colors"
                >
                  💰 Devis
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
