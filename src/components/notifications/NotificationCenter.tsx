'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Bell, 
  X, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Clock,
  User,
  Settings
} from 'lucide-react'

export interface Notification {
  id: string
  type: 'quote' | 'package' | 'system' | 'payment' | 'user'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
  metadata?: {
    userId?: string
    packageId?: string
    quoteId?: string
    amount?: number
  }
}

// Données de test pour les notifications
const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'quote',
    title: 'Nouveau devis reçu',
    message: 'Vous avez reçu un devis de 450,000 FCFA pour votre demande d\'électroniques',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    priority: 'high',
    actionUrl: '/dashboard/client-portal',
    metadata: { quoteId: 'quote-001', amount: 450000 }
  },
  {
    id: 'notif-002',
    type: 'package',
    title: 'Colis arrivé',
    message: 'Votre colis CO-001234 est arrivé à destination et prêt pour récupération',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: 'medium',
    actionUrl: '/dashboard/client-portal',
    metadata: { packageId: 'CO-001234' }
  },
  {
    id: 'notif-003',
    type: 'system',
    title: 'Mise à jour système',
    message: 'Nouvelles fonctionnalités disponibles dans le portail client',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: 'low',
    actionUrl: '/dashboard'
  },
  {
    id: 'notif-004',
    type: 'quote',
    title: 'Nouvelle demande de devis',
    message: 'Marie Kouassi a publié une demande de transport pour des électroniques',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    read: false,
    priority: 'medium',
    actionUrl: '/dashboard/quote-requests',
    metadata: { userId: 'marie.kouassi@example.com' }
  },
  {
    id: 'notif-005',
    type: 'payment',
    title: 'Paiement confirmé',
    message: 'Paiement de 750,000 FCFA confirmé pour le colis CO-001235',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: true,
    priority: 'medium',
    actionUrl: '/dashboard/finances/payments',
    metadata: { packageId: 'CO-001235', amount: 750000 }
  }
]

export default function NotificationCenter() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // Filtrer les notifications selon le rôle utilisateur
  const getFilteredNotifications = () => {
    let filtered = notifications

    // Filtrer par rôle
    if (session?.user?.role === 'CLIENT') {
      filtered = filtered.filter(n => 
        n.type === 'quote' || n.type === 'package' || n.type === 'system' || n.type === 'payment'
      )
    } else if (session?.user?.role === 'ADMIN') {
      filtered = filtered.filter(n => 
        n.type === 'quote' || n.type === 'user' || n.type === 'system' || n.type === 'payment'
      )
    }

    // Filtrer par statut lu/non lu
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read)
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    )
  }

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'high' ? 'text-red-500' : 
                     priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
    
    switch (type) {
      case 'quote':
        return <DollarSign className={`h-5 w-5 ${iconClass}`} />
      case 'package':
        return <Package className={`h-5 w-5 ${iconClass}`} />
      case 'payment':
        return <CheckCircle className={`h-5 w-5 ${iconClass}`} />
      case 'user':
        return <User className={`h-5 w-5 ${iconClass}`} />
      case 'system':
        return <Settings className={`h-5 w-5 ${iconClass}`} />
      default:
        return <Info className={`h-5 w-5 ${iconClass}`} />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return timestamp.toLocaleDateString('fr-FR')
  }

  const filteredNotifications = getFilteredNotifications()

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notifications */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Filtres */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Toutes ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter === 'unread' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Non lues ({unreadCount})
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    Tout marquer lu
                  </button>
                )}
              </div>
            </div>

            {/* Liste des notifications */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                                title="Marquer comme lu"
                              >
                                ✓
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-red-600 text-xs"
                              title="Supprimer"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        {notification.actionUrl && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id)
                              setIsOpen(false)
                              // Navigation vers l'URL d'action avec gestion des paramètres
                              if (notification.type === 'quote' && notification.metadata?.quoteId) {
                                // Rediriger vers le portail client avec l'onglet devis
                                window.location.href = `/dashboard/client-portal?tab=quotes&quoteId=${notification.metadata.quoteId}`
                              } else if (notification.type === 'package' && notification.metadata?.packageId) {
                                // Rediriger vers le portail client avec l'onglet colis
                                window.location.href = `/dashboard/client-portal?tab=packages&packageId=${notification.metadata.packageId}`
                              } else {
                                window.location.href = notification.actionUrl!
                              }
                            }}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Voir détails →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    window.location.href = '/dashboard/communication/notifications'
                  }}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Voir toutes les notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
