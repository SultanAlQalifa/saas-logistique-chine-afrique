'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Save, RefreshCw, Eye, Edit3, Globe, Type, FileText, Star } from 'lucide-react'

interface HeaderConfig {
  title: string
  subtitle: string
  description: string
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  features: Array<{
    title: string
    description: string
  }>
  lastUpdated: string
  updatedBy: string
}

export default function SiteConfigPage() {
  const { data: session } = useSession()
  const [config, setConfig] = useState<HeaderConfig>({
    title: 'NextMove',
    subtitle: 'Chine-Afrique',
    description: 'La plateforme de référence pour vos échanges commerciaux entre la Chine et l\'Afrique. Suivi en temps réel, transparence totale, livraison garantie.',
    heroTitle: 'Connectez la Chine à l\'Afrique',
    heroSubtitle: 'Simplifiez vos échanges commerciaux avec notre plateforme tout-en-un',
    ctaText: 'Commencer maintenant',
    features: [
      {
        title: 'Suivi en temps réel',
        description: 'Suivez vos cargaisons en direct depuis la Chine jusqu\'en Afrique'
      },
      {
        title: 'Transparence totale',
        description: 'Accès complet aux informations de transport et douanes'
      },
      {
        title: 'Livraison garantie',
        description: 'Assurance et garantie sur toutes vos expéditions'
      }
    ],
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  })

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Vérification des permissions
  if (!session || session.user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accès Restreint</h2>
          <p className="text-gray-600 mb-4">
            Seuls les super administrateurs peuvent modifier la configuration du site.
          </p>
          <p className="text-sm text-gray-500">
            Votre rôle actuel: {session?.user?.role || 'Non connecté'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  const loadConfig = async () => {
    try {
      const response = await fetch('/data/header-config.json')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulation de sauvegarde (en production, cela ferait un appel API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedConfig = {
        ...config,
        lastUpdated: new Date().toISOString(),
        updatedBy: session?.user?.email || 'admin'
      }
      
      setConfig(updatedConfig)
      setNotification({
        message: '✅ Configuration du site sauvegardée avec succès!',
        type: 'success'
      })
      setTimeout(() => setNotification(null), 4000)
    } catch (error) {
      setNotification({
        message: '❌ Erreur lors de la sauvegarde',
        type: 'error'
      })
      setTimeout(() => setNotification(null), 4000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...config.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setConfig({ ...config, features: newFeatures })
  }

  const addFeature = () => {
    setConfig({
      ...config,
      features: [...config.features, { title: '', description: '' }]
    })
  }

  const removeFeature = (index: number) => {
    setConfig({
      ...config,
      features: config.features.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">🌐 Configuration du Site</h1>
              <p className="text-blue-100 text-lg">Personnalisez l'apparence et le contenu de votre site</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  previewMode 
                    ? 'bg-white text-blue-600 hover:bg-blue-50' 
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
              >
                <Eye className="h-4 w-4 inline mr-2" />
                {previewMode ? 'Mode Édition' : 'Aperçu'}
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 inline mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 inline mr-2" />
                )}
                Sauvegarder
              </button>
            </div>
          </div>
        </div>

        {previewMode ? (
          /* Mode Aperçu */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Eye className="h-6 w-6 text-blue-600" />
              Aperçu du Site
            </h2>
            
            {/* Aperçu Header */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{config.title}</h1>
                <h2 className="text-2xl text-blue-600 mb-4">{config.subtitle}</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">{config.description}</p>
              </div>
            </div>

            {/* Aperçu Hero */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 mb-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">{config.heroTitle}</h1>
                <p className="text-xl mb-6">{config.heroSubtitle}</p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
                  {config.ctaText}
                </button>
              </div>
            </div>

            {/* Aperçu Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Mode Édition */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Type className="h-6 w-6 text-blue-600" />
                Header du Site
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre Principal
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="NextMove"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    value={config.subtitle}
                    onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Chine-Afrique"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => setConfig({ ...config, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description de votre plateforme..."
                  />
                </div>
              </div>
            </div>

            {/* Configuration Hero */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-purple-600" />
                Section Hero
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre Hero
                  </label>
                  <input
                    type="text"
                    value={config.heroTitle}
                    onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Connectez la Chine à l'Afrique"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-titre Hero
                  </label>
                  <textarea
                    value={config.heroSubtitle}
                    onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Simplifiez vos échanges commerciaux..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texte du Bouton CTA
                  </label>
                  <input
                    type="text"
                    value={config.ctaText}
                    onChange={(e) => setConfig({ ...config, ctaText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Commencer maintenant"
                  />
                </div>
              </div>
            </div>

            {/* Configuration Features */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-green-600" />
                  Fonctionnalités Principales
                </h2>
                <button
                  onClick={addFeature}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Ajouter une fonctionnalité
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.features.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-500">Fonctionnalité {index + 1}</span>
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="Titre de la fonctionnalité"
                      />
                      <textarea
                        value={feature.description}
                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="Description de la fonctionnalité"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informations de mise à jour */}
            <div className="lg:col-span-2 bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Dernière mise à jour: {new Date(config.lastUpdated).toLocaleString('fr-FR')}
                </span>
                <span>
                  Par: {config.updatedBy}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
