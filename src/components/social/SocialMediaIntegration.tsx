'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Share2, Heart, MessageSquare, Repeat2 } from 'lucide-react'

interface SocialPost {
  id: string
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok'
  content: string
  mediaUrl?: string
  publishedAt: Date
  metrics: {
    likes: number
    comments: number
    shares: number
    views?: number
  }
  status: 'published' | 'scheduled' | 'draft'
}

interface SocialMediaIntegrationProps {
  onPostPublished?: (post: SocialPost) => void
}

export default function SocialMediaIntegration({ onPostPublished }: SocialMediaIntegrationProps) {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [newPost, setNewPost] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook'])
  const [isPublishing, setIsPublishing] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<{ [key: string]: boolean }>({})

  const socialPlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      followers: '2.5K'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-500',
      textColor: 'text-pink-500',
      followers: '1.8K'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      textColor: 'text-sky-500',
      followers: '950'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      textColor: 'text-blue-700',
      followers: '3.2K'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-600',
      textColor: 'text-red-600',
      followers: '1.2K'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: MessageCircle,
      color: 'bg-black',
      textColor: 'text-black',
      followers: '890'
    }
  ]

  useEffect(() => {
    // Simuler le chargement des comptes connectés
    setConnectedAccounts({
      facebook: true,
      instagram: true,
      twitter: true,
      linkedin: false,
      youtube: false,
      tiktok: false
    })

    // Charger les posts existants
    loadRecentPosts()
  }, [])

  const loadRecentPosts = () => {
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        platform: 'facebook',
        content: '🚢 Nouveau service de transport maritime express ! Livraison Chine-Afrique en seulement 18 jours. #Logistique #ChinaAfrica',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        metrics: { likes: 45, comments: 8, shares: 12 },
        status: 'published'
      },
      {
        id: '2',
        platform: 'instagram',
        content: '📦 Suivi en temps réel de vos colis ! Notre nouvelle interface vous permet de suivre chaque étape de votre expédition.',
        mediaUrl: '/images/tracking-interface.jpg',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        metrics: { likes: 89, comments: 15, shares: 23, views: 1250 },
        status: 'published'
      }
    ]
    
    setPosts(mockPosts)
  }

  const publishPost = async () => {
    if (!newPost.trim() || selectedPlatforms.length === 0) return

    setIsPublishing(true)

    try {
      // Publier sur chaque plateforme sélectionnée
      for (const platform of selectedPlatforms) {
        const post: SocialPost = {
          id: Date.now().toString() + platform,
          platform: platform as any,
          content: newPost,
          publishedAt: new Date(),
          metrics: { likes: 0, comments: 0, shares: 0 },
          status: 'published'
        }

        // Simuler l'API de publication
        await publishToSocialMedia(platform, newPost)
        
        setPosts(prev => [post, ...prev])
        
        if (onPostPublished) {
          onPostPublished(post)
        }
      }

      setNewPost('')
      
    } catch (error) {
      console.error('Erreur publication:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  const publishToSocialMedia = async (platform: string, content: string) => {
    // Simulation d'API de publication sur réseaux sociaux
    const response = await fetch(`/api/social/${platform}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    
    if (!response.ok) {
      throw new Error(`Erreur publication ${platform}`)
    }
    
    return response.json()
  }

  const connectAccount = async (platform: string) => {
    // Simuler la connexion OAuth
    const authUrl = `https://api.${platform}.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin)}/auth/callback/${platform}`
    
    // Ouvrir popup OAuth
    const popup = window.open(authUrl, 'social-auth', 'width=600,height=600')
    
    // Écouter la fermeture de la popup
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed)
        // Vérifier si la connexion a réussi
        setConnectedAccounts(prev => ({ ...prev, [platform]: true }))
      }
    }, 1000)
  }

  const getPlatformIcon = (platform: string) => {
    const platformData = socialPlatforms.find(p => p.id === platform)
    if (!platformData) return MessageCircle
    return platformData.icon
  }

  const getPlatformColor = (platform: string) => {
    const platformData = socialPlatforms.find(p => p.id === platform)
    return platformData?.textColor || 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Connexion des comptes */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Comptes connectés</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon
            const isConnected = connectedAccounts[platform.id]
            
            return (
              <div
                key={platform.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isConnected 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{platform.name}</p>
                    <p className="text-xs text-gray-500">{platform.followers} abonnés</p>
                  </div>
                </div>
                
                {isConnected ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium">Connecté</span>
                  </div>
                ) : (
                  <button
                    onClick={() => connectAccount(platform.id)}
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full transition-colors"
                  >
                    Connecter
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Composer un post */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Publier un post</h3>
        
        {/* Sélection des plateformes */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Publier sur :</p>
          <div className="flex flex-wrap gap-2">
            {socialPlatforms.filter(p => connectedAccounts[p.id]).map((platform) => {
              const Icon = platform.icon
              const isSelected = selectedPlatforms.includes(platform.id)
              
              return (
                <button
                  key={platform.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedPlatforms(prev => prev.filter(p => p !== platform.id))
                    } else {
                      setSelectedPlatforms(prev => [...prev, platform.id])
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    isSelected
                      ? `${platform.color} text-white border-transparent`
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{platform.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Zone de texte */}
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Quoi de neuf ? Partagez vos actualités logistiques..."
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />

        {/* Compteur de caractères et bouton */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            {newPost.length}/280 caractères
          </span>
          <button
            onClick={publishPost}
            disabled={!newPost.trim() || selectedPlatforms.length === 0 || isPublishing}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {isPublishing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span>{isPublishing ? 'Publication...' : 'Publier'}</span>
          </button>
        </div>
      </div>

      {/* Posts récents */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Posts récents</h3>
        
        <div className="space-y-4">
          {posts.map((post) => {
            const Icon = getPlatformIcon(post.platform)
            const colorClass = getPlatformColor(post.platform)
            
            return (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${colorClass}`} />
                  <span className="text-sm font-medium capitalize">{post.platform}</span>
                  <span className="text-xs text-gray-500">
                    {post.publishedAt.toLocaleString('fr-FR')}
                  </span>
                </div>
                
                <p className="text-gray-800 mb-3">{post.content}</p>
                
                {post.mediaUrl && (
                  <div className="mb-3">
                    <Image 
                      src={post.mediaUrl} 
                      alt="Post media" 
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.metrics.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.metrics.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Repeat2 className="w-4 h-4" />
                    <span>{post.metrics.shares}</span>
                  </div>
                  {post.metrics.views && (
                    <div className="flex items-center gap-1">
                      <span>👁️</span>
                      <span>{post.metrics.views}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
