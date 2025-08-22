'use client'

import { useState, useEffect } from 'react'
import { X, Gift, Clock, Zap, Percent } from 'lucide-react'
import { Coupon, FlashSale, SeasonalCampaign } from '@/types/promotions'

interface PromotionBannerProps {
  coupons?: Coupon[]
  flashSales?: FlashSale[]
  campaigns?: SeasonalCampaign[]
  onClose?: () => void
  position?: 'top' | 'bottom'
}

export default function PromotionBanner({
  coupons = [],
  flashSales = [],
  campaigns = [],
  onClose,
  position = 'top'
}: PromotionBannerProps) {
  const [currentPromo, setCurrentPromo] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Prioriser les flash sales actives
    const activeFlashSale = flashSales.find(fs => fs.status === 'ACTIVE')
    if (activeFlashSale) {
      setCurrentPromo({ type: 'flash-sale', data: activeFlashSale })
      return
    }

    // Puis les campagnes actives
    const activeCampaign = campaigns.find(c => {
      const now = new Date()
      return c.isActive && now >= c.startDate && now <= c.endDate
    })
    if (activeCampaign) {
      setCurrentPromo({ type: 'campaign', data: activeCampaign })
      return
    }

    // Enfin les coupons populaires
    const popularCoupon = coupons
      .filter(c => c.isActive && new Date() <= c.validTo)
      .sort((a, b) => b.usageCount - a.usageCount)[0]
    
    if (popularCoupon) {
      setCurrentPromo({ type: 'coupon', data: popularCoupon })
    }
  }, [coupons, flashSales, campaigns])

  useEffect(() => {
    if (currentPromo?.type === 'flash-sale') {
      const timer = setInterval(() => {
        const now = new Date()
        const endTime = new Date(currentPromo.data.endTime)
        const diff = endTime.getTime() - now.getTime()

        if (diff <= 0) {
          setTimeLeft('Terminé')
          clearInterval(timer)
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentPromo])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible || !currentPromo) return null

  const renderFlashSale = (flashSale: FlashSale) => (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-bold text-lg">FLASH SALE</span>
            </div>
            <div className="hidden md:block">
              <span className="text-lg">{flashSale.name}</span>
              <span className="ml-2 bg-white text-red-500 px-2 py-1 rounded-full text-sm font-bold">
                -{flashSale.discountValue}{flashSale.discountType === 'PERCENTAGE' ? '%' : '€'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black bg-opacity-20 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold">{timeLeft}</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )

  const renderCampaign = (campaign: SeasonalCampaign) => (
    <div 
      className="text-white"
      style={{ backgroundColor: campaign.backgroundColor, color: campaign.textColor }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Gift className="h-5 w-5" />
            <div>
              <span className="font-bold">{campaign.name}</span>
              <span className="ml-2 text-sm opacity-90">{campaign.description}</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="hover:opacity-70 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )

  const renderCoupon = (coupon: Coupon) => (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {coupon.type === 'PERCENTAGE' ? (
                <Percent className="h-5 w-5" />
              ) : (
                <Gift className="h-5 w-5" />
              )}
              <span className="font-bold">PROMO</span>
            </div>
            <div>
              <span>{coupon.name}</span>
              <span className="ml-2 bg-white text-blue-500 px-2 py-1 rounded-full text-sm font-bold">
                {coupon.code}
              </span>
            </div>
            {coupon.type !== 'FREE_SHIPPING' && (
              <span className="bg-black bg-opacity-20 px-2 py-1 rounded-full text-sm">
                {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `${coupon.value}€`} de réduction
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )

  const positionClasses = position === 'top' 
    ? 'fixed top-0 left-0 right-0 z-50' 
    : 'fixed bottom-0 left-0 right-0 z-50'

  return (
    <div className={positionClasses}>
      {currentPromo.type === 'flash-sale' && renderFlashSale(currentPromo.data)}
      {currentPromo.type === 'campaign' && renderCampaign(currentPromo.data)}
      {currentPromo.type === 'coupon' && renderCoupon(currentPromo.data)}
    </div>
  )
}
