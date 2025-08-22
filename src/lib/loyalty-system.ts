// Système de Fidélité Multi-niveaux NextMove Cargo
export interface LoyaltyTier {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  minPoints: number;
  maxPoints: number | null;
  color: string;
  benefits: LoyaltyBenefit[];
  multiplier: number;
  description: string;
  descriptionEn: string;
}

export interface LoyaltyBenefit {
  id: string;
  type: 'discount' | 'free_shipping' | 'priority_support' | 'exclusive_access' | 'bonus_points' | 'insurance' | 'storage';
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  value: number;
  unit: '%' | 'FCFA' | 'days' | 'kg' | 'times';
  icon: string;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'redeem' | 'expire' | 'bonus';
  points: number;
  reason: string;
  reasonEn: string;
  relatedOrderId?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface UserLoyalty {
  userId: string;
  currentPoints: number;
  totalEarnedPoints: number;
  currentTier: string;
  nextTier?: string;
  pointsToNextTier: number;
  memberSince: Date;
  lastActivity: Date;
  transactions: LoyaltyTransaction[];
  redeemedRewards: LoyaltyReward[];
}

export interface LoyaltyReward {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  pointsCost: number;
  type: 'discount_coupon' | 'free_shipping' | 'upgrade_service' | 'gift_card' | 'merchandise';
  value: number;
  unit: '%' | 'FCFA' | 'kg';
  icon: string;
  availability: number; // -1 pour illimité
  validityDays: number;
  minTier?: string;
  isActive: boolean;
}

// Configuration des niveaux de fidélité
export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Explorateur Bronze',
    nameEn: 'Bronze Explorer',
    icon: '🥉',
    minPoints: 0,
    maxPoints: 999,
    color: '#CD7F32',
    multiplier: 1,
    description: 'Bienvenue dans la famille NextMove ! Découvrez nos services de base.',
    descriptionEn: 'Welcome to the NextMove family! Discover our basic services.',
    benefits: [
      {
        id: 'bronze_points',
        type: 'bonus_points',
        title: 'Points de base',
        titleEn: 'Basic points',
        description: '1 point par 1000 FCFA dépensé',
        descriptionEn: '1 point per 1000 FCFA spent',
        value: 1,
        unit: 'times',
        icon: '⭐'
      },
      {
        id: 'bronze_support',
        type: 'priority_support',
        title: 'Support standard',
        titleEn: 'Standard support',
        description: 'Assistance client par email et chat',
        descriptionEn: 'Customer support via email and chat',
        value: 24,
        unit: 'days',
        icon: '📞'
      }
    ]
  },
  {
    id: 'silver',
    name: 'Navigateur Argent',
    nameEn: 'Silver Navigator',
    icon: '🥈',
    minPoints: 1000,
    maxPoints: 4999,
    color: '#C0C0C0',
    multiplier: 1.2,
    description: 'Vous naviguez avec style ! Profitez d\'avantages exclusifs.',
    descriptionEn: 'You navigate with style! Enjoy exclusive benefits.',
    benefits: [
      {
        id: 'silver_points',
        type: 'bonus_points',
        title: 'Points bonifiés',
        titleEn: 'Bonus points',
        description: '1.2 points par 1000 FCFA dépensé',
        descriptionEn: '1.2 points per 1000 FCFA spent',
        value: 1.2,
        unit: 'times',
        icon: '⭐'
      },
      {
        id: 'silver_discount',
        type: 'discount',
        title: 'Réduction fidélité',
        titleEn: 'Loyalty discount',
        description: '5% de réduction sur tous les envois',
        descriptionEn: '5% discount on all shipments',
        value: 5,
        unit: '%',
        icon: '💰'
      },
      {
        id: 'silver_support',
        type: 'priority_support',
        title: 'Support prioritaire',
        titleEn: 'Priority support',
        description: 'Réponse sous 12h garantie',
        descriptionEn: 'Response within 12h guaranteed',
        value: 12,
        unit: 'days',
        icon: '🚀'
      },
      {
        id: 'silver_storage',
        type: 'storage',
        title: 'Stockage gratuit',
        titleEn: 'Free storage',
        description: '7 jours de stockage gratuit en entrepôt',
        descriptionEn: '7 days free warehouse storage',
        value: 7,
        unit: 'days',
        icon: '📦'
      }
    ]
  },
  {
    id: 'gold',
    name: 'Capitaine Or',
    nameEn: 'Gold Captain',
    icon: '🥇',
    minPoints: 5000,
    maxPoints: 14999,
    color: '#FFD700',
    multiplier: 1.5,
    description: 'Vous êtes un vrai capitaine ! Accédez aux services premium.',
    descriptionEn: 'You are a true captain! Access premium services.',
    benefits: [
      {
        id: 'gold_points',
        type: 'bonus_points',
        title: 'Points premium',
        titleEn: 'Premium points',
        description: '1.5 points par 1000 FCFA dépensé',
        descriptionEn: '1.5 points per 1000 FCFA spent',
        value: 1.5,
        unit: 'times',
        icon: '⭐'
      },
      {
        id: 'gold_discount',
        type: 'discount',
        title: 'Réduction premium',
        titleEn: 'Premium discount',
        description: '10% de réduction sur tous les envois',
        descriptionEn: '10% discount on all shipments',
        value: 10,
        unit: '%',
        icon: '💰'
      },
      {
        id: 'gold_free_shipping',
        type: 'free_shipping',
        title: 'Livraison gratuite',
        titleEn: 'Free shipping',
        description: 'Livraison gratuite pour commandes > 50kg',
        descriptionEn: 'Free shipping for orders > 50kg',
        value: 50,
        unit: 'kg',
        icon: '🚚'
      },
      {
        id: 'gold_support',
        type: 'priority_support',
        title: 'Support VIP',
        titleEn: 'VIP support',
        description: 'Ligne directe + réponse sous 4h',
        descriptionEn: 'Direct line + response within 4h',
        value: 4,
        unit: 'days',
        icon: '👑'
      },
      {
        id: 'gold_insurance',
        type: 'insurance',
        title: 'Assurance étendue',
        titleEn: 'Extended insurance',
        description: 'Assurance gratuite jusqu\'à 500,000 FCFA',
        descriptionEn: 'Free insurance up to 500,000 FCFA',
        value: 500000,
        unit: 'FCFA',
        icon: '🛡️'
      },
      {
        id: 'gold_storage',
        type: 'storage',
        title: 'Stockage étendu',
        titleEn: 'Extended storage',
        description: '15 jours de stockage gratuit en entrepôt',
        descriptionEn: '15 days free warehouse storage',
        value: 15,
        unit: 'days',
        icon: '🏪'
      }
    ]
  },
  {
    id: 'platinum',
    name: 'Amiral Platine',
    nameEn: 'Platinum Admiral',
    icon: '💎',
    minPoints: 15000,
    maxPoints: null,
    color: '#E5E4E2',
    multiplier: 2,
    description: 'L\'excellence absolue ! Vous dirigez votre flotte avec maestria.',
    descriptionEn: 'Absolute excellence! You command your fleet with mastery.',
    benefits: [
      {
        id: 'platinum_points',
        type: 'bonus_points',
        title: 'Points élite',
        titleEn: 'Elite points',
        description: '2 points par 1000 FCFA dépensé',
        descriptionEn: '2 points per 1000 FCFA spent',
        value: 2,
        unit: 'times',
        icon: '⭐'
      },
      {
        id: 'platinum_discount',
        type: 'discount',
        title: 'Réduction élite',
        titleEn: 'Elite discount',
        description: '15% de réduction sur tous les envois',
        descriptionEn: '15% discount on all shipments',
        value: 15,
        unit: '%',
        icon: '💰'
      },
      {
        id: 'platinum_free_shipping',
        type: 'free_shipping',
        title: 'Livraison toujours gratuite',
        titleEn: 'Always free shipping',
        description: 'Livraison gratuite sans minimum',
        descriptionEn: 'Free shipping with no minimum',
        value: 0,
        unit: 'kg',
        icon: '🚚'
      },
      {
        id: 'platinum_support',
        type: 'priority_support',
        title: 'Concierge personnel',
        titleEn: 'Personal concierge',
        description: 'Gestionnaire dédié + réponse immédiate',
        descriptionEn: 'Dedicated manager + immediate response',
        value: 1,
        unit: 'days',
        icon: '🎩'
      },
      {
        id: 'platinum_exclusive',
        type: 'exclusive_access',
        title: 'Accès exclusif',
        titleEn: 'Exclusive access',
        description: 'Services premium et nouveautés en avant-première',
        descriptionEn: 'Premium services and early access to new features',
        value: 100,
        unit: '%',
        icon: '🌟'
      },
      {
        id: 'platinum_insurance',
        type: 'insurance',
        title: 'Assurance premium',
        titleEn: 'Premium insurance',
        description: 'Assurance gratuite jusqu\'à 2,000,000 FCFA',
        descriptionEn: 'Free insurance up to 2,000,000 FCFA',
        value: 2000000,
        unit: 'FCFA',
        icon: '🛡️'
      },
      {
        id: 'platinum_storage',
        type: 'storage',
        title: 'Stockage illimité',
        titleEn: 'Unlimited storage',
        description: '30 jours de stockage gratuit en entrepôt',
        descriptionEn: '30 days free warehouse storage',
        value: 30,
        unit: 'days',
        icon: '🏰'
      }
    ]
  }
];

