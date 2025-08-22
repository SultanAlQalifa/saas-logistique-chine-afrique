'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Settings, 
  Users, 
  Calendar, 
  Clock, 
  Target,
  TrendingUp,
  BarChart3,
  FileText,
  CheckCircle,
  AlertTriangle,
  Shield,
  Bell,
  Zap,
  Award,
  Briefcase,
  UserCheck,
  Plus,
  Eye,
  Edit3
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  department: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'completed' | 'overdue'
  dueDate: string
  progress: number
}

interface KPI {
  id: string
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  category: string
}

// Mock data
const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Évaluation annuelle employés',
    description: 'Conduire les évaluations de performance annuelles',
    assignedTo: 'Aissatou Ndiaye',
    department: 'RH',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2024-02-15',
    progress: 65
  },
  {
    id: 'task-002',
    title: 'Mise à jour politiques télétravail',
    description: 'Réviser et mettre à jour les politiques de télétravail',
    assignedTo: 'Marie Diallo',
    department: 'Administration',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-02-20',
    progress: 0
  },
  {
    id: 'task-003',
    title: 'Formation sécurité IT',
    description: 'Organiser formation sécurité informatique pour tous',
    assignedTo: 'Ousmane Traoré',
    department: 'IT',
    priority: 'high',
    status: 'completed',
    dueDate: '2024-01-30',
    progress: 100
  }
]

const mockKPIs: KPI[] = [
  {
    id: 'kpi-001',
    name: 'Taux de satisfaction',
    value: 87,
    target: 90,
    unit: '%',
    trend: 'up',
    category: 'Engagement'
  },
  {
    id: 'kpi-002',
    name: 'Temps de recrutement',
    value: 28,
    target: 30,
    unit: 'jours',
    trend: 'down',
    category: 'Recrutement'
  },
  {
    id: 'kpi-003',
    name: 'Taux de rétention',
    value: 92,
    target: 95,
    unit: '%',
    trend: 'stable',
    category: 'Rétention'
  },
  {
    id: 'kpi-004',
    name: 'Heures de formation',
    value: 45,
    target: 40,
    unit: 'h/employé',
    trend: 'up',
    category: 'Formation'
  }
]

