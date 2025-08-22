'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Search, ArrowLeft, Package, DollarSign, MessageSquare, TrendingUp } from 'lucide-react'

export default function NotFound() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Log 404 search attempt
      console.log('404 Search:', { 
        term: searchTerm, 
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        url: window.location.href
      })
      
      // Redirect to dashboard with search
      router.push(`/dashboard?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  // Log 404 event
  if (typeof window !== 'undefined') {
    console.log('404 Event:', {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  }

  const quickLinks = [
    { href: '/dashboard/packages', label: 'Gestion Colis', icon: Package, color: 'bg-blue-500' },
    { href: '/dashboard/finances', label: 'Finances', icon: DollarSign, color: 'bg-green-500' },
    { href: '/dashboard/support', label: 'Support', icon: MessageSquare, color: 'bg-purple-500' },
    { href: '/dashboard/marketing', label: 'Marketing', icon: TrendingUp, color: 'bg-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Display */}
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <span className="text-5xl font-bold text-red-600">404</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Page non trouvée
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans NextMove..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-4 bg-white border-2 border-blue-200 text-blue-700 font-medium rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
            >
              <Home className="w-5 h-5 mr-3" />
              Retour à l'accueil
            </Link>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Tableau de bord
            </Link>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Accès rapide</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-gray-200"
              >
                <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-2`}>
                  <link.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Links */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Autres liens utiles :
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Link href="/track" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
              Suivi de colis
            </Link>
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
              Connexion
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
              Contact
            </Link>
            <Link href="/help" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
              Aide
            </Link>
          </div>
        </div>

        {/* Error Code for Debug */}
        <div className="mt-8 text-xs text-gray-400">
          Code d'erreur: 404 | {new Date().toISOString()}
        </div>
      </div>
    </div>
  )
}
