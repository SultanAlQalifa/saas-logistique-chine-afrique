'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Save,
  Send,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Users,
  Calendar,
  Settings,
  Eye,
  AlertCircle,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface NotificationForm {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'system' | 'shipment' | 'payment' | 'promotion' | 'security'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  channels: string[]
  recipients: {
    type: 'all' | 'specific' | 'role' | 'segment'
    value?: string[]
  }
  schedule: {
    type: 'immediate' | 'scheduled'
    date?: string
    time?: string
  }
  actions?: {
    label: string
    url: string
  }[]
}

export default function CreateNotificationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<NotificationForm>({
    title: '',
    message: '',
    type: 'info',
    category: 'system',
    priority: 'medium',
    channels: ['in_app'],
    recipients: {
      type: 'all'
    },
    schedule: {
      type: 'immediate'
    }
  })
  const [isSaving, setIsSaving] = useState(false)

  const notificationTypes = [
    { value: 'info', label: 'Information', icon: Info, color: 'text-blue-600 bg-blue-100' },
    { value: 'success', label: 'Succès', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    { value: 'warning', label: 'Attention', icon: AlertCircle, color: 'text-yellow-600 bg-yellow-100' },
    { value: 'error', label: 'Erreur', icon: AlertCircle, color: 'text-red-600 bg-red-100' }
  ]

  const categories = [
    { value: 'system', label: 'Système', description: 'Notifications système et maintenance' },
    { value: 'shipment', label: 'Expédition', description: 'Statuts et mises à jour des colis' },
    { value: 'payment', label: 'Paiement', description: 'Factures et transactions' },
    { value: 'promotion', label: 'Promotion', description: 'Offres et campagnes marketing' },
    { value: 'security', label: 'Sécurité', description: 'Alertes de sécurité et connexions' }
  ]

  const priorities = [
    { value: 'low', label: 'Faible', color: 'text-gray-600 bg-gray-100' },
    { value: 'medium', label: 'Moyenne', color: 'text-blue-600 bg-blue-100' },
    { value: 'high', label: 'Élevée', color: 'text-orange-600 bg-orange-100' },
    { value: 'urgent', label: 'Urgente', color: 'text-red-600 bg-red-100' }
  ]

  const channels = [
    { value: 'in_app', label: 'Application', icon: Bell, description: 'Notification dans l\'interface' },
    { value: 'email', label: 'Email', icon: Mail, description: 'Envoi par email' },
    { value: 'sms', label: 'SMS', icon: MessageSquare, description: 'Message texte' },
    { value: 'push', label: 'Push', icon: Phone, description: 'Notification mobile' }
  ]

  const recipientTypes = [
    { value: 'all', label: 'Tous les utilisateurs', description: 'Envoyer à tous' },
    { value: 'role', label: 'Par rôle', description: 'Sélectionner par rôle utilisateur' },
    { value: 'segment', label: 'Par segment', description: 'Clients, entreprises, agents' },
    { value: 'specific', label: 'Utilisateurs spécifiques', description: 'Sélection manuelle' }
  ]

  const updateFormData = (field: keyof NotificationForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedField = (parent: keyof NotificationForm, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [field]: value
      }
    }))
  }

  const toggleChannel = (channel: string) => {
    const currentChannels = formData.channels
    const isSelected = currentChannels.includes(channel)

    if (isSelected) {
      updateFormData('channels', currentChannels.filter(c => c !== channel))
    } else {
      updateFormData('channels', [...currentChannels, channel])
    }
  }

  const handleSave = async (isDraft: boolean = true) => {
    setIsSaving(true)
    
    // Simulation de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (isDraft) {
      alert('Notification sauvegardée en brouillon !')
    } else {
      alert('Notification créée et envoyée avec succès !')
      router.push('/dashboard/communication/notifications')
    }
    
    setIsSaving(false)
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = notificationTypes.find(t => t.value === type)
    if (!typeConfig) return <Info className="h-5 w-5" />
    const Icon = typeConfig.icon
    return <Icon className="h-5 w-5" />
  }

  const getTypeColor = (type: string) => {
    const typeConfig = notificationTypes.find(t => t.value === type)
    return typeConfig?.color || 'text-gray-600 bg-gray-100'
  }

  const getPriorityColor = (priority: string) => {
    const priorityConfig = priorities.find(p => p.value === priority)
    return priorityConfig?.color || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="space-y-6">
      {/* Back Button - Top of page */}
      <div className="flex items-center justify-start">
        <Link
          href="/dashboard/communication/notifications"
          className="flex items-center bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg border border-blue-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour aux notifications
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">📢 Nouvelle Notification</h1>
          <p className="text-blue-100 text-lg">
            Créez une notification pour informer vos utilisateurs
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving || !formData.title || !formData.message || formData.channels.length === 0}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4 mr-2" />
            {formData.schedule.type === 'immediate' ? 'Envoyer maintenant' : 'Programmer'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contenu de la notification */}
          <div className="bg-white rounded-lg border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Contenu de la notification</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: Votre colis est en route"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => updateFormData('message', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Rédigez votre message de notification..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {notificationTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => updateFormData('type', type.value)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.type === type.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-secondary-200 hover:border-secondary-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded ${type.color}`}>
                            <type.icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Priorité
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        onClick={() => updateFormData('priority', priority.value)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.priority === priority.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-secondary-200 hover:border-secondary-300'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${priority.color}`}>
                            {priority.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateFormData('category', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label} - {category.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Canaux de diffusion */}
          <div className="bg-white rounded-lg border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Canaux de diffusion</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {channels.map((channel) => (
                <div
                  key={channel.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    formData.channels.includes(channel.value)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                  onClick={() => toggleChannel(channel.value)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                        formData.channels.includes(channel.value)
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-secondary-300'
                      }`}>
                        {formData.channels.includes(channel.value) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-secondary-900">{channel.label}</div>
                        <div className="text-sm text-secondary-500">{channel.description}</div>
                      </div>
                    </div>
                    <channel.icon className="h-5 w-5 text-secondary-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Destinataires */}
          <div className="bg-white rounded-lg border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Destinataires</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Type de destinataires
                </label>
                <div className="space-y-2">
                  {recipientTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.recipients.type === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200 hover:border-secondary-300'
                      }`}
                      onClick={() => updateNestedField('recipients', 'type', type.value)}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          formData.recipients.type === type.value
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-secondary-300'
                        }`}>
                          {formData.recipients.type === type.value && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-secondary-900">{type.label}</div>
                          <div className="text-sm text-secondary-500">{type.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formData.recipients.type === 'role' && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Rôles
                  </label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="admin">Administrateurs</option>
                    <option value="agent">Agents</option>
                    <option value="client">Clients</option>
                    <option value="company">Entreprises</option>
                  </select>
                </div>
              )}

              {formData.recipients.type === 'segment' && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Segments
                  </label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="active_clients">Clients actifs</option>
                    <option value="premium_companies">Entreprises premium</option>
                    <option value="new_users">Nouveaux utilisateurs</option>
                    <option value="frequent_shippers">Expéditeurs fréquents</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Programmation */}
          <div className="bg-white rounded-lg border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Programmation</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateNestedField('schedule', 'type', 'immediate')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.schedule.type === 'immediate'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-primary-600" />
                    <div className="text-left">
                      <div className="font-medium text-secondary-900">Maintenant</div>
                      <div className="text-sm text-secondary-500">Envoyer immédiatement</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => updateNestedField('schedule', 'type', 'scheduled')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.schedule.type === 'scheduled'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary-600" />
                    <div className="text-left">
                      <div className="font-medium text-secondary-900">Programmé</div>
                      <div className="text-sm text-secondary-500">Choisir date et heure</div>
                    </div>
                  </div>
                </button>
              </div>

              {formData.schedule.type === 'scheduled' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.schedule.date || ''}
                      onChange={(e) => updateNestedField('schedule', 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Heure
                    </label>
                    <input
                      type="time"
                      value={formData.schedule.time || ''}
                      onChange={(e) => updateNestedField('schedule', 'time', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Aperçu */}
          <div className="bg-white rounded-lg border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Aperçu</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded ${getTypeColor(formData.type)}`}>
                    {getTypeIcon(formData.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-secondary-900">
                      {formData.title || 'Titre de la notification'}
                    </div>
                    <div className="text-sm text-secondary-600 mt-1">
                      {formData.message || 'Message de la notification...'}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                        {priorities.find(p => p.value === formData.priority)?.label}
                      </span>
                      <span className="text-xs text-secondary-500">
                        {categories.find(c => c.value === formData.category)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Canaux:</span>
                  <span className="font-medium">{formData.channels.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Destinataires:</span>
                  <span className="font-medium capitalize">{formData.recipients.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Envoi:</span>
                  <span className="capitalize">{formData.schedule.type === 'immediate' ? 'Immédiat' : 'Programmé'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conseils */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Conseils</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Utilisez un titre clair et concis</p>
              <p>• Adaptez le message au canal</p>
              <p>• Choisissez la bonne priorité</p>
              <p>• Testez avant l'envoi massif</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
