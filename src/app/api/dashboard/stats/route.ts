import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/mock-data'
import { DashboardStats, ApiResponse } from '@/types/api'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<DashboardStats>>> {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    // Filtrer les données par entreprise si spécifié
    const packages = companyId 
      ? mockData.packages.filter(pkg => pkg.companyId === companyId)
      : mockData.packages

    const clients = companyId 
      ? mockData.clients.filter(client => client.companyId === companyId)
      : mockData.clients

    const agents = companyId 
      ? mockData.agents.filter(agent => agent.companyId === companyId)
      : mockData.agents

    const transactions = companyId 
      ? mockData.transactions.filter(tx => tx.companyId === companyId)
      : mockData.transactions

    // Calculs des statistiques
    const totalPackages = packages.length
    const totalRevenue = transactions
      .filter(tx => tx.status === 'COMPLETED')
      .reduce((sum, tx) => sum + tx.amount, 0)
    const totalClients = clients.length
    const totalAgents = agents.length

    // Croissance mensuelle (simulation)
    const monthlyGrowth = {
      packages: Math.floor(Math.random() * 20) + 5, // 5-25%
      revenue: Math.floor(Math.random() * 15) + 8,  // 8-23%
      clients: Math.floor(Math.random() * 10) + 3   // 3-13%
    }

    // Packages récents (5 derniers)
    const recentPackages = packages
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    // Top clients (par nombre de colis)
    const topClients = clients
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)

    // Revenus par mois (6 derniers mois)
    const revenueByMonth = [
      { month: 'Janvier', revenue: Math.floor(Math.random() * 5000000) + 2000000 },
      { month: 'Février', revenue: Math.floor(Math.random() * 5000000) + 2500000 },
      { month: 'Mars', revenue: Math.floor(Math.random() * 5000000) + 3000000 },
      { month: 'Avril', revenue: Math.floor(Math.random() * 5000000) + 3500000 },
      { month: 'Mai', revenue: Math.floor(Math.random() * 5000000) + 4000000 },
      { month: 'Juin', revenue: Math.floor(Math.random() * 5000000) + 4500000 }
    ]

    const stats: DashboardStats = {
      totalPackages,
      totalRevenue,
      totalClients,
      totalAgents,
      monthlyGrowth,
      recentPackages,
      topClients,
      revenueByMonth
    }

    return NextResponse.json({
      success: true,
      data: stats,
      message: 'Statistiques récupérées avec succès'
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    }, { status: 500 })
  }
}
