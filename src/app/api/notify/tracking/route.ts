import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WhatsAppIntegration } from '@/lib/whatsapp-integration'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { userId, shipmentId, status, eta } = await request.json()

    if (!userId || !shipmentId || !status) {
      return NextResponse.json(
        { error: 'Paramètres manquants: userId, shipmentId, status requis' },
        { status: 400 }
      )
    }

    const whatsapp = WhatsAppIntegration.getInstance()
    const success = await whatsapp.sendTrackingUpdate(userId, shipmentId, status, eta || 'Non défini')

    return NextResponse.json({
      success,
      message: success 
        ? 'Notification de suivi envoyée avec succès'
        : 'Utilisateur non lié à WhatsApp ou opt-out'
    })

  } catch (error) {
    console.error('Erreur notification tracking WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
