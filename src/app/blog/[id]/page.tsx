'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Clock, Eye, MessageCircle, Heart, Share2, Bookmark, Tag } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  authorAvatar: string
  authorBio: string
  publishedAt: string
  updatedAt?: string
  readTime: number
  category: string
  tags: string[]
  views: number
  comments: number
  likes: number
  featured: boolean
  image: string
}

const mockBlogPost: BlogPost = {
  id: '1',
  title: 'Les nouvelles routes commerciales Chine-Afrique : Opportunités et défis',
  excerpt: 'Découvrez comment les nouvelles infrastructures transforment le commerce entre la Chine et l\'Afrique, créant de nouvelles opportunités pour les entreprises de logistique.',
  content: `
# Introduction

Le commerce entre la Chine et l'Afrique connaît une transformation majeure avec l'émergence de nouvelles routes commerciales et infrastructures. Cette évolution présente des opportunités exceptionnelles mais aussi des défis considérables pour les entreprises de logistique.

## L'évolution du commerce Chine-Afrique

Depuis le lancement de l'initiative "Belt and Road" (Nouvelle Route de la Soie), les échanges commerciaux entre la Chine et l'Afrique ont connu une croissance exponentielle. En 2023, le volume des échanges a atteint **282 milliards de dollars**, soit une augmentation de 15% par rapport à l'année précédente.

### Les nouvelles infrastructures

Les investissements chinois en Afrique se concentrent sur plusieurs secteurs clés :

- **Ports maritimes** : Modernisation et construction de nouveaux terminaux
- **Chemins de fer** : Développement de lignes ferroviaires transcontinentales
- **Routes et autoroutes** : Amélioration des connexions terrestres
- **Aéroports** : Expansion des capacités de fret aérien

## Opportunités pour les entreprises de logistique

### 1. Diversification des routes commerciales

Les nouvelles infrastructures permettent une diversification des itinéraires, réduisant les risques et optimisant les coûts de transport.

### 2. Réduction des délais de livraison

Grâce aux améliorations infrastructurelles, les délais de transport ont été réduits de **30% en moyenne** sur les principales routes.

### 3. Nouveaux marchés émergents

L'ouverture de nouvelles routes facilite l'accès à des marchés africains jusqu'alors difficiles à atteindre.

## Les défis à relever

### Complexité réglementaire

La multiplicité des juridictions et réglementations douanières reste un défi majeur pour les entreprises de logistique.

### Infrastructures en développement

Malgré les investissements, certaines infrastructures restent en cours de développement, créant des goulots d'étranglement temporaires.

### Formation et compétences

Le besoin en personnel qualifié dans les nouvelles technologies logistiques représente un défi important.

## Recommandations stratégiques

Pour tirer parti de ces évolutions, les entreprises de logistique doivent :

1. **Investir dans la technologie** : Adopter des solutions digitales pour optimiser les opérations
2. **Développer des partenariats locaux** : Collaborer avec des acteurs locaux pour naviguer dans l'environnement réglementaire
3. **Former les équipes** : Investir dans la formation continue des collaborateurs
4. **Diversifier les services** : Élargir l'offre pour répondre aux nouveaux besoins du marché

## Conclusion

Les nouvelles routes commerciales Chine-Afrique représentent une opportunité historique pour les entreprises de logistique. Celles qui sauront s'adapter rapidement et investir dans les bonnes stratégies seront les grandes gagnantes de cette transformation.

L'avenir du commerce Chine-Afrique s'annonce prometteur, et les entreprises de logistique ont un rôle central à jouer dans cette évolution.
  `,
  author: 'Dr. Amadou Diallo',
  authorAvatar: 'AD',
  authorBio: 'Expert en commerce international et logistique Afrique-Asie. 15 ans d\'expérience dans le développement des corridors commerciaux.',
  publishedAt: '2024-01-15',
  updatedAt: '2024-01-16',
  readTime: 8,
  category: 'Commerce International',
  tags: ['Chine', 'Afrique', 'Commerce', 'Logistique', 'Infrastructure'],
  views: 2847,
  comments: 23,
  likes: 156,
  featured: true,
  image: '/blog/china-africa-trade.jpg'
}

const relatedPosts = [
  {
    id: '2',
    title: 'Digitalisation de la logistique en Afrique : État des lieux 2024',
    category: 'Technologie',
    readTime: 6,
    publishedAt: '2024-01-12'
  },
  {
    id: '3',
    title: 'Guide complet : Optimiser vos coûts de transport maritime',
    category: 'Transport Maritime',
    readTime: 12,
    publishedAt: '2024-01-10'
  },
  {
    id: '4',
    title: 'Réglementations douanières 2024 : Ce qui change pour l\'import-export',
    category: 'Réglementation',
    readTime: 10,
    publishedAt: '2024-01-08'
  }
]

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const post = mockBlogPost // In real app, fetch by params.id

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `${post.title} - ${post.excerpt}`
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`)
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Lien copié dans le presse-papiers !')
        break
    }
    setShowShareMenu(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour au blog
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  isLiked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {post.likes + (isLiked ? 1 : 0)}
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-all ${
                  isBookmarked 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      🐦 Partager sur Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      💼 Partager sur LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      📘 Partager sur Facebook
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      🔗 Copier le lien
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Featured Image */}
          <div className="aspect-video bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
            <div className="text-white text-8xl">🌍</div>
          </div>
          
          <div className="p-8">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {post.category}
              </span>
              {post.featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  ⭐ Article vedette
                </span>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views.toLocaleString()} vues
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments} commentaires
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime} min de lecture
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 pb-8 border-b border-gray-200 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {post.authorAvatar}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{post.author}</div>
                <div className="text-sm text-gray-600 mb-1">{post.authorBio}</div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Publié le {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                  </div>
                  {post.updatedAt && (
                    <div className="flex items-center gap-1">
                      Mis à jour le {new Date(post.updatedAt).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {post.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.slice(2)}</h1>
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{paragraph.slice(3)}</h2>
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{paragraph.slice(4)}</h3>
                  }
                  if (paragraph.startsWith('- ')) {
                    return <li key={index} className="ml-4 mb-1">{paragraph.slice(2)}</li>
                  }
                  if (paragraph.match(/^\d+\. /)) {
                    return <li key={index} className="ml-4 mb-1">{paragraph.replace(/^\d+\. /, '')}</li>
                  }
                  if (paragraph.includes('**') && paragraph.includes('**')) {
                    const parts = paragraph.split('**')
                    return (
                      <p key={index} className="mb-4">
                        {parts.map((part, i) => 
                          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                      </p>
                    )
                  }
                  if (paragraph.trim()) {
                    return <p key={index} className="mb-4">{paragraph}</p>
                  }
                  return null
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags :</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📚 Articles similaires
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                    {relatedPost.category}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3 line-clamp-2">
                  {relatedPost.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(relatedPost.publishedAt).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {relatedPost.readTime} min
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            📧 Ne ratez aucun article !
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Abonnez-vous à notre newsletter pour recevoir nos derniers insights sur la logistique Chine-Afrique.
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
