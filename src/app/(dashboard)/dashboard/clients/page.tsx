'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Client } from '@/types'
import { Users, Plus, Package, TrendingUp, Shield, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

export default function ClientsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for top clients chart
  const topClientsData = [
    { name: 'Client A', volume: 45, revenus: 2250 },
    { name: 'Client B', volume: 38, revenus: 1900 },
    { name: 'Client C', volume: 32, revenus: 1600 },
    { name: 'Client D', volume: 28, revenus: 1400 },
    { name: 'Client E', volume: 22, revenus: 1100 },
  ]

  useEffect(() => {
    // Vérifier les permissions d'accès
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Seuls les SUPER_ADMIN peuvent voir tous les clients de la plateforme
    if (session.user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard')
      return
    }

    // Mock clients data - clients globaux de la plateforme (pas liés à une entreprise spécifique)
    const mockClients: Client[] = [
      {
        id: 'client-1',
        clientId: 'CL-001',
        companyId: '', // Clients globaux - pas liés à une entreprise
        name: 'Jean Dupont',
        email: 'jean.dupont@gmail.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la Paix',
        country: 'France',
        city: 'Paris',
        createdAt: new Date('2023-06-15')
      },
      {
        id: 'client-2',
        clientId: 'CL-002',
        companyId: '',
        name: 'Marie Kouassi',
        email: 'marie.kouassi@yahoo.fr',
        phone: '+225 07 12 34 56 78',
        address: 'Zone Industrielle Yopougon',
        country: 'Côte d\'Ivoire',
        city: 'Abidjan',
        createdAt: new Date('2023-08-22')
      },
      {
        id: 'client-3',
        clientId: 'CL-003',
        companyId: '',
        name: 'Ibrahim Traoré',
        email: 'ibrahim.traore@outlook.com',
        phone: '+237 6 98 76 54 32',
        address: 'Boulevard de la Liberté',
        country: 'Cameroun',
        city: 'Douala',
        createdAt: new Date('2023-09-10')
      },
      {
        id: 'client-4',
        clientId: 'CL-004',
        companyId: '',
        name: 'Fatou Sow',
        email: 'fatou.sow@gmail.com',
        phone: '+212 5 22 34 56 78',
        address: 'Quartier Industriel',
        country: 'Maroc',
        city: 'Casablanca',
        createdAt: new Date('2023-11-05')
      },
      {
        id: 'client-5',
        clientId: 'CL-005',
        companyId: '',
        name: 'Amadou Diallo',
        email: 'amadou.diallo@hotmail.com',
        phone: '+221 77 123 45 67',
        address: 'Plateau, Dakar',
        country: 'Sénégal',
        city: 'Dakar',
        createdAt: new Date('2023-12-01')
      }
    ]

    setClients(mockClients)
    setLoading(false)
  }, [session, status, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Message d'accès refusé pour les non-SUPER_ADMIN
  if (session?.user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            La gestion des clients de la plateforme est réservée aux super administrateurs uniquement.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-sm text-amber-800">
                Les clients sont des utilisateurs globaux de la plateforme, pas liés à une entreprise spécifique.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients Entreprises</h1>
          <p className="text-gray-600">Tous les clients inscrits sur la plateforme NextMove Cargo</p>
        </div>
        <Link
          href="/dashboard/clients/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center justify-center gap-2 transition duration-200 w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nouveau Client</span>
          <span className="sm:hidden">Nouveau</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clients Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length - 1}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus Moyens</p>
              <p className="text-2xl font-bold text-gray-900">€1,650</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Clients par Volume
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topClientsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="volume" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Liste des Clients ({clients.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membre depuis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.clientId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.createdAt.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Voir Historique
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
