'use client'

import { useState } from 'react'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Target,
  PlayCircle
} from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  startDate: string
  endDate: string
  progress: number
  budget: number
  spent: number
  teamMembers: string[]
  tasks: Task[]
}

interface Task {
  id: string
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  assignee: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Expansion Route Chine-Maroc',
    description: 'Développement nouvelle ligne logistique vers Casablanca',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    progress: 65,
    budget: 15000000,
    spent: 8500000,
    teamMembers: ['Marie Diallo', 'Amadou Ba', 'Fatou Sall'],
    tasks: [
      {
        id: '1',
        title: 'Étude de marché Maroc',
        status: 'COMPLETED',
        assignee: 'Marie Diallo',
        dueDate: '2024-02-01',
        priority: 'HIGH'
      },
      {
        id: '2',
        title: 'Négociation partenaires locaux',
        status: 'IN_PROGRESS',
        assignee: 'Amadou Ba',
        dueDate: '2024-02-15',
        priority: 'HIGH'
      }
    ]
  },
  {
    id: '2',
    name: 'Digitalisation Processus',
    description: 'Automatisation des processus de suivi des colis',
    status: 'PLANNING',
    priority: 'MEDIUM',
    startDate: '2024-02-01',
    endDate: '2024-05-15',
    progress: 15,
    budget: 8000000,
    spent: 1200000,
    teamMembers: ['Ibrahima Diop', 'Aissatou Kane'],
    tasks: []
  }
]

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'tasks'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100'
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100'
      case 'PLANNING': return 'text-yellow-600 bg-yellow-100'
      case 'ON_HOLD': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-100'
      case 'HIGH': return 'text-orange-600 bg-orange-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'LOW': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const projectStats = {
    total: mockProjects.length,
    inProgress: mockProjects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: mockProjects.filter(p => p.status === 'COMPLETED').length,
    totalBudget: mockProjects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: mockProjects.reduce((sum, p) => sum + p.spent, 0)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <FolderOpen className="h-10 w-10" />
                📋 Gestion de Projets
              </h1>
              <p className="text-indigo-100 text-lg">
                Suivi et gestion de vos projets d'entreprise
              </p>
            </div>
            <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg">
              <Plus className="h-5 w-5" />
              Nouveau Projet
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">📊 Projets Actifs</p>
              <p className="text-2xl font-bold text-blue-900">{projectStats.inProgress}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <PlayCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">✅ Terminés</p>
              <p className="text-2xl font-bold text-green-900">{projectStats.completed}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">💰 Budget Total</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(projectStats.totalBudget)}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">💸 Dépensé</p>
              <p className="text-2xl font-bold text-orange-900">{formatCurrency(projectStats.totalSpent)}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Vue d'ensemble
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'projects' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FolderOpen className="h-4 w-4 inline mr-2" />
          Projets ({mockProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'tasks' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CheckCircle className="h-4 w-4 inline mr-2" />
          Tâches
        </button>
      </div>

      {/* Content */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Filtres */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="PLANNING">Planification</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="COMPLETED">Terminé</option>
                <option value="ON_HOLD">En pause</option>
              </select>
            </div>
          </div>

          {/* Liste des projets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status === 'IN_PROGRESS' ? 'En cours' : 
                       project.status === 'COMPLETED' ? 'Terminé' : 
                       project.status === 'PLANNING' ? 'Planification' : 'En pause'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                      {project.priority === 'HIGH' ? 'Haute' : 
                       project.priority === 'MEDIUM' ? 'Moyenne' : 
                       project.priority === 'URGENT' ? 'Urgente' : 'Basse'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm font-medium text-indigo-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Budget */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(project.budget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Dépensé</p>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(project.spent)}</p>
                  </div>
                </div>

                {/* Team & Dates */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {project.teamMembers.length} membres
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(project.endDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Progression des Projets</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
              <p className="text-gray-500">Graphique de progression</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Utilisation Budget</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
              <p className="text-gray-500">Graphique budget vs dépenses</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
