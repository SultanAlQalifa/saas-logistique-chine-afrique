'use client'

import { MessageSquare, Bell, Users, Mail, Send, Eye, TrendingUp, Clock, CheckCircle, AlertCircle, Star, MessageCircle, Filter, Search, Plus, BarChart3, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/ui/back-button'

// Mock data pour les statistiques
const communicationStats = {
  notifications: {
    total: 1247,
    sent: 1189,
    pending: 58,
    failed: 12,
    openRate: 87.3
  },
  messages: {
    campaigns: 23,
    sent: 5420,
    delivered: 5284,
    opened: 4127,
    clicked: 892
  },
  reviews: {
    total: 342,
    average: 4.6,
    recent: 28,
    positive: 298,
    negative: 44
  }
}

// Mock data pour les activités récentes
const recentActivities = [
  {
    id: 1,
    type: 'notification',
    title: 'Notification de livraison envoyée',
    description: 'Colis #COL-2024-001 livré avec succès',
    time: 'Il y a 5 minutes',
    status: 'success',
    icon: Bell
  },
  {
    id: 2,
    type: 'message',
    title: 'Campagne SMS promotionnelle',
    description: '1,250 messages envoyés - Taux d\'ouverture: 92%',
    time: 'Il y a 2 heures',
    status: 'success',
    icon: MessageSquare
  },
  {
    id: 3,
    type: 'review',
    title: 'Nouvel avis client',
    description: 'Avis 5 étoiles de Marie Kouassi',
    time: 'Il y a 4 heures',
    status: 'info',
    icon: Star
  },
  {
    id: 4,
    type: 'notification',
    title: 'Alerte de retard',
    description: 'Colis #COL-2024-045 en retard - Client notifié',
    time: 'Il y a 6 heures',
    status: 'warning',
    icon: AlertCircle
  }
]

export default function CommunicationPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const router = useRouter()

  const handleNewCampaign = () => {
    router.push('/dashboard/communication/group-messages')
  }

  const handleUrgentNotification = () => {
    router.push('/dashboard/communication/notifications')
  }

  const handleDetailedReport = () => {
    // Générer et afficher le rapport
    const data = {
      period: selectedPeriod,
      notifications: communicationStats.notifications,
      groupMessages: communicationStats.messages,
      reviews: communicationStats.reviews,
      performance: { rate: 92.4 },
      generatedAt: new Date().toISOString(),
      summary: {
        totalMessages: communicationStats.notifications.total + communicationStats.messages.sent,
        successRate: Math.round(((communicationStats.notifications.sent + communicationStats.messages.delivered) / (communicationStats.notifications.total + communicationStats.messages.sent)) * 100),
        avgRating: communicationStats.reviews.average
      }
    }
    
    setReportData(data)
    setShowReportModal(true)
  }

  const downloadReport = () => {
    if (!reportData) return
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-communication-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Bouton retour */}
      <BackButton href="/dashboard" label="Retour au dashboard" />
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              📢 Communication
            </h1>
            <p className="text-cyan-100 text-lg">
              Gérez vos communications et notifications en temps réel
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{communicationStats.notifications.total + communicationStats.messages.sent}</div>
            <div className="text-cyan-200 text-sm">Messages envoyés ce mois</div>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">📨 Notifications</p>
              <p className="text-2xl font-bold text-blue-900">{communicationStats.notifications.total}</p>
              <p className="text-blue-700 text-sm">Taux d'ouverture: {communicationStats.notifications.openRate}%</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">💬 Messages Groupés</p>
              <p className="text-2xl font-bold text-green-900">{communicationStats.messages.campaigns}</p>
              <p className="text-green-700 text-sm">{communicationStats.messages.sent} envoyés</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">⭐ Avis Clients</p>
              <p className="text-2xl font-bold text-purple-900">{communicationStats.reviews.total}</p>
              <p className="text-purple-700 text-sm">Moyenne: {communicationStats.reviews.average}/5</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">📈 Performance</p>
              <p className="text-2xl font-bold text-amber-900">92.4%</p>
              <p className="text-amber-700 text-sm">Taux de livraison</p>
            </div>
            <div className="p-3 bg-amber-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Modules de communication */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/communication/notifications" className="group">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200 transform group-hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-600 font-medium">{communicationStats.notifications.pending} en attente</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">🔔 Notifications</h3>
            <p className="text-blue-700 mb-4">Gérer les notifications système et alertes automatiques</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-600">Envoyées: {communicationStats.notifications.sent}</span>
              <span className="text-blue-600">Échecs: {communicationStats.notifications.failed}</span>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/communication/group-messages" className="group">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200 transform group-hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600 font-medium">{communicationStats.messages.clicked} clics</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">📧 Messages Groupés</h3>
            <p className="text-green-700 mb-4">Envoyer des messages en masse par SMS, email ou WhatsApp</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">Campagnes: {communicationStats.messages.campaigns}</span>
              <span className="text-green-600">Ouverts: {communicationStats.messages.opened}</span>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/communication/customer-reviews" className="group">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-200 transform group-hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500 rounded-lg group-hover:bg-purple-600 transition-colors">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-600 font-medium">{communicationStats.reviews.recent} récents</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">⭐ Avis Clients</h3>
            <p className="text-purple-700 mb-4">Consulter et gérer les retours et évaluations clients</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-600">Positifs: {communicationStats.reviews.positive}</span>
              <span className="text-purple-600">Négatifs: {communicationStats.reviews.negative}</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Activités récentes */}
      <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-secondary-900 flex items-center">
              🕐 Activités Récentes
            </h2>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-sm border border-secondary-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500"
              >
                <option value="1d">Dernières 24h</option>
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon
              const statusColors = {
                success: 'bg-green-100 text-green-800 border-green-200',
                warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                info: 'bg-blue-100 text-blue-800 border-blue-200',
                error: 'bg-red-100 text-red-800 border-red-200'
              }
              
              return (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`p-2 rounded-lg ${statusColors[activity.status as keyof typeof statusColors]}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-900">{activity.title}</h4>
                    <p className="text-sm text-secondary-600">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-secondary-500">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 text-center">
            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center mx-auto">
              <Eye className="h-4 w-4 mr-2" />
              Voir toutes les activités
            </button>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
          ⚡ Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleNewCampaign}
            className="flex items-center justify-center space-x-2 bg-white p-4 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors hover:shadow-md"
          >
            <Plus className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-indigo-900">Nouvelle campagne</span>
          </button>
          <button 
            onClick={handleUrgentNotification}
            className="flex items-center justify-center space-x-2 bg-white p-4 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors hover:shadow-md"
          >
            <Send className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-indigo-900">Notification urgente</span>
          </button>
          <button 
            onClick={handleDetailedReport}
            className="flex items-center justify-center space-x-2 bg-white p-4 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors hover:shadow-md"
          >
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-indigo-900">Rapport détaillé</span>
          </button>
        </div>
      </div>

      {/* Modal Rapport Détaillé */}
      {showReportModal && reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  📊 Rapport Détaillé Communication
                </h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Période: {selectedPeriod} • Généré le {new Date(reportData.generatedAt).toLocaleString('fr-FR')}
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Résumé Exécutif */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">📈 Résumé Exécutif</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{reportData.summary.totalMessages}</div>
                    <div className="text-sm text-blue-700">Messages Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{reportData.summary.successRate}%</div>
                    <div className="text-sm text-green-700">Taux de Succès</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{reportData.summary.avgRating}/5</div>
                    <div className="text-sm text-yellow-700">Note Moyenne</div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  🔔 Notifications
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{reportData.notifications.total}</div>
                    <div className="text-sm text-blue-700">Total</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{reportData.notifications.sent}</div>
                    <div className="text-sm text-green-700">Envoyées</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{reportData.notifications.pending}</div>
                    <div className="text-sm text-yellow-700">En attente</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{reportData.notifications.failed}</div>
                    <div className="text-sm text-red-700">Échecs</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Taux d'ouverture: <span className="font-semibold text-gray-900">{reportData.notifications.openRate}%</span></div>
                </div>
              </div>

              {/* Messages Groupés */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  📧 Messages Groupés
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{reportData.groupMessages.campaigns}</div>
                    <div className="text-sm text-purple-700">Campagnes</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{reportData.groupMessages.sent}</div>
                    <div className="text-sm text-blue-700">Envoyés</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{reportData.groupMessages.delivered}</div>
                    <div className="text-sm text-green-700">Livrés</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{reportData.groupMessages.clicked}</div>
                    <div className="text-sm text-orange-700">Clics</div>
                  </div>
                </div>
              </div>

              {/* Avis Clients */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  ⭐ Avis Clients
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{reportData.reviews.total}</div>
                    <div className="text-sm text-yellow-700">Total</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{reportData.reviews.positive}</div>
                    <div className="text-sm text-green-700">Positifs</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{reportData.reviews.negative}</div>
                    <div className="text-sm text-red-700">Négatifs</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{reportData.reviews.responseRate}%</div>
                    <div className="text-sm text-blue-700">Taux Réponse</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Rapport généré automatiquement • Données en temps réel
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Télécharger JSON</span>
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
