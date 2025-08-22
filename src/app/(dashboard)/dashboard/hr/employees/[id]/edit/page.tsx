'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  DollarSign, 
  Calendar, 
  Shield, 
  Save, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'

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
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
  phone?: string
  address?: string
}

// Mock data - same as employees page
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
    status: 'ACTIVE',
    role: 'MANAGER',
    phone: '+221 77 123 45 67',
    address: 'Dakar, Sénégal'
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
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    phone: '+221 76 987 65 43',
    address: 'Thiès, Sénégal'
  },
  {
    id: '3',
    firstName: 'Fatou',
    lastName: 'Sow',
    email: 'fatou.sow@company.com',
    position: 'Comptable',
    department: 'Finance',
    salary: 750000,
    hireDate: '2023-01-10',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    phone: '+221 78 456 78 90',
    address: 'Saint-Louis, Sénégal'
  },
  {
    id: '4',
    firstName: 'Ousmane',
    lastName: 'Traoré',
    email: 'ousmane.traore@company.com',
    position: 'Développeur',
    department: 'IT',
    salary: 900000,
    hireDate: '2022-11-20',
    status: 'ON_LEAVE',
    role: 'EMPLOYEE',
    phone: '+221 77 234 56 78',
    address: 'Kaolack, Sénégal'
  },
  {
    id: '5',
    firstName: 'Aissatou',
    lastName: 'Ndiaye',
    email: 'aissatou.ndiaye@company.com',
    position: 'RH Manager',
    department: 'Ressources Humaines',
    salary: 950000,
    hireDate: '2022-08-15',
    status: 'ACTIVE',
    role: 'MANAGER',
    phone: '+221 76 345 67 89',
    address: 'Ziguinchor, Sénégal'
  }
]

const departments = ['Opérations', 'Commercial', 'Finance', 'IT', 'Ressources Humaines', 'Marketing', 'Support']

export default function EditEmployeePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const employeeId = params.id as string

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    salary: '',
    hireDate: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE',
    role: 'EMPLOYEE' as 'ADMIN' | 'MANAGER' | 'EMPLOYEE',
    phone: '',
    address: ''
  })
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null)
  const [showSalary, setShowSalary] = useState(false)

  useEffect(() => {
    // Charger les données de l'employé
    const foundEmployee = mockEmployees.find(emp => emp.id === employeeId)
    if (foundEmployee) {
      setEmployee(foundEmployee)
      setFormData({
        firstName: foundEmployee.firstName,
        lastName: foundEmployee.lastName,
        email: foundEmployee.email,
        position: foundEmployee.position,
        department: foundEmployee.department,
        salary: foundEmployee.salary.toString(),
        hireDate: foundEmployee.hireDate,
        status: foundEmployee.status,
        role: foundEmployee.role,
        phone: foundEmployee.phone || '',
        address: foundEmployee.address || ''
      })
    }
  }, [employeeId])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation basique
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setNotification({
        message: '❌ Veuillez remplir tous les champs obligatoires',
        type: 'error'
      })
      setTimeout(() => setNotification(null), 4000)
      return
    }

    // Simulation de la sauvegarde
    setNotification({
      message: `✅ Employé ${formData.firstName} ${formData.lastName} mis à jour avec succès`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 4000)
    
    // Redirection après 2 secondes
    setTimeout(() => {
      router.push('/dashboard/hr/employees')
    }, 2000)
  }

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
          <Link
            href="/dashboard/hr/employees"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Employé non trouvé</h1>
          <p className="text-gray-600 mb-4">
            L'employé avec l'ID {employeeId} n'existe pas.
          </p>
          <Link
            href="/dashboard/hr/employees"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/hr/employees"
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 p-2 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold mb-2">✏️ Modifier l'Employé</h1>
                <p className="text-blue-100">
                  {employee.firstName} {employee.lastName} - {employee.position}
                </p>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations personnelles */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Informations Personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+221 77 123 45 67"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Adresse complète"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Informations Professionnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salaire (FCFA) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showSalary ? "text" : "password"}
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSalary(!showSalary)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSalary ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'embauche *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="ACTIVE">Actif</option>
                    <option value="INACTIVE">Inactif</option>
                    <option value="ON_LEAVE">En congé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="EMPLOYEE">Employé</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard/hr/employees"
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                Sauvegarder
              </button>
            </div>
          </form>
        </div>

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
      </div>
    </div>
  )
}
