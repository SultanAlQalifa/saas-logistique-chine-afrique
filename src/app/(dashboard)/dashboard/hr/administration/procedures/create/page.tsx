'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, FileText, Users, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface ProcedureForm {
  title: string
  category: 'onboarding' | 'offboarding' | 'leave' | 'performance' | 'disciplinary' | 'training' | 'safety' | 'other'
  description: string
  steps: {
    id: string
    title: string
    description: string
    responsible: string
    duration: string
    mandatory: boolean
  }[]
  applicableRoles: string[]
  documents: string[]
  approvalRequired: boolean
  approvers: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  effectiveDate: string
  reviewDate: string
}

export default function CreateProcedurePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProcedureForm>({
    title: '',
    category: 'onboarding',
    description: '',
    steps: [],
    applicableRoles: [],
    documents: [],
    approvalRequired: false,
    approvers: [],
    priority: 'medium',
    effectiveDate: '',
    reviewDate: ''
  })

  const categories = [
    { value: 'onboarding', label: 'Intégration', icon: '👋', color: 'bg-green-100 text-green-800' },
    { value: 'offboarding', label: 'Départ', icon: '👋', color: 'bg-red-100 text-red-800' },
    { value: 'leave', label: 'Congés', icon: '🏖️', color: 'bg-blue-100 text-blue-800' },
    { value: 'performance', label: 'Performance', icon: '📊', color: 'bg-purple-100 text-purple-800' },
    { value: 'disciplinary', label: 'Disciplinaire', icon: '⚖️', color: 'bg-orange-100 text-orange-800' },
    { value: 'training', label: 'Formation', icon: '🎓', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'safety', label: 'Sécurité', icon: '🛡️', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'other', label: 'Autre', icon: '📋', color: 'bg-gray-100 text-gray-800' }
  ]

  const roles = [
    'Directeur Général',
    'Manager RH',
    'Responsable Département',
    'Employé',
    'Stagiaire',
    'Consultant',
    'Tous les rôles'
  ]

  const priorities = [
    { value: 'low', label: 'Faible', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Moyenne', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'Élevée', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critique', color: 'bg-red-100 text-red-800' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('✅ Procédure créée:', formData)
      router.push('/dashboard/hr/administration')
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error)
    } finally {
      setLoading(false)
    }
  }

  const addStep = () => {
    const newStep = {
      id: Date.now().toString(),
      title: '',
      description: '',
      responsible: '',
      duration: '',
      mandatory: true
    }
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
  }

  const updateStep = (stepId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, [field]: value } : step
      )
    }))
  }

  const removeStep = (stepId: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }))
  }

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      applicableRoles: prev.applicableRoles.includes(role)
        ? prev.applicableRoles.filter(r => r !== role)
        : [...prev.applicableRoles, role]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Back Button - Top of page */}
      <div className="flex items-center justify-start">
        <Link
          href="/dashboard/hr/administration"
          className="flex items-center bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg border border-blue-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour à l'administration
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8" />
            📋 Nouvelle Procédure RH
          </h1>
          <p className="text-indigo-100 text-lg">Créez une nouvelle procédure administrative</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📝 Informations générales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la procédure *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Procédure d'intégration des nouveaux employés"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'entrée en vigueur
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de révision
              </label>
              <input
                type="date"
                value={formData.reviewDate}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Décrivez l'objectif et le contexte de cette procédure..."
              />
            </div>
          </div>
        </div>

        {/* Rôles applicables */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            👥 Rôles concernés
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {roles.map(role => (
              <label key={role} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.applicableRoles.includes(role)}
                  onChange={() => toggleRole(role)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Étapes de la procédure */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              🔄 Étapes de la procédure
            </h2>
            <button
              type="button"
              onClick={addStep}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              ➕ Ajouter une étape
            </button>
          </div>

          <div className="space-y-4">
            {formData.steps.map((step, index) => (
              <div key={step.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Étape {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️ Supprimer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre de l'étape
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex: Préparation du poste de travail"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable
                    </label>
                    <input
                      type="text"
                      value={step.responsible}
                      onChange={(e) => updateStep(step.id, 'responsible', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex: Manager RH"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durée estimée
                    </label>
                    <input
                      type="text"
                      value={step.duration}
                      onChange={(e) => updateStep(step.id, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ex: 30 minutes"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={step.mandatory}
                      onChange={(e) => updateStep(step.id, 'mandatory', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Étape obligatoire
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description de l'étape
                    </label>
                    <textarea
                      value={step.description}
                      onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Décrivez en détail cette étape..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {formData.steps.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucune étape définie. Cliquez sur "Ajouter une étape" pour commencer.</p>
              </div>
            )}
          </div>
        </div>

        {/* Approbation */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            ✅ Processus d'approbation
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.approvalRequired}
                onChange={(e) => setFormData(prev => ({ ...prev, approvalRequired: e.target.checked }))}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium">Cette procédure nécessite une approbation</span>
            </label>

            {formData.approvalRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approbateurs (un par ligne)
                </label>
                <textarea
                  value={formData.approvers.join('\n')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    approvers: e.target.value.split('\n').filter(a => a.trim()) 
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Directeur Général&#10;Manager RH&#10;Responsable Qualité"
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 bg-white rounded-xl border p-6">
          <Link
            href="/dashboard/hr/administration"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading || !formData.title}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {loading ? 'Création...' : 'Créer la procédure'}
          </button>
        </div>
      </form>
    </div>
  )
}
