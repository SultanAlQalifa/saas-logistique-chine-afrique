'use client'

import React, { useState, useEffect } from 'react'
import { SubscriptionPlan, PlanFeature, PlanLimitation, PlanPermission } from '@/types/subscription'
import { subscriptionEngine } from '@/utils/subscriptionEngine'
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Check,
  AlertCircle,
  Settings,
  Crown,
  Package,
  Users,
  Zap
} from 'lucide-react'

interface PlanEditorProps {
  plan?: SubscriptionPlan | null
  isOpen: boolean
  onClose: () => void
  onSave: (plan: SubscriptionPlan) => void
}

export default function PlanEditor({ plan, isOpen, onClose, onSave }: PlanEditorProps) {
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState<'basic' | 'pricing' | 'features' | 'limitations' | 'permissions'>('basic')

  const updateMetadata = (updates: any) => {
    setFormData((prev: any) => ({
      ...prev,
      metadata: {
        popular: false,
        recommended: false,
        customizable: false,
        order: 1,
        color: '#3B82F6',
        icon: 'package',
        ...prev.metadata,
        ...updates
      }
    }))
  }

  useEffect(() => {
    if (plan) {
      setFormData(plan)
    } else {
      // Initialize new plan
      setFormData({
        name: '',
        description: '',
        type: 'basic',
        status: 'active',
        pricing: { monthly: 0, yearly: 0, currency: 'EUR' },
        features: [],
        limitations: [],
        permissions: [],
        trial: { enabled: false, duration: 14, features: [] },
        billing: { cycle: 'monthly', invoicing: 'automatic', paymentMethods: ['card'] },
        metadata: { popular: false, recommended: false, customizable: false, order: 1, color: '#blue', icon: 'package' }
      })
    }
  }, [plan])

  const handleSave = () => {
    const validation = subscriptionEngine.validatePlan(formData)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    if (plan) {
      // Update existing plan
      const updated = subscriptionEngine.updatePlan(plan.id, formData)
      if (updated) {
        onSave(updated)
        onClose()
      }
    } else {
      // Create new plan
      const newPlan = subscriptionEngine.createPlan({
        ...formData,
        createdBy: 'admin'
      } as any)
      onSave(newPlan)
      onClose()
    }
  }

  const addFeature = () => {
    const newFeature: PlanFeature = {
      id: `feature_${Date.now()}`,
      name: '',
      description: '',
      category: 'core',
      enabled: true
    }
    setFormData((prev: any) => ({
      ...prev,
      features: [...(prev.features || []), newFeature]
    }))
  }

  const updateFeature = (index: number, updates: Partial<PlanFeature>) => {
    setFormData((prev: any) => ({
      ...prev,
      features: prev.features?.map((feature: any, i: number) => 
        i === index ? { ...feature, ...updates } : feature
      ) || []
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      features: prev.features?.filter((_: any, i: number) => i !== index) || []
    }))
  }

  const addLimitation = () => {
    const newLimitation: PlanLimitation = {
      id: `limit_${Date.now()}`,
      type: 'packages',
      name: '',
      value: 0,
      unit: '',
      unlimited: false
    }
    setFormData((prev: any) => ({
      ...prev,
      limitations: [...(prev.limitations || []), newLimitation]
    }))
  }

  const updateLimitation = (index: number, updates: Partial<PlanLimitation>) => {
    setFormData((prev: any) => ({
      ...prev,
      limitations: prev.limitations?.map((limit: any, i: number) => 
        i === index ? { ...limit, ...updates } : limit
      ) || []
    }))
  }

  const removeLimitation = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      limitations: prev.limitations?.filter((_: any, i: number) => i !== index) || []
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {plan ? 'Modifier le Plan' : 'Nouveau Plan'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {[
                { id: 'basic', label: 'Informations de base', icon: Settings },
                { id: 'pricing', label: 'Tarification', icon: Crown },
                { id: 'features', label: 'Fonctionnalités', icon: Zap },
                { id: 'limitations', label: 'Limitations', icon: Package },
                { id: 'permissions', label: 'Permissions', icon: Users }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Errors */}
              {errors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-medium text-red-900">Erreurs de validation</h3>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Basic Information */}
              {activeSection === 'basic' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Informations de base</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du plan *
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Plan Premium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de plan
                      </label>
                      <select
                        value={formData.type || 'basic'}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, type: e.target.value as any }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="free">Gratuit</option>
                        <option value="basic">Basique</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Entreprise</option>
                        <option value="custom">Personnalisé</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Description du plan..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value as any }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="deprecated">Déprécié</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ordre d'affichage
                      </label>
                      <input
                        type="number"
                        value={formData.metadata?.order || 1}
                        onChange={(e) => updateMetadata({ order: Number(e.target.value) })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur
                      </label>
                      <input
                        type="color"
                        value={formData.metadata?.color || '#3b82f6'}
                        onChange={(e) => updateMetadata({ color: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="popular"
                        checked={formData.metadata?.popular || false}
                        onChange={(e) => updateMetadata({ popular: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="popular" className="ml-2 text-sm text-gray-700">
                        Marquer comme populaire
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="recommended"
                        checked={formData.metadata?.recommended || false}
                        onChange={(e) => updateMetadata({ recommended: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="recommended" className="ml-2 text-sm text-gray-700">
                        Marquer comme recommandé
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="customizable"
                        checked={formData.metadata?.customizable || false}
                        onChange={(e) => updateMetadata({ customizable: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="customizable" className="ml-2 text-sm text-gray-700">
                        Plan personnalisable
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing */}
              {activeSection === 'pricing' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Tarification</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix mensuel *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.pricing?.monthly || 0}
                          onChange={(e) => setFormData((prev: any) => ({
                            ...prev,
                            pricing: { ...prev.pricing, monthly: Number(e.target.value) }
                          }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                        <span className="absolute right-3 top-2 text-gray-500">€</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix annuel *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.pricing?.yearly || 0}
                          onChange={(e) => setFormData((prev: any) => ({
                            ...prev,
                            pricing: { ...prev.pricing, yearly: Number(e.target.value) }
                          }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                        <span className="absolute right-3 top-2 text-gray-500">€</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Devise
                      </label>
                      <select
                        value={formData.pricing?.currency || 'EUR'}
                        onChange={(e) => setFormData((prev: any) => ({
                          ...prev,
                          pricing: { ...prev.pricing, currency: e.target.value }
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="FCFA">FCFA</option>
                      </select>
                    </div>
                  </div>

                  {formData.pricing?.monthly && formData.pricing?.yearly && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        Économie annuelle: {((formData.pricing.monthly * 12 - formData.pricing.yearly) / (formData.pricing.monthly * 12) * 100).toFixed(1)}%
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Essai gratuit</h4>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="trial-enabled"
                        checked={formData.trial?.enabled || false}
                        onChange={(e) => setFormData((prev: any) => ({
                          ...prev,
                          trial: { ...prev.trial, enabled: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="trial-enabled" className="ml-2 text-sm text-gray-700">
                        Activer l'essai gratuit
                      </label>
                    </div>

                    {formData.trial?.enabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durée (jours)
                        </label>
                        <input
                          type="number"
                          value={formData.trial?.duration || 14}
                          onChange={(e) => setFormData((prev: any) => ({
                            ...prev,
                            trial: { ...prev.trial, duration: Number(e.target.value) }
                          }))}
                          className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                          max="365"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features */}
              {activeSection === 'features' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Fonctionnalités</h3>
                    <button
                      onClick={addFeature}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.features?.map((feature: any, index: number) => (
                      <div key={feature.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={feature.enabled}
                              onChange={(e) => updateFeature(index, { enabled: e.target.checked })}
                              className="rounded"
                            />
                            <span className="text-sm font-medium">Activé</span>
                          </div>
                          <button
                            onClick={() => removeFeature(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nom
                            </label>
                            <input
                              type="text"
                              value={feature.name}
                              onChange={(e) => updateFeature(index, { name: e.target.value })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              placeholder="Nom de la fonctionnalité"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Catégorie
                            </label>
                            <select
                              value={feature.category}
                              onChange={(e) => updateFeature(index, { category: e.target.value as any })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            >
                              <option value="core">Core</option>
                              <option value="advanced">Avancé</option>
                              <option value="premium">Premium</option>
                              <option value="enterprise">Entreprise</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(index, { description: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            rows={2}
                            placeholder="Description de la fonctionnalité"
                          />
                        </div>
                      </div>
                    ))}

                    {(!formData.features || formData.features.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        Aucune fonctionnalité ajoutée
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Limitations */}
              {activeSection === 'limitations' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Limitations</h3>
                    <button
                      onClick={addLimitation}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.limitations?.map((limitation: any, index: number) => (
                      <div key={limitation.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={limitation.unlimited}
                              onChange={(e) => updateLimitation(index, { unlimited: e.target.checked })}
                              className="rounded"
                            />
                            <span className="text-sm font-medium">Illimité</span>
                          </div>
                          <button
                            onClick={() => removeLimitation(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Type
                            </label>
                            <select
                              value={limitation.type}
                              onChange={(e) => updateLimitation(index, { type: e.target.value as any })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            >
                              <option value="packages">Colis</option>
                              <option value="storage">Stockage</option>
                              <option value="users">Utilisateurs</option>
                              <option value="companies">Entreprises</option>
                              <option value="api_calls">Appels API</option>
                              <option value="exports">Exports</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nom
                            </label>
                            <input
                              type="text"
                              value={limitation.name}
                              onChange={(e) => updateLimitation(index, { name: e.target.value })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              placeholder="Nom de la limitation"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Valeur
                            </label>
                            <input
                              type="number"
                              value={limitation.value}
                              onChange={(e) => updateLimitation(index, { value: Number(e.target.value) })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              disabled={limitation.unlimited}
                              min="0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Unité
                            </label>
                            <input
                              type="text"
                              value={limitation.unit}
                              onChange={(e) => updateLimitation(index, { unit: e.target.value })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              placeholder="Ex: colis, MB, utilisateurs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!formData.limitations || formData.limitations.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        Aucune limitation ajoutée
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition duration-200"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center gap-2 transition duration-200"
          >
            <Save className="h-4 w-4" />
            {plan ? 'Sauvegarder' : 'Créer le Plan'}
          </button>
        </div>
      </div>
    </div>
  )
}
