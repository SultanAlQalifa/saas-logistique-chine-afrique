'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building, 
  FileText, 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Edit, 
  Download,
  Upload,
  Calendar,
  User,
  Award,
  Target,
  BarChart3,
  Settings,
  Bell,
  Lock,
  Globe,
  Briefcase,
  Plus
} from 'lucide-react'

interface Policy {
  id: string
  title: string
  category: string
  description: string
  version: string
  status: 'active' | 'draft' | 'review' | 'archived'
  lastUpdated: string
  updatedBy: string
  effectiveDate: string
  reviewDate: string
  approvedBy: string
  departments: string[]
  mandatory: boolean
  acknowledgments: number
  totalEmployees: number
}

interface Compliance {
  id: string
  regulation: string
  description: string
  status: 'compliant' | 'partial' | 'non_compliant' | 'pending'
  lastAudit: string
  nextAudit: string
  responsible: string
  actions: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

const mockPolicies: Policy[] = [
  {
    id: 'pol-001',
    title: 'Code de Conduite Professionnelle',
    category: 'Éthique',
    description: 'Règles de conduite et d\'éthique professionnelle pour tous les employés',
    version: '2.1',
    status: 'active',
    lastUpdated: '2024-01-15',
    updatedBy: 'Sekou Toure',
    effectiveDate: '2024-02-01',
    reviewDate: '2024-08-01',
    approvedBy: 'Mariam Traore',
    departments: ['Tous'],
    mandatory: true,
    acknowledgments: 12,
    totalEmployees: 15
  },
  {
    id: 'pol-002',
    title: 'Politique de Télétravail',
    category: 'Organisation',
    description: 'Conditions et modalités du travail à distance',
    version: '1.3',
    status: 'active',
    lastUpdated: '2024-01-10',
    updatedBy: 'Sekou Toure',
    effectiveDate: '2024-01-15',
    reviewDate: '2024-07-15',
    approvedBy: 'Amadou Diallo',
    departments: ['Technique', 'Commercial', 'Support'],
    mandatory: false,
    acknowledgments: 8,
    totalEmployees: 10
  },
  {
    id: 'pol-003',
    title: 'Procédure de Sécurité Informatique',
    category: 'Sécurité',
    description: 'Mesures de sécurité pour la protection des données et systèmes',
    version: '3.0',
    status: 'review',
    lastUpdated: '2024-01-20',
    updatedBy: 'Cheikh Dieng',
    effectiveDate: '2024-03-01',
    reviewDate: '2024-09-01',
    approvedBy: 'En attente',
    departments: ['Tous'],
    mandatory: true,
    acknowledgments: 0,
    totalEmployees: 15
  }
]

const mockCompliance: Compliance[] = [
  {
    id: 'comp-001',
    regulation: 'RGPD - Protection des Données',
    description: 'Conformité au Règlement Général sur la Protection des Données',
    status: 'compliant',
    lastAudit: '2023-12-15',
    nextAudit: '2024-06-15',
    responsible: 'Sekou Toure',
    actions: ['Formation RGPD complétée', 'Registre des traitements à jour'],
    riskLevel: 'low'
  },
  {
    id: 'comp-002',
    regulation: 'Code du Travail Français',
    description: 'Respect des dispositions du droit du travail français',
    status: 'partial',
    lastAudit: '2024-01-10',
    nextAudit: '2024-04-10',
    responsible: 'Mariam Traore',
    actions: ['Mise à jour des contrats en cours', 'Formation managers requise'],
    riskLevel: 'medium'
  },
  {
    id: 'comp-003',
    regulation: 'Norme ISO 27001',
    description: 'Système de management de la sécurité de l\'information',
    status: 'pending',
    lastAudit: '2023-10-01',
    nextAudit: '2024-03-01',
    responsible: 'Cheikh Dieng',
    actions: ['Audit externe programmé', 'Documentation en cours'],
    riskLevel: 'high'
  }
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-red-100 text-red-800',
  compliant: 'bg-green-100 text-green-800',
  partial: 'bg-yellow-100 text-yellow-800',
  non_compliant: 'bg-red-100 text-red-800',
  pending: 'bg-blue-100 text-blue-800'
}

const riskColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
}

