'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, MapPin, PenTool, FileText, ArrowRight, Package } from 'lucide-react'
import SignatureCapture from './SignatureCapture'
import GeolocationCapture from './GeolocationCapture'

interface PODData {
  signature?: string
  location?: {
    latitude: number
    longitude: number
    accuracy: number
    timestamp: number
    address?: string
  }
  photos?: File[]
  deliveryTime: number
  recipientName?: string
  recipientPhone?: string
  notes?: string
}

interface PODWorkflowProps {
  packageId: string
  recipientName?: string
  recipientPhone?: string
  onPODComplete: (podData: PODData) => void
  onCancel?: () => void
}

type WorkflowStep = 'overview' | 'location' | 'signature' | 'summary'

export default function PODWorkflow({
  packageId,
  recipientName,
  recipientPhone,
  onPODComplete,
  onCancel
}: PODWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('overview')
  const [podData, setPodData] = useState<PODData>({
    deliveryTime: Date.now(),
    recipientName,
    recipientPhone
  })

  const steps = [
    { id: 'overview', title: 'Aperçu', icon: Package, completed: false },
    { id: 'location', title: 'Géolocalisation', icon: MapPin, completed: !!podData.location },
    { id: 'signature', title: 'Signature', icon: PenTool, completed: !!podData.signature },
    { id: 'summary', title: 'Résumé', icon: FileText, completed: false }
  ]

  const handleLocationCapture = (location: any, photos: File[]) => {
    setPodData(prev => ({ ...prev, location, photos }))
    setCurrentStep('signature')
  }

  const handleSignatureCapture = (signature: string) => {
    setPodData(prev => ({ ...prev, signature }))
    setCurrentStep('summary')
  }

  const handleComplete = () => {
    onPODComplete(podData)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6 overflow-x-auto">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = currentStep === step.id
        const isCompleted = step.completed || steps.findIndex(s => s.id === currentStep) > index
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-700' 
                : isCompleted 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
            }`}>
              {isCompleted ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
          </div>
        )
      })}
    </div>
  )

  const renderOverview = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          Preuve de Livraison (POD)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Informations du Colis</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>ID Colis :</strong> {packageId}</p>
            {recipientName && <p><strong>Destinataire :</strong> {recipientName}</p>}
            {recipientPhone && <p><strong>Téléphone :</strong> {recipientPhone}</p>}
            <p><strong>Heure de livraison :</strong> {new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Étapes de la Preuve de Livraison :</h3>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">1. Géolocalisation</p>
                <p className="text-sm text-gray-600">Enregistrer la position GPS et prendre des photos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <PenTool className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">2. Signature Électronique</p>
                <p className="text-sm text-gray-600">Faire signer le destinataire pour confirmer la réception</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">3. Génération du Reçu</p>
                <p className="text-sm text-gray-600">Création automatique du reçu de livraison</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => setCurrentStep('location')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Commencer la POD
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderSummary = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          Résumé de la Livraison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {/* Informations générales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Informations de Livraison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Colis :</span>
                <span className="ml-2 font-medium">{packageId}</span>
              </div>
              <div>
                <span className="text-gray-600">Heure :</span>
                <span className="ml-2 font-medium">{new Date(podData.deliveryTime).toLocaleString('fr-FR')}</span>
              </div>
              {recipientName && (
                <div>
                  <span className="text-gray-600">Destinataire :</span>
                  <span className="ml-2 font-medium">{recipientName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Géolocalisation */}
          {podData.location && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Position GPS
              </h3>
              <div className="text-sm text-green-800 space-y-1">
                <p>Coordonnées : {podData.location.latitude.toFixed(6)}, {podData.location.longitude.toFixed(6)}</p>
                <p>Précision : ±{Math.round(podData.location.accuracy)}m</p>
                {podData.location.address && <p>Adresse : {podData.location.address}</p>}
              </div>
            </div>
          )}

          {/* Photos */}
          {podData.photos && podData.photos.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-3">Photos de Livraison</h3>
              <p className="text-sm text-blue-800">{podData.photos.length} photo(s) capturée(s)</p>
            </div>
          )}

          {/* Signature */}
          {podData.signature && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                Signature Électronique
              </h3>
              <div className="bg-white p-2 rounded border">
                <img 
                  src={podData.signature} 
                  alt="Signature du destinataire" 
                  className="max-h-20 mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Finaliser la POD
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentStep('signature')}
          >
            Retour
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {renderStepIndicator()}
      
      {currentStep === 'overview' && renderOverview()}
      
      {currentStep === 'location' && (
        <GeolocationCapture
          packageId={packageId}
          onLocationCapture={handleLocationCapture}
          onCancel={() => setCurrentStep('overview')}
        />
      )}
      
      {currentStep === 'signature' && (
        <SignatureCapture
          recipientName={recipientName}
          onSignatureCapture={handleSignatureCapture}
          onCancel={() => setCurrentStep('location')}
        />
      )}
      
      {currentStep === 'summary' && renderSummary()}
    </div>
  )
}
