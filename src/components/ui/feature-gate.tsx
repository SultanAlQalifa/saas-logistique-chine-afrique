'use client'

import React from 'react'
import { useFeatureFlag } from '@/lib/feature-flags'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Zap, ArrowUp } from 'lucide-react'

export interface FeatureGateProps {
  feature: string
  tenantId?: string
  fallback?: React.ReactNode
  children: React.ReactNode
  showUpgrade?: boolean
  upgradeMessage?: string
}

export function FeatureGate({ 
  feature, 
  tenantId, 
  fallback, 
  children, 
  showUpgrade = true,
  upgradeMessage 
}: FeatureGateProps) {
  const hasFeature = useFeatureFlag(feature, tenantId)
  
  if (hasFeature) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (!showUpgrade) {
    return null
  }

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Fonctionnalité Non Disponible
        </h3>
        <p className="text-gray-500 mb-4 max-w-md">
          {upgradeMessage || 'Cette fonctionnalité n\'est pas incluse dans votre plan actuel. Mettez à niveau pour y accéder.'}
        </p>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => {
            // TODO: Rediriger vers la page d'upgrade
            console.log('Redirect to upgrade page')
          }}
        >
          <ArrowUp className="h-4 w-4 mr-2" />
          Mettre à Niveau
        </Button>
      </CardContent>
    </Card>
  )
}

// Composant pour les éléments de menu désactivés
export interface DisabledMenuItemProps {
  children: React.ReactNode
  feature: string
  tenantId?: string
  className?: string
}

export function DisabledMenuItem({ children, feature, tenantId, className = "" }: DisabledMenuItemProps) {
  const hasFeature = useFeatureFlag(feature, tenantId)
  
  if (hasFeature) {
    return <>{children}</>
  }

  return (
    <div className={`relative ${className}`}>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-end pr-2">
        <div className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Lock className="h-3 w-3" />
          <span>Pro</span>
        </div>
      </div>
    </div>
  )
}

// Composant pour les sections entières
export interface FeatureSectionProps {
  feature: string
  tenantId?: string
  children: React.ReactNode
  title?: string
  description?: string
  requiredPlan?: string
  requiredAddon?: string
}

export function FeatureSection({ 
  feature, 
  tenantId, 
  children, 
  title,
  description,
  requiredPlan,
  requiredAddon
}: FeatureSectionProps) {
  const hasFeature = useFeatureFlag(feature, tenantId)
  
  if (hasFeature) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Contenu flouté */}
      <div className="filter blur-sm pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay de déblocage */}
      <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {title || 'Fonctionnalité Premium'}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {description || 'Cette section nécessite une mise à niveau de votre plan.'}
            </p>
            {requiredPlan && (
              <p className="text-xs text-blue-600 mb-2">
                📋 Plan requis: <strong>{requiredPlan}</strong>
              </p>
            )}
            {requiredAddon && (
              <p className="text-xs text-purple-600 mb-4">
                ⚡ Add-on requis: <strong>{requiredAddon}</strong>
              </p>
            )}
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
              <ArrowUp className="h-4 w-4 mr-2" />
              Débloquer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Hook pour vérifier plusieurs features à la fois
export function useFeatureFlags(features: string[], tenantId?: string): { [key: string]: boolean } {
  const results: { [key: string]: boolean } = {}
  
  features.forEach(feature => {
    results[feature] = useFeatureFlag(feature, tenantId)
  })
  
  return results
}

// Composant pour afficher le statut d'une feature
export interface FeatureStatusProps {
  feature: string
  tenantId?: string
  showLabel?: boolean
}

export function FeatureStatus({ feature, tenantId, showLabel = true }: FeatureStatusProps) {
  const hasFeature = useFeatureFlag(feature, tenantId)
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${hasFeature ? 'bg-green-500' : 'bg-gray-400'}`} />
      {showLabel && (
        <span className={`text-xs ${hasFeature ? 'text-green-600' : 'text-gray-500'}`}>
          {hasFeature ? 'Activé' : 'Désactivé'}
        </span>
      )}
    </div>
  )
}

// Wrapper pour les routes protégées
export interface ProtectedRouteProps {
  feature: string
  tenantId?: string
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ feature, tenantId, children, redirectTo }: ProtectedRouteProps) {
  const hasFeature = useFeatureFlag(feature, tenantId)
  
  if (!hasFeature) {
    // TODO: Implémenter la redirection
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Accès Restreint</h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas accès à cette fonctionnalité avec votre plan actuel.
            </p>
            <div className="space-y-2">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => {
                  // TODO: Redirection vers upgrade
                  console.log('Redirect to upgrade')
                }}
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Mettre à Niveau
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  // TODO: Redirection vers dashboard
                  window.location.href = '/dashboard'
                }}
              >
                Retour au Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return <>{children}</>
}
