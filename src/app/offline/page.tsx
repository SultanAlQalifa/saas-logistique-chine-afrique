'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw, Package, MessageSquare } from 'lucide-react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Connexion perdue
          </h1>
          <p className="text-gray-600">
            Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <h3 className="font-medium text-blue-900">Suivi des colis</h3>
                <p className="text-sm text-blue-700">Disponible en mode hors ligne</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <h3 className="font-medium text-purple-900">Messages</h3>
                <p className="text-sm text-purple-700">Seront synchronisés à la reconnexion</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            disabled={!isOnline}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              isOnline
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            {isOnline ? 'Réessayer' : 'Hors ligne'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = '/dashboard/client-portal'}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Mes Colis
            </button>
            <button
              onClick={() => window.location.href = '/track'}
              className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Suivi
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Status: {isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}
          </p>
        </div>
      </div>
    </div>
  )
}
