'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3,
  Trash2,
  Eye,
  Download,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface Policy {
  id: string
  title: string
  category: 'GENERAL' | 'SECURITY' | 'LEAVE' | 'CONDUCT' | 'BENEFITS'
  description: string
  version: string
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  author: string
  updatedAt: string
}

// Mock data
const mockPolicies: Policy[] = [
  {
    id: '1',
    title: 'Politique de Congés',
    category: 'LEAVE',
    description: 'Règles et procédures pour les demandes de congés',
    version: '2.1',
    status: 'ACTIVE',
    author: 'Aissatou Ndiaye',
    updatedAt: '2023-06-01'
  },
  {
    id: '2',
    title: 'Code de Conduite',
    category: 'CONDUCT',
    description: 'Règles de comportement et éthique professionnelle',
    version: '1.5',
    status: 'ACTIVE',
    author: 'Marie Diallo',
    updatedAt: '2023-03-15'
  },
  {
    id: '3',
    title: 'Politique de Sécurité IT',
    category: 'SECURITY',
    description: 'Sécurité informatique et protection des données',
    version: '3.0',
    status: 'ACTIVE',
    author: 'Ousmane Traoré',
    updatedAt: '2023-07-20'
  },
  {
    id: '4',
    title: 'Politique de Télétravail',
    category: 'GENERAL',
    description: 'Règles et conditions du travail à distance',
    version: '1.0',
    status: 'DRAFT',
    author: 'Fatou Sow',
    updatedAt: '2023-08-15'
  }
]

