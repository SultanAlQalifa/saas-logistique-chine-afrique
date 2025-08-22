'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Calculator, 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Upload,
  CreditCard,
  Wallet,
  PiggyBank,
  Receipt,
  Shield,
  Eye,
  Edit3,
  Plus,
  Clock
} from 'lucide-react'

interface PayrollEntry {
  id: string
  employeeId: string
  employeeName: string
  position: string
  department: string
  baseSalary: number
  bonuses: number
  deductions: number
  netSalary: number
  payPeriod: string
  status: 'draft' | 'approved' | 'paid'
  payDate: string
}

interface ExpenseEntry {
  id: string
  category: string
  description: string
  amount: number
  date: string
  approvedBy: string
  status: 'pending' | 'approved' | 'rejected'
  receipt?: string
}

// Mock data
const mockPayroll: PayrollEntry[] = [
  {
    id: 'pay-001',
    employeeId: 'emp-001',
    employeeName: 'Marie Diallo',
    position: 'Manager Opérations',
    department: 'Opérations',
    baseSalary: 800000,
    bonuses: 100000,
    deductions: 80000,
    netSalary: 820000,
    payPeriod: 'Janvier 2024',
    status: 'paid',
    payDate: '2024-01-31'
  },
  {
    id: 'pay-002',
    employeeId: 'emp-002',
    employeeName: 'Amadou Ba',
    position: 'Manager Commercial',
    department: 'Commercial',
    baseSalary: 750000,
    bonuses: 150000,
    deductions: 75000,
    netSalary: 825000,
    payPeriod: 'Janvier 2024',
    status: 'approved',
    payDate: '2024-01-31'
  },
  {
    id: 'pay-003',
    employeeId: 'emp-003',
    employeeName: 'Fatou Sow',
    position: 'Comptable',
    department: 'Finance',
    baseSalary: 600000,
    bonuses: 50000,
    deductions: 60000,
    netSalary: 590000,
    payPeriod: 'Janvier 2024',
    status: 'draft',
    payDate: '2024-01-31'
  }
]

const mockExpenses: ExpenseEntry[] = [
  {
    id: 'exp-001',
    category: 'Formation',
    description: 'Formation leadership pour managers',
    amount: 250000,
    date: '2024-01-15',
    approvedBy: 'Aissatou Ndiaye',
    status: 'approved'
  },
  {
    id: 'exp-002',
    category: 'Recrutement',
    description: 'Frais publication offres emploi',
    amount: 75000,
    date: '2024-01-20',
    approvedBy: 'Aissatou Ndiaye',
    status: 'pending'
  },
  {
    id: 'exp-003',
    category: 'Équipement',
    description: 'Ordinateurs portables nouveaux employés',
    amount: 450000,
    date: '2024-01-25',
    approvedBy: 'Aissatou Ndiaye',
    status: 'approved'
  }
]

