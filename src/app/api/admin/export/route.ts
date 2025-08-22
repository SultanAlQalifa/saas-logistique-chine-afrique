import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

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
    const { type, format, filters } = body

    // Types d'export disponibles
    const exportTypes = ['users', 'companies', 'packages', 'transactions', 'analytics']
    const exportFormats = ['csv', 'xlsx', 'json', 'pdf']

    if (!exportTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Type d\'export non valide' },
        { status: 400 }
      )
    }

    if (!exportFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Format d\'export non valide' },
        { status: 400 }
      )
    }

    // Simulation de génération d'export
    const exportId = `export_${type}_${Date.now()}`
    const filename = `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`

    // Dans un vrai projet, ici on générerait le fichier d'export
    // et on le stockerait temporairement ou on l'enverrait par email

    return NextResponse.json({
      success: true,
      exportId,
      filename,
      status: 'processing',
      estimatedTime: '2-5 minutes',
      downloadUrl: `/api/admin/download/${exportId}`,
      message: `Export ${type} en format ${format.toUpperCase()} initié`
    })

  } catch (error) {
    console.error('Erreur API export:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Liste des exports récents
    const recentExports = [
      {
        id: 'export_users_1705123456789',
        type: 'users',
        format: 'xlsx',
        status: 'completed',
        createdAt: '2024-01-20T10:30:00Z',
        fileSize: '2.4MB',
        downloadUrl: '/api/admin/download/export_users_1705123456789'
      },
      {
        id: 'export_packages_1705120000000',
        type: 'packages',
        format: 'csv',
        status: 'processing',
        createdAt: '2024-01-20T09:45:00Z',
        progress: 75
      }
    ]

    return NextResponse.json({
      exports: recentExports,
      availableTypes: ['users', 'companies', 'packages', 'transactions', 'analytics'],
      availableFormats: ['csv', 'xlsx', 'json', 'pdf']
    })

  } catch (error) {
    console.error('Erreur API export GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
