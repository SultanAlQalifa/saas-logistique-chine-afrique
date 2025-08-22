'use client'

import React, { useState, useEffect } from 'react'
import { FileText, Plus, Search, Filter, Calendar, Package, Truck, Ship, Plane, Eye, Edit, Trash2, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ClientQuotesPage() {
  const [quotes, setQuotes] = useState([
    {
      id: 'QT-2024-001',
      status: 'pending',
      transportMode: 'MARITIME',
      origin: 'Guangzhou',
      destination: 'Abidjan',
      weight: 100,
      volume: 0.096,
      estimatedPrice: 62400,
      createdAt: '2024-01-15',
      validUntil: '2024-02-15'
    },
    {
      id: 'QT-2024-002',
      status: 'approved',
      transportMode: 'AERIAL',
      origin: 'Shanghai',
      destination: 'Lagos',
      weight: 50,
      volume: 0,
      estimatedPrice: 260000,
      createdAt: '2024-01-10',
      validUntil: '2024-02-10'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const transportModes = {
    MARITIME: { label: 'Maritime', icon: Ship, color: 'text-blue-600' },
    MARITIME_EXPRESS: { label: 'Maritime Express', icon: Ship, color: 'text-cyan-600' },
    AERIAL: { label: 'Aérien', icon: Plane, color: 'text-purple-600' },
    AERIAL_EXPRESS: { label: 'Aérien Express', icon: Plane, color: 'text-red-600' }
  }

  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    approved: { label: 'Approuvé', color: 'bg-green-100 text-green-800', icon: '✅' },
    rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-800', icon: '❌' },
    expired: { label: 'Expiré', color: 'bg-gray-100 text-gray-800', icon: '⌛' }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.destination.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <FileText className="h-8 w-8 mr-3 text-blue-600" />
                Mes Devis
              </h1>
              <p className="text-gray-600 mt-2">Gérez vos demandes de devis et suivez leur statut</p>
            </div>
            <Button
              onClick={() => window.location.href = '/dashboard/client/quotes/new'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Devis
            </Button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par numéro, origine ou destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des devis */}
        <div className="space-y-4">
          {filteredQuotes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun devis trouvé</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Aucun devis ne correspond à vos critères de recherche.'
                    : 'Vous n\'avez pas encore de devis. Créez votre premier devis maintenant.'
                  }
                </p>
                <Button
                  onClick={() => window.location.href = '/dashboard/client/quotes/new'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un devis
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredQuotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {React.createElement(transportModes[quote.transportMode as keyof typeof transportModes].icon, {
                          className: `h-5 w-5 ${transportModes[quote.transportMode as keyof typeof transportModes].color}`
                        })}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{quote.id}</h3>
                        <p className="text-sm text-gray-600">
                          {transportModes[quote.transportMode as keyof typeof transportModes].label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[quote.status as keyof typeof statusConfig].color}`}>
                        {statusConfig[quote.status as keyof typeof statusConfig].icon} {statusConfig[quote.status as keyof typeof statusConfig].label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Trajet</p>
                      <p className="font-medium text-sm">{quote.origin} → {quote.destination}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {quote.transportMode.includes('AERIAL') ? 'Poids' : 'Volume'}
                      </p>
                      <p className="font-medium text-sm">
                        {quote.transportMode.includes('AERIAL') 
                          ? `${quote.weight} kg`
                          : `${quote.volume} m³`
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Prix estimé</p>
                      <p className="font-bold text-green-600">{formatCurrency(quote.estimatedPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Valide jusqu'au</p>
                      <p className="font-medium text-sm">{formatDate(quote.validUntil)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Créé le {formatDate(quote.createdAt)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      {quote.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      )}
                      {quote.status === 'approved' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
