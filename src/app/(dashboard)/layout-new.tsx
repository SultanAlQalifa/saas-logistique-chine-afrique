'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Calculator, 
  CreditCard, 
  Settings, 
  MessageSquare, 
  Truck, 
  Globe,
  TrendingUp,
  Ship,
  UserCheck,
  Crown,
  Megaphone,
  Wallet,
  Receipt,
  User,
  Shield,
  Cog,
  Mail,
  Phone,
  MapPin,
  BarChart3,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

// Types pour la navigation
interface NavigationItem {
  name: string
  href: string
  icon: any
  description?: string
}

interface NavigationGroup {
  name: string
  icon: any
  color: string
  items: NavigationItem[]
}

// Configuration de navigation selon l'architecture demandée
const navigation: NavigationGroup[] = [
  {
    name: 'Vue Globale',
    icon: Globe,
    color: 'from-blue-500 to-indigo-600',
    items: [
      { name: 'Vue d\'ensemble', href: '/dashboard', icon: LayoutDashboard, description: 'Dashboard administratif, financier & analytique' },
    ]
  },
  {
    name: 'Gestion',
    icon: Users,
    color: 'from-green-500 to-emerald-600',
    items: [
      { name: 'Utilisateurs', href: '/dashboard/users', icon: UserCheck, description: 'Gestion complète des utilisateurs' },
      { name: 'Cargo', href: '/dashboard/cargos', icon: Ship, description: 'Gestion des cargos et expéditions' },
      { name: 'Colis', href: '/dashboard/packages', icon: Package, description: 'Gestion des colis et livraisons' },
    ]
  },
  {
    name: 'Business',
    icon: TrendingUp,
    color: 'from-purple-500 to-violet-600',
    items: [
      { name: 'Tarifications', href: '/dashboard/pricing', icon: Calculator, description: 'Gestion des prix et règles tarifaires' },
      { name: 'Abonnements', href: '/dashboard/subscriptions', icon: Crown, description: 'Plans et abonnements clients' },
      { name: 'Marketing', href: '/dashboard/marketing', icon: Megaphone, description: 'Campagnes et sponsoring' },
    ]
  },
  {
    name: 'Finances',
    icon: CreditCard,
    color: 'from-yellow-500 to-orange-600',
    items: [
      { name: 'Paiements', href: '/dashboard/payments', icon: Wallet, description: 'Passerelles de paiement & API' },
      { name: 'Facturation', href: '/dashboard/finances/billing', icon: Receipt, description: 'Gestion des factures' },
    ]
  },
  {
    name: 'Paramètres',
    icon: Settings,
    color: 'from-gray-500 to-slate-600',
    items: [
      { name: 'Mon Profil', href: '/dashboard/profile', icon: User, description: 'Gestion du profil personnel' },
      { name: 'Rôles & Permissions', href: '/dashboard/roles', icon: Shield, description: 'Gestion des accès et permissions' },
      { name: 'Configuration', href: '/dashboard/config', icon: Cog, description: 'Configuration générale du système' },
    ]
  },
  {
    name: 'Communications',
    icon: MessageSquare,
    color: 'from-cyan-500 to-blue-600',
    items: [
      { name: 'Messages', href: '/dashboard/communication', icon: Mail, description: 'Communications et notifications' },
      { name: 'Contacts', href: '/dashboard/contacts', icon: Phone, description: 'Gestion des contacts clients' },
    ]
  },
  {
    name: 'Opérations',
    icon: Truck,
    color: 'from-red-500 to-pink-600',
    items: [
      { name: 'Expéditions', href: '/dashboard/expeditions', icon: MapPin, description: 'Suivi des expéditions' },
      { name: 'Statistiques', href: '/dashboard/statistics', icon: BarChart3, description: 'Analyses et rapports' },
    ]
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Vue Globale'])
  const pathname = usePathname()

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-80 flex-col bg-white shadow-2xl">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SaaS Logistique
              </span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((group) => (
              <div key={group.name} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r ${group.color} text-white hover:shadow-lg transform hover:scale-105`}
                >
                  <div className="flex items-center">
                    <group.icon className="h-5 w-5 mr-3" />
                    {group.name}
                  </div>
                  {expandedGroups.includes(group.name) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {expandedGroups.includes(group.name) && (
                  <div className="ml-4 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-2xl border-r border-gray-200">
          <div className="flex h-16 items-center px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="bg-white p-2 rounded-xl">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <span className="ml-3 text-xl font-bold text-white">
              SaaS Logistique
            </span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
            {navigation.map((group) => (
              <div key={group.name} className="space-y-2">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r ${group.color} text-white hover:shadow-lg transform hover:scale-105`}
                >
                  <div className="flex items-center">
                    <group.icon className="h-5 w-5 mr-3" />
                    {group.name}
                  </div>
                  {expandedGroups.includes(group.name) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {expandedGroups.includes(group.name) && (
                  <div className="ml-4 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 font-medium shadow-md'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard Administrateur
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-x-3">
                <div className="text-sm text-right">
                  <p className="font-medium text-gray-900">Administrateur</p>
                  <p className="text-blue-600 font-semibold text-xs">SaaS Logistique</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
