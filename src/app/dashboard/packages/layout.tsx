'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import NotificationCenter from '@/components/notifications/NotificationCenter'
import { UnifiedSupportWidget } from '@/components/ui/unified-support-widget'
import EnhancedSidebar from '@/components/layout/EnhancedSidebar'
import LanguageSelector from '@/components/ui/language-selector'
import { useAppRouter } from '@/utils/router-utils'
import { useSidebar } from '@/hooks/useSidebar'
import {
  Globe,
  LogOut,
} from 'lucide-react'

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { navigateTo } = useAppRouter()
  const { isCollapsed } = useSidebar()

  const handleSignOut = async () => {
    console.log('Déconnexion...')
    try {
      // Utiliser signOut de NextAuth avec redirection
      const { signOut } = await import('next-auth/react')
      await signOut({ 
        callbackUrl: 'http://localhost:3000/auth/signin',
        redirect: true 
      })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Fallback: redirection manuelle
      window.location.href = '/auth/signin'
    }
  }

  // Update body class for grid layout
  useEffect(() => {
    const appShell = document.querySelector('.app-shell')
    if (appShell) {
      if (isCollapsed) {
        appShell.classList.remove('sidebar-open')
      } else {
        appShell.classList.add('sidebar-open')
      }
    }
  }, [isCollapsed])

  return (
    <div className="min-h-screen bg-gray-50 app-shell">
      {/* Enhanced Sidebar */}
      <EnhancedSidebar />

      {/* Main content */}
      <div className="app-content transition-all duration-200">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notification Center */}
              <NotificationCenter />
              
              {/* Language Selector */}
              <LanguageSelector variant="compact" />
              
              {/* User menu */}
              <div className="flex items-center gap-x-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Utilisateur Admin</p>
                  <p className="text-gray-500">Mode Test</p>
                </div>
                
                {/* Bouton d'accès à la page d'accueil */}
                <Link
                  href="/"
                  className="flex items-center gap-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Site Public
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Widget de Support Unifié */}
      <UnifiedSupportWidget position="bottom-right" />

    </div>
  )
}
