'use client'

import { useState } from 'react'
import { 
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Users,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Settings,
  Volume2,
  VolumeX,
  Calendar,
  Target
} from 'lucide-react'
import Link from 'next/link'
import BackButton from '@/components/ui/back-button'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  channel: 'email' | 'sms' | 'push' | 'whatsapp'
  recipients: {
    total: number
    segments: string[]
  }
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  scheduledAt?: string
  sentAt?: string
  createdAt: string
  createdBy: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface NotificationTemplate {
  id: string
  name: string
  category: 'shipment' | 'payment' | 'system' | 'marketing'
  channels: ('email' | 'sms' | 'push' | 'whatsapp')[]
  variables: string[]
  isActive: boolean
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Colis arrivé en Chine',
    message: 'Votre colis #{tracking} est arrivé à notre entrepôt en Chine et sera traité sous 24h.',
    type: 'info',
    channel: 'sms',
    recipients: { total: 156, segments: ['Expéditeurs actifs'] },
    status: 'sent',
    sentAt: '2024-01-20T10:30:00',
    createdAt: '2024-01-20T09:00:00',
    createdBy: 'Système',
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Promotion Flash Weekend',
    message: 'Profitez de -25% sur tous vos envois ce weekend ! Code: WEEKEND25',
    type: 'success',
    channel: 'email',
    recipients: { total: 2340, segments: ['Tous les clients', 'Prospects'] },
    status: 'scheduled',
    scheduledAt: '2024-01-22T08:00:00',
    createdAt: '2024-01-19T14:00:00',
    createdBy: 'Marketing',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Maintenance programmée',
    message: 'Notre plateforme sera en maintenance le 25/01 de 2h à 4h du matin.',
    type: 'warning',
    channel: 'push',
    recipients: { total: 5670, segments: ['Tous les utilisateurs'] },
    status: 'draft',
    createdAt: '2024-01-18T16:00:00',
    createdBy: 'Admin',
    priority: 'urgent'
  }
]

const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Confirmation d\'expédition',
    category: 'shipment',
    channels: ['email', 'sms'],
    variables: ['tracking_number', 'destination', 'estimated_delivery'],
    isActive: true
  },
  {
    id: '2',
    name: 'Rappel de paiement',
    category: 'payment',
    channels: ['email', 'whatsapp'],
    variables: ['invoice_number', 'amount', 'due_date'],
    isActive: true
  },
  {
    id: '3',
    name: 'Alerte système',
    category: 'system',
    channels: ['push', 'email'],
    variables: ['alert_type', 'description', 'action_required'],
    isActive: false
  }
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates' | 'settings'>('notifications')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [channelFilter, setChannelFilter] = useState<string>('all')

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter
    const matchesChannel = channelFilter === 'all' || notification.channel === channelFilter
    
    return matchesSearch && matchesStatus && matchesChannel
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'sms': return <MessageSquare className="h-4 w-4" />
      case 'push': return <Bell className="h-4 w-4" />
      case 'whatsapp': return <Phone className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'shipment': return 'bg-blue-100 text-blue-800'
      case 'payment': return 'bg-green-100 text-green-800'
      case 'system': return 'bg-red-100 text-red-800'
      case 'marketing': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <BackButton href="/dashboard/communication" label="Retour à Communication" />
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Notifications</h1>
          <p className="text-secondary-600 mt-1">
            Gérez vos notifications automatiques et manuelles
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/communication/notifications/create"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle notification
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Envoyées aujourd'hui</p>
              <p className="text-2xl font-bold text-secondary-900">1,247</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Send className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Programmées</p>
              <p className="text-2xl font-bold text-secondary-900">23</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Taux de livraison</p>
              <p className="text-2xl font-bold text-secondary-900">98.5%</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Échecs</p>
              <p className="text-2xl font-bold text-secondary-900">18</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg border border-secondary-200">
        <div className="border-b border-secondary-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700'
              }`}
            >
              Paramètres
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'notifications' && (
            <>
              {/* Filtres */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par titre ou message..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="sent">Envoyées</option>
                  <option value="scheduled">Programmées</option>
                  <option value="draft">Brouillons</option>
                  <option value="failed">Échecs</option>
                </select>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tous les canaux</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              {/* Liste des notifications */}
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className="bg-white border border-secondary-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                          {getChannelIcon(notification.channel)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-secondary-900">{notification.title}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                              {notification.priority === 'urgent' ? 'Urgent' :
                               notification.priority === 'high' ? 'Élevée' :
                               notification.priority === 'medium' ? 'Moyenne' : 'Faible'}
                            </span>
                          </div>
                          <p className="text-secondary-600 mb-3">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-secondary-500">
                            <span>Par {notification.createdBy}</span>
                            <span>•</span>
                            <span>{notification.recipients.total} destinataires</span>
                            <span>•</span>
                            <span>{new Date(notification.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                          {notification.status === 'sent' ? 'Envoyée' :
                           notification.status === 'scheduled' ? 'Programmée' :
                           notification.status === 'draft' ? 'Brouillon' : 'Échec'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button className="p-2 text-secondary-400 hover:text-secondary-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-secondary-400 hover:text-secondary-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {notification.scheduledAt && (
                      <div className="flex items-center text-sm text-secondary-500 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        Programmée pour le {new Date(notification.scheduledAt).toLocaleString('fr-FR')}
                      </div>
                    )}

                    {notification.sentAt && (
                      <div className="flex items-center text-sm text-green-600 mb-2">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Envoyée le {new Date(notification.sentAt).toLocaleString('fr-FR')}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-secondary-500">
                        Segments: {notification.recipients.segments.join(', ')}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-secondary-500 capitalize">{notification.channel}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                          {notification.type === 'info' ? 'Info' :
                           notification.type === 'success' ? 'Succès' :
                           notification.type === 'warning' ? 'Attention' : 'Erreur'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="mx-auto h-12 w-12 text-secondary-400" />
                    <h3 className="mt-2 text-sm font-medium text-secondary-900">Aucune notification trouvée</h3>
                    <p className="mt-1 text-sm text-secondary-500">
                      Aucune notification ne correspond à vos critères.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              {mockTemplates.map((template) => (
                <div key={template.id} className="bg-white border border-secondary-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-secondary-900">{template.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}>
                        {template.category === 'shipment' ? 'Expédition' :
                         template.category === 'payment' ? 'Paiement' :
                         template.category === 'system' ? 'Système' : 'Marketing'}
                      </span>
                      <div className="flex items-center">
                        {template.isActive ? (
                          <Volume2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <VolumeX className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`ml-1 text-sm ${template.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {template.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-secondary-400 hover:text-secondary-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-secondary-600 mb-2">Canaux supportés</p>
                      <div className="flex items-center space-x-2">
                        {template.channels.map((channel) => (
                          <div key={channel} className="flex items-center px-2 py-1 bg-secondary-100 rounded text-sm">
                            {getChannelIcon(channel)}
                            <span className="ml-1 capitalize">{channel}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-600 mb-2">Variables disponibles</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable) => (
                          <span key={variable} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {'{' + variable + '}'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white border border-secondary-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Paramètres généraux</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Notifications push activées</p>
                      <p className="text-sm text-secondary-500">Autoriser l'envoi de notifications push</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900">Limite quotidienne SMS</p>
                      <p className="text-sm text-secondary-500">Nombre maximum de SMS par jour</p>
                    </div>
                    <input
                      type="number"
                      defaultValue="1000"
                      className="w-20 px-3 py-1 border border-secondary-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
