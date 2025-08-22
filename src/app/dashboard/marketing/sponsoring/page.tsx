'use client'

import { useState } from 'react'
import { Search, Plus, Filter, MoreHorizontal, Play, Pause, Edit, Eye, Calendar, Target, DollarSign, BarChart3, Handshake, Building, Building2, Star, Globe, Award, Users, TrendingUp } from 'lucide-react'
import { useSession } from 'next-auth/react'
import PaymentModal from '@/components/marketing/PaymentModal'
import { calculateMarketingCost, calculateTotalWithFees } from '@/lib/marketing-pricing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SponsoringPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sponsorships, setSponsorships] = useState([
    {
      id: 1,
      name: 'Partenariat Chambre de Commerce Abidjan',
      partner: 'CCI Abidjan',
      type: 'Événementiel',
      status: 'Actif',
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      budget: 500000,
      spent: 125000,
      leads: 45,
      conversions: 12,
      visibility: 'Élevée',
      description: 'Sponsoring des événements business de la CCI',
      benefits: ['Logo sur supports', 'Stand privilégié', 'Networking VIP'],
      color: 'bg-green-500'
    },
    {
      id: 2,
      name: 'Salon International du Transport',
      partner: 'SITL Africa',
      type: 'Salon professionnel',
      status: 'Actif',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      budget: 750000,
      spent: 750000,
      leads: 89,
      conversions: 23,
      visibility: 'Très élevée',
      description: 'Stand premium au salon du transport',
      benefits: ['Stand 50m²', 'Conférences', 'Médias partenaires'],
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Sponsoring Équipe Football Locale',
      partner: 'ASEC Mimosas',
      type: 'Sportif',
      status: 'Programmé',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      budget: 300000,
      spent: 0,
      leads: 0,
      conversions: 0,
      visibility: 'Moyenne',
      description: 'Sponsoring maillot équipe de football',
      benefits: ['Logo maillot', 'Panneaux stade', 'Réseaux sociaux'],
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      name: 'Partenariat Université Logistique',
      partner: 'ENSTP Yamoussoukro',
      type: 'Éducatif',
      status: 'Actif',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 200000,
      spent: 50000,
      leads: 15,
      conversions: 8,
      visibility: 'Moyenne',
      description: 'Formation et stages étudiants',
      benefits: ['Recrutement', 'Innovation', 'Image employeur'],
      color: 'bg-purple-500'
    },
    {
      id: 5,
      name: 'Festival Économique Chinois',
      partner: 'Centre Culturel Chinois',
      type: 'Culturel',
      status: 'En pause',
      startDate: '2024-01-20',
      endDate: '2024-01-25',
      budget: 150000,
      spent: 100000,
      leads: 28,
      conversions: 7,
      visibility: 'Élevée',
      description: 'Sponsoring festival économique',
      benefits: ['Visibilité communauté', 'Networking', 'Relations diplomatiques'],
      color: 'bg-orange-500'
    }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<any>(null)

  // Event handlers for button functionality
  const handleCreatePartnership = () => {
    const baseCost = calculateMarketingCost('sponsoring', 30)
    const totalCost = calculateTotalWithFees(baseCost)
    
    setSelectedOperation({
      type: 'sponsoring',
      name: 'Nouveau Partenariat Sponsoring',
      cost: totalCost.total,
      duration: 30,
      description: 'Partenariat avec placement premium et visibilité maximale'
    })
    setShowPaymentModal(true)
  }

  const handleConfirmPayment = () => {
    alert('Partenariat créé avec succès ! Paiement confirmé.')
    setShowPaymentModal(false)
    setSelectedOperation(null)
  }

  const handlePauseSponsorship = (sponsorshipId: number) => {
    setSponsorships(prev => prev.map(sponsor => 
      sponsor.id === sponsorshipId 
        ? { ...sponsor, status: 'En pause' }
        : sponsor
    ))
    alert(`Partenariat ${sponsorshipId} mis en pause`)
  }

  const handleResumeSponsorship = (sponsorshipId: number) => {
    setSponsorships(prev => prev.map(sponsor => 
      sponsor.id === sponsorshipId 
        ? { ...sponsor, status: 'Actif' }
        : sponsor
    ))
    alert(`Partenariat ${sponsorshipId} repris`)
  }

  const handleEditSponsorship = (sponsorshipId: number) => {
    alert(`Redirection vers l'édition du partenariat ${sponsorshipId}`)
  }

  const handleViewSponsorship = (sponsorshipId: number) => {
    alert(`Affichage des détails du partenariat ${sponsorshipId}`)
  }

  const filteredSponsorships = sponsorships.filter(sponsor => {
    const typeMatch = selectedType === 'all' || sponsor.type === selectedType
    const statusMatch = selectedStatus === 'all' || sponsor.status === selectedStatus
    const searchMatch = searchTerm === '' || 
      sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.partner.toLowerCase().includes(searchTerm.toLowerCase())
    return typeMatch && statusMatch && searchMatch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Événementiel': return <Calendar className="h-4 w-4" />
      case 'Salon professionnel': return <Building2 className="h-4 w-4" />
      case 'Sportif': return <Award className="h-4 w-4" />
      case 'Éducatif': return <Users className="h-4 w-4" />
      case 'Culturel': return <Globe className="h-4 w-4" />
      default: return <Handshake className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-500'
      case 'Programmé': return 'bg-yellow-500'
      case 'En pause': return 'bg-orange-500'
      case 'Terminé': return 'bg-blue-500'
      case 'Annulé': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'Très élevée': return 'text-red-600 bg-red-100'
      case 'Élevée': return 'text-orange-600 bg-orange-100'
      case 'Moyenne': return 'text-yellow-600 bg-yellow-100'
      case 'Faible': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Sponsoring</h1>
            <p className="text-indigo-100 text-lg">
              Partenariats et sponsoring
            </p>
          </div>
          <Button 
            className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
            size="lg"
            onClick={handleCreatePartnership}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Partenariat
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Partenariats Actifs</p>
                <p className="text-2xl font-bold text-green-900">
                  {sponsorships.filter(s => s.status === 'Actif').length}
                </p>
              </div>
              <Handshake className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Budget Total</p>
                <p className="text-2xl font-bold text-blue-900">
                  {sponsorships.reduce((sum, s) => sum + s.budget, 0).toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Leads Générés</p>
                <p className="text-2xl font-bold text-purple-900">
                  {sponsorships.reduce((sum, s) => sum + s.leads, 0)}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Conversions</p>
                <p className="text-2xl font-bold text-orange-900">
                  {sponsorships.reduce((sum, s) => sum + s.conversions, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
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
              placeholder="Rechercher un partenariat..."
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
              <option value="Événementiel">Événementiel</option>
              <option value="Salon professionnel">Salon professionnel</option>
              <option value="Sportif">Sportif</option>
              <option value="Éducatif">Éducatif</option>
              <option value="Culturel">Culturel</option>
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
          </select>
        </div>

        <div className="text-sm text-gray-500">
          {filteredSponsorships.length} partenariat(s) trouvé(s)
        </div>
      </div>

      {/* Liste des partenariats */}
      <div className="grid gap-6">
        {filteredSponsorships.map((sponsorship) => (
          <Card key={sponsorship.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(sponsorship.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{sponsorship.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(sponsorship.status)}>
                        {sponsorship.status}
                      </Badge>
                      <span>•</span>
                      <span className="font-medium">{sponsorship.partner}</span>
                      <span>•</span>
                      <Badge variant="outline" className={getVisibilityColor(sponsorship.visibility)}>
                        {sponsorship.visibility}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {sponsorship.status === 'Actif' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePauseSponsorship(sponsorship.id)}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  {sponsorship.status === 'En pause' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResumeSponsorship(sponsorship.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Reprendre
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditSponsorship(sponsorship.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewSponsorship(sponsorship.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600 text-sm mb-4">{sponsorship.description}</p>
                  
                  <h4 className="font-medium mb-2">Avantages</h4>
                  <div className="flex flex-wrap gap-2">
                    {sponsorship.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {sponsorship.leads}
                    </div>
                    <div className="text-xs text-gray-500">Leads</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {sponsorship.conversions}
                    </div>
                    <div className="text-xs text-gray-500">Conversions</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {sponsorship.spent.toLocaleString('fr-FR')} FCFA
                    </div>
                    <div className="text-xs text-gray-500">Dépensé</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {sponsorship.conversions > 0 ? 
                        Math.round(sponsorship.spent / sponsorship.conversions).toLocaleString('fr-FR') : 
                        '0'} FCFA
                    </div>
                    <div className="text-xs text-gray-500">Coût/Conv.</div>
                  </div>
                </div>
              </div>
              
              {/* Barre de progression budget */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Budget utilisé</span>
                  <span>{sponsorship.spent.toLocaleString('fr-FR')} / {sponsorship.budget.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(sponsorship.spent / sponsorship.budget) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((sponsorship.spent / sponsorship.budget) * 100)}% utilisé
                </div>
              </div>
              
              {/* ROI et métriques */}
              {sponsorship.conversions > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {Math.round((sponsorship.conversions / sponsorship.leads) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Taux conversion</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {Math.round(sponsorship.leads / (sponsorship.spent / 1000))}
                    </div>
                    <div className="text-xs text-gray-500">Leads/1k FCFA</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      {sponsorship.conversions > 0 ? 
                        ((sponsorship.conversions * 50000 - sponsorship.spent) / sponsorship.spent * 100).toFixed(1) : 
                        '0'}%
                    </div>
                    <div className="text-xs text-gray-500">ROI estimé</div>
                  </div>
                </div>
              )}
              
              {/* Dates */}
              <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Du {sponsorship.startDate} au {sponsorship.endDate}</span>
                  </div>
                  <Badge variant="outline">{sponsorship.type}</Badge>
                </div>
                <div className="text-xs text-gray-500">
                  ID: {sponsorship.id}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSponsorships.length === 0 && (
        <div className="text-center py-12">
          <Handshake className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun partenariat trouvé</h3>
          <p className="text-gray-500 mb-4">
            Aucun partenariat ne correspond à vos critères de recherche.
          </p>
          <Button onClick={handleCreatePartnership}>
            <Plus className="h-4 w-4 mr-2" />
            Créer votre premier partenariat
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
