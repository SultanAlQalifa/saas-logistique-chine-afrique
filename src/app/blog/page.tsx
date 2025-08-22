'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, User, Clock, ArrowRight, Search, Tag, Eye, MessageCircle, Heart } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  authorAvatar: string
  publishedAt: string
  readTime: number
  category: string
  tags: string[]
  views: number
  comments: number
  likes: number
  featured: boolean
  image: string
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Les nouvelles routes commerciales Chine-Afrique : Opportunités et défis',
    excerpt: 'Découvrez comment les nouvelles infrastructures transforment le commerce entre la Chine et l\'Afrique, créant de nouvelles opportunités pour les entreprises de logistique.',
    content: '',
    author: 'Dr. Amadou Diallo',
    authorAvatar: 'AD',
    publishedAt: '2024-01-15',
    readTime: 8,
    category: 'Commerce International',
    tags: ['Chine', 'Afrique', 'Commerce', 'Logistique'],
    views: 2847,
    comments: 23,
    likes: 156,
    featured: true,
    image: '/blog/china-africa-trade.jpg'
  },
  {
    id: '2',
    title: 'Digitalisation de la logistique en Afrique : État des lieux 2024',
    excerpt: 'Une analyse complète de l\'adoption des technologies numériques dans le secteur logistique africain et son impact sur l\'efficacité opérationnelle.',
    content: '',
    author: 'Fatima Kone',
    authorAvatar: 'FK',
    publishedAt: '2024-01-12',
    readTime: 6,
    category: 'Technologie',
    tags: ['Digitalisation', 'Afrique', 'Innovation', 'Tech'],
    views: 1923,
    comments: 18,
    likes: 89,
    featured: false,
    image: '/blog/digital-logistics.jpg'
  },
  {
    id: '3',
    title: 'Guide complet : Optimiser vos coûts de transport maritime',
    excerpt: 'Stratégies pratiques pour réduire vos coûts de transport maritime tout en maintenant la qualité de service. Conseils d\'experts et études de cas.',
    content: '',
    author: 'Ibrahim Traore',
    authorAvatar: 'IT',
    publishedAt: '2024-01-10',
    readTime: 12,
    category: 'Transport Maritime',
    tags: ['Transport', 'Coûts', 'Optimisation', 'Maritime'],
    views: 3156,
    comments: 31,
    likes: 203,
    featured: true,
    image: '/blog/maritime-transport.jpg'
  },
  {
    id: '4',
    title: 'Réglementations douanières 2024 : Ce qui change pour l\'import-export',
    excerpt: 'Mise à jour complète des nouvelles réglementations douanières qui impactent les entreprises d\'import-export entre la Chine et l\'Afrique.',
    content: '',
    author: 'Aisha Diop',
    authorAvatar: 'AD',
    publishedAt: '2024-01-08',
    readTime: 10,
    category: 'Réglementation',
    tags: ['Douanes', 'Réglementation', 'Import-Export', '2024'],
    views: 2234,
    comments: 27,
    likes: 134,
    featured: false,
    image: '/blog/customs-regulations.jpg'
  },
  {
    id: '5',
    title: 'Success Story : Comment LogiTrans a révolutionné sa chaîne logistique',
    excerpt: 'Découvrez comment LogiTrans a utilisé NextMove pour transformer ses opérations et augmenter son efficacité de 40% en 6 mois.',
    content: '',
    author: 'Moussa Keita',
    authorAvatar: 'MK',
    publishedAt: '2024-01-05',
    readTime: 7,
    category: 'Success Story',
    tags: ['Success Story', 'LogiTrans', 'Transformation', 'Efficacité'],
    views: 1876,
    comments: 15,
    likes: 98,
    featured: false,
    image: '/blog/logitrans-success.jpg'
  },
  {
    id: '6',
    title: 'L\'avenir du e-commerce en Afrique : Tendances 2024-2025',
    excerpt: 'Analyse prospective des tendances du e-commerce africain et leur impact sur les besoins logistiques des entreprises.',
    content: '',
    author: 'Khadija Benali',
    authorAvatar: 'KB',
    publishedAt: '2024-01-03',
    readTime: 9,
    category: 'E-commerce',
    tags: ['E-commerce', 'Afrique', 'Tendances', 'Futur'],
    views: 2567,
    comments: 22,
    likes: 167,
    featured: false,
    image: '/blog/ecommerce-africa.jpg'
  }
]

const categories = [
  'Tous',
  'Commerce International',
  'Technologie',
  'Transport Maritime',
  'Réglementation',
  'Success Story',
  'E-commerce'
]

export default function BlogPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent')

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views
      case 'trending':
        return b.likes - a.likes
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  const featuredPosts = mockBlogPosts.filter(post => post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              📝 Blog NextMove
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Actualités, conseils et insights sur la logistique Chine-Afrique
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher des articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Plus récents</option>
              <option value="popular">Plus populaires</option>
              <option value="trending">Tendances</option>
            </select>
          </div>
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'Tous' && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ⭐ Articles en vedette
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-6xl">📰</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {post.category}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        ⭐ Vedette
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {post.authorAvatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{post.author}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                            <Clock className="h-3 w-3 ml-2" />
                            {post.readTime} min
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Lire la suite
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'Tous' ? 'Tous les articles' : `Articles - ${selectedCategory}`}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                  <div className="text-white text-4xl">📄</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        ⭐
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {post.excerpt}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likes}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} min
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {post.authorAvatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-xs">{post.author}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Lire
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche ou de filtrage.
              </p>
            </div>
          )}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            📧 Restez informé !
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Recevez nos derniers articles et insights directement dans votre boîte mail. 
            Pas de spam, juste du contenu de qualité sur la logistique Chine-Afrique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
