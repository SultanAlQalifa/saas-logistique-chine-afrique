'use client'

import React, { useState, useEffect, useRef, lazy, Suspense, ComponentType } from 'react'
import Image from 'next/image'
import { Skeleton } from './loading-skeleton'

interface LazyComponentProps {
  fallback?: React.ReactNode
  className?: string
}

// HOC pour créer des composants lazy avec fallback automatique
export function createLazyComponent(
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  fallbackComponent?: React.ComponentType
) {
  const LazyComponent = lazy(importFunc)
  
  return React.forwardRef<any, any>(
    (props, ref) => {
      const { fallback, className, ...componentProps } = props
      
      const defaultFallback = fallbackComponent ? 
        React.createElement(fallbackComponent) : 
        <Skeleton variant="card" className={className} />
      
      return (
        <Suspense fallback={fallback || defaultFallback}>
          <LazyComponent {...componentProps} />
        </Suspense>
      )
    }
  )
}

// Hook pour le lazy loading conditionnel
export function useLazyLoading(shouldLoad: boolean, delay: number = 0) {
  const [isReady, setIsReady] = React.useState(!shouldLoad)
  
  React.useEffect(() => {
    if (shouldLoad && !isReady) {
      const timer = setTimeout(() => {
        setIsReady(true)
      }, delay)
      
      return () => clearTimeout(timer)
    }
  }, [shouldLoad, isReady, delay])
  
  return isReady
}

// Composant pour lazy loading basé sur l'intersection
interface IntersectionLazyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function IntersectionLazy({
  children,
  fallback = <Skeleton variant="card" />,
  threshold = 0.1,
  rootMargin = '50px',
  className = ''
}: IntersectionLazyProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [threshold, rootMargin, hasLoaded])
  
  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}

// Composant pour lazy loading d'images
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholder?: string
  className?: string
  onLoad?: () => void
  onError?: () => void
}

export function LazyImage({
  src,
  alt,
  placeholder,
  className = '',
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }
  
  const handleError = () => {
    setHasError(true)
    onError?.()
  }
  
  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          {placeholder ? (
            <Image src={placeholder} alt="" width={32} height={32} className="opacity-50" />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded" />
          )}
        </div>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500">
          <span className="text-sm">Erreur de chargement</span>
        </div>
      )}
    </div>
  )
}

// Hook pour preloader des composants
export function usePreloader(components: (() => Promise<any>)[]) {
  const [loadedComponents, setLoadedComponents] = React.useState<Set<number>>(new Set())
  
  const preload = React.useCallback(async (index: number) => {
    if (!loadedComponents.has(index)) {
      try {
        await components[index]()
        setLoadedComponents(prev => new Set(Array.from(prev).concat(index)))
      } catch (error) {
        console.warn(`Erreur lors du preloading du composant ${index}:`, error)
      }
    }
  }, [components, loadedComponents])
  
  const preloadAll = React.useCallback(async () => {
    const promises = components.map((_, index) => preload(index))
    await Promise.allSettled(promises)
  }, [components, preload])
  
  return { preload, preloadAll, loadedComponents }
}
