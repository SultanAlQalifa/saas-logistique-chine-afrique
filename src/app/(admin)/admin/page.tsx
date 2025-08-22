'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirection automatique vers le dashboard principal pour les admins
    router.replace('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">🎯 Redirection vers le Dashboard</h2>
          <p className="text-gray-600">Vous êtes redirigé vers votre tableau de bord principal...</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">
            ✨ Dashboard configuré comme page par défaut pour les comptes admin
          </p>
        </div>
      </div>
    </div>
  )
}
