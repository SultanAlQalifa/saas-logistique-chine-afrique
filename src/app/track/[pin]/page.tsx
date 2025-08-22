'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Package, Truck, MapPin, Calendar, CheckCircle, Clock, AlertCircle, ArrowLeft, Download, Printer, Mail, Share2, X } from 'lucide-react'
import { formatWeight, formatCurrency } from '@/utils/calculations'

interface TrackingInfo {
  packageId: string
  description: string
  weight: number
  transportMode: string
  status: string
  estimatedArrival?: string
  actualArrival?: string
  collectedAt?: string
  client: {
    name: string
    clientId: string
  }
  cargo?: {
    cargoId: string
    carrier?: string
    originPort: string
    destinationPort: string
    departureDate?: string
    arrivalDate?: string
    status: string
  }
  company: {
    name: string
    email: string
    phone?: string
  }
  createdAt: string
}

const statusConfig = {
  PLANNED: {
    label: 'Planifié',
    color: 'bg-gray-100 text-gray-800',
    icon: Clock,
    description: 'Le colis est en cours de préparation pour l\'expédition'
  },
  IN_TRANSIT: {
    label: 'En Transit',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Truck,
    description: 'Le colis est en route vers sa destination'
  },
  ARRIVED: {
    label: 'Arrivé',
    color: 'bg-green-100 text-green-800',
    icon: MapPin,
    description: 'Le colis est arrivé à destination'
  },
  COLLECTED: {
    label: 'Collecté',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    description: 'Le colis a été collecté par le destinataire'
  },
}

const transportModeLabels = {
  AERIAL: 'Aérien',
  AERIAL_EXPRESS: 'Aérien Express',
  MARITIME: 'Maritime',
  MARITIME_EXPRESS: 'Maritime Express',
}

