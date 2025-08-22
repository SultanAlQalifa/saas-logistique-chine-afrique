'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import NotificationCenter from '@/components/notifications/NotificationCenter'
import { UnifiedSupportWidget } from '@/components/ui/unified-support-widget'
import EnhancedSidebar from '@/components/layout/EnhancedSidebar'
import LanguageSelector from '@/components/ui/language-selector'
import PricingPOS from '@/components/pos/PricingPOS'
import { useAppRouter } from '@/utils/router-utils'
import { useSidebar } from '@/hooks/useSidebar'
import {
  LayoutDashboard,
  Users,
  Package,
  Ship,
  TrendingUp,
  DollarSign,
  FileText,
  FilePlus,
  Settings,
  Bell,
  Search,
  RefreshCw,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  Shield,
  UserCheck,
  Building,
  Globe,
  Calculator,
  CreditCard,
  BarChart3,
  Headphones,
  Bot,
  Building2,
  Code,
  Mail,
  Phone,
  Truck,
  MapPin,
  Zap,
  Star,
  GraduationCap,
  UserPlus,
  Network,
  Cog,
  Link as LinkIcon,
  Database,
  MessageSquare,
  BookOpen,
  MessageCircle,
  Gift,
  Megaphone,
  Headset,
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

const navigation: NavigationGroup[] = [
  // Tableau de bord principal
  {
    name: 'Tableau de Bord',
    icon: LayoutDashboard,
    color: 'from-blue-500 to-indigo-600',
    items: [
      { name: 'Vue Globale', href: '/dashboard', icon: LayoutDashboard, description: 'Tableau de bord principal' },
    ]
  },

  // Espace Client
  {
    name: 'Espace Client',
    icon: User,
    color: 'from-green-500 to-emerald-600',
    items: [
      { name: 'Tableau de bord', href: '/dashboard/client', icon: LayoutDashboard, description: 'Vue d\'ensemble de vos activités' },
      { name: 'Nouveau Devis', href: '/dashboard/client/new-quote', icon: FilePlus, description: 'Créer une nouvelle demande de devis' },
      { name: 'Mes Demandes', href: '/dashboard/client/quote-requests', icon: FileText, description: 'Historique de vos demandes' },
      { name: 'Mes Colis', href: '/dashboard/client/packages', icon: Package, description: 'Suivez vos colis en temps réel' },
      { name: 'Support Client', href: '/dashboard/support/client', icon: Headset, description: 'Discutez avec notre équipe de support' },
    ]
  },

  // Gestion des Opérations
  {
    name: 'Opérations',
    icon: Truck,
    color: 'from-red-500 to-pink-600',
    items: [
      { name: 'Colis', href: '/dashboard/packages', icon: Package, description: 'Gestion des colis et livraisons' },
      { name: 'Expéditions', href: '/dashboard/expeditions', icon: MapPin, description: 'Suivi des expéditions' },
      { name: 'Cargos', href: '/dashboard/cargos', icon: Ship, description: 'Gestion des cargos' },
      { name: 'Demandes de Devis', href: '/dashboard/quote-requests', icon: FileText, description: 'Demandes de devis clients' },
      { name: 'Statistiques', href: '/dashboard/statistics', icon: BarChart3, description: 'Analyses et rapports' },
    ]
  },

  // Gestion des Clients
  {
    name: 'Gestion Clients',
    icon: Users,
    color: 'from-indigo-500 to-purple-600',
    items: [
      { name: 'Clients Entreprises', href: '/dashboard/clients', icon: Users, description: 'Tous les clients inscrits sur la plateforme' },
      { name: 'Mes Clients', href: '/dashboard/mes-clients', icon: UserCheck, description: 'Clients ayant des colis avec votre entreprise' },
      { name: 'Clients Entreprise', href: '/dashboard/companies', icon: Building, description: 'Gestion des entreprises clientes' },
      { name: 'Agents', href: '/dashboard/agents', icon: UserCheck, description: 'Gestion des agents' },
      { name: 'Contacts', href: '/dashboard/contacts', icon: Phone, description: 'Carnet d\'adresses' },
      { name: 'Messages', href: '/dashboard/communication', icon: Mail, description: 'Communications clients' },
    ]
  },

  // Services Métier
  {
    name: 'Services',
    icon: Package,
    color: 'from-emerald-500 to-teal-600',
    items: [
      { name: 'Services Optionnels', href: '/dashboard/services', icon: Package, description: 'Services métier proposés aux clients' },
      { name: 'Tarifications', href: '/dashboard/pricing', icon: DollarSign, description: 'Grilles tarifaires' },
    ]
  },

  // Gestion (Admin uniquement)
  {
    name: 'Gestion',
    icon: Settings,
    color: 'from-gray-500 to-slate-600',
    items: [
      { name: 'Configuration', href: '/dashboard/config', icon: Settings, description: 'Configuration système' },
      { name: 'Utilisateurs', href: '/dashboard/users', icon: Users, description: 'Gestion des utilisateurs' },
      { name: 'Rôles & Permissions', href: '/dashboard/roles', icon: Shield, description: 'Contrôle d\'accès' },
      { name: 'Features SaaS', href: '/dashboard/admin/features', icon: Zap, description: 'Gestion des fonctionnalités' },
      { name: 'Abonnements', href: '/dashboard/admin/subscriptions', icon: CreditCard, description: 'Gestion des abonnements' },
      { name: 'Add-ons SaaS', href: '/dashboard/admin/saas-features', icon: Package, description: 'Fonctionnalités SaaS' },
      { name: 'Intégrations', href: '/dashboard/integrations', icon: LinkIcon, description: 'API et intégrations' },
      { name: 'Logs & Audit', href: '/dashboard/admin/logs', icon: FileText, description: 'Journaux système' },
      { name: 'Sauvegarde', href: '/dashboard/admin/backup', icon: Database, description: 'Sauvegarde et restauration' },
    ]
  },

  // Ressources Humaines
  {
    name: 'Ressources Humaines',
    icon: GraduationCap,
    color: 'from-teal-500 to-cyan-600',
    items: [
      { name: 'Tableau de Bord RH', href: '/dashboard/hr', icon: GraduationCap, description: 'Vue d\'ensemble RH' },
      { name: 'Employés', href: '/dashboard/hr/employees', icon: Users, description: 'Gestion des employés' },
      { name: 'Recrutement', href: '/dashboard/hr/recruitment', icon: UserPlus, description: 'Processus de recrutement' },
      { name: 'Formation', href: '/dashboard/hr/training', icon: GraduationCap, description: 'Programmes de formation' },
      { name: 'Administration RH', href: '/dashboard/hr/admin', icon: Shield, description: 'Administration RH' },
      { name: 'Organisation', href: '/dashboard/hr/organization', icon: Network, description: 'Structure organisationnelle' },
      { name: 'Politiques', href: '/dashboard/hr/policies', icon: FileText, description: 'Politiques RH' },
    ]
  },

  // Finances
  {
    name: 'Finances',
    icon: CreditCard,
    color: 'from-yellow-500 to-orange-600',
    items: [
      { name: 'Paiements', href: '/dashboard/finances/payments', icon: CreditCard, description: 'Passerelles de paiement & API' },
      { name: 'Facturation', href: '/dashboard/finances/billing', icon: FileText, description: 'Gestion des factures' },
      { name: 'Remboursements', href: '/dashboard/finances/refunds', icon: RefreshCw, description: 'Gestion des remboursements' },
      { name: 'Commissions', href: '/dashboard/finances/commissions', icon: DollarSign, description: 'Gestion des commissions' },
      { name: 'Comptabilité', href: '/dashboard/finances/accounting', icon: BarChart3, description: 'Comptabilité et finances' },
      { name: 'Tarifications', href: '/dashboard/pricing', icon: DollarSign, description: 'Grilles tarifaires' },
      { name: 'Abonnements', href: '/dashboard/subscriptions', icon: CreditCard, description: 'Gestion des abonnements' },
    ]
  },

  // Marketing
  {
    name: 'Marketing',
    icon: Megaphone,
    color: 'from-pink-500 to-rose-600',
    items: [
      { name: 'Vue d\'ensemble', href: '/dashboard/marketing', icon: BarChart3, description: 'Tableau de bord marketing' },
      { name: 'Campagnes', href: '/dashboard/marketing/campaigns', icon: Megaphone, description: 'Gestion des campagnes' },
      { name: 'Publicités Centralisées', href: '/dashboard/marketing/ads-central', icon: Zap, description: 'Meta, Google, TikTok Ads' },
      { name: 'Promotions', href: '/dashboard/marketing/promotions', icon: Gift, description: 'Codes promo et offres' },
      { name: 'Sponsoring', href: '/dashboard/marketing/sponsoring', icon: Star, description: 'Partenariats et sponsoring' },
    ]
  },

  // Support Client
  {
    name: 'Support',
    icon: Headphones,
    color: 'from-purple-500 to-pink-600',
    items: [
      { name: 'Tableau de Bord', href: '/dashboard/support', icon: Headphones, description: 'Vue d\'ensemble du support' },
      { name: 'Tickets', href: '/dashboard/support/tickets', icon: MessageSquare, description: 'Gestion des tickets' },
      { name: 'WhatsApp Business', href: '/dashboard/support/whatsapp', icon: MessageCircle, description: 'Support via WhatsApp' },
      { name: 'Base de Connaissances', href: '/dashboard/support/knowledge-base', icon: BookOpen, description: 'Articles d\'aide' },
      { name: 'Chat en Direct', href: '/dashboard/support/live-chat', icon: MessageCircle, description: 'Support temps réel' },
    ]
  },

  // Administration (Super Admin uniquement)
  {
    name: 'Administration',
    icon: Shield,
    color: 'from-amber-500 to-red-600',
    items: [
      { name: 'Utilisateurs & Rôles', href: '/dashboard/admin/users', icon: Users, description: 'Gestion des accès' },
      { name: 'Journaux', href: '/dashboard/admin/logs', icon: FileText, description: 'Logs système' },
      { name: 'Gestion Plans', href: '/dashboard/admin/pricing/plans', icon: DollarSign, description: 'Configuration des plans d\'abonnement' },
      { name: 'Add-ons SaaS', href: '/dashboard/admin/saas-features', icon: Zap, description: 'Fonctionnalités avancées de la plateforme' },
      { name: 'Grilles Tarifaires', href: '/dashboard/admin/pricing/rates', icon: Map, description: 'Configuration des tarifs par corridor' },
    ]
  },
]

// Fonction pour filtrer les paramètres selon le rôle
const getFilteredParametresItems = (userRole: string) => {
  const superAdminOnlyItems = [
    { name: 'API Admin', href: '/dashboard/api-admin', icon: Network, description: 'Interface d\'administration des API et données' },
    { name: 'Rôles & Permissions', href: '/dashboard/roles', icon: Shield, description: 'Gestion des accès et permissions' },
    { name: 'Administration Générale', href: '/dashboard/admin', icon: Settings, description: 'Administration système et configuration' },
    { name: 'Configuration', href: '/dashboard/config', icon: Cog, description: 'Configuration générale du système' },
    { name: 'Mailing', href: '/dashboard/configuration/mailing', icon: Mail, description: 'Configuration serveur SMTP et emails' },
    { name: 'Messagerie', href: '/dashboard/configuration/messagerie', icon: Mail, description: 'Configuration SMS, WhatsApp, Telegram' },
    { name: 'Gestion Contenu', href: '/dashboard/super-admin/content-management', icon: FileText, description: 'Modifier les pages À propos, Contact et Footer' },
    { name: 'Configuration IA', href: '/dashboard/super-admin/ai-configuration', icon: Bot, description: 'Configuration de l\'assistant IA OpenAI' },
  ]

  const allItems = [
    { name: 'Mon Profil', href: '/dashboard/profile', icon: User, description: 'Gestion du profil personnel' },
    ...(userRole === 'SUPER_ADMIN' ? superAdminOnlyItems : [])
  ]

  return allItems
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { navigateTo } = useAppRouter()
  const { isCollapsed } = useSidebar()

  // Filtrer les groupes de navigation selon le rôle
  const getFilteredNavigationGroups = () => {
    if (!session?.user?.role) {
      return []
    }

    const userRole = session.user.role
    
    return navigation
      .filter(group => {
        // Pour les clients, n'afficher que l'Espace Client et le Support
        if (userRole === 'CLIENT') {
          return group.name === 'Espace Client' || group.name === 'Support'
        }

        // Pour les administrateurs, masquer la section Administration complète
        if (userRole === 'ADMIN' && group.name === 'Administration') {
          return false
        }

        // Pour les super admins, tout afficher
        if (userRole === 'SUPER_ADMIN') {
          return true
        }

        // Par défaut, ne pas afficher les groupes vides
        return group.items.length > 0 && group.name !== 'Administration'
      })
      .map(group => ({
        ...group,
        // Filtrer également les items dans chaque groupe selon le rôle
        items: group.items.filter(item => {
          // Les clients n'ont accès qu'à leur espace dédié
          if (userRole === 'CLIENT') {
            return item.href.startsWith('/dashboard/client') || 
                   item.href.startsWith('/dashboard/support/client')
          }

          // Les administrateurs n'ont pas accès aux paramètres système
          if (userRole === 'ADMIN') {
            return ![
              '/dashboard/super-admin',
              '/dashboard/roles',
              '/dashboard/admin/settings',
              '/dashboard/admin/logs'
            ].some(adminPath => item.href.startsWith(adminPath))
          }

          // Super admin a accès à tout
          return true
        })
      }))
      .filter(group => group.items.length > 0) // Ne garder que les groupes avec des items
  }

  // Filtrer les items de navigation selon le rôle
  const getFilteredNavigationItems = (items: NavigationItem[]) => {
    // Si la session n'est pas encore chargée, retourner un tableau vide pour éviter les erreurs de rendu
    if (!session?.user?.role) {
      return []
    }

    const userRole = session.user.role

    // Pour les clients, ne montrer que les liens pertinents
    if (userRole === 'CLIENT') {
      return items.filter(item => 
        item.href.startsWith('/dashboard/client') || 
        item.href.startsWith('/dashboard/support/client') ||
        item.href === '/dashboard/profile' ||
        item.href === '/dashboard/support/chatbot'
      )
    }

    // Pour les administrateurs, filtrer les accès sensibles
    if (userRole === 'ADMIN') {
      return items.filter(item => {
        // Exclure les chemins réservés au SUPER_ADMIN
        if ([
          '/dashboard/super-admin',
          '/dashboard/roles',
          '/dashboard/admin/settings',
          '/dashboard/admin/logs',
          '/dashboard/hr/',
          '/dashboard/config',
          '/dashboard/admin',
          '/dashboard/roles',
          '/dashboard/permissions',
          '/dashboard/configuration',
          '/dashboard/super-admin/'
        ].some(adminPath => item.href.startsWith(adminPath))) {
          return false
        }
        
        // Gestion du support client pour les admins
        if (item.href === '/dashboard/support/client') {
          return false
        }
        
        return true
      })
    }

    // Pour les super admins, tout est accessible
    if (userRole === 'SUPER_ADMIN') {
      return items
    }

    // Pour les autres rôles, ne rien afficher par défaut
    return []
  }


  const handleSignOut = async () => {
    console.log('Déconnexion...')
    try {
      // Utiliser signOut de NextAuth avec redirection
      const { signOut } = await import('next-auth/react')
      await signOut({ 
        callbackUrl: 'http://localhost:3000/auth/signin',
        redirect: true 
      })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Fallback: redirection manuelle
      window.location.href = '/auth/signin'
    }
  }


  // Update body class for grid layout
  useEffect(() => {
    const appShell = document.querySelector('.app-shell')
    if (appShell) {
      if (isCollapsed) {
        appShell.classList.remove('sidebar-open')
      } else {
        appShell.classList.add('sidebar-open')
      }
    }
  }, [isCollapsed])

  return (
    <div className="min-h-screen bg-gray-50 app-shell">
      {/* Enhanced Sidebar */}
      <EnhancedSidebar />

      {/* Main content */}
      <div className="app-content transition-all duration-200">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notification Center */}
              <NotificationCenter />
              
              {/* Language Selector */}
              <LanguageSelector variant="compact" />
              
              {/* User menu */}
              <div className="flex items-center gap-x-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Utilisateur Admin</p>
                  <p className="text-gray-500">Mode Test</p>
                </div>
                
                {/* Bouton d'accès à la page d'accueil */}
                <Link
                  href="/"
                  className="flex items-center gap-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Site Public
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Widget de Support Unifié */}
      <UnifiedSupportWidget position="bottom-right" />

      {/* POS/PDV Floating Button */}
      <PricingPOS />

    </div>
  )
}
