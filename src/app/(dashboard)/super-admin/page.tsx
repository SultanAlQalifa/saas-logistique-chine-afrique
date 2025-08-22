'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Settings, 
  Users, 
  Building2, 
  CreditCard, 
  Mail, 
  Shield, 
  TrendingUp,
  DollarSign,
  Percent,
  Globe,
  Lock,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'

export default function SuperAdminPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalCompanies: 156,
    activeCompanies: 142,
    totalUsers: 2847,
    totalRevenue: 1250000,
    monthlyGrowth: 18.5,
    totalPackages: 45632
  })

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-600" />
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Contrôle total de la plateforme logistique
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <Lock className="h-4 w-4 text-red-600" />
          <span className="text-red-700 font-medium">Accès Privilégié</span>
        </div>
      </div>

      {/* KPIs Globaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Entreprises Totales</p>
              <p className="text-2xl font-bold">{stats.totalCompanies}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Entreprises Actives</p>
              <p className="text-2xl font-bold">{stats.activeCompanies}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Utilisateurs Totaux</p>
              <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString('fr-FR')}</p>
            </div>
            <Users className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Revenus Totaux</p>
              <p className="text-2xl font-bold">{(stats.totalRevenue / 1000000).toFixed(1)}M XOF</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Croissance</p>
              <p className="text-2xl font-bold">+{stats.monthlyGrowth}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Colis Totaux</p>
              <p className="text-2xl font-bold">{stats.totalPackages.toLocaleString('fr-FR')}</p>
            </div>
            <Globe className="h-8 w-8 text-teal-200" />
          </div>
        </div>
      </div>

      {/* Panneaux de Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Gestion des Entreprises */}
        <Link href="/super-admin/companies" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Gestion Entreprises</h3>
                <p className="text-gray-600 text-sm">Contrôle total des entreprises</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Créer/Modifier/Supprimer entreprises</p>
              <p>• Gérer les abonnements et plans</p>
              <p>• Configurer les restrictions</p>
            </div>
          </div>
        </Link>

        {/* Configuration SMTP */}
        <Link href="/super-admin/smtp-config" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configuration SMTP</h3>
                <p className="text-gray-600 text-sm">Gestion des emails transactionnels</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Configurer serveurs SMTP</p>
              <p>• Templates d'emails</p>
              <p>• Logs et statistiques</p>
            </div>
          </div>
        </Link>

        {/* Commissionnements */}
        <Link href="/super-admin/commissions" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Percent className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Commissionnements</h3>
                <p className="text-gray-600 text-sm">Gestion des commissions</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Taux de commission par plan</p>
              <p>• Commissions affiliés</p>
              <p>• Historique des paiements</p>
            </div>
          </div>
        </Link>

        {/* Autorisations & Restrictions */}
        <Link href="/super-admin/permissions" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Autorisations</h3>
                <p className="text-gray-600 text-sm">Contrôle des permissions</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Rôles et permissions</p>
              <p>• Restrictions par plan</p>
              <p>• Audit des accès</p>
            </div>
          </div>
        </Link>

        {/* Abonnements */}
        <Link href="/super-admin/subscriptions" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Abonnements</h3>
                <p className="text-gray-600 text-sm">Gestion des plans et facturation</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Plans et tarification</p>
              <p>• Facturation automatique</p>
              <p>• Gestion des essais gratuits</p>
            </div>
          </div>
        </Link>

        {/* Configuration Globale */}
        <Link href="/super-admin/global-settings" className="group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Settings className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configuration Globale</h3>
                <p className="text-gray-600 text-sm">Paramètres de la plateforme</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Paramètres système</p>
              <p>• Maintenance et mises à jour</p>
              <p>• Logs et monitoring</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Actions Rapides */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all text-left">
            <div className="text-sm font-medium text-gray-900">Créer Entreprise</div>
            <div className="text-xs text-gray-600 mt-1">Nouvelle entreprise cliente</div>
          </button>
          <button className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all text-left">
            <div className="text-sm font-medium text-gray-900">Envoyer Email</div>
            <div className="text-xs text-gray-600 mt-1">Email groupé aux entreprises</div>
          </button>
          <button className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all text-left">
            <div className="text-sm font-medium text-gray-900">Rapport Global</div>
            <div className="text-xs text-gray-600 mt-1">Générer rapport plateforme</div>
          </button>
          <button className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all text-left">
            <div className="text-sm font-medium text-gray-900">Maintenance</div>
            <div className="text-xs text-gray-600 mt-1">Mode maintenance</div>
          </button>
        </div>
      </div>
    </div>
  )
}
