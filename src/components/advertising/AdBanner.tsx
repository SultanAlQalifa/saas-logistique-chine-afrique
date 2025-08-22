'use client'

import React from 'react'
import Image from 'next/image'
import { Advertisement, AD_DIMENSIONS } from '@/types/advertising'
import { ExternalLink, Eye } from 'lucide-react'

interface AdBannerProps {
  advertisement: Advertisement
  onImpression?: (adId: string) => void
  onClick?: (adId: string) => void
  className?: string
}

export default function AdBanner({ 
  advertisement, 
  onImpression, 
  onClick,
  className = '' 
}: AdBannerProps) {
  const dimensionKey = advertisement.position.toUpperCase() as keyof typeof AD_DIMENSIONS
  const dimensions = AD_DIMENSIONS[dimensionKey] || advertisement.dimensions || { width: 300, height: 250 }

  React.useEffect(() => {
    // Enregistrer l'impression
    if (onImpression) {
      onImpression(advertisement.id)
    }
  }, [advertisement.id, onImpression])

  const handleClick = () => {
    if (onClick) {
      onClick(advertisement.id)
    }
    // Ouvrir le lien dans un nouvel onglet
    if (advertisement.targetUrl) {
      window.open(advertisement.targetUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (advertisement.status !== 'active') {
    return null
  }

  return (
    <div 
      className={`relative group cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        maxWidth: '100%'
      }}
      onClick={handleClick}
    >
      {/* Image publicitaire */}
      <div className="relative w-full h-full">
        <Image
          src={advertisement.imageUrl}
          alt={advertisement.title}
          fill
          className="object-cover"
          sizes={`${dimensions.width}px`}
        />
        
        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
        
        {/* Badge "Publicité" */}
        <div className="absolute top-1 right-1 bg-gray-900/80 text-white text-xs px-2 py-1 rounded">
          Pub
        </div>
        
        {/* Icône de lien externe au hover */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white/90 p-1 rounded-full">
            <ExternalLink className="w-3 h-3 text-gray-700" />
          </div>
        </div>
      </div>
      
      {/* Tooltip avec informations */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
          {advertisement.title}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  )
}

// Composant pour afficher plusieurs publicités dans un espace
interface AdSpaceProps {
  position: 'header' | 'sidebar' | 'footer' | 'dashboard'
  advertisements: Advertisement[]
  maxAds?: number
  onImpression?: (adId: string) => void
  onClick?: (adId: string) => void
  className?: string
}

export function AdSpace({ 
  position, 
  advertisements, 
  maxAds = 1,
  onImpression,
  onClick,
  className = ''
}: AdSpaceProps) {
  const activeAds = advertisements
    .filter(ad => ad.status === 'active' && ad.position === position)
    .slice(0, maxAds)

  if (activeAds.length === 0) {
    return null
  }

  const isHorizontal = position === 'header' || position === 'footer'
  
  return (
    <div className={`flex ${isHorizontal ? 'flex-row gap-4' : 'flex-col gap-2'} ${className}`}>
      {activeAds.map((ad) => (
        <AdBanner
          key={ad.id}
          advertisement={ad}
          onImpression={onImpression}
          onClick={onClick}
        />
      ))}
    </div>
  )
}

// Composant placeholder quand aucune pub n'est disponible
export function AdPlaceholder({ 
  position, 
  className = '' 
}: { 
  position: 'header' | 'sidebar' | 'footer' | 'dashboard'
  className?: string 
}) {
  const dimensions = AD_DIMENSIONS[position.toUpperCase() as keyof typeof AD_DIMENSIONS] || { width: 300, height: 250 }
  
  return (
    <div 
      className={`border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        maxWidth: '100%'
      }}
    >
      <div className="text-center text-gray-500">
        <Eye className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Espace publicitaire</p>
        <p className="text-xs">{dimensions.width}x{dimensions.height}</p>
      </div>
    </div>
  )
}
