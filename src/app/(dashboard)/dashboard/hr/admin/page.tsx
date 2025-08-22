'use client'

import { useState } from 'react'
import { 
  Settings, 
  Users, 
  Building2, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Shield, 
  FileText, 
  Search, 
  Download, 
  Upload, 
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Filter
} from 'lucide-react'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  position: string
  department: string
  salary: number
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
}

interface Department {
  id: string
  name: string
  manager: string
  employeeCount: number
  budget: number
  status: 'ACTIVE' | 'INACTIVE'
}

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Diallo',
    email: 'marie.diallo@company.com',
    position: 'Responsable Logistique',
    department: 'Opérations',
    salary: 850000,
    status: 'ACTIVE',
    role: 'MANAGER'
  },
  {
    id: '2',
    firstName: 'Amadou',
    lastName: 'Ba',
    email: 'amadou.ba@company.com',
    position: 'Agent Commercial',
    department: 'Commercial',
    salary: 650000,
    status: 'ACTIVE',
    role: 'EMPLOYEE'
  }
]

const mockDepartments: Department[] = [
  { id: '1', name: 'Opérations', manager: 'Marie Diallo', employeeCount: 8, budget: 5000000, status: 'ACTIVE' },
  { id: '2', name: 'Commercial', manager: 'Amadou Ba', employeeCount: 12, budget: 7500000, status: 'ACTIVE' }
]

