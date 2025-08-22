import { NextRequest, NextResponse } from 'next/server'
import { generateAllMockData } from '@/lib/mock-data'
import { ApiResponse } from '@/types/api'

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    // Générer toutes les données mock
    const allData = generateAllMockData()
    
    // Statistiques de génération
    const stats = {
      companies: allData.companies.length,
      users: allData.users.length,
      packages: allData.packages.length,
      clients: allData.clients.length,
      agents: allData.agents.length,
      transactions: allData.transactions.length,
      commissions: allData.commissions.length,
      cargos: allData.cargos.length
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Base de données initialisée avec succès',
        stats,
        generatedAt: new Date().toISOString()
      },
      message: `${stats.companies} entreprises, ${stats.packages} colis, ${stats.clients} clients générés`
    }, { status: 201 })
  } catch (error) {
    console.error('Error initializing data:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de l\'initialisation des données'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    // Retourner un aperçu des données disponibles
    const { mockData } = await import('@/lib/mock-data')
    
    const overview = {
      companies: mockData.companies.length,
      users: mockData.users.length,
      packages: mockData.packages.length,
      clients: mockData.clients.length,
      agents: mockData.agents.length,
      transactions: mockData.transactions.length,
      commissions: mockData.commissions.length,
      cargos: mockData.cargos.length,
      lastGenerated: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: overview,
      message: 'Aperçu des données disponibles'
    })
  } catch (error) {
    console.error('Error getting data overview:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération de l\'aperçu'
    }, { status: 500 })
  }
}
