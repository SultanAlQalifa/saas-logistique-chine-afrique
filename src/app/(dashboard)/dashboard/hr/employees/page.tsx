'use client'

import { useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useCompanyEmployees, usePermissions } from '@/hooks/usePermissions'
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Building2,
  AlertTriangle,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import Link from 'next/link'

export default function EmployeesPage() {
  const { data: session } = useSession()
  const { hasPermission, canAccessResource, isCompanyScoped, userRole } = usePermissions()
  const { employees, canViewEmployees, canManageEmployees } = useCompanyEmployees()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  // Vérification des permissions d'accès
  if (!canViewEmployees) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à la gestion des employés.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Votre rôle: <span className="font-medium text-gray-700">{userRole}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  // Statistiques des employés pour l'entreprise
  const employeeStats = useMemo(() => {
    const total = employees.length
    const active = employees.filter(e => e.status === 'ACTIVE').length
    const onLeave = employees.filter(e => e.status === 'ON_LEAVE').length
    const departments = Array.from(new Set(employees.map(e => e.department))).length
    
    return { total, active, onLeave, departments }
  }, [employees])

  const departments = Array.from(new Set(employees.map(emp => emp.department)))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-red-100 text-red-800'
      case 'ON_LEAVE':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return CheckCircle
      case 'INACTIVE':
        return XCircle
      case 'ON_LEAVE':
        return Clock
      default:
        return Shield
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'AGENT':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = [
    {
      title: 'Total Employés',
      value: employeeStats.total.toString(),
      change: '+2',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      description: isCompanyScoped ? 'Employés de votre entreprise' : 'Total système'
    },
    {
      title: 'Actifs',
      value: employeeStats.active.toString(),
      change: '+1',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      description: 'Employés en activité'
    },
    {
      title: 'En Congé',
      value: employeeStats.onLeave.toString(),
      change: '0',
      icon: Clock,
      color: 'from-yellow-500 to-orange-600',
      description: 'Employés en congé'
    },
    {
      title: 'Départements',
      value: employeeStats.departments.toString(),
      change: '0',
      icon: Building2,
      color: 'from-purple-500 to-violet-600',
      description: 'Départements actifs'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {isCompanyScoped ? 'Employés de l\'Entreprise' : 'Gestion Globale des Employés'}
              </h1>
            </div>
            <p className="text-blue-100 text-lg font-medium">
              {isCompanyScoped ? 'Gérez votre équipe et les ressources humaines' : 'Administration système des employés'}
            </p>
            {isCompanyScoped && (
              <div className="flex items-center gap-2 mt-2 text-blue-200">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Données limitées à votre entreprise</span>
              </div>
            )}
          </div>
          {canManageEmployees && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-semibold py-4 px-8 rounded-2xl inline-flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              <UserPlus className="h-5 w-5" />
              Nouvel Employé
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`relative bg-white p-6 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 group overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</span>
                    <span className="text-xs text-gray-400 ml-2">ce mois</span>
                  </div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher employés..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 w-full sm:w-96 bg-gray-50 focus:bg-white transition-all duration-300 font-medium"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all duration-300 font-medium"
            >
              <option value="all">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
              <option value="ON_LEAVE">En congé</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all duration-300 font-medium"
            >
              <option value="all">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            {canManageEmployees && (
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold inline-flex items-center gap-3 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <Download className="h-5 w-5" />
                Exporter
              </button>
            )}
          </div>
        </div>

        {/* Employees Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                {canManageEmployees && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => {
                const StatusIcon = getStatusIcon(employee.status)
                return (
                  <tr key={employee.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(employee.salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        <StatusIcon className="h-3 w-3" />
                        {employee.status === 'ACTIVE' ? 'Actif' : 
                         employee.status === 'ON_LEAVE' ? 'En congé' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                        {employee.role === 'ADMIN' ? 'Admin' : 
                         employee.role === 'AGENT' ? 'Agent' : 'Employé'}
                      </span>
                    </td>
                    {canManageEmployees && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-white hover:bg-blue-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-emerald-600 hover:text-white hover:bg-emerald-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-white hover:bg-red-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun employé trouvé</p>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
