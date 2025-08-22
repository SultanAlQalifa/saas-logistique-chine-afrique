'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useSidebar } from '@/hooks/useSidebar'
import { useTranslation } from '@/lib/i18n'
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  Truck, 
  MessageSquare, 
  Users, 
  FolderOpen, 
  TrendingUp, 
  BarChart3, 
  Building2, 
  Settings, 
  User,
  MessageCircle,
  Eye,
  Shield,
  Pin,
  PinOff,
  ChevronDown,
  ChevronRight,
  Search,
  FileText,
  CreditCard,
  Calculator,
  MapPin,
  Facebook,
  Chrome,
  Music,
  Image,
  CheckCircle,
  Plane,
  Ship,
  Clock,
  UserPlus,
  Briefcase,
  Target,
  Zap,
  PieChart,
  Globe,
  Key,
  Palette,
  HeadphonesIcon,
  Phone,
  Mail,
  Brain,
  Star,
  Store,
  Gift,
  Handshake,
  Trophy,
  Award
} from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href?: string
  children?: NavigationItem[]
  roles?: string[]
  badge?: string
  feature?: string
}

interface NavigationGroup {
  id: string
  label: string
  icon: React.ComponentType<any>
  color: string
  children?: NavigationItem[]
  roles?: string[]
}