export default function HRAdminPage() {
  const [activeTab, setActiveTab] = useState<'employees' | 'departments' | 'policies' | 'system'>('employees')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' as 'info' | 'confirm' | 'error' | 'form', onConfirm: undefined as ((data?: any) => void) | undefined, formData: {} as any })
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100'
      case 'INACTIVE': return 'text-red-600 bg-red-100'
      case 'ON_LEAVE': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-purple-600 bg-purple-100'
      case 'MANAGER': return 'text-blue-600 bg-blue-100'
      case 'EMPLOYEE': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const handleBulkAction = (action: string) => {
    const selectedCount = selectedEmployees.length
    const employeeNames = mockEmployees
      .filter(emp => selectedEmployees.includes(emp.id))
      .map(emp => `${emp.firstName} ${emp.lastName}`)
      .join(', ')
    
    switch (action) {
      case 'activate':
        if (confirm(`Activer ${selectedCount} employé(s)?\n\n${employeeNames}`)) {
          setNotification({
            message: `✅ ${selectedCount} employé(s) activé(s) avec succès`,
            type: 'success'
          })
          setTimeout(() => setNotification(null), 4000)
        }
        break
      case 'deactivate':
        if (confirm(`Désactiver ${selectedCount} employé(s)?\n\n${employeeNames}`)) {
          setNotification({
            message: `⚠️ ${selectedCount} employé(s) désactivé(s)`,
            type: 'info'
          })
          setTimeout(() => setNotification(null), 4000)
        }
        break
      case 'change_department':
        const newDept = prompt('Nouveau département:', 'Opérations')
        if (newDept) {
          setNotification({
            message: `📋 ${selectedCount} employé(s) transféré(s) vers ${newDept}`,
            type: 'success'
          })
          setTimeout(() => setNotification(null), 4000)
        }
        break
      case 'export':
        const csvData = mockEmployees
          .filter(emp => selectedEmployees.includes(emp.id))
          .map(emp => ({
            Nom: `${emp.firstName} ${emp.lastName}`,
            Email: emp.email,
            Poste: emp.position,
            Département: emp.department,
            Salaire: emp.salary,
            Statut: emp.status
          }))
        const csvContent = "data:text/csv;charset=utf-8," + 
          Object.keys(csvData[0]).join(",") + "\n" +
          csvData.map(row => Object.values(row).join(",")).join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `employes_selectionnes.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setNotification({
          message: `📊 Export de ${selectedCount} employé(s) terminé`,
          type: 'success'
        })
        setTimeout(() => setNotification(null), 4000)
        break
      case 'delete':
        if (confirm(`⚠️ ATTENTION: Supprimer définitivement ${selectedCount} employé(s)?\n\n${employeeNames}\n\nCette action est irréversible!`)) {
          setNotification({
            message: `🗑️ ${selectedCount} employé(s) supprimé(s)`,
            type: 'error'
          })
          setTimeout(() => setNotification(null), 4000)
        }
        break
    }
    setSelectedEmployees([])
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Settings className="h-10 w-10" />
                ⚙️ Administration RH
              </h1>
              <p className="text-red-100 text-lg">
                Contrôle total de la gestion des ressources humaines
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const csvData = [...mockEmployees, ...mockDepartments.map(d => ({
                    firstName: d.name,
                    lastName: 'Département',
                    email: `${d.name.toLowerCase()}@company.com`,
                    position: 'Département',
                    department: d.name,
                    salary: d.budget,
                    status: d.status,
                    role: 'DEPARTMENT'
                  }))]
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Type,Nom,Email,Poste,Département,Budget/Salaire,Statut,Rôle\n" +
                    csvData.map(item => `${item.role === 'DEPARTMENT' ? 'Département' : 'Employé'},${item.firstName} ${item.lastName},${item.email},${item.position},${item.department},${item.salary},${item.status},${item.role}`).join("\n")
                  const encodedUri = encodeURI(csvContent)
                  const link = document.createElement("a")
                  link.setAttribute("href", encodedUri)
                  link.setAttribute("download", `export_rh_complet_${new Date().toISOString().split('T')[0]}.csv`)
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  setNotification({
                    message: `📊 Export RH complet terminé! ${mockEmployees.length} employés, ${mockDepartments.length} départements exportés`,
                    type: 'success'
                  })
                  setTimeout(() => setNotification(null), 4000)
                }}
                className="bg-white text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
              >
                <Download className="h-5 w-5" />
                Export
              </button>
              <button 
                onClick={() => {
                  const fileInput = document.createElement('input')
                  fileInput.type = 'file'
                  fileInput.accept = '.csv,.xlsx'
                  fileInput.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      setNotification({
                        message: `📥 Import terminé! 15 employés importés, 3 départements mis à jour`,
                        type: 'success'
                      })
                      setTimeout(() => setNotification(null), 4000)
                    }
                  }
                  fileInput.click()
                }}
                className="bg-white text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
              >
                <Upload className="h-5 w-5" />
                Import
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats avec drill-down */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">👥 Total Employés</p>
              <p 
                className="text-2xl font-bold text-blue-900 hover:underline"
                onClick={() => {
                  const activeEmployees = mockEmployees.filter(e => e.status === 'ACTIVE').length
                  const inactiveEmployees = mockEmployees.filter(e => e.status === 'INACTIVE').length
                  const onLeaveEmployees = mockEmployees.filter(e => e.status === 'ON_LEAVE').length
                  setModalContent({
                    title: '👥 Détails des Employés',
                    message: `Total Employés: ${mockEmployees.length}\n\n• Répartition par statut:\n  - Actifs: ${activeEmployees}\n  - Inactifs: ${inactiveEmployees}\n  - En congé: ${onLeaveEmployees}\n\n• Départements: ${mockDepartments.length}\n• Masse salariale: ${formatCurrency(mockEmployees.reduce((sum, e) => sum + e.salary, 0))}\n• Dernière MAJ: ${new Date().toLocaleString('fr-FR')}`,
                    type: 'info',
                    onConfirm: undefined,
                    formData: {}
                  })
                  setShowModal(true)
                }}
              >
                {mockEmployees.length}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-blue-500 mt-2 transition-opacity">Cliquez pour détails</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">🏢 Départements</p>
              <p 
                className="text-2xl font-bold text-green-900 hover:underline"
                onClick={() => {
                  const totalBudget = mockDepartments.reduce((sum, d) => sum + d.budget, 0)
                  const totalEmployees = mockDepartments.reduce((sum, d) => sum + d.employeeCount, 0)
                  setModalContent({
                    title: '🏢 Détails des Départements',
                    message: `Total Départements: ${mockDepartments.length}\n\n• Départements actifs: ${mockDepartments.filter(d => d.status === 'ACTIVE').length}\n• Budget total: ${formatCurrency(mockDepartments.reduce((sum, d) => sum + d.budget, 0))}\n• Employés total: ${mockDepartments.reduce((sum, d) => sum + d.employeeCount, 0)}\n\n• Répartition par département:\n${mockDepartments.map(d => `  - ${d.name}: ${d.employeeCount} employés`).join('\n')}\n\n• Dernière MAJ: ${new Date().toLocaleString('fr-FR')}`,
                    type: 'info',
                    onConfirm: undefined,
                    formData: {}
                  })
                  setShowModal(true)
                }}
              >
                {mockDepartments.length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-green-500 mt-2 transition-opacity">Voir départements</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">📋 Politiques</p>
              <p 
                className="text-2xl font-bold text-purple-900 hover:underline"
                onClick={() => {
                  setModalContent({
                    title: '📋 Détails des Politiques',
                    message: `Total Politiques: 12\n\n• Politiques actives: 10\n• En révision: 2\n• Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}\n\n• Types de politiques:\n  - Congés et absences: 4\n  - Sécurité et conformité: 3\n  - Formation et développement: 2\n  - Évaluation des performances: 2\n  - Code de conduite: 1\n\n• Prochaine révision: Mars 2024`,
                    type: 'info',
                    onConfirm: undefined,
                    formData: {}
                  })
                  setShowModal(true)
                }}
              >
                12
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-purple-500 mt-2 transition-opacity">Voir politiques</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">⚡ Actions Aujourd'hui</p>
              <p 
                className="text-2xl font-bold text-orange-900 hover:underline"
                onClick={() => {
                  setModalContent({
                    title: '⚙️ Détails du Système',
                    message: `Système RH v2.1.0\n\n• Statut: Opérationnel ✅\n• Uptime: 99.9%\n• Dernière sauvegarde: ${new Date().toLocaleString('fr-FR')}\n• Utilisateurs connectés: 23\n• Stockage utilisé: 2.3 GB / 10 GB\n\n• Modules actifs:\n  - Gestion des employés ✅\n  - Paie et avantages ✅\n  - Formation ✅\n  - Évaluations ✅\n  - Rapports ✅\n\n• Prochaine maintenance: Dimanche 3h00`,
                    type: 'info',
                    onConfirm: undefined,
                    formData: {}
                  })
                  setShowModal(true)
                }}
              >
                12
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-orange-500 mt-2 transition-opacity">Voir actions</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'employees' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Gestion Employés
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'departments' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="h-4 w-4 inline mr-2" />
          Départements
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'policies' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Politiques
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'system' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Système
        </button>
      </div>

      {/* Employees Management */}
      {activeTab === 'employees' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-red-600" />
                Gestion Complète des Employés
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    const firstName = prompt('Prénom du nouvel employé:')
                    if (firstName) {
                      const lastName = prompt('Nom de famille:')
                      if (lastName) {
                        const email = prompt('Email professionnel:')
                        if (email) {
                          const position = prompt('Poste:')
                          if (position) {
                            setNotification({
                              message: `✅ Nouvel employé ajouté: ${firstName} ${lastName}`,
                              type: 'success'
                            })
                            setTimeout(() => setNotification(null), 4000)
                          }
                        }
                      }
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
                >
                  <UserPlus className="h-4 w-4" />
                  Ajouter
                </button>
                <button 
                  onClick={() => {
                    const csvData = mockEmployees.map(emp => ({
                      Nom: `${emp.firstName} ${emp.lastName}`,
                      Email: emp.email,
                      Poste: emp.position,
                      Département: emp.department,
                      Salaire: emp.salary,
                      Statut: emp.status,
                      Rôle: emp.role
                    }))
                    const csvContent = "data:text/csv;charset=utf-8," + 
                      Object.keys(csvData[0]).join(",") + "\n" +
                      csvData.map(row => Object.values(row).join(",")).join("\n")
                    const encodedUri = encodeURI(csvContent)
                    const link = document.createElement("a")
                    link.setAttribute("href", encodedUri)
                    link.setAttribute("download", `employes_${new Date().toISOString().split('T')[0]}.csv`)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    setNotification({
                      message: `📊 Export terminé: ${mockEmployees.length} employés exportés`,
                      type: 'success'
                    })
                    setTimeout(() => setNotification(null), 4000)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200">
                <Filter className="h-4 w-4" />
                Filtres
              </button>
              {selectedEmployees.length > 0 && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBulkAction('activate')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm inline-flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Activer ({selectedEmployees.length})
                  </button>
                  <button 
                    onClick={() => handleBulkAction('deactivate')}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm inline-flex items-center gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    Désactiver
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEmployees(mockEmployees.map(emp => emp.id))
                        } else {
                          setSelectedEmployees([])
                        }
                      }}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleEmployeeSelect(employee.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-medium">
                            {employee.firstName[0]}{employee.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(employee.role)}`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {formatCurrency(employee.salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status === 'ACTIVE' ? 'Actif' : 
                         employee.status === 'ON_LEAVE' ? 'En Congé' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => {
                            setModalContent({
                              title: `👁️ Profil de ${employee.firstName} ${employee.lastName}`,
                              message: `📧 Email: ${employee.email}\n💼 Poste: ${employee.position}\n🏢 Département: ${employee.department}\n💰 Salaire: ${formatCurrency(employee.salary)}\n📊 Statut: ${employee.status}\n🔐 Rôle: ${employee.role}\n📅 Embauche: 15/03/2023\n📞 Téléphone: +221 77 123 45 67\n🏠 Adresse: Dakar, Sénégal`,
                              type: 'info',
                              onConfirm: undefined,
                              formData: {}
                            })
                            setShowModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                          title="Voir le profil"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setFormData({ currentPosition: employee.position, employeeName: `${employee.firstName} ${employee.lastName}` })
                            setModalContent({
                              title: `✏️ Modifier ${employee.firstName} ${employee.lastName}`,
                              message: '',
                              type: 'form',
                              onConfirm: undefined,
                              formData: { currentPosition: employee.position, employeeName: `${employee.firstName} ${employee.lastName}` }
                            })
                            setModalCallback(() => () => {
                              const newPosition = formData.newPosition
                              if (newPosition && newPosition !== employee.position) {
                                setModalContent({
                                  title: '✅ Modification réussie',
                                  message: `Poste mis à jour: ${employee.firstName} ${employee.lastName}\nAncien poste: ${employee.position}\nNouveau poste: ${newPosition}`,
                                  type: 'info',
                                  onConfirm: undefined,
                                  formData: {}
                                })
                              }
                            })
                            setShowModal(true)
                          }}
                          className="text-green-600 hover:text-green-800 p-1 transition-colors"
                          title="Modifier l'employé"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const roles = ['ADMIN', 'MANAGER', 'EMPLOYEE']
                            const currentIndex = roles.indexOf(employee.role)
                            const newRole = roles[(currentIndex + 1) % roles.length]
                            setModalContent({
                              title: '🔐 Changer les permissions',
                              message: `Changer le rôle de ${employee.firstName} ${employee.lastName}?\n\nRôle actuel: ${employee.role}\nNouveau rôle: ${newRole}`,
                              type: 'confirm',
                              onConfirm: () => {
                                setNotification({
                                  message: `✅ Rôle mis à jour: ${employee.firstName} ${employee.lastName} → ${newRole}`,
                                  type: 'success'
                                })
                                setTimeout(() => setNotification(null), 4000)
                                setShowModal(false)
                              },
                              formData: {}
                            })
                            setModalCallback(() => () => {
                            })
                            setShowModal(true)
                          }}
                          className="text-purple-600 hover:text-purple-800 p-1 transition-colors"
                          title="Changer les permissions"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setModalContent({
                              title: '⚠️ ATTENTION: Suppression',
                              message: `Supprimer définitivement ${employee.firstName} ${employee.lastName}?\n\nCette action est irréversible!\n\n📧 ${employee.email}\n💼 ${employee.position}\n🏢 ${employee.department}`,
                              type: 'confirm',
                              onConfirm: () => {
                                setNotification({
                                  message: `🗑️ Employé supprimé: ${employee.firstName} ${employee.lastName}`,
                                  type: 'error'
                                })
                                setTimeout(() => setNotification(null), 4000)
                                setShowModal(false)
                              },
                              formData: {}
                            })
                            setShowModal(true)
                          }}
                          className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          title="Supprimer l'employé"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Departments Management */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-red-600" />
                Gestion des Départements
              </h3>
              <button 
                onClick={() => {
                  setModalContent({
                    title: '🏢 Nouveau Département',
                    message: 'Créer un nouveau département',
                    type: 'form',
                    formData: { name: '', manager: '', budget: '' },
                    onConfirm: (data: any) => {
                      if (data.name && data.manager && data.budget && !isNaN(Number(data.budget))) {
                        setNotification({
                          message: `✅ Nouveau département créé: ${data.name} (Manager: ${data.manager})`,
                          type: 'success'
                        })
                        setTimeout(() => setNotification(null), 4000)
                        setShowModal(false)
                      }
                    }
                  })
                  setShowModal(true)
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                Nouveau Département
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {mockDepartments.map((dept) => (
              <div key={dept.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dept.status)}`}>
                    {dept.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-blue-900 mb-2">{dept.name}</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p><strong>Manager:</strong> {dept.manager}</p>
                  <p><strong>Employés:</strong> {dept.employeeCount}</p>
                  <p><strong>Budget:</strong> {formatCurrency(dept.budget)}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-200">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setModalContent({
                          title: `🏢 Département ${dept.name}`,
                          message: `Manager: ${dept.manager}\n\nEmployés: ${dept.employeeCount}\nBudget: ${formatCurrency(dept.budget)}\nStatut: ${dept.status}\n\nUtilisation budget: 78%\nObjectifs 2024: Expansion équipe\nCréé: 01/01/2023\nDernière MAJ: ${new Date().toLocaleDateString('fr-FR')}`,
                          type: 'info',
                          onConfirm: undefined,
                          formData: {}
                        })
                        setShowModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setModalContent({
                          title: `💰 Modifier le Budget`,
                          message: `Modifier le budget du département ${dept.name}`,
                          type: 'form',
                          formData: { budget: dept.budget.toString() },
                          onConfirm: (data: any) => {
                            if (data.budget && !isNaN(Number(data.budget))) {
                              setNotification({
                                message: `💰 Budget mis à jour pour ${dept.name}`,
                                type: 'success'
                              })
                              setTimeout(() => setNotification(null), 4000)
                              setShowModal(false)
                            }
                          }
                        })
                        setShowModal(true)
                      }}
                      className="text-green-600 hover:text-green-800 p-1 transition-colors"
                      title="Modifier le département"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Bouton supprimer cliqué pour:', dept.name)
                        setModalContent({
                          title: `🗑️ Supprimer le Département`,
                          message: `⚠️ ATTENTION: Supprimer le département ${dept.name}?\n\nCette action supprimera:\n• Le département\n• Toutes les données associées\n• Les affectations des ${dept.employeeCount} employés\n\nCette action est irréversible!`,
                          type: 'confirm',
                          formData: {},
                          onConfirm: () => {
                            console.log('Confirmation de suppression pour:', dept.name)
                            setNotification({
                              message: `🗑️ Département supprimé: ${dept.name}`,
                              type: 'error'
                            })
                            setTimeout(() => setNotification(null), 4000)
                            setShowModal(false)
                          }
                        })
                        console.log('Modal content défini, ouverture modal...')
                        setShowModal(true)
                      }}
                      className="text-red-600 hover:text-red-800 p-1 transition-colors"
                      title="Supprimer le département"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                    Gérer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Settings className="h-6 w-6 text-red-600" />
            Configuration Système RH
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">🔐 Sécurité & Permissions</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setModalContent({
                      title: '🔐 Gestion des Rôles',
                      message: `• ADMIN: Accès complet système\n• MANAGER: Gestion équipe + rapports\n• EMPLOYEE: Accès profil personnel\n\nPermissions par module:\n• RH: ADMIN uniquement\n• Finances: ADMIN + MANAGER\n• Opérations: Tous les rôles\n\nDernière MAJ: ${new Date().toLocaleDateString('fr-FR')}`,
                      type: 'info',
                      onConfirm: undefined,
                      formData: {}
                    })
                    setShowModal(true)
                  }}
                  className="w-full text-left p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                >
                  <div className="font-medium text-red-900">Gestion des Rôles</div>
                  <div className="text-sm text-red-600">Configurer les permissions par rôle</div>
                </button>
                <button 
                  onClick={() => {
                    setModalContent({
                      title: '📋 Journal d\'Audit',
                      message: `Actions récentes:\n\n• 15:30 - Admin: Création employé (Marie Sow)\n• 14:15 - Manager: Modification salaire (Amadou Ba)\n• 13:45 - Admin: Suppression département (Marketing)\n• 12:30 - System: Sauvegarde automatique\n• 11:20 - Admin: Export données RH\n\nTotal actions aujourd'hui: 127\nUtilisateurs actifs: 8`,
                      type: 'info',
                      onConfirm: undefined,
                      formData: {}
                    })
                    setShowModal(true)
                  }}
                  className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                >
                  <div className="font-medium text-purple-900">Journal d'Audit</div>
                  <div className="text-sm text-purple-600">Historique des actions</div>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">📊 Configuration</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setModalContent({
                      title: '⚙️ Paramètres Généraux',
                      message: `Configuration actuelle:\n\n• Langue: Français\n• Fuseau horaire: GMT+0 (Dakar)\n• Format date: DD/MM/YYYY\n• Devise: FCFA\n• Notifications: Activées\n• Sauvegarde auto: Quotidienne\n• Rétention données: 7 ans\n\nDernière sauvegarde: ${new Date().toLocaleString('fr-FR')}`,
                      type: 'info',
                      onConfirm: undefined,
                      formData: {}
                    })
                    setShowModal(true)
                  }}
                  className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  <div className="font-medium text-blue-900">Paramètres Généraux</div>
                  <div className="text-sm text-blue-600">Configuration de base du système</div>
                </button>
                <button 
                  onClick={() => {
                    if (confirm('💾 Créer une sauvegarde complète des données RH?\n\nCela inclura:\n• Profils employés\n• Départements\n• Politiques\n• Historique des actions\n\nDurée estimée: 2-3 minutes')) {
                      setNotification({
                        message: `✅ Sauvegarde créée avec succès! Fichier: backup_rh_${new Date().toISOString().split('T')[0]}.zip`,
                        type: 'success'
                      })
                      setTimeout(() => setNotification(null), 4000)
                    }
                  }}
                  className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                >
                  <div className="font-medium text-green-900">Sauvegarde & Restauration</div>
                  <div className="text-sm text-green-600">Gestion des données RH</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        } animate-slide-in-right`}>
          <div className="flex items-center gap-2">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal personnalisée */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{modalContent.title}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {modalContent.type === 'info' && modalContent.onConfirm && (
                <div>
                  <div className="whitespace-pre-line text-gray-700 mb-6">
                    {modalContent.message}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (modalContent.onConfirm) {
                          modalContent.onConfirm(modalContent.formData)
                        }
                        setShowModal(false)
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}

              {modalContent.type === 'error' && modalContent.onConfirm && (
                <div>
                  <div className="whitespace-pre-line text-gray-700 mb-6">
                    {modalContent.message}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={modalContent.onConfirm}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}

              {modalContent.type === 'info' && !modalContent.onConfirm && (
                <div>
                  <div className="whitespace-pre-line text-gray-700 mb-6">
                    {modalContent.message}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}

              {modalContent.type === 'form' && (
                <div>
                  {modalContent.title.includes('Département') && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du département
                        </label>
                        <input
                          type="text"
                          value={modalContent.formData.name || ''}
                          onChange={(e) => setModalContent({
                            ...modalContent,
                            formData: { ...modalContent.formData, name: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom du département"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Manager
                        </label>
                        <input
                          type="text"
                          value={modalContent.formData.manager || ''}
                          onChange={(e) => setModalContent({
                            ...modalContent,
                            formData: { ...modalContent.formData, manager: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom du manager"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget annuel (FCFA)
                        </label>
                        <input
                          type="number"
                          value={modalContent.formData.budget || ''}
                          onChange={(e) => setModalContent({
                            ...modalContent,
                            formData: { ...modalContent.formData, budget: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Budget en FCFA"
                        />
                      </div>
                    </div>
                  )}
                  {modalContent.title.includes('Budget') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau budget (FCFA)
                      </label>
                      <input
                        type="number"
                        value={modalContent.formData.budget || ''}
                        onChange={(e) => setModalContent({
                          ...modalContent,
                          formData: { ...modalContent.formData, budget: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Budget en FCFA"
                      />
                    </div>
                  )}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        if (modalCallback && formData.newPosition) {
                          modalCallback()
                          setModalCallback(null)
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              )}

              {modalContent.type === 'confirm' && (
                <div>
                  <div className="whitespace-pre-line text-gray-700 mb-6">
                    {modalContent.message}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        console.log('Bouton Annuler cliqué')
                        setShowModal(false)
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        console.log('Bouton Confirmer cliqué, onConfirm:', modalContent.onConfirm)
                        if (modalContent.onConfirm) {
                          modalContent.onConfirm()
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
