'use client'

import { useState } from 'react'
import { SponsoringBanner as SponsoringBannerType } from '@/types/sponsoring'
import { X, ExternalLink, Clock, MapPin, Package, Star } from 'lucide-react'
import Image from 'next/image'

interface SponsoringBannerProps {
  banner: SponsoringBannerType
  onClose?: () => void
  onAction?: (bannerId: string, action: 'click' | 'impression') => void
  className?: string
}

export default function SponsoringBanner({ 
  banner, 
  onClose, 
  onAction,
  className = '' 
}: SponsoringBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const handleClick = () => {
    onAction?.(banner.id, 'click')
    if (banner.ctaUrl) {
      window.open(banner.ctaUrl, '_blank')
    }
  }

  const handleImpression = () => {
    onAction?.(banner.id, 'impression')
  }

  if (!isVisible || !banner.isActive) return null

  const getPriorityStyles = () => {
    switch (banner.priority) {
      case 'URGENT':
        return 'border-red-500 bg-gradient-to-r from-red-50 to-red-100'
      case 'HIGH':
        return 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100'
      case 'MEDIUM':
        return 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100'
      default:
        return 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100'
    }
  }

  const getTypeIcon = () => {
    switch (banner.type) {
      case 'DEPARTURE_ANNOUNCEMENT':
        return <MapPin className="h-5 w-5" />
      case 'OFFER':
        return <Star className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getTypeLabel = () => {
    switch (banner.type) {
      case 'DEPARTURE_ANNOUNCEMENT':
        return 'Annonce de Départ'
      case 'OFFER':
        return 'Offre Spéciale'
      default:
        return 'Publicité'
    }
  }

  return (
    <div 
      className={`relative border-l-4 rounded-lg shadow-md p-4 mb-4 transition-all duration-300 hover:shadow-lg ${getPriorityStyles()} ${className}`}
      onLoad={handleImpression}
    >
      {/* Badge de type */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
        {getTypeIcon()}
        {getTypeLabel()}
      </div>

      {/* Bouton de fermeture */}
      {onClose && (
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}

      <div className="flex items-start gap-4 mt-6">
        {/* Image */}
        {banner.imageUrl && (
          <div className="flex-shrink-0">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
          </div>
        )}

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {banner.title}
          </h3>
          <p className="text-gray-700 mb-3 line-clamp-2">
            {banner.description}
          </p>

          {/* Informations spécifiques selon le type */}
          {banner.type === 'DEPARTURE_ANNOUNCEMENT' && (
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Départ prévu</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Destination disponible</span>
              </div>
            </div>
          )}

          {/* CTA Button */}
          {banner.ctaText && (
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium"
            >
              {banner.ctaText}
              {banner.ctaUrl && <ExternalLink className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Indicateur de priorité */}
      {banner.priority === 'URGENT' && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-medium">
          URGENT
        </div>
      )}
    </div>
  )
}

// Composant pour afficher plusieurs bannières
interface SponsoringBannerListProps {
  banners: SponsoringBannerType[]
  maxVisible?: number
  onBannerAction?: (bannerId: string, action: 'click' | 'impression') => void
  className?: string
}

export function SponsoringBannerList({ 
  banners, 
  maxVisible = 3,
  onBannerAction,
  className = ''
}: SponsoringBannerListProps) {
  const [visibleBanners, setVisibleBanners] = useState(
    banners.slice(0, maxVisible)
  )

  const handleCloseBanner = (bannerId: string) => {
    setVisibleBanners(prev => prev.filter(banner => banner.id !== bannerId))
  }

  const activeBanners = visibleBanners
    .filter(banner => banner.isActive)
    .sort((a, b) => {
      // Tri par priorité puis par date de création
      const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  if (activeBanners.length === 0) return null

  return (
    <div className={`space-y-4 ${className}`}>
      {activeBanners.map(banner => (
        <SponsoringBanner
          key={banner.id}
          banner={banner}
          onClose={() => handleCloseBanner(banner.id)}
          onAction={onBannerAction}
        />
      ))}
    </div>
  )
}

// Composant compact pour sidebar
export function CompactSponsoringBanner({ 
  banner, 
  onAction 
}: { 
  banner: SponsoringBannerType
  onAction?: (bannerId: string, action: 'click' | 'impression') => void 
}) {
  const handleClick = () => {
    onAction?.(banner.id, 'click')
    if (banner.ctaUrl) {
      window.open(banner.ctaUrl, '_blank')
    }
  }

  return (
    <div 
      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 mb-2">
        {banner.type === 'DEPARTURE_ANNOUNCEMENT' ? (
          <MapPin className="h-4 w-4" />
        ) : (
          <Star className="h-4 w-4" />
        )}
        <span className="text-xs font-medium opacity-90">
          {banner.type === 'DEPARTURE_ANNOUNCEMENT' ? 'Départ' : 'Offre'}
        </span>
      </div>
      <h4 className="font-semibold text-sm mb-1 line-clamp-1">
        {banner.title}
      </h4>
      <p className="text-xs opacity-90 line-clamp-2">
        {banner.description}
      </p>
    </div>
  )
}
