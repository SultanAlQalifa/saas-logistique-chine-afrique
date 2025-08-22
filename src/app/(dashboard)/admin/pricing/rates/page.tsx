'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Map, Truck, Plane, Ship, Calendar, DollarSign } from 'lucide-react'
import { TenantRateCard, TenantRateRules } from '@/lib/multi-tenant-pricing'

function AdminPricingRatesPageContent() {
  const { data: session } = useSession()
  const [rateCards, setRateCards] = useState<TenantRateCard[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('maritime')

  useEffect(() => {
    fetchRateCards()
  }, [])

  const fetchRateCards = async () => {
    try {
      const response = await fetch('/api/tenant/rate-cards', {
        headers: { 'X-Tenant-ID': 'tenant-1' }
      })
      
      const data = await response.json()
      setRateCards(data.rateCards || [])
    } catch (error) {
      console.error('Erreur lors du chargement des grilles tarifaires:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'maritime':
      case 'maritime_express':
        return <Ship className="h-4 w-4" />
      case 'aerien':
      case 'aerien_express':
        return <Plane className="h-4 w-4" />
      default:
        return <Truck className="h-4 w-4" />
    }
  }

  const getTransportLabel = (mode: string) => {
    switch (mode) {
      case 'maritime': return 'Maritime'
      case 'maritime_express': return 'Maritime Express'
      case 'aerien': return 'Aérien'
      case 'aerien_express': return 'Aérien Express'
      default: return mode
    }
  }

  const filterRateCardsByMode = (mode: string) => {
    return rateCards.filter(card => 
      mode === 'maritime' 
        ? card.mode === 'sea'
        : card.mode === 'air'
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Map className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">🗺️ Grilles Tarifaires</h1>
            <p className="text-green-100 text-lg">Configurez vos tarifs par corridor et mode de transport</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Ship className="h-5 w-5" />
              <span className="font-medium">Maritime</span>
            </div>
            <p className="text-2xl font-bold mt-1">{filterRateCardsByMode('maritime').length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              <span className="font-medium">Aérien</span>
            </div>
            <p className="text-2xl font-bold mt-1">{filterRateCardsByMode('aerien').length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Actives</span>
            </div>
            <p className="text-2xl font-bold mt-1">{rateCards.filter(c => c.active).length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold mt-1">{rateCards.length}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Grilles Tarifaires</h2>
          <p className="text-gray-600">Gérez vos tarifs par corridor et mode de transport</p>
        </div>
        
        <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Grille
        </Button>
      </div>

      {/* Rate Cards Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="maritime" className="flex items-center gap-2">
            <Ship className="h-4 w-4" />
            Maritime ({filterRateCardsByMode('maritime').length})
          </TabsTrigger>
          <TabsTrigger value="aerien" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Aérien ({filterRateCardsByMode('aerien').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="maritime" className="space-y-4">
          {filterRateCardsByMode('maritime').map((card) => (
            <Card key={card.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getTransportIcon(card.mode)}
                      {`${card.origin_country} → ${card.destination_country}`}
                      <div className="flex gap-2">
                        {card.active ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        <Badge variant="outline" className="border-blue-200 text-blue-800">
                          {getTransportLabel(card.mode)}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {card.origin_city || card.origin_country} → {card.destination_city || card.destination_country} • Base: {card.rate_basis.toUpperCase()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Paliers Tarifaires</Label>
                    <Table className="mt-2">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quantité</TableHead>
                          <TableHead>Prix/{card.rate_basis}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {card.tiers.map((tier, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {tier.min} - {tier.max === null ? '∞' : tier.max} {card.rate_basis}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatPrice(tier.price)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Paramètres</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span>Tarif minimum:</span>
                        <span className="font-semibold">{formatPrice(card.min_charge)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taux TVA:</span>
                        <span className="font-semibold">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Validité:</span>
                        <span className="font-semibold">
                          {new Date(card.valid_from).toLocaleDateString('fr-FR')} - {new Date(card.valid_until || card.valid_from).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    
                    {(card.fuel_surcharge_percent > 0 || card.security_surcharge_percent > 0 || card.peak_season_surcharge_percent > 0) && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-gray-500">Suppléments</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {[
                            {name: 'Carburant', rate: card.fuel_surcharge_percent},
                            {name: 'Sécurité', rate: card.security_surcharge_percent},
                            {name: 'Haute saison', rate: card.peak_season_surcharge_percent}
                          ].filter(s => s.rate > 0).map((surcharge, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {surcharge.name}: {surcharge.rate}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="aerien" className="space-y-4">
          {filterRateCardsByMode('aerien').map((card) => (
            <Card key={card.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getTransportIcon(card.mode)}
                      {`${card.origin_country} → ${card.destination_country}`}
                      <div className="flex gap-2">
                        {card.active ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        <Badge variant="outline" className="border-purple-200 text-purple-800">
                          {getTransportLabel(card.mode)}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {card.origin_city || card.origin_country} → {card.destination_city || card.destination_country} • Base: {card.rate_basis.toUpperCase()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Paliers Tarifaires</Label>
                    <Table className="mt-2">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quantité</TableHead>
                          <TableHead>Prix/{card.rate_basis}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {card.tiers.map((tier, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {tier.min} - {tier.max === null ? '∞' : tier.max} {card.rate_basis}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatPrice(tier.price)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Paramètres</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span>Tarif minimum:</span>
                        <span className="font-semibold">{formatPrice(card.min_charge)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taux TVA:</span>
                        <span className="font-semibold">20%</span>
                      </div>
                    </div>
                    
                    {(card.fuel_surcharge_percent > 0 || card.security_surcharge_percent > 0 || card.peak_season_surcharge_percent > 0) && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-gray-500">Suppléments</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {[
                            {name: 'Carburant', rate: card.fuel_surcharge_percent},
                            {name: 'Sécurité', rate: card.security_surcharge_percent},
                            {name: 'Haute saison', rate: card.peak_season_surcharge_percent}
                          ].filter(s => s.rate > 0).map((surcharge, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {surcharge.name}: {surcharge.rate}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {rateCards.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Map className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucune grille tarifaire</h3>
            <p className="text-gray-600 mb-4">
              Commencez par créer votre première grille tarifaire pour un corridor spécifique.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer ma première grille
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminPricingRatesPage() {
  return (
    <PermissionGuard 
      role="SUPER_ADMIN" 
      permission="pricing:admin"
      tenantRequired={false}
    >
      <AdminPricingRatesPageContent />
    </PermissionGuard>
  )
}
