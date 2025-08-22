'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UserPlus, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Users,
  FileText,
  Video,
  MessageSquare,
  TrendingUp,
  Target,
  Award,
  User
} from 'lucide-react'

// Types pour le recrutement
interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
  experience: string
  education: string
  location: string
  salary: string
  status: 'nouveau' | 'en_cours' | 'entretien' | 'test' | 'accepte' | 'refuse' | 'en_attente'
  source: string
  appliedDate: string
  lastActivity: string
  skills: string[]
  languages: string[]
  cvUrl?: string
  notes: string
  score: number
  recruiter: string
}

interface JobOffer {
  id: string
  title: string
  department: string
  type: 'CDI' | 'CDD' | 'Stage' | 'Freelance'
  location: string
  salary: string
  description: string
  requirements: string[]
  status: 'active' | 'pause' | 'closed'
  publishedDate: string
  applications: number
  views: number
}

// Données mock pour les candidatures
const mockCandidates: Candidate[] = [
  {
    id: 'cand-001',
    firstName: 'Aminata',
    lastName: 'Diallo',
    email: 'aminata.diallo@email.com',
    phone: '+33 6 12 34 56 78',
    position: 'Développeur Full Stack',
    department: 'Technique',
    experience: '3 ans',
    education: 'Master Informatique',
    location: 'Paris, France',
    salary: '45 000 FCFA',
    status: 'entretien',
    source: 'LinkedIn',
    appliedDate: '2024-01-15',
    lastActivity: '2024-01-20',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    languages: ['Français', 'Anglais', 'Wolof'],
    notes: 'Profil très intéressant, expérience solide en développement web',
    score: 85,
    recruiter: 'Ibrahim Sow'
  },
  {
    id: 'cand-002',
    firstName: 'Moussa',
    lastName: 'Keita',
    email: 'moussa.keita@email.com',
    phone: '+33 6 23 45 67 89',
    position: 'Responsable Logistique',
    department: 'Opérations',
    experience: '5 ans',
    education: 'Master Supply Chain',
    location: 'Lyon, France',
    salary: '50 000 FCFA',
    status: 'test',
    source: 'Indeed',
    appliedDate: '2024-01-10',
    lastActivity: '2024-01-18',
    skills: ['Logistique', 'SAP', 'Gestion stocks', 'Optimisation'],
    languages: ['Français', 'Anglais'],
    notes: 'Excellente expérience en logistique internationale',
    score: 92,
    recruiter: 'Aminata Ba'
  },
  {
    id: 'cand-003',
    firstName: 'Fatou',
    lastName: 'Sow',
    email: 'fatou.sow@email.com',
    phone: '+33 6 34 56 78 90',
    position: 'Chargée Marketing',
    department: 'Commercial',
    experience: '2 ans',
    education: 'Master Marketing Digital',
    location: 'Marseille, France',
    salary: '38 000 FCFA',
    status: 'nouveau',
    source: 'Site Web',
    appliedDate: '2024-01-22',
    lastActivity: '2024-01-22',
    skills: ['Marketing Digital', 'SEO', 'Google Ads', 'Analytics'],
    languages: ['Français', 'Anglais', 'Espagnol'],
    notes: 'Nouveau profil, à évaluer',
    score: 0,
    recruiter: 'Ibrahim Sow'
  }
]

// Données mock pour les offres d'emploi
const mockJobOffers: JobOffer[] = [
  {
    id: 'job-001',
    title: 'Développeur Full Stack Senior',
    department: 'Technique',
    type: 'CDI',
    location: 'Paris, France',
    salary: '45 000 - 55 000 FCFA',
    description: 'Nous recherchons un développeur full stack expérimenté...',
    requirements: ['React', 'Node.js', 'TypeScript', '3+ ans d\'expérience'],
    status: 'active',
    publishedDate: '2024-01-01',
    applications: 12,
    views: 156
  },
  {
    id: 'job-002',
    title: 'Responsable Logistique',
    department: 'Opérations',
    type: 'CDI',
    location: 'Lyon, France',
    salary: '48 000 - 58 000 FCFA',
    description: 'Poste de responsable logistique pour nos opérations...',
    requirements: ['Logistique', 'Supply Chain', 'SAP', '5+ ans d\'expérience'],
    status: 'active',
    publishedDate: '2024-01-05',
    applications: 8,
    views: 89
  }
]