export default function HRManagementPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'kpis' | 'tools'>('dashboard')
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<{
    type: 'info' | 'confirm' | 'form'
    title: string
    message: string
  }>({ type: 'info', title: '', message: '' })
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null)
  const [formData, setFormData] = useState<any>({})

  // Vérification du rôle SUPER_ADMIN
  if (session?.user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
          <p className="text-gray-600 mb-4">
            Cette page est réservée aux super administrateurs uniquement.
          </p>
          <p className="text-sm text-gray-500">
            Votre rôle actuel: <span className="font-semibold">{session?.user?.role || 'Non défini'}</span>
          </p>
        </div>
      </div>
    )
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'todo': return 'text-gray-600 bg-gray-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      case 'stable': return <div className="w-4 h-4 bg-gray-400 rounded-full" />
      default: return null
    }
  }

  const showModalWithContent = (type: 'info' | 'confirm' | 'form', title: string, message: string, callback?: () => void) => {
    setModalContent({ type, title, message })
    setModalCallback(() => callback || null)
    setShowModal(true)
  }

  const handleNewTask = () => {
    setFormData({})
    showModalWithContent('form', 'Nouvelle Tâche RH', '', () => {
      const taskData = {
        title: formData.title || 'Nouvelle tâche',
        assignedTo: formData.assignedTo || 'Non assignée',
        priority: formData.priority || 'Non définie',
        dueDate: formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('fr-FR') : 'Non définie'
      }
      showModalWithContent('info', 'Tâche Créée', `Nouvelle tâche "${taskData.title}" créée avec succès!\n\nAssignée à: ${taskData.assignedTo}\nPriorité: ${taskData.priority}\nÉchéance: ${taskData.dueDate}`)
    })
  }

  const handleGenerateReport = () => {
    showModalWithContent('info', 'Rapport Généré', 'Rapport RH généré avec succès!\n\n📊 Contenu du rapport:\n• Statistiques des tâches\n• Performance des équipes\n• Indicateurs KPI\n• Recommandations\n\nLe rapport a été téléchargé automatiquement.')
  }

  const completedTasks = mockTasks.filter(task => task.status === 'completed').length
  const inProgressTasks = mockTasks.filter(task => task.status === 'in_progress').length
  const overdueTasks = mockTasks.filter(task => task.status === 'overdue').length

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-slate-500 to-gray-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">⚙️ Gestion RH</h1>
            <p className="text-slate-100 text-lg">Outils de gestion et pilotage des ressources humaines</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleNewTask}
              className="bg-white text-slate-600 hover:bg-slate-50 font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Nouvelle Tâche
            </button>
            <button 
              onClick={handleGenerateReport}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 border border-white/30"
            >
              <BarChart3 className="h-4 w-4" />
              Rapport
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Tâches Actives</p>
              <p className="text-3xl font-bold text-blue-900">{mockTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Terminées</p>
              <p className="text-3xl font-bold text-green-900">{completedTasks}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">En Cours</p>
              <p className="text-3xl font-bold text-yellow-900">{inProgressTasks}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">En Retard</p>
              <p className="text-3xl font-bold text-red-900">{overdueTasks}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-slate-500 text-slate-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Tableau de Bord
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tasks'
                  ? 'border-slate-500 text-slate-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Tâches ({mockTasks.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('kpis')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'kpis'
                  ? 'border-slate-500 text-slate-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                KPIs ({mockKPIs.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tools'
                  ? 'border-slate-500 text-slate-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Outils
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Vue d'ensemble</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Tâches Prioritaires</h3>
                  <div className="space-y-4">
                    {mockTasks.filter(task => task.priority === 'high').map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500">{task.assignedTo}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-red-600 font-medium">
                            {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-xs text-gray-500">{task.progress}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">KPIs Clés</h3>
                  <div className="space-y-4">
                    {mockKPIs.slice(0, 4).map((kpi) => (
                      <div key={kpi.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTrendIcon(kpi.trend)}
                          <span className="text-gray-700">{kpi.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {kpi.value}{kpi.unit}
                          </div>
                          <div className="text-xs text-gray-500">
                            Objectif: {kpi.target}{kpi.unit}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Actions Rapides</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => showModalWithContent('info', 'Gestion Équipe', 'Module de gestion d\'équipe activé!\n\n👥 Fonctionnalités disponibles:\n• Affectation des tâches\n• Suivi des performances\n• Gestion des équipes\n• Évaluations collaboratives')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
                  >
                    <Users className="h-8 w-8 text-blue-600" />
                    <span className="font-medium">Gestion Équipe</span>
                  </button>
                  
                  <button 
                    onClick={() => showModalWithContent('info', 'Planning RH', 'Module de planning activé!\n\n📅 Fonctionnalités disponibles:\n• Planification des congés\n• Gestion des horaires\n• Calendrier des formations\n• Suivi des absences')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
                  >
                    <Calendar className="h-8 w-8 text-green-600" />
                    <span className="font-medium">Planning</span>
                  </button>
                  
                  <button 
                    onClick={handleGenerateReport}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
                  >
                    <FileText className="h-8 w-8 text-purple-600" />
                    <span className="font-medium">Rapports</span>
                  </button>
                  
                  <button 
                    onClick={() => showModalWithContent('info', 'Notifications RH', 'Centre de notifications activé!\n\n🔔 Notifications récentes:\n• 3 nouvelles candidatures\n• 2 évaluations en attente\n• 1 formation à planifier\n• 5 congés à approuver')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
                  >
                    <Bell className="h-8 w-8 text-orange-600" />
                    <span className="font-medium">Notifications</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Gestion des Tâches</h2>
                <button 
                  onClick={handleNewTask}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle Tâche
                </button>
              </div>

              <div className="space-y-4">
                {mockTasks.map((task) => (
                  <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{task.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{task.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Assigné à:</span>
                            <div>{task.assignedTo}</div>
                          </div>
                          <div>
                            <span className="font-medium">Département:</span>
                            <div>{task.department}</div>
                          </div>
                          <div>
                            <span className="font-medium">Échéance:</span>
                            <div>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</div>
                          </div>
                          <div>
                            <span className="font-medium">Progression:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{task.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <div className="flex items-center gap-2 mt-4">
                          <button 
                            onClick={() => showModalWithContent('info', 'Détails de la Tâche', `📋 ${task.title}\n\n📝 Description:\n${task.description}\n\n👤 Assignée à: ${task.assignedTo}\n🏢 Département: ${task.department}\n⚡ Priorité: ${task.priority}\n📅 Échéance: ${new Date(task.dueDate).toLocaleDateString('fr-FR')}\n📊 Progression: ${task.progress}%\n🔄 Statut: ${task.status}`)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setFormData({
                                taskId: task.id,
                                currentTitle: task.title,
                                currentDescription: task.description,
                                currentAssignedTo: task.assignedTo,
                                currentPriority: task.priority,
                                currentDueDate: task.dueDate
                              })
                              showModalWithContent('form', 'Modifier la Tâche', '', () => {
                                showModalWithContent('info', 'Tâche Modifiée', `Tâche "${formData.newTitle || task.title}" modifiée avec succès!\n\n✅ Modifications appliquées:\n• Titre: ${formData.newTitle || 'Inchangé'}\n• Assignation: ${formData.newAssignedTo || 'Inchangée'}\n• Priorité: ${formData.newPriority || 'Inchangée'}\n• Échéance: ${formData.newDueDate || 'Inchangée'}`)
                              })
                            }}
                            className="text-green-600 hover:text-green-900 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'kpis' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Indicateurs de Performance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockKPIs.map((kpi) => (
                  <div key={kpi.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-gray-900">{kpi.name}</h3>
                      {getTrendIcon(kpi.trend)}
                    </div>
                    
                    <div className="flex items-end gap-4 mb-4">
                      <div className="text-3xl font-bold text-slate-600">
                        {kpi.value}{kpi.unit}
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        / {kpi.target}{kpi.unit}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progression</span>
                        <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-slate-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Catégorie: {kpi.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Outils de Gestion</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Évaluations</h3>
                  <p className="text-gray-600 text-sm mb-4">Système d'évaluation des performances employés</p>
                  <button 
                    onClick={() => showModalWithContent('info', 'Évaluations RH', 'Module d\'évaluations activé!\n\n⭐ Fonctionnalités disponibles:\n• Évaluations 360°\n• Grilles de compétences\n• Objectifs individuels\n• Suivi des performances\n• Rapports d\'évaluation')}
                    className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Accéder
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Planning</h3>
                  <p className="text-gray-600 text-sm mb-4">Gestion des plannings et congés</p>
                  <button 
                    onClick={() => showModalWithContent('info', 'Planning RH', 'Module de planning activé!\n\n📅 Fonctionnalités disponibles:\n• Planification des congés\n• Gestion des horaires\n• Calendrier des formations\n• Suivi des absences\n• Planning des équipes')}
                    className="w-full bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Accéder
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Reconnaissance</h3>
                  <p className="text-gray-600 text-sm mb-4">Programme de reconnaissance et récompenses</p>
                  <button 
                    onClick={() => showModalWithContent('info', 'Programme de Reconnaissance', 'Module de reconnaissance activé!\n\n🏆 Fonctionnalités disponibles:\n• Système de récompenses\n• Badges de mérite\n• Reconnaissance par les pairs\n• Programmes d\'incentives\n• Suivi des performances')}
                    className="w-full bg-purple-50 text-purple-600 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    Accéder
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Automatisation</h3>
                  <p className="text-gray-600 text-sm mb-4">Workflows et processus automatisés</p>
                  <button 
                    onClick={() => showModalWithContent('info', 'Automatisation RH', 'Module d\'automatisation activé!\n\n⚡ Workflows disponibles:\n• Onboarding automatique\n• Rappels d\'évaluations\n• Notifications de congés\n• Processus de recrutement\n• Génération de rapports')}
                    className="w-full bg-orange-50 text-orange-600 py-2 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    Accéder
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                    <Bell className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Alertes</h3>
                  <p className="text-gray-600 text-sm mb-4">Système d'alertes et notifications</p>
                  <button 
                    onClick={() => showModalWithContent('info', 'Système d\'Alertes', 'Centre d\'alertes activé!\n\n🚨 Types d\'alertes:\n• Échéances de contrats\n• Congés en attente\n• Évaluations dues\n• Formations obligatoires\n• Incidents RH')}
                    className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Accéder
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Rapports</h3>
                  <p className="text-gray-600 text-sm mb-4">Génération de rapports personnalisés</p>
                  <button 
                    onClick={handleGenerateReport}
                    className="w-full bg-gray-50 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Accéder
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal personnalisé */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{modalContent.title}</h3>
              
              {modalContent.type === 'form' ? (
                <div className="space-y-4">
                  {modalContent.title.includes('Nouvelle Tâche') ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titre de la tâche *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Évaluation des performances Q1"
                          value={formData.title || ''}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          placeholder="Description détaillée de la tâche..."
                          value={formData.description || ''}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assigné à *
                        </label>
                        <select
                          value={formData.assignedTo || ''}
                          onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          required
                        >
                          <option value="">Sélectionner une personne</option>
                          <option value="Aissatou Ndiaye">Aissatou Ndiaye</option>
                          <option value="Marie Diallo">Marie Diallo</option>
                          <option value="Ousmane Traoré">Ousmane Traoré</option>
                          <option value="Ibrahim Sow">Ibrahim Sow</option>
                          <option value="Fatou Keita">Fatou Keita</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priorité *
                        </label>
                        <select
                          value={formData.priority || ''}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          required
                        >
                          <option value="">Sélectionner une priorité</option>
                          <option value="low">Faible</option>
                          <option value="medium">Moyenne</option>
                          <option value="high">Élevée</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date d'échéance *
                        </label>
                        <input
                          type="date"
                          value={formData.dueDate || ''}
                          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </>
                  ) : modalContent.title.includes('Modifier') ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouveau titre
                        </label>
                        <input
                          type="text"
                          placeholder={formData.currentTitle}
                          value={formData.newTitle || ''}
                          onChange={(e) => setFormData({...formData, newTitle: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelle description
                        </label>
                        <textarea
                          placeholder={formData.currentDescription}
                          value={formData.newDescription || ''}
                          onChange={(e) => setFormData({...formData, newDescription: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelle assignation
                        </label>
                        <select
                          value={formData.newAssignedTo || ''}
                          onChange={(e) => setFormData({...formData, newAssignedTo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        >
                          <option value="">Garder l'assignation actuelle</option>
                          <option value="Aissatou Ndiaye">Aissatou Ndiaye</option>
                          <option value="Marie Diallo">Marie Diallo</option>
                          <option value="Ousmane Traoré">Ousmane Traoré</option>
                          <option value="Ibrahim Sow">Ibrahim Sow</option>
                          <option value="Fatou Keita">Fatou Keita</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelle priorité
                        </label>
                        <select
                          value={formData.newPriority || ''}
                          onChange={(e) => setFormData({...formData, newPriority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        >
                          <option value="">Garder la priorité actuelle</option>
                          <option value="low">Faible</option>
                          <option value="medium">Moyenne</option>
                          <option value="high">Élevée</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelle échéance
                        </label>
                        <input
                          type="date"
                          value={formData.newDueDate || ''}
                          onChange={(e) => setFormData({...formData, newDueDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              ) : (
                <div className="text-gray-700 whitespace-pre-line">
                  {modalContent.message}
                </div>
              )}
              
              <div className="flex gap-3 mt-6">
                {modalContent.type === 'confirm' ? (
                  <>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        if (modalCallback) {
                          modalCallback()
                        }
                        setShowModal(false)
                      }}
                      className="flex-1 px-4 py-2 text-white bg-slate-600 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                    >
                      Confirmer
                    </button>
                  </>
                ) : modalContent.type === 'form' ? (
                  <>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        if (modalCallback) {
                          modalCallback()
                        }
                        setShowModal(false)
                      }}
                      className="flex-1 px-4 py-2 text-white bg-slate-600 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                    >
                      {modalContent.title.includes('Nouvelle') ? 'Créer' : 'Mettre à jour'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-2 text-white bg-slate-600 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                  >
                    Fermer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
