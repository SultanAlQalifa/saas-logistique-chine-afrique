'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

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

type Props = {
  open: boolean
  rule: NotificationRule | null
  onSave: (data: Omit<NotificationRule, 'id' | 'createdAt' | 'lastModified'>) => Promise<void> | void
  onClose: () => void
  onDelete?: (id: string, e: React.MouseEvent) => void
}

export function NotificationRuleModal({ open, rule, onSave, onClose, onDelete }: Props) {
  const [formData, setFormData] = useState<Omit<NotificationRule, 'id' | 'createdAt' | 'lastModified'>>({
    name: '',
    trigger: '',
    conditions: {},
    channels: [],
    message: { content: '' },
    active: true,
    priority: 'medium'
  })

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        trigger: rule.trigger,
        conditions: rule.conditions,
        channels: rule.channels,
        message: rule.message,
        active: rule.active,
        priority: rule.priority
      })
    } else {
      setFormData({
        name: '',
        trigger: '',
        conditions: {},
        channels: [],
        message: { content: '' },
        active: true,
        priority: 'medium'
      })
    }
  }, [rule, open])

  const stop = (e: React.MouseEvent) => { 
    e.stopPropagation() 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.trigger || !formData.channels?.length) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }
    await onSave(formData)
  }

  const handleChannelToggle = (channel: 'email' | 'push' | 'sms' | 'inApp') => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels?.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...(prev.channels || []), channel]
    }))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" onClick={stop}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {rule ? 'Modifier la règle' : 'Nouvelle règle de notification'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom de la règle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la règle *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Notification commande expédiée"
              required
            />
          </div>

          {/* Déclencheur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Déclencheur *
            </label>
            <select
              value={formData.trigger}
              onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner un déclencheur</option>
              <option value="order_created">Commande créée</option>
              <option value="order_shipped">Commande expédiée</option>
              <option value="order_delivered">Commande livrée</option>
              <option value="payment_received">Paiement reçu</option>
              <option value="payment_failed">Paiement échoué</option>
              <option value="customer_registered">Client inscrit</option>
            </select>
          </div>

          {/* Canaux de notification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canaux de notification *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'email', label: 'Email', icon: '📧' },
                { key: 'push', label: 'Push', icon: '📱' },
                { key: 'sms', label: 'SMS', icon: '💬' },
                { key: 'inApp', label: 'In-App', icon: '🔔' }
              ].map(({ key, label, icon }) => (
                <label key={key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.channels?.includes(key as any)}
                    onChange={() => handleChannelToggle(key as any)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sujet (pour email)
            </label>
            <input
              type="text"
              value={formData.message.subject || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                message: { ...prev.message, subject: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Votre commande a été expédiée"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu du message *
            </label>
            <textarea
              value={formData.message.content}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                message: { ...prev.message, content: e.target.value }
              }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contenu de la notification..."
              required
            />
          </div>

          {/* Priorité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
            </select>
          </div>

          {/* Statut actif */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Règle active
            </label>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Fermer
            </button>
            {rule && onDelete && (
              <button 
                type="button" 
                onClick={(e) => onDelete(rule.id, e)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Supprimer
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
