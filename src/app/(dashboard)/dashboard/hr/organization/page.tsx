'use client'

import { useState } from 'react'
import { 
  Users, 
  Network, 
  Crown, 
  User, 
  UserPlus, 
  GraduationCap, 
  Building, 
  Briefcase,
  HeadphonesIcon,
  Truck,
  Calculator,
  CreditCard,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Target
} from 'lucide-react'

// Types pour l'organigramme
interface Employee {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  avatar?: string
  isManager: boolean
  managerId?: string
  directReports: Employee[]
  skills: string[]
  startDate: string
  location: string
}

// Structure hiérarchique complète de l'entreprise
const organizationData: Employee = {
  id: 'ceo-001',
  name: 'Amadou Diallo',
  position: 'Directeur Général',
  department: 'Direction Générale',
  email: 'amadou.diallo@saaslogistique.com',
  phone: '+33 1 23 45 67 89',
  isManager: true,
  directReports: [
    {
      id: 'dg-adj-001',
      name: 'Fatima Kone',
      position: 'Directrice Générale Adjointe',
      department: 'Direction Générale',
      email: 'fatima.kone@saaslogistique.com',
      phone: '+33 1 23 45 67 90',
      isManager: true,
      managerId: 'ceo-001',
      directReports: [],
      skills: ['Leadership', 'Stratégie', 'Management'],
      startDate: '2022-03-15',
      location: 'Paris, France'
    },
    {
      id: 'drh-001',
      name: 'Mariam Traore',
      position: 'Directrice des Ressources Humaines',
      department: 'Ressources Humaines',
      email: 'mariam.traore@saaslogistique.com',
      phone: '+33 1 23 45 67 91',
      isManager: true,
      managerId: 'ceo-001',
      directReports: [
        {
          id: 'rh-manager-001',
          name: 'Ousmane Diop',
          position: 'Responsable Gestion Personnel',
          department: 'RH - Gestion Personnel',
          email: 'ousmane.diop@saaslogistique.com',
          phone: '+33 1 23 45 67 92',
          isManager: true,
          managerId: 'drh-001',
          directReports: [
            {
              id: 'rh-assistant-001',
              name: 'Aissata Camara',
              position: 'Assistante RH',
              department: 'RH - Gestion Personnel',
              email: 'aissata.camara@saaslogistique.com',
              phone: '+33 1 23 45 67 93',
              isManager: false,
              managerId: 'rh-manager-001',
              directReports: [],
              skills: ['Administration RH', 'Paie', 'Congés'],
              startDate: '2023-01-10',
              location: 'Paris, France'
            }
          ],
          skills: ['Gestion RH', 'Paie', 'Administration'],
          startDate: '2022-06-01',
          location: 'Paris, France'
        },
        {
          id: 'recruitment-manager-001',
          name: 'Ibrahim Sow',
          position: 'Responsable Recrutement',
          department: 'RH - Recrutement',
          email: 'ibrahim.sow@saaslogistique.com',
          phone: '+33 1 23 45 67 94',
          isManager: true,
          managerId: 'drh-001',
          directReports: [
            {
              id: 'recruiter-001',
              name: 'Aminata Ba',
              position: 'Chargée de Recrutement',
              department: 'RH - Recrutement',
              email: 'aminata.ba@saaslogistique.com',
              phone: '+33 1 23 45 67 95',
              isManager: false,
              managerId: 'recruitment-manager-001',
              directReports: [],
              skills: ['Recrutement', 'Entretiens', 'Sourcing'],
              startDate: '2023-02-15',
              location: 'Paris, France'
            }
          ],
          skills: ['Recrutement', 'Talent Acquisition', 'Assessment'],
          startDate: '2022-08-01',
          location: 'Paris, France'
        },
        {
          id: 'training-manager-001',
          name: 'Moussa Keita',
          position: 'Responsable Formation',
          department: 'RH - Formation',
          email: 'moussa.keita@saaslogistique.com',
          phone: '+33 1 23 45 67 96',
          isManager: true,
          managerId: 'drh-001',
          directReports: [
            {
              id: 'trainer-001',
              name: 'Kadiatou Diallo',
              position: 'Formatrice',
              department: 'RH - Formation',
              email: 'kadiatou.diallo@saaslogistique.com',
              phone: '+33 1 23 45 67 97',
              isManager: false,
              managerId: 'training-manager-001',
              directReports: [],
              skills: ['Formation', 'E-learning', 'Développement'],
              startDate: '2023-03-01',
              location: 'Paris, France'
            }
          ],
          skills: ['Formation', 'Développement RH', 'E-learning'],
          startDate: '2022-09-01',
          location: 'Paris, France'
        },
        {
          id: 'admin-manager-001',
          name: 'Sekou Toure',
          position: 'Responsable Administration RH',
          department: 'RH - Administration',
          email: 'sekou.toure@saaslogistique.com',
          phone: '+33 1 23 45 67 98',
          isManager: true,
          managerId: 'drh-001',
          directReports: [
            {
              id: 'admin-assistant-001',
              name: 'Fatoumata Sidibe',
              position: 'Assistante Administrative RH',
              department: 'RH - Administration',
              email: 'fatoumata.sidibe@saaslogistique.com',
              phone: '+33 1 23 45 67 99',
              isManager: false,
              managerId: 'admin-manager-001',
              directReports: [],
              skills: ['Administration', 'Conformité', 'Procédures'],
              startDate: '2023-04-01',
              location: 'Paris, France'
            }
          ],
          skills: ['Administration RH', 'Conformité', 'Politiques'],
          startDate: '2022-10-01',
          location: 'Paris, France'
        }
      ],
      skills: ['Leadership RH', 'Stratégie RH', 'Management'],
      startDate: '2022-01-15',
      location: 'Paris, France'
    },
    {
      id: 'dtech-001',
      name: 'Cheikh Dieng',
      position: 'Directeur Technique',
      department: 'Technique',
      email: 'cheikh.dieng@saaslogistique.com',
      phone: '+33 1 23 45 68 00',
      isManager: true,
      managerId: 'ceo-001',
      directReports: [
        {
          id: 'dev-lead-001',
          name: 'Mamadou Cisse',
          position: 'Lead Developer',
          department: 'Développement',
          email: 'mamadou.cisse@saaslogistique.com',
          phone: '+33 1 23 45 68 01',
          isManager: true,
          managerId: 'dtech-001',
          directReports: [],
          skills: ['React', 'Node.js', 'TypeScript', 'Leadership'],
          startDate: '2022-04-01',
          location: 'Paris, France'
        }
      ],
      skills: ['Architecture', 'Leadership Tech', 'Innovation'],
      startDate: '2022-02-01',
      location: 'Paris, France'
    },
    {
      id: 'dops-001',
      name: 'Abdoulaye Ndiaye',
      position: 'Directeur des Opérations',
      department: 'Opérations',
      email: 'abdoulaye.ndiaye@saaslogistique.com',
      phone: '+33 1 23 45 68 02',
      isManager: true,
      managerId: 'ceo-001',
      directReports: [
        {
          id: 'logistics-manager-001',
          name: 'Awa Diop',
          position: 'Responsable Logistique',
          department: 'Logistique',
          email: 'awa.diop@saaslogistique.com',
          phone: '+33 1 23 45 68 03',
          isManager: true,
          managerId: 'dops-001',
          directReports: [],
          skills: ['Logistique', 'Supply Chain', 'Optimisation'],
          startDate: '2022-05-01',
          location: 'Paris, France'
        }
      ],
      skills: ['Opérations', 'Logistique', 'Management'],
      startDate: '2022-02-15',
      location: 'Paris, France'
    },
    {
      id: 'dcom-001',
      name: 'Binta Sall',
      position: 'Directrice Commerciale',
      department: 'Commercial',
      email: 'binta.sall@saaslogistique.com',
      phone: '+33 1 23 45 68 04',
      isManager: true,
      managerId: 'ceo-001',
      directReports: [
        {
          id: 'sales-manager-001',
          name: 'Modou Fall',
          position: 'Responsable Ventes',
          department: 'Ventes',
          email: 'modou.fall@saaslogistique.com',
          phone: '+33 1 23 45 68 05',
          isManager: true,
          managerId: 'dcom-001',
          directReports: [],
          skills: ['Ventes', 'Négociation', 'CRM'],
          startDate: '2022-07-01',
          location: 'Paris, France'
        }
      ],
      skills: ['Ventes', 'Marketing', 'Développement Commercial'],
      startDate: '2022-03-01',
      location: 'Paris, France'
    }
  ],
  skills: ['Leadership', 'Vision Stratégique', 'Management'],
  startDate: '2021-12-01',
  location: 'Paris, France'
}

