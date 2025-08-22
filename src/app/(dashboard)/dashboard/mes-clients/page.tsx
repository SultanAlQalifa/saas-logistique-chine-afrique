'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Client } from '@/types'
import { Users, Package, TrendingUp, Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ClientWithPackages extends Client {
  packagesCount: number
  totalValue: number
  lastPackageDate: Date
  status: 'active' | 'inactive'
}

export default function MyClientsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [clients, setClients] = useState<ClientWithPackages[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for client activity chart
  const clientActivityData = [
    { month: 'Jan', clients: 12, packages: 45 },
    { month: 'Fév', clients: 15, packages: 52 },
    { month: 'Mar', clients: 18, packages: 68 },
    { month: 'Avr', clients: 22, packages: 75 },
    { month: 'Mai', clients: 25, packages: 82 },
    { month: 'Jun', clients: 28, packages: 95 },
  ]

  useEffect(() => {
    // Vérifier les permissions d'accès
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Seuls les utilisateurs d'entreprise (ADMIN) peuvent voir cette page
    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    // Mock clients data - clients associés à cette entreprise via des colis
    const mockClientsWithPackages: ClientWithPackages[] = [
      {
        id: 'client-1',
        clientId: 'CL-001',
        companyId: '', // Client global
        name: 'Jean Dupont',
        email: 'jean.dupont@gmail.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la Paix',
        country: 'France',
        city: 'Paris',
        createdAt: new Date('2023-06-15'),
        packagesCount: 12,
        totalValue: 4500,
        lastPackageDate: new Date('2024-01-15'),
        status: 'active'
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
        createdAt: new Date('2023-08-22'),
        packagesCount: 8,
        totalValue: 2800,
        lastPackageDate: new Date('2024-01-10'),
        status: 'active'
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
        createdAt: new Date('2023-09-10'),
        packagesCount: 15,
        totalValue: 6200,
        lastPackageDate: new Date('2023-12-20'),
        status: 'inactive'
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
        createdAt: new Date('2023-11-05'),
        packagesCount: 6,
        totalValue: 1900,
        lastPackageDate: new Date('2024-01-08'),
        status: 'active'
      }
    ]

    setClients(mockClientsWithPackages)
    setLoading(false)
  }, [session, status, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const activeClients = clients.filter(c => c.status === 'active')
  const totalPackages = clients.reduce((sum, c) => sum + c.packagesCount, 0)
  const totalValue = clients.reduce((sum, c) => sum + c.totalValue, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Clients</h1>
          <p className="text-gray-600">Clients ayant des colis actifs avec votre entreprise - Relation commerciale directe</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clients Actifs</p>
              <p className="text-2xl font-bold text-green-600">{activeClients.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Colis</p>
              <p className="text-2xl font-bold text-purple-600">{totalPackages}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
              <p className="text-2xl font-bold text-orange-600">{totalValue.toLocaleString()} €</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Clients</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clientActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clients" fill="#3B82F6" name="Nouveaux Clients" />
              <Bar dataKey="packages" fill="#10B981" name="Colis Traités" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des Clients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernier Colis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {client.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.clientId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {client.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div>{client.city}, {client.country}</div>
                        <div className="text-xs text-gray-500">{client.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.packagesCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.totalValue.toLocaleString()} €</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {client.lastPackageDate.toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
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
