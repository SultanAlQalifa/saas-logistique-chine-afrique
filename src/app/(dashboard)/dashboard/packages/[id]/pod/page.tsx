'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, CheckCircle, Clock, MapPin, FileText, Download } from 'lucide-react'
import PODWorkflow from '@/components/pod/PODWorkflow'
import { PODService, PODData } from '@/lib/pod-service'

interface PackageInfo {
  id: string
  trackingNumber: string
  recipientName: string
  recipientPhone: string
  status: string
  destination: string
}

export default function PackagePODPage() {
  const params = useParams()
  const router = useRouter()
  const packageId = params.id as string

  const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null)
  const [existingPODs, setExistingPODs] = useState<PODData[]>([])
  const [showWorkflow, setShowWorkflow] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPackageData()
  }, [packageId])

  const loadPackageData = async () => {
    try {
      // Mock: Charger les informations du colis
      setPackageInfo({
        id: packageId,
        trackingNumber: `NM${packageId.slice(-6).toUpperCase()}`,
        recipientName: 'Amadou Diallo',
        recipientPhone: '+221776543210',
        status: 'EN_TRANSIT',
        destination: 'Dakar, Sénégal'
      })

      // Charger les PODs existantes
      const pods = await PODService.getPODsByPackage(packageId)
      setExistingPODs(pods)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePODComplete = async (podData: any) => {
    try {
      // Convertir les photos en base64
      const photos = podData.photos ? await PODService.filesToBase64(podData.photos) : []
      
      // Créer la POD
      const newPOD = await PODService.createPOD({
        packageId,
        recipientName: packageInfo?.recipientName,
        recipientPhone: packageInfo?.recipientPhone,
        signature: podData.signature,
        location: podData.location,
        photos,
        deliveryTime: podData.deliveryTime
      })

      // Mettre à jour le statut du colis
      await PODService.updatePackageStatus(packageId, newPOD)

      // Recharger les données
      await loadPackageData()
      setShowWorkflow(false)

      // Rediriger vers la page de détails du colis
      router.push(`/dashboard/packages/${packageId}?pod_created=true`)
    } catch (error) {
      console.error('Erreur lors de la création de la POD:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'EN_TRANSIT': { label: 'En Transit', color: 'bg-blue-100 text-blue-800' },
      'DELIVERED': { label: 'Livré', color: 'bg-green-100 text-green-800' },
      'PENDING': { label: 'En Attente', color: 'bg-yellow-100 text-yellow-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    return <Badge className={config.color}>{config.label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (showWorkflow) {
    return (
      <div className="container mx-auto px-4 py-6">
        <PODWorkflow
          packageId={packageId}
          recipientName={packageInfo?.recipientName}
          recipientPhone={packageInfo?.recipientPhone}
          onPODComplete={handlePODComplete}
          onCancel={() => setShowWorkflow(false)}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Preuve de Livraison</h1>
            <p className="text-gray-600">Gestion des POD pour le colis {packageInfo?.trackingNumber}</p>
          </div>
        </div>
      </div>

      {/* Informations du colis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Informations du Colis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Numéro de suivi</p>
              <p className="font-medium">{packageInfo?.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Destinataire</p>
              <p className="font-medium">{packageInfo?.recipientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Téléphone</p>
              <p className="font-medium">{packageInfo?.recipientPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Destination</p>
              <p className="font-medium">{packageInfo?.destination}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              {getStatusBadge(packageInfo?.status || 'PENDING')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions principales */}
      <div className="flex gap-4">
        <Button
          onClick={() => setShowWorkflow(true)}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          disabled={existingPODs.some(pod => pod.status === 'COMPLETED')}
        >
          <CheckCircle className="h-4 w-4" />
          {existingPODs.length > 0 ? 'Nouvelle POD' : 'Créer POD'}
        </Button>
      </div>

      {/* PODs existantes */}
      {existingPODs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Preuves de Livraison Existantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {existingPODs.map((pod) => (
                <div key={pod.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">POD #{pod.id.slice(-8)}</span>
                      <Badge className="bg-green-100 text-green-800">{pod.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(pod.createdAt).toLocaleString('fr-FR')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Destinataire</p>
                      <p className="font-medium">{pod.recipientName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Position GPS</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {pod.location.latitude.toFixed(4)}, {pod.location.longitude.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Photos</p>
                      <p className="font-medium">{pod.photos.length} photo(s)</p>
                    </div>
                  </div>

                  {/* Signature preview */}
                  {pod.signature && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600 mb-2">Signature électronique :</p>
                      <img 
                        src={pod.signature} 
                        alt="Signature" 
                        className="max-h-16 border bg-white rounded"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Télécharger Reçu
                    </Button>
                    <Button size="sm" variant="outline">
                      Voir Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques POD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">PODs Créées</p>
                <p className="text-lg font-bold">{existingPODs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Dernière POD</p>
                <p className="text-lg font-bold">
                  {existingPODs.length > 0 
                    ? new Date(existingPODs[0].createdAt).toLocaleDateString('fr-FR')
                    : 'Aucune'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Géolocalisation</p>
                <p className="text-lg font-bold">
                  {existingPODs.some(pod => pod.location) ? 'Activée' : 'Inactive'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Reçus Générés</p>
                <p className="text-lg font-bold">
                  {existingPODs.filter(pod => pod.receiptUrl).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
