import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// API pour les super admins - accès aux données de la plateforme
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    // Vérifier que l'utilisateur est un SUPER_ADMIN
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Seuls les super admins peuvent accéder à ces données.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Données simulées de la plateforme
    const platformData = {
      users: [
        {
          id: '1',
          email: 'admin@company1.com',
          role: 'ADMIN',
          company: 'Entreprise Import-Export',
          createdAt: '2024-01-15T10:00:00Z',
          lastLogin: '2024-01-20T14:30:00Z',
          status: 'active'
        },
        {
          id: '2',
          email: 'client@company1.com',
          role: 'CLIENT',
          company: 'Entreprise Import-Export',
          createdAt: '2024-01-16T09:00:00Z',
          lastLogin: '2024-01-20T11:15:00Z',
          status: 'active'
        }
      ],
      companies: [
        {
          id: '1',
          name: 'Entreprise Import-Export',
          email: 'contact@company1.com',
          country: 'Côte d\'Ivoire',
          subscription: 'premium',
          createdAt: '2024-01-15T10:00:00Z',
          totalRevenue: 15000,
          activeUsers: 5,
          packagesCount: 120
        }
      ],
      packages: [
        {
          id: '1',
          trackingNumber: 'PKG001',
          sender: 'Guangzhou Supplier',
          recipient: 'Abidjan Client',
          status: 'in_transit',
          weight: 25.5,
          value: 2500,
          currency: 'XOF',
          createdAt: '2024-01-18T08:00:00Z',
          estimatedDelivery: '2024-02-15T12:00:00Z'
        }
      ],
      transactions: [
        {
          id: '1',
          companyId: '1',
          amount: 50000,
          currency: 'XOF',
          type: 'subscription',
          status: 'completed',
          createdAt: '2024-01-15T10:00:00Z'
        }
      ],
      analytics: {
        totalUsers: 1250,
        totalCompanies: 85,
        totalPackages: 5420,
        totalRevenue: 2850000,
        monthlyGrowth: 12.5,
        activeUsersToday: 340,
        packagesThisMonth: 890,
        revenueThisMonth: 450000
      },
      systemHealth: {
        uptime: '99.9%',
        responseTime: '120ms',
        errorRate: '0.1%',
        activeConnections: 1250,
        serverLoad: '45%',
        databaseSize: '2.4GB',
        lastBackup: '2024-01-20T02:00:00Z'
      }
    }

    // Retourner les données selon le type demandé
    switch (dataType) {
      case 'users':
        return NextResponse.json({
          data: platformData.users.slice(offset, offset + limit),
          total: platformData.users.length,
          limit,
          offset
        })
      
      case 'companies':
        return NextResponse.json({
          data: platformData.companies.slice(offset, offset + limit),
          total: platformData.companies.length,
          limit,
          offset
        })
      
      case 'packages':
        return NextResponse.json({
          data: platformData.packages.slice(offset, offset + limit),
          total: platformData.packages.length,
          limit,
          offset
        })
      
      case 'transactions':
        return NextResponse.json({
          data: platformData.transactions.slice(offset, offset + limit),
          total: platformData.transactions.length,
          limit,
          offset
        })
      
      case 'analytics':
        return NextResponse.json({
          data: platformData.analytics
        })
      
      case 'system':
        return NextResponse.json({
          data: platformData.systemHealth
        })
      
      default:
        return NextResponse.json({
          data: {
            users: platformData.users.length,
            companies: platformData.companies.length,
            packages: platformData.packages.length,
            transactions: platformData.transactions.length,
            analytics: platformData.analytics,
            system: platformData.systemHealth
          }
        })
    }

  } catch (error) {
    console.error('Erreur API platform-data:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, data } = body

    // Actions disponibles pour les super admins
    switch (action) {
      case 'export_data':
        return NextResponse.json({
          message: 'Export des données initié',
          exportId: `export_${Date.now()}`,
          estimatedTime: '5-10 minutes'
        })
      
      case 'backup_database':
        return NextResponse.json({
          message: 'Sauvegarde de la base de données initiée',
          backupId: `backup_${Date.now()}`,
          estimatedTime: '2-5 minutes'
        })
      
      case 'system_maintenance':
        return NextResponse.json({
          message: 'Mode maintenance activé',
          maintenanceId: `maint_${Date.now()}`,
          duration: data.duration || '30 minutes'
        })
      
      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Erreur API platform-data POST:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
