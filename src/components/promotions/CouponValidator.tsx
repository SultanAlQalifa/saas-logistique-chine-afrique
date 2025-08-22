'use client'

import { useState } from 'react'
import { Tag, Check, X, AlertCircle, Gift } from 'lucide-react'
import { PromotionEngine } from '@/utils/promotionEngine'
import { Coupon, DiscountApplication } from '@/types/promotions'
import { TransportMode } from '@prisma/client'

interface CouponValidatorProps {
  promotionEngine: PromotionEngine
  orderAmount: number
  userId: string
  transportMode?: TransportMode
  destination?: string
  clientType?: 'INDIVIDUAL' | 'BUSINESS'
  isFirstOrder?: boolean
  onCouponApplied?: (discount: DiscountApplication) => void
  onCouponRemoved?: () => void
}

export default function CouponValidator({
  promotionEngine,
  orderAmount,
  userId,
  transportMode,
  destination,
  clientType,
  isFirstOrder,
  onCouponApplied,
  onCouponRemoved
}: CouponValidatorProps) {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [discount, setDiscount] = useState<DiscountApplication | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validateAndApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Veuillez saisir un code coupon')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Valider le coupon
      const validation = promotionEngine.validateCoupon(
        couponCode,
        userId,
        orderAmount,
        transportMode,
        destination,
        clientType,
        isFirstOrder
      )

      if (!validation.valid || !validation.coupon) {
        setError(validation.error || 'Code coupon invalide')
        setLoading(false)
        return
      }

      // Calculer la réduction
      const discountCalculation = promotionEngine.calculateCouponDiscount(
        validation.coupon,
        orderAmount
      )

      setAppliedCoupon(validation.coupon)
      setDiscount(discountCalculation)
      setError(null)
      
      // Notifier le parent
      onCouponApplied?.(discountCalculation)

    } catch (err) {
      setError('Erreur lors de la validation du coupon')
      console.error('Coupon validation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setDiscount(null)
    setCouponCode('')
    setError(null)
    onCouponRemoved?.()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateAndApplyCoupon()
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-gray-900">Code Promo</h3>
      </div>

      {!appliedCoupon ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Saisissez votre code promo"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={validateAndApplyCoupon}
              disabled={loading || !couponCode.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Check className="h-4 w-4" />
              )}
              Appliquer
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Coupon appliqué */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">{appliedCoupon.name}</div>
                  <div className="text-sm text-green-700">{appliedCoupon.code}</div>
                </div>
              </div>
              <button
                onClick={removeCoupon}
                className="text-green-600 hover:text-green-800"
                title="Retirer le coupon"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {appliedCoupon.description && (
              <p className="text-sm text-green-700 mt-2">{appliedCoupon.description}</p>
            )}
          </div>

          {/* Détails de la réduction */}
          {discount && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Réduction appliquée:</span>
                <span className="font-semibold text-blue-900">
                  -{discount.discountAmount.toFixed(2)}€
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-blue-700">Montant final:</span>
                <span className="font-bold text-blue-900">
                  {discount.finalAmount.toFixed(2)}€
                </span>
              </div>

              {appliedCoupon.type === 'FREE_SHIPPING' && (
                <div className="mt-2 text-sm text-blue-700">
                  🚚 Livraison gratuite incluse
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Suggestions de coupons disponibles */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          💡 Coupons disponibles: WELCOME10, MARITIME50, FREESHIP
        </div>
      </div>
    </div>
  )
}
