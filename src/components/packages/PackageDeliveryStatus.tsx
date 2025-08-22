'use client'

import React from 'react'
import { Package } from '@/types'
import { getDeliveryStatus } from '@/utils/packageValidation'
import { CheckCircle, XCircle, AlertCircle, CreditCard, FileCheck, Truck } from 'lucide-react'

interface PackageDeliveryStatusProps {
  package: Package
  onValidatePOD?: (packageId: string) => void
  onCompletePayment?: (packageId: string) => void
  showActions?: boolean
}

export default function PackageDeliveryStatus({ 
  package: pkg, 
  onValidatePOD, 
  onCompletePayment,
  showActions = true 
}: PackageDeliveryStatusProps) {
  const deliveryStatus = getDeliveryStatus(pkg)
  
  const getStatusColor = () => {
    switch (deliveryStatus.status) {
      case 'READY': return 'text-green-600 bg-green-50 border-green-200'
      case 'PARTIAL': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'BLOCKED': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = () => {
    switch (deliveryStatus.status) {
      case 'READY': return <CheckCircle className="w-5 h-5" />
      case 'PARTIAL': return <AlertCircle className="w-5 h-5" />
      case 'BLOCKED': return <XCircle className="w-5 h-5" />
      default: return <AlertCircle className="w-5 h-5" />
    }
  }

  const getStatusText = () => {
    switch (deliveryStatus.status) {
      case 'READY': return 'Prêt pour livraison'
      case 'PARTIAL': return 'Validation partielle'
      case 'BLOCKED': return 'Livraison bloquée'
      default: return 'Statut inconnu'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Statut principal */}
      <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor()}`}>
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold">{getStatusText()}</h3>
            <p className="text-sm opacity-75">
              Colis {pkg.packageId}
            </p>
          </div>
        </div>
        
        {deliveryStatus.canDeliver && (
          <div className="flex items-center text-green-600">
            <Truck className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Autorisé</span>
          </div>
        )}
      </div>

      {/* Détails des validations */}
      <div className="mt-4 space-y-3">
        {/* POD Status */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center space-x-2">
            <FileCheck className={`w-4 h-4 ${pkg.podValidated ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-sm">Preuve de Livraison (POD)</span>
          </div>
          <div className="flex items-center space-x-2">
            {pkg.podValidated ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                ✓ Validé
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                ✗ Non validé
              </span>
            )}
            {showActions && !pkg.podValidated && onValidatePOD && (
              <button
                onClick={() => onValidatePOD(pkg.id)}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Valider
              </button>
            )}
          </div>
        </div>

        {/* Payment Status */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center space-x-2">
            <CreditCard className={`w-4 h-4 ${pkg.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-sm">Paiement</span>
          </div>
          <div className="flex items-center space-x-2">
            {pkg.paymentStatus === 'COMPLETED' ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                ✓ Complet
              </span>
            ) : pkg.paymentStatus === 'PARTIAL' ? (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                ⚠ Partiel ({pkg.remainingAmount || 0} FCFA restant)
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                ✗ En attente
              </span>
            )}
            {showActions && pkg.paymentStatus !== 'COMPLETED' && onCompletePayment && (
              <button
                onClick={() => onCompletePayment(pkg.id)}
                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
              >
                Payer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Raisons du blocage */}
      {deliveryStatus.reasons.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Conditions non remplies :
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {deliveryStatus.reasons.map((reason, index) => (
              <li key={index} className="flex items-center">
                <XCircle className="w-3 h-3 mr-2" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message de confirmation */}
      {deliveryStatus.canDeliver && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="flex items-center text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              Ce colis peut être livré ou récupéré par le client
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