// Récompenses disponibles
export const LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: 'discount_5',
    name: 'Bon de réduction 5%',
    nameEn: '5% Discount Coupon',
    description: '5% de réduction sur votre prochain envoi',
    descriptionEn: '5% discount on your next shipment',
    pointsCost: 500,
    type: 'discount_coupon',
    value: 5,
    unit: '%',
    icon: '🎫',
    availability: -1,
    validityDays: 30,
    isActive: true
  },
  {
    id: 'discount_10',
    name: 'Bon de réduction 10%',
    nameEn: '10% Discount Coupon',
    description: '10% de réduction sur votre prochain envoi',
    descriptionEn: '10% discount on your next shipment',
    pointsCost: 1000,
    type: 'discount_coupon',
    value: 10,
    unit: '%',
    icon: '🎫',
    availability: -1,
    validityDays: 30,
    minTier: 'silver',
    isActive: true
  },
  {
    id: 'free_shipping_small',
    name: 'Livraison gratuite (< 10kg)',
    nameEn: 'Free Shipping (< 10kg)',
    description: 'Livraison gratuite pour un colis de moins de 10kg',
    descriptionEn: 'Free shipping for a package under 10kg',
    pointsCost: 750,
    type: 'free_shipping',
    value: 10,
    unit: 'kg',
    icon: '📦',
    availability: -1,
    validityDays: 60,
    isActive: true
  },
  {
    id: 'upgrade_express',
    name: 'Upgrade Express',
    nameEn: 'Express Upgrade',
    description: 'Upgrade gratuit vers livraison express',
    descriptionEn: 'Free upgrade to express delivery',
    pointsCost: 1500,
    type: 'upgrade_service',
    value: 100,
    unit: '%',
    icon: '⚡',
    availability: -1,
    validityDays: 45,
    minTier: 'silver',
    isActive: true
  },
  {
    id: 'gift_card_25k',
    name: 'Carte cadeau 25,000 FCFA',
    nameEn: '25,000 FCFA Gift Card',
    description: 'Carte cadeau de 25,000 FCFA à utiliser sur NextMove',
    descriptionEn: '25,000 FCFA gift card to use on NextMove',
    pointsCost: 2500,
    type: 'gift_card',
    value: 25000,
    unit: 'FCFA',
    icon: '💳',
    availability: 100,
    validityDays: 365,
    minTier: 'gold',
    isActive: true
  },
  {
    id: 'merchandise_tshirt',
    name: 'T-shirt NextMove',
    nameEn: 'NextMove T-shirt',
    description: 'T-shirt officiel NextMove Cargo avec logo',
    descriptionEn: 'Official NextMove Cargo t-shirt with logo',
    pointsCost: 2000,
    type: 'merchandise',
    value: 15000,
    unit: 'FCFA',
    icon: '👕',
    availability: 50,
    validityDays: 90,
    minTier: 'gold',
    isActive: true
  }
];

