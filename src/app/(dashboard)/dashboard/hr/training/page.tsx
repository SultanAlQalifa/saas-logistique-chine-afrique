'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  Target, 
  TrendingUp,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  User,
  MapPin,
  Video,
  FileText,
  Download,
  Star,
  BarChart3
} from 'lucide-react'

interface TrainingProgram {
  id: string
  title: string
  description: string
  category: string
  level: 'Débutant' | 'Intermédiaire' | 'Avancé'
  duration: string
  format: 'Présentiel' | 'En ligne' | 'Hybride'
  instructor: string
  maxParticipants: number
  currentParticipants: number
  status: 'active' | 'draft' | 'completed'
  startDate: string
  endDate: string
  price: string
  rating: number
  completionRate: number
}

interface TrainingSession {
  id: string
  programId: string
  title: string
  date: string
  time: string
  duration: string
  location: string
  instructor: string
  participants: string[]
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  materials: string[]
}

const mockPrograms: TrainingProgram[] = [
  {
    id: 'prog-001',
    title: 'Leadership et Management',
    description: 'Formation complète sur les techniques de leadership moderne',
    category: 'Management',
    level: 'Intermédiaire',
    duration: '3 jours',
    format: 'Présentiel',
    instructor: 'Moussa Keita',
    maxParticipants: 15,
    currentParticipants: 12,
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    price: '150 000 FCFA',
    rating: 4.8,
    completionRate: 85
  },
  {
    id: 'prog-002',
    title: 'Développement Web Moderne',
    description: 'React, Node.js et technologies modernes',
    category: 'Technique',
    level: 'Avancé',
    duration: '5 jours',
    format: 'Hybride',
    instructor: 'Kadiatou Diallo',
    maxParticipants: 10,
    currentParticipants: 8,
    status: 'active',
    startDate: '2024-02-05',
    endDate: '2024-02-09',
    price: '200 000 FCFA',
    rating: 4.9,
    completionRate: 92
  }
]

const mockSessions: TrainingSession[] = [
  {
    id: 'sess-001',
    programId: 'prog-001',
    title: 'Introduction au Leadership',
    date: '2024-02-01',
    time: '09:00',
    duration: '4h',
    location: 'Salle de formation A',
    instructor: 'Moussa Keita',
    participants: ['emp-001', 'emp-002', 'emp-003'],
    status: 'completed',
    materials: ['Présentation Leadership.pdf', 'Exercices pratiques.docx']
  },
  {
    id: 'sess-002',
    programId: 'prog-002',
    title: 'React Avancé',
    date: '2024-02-05',
    time: '14:00',
    duration: '3h',
    location: 'En ligne - Zoom',
    instructor: 'Kadiatou Diallo',
    participants: ['emp-004', 'emp-005'],
    status: 'scheduled',
    materials: ['Code examples.zip', 'Documentation React.pdf']
  }
]

const levelColors = {
  'Débutant': 'bg-green-100 text-green-800',
  'Intermédiaire': 'bg-yellow-100 text-yellow-800',
  'Avancé': 'bg-red-100 text-red-800'
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
  scheduled: 'bg-blue-100 text-blue-800',
  ongoing: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800'
}

export default function TrainingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'programs' | 'sessions' | 'analytics'>('programs')
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null)

  const handleNewProgram = () => {
    router.push('/dashboard/hr/training/programs/create')
  }

  const handleNewSession = () => {
    router.push('/dashboard/hr/training/sessions/create')
  }

  const stats = {
    totalPrograms: mockPrograms.length,
    activePrograms: mockPrograms.filter(p => p.status === 'active').length,
    totalParticipants: mockPrograms.reduce((acc, p) => acc + p.currentParticipants, 0),
    avgCompletion: Math.round(mockPrograms.reduce((acc, p) => acc + p.completionRate, 0) / mockPrograms.length),
    upcomingSessions: mockSessions.filter(s => s.status === 'scheduled').length,
    avgRating: (mockPrograms.reduce((acc, p) => acc + p.rating, 0) / mockPrograms.length).toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">🎓 Formation</h1>
            <p className="text-orange-100 text-lg">Programmes de formation et développement des compétences</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalPrograms}</p>
              <p className="text-sm text-blue-500">Programmes</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.activePrograms}</p>
              <p className="text-sm text-green-500">Actifs</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.totalParticipants}</p>
              <p className="text-sm text-purple-500">Participants</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.avgCompletion}%</p>
              <p className="text-sm text-yellow-500">Taux réussite</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">{stats.upcomingSessions}</p>
              <p className="text-sm text-indigo-500">Sessions à venir</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
          <div className="flex items-center gap-3">
            <div className="bg-pink-500 p-2 rounded-lg">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-600">{stats.avgRating}</p>
              <p className="text-sm text-pink-500">Note moyenne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('programs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'programs'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Programmes ({mockPrograms.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sessions'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Sessions ({mockSessions.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Programmes de Formation</h2>
                <button 
                  onClick={handleNewProgram}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                >
                  <GraduationCap className="h-4 w-4" />
                  Nouveau programme
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockPrograms.map((program) => (
                      <div
                        key={program.id}
                        className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedProgram?.id === program.id ? 'border-yellow-500 shadow-lg' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedProgram(program)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg text-white">
                            <GraduationCap className="h-6 w-6" />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[program.status]}`}>
                            {program.status}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-2">{program.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center justify-between">
                            <span>Catégorie:</span>
                            <span className="font-medium">{program.category}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Niveau:</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${levelColors[program.level]}`}>
                              {program.level}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Durée:</span>
                            <span className="font-medium">{program.duration}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Format:</span>
                            <span className="font-medium">{program.format}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{program.currentParticipants}/{program.maxParticipants}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{program.rating}</span>
                          </div>
                        </div>

                        <div className="mt-4 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(program.currentParticipants / program.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedProgram ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Détails du Programme</h2>
                      
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl text-white">
                          <h3 className="font-bold text-lg">{selectedProgram.title}</h3>
                          <p className="opacity-90">{selectedProgram.category}</p>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Instructeur:</span>
                            <span className="font-medium">{selectedProgram.instructor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Prix:</span>
                            <span className="font-medium text-green-600">{selectedProgram.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Début:</span>
                            <span className="font-medium">{new Date(selectedProgram.startDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fin:</span>
                            <span className="font-medium">{new Date(selectedProgram.endDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Taux de réussite:</span>
                            <span className="font-medium">{selectedProgram.completionRate}%</span>
                          </div>
                        </div>

                        <div className="pt-4">
                          <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                            Gérer le programme
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="text-center text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Sélectionnez un programme pour voir ses détails</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Sessions de Formation</h2>
                <button 
                  onClick={handleNewSession}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Nouvelle session
                </button>
              </div>

              <div className="space-y-4">
                {mockSessions.map((session) => (
                  <div key={session.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg text-white">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{session.title}</h3>
                            <p className="text-gray-600">Instructeur: {session.instructor}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {session.time} ({session.duration})
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {session.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {session.participants.length} participants
                          </div>
                        </div>

                        {session.materials.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Matériel de formation:</h4>
                            <div className="flex flex-wrap gap-2">
                              {session.materials.map((material, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"
                                >
                                  <FileText className="h-3 w-3" />
                                  {material}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Analytics Formation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Performance par Catégorie</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Management</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Technique</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Tendances Mensuelles</h3>
                  <div className="text-center text-gray-500 py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Graphiques à venir</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
