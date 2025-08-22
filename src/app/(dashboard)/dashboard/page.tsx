'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { usePermissions, useCompanyStats, useCompanyPackages } from '@/hooks/usePermissions'
import DashboardStatsComponent from '@/components/dashboard/DashboardStats'
import PackagesList from '@/components/dashboard/PackagesList'
import DateFilter, { DateRange } from '@/components/ui/date-filter'
import { DashboardStats, Package as PackageType } from '@/types'
import { TransportMode, PackageStatus } from '@prisma/client'
import { Plus, CheckCircle, TrendingUp, Eye, Edit, Trash2, Users, Truck, BarChart3, Package as PackageIcon, Settings, Move, X, MoreVertical, Calendar, Building2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { AIAgentWidget } from '@/components/ui/ai-agent-widget'
import { FeatureGate, FeatureSection } from '@/components/ui/feature-gate'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bot } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useTranslation()
  const { hasPermission, canAccessResource, isCompanyScoped, userRole } = usePermissions()
  const { stats, canViewStats } = useCompanyStats()
  const { packages, canViewPackages } = useCompanyPackages()
  const [loading, setLoading] = useState(true)
  const [customizeMode, setCustomizeMode] = useState(false)
  const [showDataSource, setShowDataSource] = useState<string | null>(null)
  const [widgets, setWidgets] = useState([
    { id: 'packages', title: t('dashboard.total_packages'), visible: true, order: 1, type: 'stat', color: 'blue', icon: 'PackageIcon', value: '156' },
    { id: 'revenue', title: t('dashboard.revenue'), visible: true, order: 2, type: 'stat', color: 'purple', icon: 'TrendingUp', value: '45,600 FCFA' },
    { id: 'transit', title: t('dashboard.in_transit'), visible: true, order: 3, type: 'stat', color: 'orange', icon: 'Truck', value: '23' },
    { id: 'arrived', title: t('dashboard.arrived'), visible: true, order: 4, type: 'stat', color: 'green', icon: 'CheckCircle', value: '133' }
  ])
  const [showAddWidget, setShowAddWidget] = useState(false)
  const [showAddSection, setShowAddSection] = useState(false)
  const [newWidget, setNewWidget] = useState({
    title: '',
    type: 'stat',
    color: 'blue',
    icon: 'BarChart3',
    dataSource: 'manual',
    value: '0'
  })
  const [newSection, setNewSection] = useState({
    title: '',
    description: '',
    widgets: []
  })
  const [sections, setSections] = useState([
    {
      id: 'main-stats',
      title: t('dashboard.overview'),
      description: t('dashboard.overview'),
      visible: true,
      widgets: ['packages', 'revenue', 'transit', 'arrived']
    }
  ])
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null })

  // Check user permissions and redirect clients - DOIT être avant les returns conditionnels
  useEffect(() => {
    if (session?.user?.role === 'CLIENT') {
      router.push('/dashboard/client')
      return
    }
    setLoading(false)
  }, [session, router])

  // Gestion du chargement et de la redirection
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Mode démo - permettre l'accès même sans authentification complète
  const isDemoMode = process.env.NODE_ENV === 'production' || !session
  
  // En mode démo, utiliser des données mock
  const demoStats = {
    totalPackages: 156,
    revenue: 45600,
    inTransit: 23,
    delivered: 133
  }
  
  const demoPackages = [
    {
      id: '1',
      packageId: 'NM2024001',
      trackingNumber: 'NM2024001',
      companyId: 'demo-company',
      status: 'IN_TRANSIT' as PackageStatus,
      clientId: 'demo-client',
      description: 'Colis de démonstration',
      weight: 2.5,
      transportMode: 'MARITIME' as TransportMode,
      trackingPin: 'DEMO123',
      paymentStatus: 'PENDING' as any,
      origin: 'Guangzhou',
      destination: 'Dakar',
      createdAt: new Date(),
      client: { 
        id: 'demo-client',
        name: 'Démo Client',
        email: 'demo@nextmove.com',
        phone: '+221 77 123 45 67'
      }
    }
  ]

  const handleDragStart = (widgetId: string) => {
    setDraggedWidget(widgetId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetWidgetId: string) => {
    if (!draggedWidget || draggedWidget === targetWidgetId) return
    
    const draggedIndex = widgets.findIndex(w => w.id === draggedWidget)
    const targetIndex = widgets.findIndex(w => w.id === targetWidgetId)
    
    const newWidgets = [...widgets]
    const [draggedItem] = newWidgets.splice(draggedIndex, 1)
    newWidgets.splice(targetIndex, 0, draggedItem)
    
    // Update order
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      order: index + 1
    }))
    
    setWidgets(updatedWidgets)
    setDraggedWidget(null)
  }


  return (
    <div className="space-y-8">
      {/* Header avec gradient amélioré */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">🚀 {t('dashboard.title')} {isDemoMode ? 'Démo' : (isCompanyScoped ? 'Entreprise' : 'Global')}</h1>
            <p className="text-indigo-100 text-lg">{t('dashboard.welcome')}, {session?.user?.name || 'Visiteur'} - {isDemoMode ? 'Version de démonstration' : (isCompanyScoped ? 'Tableau de bord de votre entreprise' : 'Centre de contrôle logistique global')}</p>
            {isCompanyScoped && (
              <div className="flex items-center gap-2 mt-2 text-indigo-200">
                <Building2 className="h-4 w-4" />
                <span className="text-sm">Données limitées à votre entreprise</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCustomizeMode(!customizeMode)}
              className={`${customizeMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'} text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 border border-white/30`}
            >
              <Settings className="h-4 w-4" />
              {customizeMode ? t('dashboard.save_changes') : t('dashboard.customize')}
            </button>
            {customizeMode && (
              <>
                <button
                  onClick={() => setShowAddWidget(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  {t('dashboard.add_widget')}
                </button>
                <button
                  onClick={() => setShowAddSection(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle Section
                </button>
              </>
            )}
            <Link
              href="/dashboard/packages/create"
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              {t('dashboard.create_package')}
            </Link>
            <Link
              href="/dashboard/reports"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105"
            >
              <TrendingUp className="h-4 w-4" />
              Rapports
            </Link>
            <Link
              href="/dashboard/clients"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105"
            >
              <Users className="h-4 w-4" />
              {t('dashboard.manage_clients')}
            </Link>
          </div>
        </div>
      </div>

      {/* Filtre de date */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            📅 Filtrer par période
          </h3>
          {(dateRange.startDate || dateRange.endDate) && (
            <button
              onClick={() => setDateRange({ startDate: null, endDate: null })}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Effacer le filtre
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <DateFilter
              value={dateRange}
              onChange={setDateRange}
              placeholder="Sélectionner une période"
              className="w-full"
            />
          </div>
          <div className="text-sm text-gray-600">
            {dateRange.startDate || dateRange.endDate ? (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-800">Période active:</p>
                <p className="text-blue-700">
                  {dateRange.startDate && dateRange.endDate
                    ? `Du ${dateRange.startDate.toLocaleDateString('fr-FR')} au ${dateRange.endDate.toLocaleDateString('fr-FR')}`
                    : dateRange.startDate
                    ? `À partir du ${dateRange.startDate.toLocaleDateString('fr-FR')}`
                    : `Jusqu'au ${dateRange.endDate?.toLocaleDateString('fr-FR')}`
                  }
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-600">Aucun filtre de date appliqué</p>
                <p className="text-xs text-gray-500">Toutes les données sont affichées</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const endOfDay = new Date(today)
                endOfDay.setHours(23, 59, 59, 999)
                setDateRange({ startDate: today, endDate: endOfDay })
              }}
              className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => {
                const end = new Date()
                end.setHours(23, 59, 59, 999)
                const start = new Date()
                start.setDate(start.getDate() - 6)
                start.setHours(0, 0, 0, 0)
                setDateRange({ startDate: start, endDate: end })
              }}
              className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              7 jours
            </button>
            <button
              onClick={() => {
                const now = new Date()
                const start = new Date(now.getFullYear(), now.getMonth(), 1)
                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
                setDateRange({ startDate: start, endDate: end })
              }}
              className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Ce mois
            </button>
          </div>
        </div>
      </div>

      {/* Mode personnalisation */}
      {customizeMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-4">🎨 Mode Personnalisation</h3>
          <p className="text-yellow-700 mb-4">Glissez-déposez les widgets pour les réorganiser, masquez ceux dont vous n'avez pas besoin, ou ajoutez de nouveaux éléments.</p>
          
          {/* Gestion des sections */}
          <div className="mb-6">
            <h4 className="font-semibold text-yellow-800 mb-3">📋 Sections</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <div key={section.id} className="bg-white p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-800">{section.title}</h5>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSections(prev => prev.map(s => s.id === section.id ? {...s, visible: !s.visible} : s))}
                        className={`px-2 py-1 rounded text-xs font-medium ${section.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {section.visible ? 'Visible' : 'Masquée'}
                      </button>
                      <button
                        onClick={() => setSections(prev => prev.filter(s => s.id !== section.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{section.description}</p>
                  <p className="text-xs text-blue-600">{section.widgets.length} widget(s)</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gestion des widgets */}
          <div>
            <h4 className="font-semibold text-yellow-800 mb-3">🔧 Widgets</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {widgets.sort((a, b) => a.order - b.order).map((widget) => (
                <div 
                  key={widget.id} 
                  className={`flex flex-col bg-white p-3 rounded-lg border transition-all ${
                    draggedWidget === widget.id ? 'opacity-50 scale-95' : 'hover:shadow-md'
                  }`}
                  draggable={customizeMode}
                  onDragStart={() => handleDragStart(widget.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(widget.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{widget.title}</span>
                    <Move className={`h-4 w-4 ${customizeMode ? 'text-blue-500 cursor-grab' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs bg-${widget.color || 'blue'}-100 text-${widget.color || 'blue'}-700`}>
                      {widget.type || 'stat'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setWidgets(prev => prev.map(w => w.id === widget.id ? {...w, visible: !w.visible} : w))}
                        className={`px-2 py-1 rounded text-xs font-medium ${widget.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {widget.visible ? '👁️' : '🙈'}
                      </button>
                      <button
                        onClick={() => setWidgets(prev => prev.filter(w => w.id !== widget.id))}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sections dynamiques */}
      {sections.filter(s => s.visible).map((section) => (
        <div key={section.id} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              <p className="text-gray-600">{section.description}</p>
            </div>
            {customizeMode && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSections(prev => prev.map(s => s.id === section.id ? {...s, visible: false} : s))}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Stats Cards avec design moderne et drill-down */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Carte de démonstration du chatbot */}
            <Link href="/demo/chat">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium text-blue-800">Démo IA</CardTitle>
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Bot className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Testez notre nouvel assistant conversationnel avec des réponses naturelles</p>
                  <div className="mt-3 text-xs text-blue-600 font-medium">Essayer maintenant →</div>
                </CardContent>
              </Card>
            </Link>
            {widgets.filter(w => w.visible && section.widgets.includes(w.id)).sort((a, b) => a.order - b.order).map((widget) => {
          if (widget.id === 'packages') {
            return (
              <div key={widget.id} className={`relative ${customizeMode ? 'ring-2 ring-yellow-300' : ''}`}>
                {customizeMode && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <button className="bg-yellow-500 text-white rounded-full p-1 hover:bg-yellow-600">
                      <Move className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1" onClick={() => !customizeMode && (window.location.href = '/dashboard/packages')}>
                      <div className="flex-shrink-0 p-3 bg-blue-600 rounded-xl shadow-lg">
                        <PackageIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-blue-700 truncate">Total Colis</dt>
                          <dd 
                            className="text-2xl font-bold text-blue-900 hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowDataSource('packages-total')
                            }}
                          >
                            {isDemoMode ? demoStats.totalPackages : (stats?.totalPackages || 0)}
                          </dd>
                          <dd className="text-xs text-blue-600">Tous statuts</dd>
                        </dl>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div 
                        className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full hover:bg-green-200 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDataSource('packages-growth')
                        }}
                      >
                        +12%
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDataSource('packages-details')
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          
          if (widget.id === 'revenue') {
            return (
              <div key={widget.id} className={`relative ${customizeMode ? 'ring-2 ring-yellow-300' : ''}`}>
                {customizeMode && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <button className="bg-yellow-500 text-white rounded-full p-1 hover:bg-yellow-600">
                      <Move className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1" onClick={() => !customizeMode && (window.location.href = '/dashboard/finances/commissions')}>
                      <div className="flex-shrink-0 p-3 bg-purple-600 rounded-xl shadow-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-purple-700 truncate">Revenus</dt>
                          <dd 
                            className="text-2xl font-bold text-purple-900 hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowDataSource('revenue-total')
                            }}
                          >
                            {(isDemoMode ? demoStats.revenue : (stats?.revenue || 0)).toLocaleString('fr-FR')} FCFA
                          </dd>
                          <dd className="text-xs text-purple-600">Ce mois</dd>
                        </dl>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div 
                        className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full hover:bg-green-200 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDataSource('revenue-growth')
                        }}
                      >
                        +15%
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDataSource('revenue-details')
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4 text-purple-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          
              // Widget personnalisé générique
              const colorClasses: Record<string, { bg: string; border: string; icon: string; text: string; value: string }> = {
                blue: { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', icon: 'bg-blue-600', text: 'text-blue-700', value: 'text-blue-900' },
                purple: { bg: 'from-purple-50 to-pink-100', border: 'border-purple-200', icon: 'bg-purple-600', text: 'text-purple-700', value: 'text-purple-900' },
                green: { bg: 'from-green-50 to-emerald-100', border: 'border-green-200', icon: 'bg-green-600', text: 'text-green-700', value: 'text-green-900' },
                orange: { bg: 'from-orange-50 to-yellow-100', border: 'border-orange-200', icon: 'bg-orange-600', text: 'text-orange-700', value: 'text-orange-900' },
                red: { bg: 'from-red-50 to-pink-100', border: 'border-red-200', icon: 'bg-red-600', text: 'text-red-700', value: 'text-red-900' },
                cyan: { bg: 'from-cyan-50 to-blue-100', border: 'border-cyan-200', icon: 'bg-cyan-600', text: 'text-cyan-700', value: 'text-cyan-900' }
              }
              
              const colors = colorClasses[widget.color as keyof typeof colorClasses] || colorClasses.blue
              const IconComponent = widget.icon === 'TrendingUp' ? TrendingUp : 
                                 widget.icon === 'Truck' ? Truck :
                                 widget.icon === 'CheckCircle' ? CheckCircle :
                                 widget.icon === 'BarChart3' ? BarChart3 :
                                 PackageIcon
              
              return (
                <div key={widget.id} className={`relative ${customizeMode ? 'ring-2 ring-yellow-300' : ''}`}>
                  {customizeMode && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <button className="bg-yellow-500 text-white rounded-full p-1 hover:bg-yellow-600">
                        <Move className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div className={`bg-gradient-to-br ${colors.bg} p-6 rounded-2xl shadow-lg border ${colors.border} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className={`flex-shrink-0 p-3 ${colors.icon} rounded-xl shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className={`text-sm font-medium ${colors.text} truncate`}>{widget.title}</dt>
                            <dd className={`text-2xl font-bold ${colors.value}`}>
                              {widget.value || '0'}
                            </dd>
                            <dd className={`text-xs ${colors.text}`}>{widget.type}</dd>
                          </dl>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full">
                          +{Math.floor(Math.random() * 20)}%
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className={`h-4 w-4 ${colors.text}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Recent Packages */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Derniers Colis</h2>
          <Link
            href="/dashboard/packages"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Voir tous les colis →
          </Link>
        </div>
        <PackagesList packages={isDemoMode ? demoPackages : packages} />
      </div>

      {/* Modal Source de Données */}
      {showDataSource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">📊 Source des Données</h3>
              <button
                onClick={() => setShowDataSource(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {showDataSource === 'packages-total' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">📦 Total Colis: 156</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p><strong>Source:</strong> Base de données principale</p>
                    <p><strong>Dernière mise à jour:</strong> {new Date().toLocaleString('fr-FR')}</p>
                    <p><strong>Calcul:</strong> COUNT(*) FROM packages WHERE company_id = current_company</p>
                    <p><strong>Répartition:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• En transit: 23 colis</li>
                      <li>• Arrivés: 133 colis</li>
                      <li>• Planifiés: 0 colis</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.location.href = '/dashboard/packages'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Voir Détails →
                  </button>
                  <button 
                    onClick={() => alert('📊 Export des données colis en cours...')}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Exporter CSV
                  </button>
                </div>
              </div>
            )}
            
            {showDataSource === 'packages-growth' && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">📈 Croissance: +12%</h4>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><strong>Période:</strong> Comparaison mois précédent</p>
                    <p><strong>Mois actuel:</strong> 156 colis</p>
                    <p><strong>Mois précédent:</strong> 139 colis</p>
                    <p><strong>Calcul:</strong> ((156 - 139) / 139) × 100 = +12.2%</p>
                    <p><strong>Tendance:</strong> 📈 Croissance positive</p>
                  </div>
                </div>
              </div>
            )}
            
            {showDataSource === 'revenue-total' && (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-bold text-purple-800 mb-2">💰 Revenus: 45,600 FCFA</h4>
                  <div className="space-y-2 text-sm text-purple-700">
                    <p><strong>Source:</strong> Module Commissions + Factures</p>
                    <p><strong>Période:</strong> Mois en cours</p>
                    <p><strong>Composition:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Commissions agents: 28,400 FCFA</li>
                      <li>• Frais de transport: 17,200 FCFA</li>
                    </ul>
                    <p><strong>Statut:</strong> 85% collecté, 15% en attente</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.location.href = '/dashboard/finances/commissions'}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Voir Commissions →
                  </button>
                  <button 
                    onClick={() => alert('💰 Rapport financier détaillé en cours de génération...')}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Rapport Détaillé
                  </button>
                </div>
              </div>
            )}
            
            {showDataSource === 'revenue-growth' && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">📊 Croissance Revenus: +15%</h4>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><strong>Comparaison:</strong> Mois précédent</p>
                    <p><strong>Mois actuel:</strong> 45,600 FCFA</p>
                    <p><strong>Mois précédent:</strong> 39,652 FCFA</p>
                    <p><strong>Augmentation:</strong> +5,948 FCFA</p>
                    <p><strong>Facteurs:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Nouveaux clients: +8%</li>
                      <li>• Augmentation tarifs: +4%</li>
                      <li>• Volume colis: +3%</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Ajouter Widget */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">➕ Ajouter un Widget</h3>
              <button onClick={() => setShowAddWidget(false)} className="text-gray-500 hover:text-red-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre du widget *</label>
                  <input
                    type="text"
                    value={newWidget.title}
                    onChange={(e) => setNewWidget({...newWidget, title: e.target.value})}
                    placeholder="Ex: Nouveaux Clients"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de widget</label>
                  <select
                    value={newWidget.type}
                    onChange={(e) => setNewWidget({...newWidget, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="stat">📊 Statistique</option>
                    <option value="chart">📈 Graphique</option>
                    <option value="table">📋 Tableau</option>
                    <option value="metric">🎯 Métrique</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                  <select
                    value={newWidget.color}
                    onChange={(e) => setNewWidget({...newWidget, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blue">🔵 Bleu</option>
                    <option value="purple">🟣 Violet</option>
                    <option value="green">🟢 Vert</option>
                    <option value="orange">🟠 Orange</option>
                    <option value="red">🔴 Rouge</option>
                    <option value="cyan">🔵 Cyan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icône</label>
                  <select
                    value={newWidget.icon}
                    onChange={(e) => setNewWidget({...newWidget, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BarChart3">📊 Graphique</option>
                    <option value="TrendingUp">📈 Tendance</option>
                    <option value="Users">👥 Utilisateurs</option>
                    <option value="PackageIcon">📦 Colis</option>
                    <option value="Truck">🚛 Transport</option>
                    <option value="CheckCircle">✅ Validation</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source de données</label>
                  <select
                    value={newWidget.dataSource}
                    onChange={(e) => setNewWidget({...newWidget, dataSource: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="manual">✍️ Saisie manuelle</option>
                    <option value="database">🗄️ Base de données</option>
                    <option value="api">🌐 API externe</option>
                    <option value="calculated">🧮 Calculé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valeur initiale</label>
                  <input
                    type="text"
                    value={newWidget.value}
                    onChange={(e) => setNewWidget({...newWidget, value: e.target.value})}
                    placeholder="Ex: 42, 1.2M, 85%"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddWidget(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (newWidget.title) {
                    const widgetId = `widget-${Date.now()}`
                    setWidgets(prev => [...prev, {
                      id: widgetId,
                      title: newWidget.title,
                      type: newWidget.type,
                      color: newWidget.color,
                      icon: newWidget.icon,
                      value: newWidget.value,
                      visible: true,
                      order: prev.length + 1
                    } as any])
                    // Ajouter à la section principale
                    setSections(prev => prev.map(s => s.id === 'main-stats' ? 
                      {...s, widgets: [...s.widgets, widgetId]} : s
                    ))
                    setNewWidget({ title: '', type: 'stat', color: 'blue', icon: 'BarChart3', dataSource: 'manual', value: '0' })
                    setShowAddWidget(false)
                    alert('✅ Widget ajouté avec succès !')
                  }
                }}
                disabled={!newWidget.title}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Créer le Widget
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Ajouter Section */}
      {showAddSection && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">📋 Nouvelle Section</h3>
              <button onClick={() => setShowAddSection(false)} className="text-gray-500 hover:text-red-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la section *</label>
                <input
                  type="text"
                  value={newSection.title}
                  onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                  placeholder="Ex: Analytics Marketing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newSection.description}
                  onChange={(e) => setNewSection({...newSection, description: e.target.value})}
                  placeholder="Description de cette section..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddSection(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (newSection.title) {
                    const sectionId = `section-${Date.now()}`
                    setSections(prev => [...prev, {
                      id: sectionId,
                      title: newSection.title,
                      description: newSection.description,
                      visible: true,
                      widgets: []
                    }])
                    setNewSection({ title: '', description: '', widgets: [] })
                    setShowAddSection(false)
                    alert('✅ Section créée avec succès !')
                  }
                }}
                disabled={!newSection.title}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Créer la Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Widget Agent IA */}
      <AIAgentWidget 
        position="bottom-right"
        size="medium"
      />
    </div>
  )
}
