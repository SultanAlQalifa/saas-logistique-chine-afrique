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

    const { userId, invoiceNo, amount, dueDate } = await request.json()

    if (!userId || !invoiceNo || !amount || !dueDate) {
      return NextResponse.json(
        { error: 'Paramètres manquants: userId, invoiceNo, amount, dueDate requis' },
        { status: 400 }
      )
    }

    const whatsapp = WhatsAppIntegration.getInstance()
    const success = await whatsapp.sendInvoiceDue(userId, invoiceNo, amount, dueDate)

    return NextResponse.json({
      success,
      message: success 
        ? 'Notification de facture envoyée avec succès'
        : 'Utilisateur non lié à WhatsApp ou opt-out'
    })

  } catch (error) {
    console.error('Erreur notification facture WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