// Statistiques organisationnelles
const orgStats = {
  totalEmployees: 15,
  departments: 8,
  managers: 9,
  newHires: 6,
  avgTenure: '1.2 ans',
  turnoverRate: '8%'
}

const departmentColors: { [key: string]: string } = {
  'Direction Générale': 'from-purple-500 to-indigo-600',
  'Ressources Humaines': 'from-emerald-500 to-teal-600',
  'RH - Gestion Personnel': 'from-green-500 to-emerald-600',
  'RH - Recrutement': 'from-blue-500 to-cyan-600',
  'RH - Formation': 'from-yellow-500 to-orange-600',
  'RH - Administration': 'from-red-500 to-pink-600',
  'Technique': 'from-gray-500 to-slate-600',
  'Développement': 'from-indigo-500 to-purple-600',
  'Opérations': 'from-orange-500 to-red-600',
  'Logistique': 'from-cyan-500 to-blue-600',
  'Commercial': 'from-pink-500 to-rose-600',
  'Ventes': 'from-violet-500 to-purple-600'
}

export default function OrganizationPage() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['ceo-001', 'drh-001'])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    )
  }

  const renderEmployee = (employee: Employee, level: number = 0) => {
    const isExpanded = expandedNodes.includes(employee.id)
    const hasReports = employee.directReports.length > 0
    const departmentColor = departmentColors[employee.department] || 'from-gray-500 to-slate-600'

    return (
      <div key={employee.id} className="space-y-2">
        <div 
          className={`relative ${level > 0 ? 'ml-8' : ''}`}
          style={{ marginLeft: level > 0 ? `${level * 2}rem` : '0' }}
        >
          {/* Ligne de connexion */}
          {level > 0 && (
            <div className="absolute -left-8 top-6 w-8 h-px bg-gray-300"></div>
          )}
          {level > 0 && (
            <div className="absolute -left-8 top-0 w-px h-6 bg-gray-300"></div>
          )}

          <div 
            className={`bg-white rounded-xl border-2 border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${
              selectedEmployee?.id === employee.id ? 'ring-2 ring-blue-500 border-blue-300' : ''
            }`}
            onClick={() => setSelectedEmployee(employee)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-r ${departmentColor} p-3 rounded-lg text-white`}>
                  {employee.isManager ? (
                    <Crown className="h-6 w-6" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{employee.name}</h3>
                  <p className="text-blue-600 font-medium">{employee.position}</p>
                  <p className="text-sm text-gray-500">{employee.department}</p>
                  {employee.directReports.length > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      {employee.directReports.length} collaborateur{employee.directReports.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right text-sm text-gray-500">
                  <p className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {employee.email.split('@')[0]}
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {employee.phone.slice(-8)}
                  </p>
                </div>
                
                {hasReports && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleNode(employee.id)
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Collaborateurs directs */}
        {hasReports && isExpanded && (
          <div className="space-y-2">
            {employee.directReports.map(report => renderEmployee(report, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Network className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">🏢 Organigramme</h1>
            <p className="text-emerald-100 text-lg">Structure organisationnelle et hiérarchies</p>
          </div>
        </div>
      </div>

      {/* Statistiques organisationnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{orgStats.totalEmployees}</p>
              <p className="text-sm text-blue-500">Employés</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{orgStats.departments}</p>
              <p className="text-sm text-green-500">Départements</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{orgStats.managers}</p>
              <p className="text-sm text-purple-500">Managers</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{orgStats.newHires}</p>
              <p className="text-sm text-yellow-500">Nouvelles recrues</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-600">{orgStats.avgTenure}</p>
              <p className="text-sm text-cyan-500">Ancienneté moy.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{orgStats.turnoverRate}</p>
              <p className="text-sm text-red-500">Taux rotation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organigramme */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Network className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Structure Hiérarchique</h2>
            </div>
            
            <div className="space-y-4">
              {renderEmployee(organizationData)}
            </div>
          </div>
        </div>

        {/* Détails employé sélectionné */}
        <div className="space-y-6">
          {selectedEmployee ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Détails Employé</h2>
              </div>
              
              <div className="space-y-4">
                <div className={`bg-gradient-to-r ${departmentColors[selectedEmployee.department]} p-4 rounded-xl text-white`}>
                  <div className="flex items-center gap-3">
                    {selectedEmployee.isManager ? (
                      <Crown className="h-8 w-8" />
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{selectedEmployee.name}</h3>
                      <p className="opacity-90">{selectedEmployee.position}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">{selectedEmployee.department}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{selectedEmployee.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{selectedEmployee.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{selectedEmployee.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Depuis le {new Date(selectedEmployee.startDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {selectedEmployee.skills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Compétences
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEmployee.directReports.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Équipe ({selectedEmployee.directReports.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedEmployee.directReports.map((report) => (
                        <div
                          key={report.id}
                          className="p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => setSelectedEmployee(report)}
                        >
                          <p className="font-medium text-sm text-gray-900">{report.name}</p>
                          <p className="text-xs text-gray-500">{report.position}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center text-gray-500">
                <Network className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Cliquez sur un employé pour voir ses détails</p>
              </div>
            </div>
          )}

          {/* Légende des départements */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-6 w-6 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Départements</h2>
            </div>
            
            <div className="space-y-2">
              {Object.entries(departmentColors).map(([dept, color]) => (
                <div key={dept} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded bg-gradient-to-r ${color}`}></div>
                  <span className="text-sm text-gray-700">{dept}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
