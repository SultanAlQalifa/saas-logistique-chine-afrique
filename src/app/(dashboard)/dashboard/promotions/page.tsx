'use client'

import { useState, useEffect } from 'react'
import { 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Calendar,
  Users,
  TrendingUp,
  Percent,
  Tag,
  Zap,
  Clock,
  Target
} from 'lucide-react'
import { Coupon, Promotion, FlashSale, SeasonalCampaign } from '@/types/promotions'
import { PromotionEngine } from '@/utils/promotionEngine'

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState<'coupons' | 'promotions' | 'flash-sales' | 'campaigns'>('coupons')
  const [promotionEngine, setPromotionEngine] = useState<PromotionEngine | null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [flashSales, setFlashSales] = useState<FlashSale[]>([])
  const [campaigns, setCampaigns] = useState<SeasonalCampaign[]>([])
  const [loading, setLoading] = useState(true)

  // États pour les modales
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [showPromotionForm, setShowPromotionForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

  // Formulaire de coupon
  const [couponForm, setCouponForm] = useState({
    code: '',
    name: '',
    description: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING',
    value: 0,
    minimumAmount: 0,
    maximumDiscount: 0,
    usageLimit: 0,
    validFrom: '',
    validTo: '',
    applicableTransportModes: [] as string[],
    firstTimeOnly: false
  })

  useEffect(() => {
    // Initialiser avec des données mock
    const mockCoupons: Coupon[] = [
      {
        id: '1',
        code: 'WELCOME10',
        name: 'Bienvenue 10%',
        description: '10% de réduction pour les nouveaux clients',
        type: 'PERCENTAGE',
        value: 10,
        minimumAmount: 50,
        maximumDiscount: 100,
        usageLimit: 1000,
        usageCount: 245,
        firstTimeOnly: true,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        code: 'MARITIME50',
        name: 'Maritime -50€',
        description: '50€ de réduction sur le transport maritime',
        type: 'FIXED_AMOUNT',
        value: 50,
        minimumAmount: 200,
        usageLimit: 500,
        usageCount: 89,
        applicableTransportModes: ['MARITIME', 'MARITIME_EXPRESS'],
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-06-30'),
        isActive: true,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        code: 'FREESHIP',
        name: 'Livraison Gratuite',
        description: 'Livraison gratuite pour commandes +100€',
        type: 'FREE_SHIPPING',
        value: 0,
        minimumAmount: 100,
        usageLimit: 2000,
        usageCount: 567,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const mockFlashSales: FlashSale[] = [
      {
        id: '1',
        name: 'Flash Sale Aérien',
        description: '20% sur tous les envois aériens pendant 2h',
        startTime: new Date(Date.now() + 3600000), // Dans 1h
        endTime: new Date(Date.now() + 10800000), // Dans 3h
        duration: 120,
        discountType: 'PERCENTAGE',
        discountValue: 20,
        maxUsages: 100,
        currentUsages: 0,
        minimumAmount: 50,
        status: 'SCHEDULED',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    setCoupons(mockCoupons)
    setFlashSales(mockFlashSales)
    
    const engine = new PromotionEngine(mockCoupons, [])
    setPromotionEngine(engine)
    setLoading(false)
  }, [])

  const handleCreateCoupon = () => {
    if (!couponForm.code || !couponForm.name) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: couponForm.code.toUpperCase(),
      name: couponForm.name,
      description: couponForm.description,
      type: couponForm.type,
      value: couponForm.value,
      minimumAmount: couponForm.minimumAmount || undefined,
      maximumDiscount: couponForm.maximumDiscount || undefined,
      usageLimit: couponForm.usageLimit || undefined,
      usageCount: 0,
      firstTimeOnly: couponForm.firstTimeOnly,
      applicableTransportModes: couponForm.applicableTransportModes.length > 0 
        ? couponForm.applicableTransportModes as any 
        : undefined,
      validFrom: new Date(couponForm.validFrom),
      validTo: new Date(couponForm.validTo),
      isActive: true,
      createdBy: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setCoupons([...coupons, newCoupon])
    promotionEngine?.addCoupon(newCoupon)
    setShowCouponForm(false)
    resetCouponForm()
  }

  const resetCouponForm = () => {
    setCouponForm({
      code: '',
      name: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      minimumAmount: 0,
      maximumDiscount: 0,
      usageLimit: 0,
      validFrom: '',
      validTo: '',
      applicableTransportModes: [],
      firstTimeOnly: false
    })
  }

  const generateCouponCode = () => {
    const code = PromotionEngine.generateCouponCode('PROMO', 6)
    setCouponForm({ ...couponForm, code })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PERCENTAGE': return <Percent className="h-4 w-4" />
      case 'FIXED_AMOUNT': return <Tag className="h-4 w-4" />
      case 'FREE_SHIPPING': return <Gift className="h-4 w-4" />
      default: return <Gift className="h-4 w-4" />
    }
  }

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date()
    if (!coupon.isActive) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactif</span>
    }
    if (now < coupon.validFrom) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Programmé</span>
    }
    if (now > coupon.validTo) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Expiré</span>
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Épuisé</span>
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Actif</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gift className="h-7 w-7 text-blue-600" />
            Promotions & Coupons
          </h1>
          <p className="text-gray-600">Gérez vos codes promo, réductions et campagnes marketing</p>
        </div>
        <button
          onClick={() => setShowCouponForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200"
        >
          <Plus className="h-4 w-4" />
          Nouveau Coupon
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coupons Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{coupons.filter(c => c.isActive).length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisations Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {coupons.reduce((sum, c) => sum + c.usageCount, 0)}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux d'Utilisation</p>
              <p className="text-2xl font-bold text-gray-900">
                {coupons.length > 0 
                  ? Math.round((coupons.reduce((sum, c) => sum + c.usageCount, 0) / 
                      coupons.reduce((sum, c) => sum + (c.usageLimit || 1000), 0)) * 100)
                  : 0}%
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Flash Sales</p>
              <p className="text-2xl font-bold text-gray-900">{flashSales.filter(f => f.isActive).length}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'coupons', label: 'Codes Promo', icon: Tag },
            { id: 'promotions', label: 'Promotions Auto', icon: Target },
            { id: 'flash-sales', label: 'Flash Sales', icon: Zap },
            { id: 'campaigns', label: 'Campagnes', icon: Calendar }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des tabs */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Codes de Réduction</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(coupon.type)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                          <div className="text-sm text-gray-500">{coupon.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.type === 'PERCENTAGE' ? 'bg-blue-100 text-blue-800' :
                        coupon.type === 'FIXED_AMOUNT' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {coupon.type === 'PERCENTAGE' ? 'Pourcentage' :
                         coupon.type === 'FIXED_AMOUNT' ? 'Montant Fixe' :
                         'Livraison Gratuite'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` :
                       coupon.type === 'FIXED_AMOUNT' ? `${coupon.value}€` :
                       'Gratuit'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.usageCount} / {coupon.usageLimit || '∞'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.validFrom.toLocaleDateString('fr-FR')} - {coupon.validTo.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(coupon)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(coupon.code)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Copier le code"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCoupon(coupon)
                          setShowCouponForm(true)
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'flash-sales' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Flash Sales</h3>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Nouvelle Flash Sale
            </button>
          </div>

          <div className="space-y-4">
            {flashSales.map((sale) => (
              <div key={sale.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{sale.name}</h4>
                    <p className="text-sm text-gray-600">{sale.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {sale.duration} minutes
                      </span>
                      <span>
                        {sale.discountType === 'PERCENTAGE' ? `${sale.discountValue}%` : `${sale.discountValue}€`}
                      </span>
                      <span>
                        {sale.currentUsages} / {sale.maxUsages || '∞'} utilisations
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      sale.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      sale.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sale.status === 'ACTIVE' ? 'En cours' :
                       sale.status === 'SCHEDULED' ? 'Programmé' :
                       'Terminé'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de création/édition de coupon */}
      {showCouponForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCoupon ? 'Modifier le Coupon' : 'Nouveau Coupon'}
              </h3>
              <button
                onClick={() => {
                  setShowCouponForm(false)
                  setEditingCoupon(null)
                  resetCouponForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code Coupon *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="PROMO2024"
                    />
                    <button
                      onClick={generateCouponCode}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                      title="Générer un code"
                    >
                      🎲
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du Coupon *
                  </label>
                  <input
                    type="text"
                    value={couponForm.name}
                    onChange={(e) => setCouponForm({ ...couponForm, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Promotion de bienvenue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Description de la promotion..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de Réduction
                  </label>
                  <select
                    value={couponForm.type}
                    onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PERCENTAGE">Pourcentage</option>
                    <option value="FIXED_AMOUNT">Montant Fixe</option>
                    <option value="FREE_SHIPPING">Livraison Gratuite</option>
                  </select>
                </div>

                {couponForm.type !== 'FREE_SHIPPING' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valeur {couponForm.type === 'PERCENTAGE' ? '(%)' : '(€)'}
                    </label>
                    <input
                      type="number"
                      value={couponForm.value}
                      onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step={couponForm.type === 'PERCENTAGE' ? '1' : '0.01'}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Début
                  </label>
                  <input
                    type="datetime-local"
                    value={couponForm.validFrom}
                    onChange={(e) => setCouponForm({ ...couponForm, validFrom: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Fin
                  </label>
                  <input
                    type="datetime-local"
                    value={couponForm.validTo}
                    onChange={(e) => setCouponForm({ ...couponForm, validTo: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={couponForm.firstTimeOnly}
                    onChange={(e) => setCouponForm({ ...couponForm, firstTimeOnly: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Réservé aux nouveaux clients</span>
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCouponForm(false)
                    setEditingCoupon(null)
                    resetCouponForm()
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateCoupon}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingCoupon ? 'Modifier' : 'Créer'} le Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
