'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Edit, 
  Eye, 
  Calendar, 
  Target, 
  DollarSign, 
  BarChart3, 
  Gift, 
  Copy, 
  Percent, 
  Users, 
  TrendingUp 
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import PaymentModal from '@/components/marketing/PaymentModal'
import { calculateMarketingCost, calculateTotalWithFees } from '@/lib/marketing-pricing'

export default function PromotionsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: 'Réduction Nouvel An Chinois',
      type: 'Pourcentage',
      discount: 25,
      code: 'CHINE2024',
      status: 'Actif',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      usageLimit: 1000,
      usageCount: 347,
      revenue: 125000,
      description: 'Promotion spéciale pour le Nouvel An Chinois',
      conditions: 'Commande minimum 50 000 FCFA',
      color: 'bg-green-500'
    },
    {
      id: 2,
      name: 'Transport Express Gratuit',
      type: 'Livraison gratuite',
      discount: 0,
      code: 'EXPRESSF',
      status: 'Actif',
      startDate: '2024-01-10',
      endDate: '2024-03-10',
      usageLimit: 500,
      usageCount: 234,
      revenue: 89000,
      description: 'Livraison express gratuite pour commandes importantes',
      conditions: 'Commande minimum 100 000 FCFA',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Fidélité Client Premium',
      type: 'Montant fixe',
      discount: 15000,
      code: 'PREMIUM15',
      status: 'Programmé',
      startDate: '2024-02-01',
      endDate: '2024-04-01',
      usageLimit: 200,
      usageCount: 0,
      revenue: 0,
      description: 'Réduction pour clients fidèles',
      conditions: 'Réservé aux clients Premium',
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      name: 'Première Commande',
      type: 'Pourcentage',
      discount: 15,
      code: 'BIENVENUE',
      status: 'Actif',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: null,
      usageCount: 156,
      revenue: 67500,
      description: 'Réduction pour nouveaux clients',
      conditions: 'Première commande uniquement',
      color: 'bg-purple-500'
    },
    {
      id: 5,
      name: 'Cargo Maritime Économique',
      type: 'Pourcentage',
      discount: 20,
      code: 'MARITIME20',
      status: 'En pause',
      startDate: '2024-01-05',
      endDate: '2024-02-05',
      usageLimit: 300,
      usageCount: 89,
      revenue: 45000,
      description: 'Promotion transport maritime',
      conditions: 'Transport maritime uniquement',
      color: 'bg-orange-500'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<any>(null)

  // Event handlers for button functionality
  const handleCreatePromotion = () => {
    const baseCost = calculateMarketingCost('promotion', 14)
    const totalCost = calculateTotalWithFees(baseCost)
    
    setSelectedOperation({
      type: 'promotion',
      name: 'Nouvelle Promotion',
      cost: totalCost.total,
      duration: 14,
      description: 'Promotion avec mise en avant et notifications push'
    })
    setShowPaymentModal(true)
  }

  const handleConfirmPayment = () => {
    alert('Promotion créée avec succès ! Paiement confirmé.')
    setShowPaymentModal(false)
    setSelectedOperation(null)
  }

  const handlePausePromotion = (promotionId: number) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === promotionId 
        ? { ...promo, status: 'En pause' }
        : promo
    ))
    alert(`Promotion ${promotionId} mise en pause`)
  }

  const handleActivatePromotion = (promotionId: number) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === promotionId 
        ? { ...promo, status: 'Actif' }
        : promo
    ))
    alert(`Promotion ${promotionId} activée`)
  }

  const handleDuplicatePromotion = (promotionId: number) => {
    const originalPromo = promotions.find(p => p.id === promotionId)
    if (originalPromo) {
      const newPromo = {
        ...originalPromo,
        id: Math.max(...promotions.map(p => p.id)) + 1,
        name: `${originalPromo.name} (Copie)`,
        code: `${originalPromo.code}_COPY`,
        status: 'Brouillon',
        usageCount: 0,
        revenue: 0
      }
      setPromotions(prev => [...prev, newPromo])
      alert(`Promotion ${promotionId} dupliquée`)
    }
  }

  const handleEditPromotion = (promotionId: number) => {
    alert(`Redirection vers l'édition de la promotion ${promotionId}`)
  }

  const handleViewPromotion = (promotionId: number) => {
    alert(`Affichage des détails de la promotion ${promotionId}`)
  }

  const filteredPromotions = promotions.filter(promo => {
    const typeMatch = selectedType === 'all' || promo.type === selectedType
    const searchMatch = searchTerm === '' || 
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase())
    return typeMatch && searchMatch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Pourcentage': return <Percent className="h-4 w-4" />
      case 'Montant fixe': return <DollarSign className="h-4 w-4" />
      case 'Livraison gratuite': return <Gift className="h-4 w-4" />
      default: return <Gift className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-500'
      case 'Programmé': return 'bg-yellow-500'
      case 'En pause': return 'bg-orange-500'
      case 'Expiré': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDiscount = (type: string, discount: number) => {
    switch (type) {
      case 'Pourcentage': return `${discount}%`
      case 'Montant fixe': return `${discount.toLocaleString('fr-FR')} FCFA`
      case 'Livraison gratuite': return 'Gratuit'
      default: return `${discount}%`
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Promotions</h1>
            <p className="text-purple-100 text-lg">
              Offres et réductions spéciales
            </p>
          </div>
          <Button 
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
            size="lg"
            onClick={handleCreatePromotion}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Promotion
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Promotions Actives</p>
                <p className="text-2xl font-bold text-green-900">
                  {promotions.filter(p => p.status === 'Actif').length}
                </p>
              </div>
              <Gift className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Utilisations Totales</p>
                <p className="text-2xl font-bold text-blue-900">
                  {promotions.reduce((sum, p) => sum + p.usageCount, 0).toLocaleString('fr-FR')}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Revenus Générés</p>
                <p className="text-2xl font-bold text-purple-900">
                  {promotions.reduce((sum, p) => sum + p.revenue, 0).toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Taux d'Utilisation</p>
                <p className="text-2xl font-bold text-orange-900">
                  {Math.round((promotions.reduce((sum, p) => sum + p.usageCount, 0) / 
                    promotions.reduce((sum, p) => sum + (p.usageLimit || 1000), 0)) * 100)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher une promotion..."
              className="border rounded-lg px-3 py-2 text-sm w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Tous les types</option>
              <option value="Pourcentage">Pourcentage</option>
              <option value="Montant fixe">Montant fixe</option>
              <option value="Livraison gratuite">Livraison gratuite</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          {filteredPromotions.length} promotion(s) trouvée(s)
        </div>
      </div>

      {/* Liste des promotions */}
      <div className="grid gap-6">
        {filteredPromotions.map((promotion) => (
          <Card key={promotion.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(promotion.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{promotion.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(promotion.status)}>
                        {promotion.status}
                      </Badge>
                      <span>•</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                        {promotion.code}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-green-600">
                        {formatDiscount(promotion.type, promotion.discount)}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {promotion.status === 'Actif' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePausePromotion(promotion.id)}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  {promotion.status === 'En pause' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleActivatePromotion(promotion.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Activer
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicatePromotion(promotion.id)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Dupliquer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditPromotion(promotion.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewPromotion(promotion.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{promotion.description}</p>
                  
                  <h4 className="font-medium mt-4 mb-2">Conditions</h4>
                  <p className="text-gray-600 text-sm">{promotion.conditions}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {promotion.usageCount.toLocaleString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-500">Utilisations</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {promotion.usageLimit ? promotion.usageLimit.toLocaleString('fr-FR') : '∞'}
                    </div>
                    <div className="text-xs text-gray-500">Limite</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {promotion.revenue.toLocaleString('fr-FR')} FCFA
                    </div>
                    <div className="text-xs text-gray-500">Revenus</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {promotion.usageLimit ? 
                        Math.round((promotion.usageCount / promotion.usageLimit) * 100) : 
                        0}%
                    </div>
                    <div className="text-xs text-gray-500">Taux d'usage</div>
                  </div>
                </div>
              </div>
              
              {/* Barre de progression */}
              {promotion.usageLimit && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span>{promotion.usageCount} / {promotion.usageLimit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(promotion.usageCount / promotion.usageLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Dates */}
              <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Du {promotion.startDate} au {promotion.endDate}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  ID: {promotion.id}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12">
          <Gift className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune promotion trouvée</h3>
          <p className="text-gray-500 mb-4">
            Aucune promotion ne correspond à vos critères de recherche.
          </p>
          <Button onClick={handleCreatePromotion}>
            <Plus className="h-4 w-4 mr-2" />
            Créer votre première promotion
          </Button>
        </div>
      )}

      {/* Modal de paiement */}
      {selectedOperation && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedOperation(null)
          }}
          onConfirm={handleConfirmPayment}
          operation={selectedOperation}
        />
      )}
    </div>
  )
}
