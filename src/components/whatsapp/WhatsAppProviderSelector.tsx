'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, ChevronDown, Star, Clock, Users, CheckCircle, RefreshCw, Search, Filter } from 'lucide-react'
import { ClientWhatsAppService, WhatsAppProvider } from '@/lib/whatsapp-client-service'

interface WhatsAppProviderSelectorProps {
  onProviderChange?: (provider: WhatsAppProvider) => void
}

export default function WhatsAppProviderSelector({ onProviderChange }: WhatsAppProviderSelectorProps) {
  const [providers, setProviders] = useState<WhatsAppProvider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<WhatsAppProvider | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'company' | 'super_admin'>('all')

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    setLoading(true)
    try {
      // Utiliser les données mock pour la démonstration
      const mockProviders = ClientWhatsAppService.getMockProviders()
      setProviders(mockProviders)
      
      // Sélectionner le support officiel par défaut
      const defaultProvider = mockProviders.find(p => p.type === 'super_admin')
      if (defaultProvider) {
        setSelectedProvider(defaultProvider)
        onProviderChange?.(defaultProvider)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProvider = async (provider: WhatsAppProvider) => {
    setSelectedProvider(provider)
    setIsOpen(false)
    onProviderChange?.(provider)
    
    // Enregistrer la sélection côté serveur
    try {
      await ClientWhatsAppService.selectProvider(provider.id, provider.type)
    } catch (error) {
      console.error('Erreur lors de la sélection:', error)
    }
  }

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterType === 'all' || provider.type === filterType
    
    return matchesSearch && matchesFilter
  })

  const getProviderTypeLabel = (type: string) => {
    return type === 'super_admin' ? 'Support Officiel' : 'Entreprise Partenaire'
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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">🏢 Choisir votre interlocuteur WhatsApp</h3>
          <p className="text-sm text-gray-600">Sélectionnez l'entreprise ou le support avec qui discuter</p>
        </div>
        <button
          onClick={loadProviders}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Provider sélectionné */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 text-left hover:bg-gray-100 transition-colors"
        >
          {selectedProvider ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedProvider.type === 'super_admin' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{selectedProvider.display_name}</h4>
                    {getProviderTypeBadge(selectedProvider.type)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{selectedProvider.response_time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{selectedProvider.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{selectedProvider.total_conversations} conversations</span>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Sélectionner un interlocuteur...</span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          )}
        </button>

        {/* Dropdown des providers */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {/* Filtres et recherche */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou spécialité..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Tous les types</option>
                    <option value="super_admin">Support Officiel</option>
                    <option value="company">Entreprises</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des providers */}
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <RefreshCw className="h-6 w-6 animate-spin text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Chargement...</p>
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="p-4 text-center">
                  <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Aucun interlocuteur trouvé</p>
                </div>
              ) : (
                filteredProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleSelectProvider(provider)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedProvider?.id === provider.id ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        provider.type === 'super_admin' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">{provider.display_name}</h4>
                          {getProviderTypeBadge(provider.type)}
                          {selectedProvider?.id === provider.id && (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{provider.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
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
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {provider.specialties.slice(0, 3).map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                          {provider.specialties.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{provider.specialties.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Informations du provider sélectionné */}
      {selectedProvider && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-gray-900">Informations de contact</h5>
            <span className={`px-2 py-1 text-xs rounded-full ${
              selectedProvider.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {selectedProvider.status === 'active' ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Téléphone:</span>
              <p className="font-medium text-gray-900">{selectedProvider.phone_number}</p>
            </div>
            <div>
              <span className="text-gray-600">Disponibilité:</span>
              <p className="font-medium text-gray-900">{selectedProvider.availability}</p>
            </div>
          </div>
          
          <div className="mt-3">
            <span className="text-gray-600 text-sm">Spécialités:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedProvider.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-white text-gray-700 rounded border"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
