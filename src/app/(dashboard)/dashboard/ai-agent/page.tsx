'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import AIAgentInterface from '@/components/ai-agent/AIAgentInterface'
import { Bot, Zap, MessageCircle, Clock, Users, BarChart3 } from 'lucide-react'

export default function AIAgentPage() {
  const { data: session } = useSession()
  const [conversationStats, setConversationStats] = useState({
    totalMessages: 0,
    avgResponseTime: 0,
    satisfaction: 0
  })

  const handleConversationUpdate = (messages: any[]) => {
    setConversationStats({
      totalMessages: messages.length,
      avgResponseTime: 2.3,
      satisfaction: 4.8
    })
  }

  const userProfile = {
    name: session?.user?.name || 'Utilisateur',
    company: session?.user?.role === 'ADMIN' ? 'Entreprise Partenaire' : 'NextMove Cargo',
    country: 'Sénégal',
    language: 'fr',
    timezone: 'Africa/Dakar',
    previousInteractions: 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🤖 Agent IA NextMove</h1>
              <p className="text-gray-600">Assistant intelligent spécialisé en logistique Chine-Afrique</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Messages échangés</p>
                  <p className="text-xl font-bold text-gray-900">{conversationStats.totalMessages}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temps de réponse</p>
                  <p className="text-xl font-bold text-gray-900">{conversationStats.avgResponseTime}s</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                  <p className="text-xl font-bold text-gray-900">{conversationStats.satisfaction}/5</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disponibilité</p>
                  <p className="text-xl font-bold text-gray-900">24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Capacités de l'Agent IA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Support Client 24/7</h4>
                  <p className="text-sm text-gray-600">Réponses instantanées aux questions sur vos expéditions</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Devis Automatiques</h4>
                  <p className="text-sm text-gray-600">Calculs de prix en temps réel selon vos besoins</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Suivi Intelligent</h4>
                  <p className="text-sm text-gray-600">Informations détaillées sur vos colis en transit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agent Interface */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div style={{ height: '600px' }}>
            <AIAgentInterface
              userId={session?.user?.id || 'anonymous'}
              userProfile={userProfile}
              onConversationUpdate={handleConversationUpdate}
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">💡 Comment utiliser l'Agent IA ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Questions fréquentes :</h4>
              <ul className="space-y-1 text-sm opacity-90">
                <li>• "Quel est le prix pour envoyer 10kg au Sénégal ?"</li>
                <li>• "Combien de temps pour une livraison maritime ?"</li>
                <li>• "Comment suivre mon colis NMC123456 ?"</li>
                <li>• "Quels documents sont nécessaires ?"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Fonctionnalités avancées :</h4>
              <ul className="space-y-1 text-sm opacity-90">
                <li>• Calculs de tarifs personnalisés</li>
                <li>• Suivi en temps réel des expéditions</li>
                <li>• Conseils sur la documentation</li>
                <li>• Transfert vers un conseiller humain</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