export default function PoliciesPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GENERAL': return 'text-blue-600 bg-blue-100'
      case 'SECURITY': return 'text-red-600 bg-red-100'
      case 'LEAVE': return 'text-green-600 bg-green-100'
      case 'CONDUCT': return 'text-purple-600 bg-purple-100'
      case 'BENEFITS': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100'
      case 'DRAFT': return 'text-yellow-600 bg-yellow-100'
      case 'ARCHIVED': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4" />
      case 'DRAFT': return <Clock className="w-4 h-4" />
      case 'ARCHIVED': return <XCircle className="w-4 h-4" />
      default: return <XCircle className="w-4 h-4" />
    }
  }

  const filteredPolicies = mockPolicies.filter(policy => {
    const matchesSearch = 
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || policy.category === filterCategory
    const matchesStatus = filterStatus === 'all' || policy.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const activePolicies = mockPolicies.filter(policy => policy.status === 'ACTIVE').length
  const draftPolicies = mockPolicies.filter(policy => policy.status === 'DRAFT').length

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">📋 Politiques RH</h1>
            <p className="text-indigo-100 text-lg">Gérez les politiques et procédures de l'entreprise</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setFormData({})
                setModalContent({
                  title: '📋 Nouvelle Politique RH',
                  message: '',
                  type: 'form'
                })
                setModalCallback(() => () => {
                  const { title, category, description } = formData
                  if (title && category && description) {
                    setModalContent({
                      title: '✅ Politique créée',
                      message: `Nouvelle politique créée avec succès:\n\n📋 Titre: ${title}\n🏷️ Catégorie: ${category}\n📝 Description: ${description}\n👤 Auteur: ${session?.user?.name || 'Admin'}\n📅 Date: ${new Date().toLocaleDateString('fr-FR')}\n📊 Statut: Brouillon`,
                      type: 'info'
                    })
                  }
                })
                setShowModal(true)
              }}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Nouvelle Politique
            </button>
            <button 
              onClick={() => {
                const csvData = mockPolicies.map(policy => ({
                  Titre: policy.title,
                  Catégorie: policy.category,
                  Description: policy.description,
                  Version: policy.version,
                  Statut: policy.status,
                  Auteur: policy.author,
                  'Dernière MAJ': policy.updatedAt
                }))
                const csvContent = "data:text/csv;charset=utf-8," + 
                  Object.keys(csvData[0]).join(",") + "\n" +
                  csvData.map(row => Object.values(row).join(",")).join("\n")
                const encodedUri = encodeURI(csvContent)
                const link = document.createElement("a")
                link.setAttribute("href", encodedUri)
                link.setAttribute("download", `politiques_rh_${new Date().toISOString().split('T')[0]}.csv`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                setModalContent({
                  title: '📊 Export terminé',
                  message: `Export des politiques RH terminé!\n\n• ${mockPolicies.length} politiques exportées\n• Fichier: politiques_rh_${new Date().toISOString().split('T')[0]}.csv\n• Format: CSV\n• Encodage: UTF-8`,
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
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Politiques</p>
              <p className="text-3xl font-bold text-blue-900">{mockPolicies.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Actives</p>
              <p className="text-3xl font-bold text-green-900">{activePolicies}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Brouillons</p>
              <p className="text-3xl font-bold text-yellow-900">{draftPolicies}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">À Réviser</p>
              <p className="text-3xl font-bold text-purple-900">2</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une politique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              <option value="GENERAL">Général</option>
              <option value="SECURITY">Sécurité</option>
              <option value="LEAVE">Congés</option>
              <option value="CONDUCT">Conduite</option>
              <option value="BENEFITS">Avantages</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="DRAFT">Brouillon</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille des politiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolicies.map((policy) => (
          <div key={policy.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                {getStatusIcon(policy.status)}
                {policy.status === 'ACTIVE' ? 'Actif' : policy.status === 'DRAFT' ? 'Brouillon' : 'Archivé'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{policy.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{policy.description}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Catégorie</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(policy.category)}`}>
                  {policy.category === 'GENERAL' ? 'Général' :
                   policy.category === 'SECURITY' ? 'Sécurité' :
                   policy.category === 'LEAVE' ? 'Congés' :
                   policy.category === 'CONDUCT' ? 'Conduite' : 'Avantages'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Version</span>
                <span className="font-medium text-gray-900">v{policy.version}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Auteur</span>
                <span className="font-medium text-gray-900">{policy.author}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Dernière MAJ</span>
                <span className="font-medium text-gray-900">{new Date(policy.updatedAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
              <button 
                onClick={() => {
                  setModalContent({
                    title: `👁️ ${policy.title}`,
                    message: `📋 Titre: ${policy.title}\n\n📝 Description: ${policy.description}\n\n🏷️ Catégorie: ${policy.category === 'GENERAL' ? 'Général' : policy.category === 'SECURITY' ? 'Sécurité' : policy.category === 'LEAVE' ? 'Congés' : policy.category === 'CONDUCT' ? 'Conduite' : 'Avantages'}\n\n📊 Statut: ${policy.status === 'ACTIVE' ? 'Actif' : policy.status === 'DRAFT' ? 'Brouillon' : 'Archivé'}\n\n📌 Version: v${policy.version}\n\n👤 Auteur: ${policy.author}\n\n📅 Dernière mise à jour: ${new Date(policy.updatedAt).toLocaleDateString('fr-FR')}\n\n📄 Contenu: Cette politique définit les règles et procédures à suivre. Elle est applicable à tous les employés de l'entreprise et doit être respectée en tout temps.`,
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
                    currentTitle: policy.title, 
                    currentDescription: policy.description,
                    currentCategory: policy.category,
                    policyId: policy.id
                  })
                  setModalContent({
                    title: `✏️ Modifier ${policy.title}`,
                    message: '',
                    type: 'form'
                  })
                  setModalCallback(() => () => {
                    const { newTitle, newDescription, newCategory } = formData
                    if (newTitle || newDescription || newCategory) {
                      setModalContent({
                        title: '✅ Politique mise à jour',
                        message: `Politique mise à jour avec succès:\n\n📋 ${policy.title}\n\n${newTitle ? `• Nouveau titre: ${newTitle}\n` : ''}${newDescription ? `• Nouvelle description: ${newDescription}\n` : ''}${newCategory ? `• Nouvelle catégorie: ${newCategory}\n` : ''}\n📅 Mise à jour: ${new Date().toLocaleDateString('fr-FR')}\n📌 Nouvelle version: v${parseFloat(policy.version) + 0.1}`,
                        type: 'info'
                      })
                    }
                  })
                  setShowModal(true)
                }}
                className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Edit3 className="w-4 h-4" />
                Modifier
              </button>
              <button 
                onClick={() => {
                  setModalContent({
                    title: '⚠️ Supprimer la politique',
                    message: `Êtes-vous sûr de vouloir supprimer cette politique?\n\n📋 ${policy.title}\n🏷️ ${policy.category}\n📌 Version ${policy.version}\n👤 ${policy.author}\n\n⚠️ Cette action est irréversible!`,
                    type: 'confirm'
                  })
                  setModalCallback(() => () => {
                    setModalContent({
                      title: '🗑️ Politique supprimée',
                      message: `La politique "${policy.title}" a été supprimée avec succès.\n\n📅 Date de suppression: ${new Date().toLocaleDateString('fr-FR')}\n👤 Supprimée par: ${session?.user?.name || 'Admin'}`,
                      type: 'info'
                    })
                  })
                  setShowModal(true)
                }}
                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPolicies.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune politique trouvée</h3>
          <p className="text-gray-500 mb-6">Essayez de modifier vos critères de recherche.</p>
          <button 
            onClick={() => {
              setFormData({})
              setModalContent({
                title: '📋 Créer la première politique',
                message: '',
                type: 'form'
              })
              setModalCallback(() => () => {
                const { title, category, description } = formData
                if (title && category && description) {
                  setModalContent({
                    title: '🎉 Première politique créée!',
                    message: `Félicitations! Votre première politique a été créée:\n\n📋 Titre: ${title}\n🏷️ Catégorie: ${category}\n📝 Description: ${description}\n👤 Auteur: ${session?.user?.name || 'Admin'}\n📅 Date: ${new Date().toLocaleDateString('fr-FR')}\n📊 Statut: Brouillon\n\nVous pouvez maintenant commencer à gérer vos politiques RH!`,
                    type: 'info'
                  })
                }
              })
              setShowModal(true)
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200"
          >
            <Plus className="h-4 w-4" />
            Créer la première politique
          </button>
        </div>
      )}
      {/* Modal personnalisé */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{modalContent.title}</h3>
              
              {modalContent.type === 'form' ? (
                <div className="space-y-4">
                  {modalContent.title.includes('Modifier') ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouveau titre (optionnel)
                        </label>
                        <input
                          type="text"
                          placeholder={formData.currentTitle}
                          value={formData.newTitle || ''}
                          onChange={(e) => setFormData({...formData, newTitle: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelle description (optionnel)
                        </label>
                        <textarea
                          placeholder={formData.currentDescription}
                          value={formData.newDescription || ''}
                          onChange={(e) => setFormData({...formData, newDescription: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nouvelle catégorie (optionnel)
                        </label>
                        <select
                          value={formData.newCategory || ''}
                          onChange={(e) => setFormData({...formData, newCategory: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Garder la catégorie actuelle</option>
                          <option value="GENERAL">Général</option>
                          <option value="SECURITY">Sécurité</option>
                          <option value="LEAVE">Congés</option>
                          <option value="CONDUCT">Conduite</option>
                          <option value="BENEFITS">Avantages</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titre de la politique *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Politique de congés"
                          value={formData.title || ''}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catégorie *
                        </label>
                        <select
                          value={formData.category || ''}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        >
                          <option value="">Sélectionner une catégorie</option>
                          <option value="GENERAL">Général</option>
                          <option value="SECURITY">Sécurité</option>
                          <option value="LEAVE">Congés</option>
                          <option value="CONDUCT">Conduite</option>
                          <option value="BENEFITS">Avantages</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          placeholder="Description de la politique..."
                          value={formData.description || ''}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </>
                  )}
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
                      className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
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
                      className="flex-1 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
                    >
                      {modalContent.title.includes('Modifier') ? 'Mettre à jour' : 'Créer'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
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
