'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Building2, 
  GraduationCap, 
  FileText, 
  Settings,
  Plus, 
  Search, 
  Calendar,
  DollarSign,
  Award,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  X,
  Eye,
  Edit3
} from 'lucide-react'
import Link from 'next/link'
import BackButton from '@/components/ui/back-button'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  position: string
  department: string
  salary: number
  hireDate: string
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'
  avatar?: string
}

interface Payroll {
  id: string
  employeeId: string
  month: string
  baseSalary: number
  bonuses: number
  deductions: number
  netSalary: number
  status: 'PAID' | 'PENDING' | 'PROCESSING'
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
    hireDate: '2023-03-15',
    status: 'ACTIVE'
  },
  {
    id: '2',
    firstName: 'Amadou',
    lastName: 'Ba',
    email: 'amadou.ba@company.com',
    position: 'Agent Commercial',
    department: 'Commercial',
    salary: 650000,
    hireDate: '2023-06-01',
    status: 'ACTIVE'
  }
]

interface ModalData {
  type: 'create' | 'details' | 'modify'
  title: string
  content: string
  deptName?: string
  currentManager?: string
}

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll' | 'leave' | 'departments'>('employees')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<ModalData | null>(null)
  const [newDeptName, setNewDeptName] = useState('')
  const [newDeptManager, setNewDeptManager] = useState('')
  const [modifyManager, setModifyManager] = useState('')
  const router = useRouter()

  const handleNewEmployee = () => {
    router.push('/dashboard/hr/employees/create')
  }

  const handleNewDepartment = () => {
    setModalData({
      type: 'create',
      title: '🏢 Nouveau Département',
      content: 'Créer un nouveau département'
    })
    setNewDeptName('')
    setNewDeptManager('')
    setShowModal(true)
  }

  const handleViewDepartmentDetails = (deptName: string, employees: number, manager: string) => {
    setModalData({
      type: 'details',
      title: `📊 Détails - ${deptName}`,
      content: `👥 Employés: ${employees}\n👤 Manager: ${manager}\n💰 Budget: ${formatCurrency(employees * 650000)}\n📈 Performance: 92%\n🎯 Objectifs: En cours\n📅 Dernière MAJ: ${new Date().toLocaleDateString('fr-FR')}`,
      deptName
    })
    setShowModal(true)
  }

  const handleModifyDepartment = (deptName: string, currentManager: string) => {
    setModalData({
      type: 'modify',
      title: `✏️ Modifier - ${deptName}`,
      content: 'Modifier le manager du département',
      deptName,
      currentManager
    })
    setModifyManager(currentManager)
    setShowModal(true)
  }

  const handleCreateDepartment = () => {
    if (newDeptName && newDeptManager) {
      setModalData({
        type: 'details',
        title: '✅ Département Créé',
        content: `Département "${newDeptName}" créé avec succès!\n\n👤 Manager: ${newDeptManager}\n📊 Employés: 0\n🎯 Statut: Actif\n📅 Créé le: ${new Date().toLocaleString('fr-FR')}`
      })
    }
  }

  const handleSaveModification = () => {
    if (modifyManager && modalData?.currentManager && modifyManager !== modalData.currentManager) {
      setModalData({
        type: 'details',
        title: '✅ Modification Sauvegardée',
        content: `Département "${modalData.deptName}" modifié!\n\n👤 Nouveau manager: ${modifyManager}\n📅 Modification effectuée: ${new Date().toLocaleString('fr-FR')}`
      })
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setModalData(null)
    setNewDeptName('')
    setNewDeptManager('')
    setModifyManager('')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const hrStats = {
    totalEmployees: mockEmployees.length,
    activeEmployees: mockEmployees.filter(e => e.status === 'ACTIVE').length,
    totalPayroll: mockEmployees.reduce((sum, emp) => sum + emp.salary, 0),
    avgSalary: mockEmployees.reduce((sum, emp) => sum + emp.salary, 0) / mockEmployees.length
  }

  return (
    <div className="space-y-8">
      {/* Bouton retour */}
      <BackButton href="/dashboard" label="Retour au dashboard" />
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Users className="h-10 w-10" />
                👥 Gestion du Personnel
              </h1>
              <p className="text-purple-100 text-lg">
                Ressources humaines et gestion des employés
              </p>
            </div>
            <button 
              onClick={handleNewEmployee}
              className="bg-white text-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Nouvel Employé
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
              <p className="text-blue-600 text-sm font-medium">👥 Employés Actifs</p>
              <p className="text-2xl font-bold text-blue-900">{hrStats.activeEmployees}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">💰 Masse Salariale</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(hrStats.totalPayroll)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">📊 Salaire Moyen</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(hrStats.avgSalary)}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">📅 En Congé</p>
              <p className="text-2xl font-bold text-orange-900">2</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'employees' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Employés
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'payroll' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign className="h-4 w-4 inline mr-2" />
          Paie
        </button>
        <button
          onClick={() => setActiveTab('leave')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'leave' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="h-4 w-4 inline mr-2" />
          Congés
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'departments' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Départements
        </button>
      </div>

      {/* Content */}
      {activeTab === 'employees' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Liste des Employés</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {formatCurrency(employee.salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        employee.status === 'ACTIVE' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                      }`}>
                        {employee.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Départements Tab */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Gestion des Départements</h3>
              <button 
                onClick={handleNewDepartment}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Nouveau Département
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Opérations', employees: 15, manager: 'Marie Diallo', color: 'blue' },
                { name: 'Commercial', employees: 12, manager: 'Amadou Ba', color: 'green' },
                { name: 'Finance', employees: 8, manager: 'Fatou Sow', color: 'purple' },
                { name: 'IT', employees: 6, manager: 'Ibrahim Koné', color: 'indigo' },
                { name: 'RH', employees: 4, manager: 'Aïcha Traoré', color: 'pink' },
                { name: 'Marketing', employees: 7, manager: 'Moussa Diop', color: 'orange' }
              ].map((dept, index) => (
                <div key={index} className={`bg-gradient-to-br from-${dept.color}-50 to-${dept.color}-100 rounded-xl p-6 border border-${dept.color}-200`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-lg font-semibold text-${dept.color}-900`}>{dept.name}</h4>
                    <div className={`bg-${dept.color}-500 p-2 rounded-lg`}>
                      <Users className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`text-${dept.color}-600 text-sm`}>Employés:</span>
                      <span className={`font-medium text-${dept.color}-900`}>{dept.employees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-${dept.color}-600 text-sm`}>Manager:</span>
                      <span className={`font-medium text-${dept.color}-900`}>{dept.manager}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => handleViewDepartmentDetails(dept.name, dept.employees, dept.manager)}
                      className={`flex-1 bg-${dept.color}-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-${dept.color}-600 transition-colors`}
                    >
                      Voir détails
                    </button>
                    <button 
                      onClick={() => handleModifyDepartment(dept.name, dept.manager)}
                      className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{modalData.title}</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {modalData.type === 'create' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏢 Nom du département
                    </label>
                    <input
                      type="text"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: Marketing Digital"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 Manager du département
                    </label>
                    <input
                      type="text"
                      value={newDeptManager}
                      onChange={(e) => setNewDeptManager(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCreateDepartment}
                      disabled={!newDeptName || !newDeptManager}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Créer
                    </button>
                  </div>
                </div>
              )}

              {modalData.type === 'details' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-medium">
                      {modalData.content}
                    </pre>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              )}

              {modalData.type === 'modify' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 Manager du département {modalData.deptName}
                    </label>
                    <input
                      type="text"
                      value={modifyManager}
                      onChange={(e) => setModifyManager(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nouveau manager"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveModification}
                      disabled={!modifyManager || modifyManager === modalData.currentManager}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Sauvegarder
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
