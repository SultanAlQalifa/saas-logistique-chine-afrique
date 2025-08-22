'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, MessageCircle, Heart, Share2, Search, Filter, Plus, TrendingUp, Award, Calendar, Eye, ThumbsUp, MessageSquare } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface CommunityPost {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  authorRole: string
  publishedAt: string
  category: string
  tags: string[]
  likes: number
  comments: number
  views: number
  isLiked: boolean
  isPinned: boolean
  hasAnswered: boolean
}

interface CommunityMember {
  id: string
  name: string
  avatar: string
  role: string
  reputation: number
  posts: number
  helpfulAnswers: number
  joinedAt: string
  isExpert: boolean
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    title: 'Comment optimiser les coûts de transport pour les petits volumes ?',
    content: 'Bonjour à tous ! Je cherche des conseils pour optimiser les coûts de transport pour des envois de petits volumes depuis la Chine vers le Sénégal. Avez-vous des stratégies éprouvées ?',
    author: 'Mamadou Diallo',
    authorAvatar: 'MD',
    authorRole: 'Importateur',
    publishedAt: '2024-01-16T10:30:00Z',
    category: 'Transport',
    tags: ['Coûts', 'Optimisation', 'Petits volumes'],
    likes: 23,
    comments: 8,
    views: 156,
    isLiked: false,
    isPinned: false,
    hasAnswered: false
  },
  {
    id: '2',
    title: '🔥 Nouvelles réglementations douanières - Impact sur vos opérations',
    content: 'Suite aux récentes modifications des réglementations douanières, voici un résumé des principales changes qui impactent nos opérations d\'import-export...',
    author: 'Fatima Kone',
    authorAvatar: 'FK',
    authorRole: 'Expert Douanes',
    publishedAt: '2024-01-15T14:20:00Z',
    category: 'Réglementation',
    tags: ['Douanes', 'Réglementation', 'Actualités'],
    likes: 45,
    comments: 12,
    views: 289,
    isLiked: true,
    isPinned: true,
    hasAnswered: true
  },
  {
    id: '3',
    title: 'Retour d\'expérience : 6 mois avec NextMove',
    content: 'Après 6 mois d\'utilisation de NextMove, je partage mon retour d\'expérience et les améliorations constatées dans nos opérations...',
    author: 'Ibrahim Traore',
    authorAvatar: 'IT',
    authorRole: 'Directeur Logistique',
    publishedAt: '2024-01-14T09:15:00Z',
    category: 'Témoignage',
    tags: ['NextMove', 'Expérience', 'ROI'],
    likes: 67,
    comments: 15,
    views: 423,
    isLiked: false,
    isPinned: false,
    hasAnswered: true
  },
  {
    id: '4',
    title: 'Recherche partenaire logistique fiable au Ghana',
    content: 'Bonjour, je recherche un partenaire logistique fiable au Ghana pour gérer la distribution de mes produits. Des recommandations ?',
    author: 'Aisha Diop',
    authorAvatar: 'AD',
    authorRole: 'Entrepreneur',
    publishedAt: '2024-01-13T16:45:00Z',
    category: 'Partenariats',
    tags: ['Ghana', 'Partenariat', 'Distribution'],
    likes: 12,
    comments: 6,
    views: 98,
    isLiked: false,
    isPinned: false,
    hasAnswered: false
  },
  {
    id: '5',
    title: 'Tendances 2024 : L\'avenir de la logistique Chine-Afrique',
    content: 'Analyse des principales tendances qui vont façonner la logistique Chine-Afrique en 2024. Technologies émergentes, nouveaux corridors...',
    author: 'Dr. Kofi Asante',
    authorAvatar: 'KA',
    authorRole: 'Analyste Secteur',
    publishedAt: '2024-01-12T11:30:00Z',
    category: 'Analyse',
    tags: ['Tendances', '2024', 'Innovation'],
    likes: 89,
    comments: 22,
    views: 567,
    isLiked: true,
    isPinned: false,
    hasAnswered: true
  }
]

