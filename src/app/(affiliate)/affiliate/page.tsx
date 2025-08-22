'use client'

import { useState, useEffect } from 'react'
import { Affiliate, AffiliateReferral } from '@/types'
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Copy,
  ExternalLink,
  Calendar,
  Target,
  Award
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function AffiliateDashboard() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock affiliate data
  const mockAffiliate: Affiliate = {
    id: 'aff-1',
    userId: 'user-1',
    referralCode: 'SAAS2024',
    commissionRate: 0.15,
    totalEarnings: 2450.75,
    pendingEarnings: 340.50,
    bankAccount: 'FR76 1234 5678 9012 3456 789',
    paypalEmail: 'affiliate@example.com',
    user: {
      id: 'user-1',
      email: 'affiliate@example.com',
      name: 'Marie Dubois',
      role: 'AFFILIATE' as any,
      companyId: 'affiliate-company',
      isActive: true,
      company: {} as any
    },
    referrals: [],
    payouts: []
  }

  const earningsData = [
    { month: 'Jan', earnings: 180, referrals: 2 },
    { month: 'Fév', earnings: 240, referrals: 3 },
    { month: 'Mar', earnings: 320, referrals: 4 },
    { month: 'Avr', earnings: 280, referrals: 3 },
    { month: 'Mai', earnings: 450, referrals: 6 },
    { month: 'Jun', earnings: 380, referrals: 4 }
  ]

  const referralStats = [
    { plan: 'STARTER', count: 8, commission: 450 },
    { plan: 'PROFESSIONAL', count: 5, commission: 750 },
    { plan: 'ENTERPRISE', count: 2, commission: 1200 }
  ]

  const recentReferrals = [
    { company: 'Import Express Mali', plan: 'PROFESSIONAL', commission: 150, date: '2024-08-10', status: 'pending' },
    { company: 'Trading Burkina', plan: 'STARTER', commission: 75, date: '2024-08-08', status: 'paid' },
    { company: 'Logistics Sénégal', plan: 'ENTERPRISE', commission: 300, date: '2024-08-05', status: 'paid' },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAffiliate(mockAffiliate)
      setLoading(false)
    }, 1000)
  }, [])

  const copyReferralLink = () => {
    const link = `https://saas-logistique.com/signup?ref=${affiliate?.referralCode}`
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Affilié</h1>
        <p className="text-gray-600">Suivez vos commissions et parrainages</p>
      </div>

      {/* Referral Link Card */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Votre Code de Parrainage</h3>
            <p className="text-yellow-100">Partagez et gagnez {(affiliate?.commissionRate || 0) * 100}% de commission</p>
          </div>
          <Award className="h-8 w-8" />
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex-1">
            <p className="font-mono text-lg">{affiliate?.referralCode}</p>
          </div>
          <button
            onClick={copyReferralLink}
            className="bg-white text-yellow-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copier le lien
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus Totaux</p>
              <p className="text-3xl font-bold text-gray-900">€{affiliate?.totalEarnings.toLocaleString('fr-FR')}</p>
              <p className="text-sm text-green-600 mt-1">+12.5% ce mois</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Attente</p>
              <p className="text-3xl font-bold text-yellow-600">€{affiliate?.pendingEarnings.toLocaleString('fr-FR')}</p>
              <p className="text-sm text-gray-500 mt-1">Prochaine paie: 15 août</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Parrainages</p>
              <p className="text-3xl font-bold text-gray-900">15</p>
              <p className="text-sm text-blue-600 mt-1">+3 ce mois</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux Commission</p>
              <p className="text-3xl font-bold text-gray-900">{(affiliate?.commissionRate || 0) * 100}%</p>
              <p className="text-sm text-purple-600 mt-1">Niveau Gold</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Evolution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution des Revenus
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value}`, 'Revenus']} />
              <Line type="monotone" dataKey="earnings" stroke="#f59e0b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Referrals by Plan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Parrainages par Plan
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={referralStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plan" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value}`, 'Commission']} />
              <Bar dataKey="commission" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Parrainages Récents
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReferrals.map((referral, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{referral.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {referral.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{referral.commission}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(referral.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      referral.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {referral.status === 'paid' ? 'Payé' : 'En attente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Matériel Marketing</h3>
              <p className="text-yellow-100 mt-1">Bannières, liens, guides</p>
            </div>
            <ExternalLink className="h-8 w-8" />
          </div>
          <button className="mt-4 bg-white text-yellow-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors">
            Télécharger
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Demander un Paiement</h3>
              <p className="text-green-100 mt-1">€{affiliate?.pendingEarnings} disponibles</p>
            </div>
            <DollarSign className="h-8 w-8" />
          </div>
          <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Demander
          </button>
        </div>
      </div>
    </div>
  )
}
