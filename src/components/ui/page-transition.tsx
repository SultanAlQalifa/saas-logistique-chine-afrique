'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    setIsLoading(true)
    
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsLoading(false)
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div className="relative">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isLoading 
            ? 'opacity-0 transform translate-y-2 scale-[0.98]' 
            : 'opacity-100 transform translate-y-0 scale-100'
        }`}
      >
        {displayChildren}
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <span className="text-gray-600 font-medium">Chargement...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function LoadingSpinner({ size = 'md', color = 'indigo' }: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'indigo' | 'blue' | 'green' | 'purple' | 'pink'
}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-3',
    lg: 'w-8 h-8 border-4',
    xl: 'w-12 h-12 border-4'
  }

  const colorClasses = {
    indigo: 'border-indigo-200 border-t-indigo-600',
    blue: 'border-blue-200 border-t-blue-600',
    green: 'border-green-200 border-t-green-600',
    purple: 'border-purple-200 border-t-purple-600',
    pink: 'border-pink-200 border-t-pink-600'
  }

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`} />
  )
}

export function ProgressBar({ progress, className = '' }: { progress: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}

export function PulseLoader() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-3 h-3 bg-indigo-600 rounded-full"
        />
      ))}
    </div>
  )
}

export function BouncingDots() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-2 h-2 bg-indigo-600 rounded-full"
        />
      ))}
    </div>
  )
}
