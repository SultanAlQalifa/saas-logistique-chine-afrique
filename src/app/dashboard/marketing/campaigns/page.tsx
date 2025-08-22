'use client'

import React, { useState } from 'react'
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
  Mail, 
  MessageSquare, 
  Phone,
  ArrowLeft 
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import PaymentModal from '@/components/marketing/PaymentModal'
import { calculateMarketingCost, calculateTotalWithFees } from '@/lib/marketing-pricing'

export default function CampaignsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<any>(null)
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Promotion Nouvel An Chinois 2024',
      type: 'Email',
      status: 'Actif',
      contacts: 2450,
      sent: 2450,
      opened: 1870,
      clicked: 445,
      conversions: 89,
      budget: 15000,
      spent: 12500,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      openRate: 76.3,
      clickRate: 18.2,
      conversionRate: 3.6,
      color: 'bg-green-500'
    },
    {
      id: 2,
      name: 'Notification Service Express',
      type: 'SMS',
      status: 'Terminé',
      contacts: 1850,
      sent: 1850,
      delivered: 1822,
      clicked: 234,
      conversions: 67,
      budget: 8500,
      spent: 8500,
      startDate: '2024-01-10',
      endDate: '2024-01-20',
      deliveryRate: 98.5,
      clickRate: 12.8,
      conversionRate: 3.7,
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Suivi Colis WhatsApp',
      type: 'WhatsApp',
      status: 'Programmé',
      contacts: 3200,
      sent: 0,
      budget: 12000,
      spent: 0,
      startDate: '2024-01-25',
      endDate: '2024-02-25',
      frequency: 'Quotidien',
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      name: 'Campagne Fidélité Clients',
      type: 'Email',
      status: 'Brouillon',
      contacts: 5600,
      budget: 25000,
      spent: 0,
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      color: 'bg-gray-500'
    },
    {
      id: 5,
      name: 'Offre Spéciale Transport Aérien',
      type: 'SMS',
      status: 'En pause',
      contacts: 1200,
      sent: 800,
      delivered: 785,
      clicked: 94,
      conversions: 23,
      budget: 6000,
      spent: 4000,
      startDate: '2024-01-12',
      endDate: '2024-01-30',
      deliveryRate: 98.1,
      clickRate: 12.0,
      conversionRate: 2.9,
      color: 'bg-orange-500'
    }
  ])

  // Event handlers for button functionality
  const handleCreateCampaign = () => {
    const baseCost = calculateMarketingCost('campaign', 7)
    const totalCost = calculateTotalWithFees(baseCost)
    
    setSelectedOperation({
      type: 'campaign',
      name: 'Nouvelle Campagne Marketing',
      cost: totalCost.total,
      duration: 7,
      description: 'Campagne marketing avec ciblage géographique et analytics'
    })
    setShowPaymentModal(true)
  }

  const handlePauseCampaign = (campaignId: number) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'En pause' }
        : campaign
    ))
    alert(`Campagne ${campaignId} mise en pause`)
  }

  const handleResumeCampaign = (campaignId: number) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'Actif' }
        : campaign
    ))
    alert(`Campagne ${campaignId} reprise`)
  }

  const handleEditCampaign = (campaignId: number) => {
    alert(`Redirection vers l'édition de la campagne ${campaignId}`)
  }

  const handleViewCampaign = (campaignId: number) => {
    alert(`Affichage des détails de la campagne ${campaignId}`)
  }

  const handleMoreActions = (campaignId: number) => {
    const actions = ['Dupliquer', 'Archiver', 'Supprimer']
    const action = prompt(`Actions disponibles pour la campagne ${campaignId}:\n${actions.join('\n')}\n\nTapez l'action souhaitée:`)
    if (action && actions.includes(action)) {
      alert(`Action "${action}" exécutée pour la campagne ${campaignId}`)
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const typeMatch = selectedType === 'all' || campaign.type === selectedType
    const statusMatch = selectedStatus === 'all' || campaign.status === selectedStatus
    const searchMatch = searchTerm === '' || 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    return typeMatch && statusMatch && searchMatch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail className="h-4 w-4" />
      case 'SMS': return <MessageSquare className="h-4 w-4" />
      case 'WhatsApp': return <Phone className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-500'
      case 'Terminé': return 'bg-blue-500'
      case 'Programmé': return 'bg-yellow-500'
      case 'En pause': return 'bg-orange-500'
      case 'Brouillon': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const handleConfirmPayment = () => {
    alert('Campagne créée avec succès ! Paiement confirmé.')
    setShowPaymentModal(false)
    setSelectedOperation(null)
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleGoBack}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-2"
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Campagnes</h1>
              <p className="text-purple-100 text-lg">
                Créer et gérer vos campagnes
              </p>
            </div>
          </div>
          <Button 
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
            size="lg"
            onClick={handleCreateCampaign}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Campagne
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher une campagne..."
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
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>
          
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="Programmé">Programmé</option>
            <option value="En pause">En pause</option>
            <option value="Terminé">Terminé</option>
            <option value="Brouillon">Brouillon</option>
          </select>
        </div>

        <div className="text-sm text-gray-500">
          {filteredCampaigns.length} campagne(s) trouvée(s)
        </div>
      </div>

      {/* Liste des campagnes */}
      <div className="grid gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(campaign.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{campaign.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <span>•</span>
                      <span>{campaign.type}</span>
                      <span>•</span>
                      <span>{campaign.contacts.toLocaleString('fr-FR')} contacts</span>
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {campaign.status === 'Actif' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePauseCampaign(campaign.id)}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  {campaign.status === 'En pause' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResumeCampaign(campaign.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Reprendre
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditCampaign(campaign.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewCampaign(campaign.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMoreActions(campaign.id)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                {campaign.sent && campaign.sent > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {campaign.sent.toLocaleString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-500">Envoyés</div>
                  </div>
                )}
                
                {campaign.opened && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {campaign.opened.toLocaleString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-500">Ouverts</div>
                  </div>
                )}
                
                {campaign.delivered && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {campaign.delivered.toLocaleString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-500">Livrés</div>
                  </div>
                )}
                
                {campaign.clicked && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {campaign.clicked.toLocaleString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-500">Clics</div>
                  </div>
                )}
                
                {campaign.conversions && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {campaign.conversions}
                    </div>
                    <div className="text-xs text-gray-500">Conversions</div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {campaign.spent.toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-xs text-gray-500">
                    / {campaign.budget.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              </div>
              
              {/* Métriques de performance */}
              {campaign.sent && campaign.sent > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                  {campaign.openRate && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {campaign.openRate}%
                      </div>
                      <div className="text-xs text-gray-500">Taux d'ouverture</div>
                    </div>
                  )}
                  
                  {campaign.deliveryRate && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {campaign.deliveryRate}%
                      </div>
                      <div className="text-xs text-gray-500">Taux de livraison</div>
                    </div>
                  )}
                  
                  {campaign.clickRate && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">
                        {campaign.clickRate}%
                      </div>
                      <div className="text-xs text-gray-500">Taux de clic</div>
                    </div>
                  )}
                  
                  {campaign.conversionRate && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-orange-600">
                        {campaign.conversionRate}%
                      </div>
                      <div className="text-xs text-gray-500">Taux de conversion</div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Informations de planification */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Du {campaign.startDate} au {campaign.endDate}</span>
                  </div>
                  {campaign.frequency && (
                    <Badge variant="outline">{campaign.frequency}</Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {campaign.id}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune campagne trouvée</h3>
          <p className="text-gray-500 mb-4">
            Aucune campagne ne correspond à vos critères de recherche.
          </p>
          <Button onClick={handleCreateCampaign}>
            <Plus className="h-4 w-4 mr-2" />
            Créer votre première campagne
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
