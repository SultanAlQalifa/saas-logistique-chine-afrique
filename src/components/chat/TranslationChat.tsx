'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Languages, Volume2, Copy, Check } from 'lucide-react'

interface Message {
  id: string
  text: string
  translatedText?: string
  sender: 'user' | 'contact'
  timestamp: Date
  originalLanguage: string
  targetLanguage?: string
}

interface TranslationChatProps {
  contactName: string
  userLanguage: string
  contactLanguage: string
  onLanguageChange?: (language: string) => void
}

export default function TranslationChat({ 
  contactName, 
  userLanguage, 
  contactLanguage,
  onLanguageChange 
}: TranslationChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ]

  // Simulation de traduction automatique
  const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
    setIsTranslating(true)
    
    // Simulation d'API de traduction
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Traductions simulées pour démonstration
    const translations: { [key: string]: { [key: string]: string } } = {
      'fr': {
        'zh': '你好，我想了解运输价格。',
        'en': 'Hello, I would like to know about shipping prices.',
        'ar': 'مرحبا، أريد أن أعرف عن أسعار الشحن.',
        'es': 'Hola, me gustaría saber sobre los precios de envío.',
        'pt': 'Olá, gostaria de saber sobre os preços de envio.',
        'ru': 'Привет, я хотел бы узнать о ценах на доставку.'
      },
      'zh': {
        'fr': 'Bonjour, je voudrais connaître les prix de transport.',
        'en': 'Hello, I would like to know the shipping prices.',
        'ar': 'مرحبا، أريد أن أعرف أسعار الشحن.',
        'es': 'Hola, me gustaría conocer los precios de envío.',
        'pt': 'Olá, gostaria de conhecer os preços de envio.',
        'ru': 'Привет, я хотел бы знать цены на доставку.'
      }
    }

    setIsTranslating(false)
    
    // Retourner traduction simulée ou texte original si pas de traduction disponible
    return translations[fromLang]?.[toLang] || `[Traduit: ${text}]`
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const messageId = Date.now().toString()
    const message: Message = {
      id: messageId,
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      originalLanguage: userLanguage
    }

    // Ajouter le message original
    setMessages(prev => [...prev, message])

    // Traduire automatiquement si activé et langues différentes
    if (autoTranslate && userLanguage !== contactLanguage) {
      const translatedText = await translateText(newMessage, userLanguage, contactLanguage)
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, translatedText, targetLanguage: contactLanguage }
          : msg
      ))
    }

    setNewMessage('')
  }

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  const speakText = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'zh' ? 'zh-CN' : language
      speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getUserLanguage = () => languages.find(l => l.code === userLanguage)
  const getContactLanguage = () => languages.find(l => l.code === contactLanguage)

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {contactName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{contactName}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{getUserLanguage()?.flag} {getUserLanguage()?.name}</span>
              <span>↔</span>
              <span>{getContactLanguage()?.flag} {getContactLanguage()?.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              autoTranslate 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}
          >
            <Languages className="w-4 h-4" />
            {autoTranslate ? 'Auto-traduction ON' : 'Auto-traduction OFF'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Languages className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Commencez une conversation avec traduction automatique
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Vos messages seront automatiquement traduits en {getContactLanguage()?.name}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md space-y-2`}>
                {/* Message original */}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">{message.text}</p>
                    <div className="flex items-center gap-1 opacity-70">
                      <button
                        onClick={() => speakText(message.text, message.originalLanguage)}
                        className="hover:opacity-100 transition-opacity"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(message.text, message.id)}
                        className="hover:opacity-100 transition-opacity"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs opacity-70">
                      {languages.find(l => l.code === message.originalLanguage)?.flag}
                    </span>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Message traduit */}
                {message.translatedText && (
                  <div
                    className={`px-4 py-2 rounded-lg border-2 border-dashed ${
                      message.sender === 'user'
                        ? 'border-blue-200 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm italic">{message.translatedText}</p>
                      <div className="flex items-center gap-1 opacity-70">
                        <button
                          onClick={() => speakText(message.translatedText!, message.targetLanguage!)}
                          className="hover:opacity-100 transition-opacity"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(message.translatedText!, `${message.id}-translated`)}
                          className="hover:opacity-100 transition-opacity"
                        >
                          {copiedMessageId === `${message.id}-translated` ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Languages className="w-3 h-3 opacity-50" />
                      <span className="text-xs opacity-70">
                        {languages.find(l => l.code === message.targetLanguage)?.flag} Traduit
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isTranslating && (
          <div className="flex justify-end">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 max-w-xs">
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-sm text-blue-600">Traduction en cours...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Tapez votre message en ${getUserLanguage()?.name}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {autoTranslate && userLanguage !== contactLanguage && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Languages className="w-3 h-3" />
                  <span>Auto</span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isTranslating}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {autoTranslate && userLanguage !== contactLanguage && (
          <p className="text-xs text-gray-500 mt-2">
            💡 Votre message sera automatiquement traduit en {getContactLanguage()?.name}
          </p>
        )}
      </div>
    </div>
  )
}
