'use client'

import { useLogo } from '@/contexts/BrandingContext'
import React from 'react';
import Image from 'next/image';
import { Truck } from 'lucide-react'

interface DynamicLogoProps {
  variant?: 'light' | 'dark'
  className?: string
  showFallback?: boolean
}

export default function DynamicLogo({ 
  variant = 'light', 
  className = 'h-8 w-auto', 
  showFallback = true 
}: DynamicLogoProps) {
  const logo = useLogo()
  const logoSrc = variant === 'dark' ? logo.dark : logo.light

  // Fallback avec icône si pas de logo
  if (!logoSrc && showFallback) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Truck className="h-6 w-6 text-blue-600" />
        <span className="font-bold text-gray-900">Logistics</span>
      </div>
    )
  }

  return (
    <Image 
      src={logoSrc} 
      alt="Logo"
      width={120}
      height={40}
      className={className}
      priority
      onError={(e) => {
        if (showFallback) {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          // Afficher le fallback à la place
          const fallback = document.createElement('div')
          fallback.className = 'flex items-center gap-2'
          fallback.innerHTML = `
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-bold text-gray-900">Logistics</span>
          `
          target.parentNode?.insertBefore(fallback, target)
        }
      }}
    />
  )
}
