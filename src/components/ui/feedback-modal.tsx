'use client'

import { useState } from 'react'
import { X, Send, MessageCircle, Bug, Lightbulb, Heart } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (feedback: FeedbackData) => void
}

interface FeedbackData {
  type: 'suggestion' | 'bug' | 'compliment' | 'other'
  category: string
  title: string
  description: string
  email?: string
  priority: 'low' | 'medium' | 'high'
}

export function FeedbackModal({ isOpen, onClose, onSubmit }: FeedbackModalProps) {
  const { t } = useTranslation()
  const [type, setType] = useState<FeedbackData['type']>('suggestion')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [priority, setPriority] = useState<FeedbackData['priority']>('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const feedbackTypes = [
    { id: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: 'text-yellow-600 bg-yellow-100' },
    { id: 'bug', label: 'Bug/Problème', icon: Bug, color: 'text-red-600 bg-red-100' },
    { id: 'compliment', label: 'Compliment', icon: Heart, color: 'text-pink-600 bg-pink-100' },
    { id: 'other', label: 'Autre', icon: MessageCircle, color: 'text-blue-600 bg-blue-100' }
  ]

  const categories = [
    'Interface utilisateur',
    'Performance',
    'Fonctionnalités',
    'Navigation',
    'Sécurité',
    'Documentation',
    'Support client',
    'Autre'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setIsSubmitting(true)
    
    const feedbackData: FeedbackData = {
      type,
      category: category || 'Autre',
      title: title.trim(),
      description: description.trim(),
      email: email.trim() || undefined,
      priority
    }

    await onSubmit(feedbackData)
    
    // Reset form
    setType('suggestion')
    setCategory('')
    setTitle('')
    setDescription('')
    setEmail('')
    setPriority('medium')
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                💬 Votre Feedback
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Aidez-nous à améliorer NextMove avec vos retours
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de feedback *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {feedbackTypes.map((feedbackType) => {
                  const Icon = feedbackType.icon
                  return (
                    <button
                      key={feedbackType.id}
                      type="button"
                      onClick={() => setType(feedbackType.id as FeedbackData['type'])}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        type === feedbackType.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${feedbackType.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {feedbackType.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Résumez votre feedback en quelques mots"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre feedback en détail. Plus vous êtes précis, mieux nous pourrons vous aider."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={1000}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {description.length}/1000 caractères
              </div>
            </div>

            {/* Email (optionnel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (optionnel)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Pour vous tenir informé du suivi de votre feedback
              </p>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priorité
              </label>
              <div className="flex gap-3">
                {[
                  { id: 'low', label: 'Faible', color: 'text-green-600 border-green-300' },
                  { id: 'medium', label: 'Moyenne', color: 'text-yellow-600 border-yellow-300' },
                  { id: 'high', label: 'Élevée', color: 'text-red-600 border-red-300' }
                ].map((priorityOption) => (
                  <button
                    key={priorityOption.id}
                    type="button"
                    onClick={() => setPriority(priorityOption.id as FeedbackData['priority'])}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      priority === priorityOption.id
                        ? `${priorityOption.color} bg-opacity-10`
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {priorityOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !description.trim() || isSubmitting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer le feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
