'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { Package, Search, Filter, Eye, CheckCircle, X, Clock, AlertTriangle, MapPin, User, Calendar, DollarSign, Settings, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import OrderAcceptanceModal from '@/components/ui/order-acceptance-modal'
import BillingInvoiceModal from '@/components/ui/billing-invoice-modal'

// Mock data for orders
const mockOrders = [
  {
    id: '1',
    trackingNumber: 'NMC-2024-001',
    clientName: 'Amadou Diallo',
    clientEmail: 'amadou.diallo@email.com',
    clientPhone: '+221 77 123 45 67',
    companyName: 'Import Export Diallo',
    description: 'Équipements électroniques - Smartphones et accessoires',
    weight: 25.5,
    dimensions: { length: 60, width: 40, height: 30 },
    origin: {
      country: 'Chine',
      city: 'Shanghai',
      address: '123 Industrial Zone, Pudong District'
    },
    destination: {
      country: 'Sénégal',
      city: 'Dakar',
      address: '456 Avenue Bourguiba, Plateau'
    },
    estimatedPrice: 125000,
    finalPrice: 135000,
    requestedDate: '2024-01-15',
    estimatedDelivery: '2024-02-15',
    urgency: 'express' as const,
    status: 'pending' as const,
    paymentMethod: 'online' as const,
    specialInstructions: 'Fragile - Manipuler avec précaution',
    submittedAt: '2024-01-10T10:30:00Z',
    acceptedAt: '2024-01-11T14:20:00Z',
    notes: 'Client VIP - Livraison prioritaire'
  },
  {
    id: '2',
    trackingNumber: 'NMC-2024-002',
    clientName: 'Fatou Sall',
    clientEmail: 'fatou.sall@gmail.com',
    clientPhone: '+221 76 987 65 43',
    description: 'Vêtements et textiles - Collection mode',
    weight: 15.2,
    dimensions: { length: 80, width: 50, height: 25 },
    origin: {
      country: 'Chine',
      city: 'Guangzhou',
      address: '789 Textile Market, Baiyun District'
    },
    destination: {
      country: 'Sénégal',
      city: 'Thiès',
      address: '321 Rue de la République'
    },
    estimatedPrice: 85000,
    requestedDate: '2024-01-12',
    urgency: 'standard' as const,
    status: 'pending' as const,
    submittedAt: '2024-01-12T09:15:00Z'
  },
  {
    id: '3',
    trackingNumber: 'NMC-2024-003',
    clientName: 'Moussa Keita',
    clientEmail: 'moussa.keita@business.com',
    clientPhone: '+221 78 456 78 90',
    companyName: 'Keita Trading',
    description: 'Pièces automobiles - Moteurs et accessoires',
    weight: 45.8,
    dimensions: { length: 120, width: 80, height: 60 },
    origin: {
      country: 'Chine',
      city: 'Ningbo',
      address: '456 Auto Parts Industrial Park'
    },
    destination: {
      country: 'Sénégal',
      city: 'Dakar',
      address: '789 Zone Industrielle, Pikine'
    },
    estimatedPrice: 285000,
    finalPrice: 295000,
    requestedDate: '2024-01-08',
    estimatedDelivery: '2024-02-20',
    urgency: 'urgent' as const,
    status: 'accepted' as const,
    paymentMethod: 'cash_upfront' as const,
    submittedAt: '2024-01-08T16:45:00Z',
    acceptedAt: '2024-01-09T11:30:00Z',
    notes: 'Livraison directe à l\'entrepôt'
  },
  {
    id: '4',
    trackingNumber: 'NMC-2024-004',
    clientName: 'Aïssatou Ba',
    clientEmail: 'aissatou.ba@email.com',
    clientPhone: '+221 77 234 56 78',
    description: 'Produits cosmétiques - Soins et beauté',
    weight: 8.5,
    dimensions: { length: 40, width: 30, height: 20 },
    origin: {
      country: 'Chine',
      city: 'Shenzhen',
      address: '123 Beauty Products Zone'
    },
    destination: {
      country: 'Sénégal',
      city: 'Dakar',
      address: '654 Marché Sandaga'
    },
    estimatedPrice: 65000,
    requestedDate: '2024-01-14',
    urgency: 'standard' as const,
    status: 'rejected' as const,
    submittedAt: '2024-01-14T14:20:00Z',
    rejectedAt: '2024-01-15T09:10:00Z',
    rejectionReason: 'Produits non conformes aux réglementations d\'importation'
  }
]

type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'invoiced' | 'paid' | 'shipped' | 'delivered'

interface Order {
  id: string
  trackingNumber: string
  clientName: string
  clientEmail: string
  clientPhone: string
  companyName?: string
  description: string
  weight: number
  dimensions: { length: number; width: number; height: number }
  origin: {
    country: string
    city: string
    address: string
  }
  destination: {
    country: string
    city: string
    address: string
  }
  estimatedPrice: number
  finalPrice?: number
  requestedDate: string
  estimatedDelivery?: string
  urgency: 'standard' | 'express' | 'urgent'
  status: OrderStatus
  paymentMethod?: 'online' | 'cash_upfront' | 'cash_on_delivery'
  specialInstructions?: string
  submittedAt: string
  acceptedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  invoicedAt?: string
  invoiceData?: any
  notes?: string
}

