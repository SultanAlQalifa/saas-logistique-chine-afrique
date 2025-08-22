'use client'

import React, { useState, useEffect } from 'react'
import { X, ExternalLink, Eye } from 'lucide-react'

interface BannerData {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  position: 'top' | 'middle' | 'bottom' | 'sidebar'
  isActive: boolean
  priority: number
  startDate: string
  endDate: string
  targetAudience: string[]
  clickCount: number
  impressionCount: number
}

interface HomeBannerProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar'
  className?: string
}

export default function HomeBanner({ position, className = '' }: HomeBannerProps) {
  const [banners, setBanners] = useState<BannerData[]>([])
  const [currentBanner, setCurrentBanner] = useState<BannerData | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Mock data pour les bannières
  const mockBanners: BannerData[] = [
    {
      id: '1',
      title: 'Expédition Express Chine-Afrique',
      description: 'Livraison en 48h avec LogiTrans Premium',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=200&fit=crop',
      linkUrl: 'https://logitrans.com/express',
      position: 'top',
      isActive: true,
      priority: 1,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      targetAudience: ['importers', 'businesses'],
      clickCount: 245,
      impressionCount: 12500
    },
    {
      id: '2',
      title: 'Assurance Cargo Complète',
      description: 'Protégez vos marchandises avec AfricaCargo',
      imageUrl: '/api/placeholder/800/200',
      linkUrl: 'https://africacargo.com/insurance',
      position: 'middle',
      isActive: true,
      priority: 2,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      targetAudience: ['all'],
      clickCount: 189,
      impressionCount: 8900
    },
    {
      id: '3',
      title: 'Financement Import-Export',
      description: 'Solutions de financement pour vos projets',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=180&fit=crop',
      linkUrl: 'https://example.com/services',
      position: 'sidebar',
      isActive: true,
      priority: 3,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      targetAudience: ['businesses', 'enterprises'],
      clickCount: 156,
      impressionCount: 6700
    },
    {
      id: '4',
      title: 'Formation Logistique',
      description: 'Devenez expert en logistique internationale',
      imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=150&fit=crop',
      linkUrl: 'https://example.com/training',
      position: 'bottom',
      isActive: true,
      priority: 4,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      targetAudience: ['individuals', 'professionals'],
      clickCount: 98,
      impressionCount: 4200
    }
  ]

  useEffect(() => {
    // Filtrer les bannières par position et statut actif
    const activeBanners = mockBanners.filter(
      banner => banner.position === position && banner.isActive
    )
    
    setBanners(activeBanners)
    
    if (activeBanners.length > 0) {
      // Sélectionner la bannière avec la plus haute priorité
      const selectedBanner = activeBanners.sort((a, b) => a.priority - b.priority)[0]
      setCurrentBanner(selectedBanner)
      
      // Incrémenter le compteur d'impressions
      trackImpression(selectedBanner.id)
    }
  }, [position])

  const trackImpression = (bannerId: string) => {
    // Simuler le tracking d'impression
    console.log(`Impression tracked for banner: ${bannerId}`)
  }

  const trackClick = (bannerId: string, linkUrl: string) => {
    // Simuler le tracking de clic
    console.log(`Click tracked for banner: ${bannerId}`)
    
    // Ouvrir le lien dans un nouvel onglet
    window.open(linkUrl, '_blank', 'noopener,noreferrer')
  }

  const closeBanner = () => {
    setIsVisible(false)
  }

  if (!currentBanner || !isVisible) {
    return null
  }

  const getBannerStyles = () => {
    switch (position) {
      case 'top':
        return 'w-full h-24 md:h-32 bg-gradient-to-r from-blue-600 to-purple-600'
      case 'middle':
        return 'w-full h-32 md:h-40 bg-gradient-to-r from-green-500 to-blue-500'
      case 'bottom':
        return 'w-full h-20 md:h-24 bg-gradient-to-r from-orange-500 to-red-500'
      case 'sidebar':
        return 'w-full h-64 bg-gradient-to-b from-purple-500 to-pink-500'
      default:
        return 'w-full h-32 bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${getBannerStyles()} ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-between p-4 md:p-6">
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg md:text-xl mb-1 md:mb-2">
            {currentBanner.title}
          </h3>
          <p className="text-white/90 text-sm md:text-base mb-2 md:mb-3">
            {currentBanner.description}
          </p>
          
          {position !== 'sidebar' && (
            <button
              onClick={() => trackClick(currentBanner.id, currentBanner.linkUrl)}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
            >
              <ExternalLink className="w-4 h-4" />
              En savoir plus
            </button>
          )}
        </div>
        
        {position === 'sidebar' && (
          <div className="text-center">
            <button
              onClick={() => trackClick(currentBanner.id, currentBanner.linkUrl)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors backdrop-blur-sm block w-full mb-3"
            >
              Découvrir
            </button>
            <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
              <Eye className="w-3 h-3" />
              {currentBanner.impressionCount.toLocaleString()} vues
            </div>
          </div>
        )}
        
        {/* Close Button */}
        <button
          onClick={closeBanner}
          className="ml-4 p-1 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress Bar for Limited Time Offers */}
      {position === 'top' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full bg-yellow-400 w-3/4 animate-pulse" />
        </div>
      )}
    </div>
  )
}
