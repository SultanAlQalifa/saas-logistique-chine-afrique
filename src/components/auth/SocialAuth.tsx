'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Chrome, Facebook, Github, Twitter, Linkedin, Apple } from 'lucide-react'

interface SocialAuthProps {
  callbackUrl?: string
  className?: string
}

export default function SocialAuth({ callbackUrl = '/dashboard', className = '' }: SocialAuthProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(provider)
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      console.error(`Erreur connexion ${provider}:`, error)
    } finally {
      setIsLoading(null)
    }
  }

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: Chrome,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-white'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'bg-gray-800 hover:bg-gray-900',
      textColor: 'text-white'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-white'
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: Apple,
      color: 'bg-black hover:bg-gray-800',
      textColor: 'text-white'
    }
  ]

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {socialProviders.map((provider) => {
          const Icon = provider.icon
          const isCurrentlyLoading = isLoading === provider.id

          return (
            <button
              key={provider.id}
              onClick={() => handleSocialLogin(provider.id)}
              disabled={isLoading !== null}
              className={`
                flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${provider.color} ${provider.textColor}
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-105 active:scale-95
                shadow-md hover:shadow-lg
              `}
            >
              {isCurrentlyLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className="text-sm">{provider.name}</span>
            </button>
          )
        })}
      </div>

      {/* Version compacte pour mobile */}
      <div className="sm:hidden">
        <div className="grid grid-cols-3 gap-2 mt-4">
          {socialProviders.slice(0, 3).map((provider) => {
            const Icon = provider.icon
            const isCurrentlyLoading = isLoading === provider.id

            return (
              <button
                key={provider.id}
                onClick={() => handleSocialLogin(provider.id)}
                disabled={isLoading !== null}
                className={`
                  flex items-center justify-center p-3 rounded-lg transition-all duration-200
                  ${provider.color} ${provider.textColor}
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transform hover:scale-105 active:scale-95
                  shadow-md hover:shadow-lg
                `}
              >
                {isCurrentlyLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Informations de sécurité */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
          </div>
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Connexion sécurisée</p>
            <p>Vos données sont protégées. Nous ne stockons jamais vos mots de passe des réseaux sociaux.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
