'use client'

import { useState, useEffect } from 'react'
import { Calculator, Package, Truck, Plane, Ship, Plus, Edit, Trash2 } from 'lucide-react'

interface CompanySettings {
  aerialPricePerKg: number
  maritimePricePerCbm: number
}

interface PricingRule {
  id: string
  name: string
  transportMode: 'AERIAL' | 'AERIAL_EXPRESS' | 'MARITIME' | 'MARITIME_EXPRESS'
  pricePerUnit: number
  unit: 'kg' | 'cbm'
  description?: string
}

type TransportMode = 'AERIAL' | 'AERIAL_EXPRESS' | 'MARITIME' | 'MARITIME_EXPRESS'

// Fonction de calcul de prix (règle impérative)
function calculateShippingPrice(
  transportMode: TransportMode,
  weight: number,
  cbm: number | null,
  settings: CompanySettings
): number {
  switch (transportMode) {
    case 'AERIAL':
      return weight * settings.aerialPricePerKg
    case 'AERIAL_EXPRESS':
      return weight * settings.aerialPricePerKg * 1.5
    case 'MARITIME':
      if (!cbm) return 0
      return cbm * settings.maritimePricePerCbm
    case 'MARITIME_EXPRESS':
      if (!cbm) return 0
      return cbm * settings.maritimePricePerCbm * 1.3
    default:
      return 0
  }
}

export default function TarificationDirectePage() {
  const [transportMode, setTransportMode] = useState<TransportMode>('AERIAL')
  const [weight, setWeight] = useState<number>(0)
  const [length, setLength] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0)

  const companySettings: CompanySettings = {
    aerialPricePerKg: 15,
    maritimePricePerCbm: 800
  }

  const cbm = length && width && height ? (length * width * height) / 1000000 : null
  const isAerialMode = transportMode === 'AERIAL' || transportMode === 'AERIAL_EXPRESS'
  const isMaritimeMode = transportMode === 'MARITIME' || transportMode === 'MARITIME_EXPRESS'

  useEffect(() => {
    const price = calculateShippingPrice(transportMode, weight, cbm, companySettings)
    setCalculatedPrice(price)
  }, [transportMode, weight, cbm])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Calculateur de Tarification</h1>
        </div>
        <p className="text-gray-600">
          Interface principale de point de vente pour calculer les prix d'expédition.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Calculateur de Prix
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode de Transport
            </label>
            <select
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value as TransportMode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="AERIAL">Aérien</option>
              <option value="AERIAL_EXPRESS">Aérien Express</option>
              <option value="MARITIME">Maritime</option>
              <option value="MARITIME_EXPRESS">Maritime Express</option>
            </select>
          </div>

          {isAerialMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Plane className="inline h-4 w-4 mr-1" />
                Poids (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Entrez le poids en kg"
              />
            </div>
          )}

          {isMaritimeMode && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longueur (cm)
                  </label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Largeur (cm)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hauteur (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              {cbm && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-700">
                    <Ship className="inline h-4 w-4 mr-1" />
                    Volume calculé: {cbm.toFixed(4)} CBM
                  </p>
                </div>
              )}
            </>
          )}

          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Prix calculé:</span>
              <span className="text-2xl font-bold text-green-900">
                {calculatedPrice.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
