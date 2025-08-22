'use client'

import { useState } from 'react'
import LazyPage from '@/components/ui/lazy-page'
import Link from 'next/link'
import { Settings, Shield, Zap, User, Palette, Database, Bell, Globe, Mail, MessageSquare, MessageCircle } from 'lucide-react'

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: 'Profil',
      description: 'Informations personnelles',
      icon: User,
      href: '/dashboard/profile',
      color: 'bg-green-500'
    },
    {
      title: 'Notifications',
      description: 'Préférences de notifications',
      icon: Bell,
      href: '/dashboard/settings/notifications',
      color: 'bg-orange-500'
    },
    {
      title: 'Services de messagerie',
      description: 'Configuration des services de communication',
      icon: Mail,
      href: '/dashboard/settings/messaging',
      color: 'bg-blue-500'
    },
    {
      title: 'Localisation',
      description: 'Langue et région',
      icon: Globe,
      href: '/dashboard/settings/localization',
      color: 'bg-indigo-500'
    }
  ]

  return (
    <LazyPage>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600">Configurez votre plateforme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {settingsCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.title}
                href={category.href}
                className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className={`${category.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.description}
                </p>
              </Link>
            )
          })}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-900">
              Besoin d'aide avec la configuration ?
            </h3>
            <p className="mt-2 text-sm text-blue-700">
              Consultez notre documentation ou contactez le support technique pour obtenir de l'aide avec la configuration de votre plateforme.
            </p>
            <div className="mt-4 flex space-x-4">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Documentation →
              </button>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Support technique →
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </LazyPage>
  )
}
