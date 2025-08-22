'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TransportMode } from '@prisma/client'
import { calculateCBM, calculateShippingPrice, formatCurrency } from '@/utils/calculations'
import { Client, CompanySettings } from '@/types'
import ImageUpload from '@/components/ui/image-upload'

const createPackageSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  cargoId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  weight: z.number().min(0.1, 'Weight must be at least 0.1 kg').optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  transportMode: z.nativeEnum(TransportMode),
  finalPrice: z.number().optional(),
})

type CreatePackageFormData = z.infer<typeof createPackageSchema>

interface CreatePackageFormProps {
  clients: Client[]
  companySettings: CompanySettings
  onSubmit: (data: CreatePackageFormData & { calculatedPrice: number; cbm?: number }) => Promise<void>
  isLoading?: boolean
}

export default function CreatePackageForm({
  clients,
  companySettings,
  onSubmit,
  isLoading = false
}: CreatePackageFormProps) {
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0)
  const [cbm, setCbm] = useState<number | null>(null)
  const [packageId, setPackageId] = useState<string>('')
  const [trackingPin, setTrackingPin] = useState<string>('')
  const [packageImages, setPackageImages] = useState<any[]>([])

  // Generate auto ID and tracking PIN on component mount
  useEffect(() => {
    const generatePackageId = () => {
      const timestamp = Date.now().toString().slice(-6)
      return `CO-${timestamp}`
    }
    
    const generateTrackingPin = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let result = ''
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }
    
    setPackageId(generatePackageId())
    setTrackingPin(generateTrackingPin())
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CreatePackageFormData>({
    resolver: zodResolver(createPackageSchema),
  })

  const watchedFields = watch(['weight', 'length', 'width', 'height', 'transportMode'])

  // Calculate price and CBM when relevant fields change
  useEffect(() => {
    const [weight, length, width, height, transportMode] = watchedFields

    if (!transportMode) {
      setCalculatedPrice(0)
      setCbm(null)
      return
    }

    let newCbm: number | null = null
    let price = 0
    
    // For maritime modes: require dimensions, calculate CBM
    if (transportMode === 'MARITIME' || transportMode === 'MARITIME_EXPRESS') {
      if (length && width && height) {
        newCbm = calculateCBM(length, width, height)
        setCbm(newCbm)
        price = calculateShippingPrice(transportMode, 1, newCbm, companySettings) // Use dummy weight
      } else {
        setCalculatedPrice(0)
        setCbm(null)
        return
      }
    }
    // For aerial modes: require weight only
    else if (transportMode === 'AERIAL' || transportMode === 'AERIAL_EXPRESS') {
      if (weight) {
        setCbm(null)
        price = calculateShippingPrice(transportMode, weight, null, companySettings)
      } else {
        setCalculatedPrice(0)
        setCbm(null)
        return
      }
    }

    setCalculatedPrice(price)
    setValue('finalPrice', price)
  }, [watchedFields, companySettings, setValue])

  const handleFormSubmit = async (data: CreatePackageFormData) => {
    await onSubmit({
      ...data,
      calculatedPrice,
      cbm: cbm || undefined,
    })
  }

  const isMaritimeMode = watch('transportMode') === 'MARITIME' || watch('transportMode') === 'MARITIME_EXPRESS'
  const isAerialMode = watch('transportMode') === 'AERIAL' || watch('transportMode') === 'AERIAL_EXPRESS'

  return (
    <div className="animated-form-background">
      {/* Floating Particles */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="form-container p-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">✨📦 Nouveau Colis</h2>
          </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Auto-generated fields display */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🆔 Identifiants Automatiques
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📋 ID Colis (Auto)
              </label>
              <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-lg font-mono text-blue-600">
                {packageId}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔍 PIN de Suivi (Auto)
              </label>
              <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-lg font-mono text-green-600">
                {trackingPin}
              </div>
            </div>
          </div>
        </div>

        {/* Informations Client */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            👤 Informations Client
          </h3>
          <div>
            <label htmlFor="clientId" className="block text-sm font-bold text-gray-700 mb-2">
              🏢 Client *
            </label>
            <select
              {...register('clientId')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner un client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.clientId}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
            )}
          </div>
        </div>

        {/* Description du Colis */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
            📝 Description du Colis
          </h3>
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
              📦 Contenu *
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Décrivez le contenu du colis..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Mode de Transport */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
            🚛 Mode de Transport
          </h3>
          <div>
            <label htmlFor="transportMode" className="block text-sm font-bold text-gray-700 mb-2">
              🚚 Type de Transport *
            </label>
            <select
              {...register('transportMode')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Sélectionner un mode</option>
              <option value="MARITIME">🚢 Maritime (CBM)</option>
              <option value="MARITIME_EXPRESS">⚡ Maritime Express (CBM)</option>
              <option value="AERIAL">✈️ Aérien (Poids)</option>
              <option value="AERIAL_EXPRESS">🚀 Aérien Express (Poids)</option>
            </select>
            {errors.transportMode && (
              <p className="mt-1 text-sm text-red-600">{errors.transportMode.message}</p>
            )}
          </div>
        </div>

        {/* Poids (seulement pour les modes aériens) */}
        {isAerialMode && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
              ⚖️ Poids du Colis
            </h3>
            <div>
              <label htmlFor="weight" className="block text-sm font-bold text-gray-700 mb-2">
                📏 Poids (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                {...register('weight', { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="0.0"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
              )}
              <p className="mt-2 text-xs text-orange-700 bg-orange-100 p-2 rounded-lg">
                <strong>✈️ Mode Aérien :</strong> Le calcul se base sur le poids en kilogrammes
              </p>
            </div>
          </div>
        )}

        {/* Dimensions (seulement pour les modes maritimes) */}
        {isMaritimeMode && (
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
            <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center gap-2">
              📐 Dimensions du Colis
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="length" className="block text-sm font-bold text-gray-700 mb-2">
                  📏 Longueur (cm) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('length', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="0.0"
                />
                {errors.length && (
                  <p className="mt-1 text-sm text-red-600">{errors.length.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="width" className="block text-sm font-bold text-gray-700 mb-2">
                  📐 Largeur (cm) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('width', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="0.0"
                />
                {errors.width && (
                  <p className="mt-1 text-sm text-red-600">{errors.width.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-bold text-gray-700 mb-2">
                  📏 Hauteur (cm) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('height', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="0.0"
                />
                {errors.height && (
                  <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>
                )}
              </div>
            </div>
            <p className="mt-3 text-xs text-teal-700 bg-teal-100 p-3 rounded-lg">
              <strong>🚢 Mode Maritime :</strong> Le calcul se base uniquement sur le CBM : (L × l × h) ÷ 1,000,000 = m³
            </p>
          </div>
        )}

        {/* Photos du Colis */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
            📸 Photos du Colis
          </h3>
          <p className="text-purple-700 mb-4 text-sm">
            Ajoutez des photos de votre colis pour faciliter l'identification et le suivi. 
            Vous pouvez prendre des photos directement ou télécharger des images existantes.
          </p>
          <ImageUpload
            maxFiles={8}
            maxSize={5}
            onFilesChange={setPackageImages}
            existingImages={packageImages}
            showCamera={true}
            showPreview={true}
            className="mt-4"
          />
        </div>

        {/* Calcul Automatique du Prix */}
        {calculatedPrice > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
              💰 Calcul Automatique du Prix
            </h3>
            <div className="space-y-3">
              {isMaritimeMode && cbm && (
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <p className="text-emerald-700 font-medium">
                    🚢 CBM: {cbm.toFixed(6)} m³ × {formatCurrency(companySettings.maritimePricePerCbm)} = <span className="text-xl font-bold">{formatCurrency(calculatedPrice)}</span>
                  </p>
                </div>
              )}
              {isAerialMode && watch('weight') && (
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <p className="text-emerald-700 font-medium">
                    ✈️ Poids: {watch('weight')} kg × {formatCurrency(companySettings.aerialPricePerKg)} = <span className="text-xl font-bold">{formatCurrency(calculatedPrice)}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prix Final */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
            💵 Prix Final
          </h3>
          <div>
            <label htmlFor="finalPrice" className="block text-sm font-bold text-gray-700 mb-2">
              💰 Prix Final (€)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('finalPrice', { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="0.00"
            />
            <p className="mt-2 text-xs text-yellow-700 bg-yellow-100 p-2 rounded-lg">
              💡 Laissez vide pour utiliser le prix calculé: <strong>{formatCurrency(calculatedPrice)}</strong>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? '⏳ Création en cours...' : '📦 Créer le Colis'}
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  )
}
