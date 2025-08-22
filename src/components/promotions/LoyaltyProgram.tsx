'use client'

import { useState } from 'react'
import { Star, Award, Gift, TrendingUp, Crown, Shield, Gem } from 'lucide-react'
import { LoyaltyProgram, LoyaltyTier, CustomerLoyalty } from '@/types/promotions'

interface LoyaltyProgramProps {
  program: LoyaltyProgram
  customerLoyalty: CustomerLoyalty
  onRedeemPoints?: (points: number, reward: string) => void
}

export default function LoyaltyProgramComponent({
  program,
  customerLoyalty,
  onRedeemPoints
}: LoyaltyProgramProps) {
  const [selectedReward, setSelectedReward] = useState<string | null>(null)

  const currentTier = program.tiers.find(tier => tier.id === customerLoyalty.currentTier)
  const nextTier = program.tiers.find(tier => 
    tier.minPoints > customerLoyalty.currentPoints
  )

  const getTierIcon = (tier: LoyaltyTier) => {
    switch (tier.name.toLowerCase()) {
      case 'bronze':
        return <Award className="h-5 w-5" style={{ color: '#CD7F32' }} />
      case 'silver':
      case 'argent':
        return <Shield className="h-5 w-5" style={{ color: '#C0C0C0' }} />
      case 'gold':
      case 'or':
        return <Crown className="h-5 w-5" style={{ color: '#FFD700' }} />
      case 'platinum':
      case 'platine':
        return <Gem className="h-5 w-5" style={{ color: '#E5E4E2' }} />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  const progressToNextTier = nextTier 
    ? ((customerLoyalty.currentPoints - (currentTier?.minPoints || 0)) / 
       (nextTier.minPoints - (currentTier?.minPoints || 0))) * 100
    : 100

  const availableRewards = [
    { id: 'discount-5', name: '5% de réduction', points: 500, type: 'discount' },
    { id: 'discount-10', name: '10% de réduction', points: 1000, type: 'discount' },
    { id: 'free-shipping', name: 'Livraison gratuite', points: 300, type: 'shipping' },
    { id: 'priority-support', name: 'Support prioritaire', points: 800, type: 'service' },
    { id: 'upgrade-transport', name: 'Upgrade transport gratuit', points: 1200, type: 'upgrade' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Star className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
          <p className="text-sm text-gray-600">{program.description}</p>
        </div>
      </div>

      {/* Statut actuel */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {currentTier && getTierIcon(currentTier)}
            <span className="font-semibold text-gray-900">
              {currentTier?.name || 'Membre'}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {customerLoyalty.currentPoints.toLocaleString('fr-FR')}
            </div>
            <div className="text-sm text-gray-600">points</div>
          </div>
        </div>

        {/* Progression vers le niveau suivant */}
        {nextTier && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progression vers {nextTier.name}</span>
              <span>
                {nextTier.minPoints - customerLoyalty.currentPoints} points restants
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Avantages du niveau actuel */}
      {currentTier && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Vos avantages actuels</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentTier.benefits.discountPercentage && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 text-green-500" />
                {currentTier.benefits.discountPercentage}% de réduction automatique
              </div>
            )}
            {currentTier.benefits.freeShippingThreshold && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Gift className="h-4 w-4 text-blue-500" />
                Livraison gratuite dès {currentTier.benefits.freeShippingThreshold}€
              </div>
            )}
            {currentTier.benefits.prioritySupport && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-purple-500" />
                Support client prioritaire
              </div>
            )}
            {currentTier.benefits.exclusiveOffers && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-500" />
                Offres exclusives
              </div>
            )}
          </div>
        </div>
      )}

      {/* Récompenses disponibles */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Échanger vos points</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableRewards.map((reward) => (
            <div
              key={reward.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                customerLoyalty.currentPoints >= reward.points
                  ? 'border-purple-200 hover:border-purple-300 hover:bg-purple-50'
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
              onClick={() => {
                if (customerLoyalty.currentPoints >= reward.points) {
                  setSelectedReward(reward.id)
                  onRedeemPoints?.(reward.points, reward.name)
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{reward.name}</div>
                  <div className="text-sm text-gray-600">{reward.points} points</div>
                </div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  customerLoyalty.currentPoints >= reward.points
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <Gift className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historique récent des points */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Historique récent</h4>
        <div className="space-y-2">
          {customerLoyalty.pointsHistory.slice(0, 3).map((history) => (
            <div key={history.id} className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-900">{history.description}</span>
                <span className="text-gray-500 ml-2">
                  {history.date.toLocaleDateString('fr-FR')}
                </span>
              </div>
              <span className={`font-medium ${
                history.type === 'EARNED' ? 'text-green-600' : 'text-red-600'
              }`}>
                {history.type === 'EARNED' ? '+' : '-'}{history.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Informations sur le programme */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Taux de conversion:</span>
            <span>{program.pointsPerEuro} points par euro dépensé</span>
          </div>
          {program.pointsExpiration && (
            <div className="flex justify-between mt-1">
              <span>Expiration des points:</span>
              <span>{program.pointsExpiration} jours</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
