'use client'

import React from 'react'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface ActionLoaderProps {
  loading: boolean
  success?: boolean
  error?: boolean
  message?: string
  children?: React.ReactNode
}

export function ActionLoader({ loading, success, error, message, children }: ActionLoaderProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">{message || 'Traitement en cours...'}</span>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex items-center justify-center p-4 text-green-600">
        <CheckCircle className="w-6 h-6 mr-2" />
        <span>{message || 'Action réussie !'}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-red-600">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{message || 'Une erreur est survenue'}</span>
      </div>
    )
  }

  return <>{children}</>
}

export default ActionLoader
