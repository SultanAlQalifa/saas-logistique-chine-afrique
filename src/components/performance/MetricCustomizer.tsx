'use client'

import { useState } from 'react'
import { PerformanceMetric, PerformanceWidget } from '@/types/performance'
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Target, 
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Gauge,
  Map,
  Save,
  X
} from 'lucide-react'

interface MetricCustomizerProps {
  metrics: PerformanceMetric[]
  onMetricUpdate: (metric: PerformanceMetric) => void
  onMetricCreate: (metric: Omit<PerformanceMetric, 'id' | 'lastUpdated'>) => void
  onMetricDelete: (metricId: string) => void
}

export default function MetricCustomizer({
  metrics,
  onMetricUpdate,
  onMetricCreate,
  onMetricDelete
}: MetricCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingMetric, setEditingMetric] = useState<PerformanceMetric | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<PerformanceMetric>>({})

  const metricTypes = [
    { value: 'revenue', label: 'Revenus', icon: TrendingUp },
    { value: 'volume', label: 'Volume', icon: BarChart3 },
    { value: 'weight', label: 'Poids', icon: Activity },
    { value: 'count', label: 'Compteur', icon: Plus },
    { value: 'percentage', label: 'Pourcentage', icon: PieChart },
    { value: 'time', label: 'Temps', icon: LineChart }
  ]

  const categories = [
    { value: 'financial', label: 'Financier' },
    { value: 'operational', label: 'Opérationnel' },
    { value: 'customer', label: 'Client' },
    { value: 'efficiency', label: 'Efficacité' }
  ]

  const units = {
    revenue: ['€', '$', 'FCFA'],
    volume: ['m³', 'L', 'cm³'],
    weight: ['kg', 'g', 't'],
    count: ['unités', 'colis', 'clients'],
    percentage: ['%'],
    time: ['min', 'h', 'jours', 's']
  }

  const handleEdit = (metric: PerformanceMetric) => {
    setEditingMetric(metric)
    setFormData(metric)
    setIsOpen(true)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingMetric(null)
    setFormData({
      name: '',
      value: 0,
      unit: '€',
      type: 'revenue',
      trend: 'stable',
      trendPercentage: 0,
      category: 'financial',
      isKPI: false
    })
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || formData.value === undefined) return

    const metricData = {
      ...formData,
      lastUpdated: new Date()
    } as PerformanceMetric

    if (isCreating) {
      onMetricCreate(metricData)
    } else if (editingMetric) {
      onMetricUpdate({ ...editingMetric, ...metricData })
    }

    handleClose()
  }

  const handleClose = () => {
    setIsOpen(false)
    setEditingMetric(null)
    setIsCreating(false)
    setFormData({})
  }

  const handleDelete = (metricId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette métrique ?')) {
      onMetricDelete(metricId)
    }
  }

  return (
    <>
      {/* Bouton d'ouverture */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200"
      >
        <Settings className="h-4 w-4" />
        Personnaliser Métriques
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Gestionnaire de Métriques
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex h-[calc(90vh-80px)]">
              {/* Liste des métriques */}
              <div className="w-1/2 border-r overflow-y-auto">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Métriques Existantes</h3>
                    <button
                      onClick={handleCreate}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Nouvelle
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {metrics.map(metric => (
                    <div
                      key={metric.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        editingMetric?.id === metric.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleEdit(metric)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{metric.name}</h4>
                            {metric.isKPI && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                KPI
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {metric.value.toLocaleString('fr-FR')}{metric.unit} • {categories.find(c => c.value === metric.category)?.label}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(metric)
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(metric.id)
                            }}
                            className="p-1 hover:bg-red-100 text-red-600 rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulaire d'édition */}
              <div className="w-1/2 overflow-y-auto">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-medium text-gray-900">
                    {isCreating ? 'Nouvelle Métrique' : 'Modifier Métrique'}
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la métrique *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Chiffre d'affaires mensuel"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Description de la métrique..."
                    />
                  </div>

                  {/* Type et Unité */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type *
                      </label>
                      <select
                        value={formData.type || 'revenue'}
                        onChange={(e) => {
                          const type = e.target.value as keyof typeof units
                          setFormData(prev => ({ 
                            ...prev, 
                            type,
                            unit: units[type]?.[0] || '€'
                          }))
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {metricTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unité *
                      </label>
                      <select
                        value={formData.unit || '€'}
                        onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {(formData.type && units[formData.type as keyof typeof units] ? units[formData.type as keyof typeof units] : ['€']).map(unit => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={formData.category || 'financial'}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Valeur et Tendance */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valeur actuelle *
                      </label>
                      <input
                        type="number"
                        value={formData.value || 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tendance
                      </label>
                      <select
                        value={formData.trend || 'stable'}
                        onChange={(e) => setFormData(prev => ({ ...prev, trend: e.target.value as any }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="up">Hausse</option>
                        <option value="down">Baisse</option>
                        <option value="stable">Stable</option>
                      </select>
                    </div>
                  </div>

                  {/* Pourcentage de tendance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pourcentage de tendance
                    </label>
                    <input
                      type="number"
                      value={formData.trendPercentage || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, trendPercentage: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.1"
                      min="0"
                      max="100"
                    />
                  </div>

                  {/* Objectif */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objectif (optionnel)
                    </label>
                    <input
                      type="number"
                      value={formData.target || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                      placeholder="Valeur cible"
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isKPI"
                        checked={formData.isKPI || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, isKPI: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="isKPI" className="ml-2 text-sm text-gray-700">
                        Marquer comme KPI (Indicateur Clé de Performance)
                      </label>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!formData.name || formData.value === undefined}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center gap-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4" />
                      {isCreating ? 'Créer' : 'Sauvegarder'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
