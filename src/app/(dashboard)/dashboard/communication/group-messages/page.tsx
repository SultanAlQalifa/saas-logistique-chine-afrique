'use client'

import { useState } from 'react'
import { 
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
  Target,
  Calendar,
  FileText,
  Image,
  Paperclip,
  Download,
  BarChart3,
  TrendingUp,
  UserCheck,
  MessageCircle
} from 'lucide-react'
import BackButton from '@/components/ui/back-button'

interface Campaign {
  id: string
  name: string
  subject?: string
  message: string
  type: 'email' | 'sms' | 'whatsapp' | 'mixed'
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
  recipients: {
    total: number
    segments: string[]
    sent: number
    delivered: number
    opened: number
    clicked: number
    failed: number
  }
  scheduledAt?: string
  sentAt?: string
  createdAt: string
  createdBy: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  attachments?: string[]
}

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Promotion Nouvel An Chinois',
    subject: '🎊 -30% sur tous vos envois vers la Chine !',
    message: 'Profitez de notre promotion spéciale Nouvel An Chinois ! Réduction de 30% sur tous vos envois jusqu\'au 15 février. Code: CNY2024',
    type: 'email',
    status: 'sent',
    recipients: {
      total: 2340,
      segments: ['Clients actifs', 'Prospects qualifiés'],
      sent: 2340,
      delivered: 2298,
      opened: 1847,
      clicked: 423,
      failed: 42
    },
    sentAt: '2024-01-20T09:00:00',
    createdAt: '2024-01-19T14:00:00',
    createdBy: 'Marketing Team',
    priority: 'high',
    attachments: ['promo-cny-2024.pdf']
  },
  {
    id: '2',
    name: 'Rappel Colis en Attente',
    message: 'Votre colis #{tracking} attend votre confirmation de livraison. Cliquez ici pour confirmer: {link}',
    type: 'sms',
    status: 'scheduled',
    recipients: {
      total: 156,
      segments: ['Colis en attente'],
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0
    },
    scheduledAt: '2024-01-22T10:00:00',
    createdAt: '2024-01-21T16:30:00',
    createdBy: 'Système',
    priority: 'medium'
  }
]

export default function GroupMessagesPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'segments' | 'analytics'>('campaigns')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800'
      case 'sending': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800'
      case 'sms': return 'bg-green-100 text-green-800'
      case 'whatsapp': return 'bg-purple-100 text-purple-800'
      case 'mixed': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'sms': return <MessageSquare className="h-4 w-4" />
      case 'whatsapp': return <Phone className="h-4 w-4" />
      case 'mixed': return <MessageCircle className="h-4 w-4" />
      default: return <Mail className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <BackButton href="/dashboard/communication" label="Retour à Communication" />
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              📧 Messages Groupés
            </h1>
            <p className="text-green-100 text-lg">
              Créez et gérez vos campagnes de communication en masse
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">6,667</div>
            <div className="text-green-200 text-sm">Messages envoyés ce mois</div>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">📊 Campagnes Actives</p>
              <p className="text-2xl font-bold text-blue-900">3</p>
              <p className="text-blue-700 text-sm">En cours ou programmées</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">📈 Taux d'Ouverture</p>
              <p className="text-2xl font-bold text-green-900">87.3%</p>
              <p className="text-green-700 text-sm">Moyenne mensuelle</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">👥 Segments Actifs</p>
              <p className="text-2xl font-bold text-purple-900">4</p>
              <p className="text-purple-700 text-sm">2,940 contacts</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">🎯 Taux de Clic</p>
              <p className="text-2xl font-bold text-amber-900">23.1%</p>
              <p className="text-amber-700 text-sm">Engagement élevé</p>
            </div>
            <div className="p-3 bg-amber-500 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle campagne
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Users className="h-4 w-4 mr-2" />
            Gérer les segments
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 text-secondary-600 border border-secondary-300 rounded-lg hover:bg-secondary-50">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button className="flex items-center px-3 py-2 text-secondary-600 border border-secondary-300 rounded-lg hover:bg-secondary-50">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-lg border border-secondary-200 p-6">
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par nom ou message..."
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
            <option value="sending">En cours</option>
            <option value="scheduled">Programmées</option>
            <option value="draft">Brouillons</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        {/* Liste des campagnes */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(campaign.type)}`}>
                    {getTypeIcon(campaign.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-secondary-900">{campaign.name}</h3>
                    </div>
                    {campaign.subject && (
                      <p className="text-sm font-medium text-secondary-700 mb-1">{campaign.subject}</p>
                    )}
                    <p className="text-secondary-600 mb-3 line-clamp-2">{campaign.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                      <span>Par {campaign.createdBy}</span>
                      <span>•</span>
                      <span>{campaign.recipients.total} destinataires</span>
                      <span>•</span>
                      <span>{new Date(campaign.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status === 'sent' ? 'Envoyée' :
                     campaign.status === 'scheduled' ? 'Programmée' : 'Brouillon'}
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

              {/* Statistiques de performance */}
              {campaign.status === 'sent' && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary-900">{campaign.recipients.sent}</div>
                    <div className="text-xs text-secondary-500">Envoyés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{campaign.recipients.delivered}</div>
                    <div className="text-xs text-secondary-500">Livrés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{campaign.recipients.opened}</div>
                    <div className="text-xs text-secondary-500">Ouverts (80%)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{campaign.recipients.clicked}</div>
                    <div className="text-xs text-secondary-500">Clics (23%)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{campaign.recipients.failed}</div>
                    <div className="text-xs text-secondary-500">Échecs</div>
                  </div>
                </div>
              )}

              {campaign.scheduledAt && (
                <div className="flex items-center text-sm text-secondary-500 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  Programmée pour le {new Date(campaign.scheduledAt).toLocaleString('fr-FR')}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-secondary-500">
                  Segments: {campaign.recipients.segments.join(', ')}
                </div>
                <div className="flex items-center space-x-2">
                  {campaign.attachments && campaign.attachments.length > 0 && (
                    <div className="flex items-center text-sm text-secondary-500">
                      <Paperclip className="h-4 w-4 mr-1" />
                      {campaign.attachments.length} pièce(s) jointe(s)
                    </div>
                  )}
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(campaign.type)}`}>
                    {campaign.type.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-secondary-400" />
              <h3 className="mt-2 text-sm font-medium text-secondary-900">Aucune campagne trouvée</h3>
              <p className="mt-1 text-sm text-secondary-500">
                Aucune campagne ne correspond à vos critères.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
