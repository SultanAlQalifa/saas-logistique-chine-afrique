import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Simuler le chargement de la configuration mailing
    const config = {
      smtp: {
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      },
      from: {
        name: process.env.MAIL_FROM_NAME || 'NextMove Cargo',
        email: process.env.MAIL_FROM_EMAIL || ''
      },
      templates: {}
    }

    return NextResponse.json(config)

  } catch (error) {
    console.error('Erreur chargement config mailing:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const config = await request.json()

    // Validation des données
    if (!config.smtp?.host || !config.smtp?.auth?.user) {
      return NextResponse.json(
        { error: 'Configuration SMTP incomplète' },
        { status: 400 }
      )
    }

    // Dans un vrai projet, sauvegarder en base de données chiffrée
    // Ici on simule la sauvegarde
    console.log('Configuration mailing sauvegardée:', {
      host: config.smtp.host,
      port: config.smtp.port,
      user: config.smtp.auth.user,
      fromName: config.from.name,
      fromEmail: config.from.email
    })

    return NextResponse.json({
      success: true,
      message: 'Configuration mailing sauvegardée avec succès'
    })

  } catch (error) {
    console.error('Erreur sauvegarde config mailing:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
