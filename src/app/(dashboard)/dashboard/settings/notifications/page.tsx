'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { NotificationRuleModal } from '@/components/modals/NotificationRuleModal'
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Monitor,
  Settings,
  CheckCircle,
  Save,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Copy,
  Package,
  DollarSign,
  TrendingUp
} from 'lucide-react'

interface NotificationRule {
  id: string
  name: string
  trigger: string
  conditions: {
    orderStatus?: string[]
    customerType?: string[]
    amount?: { min?: number; max?: number }
    timeframe?: string
  }
  channels: ('email' | 'push' | 'sms' | 'inApp')[]
  message: {
    subject?: string
    content: string
  }
  active: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  lastModified: string
}

interface NotificationSettings {
  email: {
    enabled: boolean
    newOrders: boolean
    orderUpdates: boolean
    payments: boolean
    marketing: boolean
    systemAlerts: boolean
    weeklyReports: boolean
  }
  push: {
    enabled: boolean
    newOrders: boolean
    orderUpdates: boolean
    payments: boolean
    urgentAlerts: boolean
    reminders: boolean
  }
  sms: {
    enabled: boolean
    urgentOnly: boolean
    orderDelivered: boolean
    paymentReceived: boolean
  }
  inApp: {
    enabled: boolean
    sound: boolean
    desktop: boolean
    frequency: string
  }
}

const notificationCategories = [
  {
    id: 'orders',
    name: 'Commandes & Colis',
    icon: Package,
    color: 'from-blue-500 to-cyan-500',
    description: 'Notifications liées aux commandes et expéditions'
  },
  {
    id: 'payments',
    name: 'Paiements',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    description: 'Notifications de paiements et transactions'
  },
  {
    id: 'system',
    name: 'Système',
    icon: Settings,
    color: 'from-purple-500 to-pink-500',
    description: 'Alertes système et maintenance'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    description: 'Promotions et actualités'
  }
]

const mockNotificationRules: NotificationRule[] = [
  {
    id: '1',
    name: 'Nouvelle commande reçue',
    trigger: 'order_created',
    channels: ['email', 'push', 'inApp'],
    conditions: {
      orderStatus: ['pending'],
      customerType: ['premium']
    },
    message: {
      subject: 'Nouvelle commande #{orderId}',
      content: 'Une nouvelle commande a été reçue de {{customerName}} pour un montant de {{amount}} FCFA.'
    },
    active: true,
    priority: 'high',
    createdAt: '2024-01-15',
    lastModified: '2024-01-20'
  },
  {
    id: '2',
    name: 'Commande expédiée',
    trigger: 'order_shipped',
    channels: ['email', 'sms', 'push'],
    conditions: {
      orderStatus: ['shipped']
    },
    message: {
      subject: 'Votre commande #{orderId} a été expédiée',
      content: 'Bonjour {{customerName}}, votre commande #{orderId} a été expédiée et arrivera le {{deliveryDate}}.'
    },
    active: true,
    priority: 'medium',
    createdAt: '2024-01-10',
    lastModified: '2024-01-18'
  },
  {
    id: '3',
    name: 'Paiement échoué',
    trigger: 'payment_failed',
    channels: ['email', 'push', 'inApp'],
    conditions: {
      amount: { min: 1000 }
    },
    message: {
      subject: 'Échec de paiement - Commande #{orderId}',
      content: 'Le paiement pour la commande #{orderId} de {{amount}} FCFA a échoué. Veuillez vérifier vos informations de paiement.'
    },
    active: true,
    priority: 'high',
    createdAt: '2024-01-12',
    lastModified: '2024-01-22'
  }
]

