'use client'

import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { Search, Package, MapPin, Calendar, CheckCircle, Clock, Truck, QrCode, Camera, X, ArrowLeft } from 'lucide-react'

interface TrackingResult {
  packageId: string
  trackingPin: string
  description: string
  weight: number
  transportMode: string
  status: string
  client: string
  timeline: {
    date: string
    status: string
    location: string
    description: string
    completed: boolean
  }[]
}

export default function TrackingPage() {
  const [trackingPin, setTrackingPin] = useState('')
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showQRScanner, setShowQRScanner] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleQRScan = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simuler la lecture du QR code
      const reader = new FileReader()
      reader.onload = () => {
        // Simuler l'extraction du PIN depuis le QR code
        const mockPin = 'ABC123XYZ' // En réalité, ceci viendrait de la lecture du QR code
        setTrackingPin(mockPin)
        setShowQRScanner(false)
        handleTrack(mockPin)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTrack = async (pin?: string) => {
    const pinToUse = pin || trackingPin
    if (!pinToUse.trim()) {
      setError('Veuillez entrer un PIN de suivi')
      return
    }

    // Validate PIN format: 6 alphanumeric characters only
    if (!/^[A-Za-z0-9]{6}$/.test(pinToUse)) {
      setError('Format de PIN invalide. Le PIN doit contenir exactement 6 caractères alphanumériques (ex: A3X9K2, B7Y4M1).')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/track/${pinToUse.toUpperCase()}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || data.error || 'PIN de suivi introuvable')
        setTrackingResult(null)
        return
      }

      // Transform API data to match TrackingResult interface
      const transformedResult: TrackingResult = {
        packageId: data.packageId,
        trackingPin: data.trackingPin,
        description: data.description,
        weight: data.weight,
        transportMode: data.transportMode === 'AERIAL' ? 'Aérien' : 
                      data.transportMode === 'MARITIME' ? 'Maritime' : 
                      data.transportMode,
        status: data.status === 'IN_TRANSIT' ? 'En Route' :
               data.status === 'ARRIVED' ? 'Arrivé' :
               data.status === 'PLANNED' ? 'Planifié' :
               data.status,
        client: data.client?.name || 'Client inconnu',
        timeline: data.timeline || []
      }

      setTrackingResult(transformedResult)
    } catch (error) {
      console.error('Error fetching tracking info:', error)
      setError('Erreur lors de la récupération des informations de suivi. Veuillez réessayer.')
      setTrackingResult(null)
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = () => {
    alert('Scanner QR Code en cours de développement...')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main Content */}
      <div className="pt-20 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivi de Colis</h1>
            <p className="text-gray-600">Entrez votre PIN de suivi pour voir le statut de votre colis</p>
          </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="trackingPin" className="block text-sm font-medium text-gray-700 mb-2">
                PIN de Suivi
              </label>
              <input
                type="text"
                id="trackingPin"
                value={trackingPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
                  setTrackingPin(value)
                }}
                placeholder="Entrez votre PIN (ex: A3X9K2)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg"
                maxLength={6}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleTrack()}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Suivre
              </button>
              
              <button
                onClick={handleQRScan}
                className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
              >
                <Camera className="h-4 w-4 mr-2" />
                Scanner QR
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="space-y-6">
            {/* Package Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Informations du Colis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">ID Colis:</span>
                    <p className="text-lg font-mono text-gray-900">{trackingResult.packageId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">PIN de Suivi:</span>
                    <p className="text-lg font-mono text-gray-900">{trackingResult.trackingPin}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Description:</span>
                    <p className="text-gray-900">{trackingResult.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Poids:</span>
                    <p className="text-gray-900">{trackingResult.weight} kg</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Mode de Transport:</span>
                    <p className="text-gray-900">{trackingResult.transportMode}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Statut Actuel:</span>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 ml-2">
                      {trackingResult.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline du Colis
              </h2>
              
              <div className="space-y-4">
                {trackingResult.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {event.completed ? (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-medium ${event.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {event.status}
                        </h3>
                        <span className={`text-xs ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                          {event.date}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className={`text-xs ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                          {event.location}
                        </span>
                      </div>
                      
                      <p className={`text-sm ${event.completed ? 'text-gray-700' : 'text-gray-500'}`}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Besoin d'aide ?</h3>
          <p className="text-blue-800 mb-4">
            Votre PIN de suivi vous a été fourni lors de la création de votre colis. 
            Il s'agit d'un code de 6 caractères alphanumériques.
          </p>
          <div className="text-sm text-blue-700">
            <p><strong>Exemples de PINs pour test:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>A3X9K2 - Colis électroniques en transit</li>
              <li>B7Y4M1 - Colis textiles arrivé</li>
              <li>C5Z8N6 - Colis machines planifié</li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
