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
  Settings,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Trash2
} from 'lucide-react'

interface Notification {
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

// Données de test étendues pour la page complète
const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'quote',
    title: 'Nouveau devis reçu',
    message: 'Vous avez reçu un devis de 450,000 FCFA pour votre demande d\'électroniques de Guangzhou vers Abidjan',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: 'high',
    actionUrl: '/dashboard/client-portal',
    metadata: { quoteId: 'quote-001', amount: 450000 }
  },
  {
    id: 'notif-002',
    type: 'package',
    title: 'Colis arrivé à destination',
    message: 'Votre colis CO-001234 est arrivé au port d\'Abidjan et prêt pour récupération',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    priority: 'medium',
    actionUrl: '/dashboard/client-portal',
    metadata: { packageId: 'CO-001234' }
  },
  {
    id: 'notif-003',
    type: 'system',
    title: 'Mise à jour système',
    message: 'Nouvelles fonctionnalités disponibles : système de notifications en temps réel',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    priority: 'low',
    actionUrl: '/dashboard'
  },
  {
    id: 'notif-004',
    type: 'quote',
    title: 'Nouvelle demande de devis',
    message: 'Marie Kouassi a publié une demande de transport pour des électroniques (Urgence: Élevée)',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
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
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
    priority: 'medium',
    actionUrl: '/dashboard/finances/payments',
    metadata: { packageId: 'CO-001235', amount: 750000 }
  },
  {
    id: 'notif-006',
    type: 'package',
    title: 'Colis en transit',
    message: 'Votre colis CO-001236 a quitté le port de Guangzhou et est en route vers Abidjan',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
    priority: 'low',
    actionUrl: '/dashboard/client-portal',
    metadata: { packageId: 'CO-001236' }
  },
  {
    id: 'notif-007',
    type: 'user',
    title: 'Nouveau client inscrit',
    message: 'Jean Baptiste Traoré s\'est inscrit sur la plateforme',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: false,
    priority: 'low',
    actionUrl: '/dashboard/users',
    metadata: { userId: 'jean.traore@example.com' }
  },
  {
    id: 'notif-008',
    type: 'quote',
    title: 'Devis expiré',
    message: 'Votre devis pour la demande #REQ-001 expire dans 24 heures',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: false,
    priority: 'high',
    actionUrl: '/dashboard/quote-requests',
    metadata: { quoteId: 'quote-008' }
  }
]

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'quote' | 'package' | 'system' | 'payment' | 'user'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  // Filtrer les notifications selon le rôle utilisateur et les filtres
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

    // Filtrer par type
    if (filter !== 'all' && filter !== 'unread') {
      filtered = filtered.filter(n => n.type === filter)
    }

    // Filtrer par statut lu/non lu
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read)
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
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
    setSelectedNotifications(prev => prev.filter(id => id !== notificationId))
  }

  const deleteSelected = () => {
    setNotifications(prev => 
      prev.filter(n => !selectedNotifications.includes(n.id))
    )
    setSelectedNotifications([])
  }

  const markSelectedAsRead = () => {
    setNotifications(prev => 
      prev.map(n => 
        selectedNotifications.includes(n.id) ? { ...n, read: true } : n
      )
    )
    setSelectedNotifications([])
  }

  const toggleSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const selectAll = () => {
    const filtered = getFilteredNotifications()
    setSelectedNotifications(filtered.map(n => n.id))
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Bell className="h-8 w-8" />
              Centre de Notifications
            </h1>
            <p className="text-blue-100 mt-2">
              Gérez toutes vos notifications en un seul endroit
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{notifications.length}</div>
            <div className="text-blue-100">Total</div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Bell className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{unreadCount}</div>
              <div className="text-sm text-gray-600">Non lues</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.type === 'quote').length}
              </div>
              <div className="text-sm text-gray-600">Devis</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.type === 'package').length}
              </div>
              <div className="text-sm text-gray-600">Colis</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.type === 'payment').length}
              </div>
              <div className="text-sm text-gray-600">Paiements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher des notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            {['all', 'unread', 'quote', 'package', 'system', 'payment', 'user'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === filterType 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filterType === 'all' ? 'Toutes' :
                 filterType === 'unread' ? 'Non lues' :
                 filterType === 'quote' ? 'Devis' :
                 filterType === 'package' ? 'Colis' :
                 filterType === 'system' ? 'Système' :
                 filterType === 'payment' ? 'Paiements' :
                 'Utilisateurs'}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {selectedNotifications.length > 0 && (
              <>
                <button
                  onClick={markSelectedAsRead}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Marquer lues ({selectedNotifications.length})
                </button>
                <button
                  onClick={deleteSelected}
                  className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer ({selectedNotifications.length})
                </button>
              </>
            )}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Tout marquer lu
              </button>
            )}
            <button
              onClick={selectAll}
              className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Tout sélectionner
            </button>
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="bg-white rounded-lg border border-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
            <p>Aucune notification ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleSelection(notification.id)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {notification.priority === 'high' ? 'Élevée' :
                             notification.priority === 'medium' ? 'Moyenne' : 'Faible'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {notification.actionUrl && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id)
                              window.location.href = notification.actionUrl!
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            title="Voir détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                            title="Marquer comme lu"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
