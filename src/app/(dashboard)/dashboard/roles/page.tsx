'use client'

import { useState, useMemo, lazy, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Shield, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  UserCheck,
  Settings,
  Crown,
  Key,
  AlertTriangle
} from 'lucide-react'
import { useOptimizedTable } from '@/hooks/useOptimizedData'
import { Skeleton, DashboardSkeleton, CardSkeleton, TableSkeleton } from '@/components/ui/loading-skeleton'
import { PageTransition, LoadingSpinner } from '@/components/ui/page-transition'

export default function RolesPermissionsPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'users' | 'audit'>('roles')
  const [selectedRole, setSelectedRoleForEdit] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    color: 'from-blue-500 to-indigo-600',
    permissions: [] as string[],
    level: 1,
    department: ''
  })
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUDIT-001',
      action: 'Création de rôle',
      target: 'Manager Commercial',
      user: 'Amadou Diallo',
      timestamp: '2024-01-15 14:30:25',
      details: 'Nouveau rôle créé avec 15 permissions'
    },
    {
      id: 'AUDIT-002',
      action: 'Modification permissions',
      target: 'Agent Support',
      user: 'Marie Kouassi',
      timestamp: '2024-01-14 09:15:10',
      details: 'Ajout permission "tickets.resolve"'
    },
    {
      id: 'AUDIT-003',
      action: 'Désactivation utilisateur',
      target: 'client@test.com',
      user: 'Ibrahim Traoré',
      timestamp: '2024-01-13 16:45:33',
      details: 'Compte suspendu pour violation des conditions'
    }
  ])

  // Vérifier si l'utilisateur est SUPER_ADMIN
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN'

  // Si pas SUPER_ADMIN, afficher message d'accès refusé
  if (session && !isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            Cette page est réservée aux Super Administrateurs uniquement.
            <br />
            Contactez votre administrateur système pour plus d'informations.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Votre rôle actuel: <span className="font-medium text-gray-700">{session?.user?.role}</span>
            </p>
          </div>
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

  // Mock data pour les rôles
  const roles = [
    {
      id: 'ROLE-001',
      name: 'Super Admin',
      description: 'Accès complet à toutes les fonctionnalités de la plateforme',
      users: 2,
      permissions: 45,
      color: 'from-red-500 to-pink-600',
      status: 'active',
      createdAt: '2024-01-01',
      level: 5,
      department: 'Système',
      lastModified: '2024-01-15',
      riskLevel: 'critical'
    },
    {
      id: 'ROLE-002',
      name: 'Admin Entreprise',
      description: 'Gestion complète des opérations d\'entreprise et équipes',
      users: 8,
      permissions: 35,
      color: 'from-blue-500 to-indigo-600',
      status: 'active',
      createdAt: '2024-01-05',
      level: 4,
      department: 'Direction',
      lastModified: '2024-01-18',
      riskLevel: 'high'
    },
    {
      id: 'ROLE-003',
      name: 'Manager',
      description: 'Supervision des équipes et coordination opérationnelle',
      users: 15,
      permissions: 25,
      color: 'from-green-500 to-emerald-600',
      status: 'active',
      createdAt: '2024-01-10',
      level: 3,
      department: 'Opérations',
      lastModified: '2024-01-16',
      riskLevel: 'medium'
    },
    {
      id: 'ROLE-004',
      name: 'Agent',
      description: 'Traitement des colis et service client quotidien',
      users: 42,
      permissions: 15,
      color: 'from-purple-500 to-violet-600',
      status: 'active',
      createdAt: '2024-01-15',
      level: 2,
      department: 'Service Client',
      lastModified: '2024-01-17',
      riskLevel: 'low'
    },
    {
      id: 'ROLE-005',
      name: 'Client',
      description: 'Interface client avec accès aux services de base',
      users: 234,
      permissions: 8,
      color: 'from-yellow-500 to-orange-600',
      status: 'active',
      createdAt: '2024-01-20',
      level: 1,
      department: 'Client',
      lastModified: '2024-01-19',
      riskLevel: 'minimal'
    },
    {
      id: 'ROLE-006',
      name: 'Superviseur Logistique',
      description: 'Supervision des opérations de transport et livraison',
      users: 6,
      permissions: 28,
      color: 'from-cyan-500 to-blue-600',
      status: 'active',
      createdAt: '2024-01-22',
      level: 3,
      department: 'Logistique',
      lastModified: '2024-01-22',
      riskLevel: 'medium'
    },
    {
      id: 'ROLE-007',
      name: 'Analyste Financier',
      description: 'Analyse des données financières et reporting',
      users: 4,
      permissions: 18,
      color: 'from-emerald-500 to-teal-600',
      status: 'active',
      createdAt: '2024-01-25',
      level: 2,
      department: 'Finance',
      lastModified: '2024-01-25',
      riskLevel: 'medium'
    }
  ]

  // Mock data pour les permissions
  const permissions = [
    {
      id: 'PERM-001',
      name: 'dashboard.view',
      description: 'Voir le tableau de bord',
      category: 'Dashboard',
      roles: ['Super Admin', 'Admin Entreprise', 'Manager'],
      status: 'active'
    },
    {
      id: 'PERM-002',
      name: 'users.manage',
      description: 'Gérer les utilisateurs',
      category: 'Utilisateurs',
      roles: ['Super Admin', 'Admin Entreprise'],
      status: 'active'
    },
    {
      id: 'PERM-003',
      name: 'packages.create',
      description: 'Créer des colis',
      category: 'Colis',
      roles: ['Super Admin', 'Admin Entreprise', 'Manager', 'Agent'],
      status: 'active'
    },
    {
      id: 'PERM-004',
      name: 'payments.view',
      description: 'Voir les paiements',
      category: 'Finances',
      roles: ['Super Admin', 'Admin Entreprise'],
      status: 'active'
    },
    {
      id: 'PERM-005',
      name: 'settings.modify',
      description: 'Modifier les paramètres',
      category: 'Paramètres',
      roles: ['Super Admin'],
      status: 'active'
    }
  ]

  // Mock data pour les utilisateurs avec rôles
  const usersWithRoles = [
    {
      id: 'USER-001',
      name: 'Amadou Diallo',
      email: 'amadou@saas-logistique.com',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '2024-01-15',
      avatar: null
    },
    {
      id: 'USER-002',
      name: 'Marie Kouassi',
      email: 'marie@saas-logistique.com',
      role: 'Admin Entreprise',
      status: 'active',
      lastLogin: '2024-01-14',
      avatar: null
    },
    {
      id: 'USER-003',
      name: 'Ibrahim Traoré',
      email: 'ibrahim@saas-logistique.com',
      role: 'Manager',
      status: 'active',
      lastLogin: '2024-01-13',
      avatar: null
    }
  ]

  const stats = [
    {
      title: 'Rôles Actifs',
      value: '7',
      change: '+2',
      icon: Crown,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50'
    },
    {
      title: 'Permissions',
      value: '52',
      change: '+7',
      icon: Key,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'Utilisateurs',
      value: '311',
      change: '+22',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Score Sécurité',
      value: '99.2%',
      change: '+0.7%',
      icon: Shield,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'from-cyan-50 to-blue-50'
    }
  ]

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

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'minimal':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedRoles.length === 0) {
      alert('Veuillez sélectionner au moins un rôle')
      return
    }
    
    const roleNames = selectedRoles.map(id => 
      roles.find(r => r.id === id)?.name
    ).join(', ')
    
    switch (action) {
      case 'activate':
        if (confirm(`Activer les rôles sélectionnés : ${roleNames} ?`)) {
          alert(`✅ ${selectedRoles.length} rôle(s) activé(s) avec succès !`)
          setSelectedRoles([])
        }
        break
      case 'deactivate':
        if (confirm(`Désactiver les rôles sélectionnés : ${roleNames} ?`)) {
          alert(`⏸️ ${selectedRoles.length} rôle(s) désactivé(s) avec succès !`)
          setSelectedRoles([])
        }
        break
      case 'export':
        const csvContent = roles
          .filter(role => selectedRoles.includes(role.id))
          .map(role => `${role.name},${role.description},${role.users},${role.permissions},${role.department},${role.status}`)
          .join('\n')
        const blob = new Blob([`Nom,Description,Utilisateurs,Permissions,Département,Statut\n${csvContent}`], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `roles_selection_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        alert(`📊 Export CSV généré pour ${selectedRoles.length} rôle(s) !`)
        break
      case 'delete':
        if (confirm(`⚠️ ATTENTION : Supprimer définitivement les rôles : ${roleNames} ?\n\nCette action est irréversible et affectera tous les utilisateurs associés.`)) {
          alert(`🗑️ ${selectedRoles.length} rôle(s) supprimé(s) avec succès !`)
          setSelectedRoles([])
        }
        break
    }
  }

  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  const selectAllRoles = () => {
    setSelectedRoles(selectedRoles.length === filteredRoles.length ? [] : filteredRoles.map(r => r.id))
  }

  // Optimisation avec useMemo pour éviter les recalculs inutiles
  const filteredRoles = useMemo(() => 
    roles.filter(role => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [roles, searchTerm]
  )

  const filteredPermissions = useMemo(() =>
    permissions.filter(permission =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [permissions, searchTerm]
  )

  const filteredUsers = useMemo(() =>
    usersWithRoles.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ), [usersWithRoles, searchTerm]
  )

  // Hook pour optimiser la gestion des données des rôles
  const rolesTable = useOptimizedTable(roles, {
    searchFields: ['name', 'description'],
    itemsPerPage: 9,
    cacheKey: 'roles-table'
  })

  return (
    <PageTransition>
      <div className="space-y-8">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">🛡️ Rôles & Permissions</h1>
            </div>
            <p className="text-purple-100 text-lg font-medium">Système de contrôle d'accès avancé - Gestion centralisée des droits utilisateurs</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-semibold py-4 px-8 rounded-2xl inline-flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/20"
          >
            <Plus className="h-5 w-5" />
            Nouveau Rôle
          </button>
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
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</span>
                    <span className="text-xs text-gray-400 ml-2">ce mois</span>
                  </div>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-2 px-8 pt-6">
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-3 px-6 rounded-t-2xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'roles'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform -translate-y-1'
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Rôles ({roles.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-3 px-6 rounded-t-2xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'permissions'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg transform -translate-y-1'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Permissions ({permissions.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 px-6 rounded-t-2xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform -translate-y-1'
                  : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Utilisateurs ({usersWithRoles.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-3 px-6 rounded-t-2xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform -translate-y-1'
                  : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Audit ({auditLogs.length})
              </div>
            </button>
          </nav>
        </div>

        <div className="p-8">
          {/* Filtres et Actions */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher rôles, permissions, utilisateurs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 w-full sm:w-96 bg-gray-50 focus:bg-white transition-all duration-300 font-medium"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold inline-flex items-center gap-3 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <Download className="h-5 w-5" />
                Exporter
              </button>
              <button className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-2xl font-semibold inline-flex items-center gap-3 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <Filter className="h-5 w-5" />
                Filtres
              </button>
            </div>
          </div>

          {/* Contenu des Tabs */}
          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.map((role) => (
                <div key={role.id} className="relative bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`bg-gradient-to-br ${role.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Crown className="h-7 w-7 text-white" />
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(role.status)} shadow-sm`}>
                        {role.status}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-gray-800">{role.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{role.description}</p>
                    
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-600">{role.users} utilisateurs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-600">{role.permissions} permissions</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          setSelectedRoleForEdit(role)
                          setShowEditModal(true)
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Modifier
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedRoleForEdit(role)
                          setShowPermissionsModal(true)
                        }}
                        className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Key className="h-4 w-4" />
                        Permissions
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôles</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPermissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Key className="h-4 w-4 mr-3 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{permission.name}</div>
                            <div className="text-sm text-gray-500">{permission.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {permission.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {permission.roles.slice(0, 2).map((role, index) => (
                            <span key={index} className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                              {role}
                            </span>
                          ))}
                          {permission.roles.length > 2 && (
                            <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                              +{permission.roles.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(permission.status)}`}>
                          <CheckCircle className="h-3 w-3" />
                          {permission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-white hover:bg-blue-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-white hover:bg-red-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière Connexion</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                            <UserCheck className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          <CheckCircle className="h-3 w-3" />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-white hover:bg-blue-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-emerald-600 hover:text-white hover:bg-emerald-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-white hover:bg-red-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110">
                            <Lock className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Onglet Audit */}
          {activeTab === 'audit' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-50 to-red-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cible</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Heure</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                            <Settings className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium text-gray-900">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {log.target}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty States */}
          {((activeTab === 'roles' && filteredRoles.length === 0) ||
            (activeTab === 'permissions' && filteredPermissions.length === 0) ||
            (activeTab === 'users' && filteredUsers.length === 0) ||
            (activeTab === 'audit' && auditLogs.length === 0)) && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun résultat trouvé</p>
              <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de modification de rôle */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Modifier le rôle</h3>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all duration-300"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nom du rôle
                </label>
                <input 
                  type="text" 
                  defaultValue={selectedRole.name}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-300 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea 
                  defaultValue={selectedRole.description}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-300 font-medium resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Statut
                </label>
                <select 
                  defaultValue={selectedRole.status}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-300 font-medium"
                >
                  <option value="active">🟢 Actif</option>
                  <option value="inactive">🔴 Inactif</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-10">
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  // Ajouter un log d'audit pour la modification
                  const auditLog = {
                    id: `AUDIT-${String(auditLogs.length + 1).padStart(3, '0')}`,
                    action: 'Modification de rôle',
                    target: selectedRole.name,
                    user: session?.user?.name || 'Utilisateur',
                    timestamp: new Date().toLocaleString('fr-FR'),
                    details: `Rôle "${selectedRole.name}" modifié`
                  }
                  setAuditLogs([auditLog, ...auditLogs])
                  alert(`Rôle ${selectedRole.name} modifié avec succès !`)
                  setShowEditModal(false)
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion des permissions */}
      {showPermissionsModal && selectedRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Permissions</h3>
                  <p className="text-gray-600">{selectedRole.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPermissionsModal(false)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all duration-300"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {selectedRole.permissions} permissions actuellement assignées
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Catégories de permissions */}
              {[
                { name: 'Administration', permissions: ['Gestion des utilisateurs', 'Configuration système', 'Accès aux logs'] },
                { name: 'Finances', permissions: ['Voir les rapports', 'Gérer les factures', 'Accès comptabilité'] },
                { name: 'Opérations', permissions: ['Gérer les colis', 'Suivi des expéditions', 'Gestion des clients'] },
                { name: 'Support', permissions: ['Accès aux tickets', 'Chat client', 'Base de connaissances'] }
              ].map((category) => (
                <div key={category.name} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{category.name}</h4>
                  <div className="space-y-2">
                    {category.permissions.map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input 
                          type="checkbox" 
                          defaultChecked={Math.random() > 0.5}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => setShowPermissionsModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  // Ajouter un log d'audit pour la modification des permissions
                  const auditLog = {
                    id: `AUDIT-${String(auditLogs.length + 1).padStart(3, '0')}`,
                    action: 'Modification permissions',
                    target: selectedRole.name,
                    user: session?.user?.name || 'Utilisateur',
                    timestamp: new Date().toLocaleString('fr-FR'),
                    details: `Permissions du rôle "${selectedRole.name}" mises à jour`
                  }
                  setAuditLogs([auditLog, ...auditLogs])
                  alert(`Permissions du rôle ${selectedRole.name} mises à jour !`)
                  setShowPermissionsModal(false)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de nouveau rôle */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Créer un nouveau rôle</h3>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false)
                  setNewRole({ name: '', description: '', color: 'from-blue-500 to-indigo-600', permissions: [], level: 1, department: '' })
                }}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all duration-300"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du rôle *
                  </label>
                  <input 
                    type="text" 
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    placeholder="Ex: Manager Commercial"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur du rôle
                  </label>
                  <select 
                    value={newRole.color}
                    onChange={(e) => setNewRole({...newRole, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="from-blue-500 to-indigo-600">🔵 Bleu</option>
                    <option value="from-green-500 to-emerald-600">🟢 Vert</option>
                    <option value="from-purple-500 to-violet-600">🟣 Violet</option>
                    <option value="from-red-500 to-pink-600">🔴 Rouge</option>
                    <option value="from-yellow-500 to-orange-600">🟡 Orange</option>
                    <option value="from-cyan-500 to-blue-600">🔵 Cyan</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea 
                  value={newRole.description}
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  placeholder="Décrivez les responsabilités de ce rôle..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Permissions du rôle
                </label>
                <div className="space-y-4">
                  {[
                    { 
                      category: 'Administration', 
                      permissions: [
                        { id: 'admin.users.manage', name: 'Gestion des utilisateurs' },
                        { id: 'admin.system.config', name: 'Configuration système' },
                        { id: 'admin.logs.view', name: 'Accès aux logs' }
                      ]
                    },
                    { 
                      category: 'Finances', 
                      permissions: [
                        { id: 'finance.reports.view', name: 'Voir les rapports' },
                        { id: 'finance.invoices.manage', name: 'Gérer les factures' },
                        { id: 'finance.accounting.access', name: 'Accès comptabilité' }
                      ]
                    },
                    { 
                      category: 'Opérations', 
                      permissions: [
                        { id: 'ops.packages.manage', name: 'Gérer les colis' },
                        { id: 'ops.tracking.view', name: 'Suivi des expéditions' },
                        { id: 'ops.clients.manage', name: 'Gestion des clients' }
                      ]
                    },
                    { 
                      category: 'Support', 
                      permissions: [
                        { id: 'support.tickets.access', name: 'Accès aux tickets' },
                        { id: 'support.chat.client', name: 'Chat client' },
                        { id: 'support.kb.manage', name: 'Base de connaissances' }
                      ]
                    }
                  ].map((category) => (
                    <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">{category.category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {category.permissions.map((permission) => (
                          <label key={permission.id} className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={newRole.permissions.includes(permission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRole({...newRole, permissions: [...newRole.permissions, permission.id]})
                                } else {
                                  setNewRole({...newRole, permissions: newRole.permissions.filter(p => p !== permission.id)})
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">{permission.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => {
                  setShowAddModal(false)
                  setNewRole({ name: '', description: '', color: 'from-blue-500 to-indigo-600', permissions: [], level: 1, department: '' })
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  if (newRole.name && newRole.description) {
                    // Ajouter le nouveau rôle à la liste
                    const roleId = `ROLE-${String(roles.length + 1).padStart(3, '0')}`
                    const newRoleData = {
                      id: roleId,
                      name: newRole.name,
                      description: newRole.description,
                      users: 0,
                      permissions: newRole.permissions.length,
                      color: newRole.color,
                      status: 'active',
                      createdAt: new Date().toISOString().split('T')[0]
                    }
                    
                    // Ajouter un log d'audit
                    const auditLog = {
                      id: `AUDIT-${String(auditLogs.length + 1).padStart(3, '0')}`,
                      action: 'Création de rôle',
                      target: newRole.name,
                      user: session?.user?.name || 'Utilisateur',
                      timestamp: new Date().toLocaleString('fr-FR'),
                      details: `Nouveau rôle créé avec ${newRole.permissions.length} permissions`
                    }
                    
                    setAuditLogs([auditLog, ...auditLogs])
                    alert(`Rôle "${newRole.name}" créé avec succès !`)
                    setShowAddModal(false)
                    setNewRole({ name: '', description: '', color: 'from-blue-500 to-indigo-600', permissions: [], level: 1, department: '' })
                  } else {
                    alert('Veuillez remplir tous les champs obligatoires')
                  }
                }}
                disabled={!newRole.name || !newRole.description}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Créer le rôle
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PageTransition>
  )
}
