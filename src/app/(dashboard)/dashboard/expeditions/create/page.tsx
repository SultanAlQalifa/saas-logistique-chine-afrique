'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Save, Calendar, MapPin, Package, Truck, Plane, Ship } from 'lucide-react'
import Link from 'next/link'

export default function CreateExpeditionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    type: 'aerial',
    origin: '',
    destination: '',
    departureDate: '',
    arrivalDate: '',
    carrier: '',
    trackingNumber: '',
    description: '',
    packages: [{ description: '', weight: 0, volume: 0, quantity: 1 }]
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePackageChange = (index: number, field: string, value: string | number) => {
    const newPackages = [...formData.packages]
    newPackages[index] = {
      ...newPackages[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      packages: newPackages
    }))
  }

  const addPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, { description: '', weight: 0, volume: 0, quantity: 1 }]
    }))
  }

  const removePackage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Simulation de l'envoi des données
      console.log('Création d\'expédition:', formData)
      
      // Redirection vers la liste des expéditions
      router.push('/dashboard/expeditions')
    } catch (error) {
      console.error('Erreur lors de la création de l\'expédition:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'aerial':
        return <Plane className="h-5 w-5" />
      case 'maritime':
        return <Ship className="h-5 w-5" />
      case 'express':
        return <Truck className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Back Button - Top of page */}
      <div className="flex items-center justify-start">
        <Link
          href="/dashboard/expeditions"
          className="flex items-center bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg border border-blue-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour aux expéditions
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <div>
          <h1 className="text-4xl font-bold mb-2">✈️ Nouvelle Expédition</h1>
          <p className="text-blue-100 text-lg">Créez une nouvelle expédition pour vos colis</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          {/* Informations générales */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-100 p-2 rounded-lg mr-3">
                📋
              </span>
              Informations Générales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-bold text-gray-700 mb-3">
                  🚛 Type d'Expédition
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="aerial">Aérien</option>
                    <option value="maritime">Maritime</option>
                    <option value="express">Express</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {getTypeIcon(formData.type)}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="carrier" className="block text-sm font-bold text-gray-700 mb-3">
                  🏢 Transporteur
                </label>
                <input
                  type="text"
                  id="carrier"
                  name="carrier"
                  value={formData.carrier}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Air France Cargo, CMA CGM, DHL Express"
                />
              </div>

              <div>
                <label htmlFor="origin" className="block text-sm font-bold text-gray-700 mb-3">
                  📍 Origine
                </label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Guangzhou, Chine"
                />
              </div>

              <div>
                <label htmlFor="destination" className="block text-sm font-bold text-gray-700 mb-3">
                  🎯 Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Abidjan, Côte d'Ivoire"
                />
              </div>

              <div>
                <label htmlFor="departureDate" className="block text-sm font-bold text-gray-700 mb-3">
                  📅 Date de Départ
                </label>
                <input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="arrivalDate" className="block text-sm font-bold text-gray-700 mb-3">
                  📅 Date d'Arrivée Prévue
                </label>
                <input
                  type="date"
                  id="arrivalDate"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="trackingNumber" className="block text-sm font-bold text-gray-700 mb-3">
                🔍 Numéro de Suivi
              </label>
              <input
                type="text"
                id="trackingNumber"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: AF-CG-2024-001"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-3">
                📝 Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description de l'expédition..."
              />
            </div>
          </div>

          {/* Colis */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">
                  📦
                </span>
                Colis à Expédier
              </h3>
              <button
                type="button"
                onClick={addPackage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un colis
              </button>
            </div>

            <div className="space-y-6">
              {formData.packages.map((pkg, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Colis {index + 1}</h4>
                    {formData.packages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePackage(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={pkg.description}
                        onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Description du colis"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Poids (kg)
                      </label>
                      <input
                        type="number"
                        value={pkg.weight}
                        onChange={(e) => handlePackageChange(index, 'weight', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volume (m³)
                      </label>
                      <input
                        type="number"
                        value={pkg.volume}
                        onChange={(e) => handlePackageChange(index, 'volume', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/dashboard/expeditions"
            className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            Créer l'Expédition
          </button>
        </div>
      </form>
    </div>
  )
}