export class LoyaltyService {
  private static instance: LoyaltyService;

  static getInstance(): LoyaltyService {
    if (!LoyaltyService.instance) {
      LoyaltyService.instance = new LoyaltyService();
    }
    return LoyaltyService.instance;
  }

  // Calculer les points gagnés pour un montant
  calculatePointsEarned(amount: number, userTier: string): number {
    const tier = LOYALTY_TIERS.find(t => t.id === userTier);
    const basePoints = Math.floor(amount / 1000); // 1 point par 1000 FCFA
    return Math.floor(basePoints * (tier?.multiplier || 1));
  }

  // Déterminer le niveau basé sur les points
  getTierByPoints(points: number): LoyaltyTier {
    for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
      const tier = LOYALTY_TIERS[i];
      if (points >= tier.minPoints) {
        return tier;
      }
    }
    return LOYALTY_TIERS[0]; // Bronze par défaut
  }

  // Calculer les points nécessaires pour le niveau suivant
  getPointsToNextTier(currentPoints: number): { nextTier: LoyaltyTier | null; pointsNeeded: number } {
    const currentTier = this.getTierByPoints(currentPoints);
    const currentIndex = LOYALTY_TIERS.findIndex(t => t.id === currentTier.id);
    
    if (currentIndex === LOYALTY_TIERS.length - 1) {
      return { nextTier: null, pointsNeeded: 0 }; // Déjà au niveau maximum
    }
    
    const nextTier = LOYALTY_TIERS[currentIndex + 1];
    const pointsNeeded = nextTier.minPoints - currentPoints;
    
    return { nextTier, pointsNeeded };
  }

  // Ajouter des points à un utilisateur
  async addPoints(userId: string, points: number, reason: string, orderId?: string): Promise<LoyaltyTransaction> {
    const transaction: LoyaltyTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'earn',
      points,
      reason,
      reasonEn: reason, // TODO: Traduire automatiquement
      relatedOrderId: orderId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Expire dans 1 an
    };

    // TODO: Sauvegarder en base de données
    console.log('Points ajoutés:', transaction);
    
    return transaction;
  }

  // Échanger des points contre une récompense
  async redeemReward(userId: string, rewardId: string): Promise<{ success: boolean; message: string; transaction?: LoyaltyTransaction }> {
    const reward = LOYALTY_REWARDS.find(r => r.id === rewardId);
    if (!reward) {
      return { success: false, message: 'Récompense introuvable' };
    }

    // TODO: Vérifier les points de l'utilisateur et son niveau
    // TODO: Vérifier la disponibilité de la récompense
    
    const transaction: LoyaltyTransaction = {
      id: `rdm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'redeem',
      points: -reward.pointsCost,
      reason: `Échange: ${reward.name}`,
      reasonEn: `Redeemed: ${reward.nameEn}`,
      createdAt: new Date()
    };

    // TODO: Sauvegarder en base de données
    console.log('Récompense échangée:', transaction);
    
    return { 
      success: true, 
      message: `Récompense "${reward.name}" échangée avec succès !`,
      transaction 
    };
  }

  // Obtenir le statut de fidélité d'un utilisateur
  async getUserLoyaltyStatus(userId: string): Promise<UserLoyalty> {
    // TODO: Récupérer depuis la base de données
    // Mock data pour démonstration
    const mockUser: UserLoyalty = {
      userId,
      currentPoints: 3500,
      totalEarnedPoints: 5200,
      currentTier: 'silver',
      nextTier: 'gold',
      pointsToNextTier: 1500,
      memberSince: new Date('2023-06-15'),
      lastActivity: new Date(),
      transactions: [],
      redeemedRewards: []
    };

    const { nextTier, pointsNeeded } = this.getPointsToNextTier(mockUser.currentPoints);
    mockUser.nextTier = nextTier?.id;
    mockUser.pointsToNextTier = pointsNeeded;

    return mockUser;
  }

  // Obtenir les récompenses disponibles pour un utilisateur
  getAvailableRewards(userTier: string): LoyaltyReward[] {
    const tierIndex = LOYALTY_TIERS.findIndex(t => t.id === userTier);
    
    return LOYALTY_REWARDS.filter(reward => {
      if (!reward.isActive) return false;
      if (reward.availability === 0) return false;
      
      if (reward.minTier) {
        const requiredTierIndex = LOYALTY_TIERS.findIndex(t => t.id === reward.minTier);
        return tierIndex >= requiredTierIndex;
      }
      
      return true;
    });
  }

  // Simuler l'ajout de points pour une commande
  async processOrderPoints(userId: string, orderAmount: number, orderId: string): Promise<LoyaltyTransaction> {
    const userStatus = await this.getUserLoyaltyStatus(userId);
    const pointsEarned = this.calculatePointsEarned(orderAmount, userStatus.currentTier);
    
    return this.addPoints(
      userId, 
      pointsEarned, 
      `Commande #${orderId} - ${orderAmount.toLocaleString()} FCFA`,
      orderId
    );
  }
}

export default LoyaltyService;
