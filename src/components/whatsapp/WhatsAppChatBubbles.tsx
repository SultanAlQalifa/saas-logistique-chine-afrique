'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, ArrowRight, Zap, Clock, Star, Users, X, Check, RefreshCw } from 'lucide-react'
import { WhatsAppRoutingService, ConversationRouting } from '@/lib/whatsapp-routing-service'
import { ClientWhatsAppService, WhatsAppProvider } from '@/lib/whatsapp-client-service'

interface WhatsAppChatBubblesProps {
  conversationId?: string
  onProviderChange?: (provider: WhatsAppProvider) => void
  currentMessage?: string
}

export default function WhatsAppChatBubbles({ conversationId, onProviderChange, currentMessage }: WhatsAppChatBubblesProps) {
  const [showRoutingSuggestion, setShowRoutingSuggestion] = useState(false)
  const [showProviderSelector, setShowProviderSelector] = useState(false)
  const [suggestedProvider, setSuggestedProvider] = useState<{
    provider: string
    type: 'company' | 'super_admin'
    reason: string
    confidence: number
  } | null>(null)
  const [providers, setProviders] = useState<WhatsAppProvider[]>([])
  const [currentRouting, setCurrentRouting] = useState<ConversationRouting | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProviders()
    if (currentMessage) {
      checkForRoutingSuggestion(currentMessage)
    }
  }, [currentMessage])

  const loadProviders = async () => {
    const mockProviders = ClientWhatsAppService.getMockProviders()
    setProviders(mockProviders)
  }

  const checkForRoutingSuggestion = async (message: string) => {
    if (!conversationId) return

    try {
      const suggestion = await WhatsAppRoutingService.suggestProviderChange(conversationId, message)
      
      if (suggestion.shouldSuggest && suggestion.confidence > 0.7) {
        setSuggestedProvider({
          provider: suggestion.suggestedProvider!,
          type: suggestion.suggestedType!,
          reason: suggestion.reason!,
          confidence: suggestion.confidence
        })
        setShowRoutingSuggestion(true)
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du routage:', error)
    }
  }

  const handleAcceptSuggestion = async () => {
    if (!suggestedProvider || !conversationId) return

    setLoading(true)
    try {
      const result = await WhatsAppRoutingService.transferConversation(
        conversationId,
        suggestedProvider.provider,
        suggestedProvider.type,
        `Transfert automatique: ${suggestedProvider.reason}`,
        'automatic'
      )

      if (result.success) {
        const provider = providers.find(p => p.id === suggestedProvider.provider)
        if (provider) {
          onProviderChange?.(provider)
        }
        setShowRoutingSuggestion(false)
        setSuggestedProvider(null)
      }
    } catch (error) {
      console.error('Erreur lors du transfert:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManualProviderChange = async (provider: WhatsAppProvider) => {
    if (!conversationId) return

    setLoading(true)
    try {
      const result = await WhatsAppRoutingService.transferConversation(
        conversationId,
        provider.id,
        provider.type,
        'Changement manuel par le client',
        'manual'
      )

      if (result.success) {
        onProviderChange?.(provider)
        setShowProviderSelector(false)
      }
    } catch (error) {
      console.error('Erreur lors du changement:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProviderInfo = (providerId: string) => {
    return providers.find(p => p.id === providerId)
  }

  const getProviderTypeBadge = (type: string) => {
    if (type === 'super_admin') {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
          Support Officiel
        </span>
      )
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        Entreprise
      </span>
    )
  }

  return (
    <div className="space-y-3">
      {/* Bulle de suggestion de routage automatique */}
      {showRoutingSuggestion && suggestedProvider && (
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 max-w-md mx-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
                <Zap className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-orange-900 mb-1">
                  🤖 Suggestion de transfert automatique
                </h4>
                <p className="text-sm text-orange-800 mb-2">
                  {suggestedProvider.reason}
                </p>
                
                {/* Informations du provider suggéré */}
                {(() => {
                  const providerInfo = getProviderInfo(suggestedProvider.provider)
                  return providerInfo ? (
                    <div className="bg-white rounded-lg p-3 mb-3 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          providerInfo.type === 'super_admin' 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          <MessageCircle className="h-3 w-3" />
                        </div>
                        <span className="font-medium text-gray-900">{providerInfo.display_name}</span>
                        {getProviderTypeBadge(providerInfo.type)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{providerInfo.response_time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{providerInfo.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{providerInfo.description}</p>
                    </div>
                  ) : null
                })()}

                <div className="flex gap-2">
                  <button
                    onClick={handleAcceptSuggestion}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    Accepter
                  </button>
                  <button
                    onClick={() => setShowRoutingSuggestion(false)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Ignorer
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-orange-700">
                  Confiance: {Math.round(suggestedProvider.confidence * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulle de changement manuel */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 max-w-sm mx-4 shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Changer d'interlocuteur</span>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              Vous pouvez choisir un autre interlocuteur selon vos besoins
            </p>
            <button
              onClick={() => setShowProviderSelector(!showProviderSelector)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Users className="h-3 w-3" />
              {showProviderSelector ? 'Masquer' : 'Choisir'}
            </button>
          </div>
        </div>
      </div>

      {/* Sélecteur de providers en bulles */}
      {showProviderSelector && (
        <div className="space-y-2">
          {providers.map((provider) => (
            <div key={provider.id} className="flex justify-center">
              <button
                onClick={() => handleManualProviderChange(provider)}
                disabled={loading}
                className="bg-white border border-gray-200 rounded-lg p-3 max-w-md mx-4 shadow-sm hover:shadow-md transition-all hover:border-blue-300 disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    provider.type === 'super_admin' 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{provider.display_name}</span>
                      {getProviderTypeBadge(provider.type)}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{provider.response_time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{provider.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{provider.total_conversations}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-2">{provider.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {provider.specialties.slice(0, 2).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                      {provider.specialties.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{provider.specialties.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message de transfert en cours */}
      {loading && (
        <div className="flex justify-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-sm mx-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Transfert en cours...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
