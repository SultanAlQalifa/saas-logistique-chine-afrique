'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Package,
  TrendingUp,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Shield,
  AlertTriangle
} from 'lucide-react'
import { Company, PlanType, SubscriptionStatus } from '@/types'
import Link from 'next/link'

export default function CompaniesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState<PlanType | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'ALL'>('ALL')
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Handlers pour les actions
  const handleView = (company: Company) => {
    setSelectedCompany(company)
    setShowViewModal(true)
  }

  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setShowEditModal(true)
  }

  const handleDelete = (company: Company) => {
    setSelectedCompany(company)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (selectedCompany) {
      setCompanies(prev => prev.filter(c => c.id !== selectedCompany.id))
      setShowDeleteModal(false)
      setSelectedCompany(null)
      alert('✅ Entreprise supprimée avec succès!')
    }
  }

  const handleSaveEdit = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c))
    setShowEditModal(false)
    setSelectedCompany(null)
    alert('✅ Entreprise modifiée avec succès!')
  }

  // Mock data pour les entreprises
  const mockCompanies: Company[] = [
    {
      id: '1',
      name: 'LogiTrans SARL',
      email: 'contact@logitrans.com',
      phone: '+225 07 08 09 10',
      address: '123 Rue du Commerce',
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      planType: PlanType.PROFESSIONAL,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      maxUsers: 50,
      maxPackagesPerMonth: 1000,
      trialEndsAt: undefined,
      subscriptionEndsAt: new Date('2024-12-31')
    },
    {
      id: '2',
      name: 'Express Cargo Mali',
      email: 'info@expresscargo.ml',
      phone: '+223 20 21 22 23',
      address: '456 Avenue de la Paix',
      country: 'Mali',
      city: 'Bamako',
      planType: PlanType.STARTER,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      maxUsers: 10,
      maxPackagesPerMonth: 200,
      trialEndsAt: undefined,
      subscriptionEndsAt: new Date('2024-10-15')
    },
    {
      id: '3',
      name: 'Fret International BF',
      email: 'contact@fretbf.com',
      phone: '+226 25 30 35 40',
      address: '789 Boulevard Central',
      country: 'Burkina Faso',
      city: 'Ouagadougou',
      planType: PlanType.ENTERPRISE,
      subscriptionStatus: SubscriptionStatus.TRIAL,
      maxUsers: 100,
      maxPackagesPerMonth: 5000,
      trialEndsAt: new Date('2024-09-15'),
      subscriptionEndsAt: undefined
    },
    {
      id: '4',
      name: 'Logistics Pro Sénégal',
      email: 'admin@logpro.sn',
      phone: '+221 33 45 67 89',
      address: '321 Rue de la République',
      country: 'Sénégal',
      city: 'Dakar',
      planType: PlanType.FREE,
      subscriptionStatus: SubscriptionStatus.EXPIRED,
      maxUsers: 3,
      maxPackagesPerMonth: 50,
      trialEndsAt: undefined,
      subscriptionEndsAt: new Date('2024-08-01')
    }
  ]

  useEffect(() => {
    // Vérifier les permissions d'accès
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Seuls les SUPER_ADMIN peuvent voir cette page
    if (session.user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard')
      return
    }

    // Simuler le chargement des données
    setTimeout(() => {
      setCompanies(mockCompanies)
      setLoading(false)
    }, 1000)
  }, [session, status, router])

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.country?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPlan = planFilter === 'ALL' || company.planType === planFilter
    const matchesStatus = statusFilter === 'ALL' || company.subscriptionStatus === statusFilter

    return matchesSearch && matchesPlan && matchesStatus
  })

  const planColors = {
    FREE: 'bg-gray-100 text-gray-800',
    STARTER: 'bg-blue-100 text-blue-800',
    PROFESSIONAL: 'bg-purple-100 text-purple-800',
    ENTERPRISE: 'bg-green-100 text-green-800',
  }

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    TRIAL: 'bg-yellow-100 text-yellow-800',
    EXPIRED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  }

  const planLabels = {
    FREE: 'Gratuit',
    STARTER: 'Starter',
    PROFESSIONAL: 'Professionnel',
    ENTERPRISE: 'Entreprise',
  }

  const statusLabels = {
    ACTIVE: 'Actif',
    TRIAL: 'Essai',
    EXPIRED: 'Expiré',
    CANCELLED: 'Annulé',
  }

  // Afficher un écran de chargement pendant la vérification des permissions
  if (status === 'loading' || loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Afficher un message d'erreur si l'utilisateur n'a pas les permissions
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-red-200 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Shield className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚫 Accès Restreint</h2>
            <p className="text-gray-600 mb-6">
              Cette page est réservée aux super administrateurs de la plateforme. 
              Les entreprises ne peuvent voir que leurs propres données.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-800 font-medium">
                  Vous êtes connecté en tant que: <strong>{session?.user.role}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Retour au Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Building2 className="h-10 w-10" />
                🏢 Gestion des Entreprises
              </h1>
              <p className="text-blue-100 text-lg">
                Gérez les entreprises clientes et leurs abonnements
              </p>
            </div>
            <Link
              href="/dashboard/companies/create"
              className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline font-semibold">Nouvelle Entreprise</span>
              <span className="sm:hidden font-semibold">Nouvelle</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistiques rapides améliorées */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Entreprises</p>
              <p className="text-3xl font-bold text-blue-900">{companies.length}</p>
              <p className="text-xs text-blue-600 mt-1">📈 Toutes catégories</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Actives</p>
              <p className="text-3xl font-bold text-green-900">
                {companies.filter(c => c.subscriptionStatus === SubscriptionStatus.ACTIVE).length}
              </p>
              <p className="text-xs text-green-600 mt-1">✅ Abonnements valides</p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">En Essai</p>
              <p className="text-3xl font-bold text-yellow-900">
                {companies.filter(c => c.subscriptionStatus === SubscriptionStatus.TRIAL).length}
              </p>
              <p className="text-xs text-yellow-600 mt-1">🕒 Période d'évaluation</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-xl">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-lg border border-red-200 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Expirées</p>
              <p className="text-3xl font-bold text-red-900">
                {companies.filter(c => c.subscriptionStatus === SubscriptionStatus.EXPIRED).length}
              </p>
              <p className="text-xs text-red-600 mt-1">⚠️ Nécessite renouvellement</p>
            </div>
            <div className="bg-red-500 p-3 rounded-xl">
              <Trash2 className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche améliorés */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="🔍 Rechercher par nom, email, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur text-base transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as PlanType | 'ALL')}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur font-medium"
            >
              <option value="ALL">📋 Tous les plans</option>
              <option value={PlanType.FREE}>🆓 Gratuit</option>
              <option value={PlanType.STARTER}>🚀 Starter</option>
              <option value={PlanType.PROFESSIONAL}>💼 Professionnel</option>
              <option value={PlanType.ENTERPRISE}>🏢 Entreprise</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubscriptionStatus | 'ALL')}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur font-medium"
            >
              <option value="ALL">📊 Tous les statuts</option>
              <option value={SubscriptionStatus.ACTIVE}>✅ Actif</option>
              <option value={SubscriptionStatus.TRIAL}>🕒 Essai</option>
              <option value={SubscriptionStatus.EXPIRED}>⚠️ Expiré</option>
              <option value={SubscriptionStatus.CANCELLED}>❌ Annulé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des entreprises amélioré */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Limites
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">ID: {company.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {company.email}
                    </div>
                    {company.phone && (
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {company.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {company.city}
                    </div>
                    <div className="text-sm text-gray-500">{company.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${planColors[company.planType]}`}>
                      {planLabels[company.planType]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[company.subscriptionStatus]}`}>
                      {statusLabels[company.subscriptionStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      {company.maxUsers}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      {company.maxPackagesPerMonth}/mois
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleView(company)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(company)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(company)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Supprimer"
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

        {filteredCompanies.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">🔍 Aucune entreprise trouvée</h3>
            <p className="text-gray-500 text-lg">Essayez de modifier vos critères de recherche ou ajoutez une nouvelle entreprise.</p>
          </div>
        )}
      </div>

      {/* Modal de visualisation */}
      {showViewModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">📋 Détails de l'entreprise</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedCompany.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedCompany.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedCompany.phone || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedCompany.city}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedCompany.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${planColors[selectedCompany.planType]}`}>
                    {planLabels[selectedCompany.planType]}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[selectedCompany.subscriptionStatus]}`}>
                    {statusLabels[selectedCompany.subscriptionStatus]}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Utilisateurs</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedCompany.maxUsers}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedCompany.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">🗑️ Supprimer l'entreprise</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer <strong>{selectedCompany.name}</strong> ? 
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">✏️ Modifier l'entreprise</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const updatedCompany = {
                ...selectedCompany,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                address: formData.get('address') as string,
                city: formData.get('city') as string,
                country: formData.get('country') as string,
                planType: formData.get('planType') as PlanType,
                subscriptionStatus: formData.get('subscriptionStatus') as SubscriptionStatus,
                maxUsers: parseInt(formData.get('maxUsers') as string),
                maxPackagesPerMonth: parseInt(formData.get('maxPackagesPerMonth') as string)
              }
              handleSaveEdit(updatedCompany)
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedCompany.name}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={selectedCompany.email}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={selectedCompany.phone || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={selectedCompany.city || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                    <input
                      type="text"
                      name="country"
                      defaultValue={selectedCompany.country || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                    <select
                      name="planType"
                      defaultValue={selectedCompany.planType}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={PlanType.FREE}>Gratuit</option>
                      <option value={PlanType.STARTER}>Starter</option>
                      <option value={PlanType.PROFESSIONAL}>Professionnel</option>
                      <option value={PlanType.ENTERPRISE}>Entreprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      name="subscriptionStatus"
                      defaultValue={selectedCompany.subscriptionStatus}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={SubscriptionStatus.ACTIVE}>Actif</option>
                      <option value={SubscriptionStatus.TRIAL}>Essai</option>
                      <option value={SubscriptionStatus.EXPIRED}>Expiré</option>
                      <option value={SubscriptionStatus.CANCELLED}>Annulé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Utilisateurs</label>
                    <input
                      type="number"
                      name="maxUsers"
                      defaultValue={selectedCompany.maxUsers}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Colis/mois</label>
                    <input
                      type="number"
                      name="maxPackagesPerMonth"
                      defaultValue={selectedCompany.maxPackagesPerMonth}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <textarea
                      name="address"
                      defaultValue={selectedCompany.address || ''}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
