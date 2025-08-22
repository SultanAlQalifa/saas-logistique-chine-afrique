'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Globe, 
  Languages, 
  Clock, 
  MapPin, 
  Calendar,
  DollarSign,
  Settings,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface LocalizationSettings {
  language: string
  region: string
  timezone: string
  dateFormat: string
  timeFormat: string
  currency: string
  numberFormat: string
  firstDayOfWeek: string
}

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
]

const regions = [
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳' }
]

const timezones = [
  { value: 'Africa/Dakar', label: 'GMT (Dakar, Abidjan)' },
  { value: 'Africa/Casablanca', label: 'GMT+1 (Casablanca, Tunis)' },
  { value: 'Europe/Paris', label: 'GMT+1 (Paris, Madrid)' },
  { value: 'Asia/Shanghai', label: 'GMT+8 (Shanghai, Beijing)' },
  { value: 'UTC', label: 'UTC (Temps universel)' }
]

const currencies = [
  { code: 'XOF', name: 'Franc CFA (FCFA)', symbol: 'FCFA' },
  { code: 'MAD', name: 'Dirham Marocain', symbol: 'MAD' },
  { code: 'TND', name: 'Dinar Tunisien', symbol: 'TND' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'Dollar US', symbol: '$' },
  { code: 'CNY', name: 'Yuan Chinois', symbol: '¥' }
]

export default function LocalizationPage() {
  const [settings, setSettings] = useState<LocalizationSettings>({
    language: 'fr',
    region: 'SN',
    timezone: 'Africa/Dakar',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'XOF',
    numberFormat: 'fr-FR',
    firstDayOfWeek: 'monday'
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Paramètres de localisation sauvegardés avec succès !')
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setSettings({
        language: 'fr',
        region: 'SN',
        timezone: 'Africa/Dakar',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'XOF',
        numberFormat: 'fr-FR',
        firstDayOfWeek: 'monday'
      })
    }
  }

  const updateSetting = (key: keyof LocalizationSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const getCurrentLanguage = () => languages.find(l => l.code === settings.language)
  const getCurrentRegion = () => regions.find(r => r.code === settings.region)
  const getCurrentCurrency = () => currencies.find(c => c.code === settings.currency)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🌍 Localisation</h1>
            <p className="text-blue-100 text-lg">
              Configurez la langue, région et formats pour votre plateforme
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{getCurrentLanguage()?.flag}</div>
            <div className="text-blue-200 text-sm">{getCurrentLanguage()?.name}</div>
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
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Langue et Région */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Languages className="h-5 w-5" />
              Langue et Région
            </CardTitle>
            <CardDescription className="text-green-600">
              Définissez la langue principale et la région
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue principale
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Région/Pays
              </label>
              <select
                value={settings.region}
                onChange={(e) => updateSetting('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {regions.map(region => (
                  <option key={region.code} value={region.code}>
                    {region.flag} {region.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Fuseau Horaire */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Clock className="h-5 w-5" />
              Fuseau Horaire
            </CardTitle>
            <CardDescription className="text-blue-600">
              Configurez le fuseau horaire et les formats
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuseau horaire
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format de date
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => updateSetting('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format d'heure
                </label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => updateSetting('timeFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="24h">24 heures</option>
                  <option value="12h">12 heures (AM/PM)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devise et Formats */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <DollarSign className="h-5 w-5" />
              Devise et Formats
            </CardTitle>
            <CardDescription className="text-orange-600">
              Configurez la devise et les formats numériques
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devise principale
              </label>
              <select
                value={settings.currency}
                onChange={(e) => updateSetting('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format des nombres
              </label>
              <select
                value={settings.numberFormat}
                onChange={(e) => updateSetting('numberFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fr-FR">1 234,56 (Français)</option>
                <option value="en-US">1,234.56 (Anglais)</option>
                <option value="ar-SA">١٬٢٣٤٫٥٦ (Arabe)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Calendrier */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Calendar className="h-5 w-5" />
              Calendrier
            </CardTitle>
            <CardDescription className="text-purple-600">
              Paramètres du calendrier et des semaines
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Premier jour de la semaine
              </label>
              <select
                value={settings.firstDayOfWeek}
                onChange={(e) => updateSetting('firstDayOfWeek', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monday">Lundi</option>
                <option value="sunday">Dimanche</option>
                <option value="saturday">Samedi</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Aperçu des formats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date :</span>
                  <span className="font-mono">20/08/2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Heure :</span>
                  <span className="font-mono">15:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre :</span>
                  <span className="font-mono">1 234,56</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix :</span>
                  <span className="font-mono">1 234,56 FCFA</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statut actuel */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900 mb-2">
                Configuration actuelle
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-green-600 font-medium">Langue :</span>
                  <div className="text-green-800">{getCurrentLanguage()?.flag} {getCurrentLanguage()?.name}</div>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Région :</span>
                  <div className="text-green-800">{getCurrentRegion()?.flag} {getCurrentRegion()?.name}</div>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Devise :</span>
                  <div className="text-green-800">{getCurrentCurrency()?.symbol} {getCurrentCurrency()?.name}</div>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Fuseau :</span>
                  <div className="text-green-800">{settings.timezone.split('/')[1]}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
