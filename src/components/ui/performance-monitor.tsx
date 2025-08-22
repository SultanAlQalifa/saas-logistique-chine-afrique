'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react'

interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  fps: number
  loadTime: number
  interactionDelay: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
    loadTime: 0,
    interactionDelay: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  const measurePerformance = useCallback(() => {
    // Mesurer le temps de rendu
    const renderStart = performance.now()
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStart

      // Mesurer l'utilisation mémoire (si disponible)
      const memoryInfo = (performance as any).memory
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0

      // Mesurer les FPS
      let fps = 0
      let frameCount = 0
      const fpsStart = performance.now()
      
      const countFrames = () => {
        frameCount++
        if (performance.now() - fpsStart < 1000) {
          requestAnimationFrame(countFrames)
        } else {
          fps = frameCount
        }
      }
      requestAnimationFrame(countFrames)

      // Temps de chargement de la page
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const loadTime = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0

      setMetrics(prev => ({
        ...prev,
        renderTime: Math.round(renderTime * 100) / 100,
        memoryUsage: Math.round(memoryUsage * 100) / 100,
        fps,
        loadTime: Math.round(loadTime),
        interactionDelay: 0 // À implémenter selon les besoins
      }))
    })
  }, [])

  useEffect(() => {
    measurePerformance()
    const interval = setInterval(measurePerformance, 5000)
    return () => clearInterval(interval)
  }, [measurePerformance])

  // Raccourci clavier pour afficher/masquer
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-900 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
        title="Afficher les métriques de performance (Ctrl+Shift+P)"
      >
        <Activity className="h-4 w-4" />
      </button>
    )
  }

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-600'
    if (value <= thresholds[1]) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 w-80 z-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Performance</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600">Rendu</span>
          </div>
          <span className={`text-sm font-medium ${getPerformanceColor(metrics.renderTime, [16, 33])}`}>
            {metrics.renderTime}ms
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">FPS</span>
          </div>
          <span className={`text-sm font-medium ${getPerformanceColor(60 - metrics.fps, [15, 30])}`}>
            {metrics.fps}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">Chargement</span>
          </div>
          <span className={`text-sm font-medium ${getPerformanceColor(metrics.loadTime, [1000, 3000])}`}>
            {metrics.loadTime}ms
          </span>
        </div>

        {metrics.memoryUsage > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600">Mémoire</span>
            </div>
            <span className={`text-sm font-medium ${getPerformanceColor(metrics.memoryUsage, [50, 100])}`}>
              {metrics.memoryUsage}MB
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Ctrl+Shift+P pour basculer</span>
          <span>Mis à jour toutes les 5s</span>
        </div>
      </div>
    </div>
  )
}

// Hook pour mesurer les performances d'un composant
export function usePerformanceTracking(componentName: string) {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (renderTime > 16) { // Plus de 16ms = problème potentiel
        console.warn(`⚠️ Composant lent détecté: ${componentName} (${renderTime.toFixed(2)}ms)`)
      }
    }
  }, [componentName])

  const trackInteraction = useCallback((actionName: string) => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const interactionTime = endTime - startTime
      
      if (interactionTime > 100) { // Plus de 100ms = interaction lente
        console.warn(`⚠️ Interaction lente: ${componentName}.${actionName} (${interactionTime.toFixed(2)}ms)`)
      }
    }
  }, [componentName])

  return { trackInteraction }
}
