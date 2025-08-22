'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Mail, 
  MessageSquare, 
  Phone, 
  Target, 
  Users, 
  BarChart3,
  Plus,
  Eye,
  Gift,
  Lightbulb,
  Clock,
  ArrowUpRight,
  ArrowLeft,
  Settings
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function MarketingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  // Event handlers for navigation and actions
  const handleGoBack = () => {
    window.history.back()
  }

  const handleNavigateToCampaigns = () => {
    window.location.href = '/dashboard/marketing/campaigns'
  }

  const handleNavigateToPromotions = () => {
    window.location.href = '/dashboard/marketing/promotions'
  }

  const handleNavigateToSponsoring = () => {
    window.location.href = '/dashboard/marketing/sponsoring'
  }

  const handleViewAllCampaigns = () => {
    window.location.href = '/dashboard/marketing/campaigns'
  }

  const handleViewCampaign = (campaignId: number) => {
    alert(`Affichage des détails de la campagne ${campaignId}`)
  }

  const handleQuickAction = (href: string) => {
    alert(`Redirection vers ${href}`)
  }

  const metrics = {
    messagesSent: { value: 12450, change: '+15.3%' },
    openRate: { value: 68.5, change: '+2.1%' },
    clickRate: { value: 24.8, change: '+5.7%' },
    conversions: { value: 892, change: '+12.4%' }
  }

  const recentCampaigns = [
    {
      id: 1,
      name: 'Promotion Nouvel An Chinois 2024',
      type: 'Email',
      contacts: 2450,
      status: 'Actif',
      openRate: 76.3,
      conversions: 89,
      color: 'bg-green-500'
    },
    {
      id: 2,
      name: 'Notification Service Express',
      type: 'SMS',
      contacts: 1850,
      status: 'Terminé',
      deliveryRate: 98.5,
      conversions: 67,
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Suivi Colis WhatsApp',
      type: 'WhatsApp',
      contacts: 3200,
      status: 'Programmé',
      startDate: '25/01',
      frequency: 'Quotidien',
      color: 'bg-yellow-500'
    }
  ]

  const quickActions = [
    {
      title: 'Nouvelle Campagne',
      description: 'Email, SMS, WhatsApp',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      href: '/dashboard/marketing/campaigns/new'
    },
    {
      title: 'Créer Promotion',
      description: 'Offres spéciales',
      icon: Gift,
      color: 'from-purple-500 to-purple-600',
      href: '/dashboard/marketing/promotions/new'
    },
    {
      title: 'Voir Rapports',
      description: 'Analytics détaillés',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      href: '/dashboard/marketing/reports'
    },
    {
      title: 'Gérer Audiences',
      description: 'Segments clients',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      href: '/dashboard/marketing/audiences'
    }
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Marketing</h1>
              <p className="text-pink-100 text-lg">
                Gérez vos campagnes et stratégies marketing
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            {isAdmin && (
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => router.push('/dashboard/marketing/config')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuration
              </Button>
            )}
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={handleNavigateToCampaigns}
            >
              <Target className="h-4 w-4 mr-2" />
              Campagnes
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={handleNavigateToPromotions}
            >
              <Gift className="h-4 w-4 mr-2" />
              Promotions
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={handleNavigateToSponsoring}
            >
              <Users className="h-4 w-4 mr-2" />
              Sponsoring
            </Button>
          </div>
        </div>
      </div>

      {/* Section Aperçu Marketing */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            📊 Aperçu Marketing
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Performance globale de vos campagnes</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <span className="font-medium">Ce mois</span>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Messages envoyés</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {metrics.messagesSent.value.toLocaleString('fr-FR')}
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500 text-white text-xs">
                  {metrics.messagesSent.change}
                </Badge>
                <span className="text-xs text-blue-600">Moyenne</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Taux d'ouverture</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 mb-1">
                {metrics.openRate.value}%
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500 text-white text-xs">
                  {metrics.openRate.change}
                </Badge>
                <span className="text-xs text-green-600">Moyenne</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Taux de clic</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {metrics.clickRate.value}%
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500 text-white text-xs">
                  {metrics.clickRate.change}
                </Badge>
                <span className="text-xs text-purple-600">Engagement</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Nouveaux clients</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 mb-1">
                {metrics.conversions.value}
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500 text-white text-xs">
                  {metrics.conversions.change}
                </Badge>
                <span className="text-xs text-orange-600">Conversions</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Campagnes Récentes et Actions Rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campagnes Récentes */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center">
                  🚀 Campagnes Récentes
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleViewAllCampaigns}>
                  Voir toutes
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{campaign.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{campaign.type}</span>
                        <span>•</span>
                        <span>{campaign.contacts.toLocaleString('fr-FR')} contacts</span>
                        <span>•</span>
                        <Badge className={campaign.color}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleViewCampaign(campaign.id)}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    {campaign.openRate && (
                      <div>
                        <span className="font-medium">{campaign.openRate}% ouverture</span>
                      </div>
                    )}
                    {campaign.deliveryRate && (
                      <div>
                        <span className="font-medium">{campaign.deliveryRate}% livraison</span>
                      </div>
                    )}
                    {campaign.conversions && (
                      <div>
                        <span className="font-medium">{campaign.conversions} conversions</span>
                      </div>
                    )}
                    {campaign.startDate && (
                      <div>
                        <span className="text-gray-600">Démarre le {campaign.startDate}</span>
                      </div>
                    )}
                    {campaign.frequency && (
                      <div>
                        <Badge variant="outline">{campaign.frequency}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Actions Rapides */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                ⚡ Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full h-auto p-4 justify-start hover:shadow-md transition-shadow"
                  onClick={() => handleQuickAction(action.href)}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} mr-3`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Conseil Marketing */}
          <Card className="shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-yellow-800">
                💡 Conseil Marketing du Jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 mb-4">
                Optimisez vos heures d'envoi : Les emails envoyés entre 10h et 11h ont un taux d'ouverture 23% plus élevé. 
                Programmez vos campagnes pour maximiser l'engagement de vos clients.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500 text-white">+23% d'ouverture</Badge>
                </div>
                <div className="flex items-center text-xs text-yellow-600">
                  <Clock className="h-3 w-3 mr-1" />
                  Meilleure heure: 10h-11h
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
