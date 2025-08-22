'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Package, 
  FileText, 
  CreditCard, 
  Phone,
  Download,
  ExternalLink,
  MessageSquare
} from 'lucide-react'
import { NextMoveAIEngine } from '@/lib/ai-assistant-engine'
import { AIContext, AIResponse } from '@/lib/ai-assistant-config'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: Array<{
    type: string
    label: string
    data: any
  }>
}

interface NextMoveAIChatProps {
  context?: AIContext
  className?: string
  onActionClick?: (action: any) => void
}

export default function NextMoveAIChat({ 
  context, 
  className = "",
  onActionClick 
}: NextMoveAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiEngine, setAiEngine] = useState<NextMoveAIEngine | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Contexte par défaut si non fourni
  const defaultContext: AIContext = {
    user: {
      name: "Utilisateur",
      tenant: "demo",
      locale: "fr",
      role: "CLIENT"
    },
    recent_shipments: [],
    recent_invoices: [],
    active_features: ["pod", "split_payments", "notifications_multichannel"]
  }

  const currentContext = context || defaultContext

  useEffect(() => {
    // Initialiser le moteur IA
    const engine = new NextMoveAIEngine(currentContext)
    setAiEngine(engine)

    // Message de bienvenue
    const welcomeMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'assistant',
      content: `Bonjour ${currentContext.user.name} 👋\n\nJe suis NextMove AI, votre assistant logistique Chine ↔ Afrique.\n\nJe peux vous aider avec :\n• 📦 Suivi de colis et POD\n• 💰 Factures et paiements\n• 📋 Devis et tarification\n• 📊 Performance marketing\n• 🎧 Support client\n\nQue puis-je faire pour vous ?`,
      timestamp: new Date(),
      actions: [
        { type: "track", label: "Suivre un colis", data: {} },
        { type: "quote", label: "Créer un devis", data: {} },
        { type: "invoices", label: "Mes factures", data: {} }
      ]
    }

    setMessages([welcomeMessage])
  }, [currentContext])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !aiEngine || isLoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Traitement par le moteur IA
      const response: AIResponse = await aiEngine.processMessage(userMessage.content)
      
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        type: 'assistant',
        content: response.text,
        timestamp: new Date(),
        actions: response.actions
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        type: 'assistant',
        content: "Désolé, j'ai rencontré une erreur technique. Un conseiller peut vous aider si nécessaire.",
        timestamp: new Date(),
        actions: [
          { type: "escalate", label: "Parler à un humain", data: { context: userMessage.content } }
        ]
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleActionClick = (action: any) => {
    if (onActionClick) {
      onActionClick(action)
    } else {
      // Exécuter directement les actions sans passer par l'input
      let messageContent = ''
      
      switch (action.type) {
        case 'track':
          messageContent = action.data?.tracking_code ? `Suivre mon colis ${action.data.tracking_code}` : 'Suivre mon colis'
          break
        case 'quote':
          messageContent = 'Créer un devis'
          break
        case 'invoices':
          messageContent = 'Mes factures'
          break
        case 'pod':
          messageContent = `POD ${action.data?.tracking_code || ''}`
          break
        case 'contact':
          messageContent = 'Contacter le support'
          break
        case 'documentation':
          messageContent = 'Voir la documentation'
          break
        default:
          messageContent = action.label || 'Action'
      }

      // Envoyer directement le message
      if (messageContent) {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: messageContent,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, userMessage])
        setInputValue(messageContent)
        setTimeout(() => handleSendMessage(), 100)
      }
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'track':
      case 'pod':
        return <Package className="h-3 w-3" />
      case 'quote':
      case 'invoices':
        return <FileText className="h-3 w-3" />
      case 'pay':
      case 'split_payment':
        return <CreditCard className="h-3 w-3" />
      case 'escalate':
      case 'support':
        return <Phone className="h-3 w-3" />
      case 'download':
        return <Download className="h-3 w-3" />
      case 'external':
        return <ExternalLink className="h-3 w-3" />
      default:
        return <MessageSquare className="h-3 w-3" />
    }
  }

  const formatMessageContent = (content: string) => {
    // Formatage simple du markdown
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />')
  }

  return (
    <Card className={`flex flex-col h-96 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="h-4 w-4 text-blue-600" />
          NextMove AI Assistant
          <Badge variant="outline" className="ml-auto text-xs">
            {currentContext.user.locale.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 text-blue-600" />
                  </div>
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: formatMessageContent(message.content) 
                    }} 
                  />
                </div>
                
                {/* Actions */}
                {message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleActionClick(action)}
                        className="text-xs h-7 px-2"
                      >
                        {getActionIcon(action.type)}
                        <span className="ml-1">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="flex-shrink-0 order-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
                </div>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-600">
                NextMove AI réfléchit...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Suggestions rapides */}
          <div className="flex flex-wrap gap-1 mt-2">
            {['Suivi colis', 'Créer devis', 'Mes factures', 'Support'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInputValue(suggestion)
                  inputRef.current?.focus()
                }}
                className="text-xs h-6 px-2 text-gray-500 hover:text-gray-700"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