export default function TrackingPage() {
  const params = useParams()
  const router = useRouter()
  const pin = params.pin as string
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)

  // Action handlers
  const handleGoBack = () => {
    router.back()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    // Generate PDF content
    const content = `
      PACKAGE TRACKING REPORT
      =====================
      
      PIN: ${pin}
      Package ID: ${trackingInfo?.packageId}
      Status: ${trackingInfo?.status}
      Description: ${trackingInfo?.description}
      Weight: ${formatWeight(trackingInfo?.weight || 0)}
      Transport Mode: ${transportModeLabels[trackingInfo?.transportMode as keyof typeof transportModeLabels]}
      
      Client: ${trackingInfo?.client.name} (${trackingInfo?.client.clientId})
      
      Company: ${trackingInfo?.company.name}
      Email: ${trackingInfo?.company.email}
      ${trackingInfo?.company.phone ? `Phone: ${trackingInfo?.company.phone}` : ''}
      
      Created: ${trackingInfo?.createdAt ? new Date(trackingInfo.createdAt).toLocaleString('fr-FR') : ''}
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tracking-${pin}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSendEmail = (email: string) => {
    const subject = `Package Tracking Information - PIN: ${pin}`
    const body = `
Hello,

Here is the tracking information for package PIN: ${pin}

Package ID: ${trackingInfo?.packageId}
Status: ${trackingInfo?.status}
Description: ${trackingInfo?.description}
Weight: ${formatWeight(trackingInfo?.weight || 0)}

You can track this package at: ${window.location.href}

Best regards,
${trackingInfo?.company.name}
    `
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
    setShowShareModal(false)
  }

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const response = await fetch(`/api/track/${pin}`)
        
        if (response.ok) {
          const data = await response.json()
          setTrackingInfo(data)
        } else if (response.status === 404) {
          const errorData = await response.json()
          setError(errorData.message || 'Colis introuvable. Vérifiez votre PIN de suivi.')
        } else {
          setError('Impossible de récupérer les informations de suivi. Veuillez réessayer.')
        }
      } catch (error) {
        console.error('Error fetching tracking info:', error)
        setError('Impossible de récupérer les informations de suivi. Veuillez réessayer.')
      } finally {
        setLoading(false)
      }
    }

    // Validate PIN format: 6 alphanumeric characters (letters and numbers only)
    const isValidPin = pin && /^[A-Za-z0-9]{6}$/.test(pin)
    
    if (isValidPin) {
      fetchTrackingInfo()
    } else {
      setError('Format de PIN invalide. Le PIN doit contenir exactement 6 caractères alphanumériques (ex: A3X9K2, B7Y4M1).')
      setLoading(false)
    }
  }, [pin])

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Chargement des informations de suivi...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-secondary-900 mb-2">Erreur de Suivi</h1>
          <p className="text-secondary-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (!trackingInfo) {
    return null
  }

  const currentStatus = statusConfig[trackingInfo.status as keyof typeof statusConfig]
  const StatusIcon = currentStatus?.icon || Package

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* Navigation and Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 print-hide">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </button>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimer</span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Télécharger</span>
              </button>
              
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Envoyer à...</span>
              </button>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center">
            <div className="bg-primary-600 p-3 rounded-lg inline-block mb-4">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Suivi de Colis</h1>
            <p className="text-secondary-600">Suivez votre colis avec le PIN: <span className="font-mono font-semibold">{pin}</span></p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-secondary-900">Statut Actuel</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus?.color}`}>
                  <StatusIcon className="h-4 w-4 mr-2" />
                  {currentStatus?.label}
                </span>
              </div>
              <p className="text-secondary-600">{currentStatus?.description}</p>
            </div>

            {/* Package Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Informations du Colis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">ID Colis</label>
                  <p className="text-secondary-900 font-mono">{trackingInfo.packageId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Mode de Transport</label>
                  <p className="text-secondary-900">{transportModeLabels[trackingInfo.transportMode as keyof typeof transportModeLabels]}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Poids</label>
                  <p className="text-secondary-900">{formatWeight(trackingInfo.weight)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Créé le</label>
                  <p className="text-secondary-900">{new Date(trackingInfo.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                  <p className="text-secondary-900">{trackingInfo.description}</p>
                </div>
              </div>
            </div>

            {/* Cargo Information */}
            {trackingInfo.cargo && (
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Cargo Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Cargo ID</label>
                    <p className="text-secondary-900 font-mono">{trackingInfo.cargo.cargoId}</p>
                  </div>
                  {trackingInfo.cargo.carrier && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Carrier</label>
                      <p className="text-secondary-900">{trackingInfo.cargo.carrier}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Origin</label>
                    <p className="text-secondary-900">{trackingInfo.cargo.originPort}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Destination</label>
                    <p className="text-secondary-900">{trackingInfo.cargo.destinationPort}</p>
                  </div>
                  {trackingInfo.cargo.departureDate && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Departure Date</label>
                      <p className="text-secondary-900">{new Date(trackingInfo.cargo.departureDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {trackingInfo.cargo.arrivalDate && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Arrival Date</label>
                      <p className="text-secondary-900">{new Date(trackingInfo.cargo.arrivalDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                {trackingInfo.collectedAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-secondary-900">Collected</p>
                      <p className="text-sm text-secondary-500">{new Date(trackingInfo.collectedAt).toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                )}
                {trackingInfo.actualArrival && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MapPin className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-secondary-900">Arrived</p>
                      <p className="text-sm text-secondary-500">{new Date(trackingInfo.actualArrival).toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-secondary-900">Package Created</p>
                    <p className="text-sm text-secondary-500">{new Date(trackingInfo.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Client</h3>
              <div className="space-y-2">
                <p className="text-secondary-900 font-medium">{trackingInfo.client.name}</p>
                <p className="text-secondary-600 text-sm font-mono">{trackingInfo.client.clientId}</p>
              </div>
            </div>

            {/* Company Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Logistics Company</h3>
              <div className="space-y-2">
                <p className="text-secondary-900 font-medium">{trackingInfo.company.name}</p>
                <p className="text-secondary-600 text-sm">{trackingInfo.company.email}</p>
                {trackingInfo.company.phone && (
                  <p className="text-secondary-600 text-sm">{trackingInfo.company.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Envoyer les informations de tracking</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Adresse email du destinataire
                  </label>
                  <input
                    type="email"
                    id="email-input"
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="exemple@email.com"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const emailInput = document.getElementById('email-input') as HTMLInputElement
                      if (emailInput?.value) {
                        handleSendEmail(emailInput.value)
                      }
                    }}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Envoyer
                  </button>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-lg hover:bg-secondary-200 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