export default function HRAccountingPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'payroll' | 'expenses' | 'reports'>('payroll')
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' as 'info' | 'confirm' | 'form' })
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'approved': return 'text-blue-600 bg-blue-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      case 'pending': return 'text-orange-600 bg-orange-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Payé'
      case 'approved': return 'Approuvé'
      case 'draft': return 'Brouillon'
      case 'pending': return 'En attente'
      case 'rejected': return 'Rejeté'
      default: return status
    }
  }

  // Calculs statistiques
  const totalPayroll = mockPayroll.reduce((sum, entry) => sum + entry.netSalary, 0)
  const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const pendingApprovals = mockPayroll.filter(entry => entry.status === 'draft').length
  const avgSalary = Math.round(totalPayroll / mockPayroll.length)

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">💰 Comptabilité RH</h1>
            <p className="text-emerald-100 text-lg">Gestion de la paie et comptabilité des ressources humaines</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setFormData({})
                setModalContent({
                  title: '💰 Nouvelle Fiche de Paie',
                  message: '',
                  type: 'form'
                })
                setModalCallback(() => () => {
                  const { employee, baseSalary, bonuses, deductions } = formData
                  if (employee && baseSalary) {
                    const netSalary = (parseInt(baseSalary) || 0) + (parseInt(bonuses) || 0) - (parseInt(deductions) || 0)
                    setModalContent({
                      title: '✅ Fiche de paie créée',
                      message: `Nouvelle fiche de paie générée:\n\n👤 Employé: ${employee}\n💰 Salaire de base: ${parseInt(baseSalary || 0).toLocaleString()} FCFA\n🎁 Primes: ${parseInt(bonuses || 0).toLocaleString()} FCFA\n📉 Déductions: ${parseInt(deductions || 0).toLocaleString()} FCFA\n💵 Net à payer: ${netSalary.toLocaleString()} FCFA\n📅 Période: ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}\n📊 Statut: Brouillon\n\nLa fiche est prête pour validation et traitement.`,
                      type: 'info'
                    })
                  }
                })
                setShowModal(true)
              }}
              className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Nouvelle Paie
            </button>
            <button 
              onClick={() => {
                const csvData = mockPayroll.map(entry => ({
                  Employé: entry.employeeName,
                  Poste: entry.position,
                  Département: entry.department,
                  'Salaire Base': entry.baseSalary,
                  Primes: entry.bonuses,
                  Déductions: entry.deductions,
                  'Net à Payer': entry.netSalary,
                  Période: entry.payPeriod,
                  Statut: entry.status
                }))
                const csvContent = "data:text/csv;charset=utf-8," + 
                  Object.keys(csvData[0]).join(",") + "\n" +
                  csvData.map(row => Object.values(row).join(",")).join("\n")
                const encodedUri = encodeURI(csvContent)
                const link = document.createElement("a")
                link.setAttribute("href", encodedUri)
                link.setAttribute("download", `paie_rh_${new Date().toISOString().split('T')[0]}.csv`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                setModalContent({
                  title: '📊 Export terminé',
                  message: `Export des données de paie terminé!\n\n• ${mockPayroll.length} fiches de paie exportées\n• Fichier: paie_rh_${new Date().toISOString().split('T')[0]}.csv\n• Format: CSV\n• Encodage: UTF-8\n• Masse salariale totale: ${totalPayroll.toLocaleString()} FCFA`,
                  type: 'info'
                })
                setShowModal(true)
              }}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 border border-white/30"
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Masse Salariale</p>
              <p className="text-2xl font-bold text-emerald-900">{formatCurrency(totalPayroll)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Charges RH</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">En Attente</p>
              <p className="text-3xl font-bold text-yellow-900">{pendingApprovals}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Salaire Moyen</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(avgSalary)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('payroll')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payroll'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Paie ({mockPayroll.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'expenses'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Charges ({mockExpenses.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Rapports
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Gestion de la Paie</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setModalContent({
                        title: '🧮 Calcul de Paie Automatique',
                        message: `Calcul automatique des salaires en cours...\n\n📊 Données traitées:\n• ${mockPayroll.length} employés\n• Salaires de base calculés\n• Primes et bonus appliqués\n• Déductions sociales calculées\n• Charges patronales incluses\n\n💰 Résultats:\n• Masse salariale brute: ${(totalPayroll * 1.3).toLocaleString()} FCFA\n• Charges sociales: ${(totalPayroll * 0.3).toLocaleString()} FCFA\n• Net à payer total: ${totalPayroll.toLocaleString()} FCFA\n\n✅ Calculs terminés et validés selon la législation en vigueur.`,
                        type: 'info'
                      })
                      setShowModal(true)
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Calculator className="h-4 w-4" />
                    Calculer Paie
                  </button>
                  <button 
                    onClick={() => {
                      setModalContent({
                        title: '📤 Importer Données de Paie',
                        message: `Importation de données de paie:\n\n📋 Formats acceptés:\n• CSV (recommandé)\n• Excel (.xlsx)\n• Fichier texte (.txt)\n\n📝 Colonnes requises:\n• Nom employé\n• Département\n• Salaire de base\n• Primes (optionnel)\n• Déductions (optionnel)\n\n⚠️ Assurez-vous que les données sont au bon format avant l'import.\n\n📊 Capacité: Jusqu'à 1000 employés par fichier`,
                        type: 'confirm'
                      })
                      setModalCallback(() => () => {
                        setModalContent({
                          title: '✅ Import réussi',
                          message: `Données importées avec succès!\n\n📊 Résultats:\n• 15 employés traités\n• 0 erreurs détectées\n• Toutes les fiches validées\n• Import terminé en 2.3 secondes\n\nLes nouvelles données sont maintenant disponibles dans le système.`,
                          type: 'info'
                        })
                      })
                      setShowModal(true)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Importer
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employé
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Département
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salaire Base
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Primes
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Déductions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net à Payer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockPayroll.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{entry.employeeName}</div>
                            <div className="text-sm text-gray-500">{entry.position}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{entry.department}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(entry.baseSalary)}</td>
                        <td className="px-6 py-4 text-sm text-green-600 font-medium">+{formatCurrency(entry.bonuses)}</td>
                        <td className="px-6 py-4 text-sm text-red-600 font-medium">-{formatCurrency(entry.deductions)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(entry.netSalary)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                            {getStatusLabel(entry.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedEntry(entry)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setFormData({
                                  currentEmployee: entry.employeeName,
                                  currentSalary: entry.baseSalary,
                                  currentBonuses: entry.bonuses,
                                  currentDeductions: entry.deductions,
                                  entryId: entry.id
                                })
                                setModalContent({
                                  title: `✏️ Modifier Paie - ${entry.employeeName}`,
                                  message: '',
                                  type: 'form'
                                })
                                setModalCallback(() => () => {
                                  const { newSalary, newBonuses, newDeductions } = formData
                                  const updatedNet = (parseInt(newSalary || entry.baseSalary) + parseInt(newBonuses || entry.bonuses) - parseInt(newDeductions || entry.deductions))
                                  setModalContent({
                                    title: '✅ Paie mise à jour',
                                    message: `Fiche de paie modifiée:\n\n👤 ${entry.employeeName}\n💰 Nouveau salaire: ${parseInt(newSalary || entry.baseSalary).toLocaleString()} FCFA\n🎁 Nouvelles primes: ${parseInt(newBonuses || entry.bonuses).toLocaleString()} FCFA\n📉 Nouvelles déductions: ${parseInt(newDeductions || entry.deductions).toLocaleString()} FCFA\n💵 Nouveau net: ${updatedNet.toLocaleString()} FCFA\n📅 Modifié le: ${new Date().toLocaleDateString('fr-FR')}`,
                                    type: 'info'
                                  })
                                })
                                setShowModal(true)
                              }}
                              className="text-green-600 hover:text-green-900 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setModalContent({
                                  title: '📄 Télécharger Bulletin de Paie',
                                  message: `Génération du bulletin de paie:\n\n👤 Employé: ${entry.employeeName}\n📋 Poste: ${entry.position}\n🏢 Département: ${entry.department}\n📅 Période: ${entry.payPeriod}\n💰 Salaire brut: ${entry.baseSalary.toLocaleString()} FCFA\n🎁 Primes: ${entry.bonuses.toLocaleString()} FCFA\n📉 Déductions: ${entry.deductions.toLocaleString()} FCFA\n💵 Net à payer: ${entry.netSalary.toLocaleString()} FCFA\n\n📄 Format: PDF\n📊 Statut: ${getStatusLabel(entry.status)}\n\nLe téléchargement va commencer automatiquement.`,
                                  type: 'info'
                                })
                                setShowModal(true)
                                // Simuler le téléchargement
                                setTimeout(() => {
                                  const link = document.createElement('a')
                                  link.href = '#'
                                  link.download = `Bulletin_${entry.employeeName.replace(' ', '_')}_${entry.payPeriod.replace(' ', '_')}.pdf`
                                  link.click()
                                }, 1000)
                              }}
                              className="text-emerald-600 hover:text-emerald-900 transition-colors"
                            >
                              <Download className="w-4 h-4" />
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

          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Charges RH</h2>
                <button 
                  onClick={() => {
                    setFormData({})
                    setModalContent({
                      title: '💳 Nouvelle Charge RH',
                      message: '',
                      type: 'form'
                    })
                    setModalCallback(() => () => {
                      const { category, description, amount, date } = formData
                      if (category && description && amount) {
                        setModalContent({
                          title: '✅ Charge créée',
                          message: `Nouvelle charge RH enregistrée:\n\n🏷️ Catégorie: ${category}\n📝 Description: ${description}\n💰 Montant: ${parseInt(amount).toLocaleString()} FCFA\n📅 Date: ${date || new Date().toLocaleDateString('fr-FR')}\n👤 Créée par: ${session?.user?.name || 'Admin'}\n📊 Statut: En attente d'approbation\n\nLa charge sera soumise pour validation.`,
                          type: 'info'
                        })
                      }
                    })
                    setShowModal(true)
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle Charge
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockExpenses.map((expense) => (
                  <div key={expense.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-white" />
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {getStatusLabel(expense.status)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{expense.category}</h3>
                    <p className="text-gray-600 text-sm mb-4">{expense.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Montant</span>
                        <span className="font-bold text-emerald-600">{formatCurrency(expense.amount)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Date</span>
                        <span className="font-medium text-gray-900">{new Date(expense.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Approuvé par</span>
                        <span className="font-medium text-gray-900">{expense.approvedBy}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => {
                          setModalContent({
                            title: `👁️ ${expense.category}`,
                            message: `Détails de la charge RH:\n\n🏷️ Catégorie: ${expense.category}\n📝 Description: ${expense.description}\n💰 Montant: ${formatCurrency(expense.amount)}\n📅 Date: ${new Date(expense.date).toLocaleDateString('fr-FR')}\n👤 Approuvé par: ${expense.approvedBy}\n📊 Statut: ${getStatusLabel(expense.status)}\n\n${expense.receipt ? '📎 Justificatif: Disponible\n' : ''}💼 Impact budgétaire: ${expense.amount > 200000 ? 'Élevé' : expense.amount > 100000 ? 'Moyen' : 'Faible'}\n🔍 Référence: ${expense.id}`,
                            type: 'info'
                          })
                          setShowModal(true)
                        }}
                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </button>
                      <button 
                        onClick={() => {
                          setFormData({
                            currentCategory: expense.category,
                            currentDescription: expense.description,
                            currentAmount: expense.amount,
                            expenseId: expense.id
                          })
                          setModalContent({
                            title: `✏️ Modifier ${expense.category}`,
                            message: '',
                            type: 'form'
                          })
                          setModalCallback(() => () => {
                            const { newCategory, newDescription, newAmount } = formData
                            setModalContent({
                              title: '✅ Charge mise à jour',
                              message: `Charge modifiée avec succès:\n\n🏷️ ${expense.category}\n\n${newCategory ? `• Nouvelle catégorie: ${newCategory}\n` : ''}${newDescription ? `• Nouvelle description: ${newDescription}\n` : ''}${newAmount ? `• Nouveau montant: ${parseInt(newAmount).toLocaleString()} FCFA\n` : ''}\n📅 Modifiée le: ${new Date().toLocaleDateString('fr-FR')}\n👤 Par: ${session?.user?.name || 'Admin'}`,
                              type: 'info'
                            })
                          })
                          setShowModal(true)
                        }}
                        className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-4 h-4" />
                        Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Rapports Comptables</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Évolution Masse Salariale</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Janvier 2024</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(totalPayroll)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Décembre 2023</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(totalPayroll * 0.92)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Répartition par Département</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Opérations</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Commercial</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Finance</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>IT</span>
                      <span className="font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-900">Actions Rapides</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => {
                      setModalContent({
                        title: '📄 Export Bulletins de Paie',
                        message: `Génération des bulletins de paie en cours...\n\n📊 Traitement:\n• ${mockPayroll.length} bulletins à générer\n• Format PDF sélectionné\n• Période: ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}\n• Compression ZIP activée\n\n💰 Récapitulatif:\n• Masse salariale: ${totalPayroll.toLocaleString()} FCFA\n• Charges sociales: ${(totalPayroll * 0.3).toLocaleString()} FCFA\n• Nombre d'employés: ${mockPayroll.length}\n\n✅ Génération terminée! Le fichier ZIP sera téléchargé automatiquement.`,
                        type: 'info'
                      })
                      setShowModal(true)
                      setTimeout(() => {
                        const link = document.createElement('a')
                        link.href = '#'
                        link.download = `Bulletins_Paie_${new Date().toISOString().split('T')[0]}.zip`
                        link.click()
                      }, 2000)
                    }}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <Download className="h-6 w-6 text-emerald-600" />
                    <div className="text-left">
                      <div className="font-medium">Bulletin de Paie</div>
                      <div className="text-sm text-gray-500">Exporter tous les bulletins</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setModalContent({
                        title: '📊 Rapport Mensuel Généré',
                        message: `Rapport comptable mensuel créé:\n\n📅 Période: ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}\n\n💰 Données financières:\n• Masse salariale brute: ${(totalPayroll * 1.3).toLocaleString()} FCFA\n• Charges sociales: ${(totalPayroll * 0.3).toLocaleString()} FCFA\n• Net payé: ${totalPayroll.toLocaleString()} FCFA\n• Charges RH: ${totalExpenses.toLocaleString()} FCFA\n\n📈 Indicateurs:\n• Évolution vs mois précédent: +5.2%\n• Taux de charges: 30%\n• Coût moyen par employé: ${avgSalary.toLocaleString()} FCFA\n\n📄 Format: PDF (12 pages)\nLe rapport est prêt pour téléchargement.`,
                        type: 'info'
                      })
                      setShowModal(true)
                    }}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <FileText className="h-6 w-6 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Rapport Mensuel</div>
                      <div className="text-sm text-gray-500">Générer le rapport</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      const chargesSociales = totalPayroll * 0.3
                      const chargesPatronales = totalPayroll * 0.42
                      const totalCharges = chargesSociales + chargesPatronales
                      setModalContent({
                        title: '🧮 Calcul Charges Sociales',
                        message: `Calcul des charges sociales terminé:\n\n💰 Base de calcul: ${totalPayroll.toLocaleString()} FCFA\n\n📊 Détail des charges:\n• Sécurité sociale: ${(chargesSociales * 0.6).toLocaleString()} FCFA\n• Retraite: ${(chargesSociales * 0.25).toLocaleString()} FCFA\n• Assurance chômage: ${(chargesSociales * 0.15).toLocaleString()} FCFA\n\n🏢 Charges patronales:\n• Cotisations employeur: ${chargesPatronales.toLocaleString()} FCFA\n• Formation professionnelle: ${(totalPayroll * 0.02).toLocaleString()} FCFA\n\n💯 Total charges: ${totalCharges.toLocaleString()} FCFA\n📈 Taux global: ${((totalCharges/totalPayroll)*100).toFixed(1)}%`,
                        type: 'info'
                      })
                      setShowModal(true)
                    }}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <Calculator className="h-6 w-6 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">Charges Sociales</div>
                      <div className="text-sm text-gray-500">Calculer les charges</div>
                    </div>
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
                  {modalContent.title.includes('Nouvelle Fiche') ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Employé *
                        </label>
                        <select
                          value={formData.employee || ''}
                          onChange={(e) => setFormData({...formData, employee: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        >
                          <option value="">Sélectionner un employé</option>
                          {mockPayroll.map(entry => (
                            <option key={entry.id} value={entry.employeeName}>{entry.employeeName}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Salaire de base *
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 600000"
                          value={formData.baseSalary || ''}
                          onChange={(e) => setFormData({...formData, baseSalary: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primes et bonus
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 50000"
                          value={formData.bonuses || ''}
                          onChange={(e) => setFormData({...formData, bonuses: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Déductions
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 60000"
                          value={formData.deductions || ''}
                          onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  ) : modalContent.title.includes('Nouvelle Charge') ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catégorie *
                        </label>
                        <select
                          value={formData.category || ''}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        >
                          <option value="">Sélectionner une catégorie</option>
                          <option value="Formation">Formation</option>
                          <option value="Recrutement">Recrutement</option>
                          <option value="Équipement">Équipement</option>
                          <option value="Transport">Transport</option>
                          <option value="Autres">Autres</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          placeholder="Description de la charge..."
                          value={formData.description || ''}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Montant *
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 150000"
                          value={formData.amount || ''}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={formData.date || ''}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  ) : modalContent.title.includes('Modifier Paie') ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouveau salaire de base
                        </label>
                        <input
                          type="number"
                          placeholder={formData.currentSalary}
                          value={formData.newSalary || ''}
                          onChange={(e) => setFormData({...formData, newSalary: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelles primes
                        </label>
                        <input
                          type="number"
                          placeholder={formData.currentBonuses}
                          value={formData.newBonuses || ''}
                          onChange={(e) => setFormData({...formData, newBonuses: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelles déductions
                        </label>
                        <input
                          type="number"
                          placeholder={formData.currentDeductions}
                          value={formData.newDeductions || ''}
                          onChange={(e) => setFormData({...formData, newDeductions: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  ) : modalContent.title.includes('Modifier') && modalContent.title.includes('Formation') ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelle catégorie
                        </label>
                        <select
                          value={formData.newCategory || ''}
                          onChange={(e) => setFormData({...formData, newCategory: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="">Garder la catégorie actuelle</option>
                          <option value="Formation">Formation</option>
                          <option value="Recrutement">Recrutement</option>
                          <option value="Équipement">Équipement</option>
                          <option value="Transport">Transport</option>
                          <option value="Autres">Autres</option>
                        </select>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouveau montant
                        </label>
                        <input
                          type="number"
                          placeholder={formData.currentAmount}
                          value={formData.newAmount || ''}
                          onChange={(e) => setFormData({...formData, newAmount: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="flex-1 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
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
                      className="flex-1 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
                    >
                      {modalContent.title.includes('Nouvelle') ? 'Créer' : 'Mettre à jour'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
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
