'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Camera, Check, AlertCircle, Loader2 } from 'lucide-react'
import ImageUpload from '@/components/ui/image-upload'

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
  address?: string
}

interface GeolocationCaptureProps {
  onLocationCapture: (location: LocationData, photos: File[]) => void
  onCancel?: () => void
  packageId?: string
}

export default function GeolocationCapture({ 
  onLocationCapture, 
  onCancel,
  packageId 
}: GeolocationCaptureProps) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [address, setAddress] = useState<string>('')

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par ce navigateur')
      setIsLoadingLocation(false)
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        }

        // Tentative de géocodage inverse pour obtenir l'adresse
        try {
          const response = await fetch(
            `https://api.openstreetmap.org/reverse?format=json&lat=${locationData.latitude}&lon=${locationData.longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()
          if (data.display_name) {
            locationData.address = data.display_name
            setAddress(data.display_name)
          }
        } catch (error) {
          console.log('Géocodage inverse échoué:', error)
        }

        setLocation(locationData)
        setIsLoadingLocation(false)
      },
      (error) => {
        let errorMessage = 'Erreur de géolocalisation'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission de géolocalisation refusée'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position non disponible'
            break
          case error.TIMEOUT:
            errorMessage = 'Délai de géolocalisation dépassé'
            break
        }
        setLocationError(errorMessage)
        setIsLoadingLocation(false)
      },
      options
    )
  }

  const handlePhotosChange = (newPhotos: File[]) => {
    setPhotos(newPhotos)
  }

  const handleConfirm = () => {
    if (location) {
      onLocationCapture(location, photos)
    }
  }

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  const formatAccuracy = (accuracy: number) => {
    return accuracy < 1000 ? `±${Math.round(accuracy)}m` : `±${(accuracy/1000).toFixed(1)}km`
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          Preuve de Livraison Géolocalisée
        </CardTitle>
        {packageId && (
          <p className="text-sm text-gray-600">
            Colis : <span className="font-medium">{packageId}</span>
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Section Géolocalisation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Position de Livraison</h3>
            <Button
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {isLoadingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              {isLoadingLocation ? 'Localisation...' : 'Obtenir Position'}
            </Button>
          </div>

          {locationError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{locationError}</p>
            </div>
          )}

          {location && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Position Capturée</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Coordonnées :</strong> {formatCoordinates(location.latitude, location.longitude)}</p>
                <p><strong>Précision :</strong> {formatAccuracy(location.accuracy)}</p>
                {address && <p><strong>Adresse :</strong> {address}</p>}
                <p><strong>Horodatage :</strong> {new Date(location.timestamp).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Section Photos */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Photos de Livraison
          </h3>
          <ImageUpload
            maxFiles={5}
            maxSize={10} // 10MB
            onFilesChange={(imageFiles) => {
              const files = imageFiles.map(img => img.file)
              handlePhotosChange(files)
            }}
            acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            onClick={handleConfirm}
            disabled={!location}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
            Confirmer Livraison
          </Button>
          
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              Annuler
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Instructions :</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Activez la géolocalisation pour enregistrer le lieu exact de livraison</li>
            <li>• Prenez des photos du colis remis et du destinataire si possible</li>
            <li>• Ces preuves seront automatiquement ajoutées au reçu de livraison</li>
            <li>• La position GPS garantit l'authenticité de la livraison</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