export default function NotificationsSettingsPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'rules'>('settings')
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>(mockNotificationRules)
  const [showRuleModal, setShowRuleModal] = useState(false)
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Force modal to stay closed on component mount
  React.useEffect(() => {
    setShowRuleModal(false)
    setEditingRule(null)
  }, [])
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      newOrders: true,
      orderUpdates: true,
      payments: true,
      marketing: false,
      systemAlerts: true,
      weeklyReports: true
    },
    push: {
      enabled: true,
      newOrders: true,
      orderUpdates: true,
      payments: true,
      urgentAlerts: true,
      reminders: false
    },
    sms: {
      enabled: false,
      urgentOnly: true,
      orderDelivered: false,
      paymentReceived: false
    },
    inApp: {
      enabled: true,
      sound: true,
      desktop: true,
      frequency: 'immediate'
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Paramètres de notifications sauvegardés avec succès !')
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setSettings({
        email: {
          enabled: true,
          newOrders: true,
          orderUpdates: true,
          payments: true,
          marketing: false,
          systemAlerts: true,
          weeklyReports: true
        },
        push: {
          enabled: true,
          newOrders: true,
          orderUpdates: true,
          payments: true,
          urgentAlerts: true,
          reminders: false
        },
        sms: {
          enabled: false,
          urgentOnly: true,
          orderDelivered: false,
          paymentReceived: false
        },
        inApp: {
          enabled: true,
          sound: true,
          desktop: true,
          frequency: 'immediate'
        }
      })
    }
  }

  const updateEmailSetting = (key: keyof typeof settings.email, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value }
    }))
  }

  const updatePushSetting = (key: keyof typeof settings.push, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      push: { ...prev.push, [key]: value }
    }))
  }

  const updateSmsSetting = (key: keyof typeof settings.sms, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      sms: { ...prev.sms, [key]: value }
    }))
  }

  const updateInAppSetting = (key: keyof typeof settings.inApp, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      inApp: { ...prev.inApp, [key]: value }
    }))
  }

  const getActiveChannelsCount = () => {
    let count = 0
    if (settings.email.enabled) count++
    if (settings.push.enabled) count++
    if (settings.sms.enabled) count++
    if (settings.inApp.enabled) count++
    return count
  }

  const handleCreateRule = () => {
    setEditingRule(null)
    setShowRuleModal(true)
  }

  const handleEditRule = (rule: NotificationRule) => {
    setEditingRule(rule)
    setShowRuleModal(true)
  }

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette règle de notification ?')) {
      setNotificationRules(prev => prev.filter(rule => rule.id !== ruleId))
    }
  }

  const handleDuplicateRule = (rule: NotificationRule) => {
    const newRule: NotificationRule = {
      ...rule,
      id: Date.now().toString(),
      name: `${rule.name} (Copie)`,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    }
    setNotificationRules(prev => [...prev, newRule])
    // Ensure modal stays closed
    setShowRuleModal(false)
    setEditingRule(null)
  }

  const toggleRuleStatus = (ruleId: string) => {
    setNotificationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, active: !rule.active } : rule
      )
    )
    // Ensure modal stays closed
    setShowRuleModal(false)
    setEditingRule(null)
  }

  const handleSaveRule = (ruleData: Omit<NotificationRule, 'id' | 'createdAt' | 'lastModified'>) => {
    if (editingRule) {
      // Mise à jour d'une règle existante
      setNotificationRules(prev => prev.map(rule => 
        rule.id === editingRule.id 
          ? { 
              ...rule, 
              ...ruleData,
              lastModified: new Date().toISOString().split('T')[0]
            }
          : rule
      ))
    } else {
      // Création d'une nouvelle règle
      const newRule: NotificationRule = {
        id: Date.now().toString(),
        ...ruleData,
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      }
      setNotificationRules(prev => [...prev, newRule])
    }
    setShowRuleModal(false)
    setEditingRule(null)
  }

  const handleCloseModal = () => {
    setShowRuleModal(false)
    setEditingRule(null)
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail
      case 'push': return Smartphone
      case 'sms': return MessageSquare
      case 'inApp': return Bell
      default: return Bell
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


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🔔 Notifications</h1>
            <p className="text-purple-100 text-lg">
              Gérez vos préférences de notifications et alertes
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{activeTab === 'settings' ? getActiveChannelsCount() : notificationRules.length}</div>
            <div className="text-purple-200 text-sm">{activeTab === 'settings' ? 'Canaux actifs' : 'Règles configurées'}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Paramètres généraux
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'rules'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bell className="h-4 w-4 inline mr-2" />
          Règles de notification
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'settings' ? (
        <>
          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>

          {/* Canaux de notification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-800">
                <Mail className="h-5 w-5" />
                Notifications Email
              </div>
              <Switch
                checked={settings.email.enabled}
                onCheckedChange={(checked) => updateEmailSetting('enabled', checked)}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200"
              />
            </CardTitle>
            <CardDescription className="text-blue-600">
              Recevez des notifications par email
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nouvelles commandes</span>
                <Switch
                  checked={settings.email.newOrders}
                  onCheckedChange={(checked) => updateEmailSetting('newOrders', checked)}
                  disabled={!settings.email.enabled}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mises à jour commandes</span>
                <Switch
                  checked={settings.email.orderUpdates}
                  onCheckedChange={(checked) => updateEmailSetting('orderUpdates', checked)}
                  disabled={!settings.email.enabled}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Paiements</span>
                <Switch
                  checked={settings.email.payments}
                  onCheckedChange={(checked) => updateEmailSetting('payments', checked)}
                  disabled={!settings.email.enabled}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Marketing</span>
                <Switch
                  checked={settings.email.marketing}
                  onCheckedChange={(checked) => updateEmailSetting('marketing', checked)}
                  disabled={!settings.email.enabled}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alertes système</span>
                <Switch
                  checked={settings.email.systemAlerts}
                  onCheckedChange={(checked) => updateEmailSetting('systemAlerts', checked)}
                  disabled={!settings.email.enabled}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rapports hebdomadaires</span>
                <Switch
                  checked={settings.email.weeklyReports}
                  onCheckedChange={(checked) => updateEmailSetting('weeklyReports', checked)}
                  disabled={!settings.email.enabled}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Push */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-800">
                <Smartphone className="h-5 w-5" />
                Notifications Push
              </div>
              <Switch
                checked={settings.push.enabled}
                onCheckedChange={(checked) => updatePushSetting('enabled', checked)}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200"
              />
            </CardTitle>
            <CardDescription className="text-green-600">
              Notifications push sur vos appareils
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nouvelles commandes</span>
                <Switch
                  checked={settings.push.newOrders}
                  onCheckedChange={(checked) => updatePushSetting('newOrders', checked)}
                  disabled={!settings.push.enabled}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mises à jour commandes</span>
                <Switch
                  checked={settings.push.orderUpdates}
                  onCheckedChange={(checked) => updatePushSetting('orderUpdates', checked)}
                  disabled={!settings.push.enabled}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Paiements</span>
                <Switch
                  checked={settings.push.payments}
                  onCheckedChange={(checked) => updatePushSetting('payments', checked)}
                  disabled={!settings.push.enabled}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alertes urgentes</span>
                <Switch
                  checked={settings.push.urgentAlerts}
                  onCheckedChange={(checked) => updatePushSetting('urgentAlerts', checked)}
                  disabled={!settings.push.enabled}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rappels</span>
                <Switch
                  checked={settings.push.reminders}
                  onCheckedChange={(checked) => updatePushSetting('reminders', checked)}
                  disabled={!settings.push.enabled}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMS */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-800">
                <MessageSquare className="h-5 w-5" />
                Notifications SMS
              </div>
              <Switch
                checked={settings.sms.enabled}
                onCheckedChange={(checked) => updateSmsSetting('enabled', checked)}
                className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-gray-200"
              />
            </CardTitle>
            <CardDescription className="text-orange-600">
              SMS pour les notifications importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alertes urgentes uniquement</span>
                <Switch
                  checked={settings.sms.urgentOnly}
                  onCheckedChange={(checked) => updateSmsSetting('urgentOnly', checked)}
                  disabled={!settings.sms.enabled}
                  className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Commande livrée</span>
                <Switch
                  checked={settings.sms.orderDelivered}
                  onCheckedChange={(checked) => updateSmsSetting('orderDelivered', checked)}
                  disabled={!settings.sms.enabled}
                  className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Paiement reçu</span>
                <Switch
                  checked={settings.sms.paymentReceived}
                  onCheckedChange={(checked) => updateSmsSetting('paymentReceived', checked)}
                  disabled={!settings.sms.enabled}
                  className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
            </div>
            
            {!settings.sms.enabled && (
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-xs text-orange-600">
                  💡 Les SMS sont facturés selon votre forfait
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* In-App */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-800">
                <Bell className="h-5 w-5" />
                Notifications In-App
              </div>
              <Switch
                checked={settings.inApp.enabled}
                onCheckedChange={(checked) => updateInAppSetting('enabled', checked)}
                className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200"
              />
            </CardTitle>
            <CardDescription className="text-purple-600">
              Notifications dans l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Son activé</span>
                <Switch
                  checked={settings.inApp.sound}
                  onCheckedChange={(checked) => updateInAppSetting('sound', checked)}
                  disabled={!settings.inApp.enabled}
                  className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notifications bureau</span>
                <Switch
                  checked={settings.inApp.desktop}
                  onCheckedChange={(checked) => updateInAppSetting('desktop', checked)}
                  disabled={!settings.inApp.enabled}
                  className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Fréquence des notifications
              </label>
              <select
                value={settings.inApp.frequency}
                onChange={(e) => updateInAppSetting('frequency', e.target.value)}
                disabled={!settings.inApp.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="immediate">Immédiate</option>
                <option value="grouped">Groupées (5 min)</option>
                <option value="hourly">Toutes les heures</option>
                <option value="daily">Quotidienne</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Catégories de notifications */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Catégories de notifications
          </CardTitle>
          <CardDescription>
            Aperçu des types de notifications disponibles
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {notificationCategories.map((category) => (
              <div key={category.id} className="text-center">
                <div className={`bg-gradient-to-r ${category.color} p-4 rounded-xl text-white mb-3`}>
                  <category.icon className="h-8 w-8 mx-auto" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                <p className="text-xs text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Résumé */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                Résumé de vos notifications
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Email :</span>
                  <div className="text-blue-800">
                    {settings.email.enabled ? '✅ Activé' : '❌ Désactivé'}
                  </div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Push :</span>
                  <div className="text-blue-800">
                    {settings.push.enabled ? '✅ Activé' : '❌ Désactivé'}
                  </div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">SMS :</span>
                  <div className="text-blue-800">
                    {settings.sms.enabled ? '✅ Activé' : '❌ Désactivé'}
                  </div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">In-App :</span>
                  <div className="text-blue-800">
                    {settings.inApp.enabled ? '✅ Activé' : '❌ Désactivé'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </>
      ) : (
        <>
          {/* Règles de notification */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Règles de notification</h2>
              <p className="text-gray-600">Configurez des règles personnalisées pour vos notifications</p>
            </div>
            <Button
              onClick={handleCreateRule}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4" />
              Nouvelle règle
            </Button>
          </div>

          {/* Liste des règles */}
          <div className="space-y-4">
            {notificationRules.map((rule) => (
              <Card key={rule.id} className="border-0 shadow-lg">
                <CardContent className="p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between" onClick={(e) => e.stopPropagation()}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                        <Badge className={getPriorityColor(rule.priority)}>
                          {rule.priority}
                        </Badge>
                        <Badge variant={rule.active ? 'default' : 'secondary'}>
                          {rule.active ? 'Activée' : 'Désactivée'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{rule.trigger}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Déclencheur:</span>
                          <span>{rule.trigger}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Canaux:</span>
                          <div className="flex gap-1">
                            {rule.channels.map((channel) => {
                              const Icon = getChannelIcon(channel)
                              return (
                                <Icon key={channel} className="h-4 w-4" />
                              )
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Modifié:</span>
                          <span>{rule.lastModified}</span>
                        </div>
                      </div>

                      {/* Aperçu du template */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm">
                          <div className="font-medium text-gray-700 mb-1">Sujet: {rule.message.subject}</div>
                          <div className="text-gray-600">{rule.message.content}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleRuleStatus(rule.id)
                        }}
                        className="flex items-center gap-1"
                      >
                        {rule.active ? '⏸️' : '▶️'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDuplicateRule(rule)
                        }}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleEditRule(rule)
                        }}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsDeleting(true)
                          if (confirm('Êtes-vous sûr de vouloir supprimer cette règle de notification ?')) {
                            setNotificationRules(prev => prev.filter(r => r.id !== rule.id))
                          }
                          setIsDeleting(false)
                          // Force modal to stay closed
                          setTimeout(() => {
                            setShowRuleModal(false)
                            setEditingRule(null)
                          }, 0)
                        }}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 h-9 rounded-md px-3 flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {notificationRules.length === 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune règle configurée</h3>
                  <p className="text-gray-600 mb-4">
                    Créez votre première règle de notification pour automatiser vos alertes
                  </p>
                  <Button
                    onClick={handleCreateRule}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une règle
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Notification Rule Modal - Only render when explicitly needed */}
      {showRuleModal && (
        <NotificationRuleModal 
          open={showRuleModal}
          rule={editingRule}
          onSave={handleSaveRule}
          onClose={handleCloseModal}
          onDelete={(id, e) => {
            e.preventDefault()
            e.stopPropagation()
            if (confirm('Êtes-vous sûr de vouloir supprimer cette règle de notification ?')) {
              setNotificationRules(prev => prev.filter(r => r.id !== id))
              setShowRuleModal(false)
              setEditingRule(null)
            }
          }}
        />
      )}
    </div>
  )
}
