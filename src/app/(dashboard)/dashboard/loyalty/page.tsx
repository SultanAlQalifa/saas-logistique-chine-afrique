'use client'

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Gift, 
  TrendingUp, 
  Award, 
  Zap,
  Package,
  Shield,
  Clock,
  Users,
  Target,
  Sparkles
} from 'lucide-react';
import { LoyaltyService, LOYALTY_TIERS, LOYALTY_REWARDS, UserLoyalty, LoyaltyTier, LoyaltyReward } from '@/lib/loyalty-system';

export default function LoyaltyPage() {
  const [userLoyalty, setUserLoyalty] = useState<UserLoyalty | null>(null);
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rewards' | 'history'>('overview');
  const [loading, setLoading] = useState(true);

  const loyaltyService = LoyaltyService.getInstance();

  useEffect(() => {
    loadUserLoyalty();
  }, []);

  const loadUserLoyalty = async () => {
    try {
      // Simuler un utilisateur connecté
      const userId = 'user_123';
      const loyalty = await loyaltyService.getUserLoyaltyStatus(userId);
      const rewards = loyaltyService.getAvailableRewards(loyalty.currentTier);
      
      setUserLoyalty(loyalty);
      setAvailableRewards(rewards);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    if (!userLoyalty) return;

    try {
      const result = await loyaltyService.redeemReward(userLoyalty.userId, rewardId);
      if (result.success) {
        alert(result.message);
        loadUserLoyalty(); // Recharger les données
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'échange:', error);
      alert('Erreur lors de l\'échange de la récompense');
    }
  };

  const getCurrentTier = (): LoyaltyTier => {
    return LOYALTY_TIERS.find(tier => tier.id === userLoyalty?.currentTier) || LOYALTY_TIERS[0];
  };

  const getNextTier = (): LoyaltyTier | null => {
    if (!userLoyalty?.nextTier) return null;
    return LOYALTY_TIERS.find(tier => tier.id === userLoyalty.nextTier) || null;
  };

  const getProgressPercentage = (): number => {
    if (!userLoyalty) return 0;
    const currentTier = getCurrentTier();
    const nextTier = getNextTier();
    
    if (!nextTier) return 100; // Niveau maximum atteint
    
    const currentProgress = userLoyalty.currentPoints - currentTier.minPoints;
    const totalNeeded = nextTier.minPoints - currentTier.minPoints;
    
    return Math.min((currentProgress / totalNeeded) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre programme de fidélité...</p>
        </div>
      </div>
    );
  }

  if (!userLoyalty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Impossible de charger vos données de fidélité</p>
        </div>
      </div>
    );
  }

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-purple-700 to-pink-700 rounded-xl text-white">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Programme de Fidélité</h1>
              <p className="text-gray-600">Gagnez des points et débloquez des avantages exclusifs</p>
            </div>
          </div>
        </div>

        {/* Statut actuel */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Niveau actuel */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div 
                  className="text-4xl p-4 rounded-full"
                  style={{ backgroundColor: `${currentTier.color}20`, color: currentTier.color }}
                >
                  {currentTier.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentTier.name}</h2>
                  <p className="text-gray-600">{currentTier.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">{userLoyalty.currentPoints.toLocaleString()}</div>
                  <div className="text-sm text-purple-600">Points actuels</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-pink-700">{userLoyalty.totalEarnedPoints.toLocaleString()}</div>
                  <div className="text-sm text-pink-600">Total gagné</div>
                </div>
              </div>
            </div>

            {/* Progression vers le niveau suivant */}
            <div className="lg:col-span-2">
              {nextTier ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Progression vers {nextTier.name}</h3>
                    <span className="text-sm text-gray-600">
                      {userLoyalty.pointsToNextTier.toLocaleString()} points restants
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-purple-700 to-pink-700 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{currentTier.name}</span>
                    <span>{Math.round(getProgressPercentage())}%</span>
                    <span>{nextTier.name} {nextTier.icon}</span>
                  </div>
                  
                  {/* Aperçu des avantages du niveau suivant */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Avantages du niveau {nextTier.name} :</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {nextTier.benefits.slice(0, 4).map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <span>{benefit.icon}</span>
                          <span>{benefit.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Niveau Maximum Atteint !</h3>
                  <p className="text-gray-600">Félicitations ! Vous avez atteint le niveau le plus élevé de notre programme de fidélité.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`px-6 py-4 text-sm font-medium ${
                  selectedTab === 'overview'
                    ? 'border-b-2 border-purple-700 text-purple-700 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Trophy className="h-4 w-4 inline mr-2" />
                Vue d'ensemble
              </button>
              <button
                onClick={() => setSelectedTab('rewards')}
                className={`px-6 py-4 text-sm font-medium ${
                  selectedTab === 'rewards'
                    ? 'border-b-2 border-purple-700 text-purple-700 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Gift className="h-4 w-4 inline mr-2" />
                Récompenses ({availableRewards.length})
              </button>
              <button
                onClick={() => setSelectedTab('history')}
                className={`px-6 py-4 text-sm font-medium ${
                  selectedTab === 'history'
                    ? 'border-b-2 border-purple-700 text-purple-700 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Clock className="h-4 w-4 inline mr-2" />
                Historique
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Onglet Vue d'ensemble */}
            {selectedTab === 'overview' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Vos Avantages Actuels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentTier.benefits.map((benefit, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{benefit.icon}</span>
                        <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                      </div>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {benefit.value} {benefit.unit === 'times' ? 'x' : benefit.unit}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tous les niveaux */}
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Tous les Niveaux</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {LOYALTY_TIERS.map((tier, index) => (
                      <div 
                        key={tier.id}
                        className={`rounded-xl p-6 border-2 transition-all ${
                          tier.id === currentTier.id
                            ? 'border-purple-300 bg-purple-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div 
                            className="text-4xl mb-3 p-3 rounded-full inline-block"
                            style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                          >
                            {tier.icon}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">{tier.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                          <div className="text-xs text-gray-500">
                            {tier.minPoints.toLocaleString()} - {tier.maxPoints ? tier.maxPoints.toLocaleString() : '∞'} points
                          </div>
                          <div className="mt-3 text-xs font-medium text-purple-600">
                            {tier.multiplier}x points
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Récompenses */}
            {selectedTab === 'rewards' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Récompenses Disponibles</h3>
                  <div className="text-sm text-gray-600">
                    Vous avez <span className="font-bold text-purple-700">{userLoyalty.currentPoints.toLocaleString()}</span> points
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableRewards.map((reward) => (
                    <div key={reward.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{reward.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                          <p className="text-sm text-gray-600">{reward.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-bold text-purple-700">
                          {reward.pointsCost.toLocaleString()} points
                        </div>
                        <div className="text-sm text-gray-500">
                          Valide {reward.validityDays} jours
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRedeemReward(reward.id)}
                        disabled={userLoyalty.currentPoints < reward.pointsCost}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          userLoyalty.currentPoints >= reward.pointsCost
                            ? 'bg-gradient-to-r from-purple-700 to-pink-700 text-white hover:from-purple-800 hover:to-pink-800'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {userLoyalty.currentPoints >= reward.pointsCost ? 'Échanger' : 'Points insuffisants'}
                      </button>
                      
                      {reward.availability > 0 && (
                        <div className="mt-2 text-xs text-orange-600 text-center">
                          Plus que {reward.availability} disponibles
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Historique */}
            {selectedTab === 'history' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Historique des Points</h3>
                
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-700">{userLoyalty.totalEarnedPoints.toLocaleString()}</div>
                    <div className="text-sm text-purple-600">Total gagné</div>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-pink-700">{userLoyalty.currentPoints.toLocaleString()}</div>
                    <div className="text-sm text-pink-600">Points actuels</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">{userLoyalty.redeemedRewards.length}</div>
                    <div className="text-sm text-green-600">Récompenses</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {Math.floor((Date.now() - userLoyalty.memberSince.getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-blue-600">Jours membre</div>
                  </div>
                </div>

                {/* Transactions récentes (simulées) */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Transactions Récentes</h4>
                  <div className="space-y-3">
                    {[
                      { type: 'earn', points: 150, reason: 'Commande #NMC-2024-001 - 150,000 FCFA', date: '2024-01-15' },
                      { type: 'earn', points: 75, reason: 'Commande #NMC-2024-002 - 75,000 FCFA', date: '2024-01-10' },
                      { type: 'redeem', points: -500, reason: 'Échange: Bon de réduction 5%', date: '2024-01-08' },
                      { type: 'earn', points: 200, reason: 'Commande #NMC-2024-003 - 200,000 FCFA', date: '2024-01-05' },
                      { type: 'bonus', points: 100, reason: 'Bonus de bienvenue', date: '2024-01-01' }
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'earn' ? 'bg-green-100 text-green-600' :
                            transaction.type === 'redeem' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {transaction.type === 'earn' ? <TrendingUp className="h-4 w-4" /> :
                             transaction.type === 'redeem' ? <Gift className="h-4 w-4" /> :
                             <Star className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{transaction.reason}</div>
                            <div className="text-sm text-gray-500">{transaction.date}</div>
                          </div>
                        </div>
                        <div className={`font-bold ${
                          transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