export default function OrdersPage() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>(mockOrders as Order[])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'standard' | 'express' | 'urgent'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false)
  const [showBillingModal, setShowBillingModal] = useState(false)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesUrgency = urgencyFilter === 'all' || order.urgency === urgencyFilter
    
    return matchesSearch && matchesStatus && matchesUrgency
  })

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'invoiced': return 'bg-blue-100 text-blue-800'
      case 'paid': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <X className="w-4 h-4" />
      case 'invoiced': return <DollarSign className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'express': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return '🚨 Urgent'
      case 'express': return '⚡ Express'
      default: return '📦 Standard'
    }
  }

  const handleAcceptOrder = (acceptanceData: any) => {
    if (selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { 
              ...order, 
              status: 'accepted' as const,
              finalPrice: acceptanceData.finalPrice,
              estimatedDelivery: acceptanceData.estimatedDelivery,
              paymentMethod: acceptanceData.paymentMethod,
              acceptedAt: new Date().toISOString(),
              notes: acceptanceData.notes
            }
          : order
      ))
    }
    setShowAcceptanceModal(false)
    setSelectedOrder(null)
  }

  const handleRejectOrder = (reason: string) => {
    if (selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { 
              ...order, 
              status: 'rejected' as const,
              rejectedAt: new Date().toISOString(),
              rejectionReason: reason
            }
          : order
      ))
    }
    setShowAcceptanceModal(false)
    setSelectedOrder(null)
  }

  const handleGenerateInvoice = (invoiceData: any) => {
    if (selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { 
              ...order, 
              status: 'invoiced' as const,
              invoiceData,
              invoicedAt: new Date().toISOString()
            }
          : order
      ))
    }
  }

  const handleSendInvoice = (method: 'email' | 'sms' | 'whatsapp') => {
    console.log(`Sending invoice via ${method}`)
    // Simulate sending
    setTimeout(() => {
      alert(`Facture envoyée par ${method} avec succès !`)
    }, 1000)
  }

  const openAcceptanceModal = (order: any) => {
    setSelectedOrder(order)
    setShowAcceptanceModal(true)
  }

  const openBillingModal = (order: any) => {
    setSelectedOrder(order)
    setShowBillingModal(true)
  }

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    rejected: orders.filter(o => o.status === 'rejected').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">📦 Gestion des Commandes</h1>
              <p className="text-blue-100 mt-2">Acceptation, facturation et suivi des commandes clients</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <button
                onClick={() => router.push('/dashboard/orders/config')}
                className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg transition-all"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuration
              </button>
            )}
            <div className="text-right">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-blue-100">Commandes totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">En Attente</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Acceptées</p>
              <p className="text-2xl font-bold text-green-700">{stats.accepted}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Refusées</p>
              <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Taux Acceptation</p>
              <p className="text-2xl font-bold text-blue-700">{Math.round((stats.accepted / stats.total) * 100)}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="accepted">Acceptées</option>
            <option value="rejected">Refusées</option>
            <option value="invoiced">Facturées</option>
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value as 'all' | 'standard' | 'express' | 'urgent')}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes urgences</option>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="urgent">Urgent</option>
          </select>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredOrders.length} résultats</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {order.clientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{order.clientName}</h3>
                    <p className="text-sm text-gray-600">#{order.trackingNumber}</p>
                    <p className="text-sm text-gray-500">{order.clientEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(order.urgency)} border`}>
                    {getUrgencyText(order.urgency)}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Package className="w-4 h-4 mr-1" />
                    Description
                  </div>
                  <p className="font-medium text-gray-800">{order.description}</p>
                  <p className="text-sm text-gray-600">{order.weight} kg</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Itinéraire
                  </div>
                  <p className="font-medium text-gray-800">{order.origin.city} → {order.destination.city}</p>
                  <p className="text-sm text-gray-600">{order.origin.country} - {order.destination.country}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Prix
                  </div>
                  <p className="font-medium text-gray-800">
                    {order.finalPrice ? order.finalPrice.toLocaleString('fr-FR') : order.estimatedPrice.toLocaleString('fr-FR')} FCFA
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.finalPrice ? 'Prix final' : 'Estimation'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Soumis le {new Date(order.submittedAt).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center space-x-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => openAcceptanceModal(order)}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-medium"
                    >
                      ✅ Traiter
                    </button>
                  )}
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => openBillingModal(order)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium"
                    >
                      🧾 Facturer
                    </button>
                  )}
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
          <p className="text-gray-500">Aucune commande ne correspond à vos critères de recherche.</p>
        </div>
      )}

      {/* Modals */}
      {selectedOrder && (
        <>
          <OrderAcceptanceModal
            isOpen={showAcceptanceModal}
            onClose={() => {
              setShowAcceptanceModal(false)
              setSelectedOrder(null)
            }}
            order={selectedOrder}
            onAccept={handleAcceptOrder}
            onReject={handleRejectOrder}
          />

          <BillingInvoiceModal
            isOpen={showBillingModal}
            onClose={() => {
              setShowBillingModal(false)
              setSelectedOrder(null)
            }}
            order={selectedOrder!}
            onGenerateInvoice={handleGenerateInvoice}
            onSendInvoice={handleSendInvoice}
          />
        </>
      )}
    </div>
  )
}