export default function AdministrationPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'policies' | 'compliance' | 'procedures'>('policies')
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)

  const handleNewPolicy = () => {
    router.push('/dashboard/hr/administration/policies/create')
  }

  const handleEditPolicy = (policyId: string) => {
    router.push(`/dashboard/hr/administration/policies/edit/${policyId}`)
  }

  const handleNewCompliance = () => {
    router.push('/dashboard/hr/administration/compliance/create')
  }

  const handleNewProcedure = () => {
    router.push('/dashboard/hr/administration/procedures/create')
  }

  const stats = {
    totalPolicies: mockPolicies.length,
    activePolicies: mockPolicies.filter(p => p.status === 'active').length,
    pendingReview: mockPolicies.filter(p => p.status === 'review').length,
    complianceRate: Math.round((mockCompliance.filter(c => c.status === 'compliant').length / mockCompliance.length) * 100),
    highRiskItems: mockCompliance.filter(c => c.riskLevel === 'high').length,
    avgAcknowledgment: Math.round(mockPolicies.reduce((acc, p) => acc + (p.acknowledgments / p.totalEmployees * 100), 0) / mockPolicies.length)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Building className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">🏛️ Administration RH</h1>
            <p className="text-red-100 text-lg">Politiques, procédures et conformité réglementaire</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalPolicies}</p>
              <p className="text-sm text-blue-500">Politiques</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.activePolicies}</p>
              <p className="text-sm text-green-500">Actives</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</p>
              <p className="text-sm text-yellow-500">En révision</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.complianceRate}%</p>
              <p className="text-sm text-purple-500">Conformité</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.highRiskItems}</p>
              <p className="text-sm text-red-500">Risques élevés</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 p-2 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-600">{stats.avgAcknowledgment}%</p>
              <p className="text-sm text-cyan-500">Adhésion moy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('policies')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'policies'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Politiques ({mockPolicies.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'compliance'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Conformité ({mockCompliance.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('procedures')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'procedures'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Procédures
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Politiques d'Entreprise</h2>
                <button 
                  onClick={handleNewPolicy}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle politique
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {mockPolicies.map((policy) => (
                      <div
                        key={policy.id}
                        className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedPolicy?.id === policy.id ? 'border-red-500 shadow-lg' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedPolicy(policy)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg text-white">
                              <FileText className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{policy.title}</h3>
                              <p className="text-gray-600">v{policy.version} • {policy.category}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[policy.status]}`}>
                            {policy.status}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{policy.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Effectif: {new Date(policy.effectiveDate).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Approuvé par: {policy.approvedBy}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {policy.acknowledgments}/{policy.totalEmployees} confirmations
                          </div>
                          <div className="flex items-center gap-2">
                            {policy.mandatory ? (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {policy.mandatory ? 'Obligatoire' : 'Optionnel'}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {policy.departments.map((dept, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>

                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(policy.acknowledgments / policy.totalEmployees) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedPolicy ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Détails Politique</h2>
                      
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-xl text-white">
                          <h3 className="font-bold text-lg">{selectedPolicy.title}</h3>
                          <p className="opacity-90">Version {selectedPolicy.version}</p>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Catégorie:</span>
                            <span className="font-medium">{selectedPolicy.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dernière MAJ:</span>
                            <span className="font-medium">{new Date(selectedPolicy.lastUpdated).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mise à jour par:</span>
                            <span className="font-medium">{selectedPolicy.updatedBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Prochaine révision:</span>
                            <span className="font-medium">{new Date(selectedPolicy.reviewDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Taux d'adhésion:</span>
                            <span className="font-medium">{Math.round((selectedPolicy.acknowledgments / selectedPolicy.totalEmployees) * 100)}%</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <button 
                            onClick={() => handleEditPolicy(selectedPolicy.id)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Modifier
                          </button>
                          <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                            <Download className="h-4 w-4" />
                            PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="text-center text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Sélectionnez une politique pour voir ses détails</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Conformité Réglementaire</h2>
                <button 
                  onClick={handleNewCompliance}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvel audit
                </button>
              </div>

              <div className="space-y-4">
                {mockCompliance.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg text-white">
                          <Shield className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{item.regulation}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                          {item.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskColors[item.riskLevel]}`}>
                          Risque {item.riskLevel}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Dernier audit: {new Date(item.lastAudit).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Prochain audit: {new Date(item.nextAudit).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Responsable: {item.responsible}
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {item.actions.length} actions
                      </div>
                    </div>

                    {item.actions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Actions en cours:</h4>
                        <div className="space-y-1">
                          {item.actions.map((action, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'procedures' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Procédures Administratives</h2>
                <button 
                  onClick={handleNewProcedure}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle procédure
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg text-white">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Onboarding</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Procédure d'intégration des nouveaux employés</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Consulter
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg text-white">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Congés</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Demande et validation des congés</p>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Consulter
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg text-white">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Incidents</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Signalement et traitement des incidents</p>
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Consulter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
