'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { 
  Palette, 
  Layout, 
  Eye, 
  Settings,
  Save,
  RotateCcw,
  Monitor,
  Moon,
  Sun,
  Smartphone,
  Tablet,
  Zap,
  Grid3X3,
  List,
  Sidebar,
  Navigation,
  Type,
  Image,
  Sliders
} from 'lucide-react'

interface CustomizationSettings {
  theme: {
    mode: 'light' | 'dark' | 'auto'
    primaryColor: string
    accentColor: string
    backgroundPattern: string
  }
  layout: {
    sidebarStyle: 'compact' | 'expanded' | 'icons'
    dashboardLayout: 'grid' | 'list' | 'cards'
    headerStyle: 'minimal' | 'detailed' | 'gradient'
    animations: boolean
    compactMode: boolean
  }
  display: {
    fontSize: 'small' | 'medium' | 'large'
    density: 'comfortable' | 'compact' | 'spacious'
    showAvatars: boolean
    showBadges: boolean
    roundedCorners: boolean
  }
  dashboard: {
    showWelcome: boolean
    showQuickActions: boolean
    showRecentActivity: boolean
    showStatistics: boolean
    widgetOrder: string[]
  }
}

const themeColors = [
  { name: 'Bleu', value: '#3B82F6', gradient: 'from-blue-500 to-blue-600' },
  { name: 'Violet', value: '#8B5CF6', gradient: 'from-violet-500 to-violet-600' },
  { name: 'Vert', value: '#10B981', gradient: 'from-green-500 to-green-600' },
  { name: 'Orange', value: '#F59E0B', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Rose', value: '#EC4899', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Indigo', value: '#6366F1', gradient: 'from-indigo-500 to-indigo-600' }
]

const backgroundPatterns = [
  { name: 'Aucun', value: 'none', preview: 'bg-white' },
  { name: 'Subtil', value: 'subtle', preview: 'bg-gradient-to-br from-gray-50 to-white' },
  { name: 'Géométrique', value: 'geometric', preview: 'bg-gradient-to-r from-blue-50 via-white to-purple-50' },
  { name: 'Dégradé', value: 'gradient', preview: 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50' }
]

export default function CustomizationPage() {
  const [settings, setSettings] = useState<CustomizationSettings>({
    theme: {
      mode: 'light',
      primaryColor: '#3B82F6',
      accentColor: '#8B5CF6',
      backgroundPattern: 'subtle'
    },
    layout: {
      sidebarStyle: 'expanded',
      dashboardLayout: 'grid',
      headerStyle: 'gradient',
      animations: true,
      compactMode: false
    },
    display: {
      fontSize: 'medium',
      density: 'comfortable',
      showAvatars: true,
      showBadges: true,
      roundedCorners: true
    },
    dashboard: {
      showWelcome: true,
      showQuickActions: true,
      showRecentActivity: true,
      showStatistics: true,
      widgetOrder: ['stats', 'recent', 'actions', 'welcome']
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Personnalisation sauvegardée avec succès !')
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toute la personnalisation ?')) {
      setSettings({
        theme: {
          mode: 'light',
          primaryColor: '#3B82F6',
          accentColor: '#8B5CF6',
          backgroundPattern: 'subtle'
        },
        layout: {
          sidebarStyle: 'expanded',
          dashboardLayout: 'grid',
          headerStyle: 'gradient',
          animations: true,
          compactMode: false
        },
        display: {
          fontSize: 'medium',
          density: 'comfortable',
          showAvatars: true,
          showBadges: true,
          roundedCorners: true
        },
        dashboard: {
          showWelcome: true,
          showQuickActions: true,
          showRecentActivity: true,
          showStatistics: true,
          widgetOrder: ['stats', 'recent', 'actions', 'welcome']
        }
      })
    }
  }

  const updateTheme = (key: keyof typeof settings.theme, value: any) => {
    setSettings(prev => ({
      ...prev,
      theme: { ...prev.theme, [key]: value }
    }))
  }

  const updateLayout = (key: keyof typeof settings.layout, value: any) => {
    setSettings(prev => ({
      ...prev,
      layout: { ...prev.layout, [key]: value }
    }))
  }

  const updateDisplay = (key: keyof typeof settings.display, value: any) => {
    setSettings(prev => ({
      ...prev,
      display: { ...prev.display, [key]: value }
    }))
  }

  const updateDashboard = (key: keyof typeof settings.dashboard, value: any) => {
    setSettings(prev => ({
      ...prev,
      dashboard: { ...prev.dashboard, [key]: value }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎨 Personnalisation</h1>
            <p className="text-purple-100 text-lg">
              Personnalisez l'apparence et le comportement de votre interface
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Quitter aperçu' : 'Aperçu'}
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thème */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Palette className="h-5 w-5" />
              Thème et Couleurs
            </CardTitle>
            <CardDescription className="text-purple-600">
              Personnalisez l'apparence visuelle
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Mode thème */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mode d'affichage
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'light', label: 'Clair', icon: Sun },
                  { value: 'dark', label: 'Sombre', icon: Moon },
                  { value: 'auto', label: 'Auto', icon: Monitor }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateTheme('mode', value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.theme.mode === value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Couleurs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Couleur principale
              </label>
              <div className="grid grid-cols-6 gap-2">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateTheme('primaryColor', color.value)}
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color.gradient} border-2 transition-all ${
                      settings.theme.primaryColor === color.value
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Motifs de fond */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Motif de fond
              </label>
              <div className="grid grid-cols-2 gap-2">
                {backgroundPatterns.map((pattern) => (
                  <button
                    key={pattern.value}
                    onClick={() => updateTheme('backgroundPattern', pattern.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.theme.backgroundPattern === pattern.value
                        ? 'border-purple-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-8 rounded ${pattern.preview} mb-2`} />
                    <div className="text-xs font-medium">{pattern.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Layout className="h-5 w-5" />
              Mise en Page
            </CardTitle>
            <CardDescription className="text-blue-600">
              Configurez la disposition des éléments
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Style sidebar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Style de la sidebar
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'compact', label: 'Compacte', icon: Sidebar },
                  { value: 'expanded', label: 'Étendue', icon: Navigation },
                  { value: 'icons', label: 'Icônes', icon: Grid3X3 }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateLayout('sidebarStyle', value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.layout.sidebarStyle === value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout dashboard */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Layout du dashboard
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'grid', label: 'Grille', icon: Grid3X3 },
                  { value: 'list', label: 'Liste', icon: List },
                  { value: 'cards', label: 'Cartes', icon: Layout }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateLayout('dashboardLayout', value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.layout.dashboardLayout === value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options layout */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Animations</span>
                <Switch
                  checked={settings.layout.animations}
                  onCheckedChange={(checked) => updateLayout('animations', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mode compact</span>
                <Switch
                  checked={settings.layout.compactMode}
                  onCheckedChange={(checked) => updateLayout('compactMode', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affichage */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Type className="h-5 w-5" />
              Affichage et Typographie
            </CardTitle>
            <CardDescription className="text-green-600">
              Ajustez la taille et la densité
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Taille police */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Taille de police
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'small', label: 'Petite' },
                  { value: 'medium', label: 'Moyenne' },
                  { value: 'large', label: 'Grande' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateDisplay('fontSize', value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.display.fontSize === value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`font-medium ${
                      value === 'small' ? 'text-xs' : 
                      value === 'medium' ? 'text-sm' : 'text-base'
                    }`}>
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Densité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Densité d'affichage
              </label>
              <select
                value={settings.display.density}
                onChange={(e) => updateDisplay('density', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="compact">Compacte</option>
                <option value="comfortable">Confortable</option>
                <option value="spacious">Spacieuse</option>
              </select>
            </div>

            {/* Options affichage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avatars</span>
                <Switch
                  checked={settings.display.showAvatars}
                  onCheckedChange={(checked) => updateDisplay('showAvatars', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Badges</span>
                <Switch
                  checked={settings.display.showBadges}
                  onCheckedChange={(checked) => updateDisplay('showBadges', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Coins arrondis</span>
                <Switch
                  checked={settings.display.roundedCorners}
                  onCheckedChange={(checked) => updateDisplay('roundedCorners', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Sliders className="h-5 w-5" />
              Widgets Dashboard
            </CardTitle>
            <CardDescription className="text-orange-600">
              Configurez les éléments du tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Message de bienvenue</span>
                <Switch
                  checked={settings.dashboard.showWelcome}
                  onCheckedChange={(checked) => updateDashboard('showWelcome', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Actions rapides</span>
                <Switch
                  checked={settings.dashboard.showQuickActions}
                  onCheckedChange={(checked) => updateDashboard('showQuickActions', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Activité récente</span>
                <Switch
                  checked={settings.dashboard.showRecentActivity}
                  onCheckedChange={(checked) => updateDashboard('showRecentActivity', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Statistiques</span>
                <Switch
                  checked={settings.dashboard.showStatistics}
                  onCheckedChange={(checked) => updateDashboard('showStatistics', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu */}
      {previewMode && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Aperçu de votre personnalisation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <div className="space-y-4">
                <div className={`w-full h-12 bg-gradient-to-r ${
                  themeColors.find(c => c.value === settings.theme.primaryColor)?.gradient || 'from-blue-500 to-blue-600'
                } rounded-lg flex items-center justify-center text-white font-bold`}>
                  Header avec couleur principale
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="text-sm font-medium">Widget 1</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="text-sm font-medium">Widget 2</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="text-sm font-medium">Widget 3</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Aperçu avec thème {settings.theme.mode}, layout {settings.layout.dashboardLayout}, 
                  police {settings.display.fontSize}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
