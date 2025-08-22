'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Globe, 
  AlertTriangle,
  Monitor,
  Smartphone,
  Type,
  FileText,
  Star,
  Target
} from 'lucide-react'

interface Feature {
  id: string
  title: string
  description: string
  order: number
}

interface SiteConfig {
  title: string
  subtitle: string
  description: string
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  features: Feature[]
  lastUpdated: string
  updatedBy: string
}

const defaultSiteConfig: SiteConfig = {
  title: "NextMove",
  subtitle: "Chine-Afrique",
  description: "La plateforme de référence pour vos échanges commerciaux entre la Chine et l'Afrique. Simplifiez vos opérations logistiques avec nos solutions innovantes.",
  heroTitle: "Connectez la Chine à l'Afrique",
  heroSubtitle: "Plateforme logistique nouvelle génération",
  ctaText: "Commencer maintenant",
  features: [
    {
      id: "1",
      title: "Suivi en temps réel",
      description: "Suivez vos colis à chaque étape du transport",
      order: 1
    },
    {
      id: "2", 
      title: "Tarification transparente",
      description: "Obtenez des devis instantanés et compétitifs",
      order: 2
    },
    {
      id: "3",
      title: "Support 24/7",
      description: "Une équipe dédiée pour vous accompagner",
      order: 3
    }
  ],
  lastUpdated: new Date().toISOString(),
  updatedBy: "Super Admin"
}

export default function SiteConfigPage() {
  const { data: session } = useSession()
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newFeature, setNewFeature] = useState({ title: '', description: '' })

  // Vérifier si l'utilisateur est SUPER_ADMIN
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN'

  // Charger la configuration depuis le fichier JSON
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/data/header-config.json')
        if (response.ok) {
          const config = await response.json()
          setSiteConfig(config)
        }
      } catch (error) {
        console.log('Utilisation de la configuration par défaut')
      }
    }
    loadConfig()
  }, [])

  // Si pas SUPER_ADMIN, afficher message d'accès refusé
  if (session && !isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            Cette page est réservée aux Super Administrateurs uniquement.
            <br />
            Contactez votre administrateur système pour plus d'informations.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Votre rôle actuel : <span className="font-medium">{session?.user?.role || 'Non défini'}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulation de sauvegarde (remplacer par vraie API)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const updatedConfig = {
        ...siteConfig,
        lastUpdated: new Date().toISOString(),
        updatedBy: session?.user?.name || 'Super Admin'
      }
      
      setSiteConfig(updatedConfig)
      alert('✅ Configuration du site sauvegardée avec succès!')
    } catch (error) {
      alert('❌ Erreur lors de la sauvegarde: ' + error)
    } finally {
      setIsSaving(false)
    }
  }

  const addFeature = () => {
    if (newFeature.title && newFeature.description) {
      const feature: Feature = {
        id: Date.now().toString(),
        title: newFeature.title,
        description: newFeature.description,
        order: siteConfig.features.length + 1
      }
      
      setSiteConfig(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }))
      
      setNewFeature({ title: '', description: '' })
      alert('✅ Fonctionnalité ajoutée avec succès!')
    }
  }

  const removeFeature = (featureId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette fonctionnalité?')) {
      setSiteConfig(prev => ({
        ...prev,
        features: prev.features.filter(f => f.id !== featureId)
      }))
      alert('🗑️ Fonctionnalité supprimée avec succès!')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Globe className="h-10 w-10" />
              🌐 Configuration du Site
            </h1>
            <p className="text-blue-100 text-lg">
              Personnalisez le header et le contenu principal de la plateforme
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Édition' : 'Aperçu'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>

      {!showPreview ? (
        /* Mode Édition */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-8">
            {/* Header du Site */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <Type className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Header du Site</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre Principal
                  </label>
                  <input
                    type="text"
                    value={siteConfig.title}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="NextMove"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    value={siteConfig.subtitle}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Chine-Afrique"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de la Plateforme
                </label>
                <textarea
                  value={siteConfig.description}
                  onChange={(e) => setSiteConfig(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description de votre plateforme..."
                />
              </div>
            </div>

            {/* Section Hero */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <Target className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Section Hero</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre Hero
                  </label>
                  <input
                    type="text"
                    value={siteConfig.heroTitle}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, heroTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Titre principal de la section hero"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-titre Hero
                  </label>
                  <input
                    type="text"
                    value={siteConfig.heroSubtitle}
                    onChange={(e) => setSiteConfig(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Sous-titre de la section hero"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte du Bouton CTA
                </label>
                <input
                  type="text"
                  value={siteConfig.ctaText}
                  onChange={(e) => setSiteConfig(prev => ({ ...prev, ctaText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Commencer maintenant"
                />
              </div>
            </div>

            {/* Fonctionnalités */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Fonctionnalités Principales</h2>
                </div>
              </div>

              {/* Liste des fonctionnalités existantes */}
              <div className="space-y-4">
                {siteConfig.features.map((feature) => (
                  <div key={feature.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => setSiteConfig(prev => ({
                            ...prev,
                            features: prev.features.map(f => 
                              f.id === feature.id ? { ...f, title: e.target.value } : f
                            )
                          }))}
                          className="w-full font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0 mb-2"
                        />
                        <textarea
                          value={feature.description}
                          onChange={(e) => setSiteConfig(prev => ({
                            ...prev,
                            features: prev.features.map(f => 
                              f.id === feature.id ? { ...f, description: e.target.value } : f
                            )
                          }))}
                          className="w-full text-gray-600 bg-transparent border-none focus:ring-0 p-0 resize-none"
                          rows={2}
                        />
                      </div>
                      <button
                        onClick={() => removeFeature(feature.id)}
                        className="text-red-600 hover:text-red-800 p-1 ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ajouter nouvelle fonctionnalité */}
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-dashed border-blue-200">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newFeature.title}
                    onChange={(e) => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de la nouvelle fonctionnalité"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <textarea
                    value={newFeature.description}
                    onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de la fonctionnalité"
                    rows={2}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={addFeature}
                    disabled={!newFeature.title || !newFeature.description}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter la fonctionnalité
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode Aperçu */
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Monitor className="h-5 w-5 text-blue-600" />
              Aperçu du Site
            </h3>
            <p className="text-sm text-gray-600 mt-1">Voici comment le contenu apparaîtra sur la page d'accueil</p>
          </div>
          
          <div className="p-6">
            {/* Header Preview */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">
                  {siteConfig.title} <span className="text-blue-200">{siteConfig.subtitle}</span>
                </h1>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                  {siteConfig.description}
                </p>
              </div>
            </div>

            {/* Hero Section Preview */}
            <div className="text-center py-12 bg-gray-50 rounded-lg mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {siteConfig.heroTitle}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {siteConfig.heroSubtitle}
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                {siteConfig.ctaText}
              </button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {siteConfig.features.map((feature) => (
                <div key={feature.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info de dernière modification */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span>
            Dernière modification : {new Date(siteConfig.lastUpdated).toLocaleString('fr-FR')}
          </span>
          <span>
            Par : {siteConfig.updatedBy}
          </span>
        </div>
      </div>
    </div>
  )
}
