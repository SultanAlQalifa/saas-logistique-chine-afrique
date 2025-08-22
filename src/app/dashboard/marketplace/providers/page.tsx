'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Star, 
  Shield, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Eye, 
  Award,
  Globe,
  Phone,
  Mail,
  Building,
  Truck,
  Ship,
  Plane,
  Package,
  ArrowLeft,
  Settings
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  mockServiceProviders,
  type ServiceProvider
} from '@/lib/marketplace-services'

export default function ProvidersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all')
  const [selectedZone, setSelectedZone] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'orders' | 'response'>('rating')

  const isEnterprise = session?.user?.role === 'ADMIN'
  const isProvider = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'maritime': return <Ship className="h-4 w-4" />
      case 'aérien': return <Plane className="h-4 w-4" />
      case 'terrestre': return <Truck className="h-4 w-4" />
      case 'express': return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const filteredAndSortedProviders = mockServiceProviders
    .filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           provider.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = selectedSpecialty === 'all' || 
                              provider.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))
      const matchesZone = selectedZone === 'all' || 
                         provider.coverageZones.some(z => z.toLowerCase().includes(selectedZone.toLowerCase()))
      return matchesSearch && matchesSpecialty && matchesZone
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating
        case 'orders': return b.completedOrders - a.completedOrders
        case 'response': return parseInt(a.responseTime) - parseInt(b.responseTime)
        default: return 0
      }
    })

  const allSpecialties = Array.from(new Set(mockServiceProviders.flatMap(p => p.specialties)))
  const allZones = Array.from(new Set(mockServiceProviders.flatMap(p => p.coverageZones)))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Users className="h-10 w-10 mr-3" />
                Prestataires Logistiques
              </h1>
              <p className="text-teal-100 text-lg">
                🌍 {mockServiceProviders.length} prestataires vérifiés à votre service
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isProvider && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => router.push('/dashboard/marketplace/providers/config')}
                className="text-white hover:bg-white/20 border border-white/30"
              >
                <Settings className="h-5 w-5 mr-2" />
                Configuration
              </Button>
            )}
            {isEnterprise && (
              <Button className="bg-white text-teal-600 hover:bg-gray-100 font-semibold" size="lg">
                <Building className="h-5 w-5 mr-2" />
                Devenir prestataire
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Prestataires</p>
                <p className="text-2xl font-bold text-teal-600">{mockServiceProviders.length}</p>
              </div>
              <Users className="w-8 h-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prestataires Vérifiés</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {mockServiceProviders.filter(p => p.verified).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note Moyenne</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(mockServiceProviders.reduce((sum, p) => sum + p.rating, 0) / mockServiceProviders.length).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Commandes Totales</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockServiceProviders.reduce((sum, p) => sum + p.completedOrders, 0).toLocaleString()}
                </p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher un prestataire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">Toutes spécialités</option>
              {allSpecialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>

            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">Toutes zones</option>
              {allZones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="rating">Trier par note</option>
              <option value="orders">Trier par commandes</option>
              <option value="response">Trier par réactivité</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des prestataires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedProviders.map((provider) => (
          <Card key={provider.id} className="border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {provider.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="flex items-center text-lg">
                      {provider.name}
                      {provider.verified && (
                        <Shield className="h-4 w-4 ml-2 text-emerald-600" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm">{provider.company}</CardDescription>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                      <span className="text-sm text-gray-500">({provider.reviewCount} avis)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-teal-600">{provider.completedOrders}</div>
                  <div className="text-xs text-gray-500">commandes</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Spécialités */}
              <div>
                <div className="text-xs text-gray-500 mb-2">Spécialités</div>
                <div className="flex flex-wrap gap-1">
                  {provider.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs flex items-center">
                      {getSpecialtyIcon(specialty)}
                      <span className="ml-1">{specialty}</span>
                    </Badge>
                  ))}
                  {provider.specialties.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{provider.specialties.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Zones de couverture */}
              <div>
                <div className="text-xs text-gray-500 mb-2">Zones de couverture</div>
                <div className="flex flex-wrap gap-1">
                  {provider.coverageZones.slice(0, 2).map((zone) => (
                    <Badge key={zone} variant="outline" className="text-xs flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {zone}
                    </Badge>
                  ))}
                  {provider.coverageZones.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{provider.coverageZones.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 rounded-lg p-3">
                <div>
                  <div className="text-sm font-medium text-teal-600 flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {provider.responseTime}
                  </div>
                  <div className="text-xs text-gray-500">Réponse</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-emerald-600 flex items-center justify-center">
                    <Globe className="h-3 w-3 mr-1" />
                    {provider.languages.length}
                  </div>
                  <div className="text-xs text-gray-500">Langues</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-cyan-600 flex items-center justify-center">
                    <Award className="h-3 w-3 mr-1" />
                    {provider.certifications.length}
                  </div>
                  <div className="text-xs text-gray-500">Certifs</div>
                </div>
              </div>

              {/* Langues */}
              <div>
                <div className="text-xs text-gray-500 mb-1">Langues parlées</div>
                <div className="text-sm text-gray-700">
                  {provider.languages.slice(0, 3).join(', ')}
                  {provider.languages.length > 3 && ` +${provider.languages.length - 3}`}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir profil
                </Button>
                {isEnterprise && (
                  <Button size="sm" className="flex-1 bg-teal-600 hover:bg-teal-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredAndSortedProviders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun prestataire trouvé</h3>
            <p className="text-gray-500 mb-4">
              Essayez de modifier vos critères de recherche ou de filtrage.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setSelectedSpecialty('all')
                setSelectedZone('all')
              }}
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