const statusColors = {
  nouveau: 'bg-blue-100 text-blue-800',
  en_cours: 'bg-yellow-100 text-yellow-800',
  entretien: 'bg-purple-100 text-purple-800',
  test: 'bg-orange-100 text-orange-800',
  accepte: 'bg-green-100 text-green-800',
  refuse: 'bg-red-100 text-red-800',
  en_attente: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  entretien: 'Entretien',
  test: 'Test technique',
  accepte: 'Accepté',
  refuse: 'Refusé',
  en_attente: 'En attente'
}

export default function RecruitmentPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'candidates' | 'jobs'>('candidates')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' as 'info' | 'confirm' | 'form' })
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null)
  const [formData, setFormData] = useState<any>({})

  const handleNewCandidate = () => {
    router.push('/dashboard/hr/candidates/create')
  }

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalCandidates: mockCandidates.length,
    newCandidates: mockCandidates.filter(c => c.status === 'nouveau').length,
    interviews: mockCandidates.filter(c => c.status === 'entretien').length,
    hired: mockCandidates.filter(c => c.status === 'accepte').length,
    activeJobs: mockJobOffers.filter(j => j.status === 'active').length,
    avgScore: Math.round(mockCandidates.reduce((acc, c) => acc + c.score, 0) / mockCandidates.length)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <UserPlus className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">👥 Recrutement</h1>
            <p className="text-blue-100 text-lg">Gestion des candidatures et processus de recrutement</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalCandidates}</p>
              <p className="text-sm text-blue-500">Candidatures</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.newCandidates}</p>
              <p className="text-sm text-green-500">Nouveaux</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.interviews}</p>
              <p className="text-sm text-purple-500">Entretiens</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.hired}</p>
              <p className="text-sm text-yellow-500">Recrutés</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">{stats.activeJobs}</p>
              <p className="text-sm text-indigo-500">Offres actives</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
          <div className="flex items-center gap-3">
            <div className="bg-pink-500 p-2 rounded-lg">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-600">{stats.avgScore}%</p>
              <p className="text-sm text-pink-500">Score moyen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'candidates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Candidatures ({mockCandidates.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Offres d'emploi ({mockJobOffers.length})
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'candidates' && (
            <div className="space-y-6">
              {/* Filtres et recherche */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom ou poste..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleNewCandidate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Nouveau candidat
                  </button>
                </div>
              </div>

              {/* Liste des candidatures */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {filteredCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedCandidate?.id === candidate.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg text-white">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {candidate.firstName} {candidate.lastName}
                                </h3>
                                <p className="text-blue-600 font-medium">{candidate.position}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {candidate.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {candidate.phone}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {candidate.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                {candidate.experience}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {candidate.skills.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{candidate.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[candidate.status]}`}>
                              {statusLabels[candidate.status]}
                            </span>
                            {candidate.score > 0 && (
                              <div className="mt-2 flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700">{candidate.score}%</span>
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Candidature: {new Date(candidate.appliedDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Détails du candidat sélectionné */}
                <div className="space-y-6">
                  {selectedCandidate ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Eye className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Détails Candidat</h2>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl text-white">
                          <div className="flex items-center gap-3">
                            <User className="h-8 w-8" />
                            <div>
                              <h3 className="font-bold text-lg">
                                {selectedCandidate.firstName} {selectedCandidate.lastName}
                              </h3>
                              <p className="opacity-90">{selectedCandidate.position}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{selectedCandidate.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">{selectedCandidate.phone}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{selectedCandidate.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-gray-600">
                            <GraduationCap className="h-4 w-4" />
                            <span className="text-sm">{selectedCandidate.education}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-gray-600">
                            <Target className="h-4 w-4" />
                            <span className="text-sm">{selectedCandidate.salary}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Compétences
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Langues
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.languages.map((language, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                              >
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>

                        {selectedCandidate.notes && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Notes
                            </h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {selectedCandidate.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-4">
                          <button 
                            onClick={() => {
                              setModalContent({
                                title: '📹 Planifier un Entretien',
                                message: `Planifier un entretien avec ${selectedCandidate.firstName} ${selectedCandidate.lastName}\n\n👤 Candidat: ${selectedCandidate.firstName} ${selectedCandidate.lastName}\n📧 Email: ${selectedCandidate.email}\n📞 Téléphone: ${selectedCandidate.phone}\n💼 Poste: ${selectedCandidate.position}\n⭐ Score: ${selectedCandidate.score}%\n\n📅 Proposer une date d'entretien:\n• Lundi 19 août 2024 - 10h00\n• Mardi 20 août 2024 - 14h30\n• Mercredi 21 août 2024 - 09h00\n\nUn email de convocation sera envoyé automatiquement.`,
                                type: 'confirm'
                              })
                              setModalCallback(() => () => {
                                setModalContent({
                                  title: '✅ Entretien planifié',
                                  message: `Entretien planifié avec succès!\n\n👤 ${selectedCandidate.firstName} ${selectedCandidate.lastName}\n📅 Date: Lundi 19 août 2024\n🕙 Heure: 10h00\n📍 Lieu: Visioconférence\n\n📧 Email de convocation envoyé\n📱 SMS de rappel programmé\n📝 Statut candidature: Entretien planifié`,
                                  type: 'info'
                                })
                              })
                              setShowModal(true)
                            }}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Video className="h-4 w-4" />
                            Entretien
                          </button>
                          <button 
                            onClick={() => {
                              setModalContent({
                                title: '📄 Télécharger CV',
                                message: `Téléchargement du CV de ${selectedCandidate.firstName} ${selectedCandidate.lastName}\n\n📋 Informations du CV:\n• Nom: ${selectedCandidate.firstName}_${selectedCandidate.lastName}_CV.pdf\n• Taille: 2.3 MB\n• Date de soumission: ${selectedCandidate.appliedDate}\n• Format: PDF\n\n💼 Expérience: ${selectedCandidate.experience}\n🎓 Formation: ${selectedCandidate.education}\n🛠️ Compétences: ${selectedCandidate.skills.join(', ')}\n\nLe téléchargement va commencer automatiquement.`,
                                type: 'info'
                              })
                              setShowModal(true)
                              // Simuler le téléchargement
                              setTimeout(() => {
                                const link = document.createElement('a')
                                link.href = '#'
                                link.download = `${selectedCandidate.firstName}_${selectedCandidate.lastName}_CV.pdf`
                                link.click()
                              }, 1000)
                            }}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            CV
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="text-center text-gray-500">
                        <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Sélectionnez un candidat pour voir ses détails</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Offres d'emploi actives</h2>
                <button 
                  onClick={() => {
                    setFormData({})
                    setModalContent({
                      title: '💼 Nouvelle Offre d\'Emploi',
                      message: '',
                      type: 'form'
                    })
                    setModalCallback(() => () => {
                      const { title, department, location, salary, type, description } = formData
                      if (title && department && location) {
                        setModalContent({
                          title: '✅ Offre créée avec succès!',
                          message: `Nouvelle offre d'emploi publiée:\n\n📋 Poste: ${title}\n🏢 Département: ${department}\n📍 Localisation: ${location}\n💰 Salaire: ${salary || 'À négocier'}\n📄 Type: ${type || 'CDI'}\n📅 Date de publication: ${new Date().toLocaleDateString('fr-FR')}\n📊 Statut: Active\n\n${description ? `📝 Description: ${description}\n\n` : ''}L'offre est maintenant visible sur votre plateforme de recrutement et les candidats peuvent postuler.`,
                          type: 'info'
                        })
                      }
                    })
                    setShowModal(true)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Nouvelle offre
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockJobOffers.map((job) => (
                  <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                        <p className="text-blue-600 font-medium">{job.department}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        {job.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{job.salary}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.applications} candidatures
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {job.views} vues
                        </span>
                      </div>
                      <span>Publié le {new Date(job.publishedDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre du poste *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Développeur Full Stack Senior"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Département *
                    </label>
                    <select
                      value={formData.department || ''}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner un département</option>
                      <option value="Technique">Technique</option>
                      <option value="Opérations">Opérations</option>
                      <option value="Commercial">Commercial</option>
                      <option value="RH">Ressources Humaines</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localisation *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Paris, France"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de contrat
                    </label>
                    <select
                      value={formData.type || 'CDI'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salaire proposé
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 45 000 - 55 000 FCFA"
                      value={formData.salary || ''}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description du poste
                    </label>
                    <textarea
                      placeholder="Description détaillée du poste et des responsabilités..."
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
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
                      className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
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
                      className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                      Publier l'offre
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
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