export default function EnhancedSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { t, currentLang } = useTranslation()
  
  // Force re-render when language changes
  const [refreshKey, setRefreshKey] = useState(0)
  
  useEffect(() => {
    const handleLanguageChange = () => {
      setRefreshKey(prev => prev + 1)
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('languageChanged', handleLanguageChange)
      return () => window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [])
  
  const navigationGroups: NavigationGroup[] = [
    {
      id: 'dashboard',
      label: t('dashboard.title'),
      icon: LayoutDashboard,
      color: 'from-violet-500 via-purple-500 to-fuchsia-500',
      children: [
        { id: 'overview', label: t('dashboard.overview'), icon: LayoutDashboard, href: '/dashboard' }
      ]
    },
  {
    id: 'client-space',
    label: t('nav.client_space'),
    icon: User,
    color: 'from-emerald-400 via-teal-500 to-cyan-500',
    roles: ['CLIENT'],
    children: [
      { id: 'client-dashboard', label: t('nav.client_dashboard'), icon: LayoutDashboard, href: '/dashboard/client' },
      { id: 'new-quote', label: t('nav.new_quote'), icon: FileText, href: '/dashboard/client/new-quote' },
      { id: 'quote-requests', label: t('nav.my_requests'), icon: FileText, href: '/dashboard/client/quote-requests' },
      { id: 'client-packages', label: t('nav.my_packages'), icon: Package, href: '/dashboard/client/packages' }
    ]
  },
  {
    id: 'operations',
    label: t('nav.operations'),
    icon: Truck,
    color: 'from-orange-400 via-red-500 to-pink-500',
    roles: ['ADMIN', 'SUPER_ADMIN'],
    children: [
      { id: 'packages', label: t('packages.title'), icon: Package, href: '/dashboard/packages' },
      { id: 'pod-management', label: 'Preuves de Livraison (POD)', icon: CheckCircle, href: '/dashboard/packages' },
      { id: 'delivery-validation', label: 'Validation Livraison', icon: CheckCircle, href: '/dashboard/packages/delivery-validation' },
      { id: 'pod-settings', label: 'Configuration POD', icon: Settings, href: '/dashboard/pod-settings', roles: ['SUPER_ADMIN'] },
      { id: 'expeditions', label: 'Expéditions & Chargements', icon: Truck, href: '/dashboard/expeditions' },
      { id: 'quote-management', label: 'Demandes de Devis', icon: FileText, href: '/dashboard/quote-requests' },
      { id: 'pricing', label: 'Tarifications', icon: DollarSign, href: '/dashboard/pricing' },
      { id: 'optional-services', label: 'Services Optionnels', icon: Package, href: '/dashboard/services' },
      { id: 'statistics', label: 'Statistiques', icon: BarChart3, href: '/dashboard/statistics' }
    ]
  },
  {
    id: 'clients',
    label: t('nav.clients_relations'),
    icon: Users,
    color: 'from-blue-400 via-indigo-500 to-purple-500',
    roles: ['ADMIN', 'SUPER_ADMIN'],
    children: [
      { id: 'individual-clients', label: t('nav.individual_clients'), icon: User, href: '/dashboard/clients' },
      { id: 'companies', label: t('nav.companies'), icon: Building2, href: '/dashboard/companies' },
      { id: 'agents', label: t('nav.agents'), icon: UserPlus, href: '/dashboard/agents' },
      { id: 'contacts', label: t('nav.contacts'), icon: MessageSquare, href: '/dashboard/contacts' },
      { id: 'communication', label: t('nav.communication'), icon: MessageSquare, href: '/dashboard/communication' }
    ]
  },
  {
    id: 'finances',
    label: t('nav.finances'),
    icon: DollarSign,
    color: 'from-emerald-400 via-teal-500 to-cyan-500',
    roles: ['ADMIN', 'SUPER_ADMIN'],
    children: [
      { id: 'finances-overview', label: 'Vue d\'ensemble', icon: BarChart3, href: '/dashboard/finances' },
      { id: 'accounting', label: 'Comptabilité', icon: Calculator, href: '/dashboard/finances/accounting' },
      { id: 'invoicing', label: 'Facturation & Devis', icon: FileText, href: '/dashboard/finances/invoicing' },
      { id: 'payments', label: 'Paiements', icon: CreditCard, href: '/dashboard/finances/payments' },
      { id: 'installment-settings', label: 'Config. Paiement Échelonné', icon: Settings, href: '/dashboard/settings/installment-payments', roles: ['ADMIN'] },
      { id: 'reports', label: 'Rapports Financiers', icon: TrendingUp, href: '/dashboard/finances/reports' }
    ]
  },
  {
    id: 'commissions',
    label: 'Commissions',
    icon: DollarSign,
    color: 'from-yellow-400 via-orange-500 to-red-500',
    children: [
      { id: 'commissions-overview', label: 'Vue d\'ensemble', icon: BarChart3, href: '/dashboard/finances/commissions' }
    ]
  },
  {
    id: 'hr',
    label: 'Ressources Humaines',
    icon: Users,
    color: 'from-teal-400 via-cyan-500 to-blue-500',
    roles: ['SUPER_ADMIN'],
    children: [
      { id: 'hr-dashboard', label: 'Tableau de Bord RH', icon: Users, href: '/dashboard/hr' },
      { id: 'employees', label: 'Employés', icon: Users, href: '/dashboard/hr/employees' },
      { id: 'recruitment', label: 'Recrutement', icon: UserPlus, href: '/dashboard/hr/recruitment' },
      { id: 'training', label: 'Formations', icon: Briefcase, href: '/dashboard/hr/trainings' }
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: TrendingUp,
    color: 'from-pink-400 via-rose-500 to-red-500',
    roles: ['ADMIN', 'SUPER_ADMIN'],
    children: [
      { id: 'campaigns', label: 'Campagnes', icon: Target, href: '/dashboard/marketing/campaigns' },
      { id: 'promotions', label: 'Promotions', icon: Gift, href: '/dashboard/marketing/promotions' },
      { id: 'sponsoring', label: 'Sponsoring', icon: Handshake, href: '/dashboard/marketing/sponsoring' },
      { id: 'boost', label: 'Boost', icon: TrendingUp, href: '/dashboard/marketing/boost' },
      { id: 'ai-assistant', label: '🤖 Assistant IA', icon: Brain, href: '/dashboard/marketing/ai-assistant' },
      { id: 'addons', label: '⭐ Add-ons', icon: Star, href: '/dashboard/marketing/addons' },
      { id: 'marketing-overview', label: '📊 Aperçu Marketing', icon: BarChart3, href: '/dashboard/marketing' }
    ]
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: Store,
    color: 'from-emerald-400 via-teal-500 to-cyan-500',
    roles: ['ADMIN', 'SUPER_ADMIN'],
    children: [
      { id: 'marketplace-overview', label: 'Vue d\'ensemble', icon: Globe, href: '/dashboard/marketplace' },
      { id: 'service-requests', label: 'Demandes de Services', icon: MessageSquare, href: '/dashboard/marketplace/requests' },
      { id: 'providers', label: 'Prestataires', icon: Users, href: '/dashboard/marketplace/providers' },
      { id: 'bidding', label: 'Enchères', icon: TrendingUp, href: '/dashboard/marketplace/bidding' }
    ]
  },
  {
    id: 'loyalty',
    label: 'Programme Fidélité',
    icon: Trophy,
    color: 'from-yellow-400 via-orange-500 to-red-500',
    children: [
      { id: 'loyalty-overview', label: 'Mon Programme', icon: Trophy, href: '/dashboard/loyalty' },
      { id: 'loyalty-rewards', label: 'Récompenses', icon: Gift, href: '/dashboard/loyalty?tab=rewards' },
      { id: 'loyalty-history', label: 'Historique', icon: Award, href: '/dashboard/loyalty?tab=history' }
    ]
  },
  {
    id: 'support',
    label: 'Support Client',
    icon: MessageSquare,
    color: 'from-indigo-400 via-purple-500 to-pink-500',
    roles: ['ADMIN', 'SUPER_ADMIN'],
    children: [
      { id: 'support-dashboard', label: 'Tableau de Bord', icon: MessageSquare, href: '/dashboard/support' },
      { id: 'tickets', label: 'Tickets', icon: MessageSquare, href: '/dashboard/support/tickets' },
      { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageSquare, href: '/dashboard/support/whatsapp' },
      { id: 'whatsapp-admin', label: 'WhatsApp Admin', icon: Shield, href: '/dashboard/support/whatsapp-admin', roles: ['SUPER_ADMIN'] },
      { id: 'chatbot', label: 'Chat en Direct', icon: MessageSquare, href: '/dashboard/support/chatbot' }
    ]
  },
  {
    id: 'administration',
    label: 'Administration Système',
    icon: Settings,
    color: 'from-slate-400 via-gray-500 to-zinc-500',
    roles: ['SUPER_ADMIN'],
    children: [
      { id: 'users', label: 'Utilisateurs', icon: Users, href: '/dashboard/users' },
      { id: 'roles', label: 'Rôles & Permissions', icon: Key, href: '/dashboard/roles' },
      { id: 'company-permissions', label: 'Autorisations Entreprises', icon: Building2, href: '/dashboard/admin/company-permissions' },
      { id: 'integrations', label: 'Intégrations & APIs', icon: Globe, href: '/dashboard/integrations' },
      { id: 'branding', label: 'Branding & Site Web', icon: Palette, href: '/dashboard/branding' },
      { id: 'features', label: 'Features SaaS', icon: Zap, href: '/dashboard/admin/features' },
      { id: 'admin-advertising', label: 'Administration Publicités', icon: Target, href: '/dashboard/marketing/advertising' },
      { id: 'ads-dashboard', label: 'Dashboard Publicités', icon: BarChart3, href: '/dashboard/marketing/ads-dashboard' },
      { id: 'seo-management', label: 'Gestion SEO', icon: Search, href: '/dashboard/admin/seo' }
    ]
  },
  {
    id: 'profile',
    label: t('nav.profile'),
    icon: User,
    color: 'from-gray-400 via-slate-500 to-gray-600',
    children: [
      { id: 'profile', label: t('nav.my_profile'), icon: User, href: '/dashboard/profile' },
      { id: 'preferences', label: t('nav.preferences'), icon: Settings, href: '/dashboard/settings' },
      { id: 'whatsapp-config', label: 'WhatsApp Business', icon: MessageCircle, href: '/dashboard/settings/whatsapp', roles: ['ADMIN', 'COMPANY_ADMIN'] }
    ]
  }
  ]
  
  const {
    isCollapsed,
    isPinned,
    openSection,
    isHovered,
    isMobile,
    togglePin,
    toggleSection,
    handleKeyDown,
    handleMouseEnter,
    handleMouseLeave,
    expand,
    collapse
  } = useSidebar()
  
  const [searchTerm, setSearchTerm] = React.useState('')

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Filter navigation groups based on user role
  const filterGroupsByRole = (groups: NavigationGroup[]): NavigationGroup[] => {
    if (!session?.user?.role) return groups.filter(group => !group.roles)
    
    return groups.filter(group => {
      if (!group.roles) return true
      return group.roles.includes(session.user.role)
    }).map(group => ({
      ...group,
      children: group.children ? group.children.filter(item => {
        if (!item.roles) return true
        return item.roles.includes(session.user.role)
      }) : undefined
    })).filter(group => group.children && group.children.length > 0)
  }

  const filteredNavigation = filterGroupsByRole(navigationGroups)

  const handleNavigation = (href: string) => {
    try {
      router.push(href)
      // Auto-close on mobile after navigation
      if (isMobile && !isPinned) {
        // Sidebar will auto-collapse via inactivity timer
      }
    } catch (error) {
      console.warn('Navigation failed for:', href, error)
      // Fallback to safe route
      router.push('/dashboard')
    }
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const renderNavGroup = (group: NavigationGroup) => {
    const isOpen = openSection === group.id
    const hasActiveChild = group.children?.some(child => child.href && isActive(child.href))
    
    return (
      <div key={group.id} className="mb-2">
        {/* Group Header with Colors */}
        <button
          onClick={() => !isCollapsed && toggleSection(group.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              !isCollapsed && toggleSection(group.id)
            }
          }}
          className={`w-full bg-gradient-to-r ${group.color} rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
            hasActiveChild ? 'ring-2 ring-white/30' : ''
          } ${isCollapsed ? 'p-1 justify-center' : 'p-3'}`}
          aria-expanded={isOpen}
          aria-controls={`section-${group.id}`}
          title={isCollapsed ? group.label : undefined}
        >
          {isCollapsed ? (
            <div className="bg-white/20 p-0.5 rounded-lg">
              <group.icon className="h-3 w-3" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                  <group.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm">{group.label}</h3>
                  <p className="text-xs opacity-90">{group.children?.length || 0} modules</p>
                </div>
              </div>
              <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} flex-shrink-0`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          )}
        </button>

        {/* Group Items */}
        {isOpen && !isCollapsed && group.children && (
          <div 
            id={`section-${group.id}`}
            className="mt-2 ml-2 space-y-1 animate-in slide-in-from-top-2 duration-200 overflow-hidden"
          >
            {group.children.map(item => renderNavItem(item))}
          </div>
        )}
      </div>
    )
  }

  const renderNavItem = (item: NavigationItem) => {
    const itemIsActive = item.href ? isActive(item.href) : false
    
    return (
      <button
        key={item.id}
        onClick={() => item.href && handleNavigation(item.href)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            item.href && handleNavigation(item.href)
          }
        }}
        className={`w-full flex items-center rounded-lg transition-all duration-200 group ${
          itemIsActive 
            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
        } ${isCollapsed ? 'p-1 justify-center' : 'gap-3 p-3'}`}
        title={isCollapsed ? item.label : undefined}
      >
        <div className={`rounded-lg transition-colors ${
          itemIsActive ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-600 group-hover:bg-gray-200 dark:group-hover:bg-gray-500'
        } ${isCollapsed ? 'p-0.5' : 'p-2'}`}>
          <item.icon className={`${isCollapsed ? 'h-2.5 w-2.5' : 'h-4 w-4'} ${itemIsActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`} />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-sm truncate ${
              itemIsActive ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
            }`}>{item.label}</p>
            {item.badge && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2 shadow-sm">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </button>
    )
  }

  return (
    <>
      {/* Zone hover pour sidebar mini */}
      {isCollapsed && (
        <div
          className="fixed left-0 top-0 w-4 h-full z-40 bg-transparent hover:bg-blue-500/10 transition-colors cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onClick={() => expand()}
          title="Développer la sidebar"
        />
      )}
      
      {/* Sidebar */}
      <nav
        className={`fixed left-0 top-0 h-full z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-12 -translate-x-8' : 'w-64'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="navigation"
        aria-label="Navigation principale"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-gray-900 dark:text-white transition-opacity duration-300">
                NextMove
              </span>
            )}
          </div>
          
          {!isCollapsed && (
            <button
              onClick={togglePin}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isPinned ? 'Détacher la sidebar' : 'Épingler la sidebar'}
              aria-label={isPinned ? 'Détacher la sidebar' : 'Épingler la sidebar'}
            >
              {isPinned ? (
                <Pin className="h-4 w-4 text-blue-500" />
              ) : (
                <PinOff className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className={`flex-1 overflow-y-auto max-h-[calc(100vh-200px)] space-y-2 custom-scrollbar ${isCollapsed ? 'p-1' : 'p-4'}`}>
          {filteredNavigation.map(group => renderNavGroup(group))}
        </div>

        {/* User Info */}
        {!isCollapsed && session?.user && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                <User className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {session.user.name || session.user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content spacer */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-4' : 'ml-64'}`} />
    </>
  )
}
