'use client'

import React, { useState } from 'react'
import { Settings, Save, Camera, MapPin, FileText, Clock, Shield, CheckCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PODSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    maxPhotos: 5,
    maxFileSize: 10, // MB
    gpsAccuracy: 10, // meters
    signatureRequired: true,
    autoGenerateReceipt: true,
    notifyOnCompletion: true,
    requiredFields: {
      recipientName: true,
      recipientPhone: false,
      deliveryNotes: false
    },
    receiptTemplate: 'standard',
    retentionPeriod: 365 // days
  })

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleSave = () => {
    console.log('Sauvegarde des paramètres POD:', settings)
    setShowSuccessMessage(true)
    
    // Masquer le message après 3 secondes
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateRequiredField = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      requiredFields: {
        ...prev.requiredFields,
        [field]: value
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      {/* Message de succès */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-fade-in">
          <CheckCircle className="w-5 h-5 mr-2" />
          Paramètres POD sauvegardés avec succès !
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-white/50 transition-colors flex items-center text-gray-600 hover:text-green-600"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center">
            <Settings className="w-8 h-8 mr-3 text-green-600" />
            Configuration POD (Preuves de Livraison)
          </h1>
          <p className="text-gray-600 mt-2">
            Personnalisez les paramètres des preuves de livraison selon vos besoins
          </p>
        </div>

        {/* Configuration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Photos Configuration */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Camera className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold">Configuration Photos</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre maximum de photos
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxPhotos}
                  onChange={(e) => updateSetting('maxPhotos', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille maximum par fichier (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.maxFileSize}
                  onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* GPS Configuration */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold">Configuration GPS</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Précision GPS requise (mètres)
              </label>
              <select
                value={settings.gpsAccuracy}
                onChange={(e) => updateSetting('gpsAccuracy', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value={5}>Très haute précision (5m)</option>
                <option value={10}>Haute précision (10m)</option>
                <option value={20}>Précision normale (20m)</option>
                <option value={50}>Précision faible (50m)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Plus la précision est élevée, plus le temps de localisation peut être long
              </p>
            </div>
          </div>

          {/* Signature Configuration */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold">Configuration Signature</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.signatureRequired}
                  onChange={(e) => updateSetting('signatureRequired', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Signature obligatoire</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.autoGenerateReceipt}
                  onChange={(e) => updateSetting('autoGenerateReceipt', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Génération automatique du reçu</span>
              </label>
            </div>
          </div>

          {/* Notifications Configuration */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifyOnCompletion}
                  onChange={(e) => updateSetting('notifyOnCompletion', e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">Notifier à la finalisation du POD</span>
              </label>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période de rétention des données (jours)
                </label>
                <input
                  type="number"
                  min="30"
                  max="3650"
                  value={settings.retentionPeriod}
                  onChange={(e) => updateSetting('retentionPeriod', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Required Fields Configuration */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold">Champs Obligatoires</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requiredFields.recipientName}
                onChange={(e) => updateRequiredField('recipientName', e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Nom du destinataire</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requiredFields.recipientPhone}
                onChange={(e) => updateRequiredField('recipientPhone', e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Téléphone du destinataire</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requiredFields.deliveryNotes}
                onChange={(e) => updateRequiredField('deliveryNotes', e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Notes de livraison</span>
            </label>
          </div>
        </div>

        {/* Receipt Template Configuration */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold">Template de Reçu</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modèle de reçu
            </label>
            <select
              value={settings.receiptTemplate}
              onChange={(e) => updateSetting('receiptTemplate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="standard">Standard - Reçu simple</option>
              <option value="detailed">Détaillé - Avec photos et GPS</option>
              <option value="minimal">Minimal - Informations essentielles</option>
              <option value="branded">Avec branding - Logo entreprise</option>
            </select>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Résumé de la Configuration Actuelle
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Photos:</strong> Max {settings.maxPhotos} photos, {settings.maxFileSize}MB chacune</p>
              <p><strong>GPS:</strong> Précision de {settings.gpsAccuracy} mètres</p>
              <p><strong>Signature:</strong> {settings.signatureRequired ? 'Obligatoire' : 'Optionnelle'}</p>
            </div>
            <div>
              <p><strong>Reçu:</strong> {settings.autoGenerateReceipt ? 'Génération automatique' : 'Manuel'}</p>
              <p><strong>Notifications:</strong> {settings.notifyOnCompletion ? 'Activées' : 'Désactivées'}</p>
              <p><strong>Rétention:</strong> {settings.retentionPeriod} jours</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Sauvegarder les Paramètres
          </button>
        </div>
      </div>
    </div>
  )
}