const topMembers: CommunityMember[] = [
  {
    id: '1',
    name: 'Dr. Kofi Asante',
    avatar: 'KA',
    role: 'Analyste Secteur',
    reputation: 2847,
    posts: 45,
    helpfulAnswers: 123,
    joinedAt: '2023-03-15',
    isExpert: true
  },
  {
    id: '2',
    name: 'Fatima Kone',
    avatar: 'FK',
    role: 'Expert Douanes',
    reputation: 2156,
    posts: 38,
    helpfulAnswers: 89,
    joinedAt: '2023-05-20',
    isExpert: true
  },
  {
    id: '3',
    name: 'Ibrahim Traore',
    avatar: 'IT',
    role: 'Directeur Logistique',
    reputation: 1923,
    posts: 32,
    helpfulAnswers: 76,
    joinedAt: '2023-07-10',
    isExpert: false
  }
]

const categories = [
  'Tous',
  'Transport',
  'Réglementation', 
  'Témoignage',
  'Partenariats',
  'Analyse',
  'Questions',
  'Actualités'
]

export default function CommunityPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent')
  const [showNewPostModal, setShowNewPostModal] = useState(false)

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes + b.comments) - (a.likes + a.comments)
      case 'trending':
        return b.views - a.views
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  const pinnedPosts = filteredPosts.filter(post => post.isPinned)
  const regularPosts = filteredPosts.filter(post => !post.isPinned)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              🌍 Communauté NextMove
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Échangez avec des professionnels de la logistique Chine-Afrique, partagez vos expériences et trouvez des solutions ensemble
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowNewPostModal(true)}
                className="px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nouveau post
              </button>
              <Link
                href="/community/experts"
                className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-green-600 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Award className="h-5 w-5" />
                Nos experts
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Rechercher dans la communauté..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  {categories.slice(0, 4).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                  <option value="trending">Tendances</option>
                </select>
              </div>
            </div>

            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📌 Posts épinglés
                </h2>
                <div className="space-y-4">
                  {pinnedPosts.map((post) => (
                    <div key={post.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            {post.authorAvatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{post.author}</div>
                            <div className="text-sm text-gray-600">{post.authorRole}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            📌 Épinglé
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'text-red-500 fill-current' : ''}`} />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <Link
                          href={`/community/posts/${post.id}`}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          Voir la discussion →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span>💬 Discussions récentes</span>
                <span className="text-sm font-normal text-gray-500">
                  {regularPosts.length} discussion{regularPosts.length > 1 ? 's' : ''}
                </span>
              </h2>

              <div className="space-y-6">
                {regularPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                          {post.authorAvatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{post.author}</div>
                          <div className="text-sm text-gray-600">{post.authorRole}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                          {post.category}
                        </span>
                        {post.hasAnswered && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            ✅ Résolu
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors">
                      <Link href={`/community/posts/${post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {post.content}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className={`flex items-center gap-1 hover:text-red-500 transition-colors ${post.isLiked ? 'text-red-500' : ''}`}>
                          <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </button>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Share2 className="h-4 w-4 text-gray-400" />
                        </button>
                        <Link
                          href={`/community/posts/${post.id}`}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          Participer →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {regularPosts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Aucune discussion trouvée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Essayez de modifier vos critères de recherche ou créez une nouvelle discussion.
                  </p>
                  <button
                    onClick={() => setShowNewPostModal(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Créer une discussion
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">📊 Statistiques</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Membres actifs</span>
                  <span className="font-bold text-green-600">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discussions</span>
                  <span className="font-bold text-blue-600">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Réponses utiles</span>
                  <span className="font-bold text-purple-600">5,678</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experts</span>
                  <span className="font-bold text-orange-600">45</span>
                </div>
              </div>
            </div>

            {/* Top Members */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">🏆 Membres les plus actifs</h3>
              <div className="space-y-4">
                {topMembers.map((member, index) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {member.avatar}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                        {member.isExpert && (
                          <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                            ⭐
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">{member.reputation} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">🚀 Actions rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle discussion
                </button>
                <Link
                  href="/community/experts"
                  className="w-full px-4 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  Consulter un expert
                </Link>
                <Link
                  href="/community/guidelines"
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Règles de la communauté
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">📂 Catégories</h3>
              <div className="space-y-2">
                {categories.slice(1).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
