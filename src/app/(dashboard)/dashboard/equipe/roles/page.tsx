'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  UserCheck,
  Crown,
  Save,
  X,
  AlertTriangle
} from 'lucide-react'

export default function EquipeRolesPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [newRole, setNewRole] = useState('')

  // Vérifier si l'utilisateur est ADMIN ou SUPER_ADMIN
  const isAuthorized = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  // Rôles disponibles pour une entreprise
  const companyRoles = [
    { id: 'admin', name: 'Admin Entreprise', description: 'Gestion complète de l\'entreprise', color: 'from-blue-500 to-indigo-600' },
    { id: 'manager', name: 'Manager', description: 'Gestion d\'équipe et supervision', color: 'from-green-500 to-emerald-600' },
    { id: 'agent', name: 'Agent', description: 'Gestion des colis et clients', color: 'from-purple-500 to-violet-600' },
    { id: 'receptionniste', name: 'Réceptionniste Colis', description: 'Réception et traitement des colis', color: 'from-yellow-500 to-orange-600' },
    { id: 'distributeur', name: 'Distributeur Colis', description: 'Distribution et livraison des colis', color: 'from-red-500 to-pink-600' },
    { id: 'comptable', name: 'Comptable', description: 'Gestion financière et facturation', color: 'from-cyan-500 to-blue-600' },
    { id: 'commercial', name: 'Commercial', description: 'Prospection et vente', color: 'from-teal-500 to-green-600' },
    { id: 'support', name: 'Support Client', description: 'Assistance et support client', color: 'from-indigo-500 to-purple-600' }
  ]

  // Mock data pour les employés de l'entreprise
  const [employees, setEmployees] = useState([
    {
      id: 'EMP-001',
      name: 'Marie Kouassi',
      email: 'marie@entreprise.com',
      role: 'admin',
      department: 'Direction',
      status: 'active',
      joinDate: '2024-01-01',
      lastLogin: '2024-01-15'
    },
    {
      id: 'EMP-002',
      name: 'Ibrahim Traoré',
      email: 'ibrahim@entreprise.com',
      role: 'manager',
      department: 'Opérations',
      status: 'active',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-14'
    },
    {
      id: 'EMP-003',
      name: 'Fatou Diallo',
      email: 'fatou@entreprise.com',
      role: 'receptionniste',
      department: 'Logistique',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-13'
    },
    {
      id: 'EMP-004',
      name: 'Moussa Sanogo',
      email: 'moussa@entreprise.com',
      role: 'distributeur',
      department: 'Livraison',
      status: 'active',
      joinDate: '2024-01-12',
      lastLogin: '2024-01-12'
    },
    {
      id: 'EMP-005',
      name: 'Aminata Kone',
      email: 'aminata@entreprise.com',
      role: 'agent',
      department: 'Service Client',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-11'
    }
  ])

  // Si pas autorisé, afficher message d'accès refusé
  if (session && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            Cette page est réservée aux Administrateurs d'entreprise.
          </p>
        </div>
      </div>
    )
  }

  // Si la session n'est pas encore chargée
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const getRoleInfo = (roleId: string) => {
    return companyRoles.find(role => role.id === roleId) || companyRoles[0]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoleInfo(employee.role).name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRoleChange = (employeeId: string, newRoleId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, role: newRoleId } : emp
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">👥 Gestion des Rôles Équipe</h1>
            <p className="text-blue-100 text-lg">Attribuez des rôles à vos employés selon leurs responsabilités</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Nouvel Employé
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Employés</p>
              <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Rôles Disponibles</p>
              <p className="text-2xl font-bold text-green-900">{companyRoles.length}</p>
            </div>
            <Crown className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Actifs</p>
              <p className="text-2xl font-bold text-purple-900">{employees.filter(e => e.status === 'active').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">Départements</p>
              <p className="text-2xl font-bold text-yellow-900">{new Set(employees.map(e => e.department)).size}</p>
            </div>
            <UserCheck className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Rôles Disponibles */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rôles Disponibles dans votre Entreprise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companyRoles.map((role) => (
            <div key={role.id} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className={`bg-gradient-to-r ${role.color} p-3 rounded-lg mb-3 w-fit`}>
                <Crown className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{role.name}</h3>
              <p className="text-xs text-gray-600">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gestion des Employés */}
      <div className="bg-white rounded-2xl shadow-xl">
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Employés et leurs Rôles</h2>
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 hover:shadow-lg transition-all duration-200">
                <Download className="h-4 w-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle Actuel</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => {
                  const roleInfo = getRoleInfo(employee.role)
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 bg-gradient-to-r ${roleInfo.color} rounded-full flex items-center justify-center mr-4`}>
                            <UserCheck className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={employee.role}
                          onChange={(e) => handleRoleChange(employee.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {companyRoles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          <CheckCircle className="h-3 w-3" />
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
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
    </div>
  )
}
