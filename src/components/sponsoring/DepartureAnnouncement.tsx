'use client'

import { useState } from 'react'
import { DepartureAnnouncement } from '@/types/sponsoring'
import { 
  MapPin, 
  Calendar, 
  Package, 
  DollarSign, 
  Phone, 
  Star,
  Clock,
  Truck,
  Ship,
  Plane
} from 'lucide-react'

interface DepartureAnnouncementCardProps {
  announcement: DepartureAnnouncement
  onContact?: (announcementId: string) => void
  className?: string
}

export default function DepartureAnnouncementCard({ 
  announcement, 
  onContact,
  className = '' 
}: DepartureAnnouncementCardProps) {
  const [showContact, setShowContact] = useState(false)

  const handleContact = () => {
    onContact?.(announcement.id)
    setShowContact(true)
  }

  const getSponsorshipBadge = () => {
    switch (announcement.sponsorshipLevel) {
      case 'FEATURED':
        return (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            FEATURED
          </div>
        )
      case 'PREMIUM':
        return (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            PREMIUM
          </div>
        )
      case 'BASIC':
        return (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            SPONSORISÉ
          </div>
        )
      default:
        return null
    }
  }

  const getTransportIcon = () => {
    if (announcement.originPort.includes('Shanghai') || announcement.originPort.includes('Guangzhou')) {
      return <Ship className="h-5 w-5 text-blue-600" />
    }
    return <Truck className="h-5 w-5 text-green-600" />
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getDaysUntilDeparture = () => {
    const today = new Date()
    const departure = new Date(announcement.departureDate)
    const diffTime = departure.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDeparture = getDaysUntilDeparture()

  return (
    <div className={`relative bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 ${className}`}>
      {/* Badge de sponsoring */}
      {announcement.isSponsored && getSponsorshipBadge()}

      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getTransportIcon()}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {announcement.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {announcement.description}
            </p>
          </div>
        </div>
      </div>

      {/* Itinéraire */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <MapPin className="h-4 w-4" />
            Départ
          </div>
          <div className="font-medium text-gray-900">
            {announcement.originPort}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <div className="w-8 h-0.5 bg-gray-300 relative">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2 text-sm text-gray-600 mb-1">
            Arrivée
            <MapPin className="h-4 w-4" />
          </div>
          <div className="font-medium text-gray-900">
            {announcement.destinationPort}
          </div>
        </div>
      </div>

      {/* Informations de voyage */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <div>
            <div className="text-xs text-gray-600">Départ</div>
            <div className="font-medium text-sm">
              {formatDate(announcement.departureDate)}
            </div>
            {daysUntilDeparture > 0 && (
              <div className="text-xs text-orange-600">
                Dans {daysUntilDeparture} jour{daysUntilDeparture > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-green-600" />
          <div>
            <div className="text-xs text-gray-600">Arrivée estimée</div>
            <div className="font-medium text-sm">
              {formatDate(announcement.estimatedArrival)}
            </div>
          </div>
        </div>
      </div>

      {/* Capacité et prix */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-blue-600" />
          <div>
            <div className="text-xs text-gray-600">Espace disponible</div>
            <div className="font-medium text-blue-900">
              {announcement.availableSpace} CBM
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <div>
            <div className="text-xs text-gray-600">Prix par CBM</div>
            <div className="font-medium text-green-900">
              {announcement.pricePerCBM}€
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Contact:</span> {announcement.contactInfo}
        </div>
        
        <button
          onClick={handleContact}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 text-sm font-medium"
        >
          <Phone className="h-4 w-4" />
          {showContact ? 'Contacté' : 'Contacter'}
        </button>
      </div>

      {/* Indicateur d'urgence pour départs proches */}
      {daysUntilDeparture <= 3 && daysUntilDeparture > 0 && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-tr-lg rounded-bl-lg font-medium">
          DÉPART IMMINENT
        </div>
      )}
    </div>
  )
}

// Composant pour afficher une liste d'annonces de départ
interface DepartureAnnouncementListProps {
  announcements: DepartureAnnouncement[]
  onContact?: (announcementId: string) => void
  maxVisible?: number
  showFilters?: boolean
  className?: string
}

export function DepartureAnnouncementList({ 
  announcements, 
  onContact,
  maxVisible = 6,
  showFilters = true,
  className = ''
}: DepartureAnnouncementListProps) {
  const [filter, setFilter] = useState({
    destination: '',
    maxDays: 30,
    sponsoredOnly: false
  })

  const filteredAnnouncements = announcements
    .filter(announcement => {
      if (filter.destination && !announcement.destinationPort.toLowerCase().includes(filter.destination.toLowerCase())) {
        return false
      }
      
      const daysUntilDeparture = Math.ceil((announcement.departureDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntilDeparture > filter.maxDays) {
        return false
      }
      
      if (filter.sponsoredOnly && !announcement.isSponsored) {
        return false
      }
      
      return true
    })
    .sort((a, b) => {
      // Trier par niveau de sponsoring puis par date de départ
      const sponsorshipOrder = { 'FEATURED': 3, 'PREMIUM': 2, 'BASIC': 1 }
      const aSponsor = a.isSponsored ? sponsorshipOrder[a.sponsorshipLevel] || 0 : 0
      const bSponsor = b.isSponsored ? sponsorshipOrder[b.sponsorshipLevel] || 0 : 0
      
      if (aSponsor !== bSponsor) {
        return bSponsor - aSponsor
      }
      
      return a.departureDate.getTime() - b.departureDate.getTime()
    })
    .slice(0, maxVisible)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filtres */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium text-gray-900 mb-3">Filtrer les annonces</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                value={filter.destination}
                onChange={(e) => setFilter(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="Ex: Douala, Lagos..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Départ dans les
              </label>
              <select
                value={filter.maxDays}
                onChange={(e) => setFilter(prev => ({ ...prev, maxDays: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={7}>7 jours</option>
                <option value={15}>15 jours</option>
                <option value={30}>30 jours</option>
                <option value={60}>60 jours</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={filter.sponsoredOnly}
                  onChange={(e) => setFilter(prev => ({ ...prev, sponsoredOnly: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Annonces sponsorisées uniquement
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Liste des annonces */}
      {filteredAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map(announcement => (
            <DepartureAnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onContact={onContact}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg border">
          <Ship className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
          <p className="text-gray-600">
            Aucun départ ne correspond à vos critères de recherche
          </p>
        </div>
      )}
    </div>
  )
}

// Composant compact pour sidebar
export function CompactDepartureAnnouncement({ 
  announcement, 
  onContact 
}: { 
  announcement: DepartureAnnouncement
  onContact?: (announcementId: string) => void 
}) {
  const daysUntilDeparture = Math.ceil((announcement.departureDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <Ship className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-medium text-blue-600">
          DÉPART DANS {daysUntilDeparture} JOUR{daysUntilDeparture > 1 ? 'S' : ''}
        </span>
      </div>
      
      <h4 className="font-medium text-sm mb-2 line-clamp-1">
        {announcement.originPort} → {announcement.destinationPort}
      </h4>
      
      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
        <span>{announcement.availableSpace} CBM</span>
        <span>{announcement.pricePerCBM}€/CBM</span>
      </div>
      
      <button
        onClick={() => onContact?.(announcement.id)}
        className="w-full bg-blue-600 text-white py-1.5 px-3 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
      >
        Réserver
      </button>
    </div>
  )
}
