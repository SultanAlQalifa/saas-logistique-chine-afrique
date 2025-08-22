import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WhatsAppProactiveNotifications } from '@/lib/whatsapp-proactive-notifications'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { type, user_id, msisdn, data } = await request.json()

    if (!type || !user_id) {
      return NextResponse.json(
        { error: 'Paramètres manquants: type et user_id requis' },
        { status: 400 }
      )
    }

    const notifications = WhatsAppProactiveNotifications.getInstance()
    
    // Dispatcher vers le bon handler selon le type d'événement
    let success = false
    
    switch (type) {
      case 'tracking_update':
        const { shipmentId, status, eta } = data
        success = await notifications.notifyTrackingUpdate(user_id, shipmentId, status, eta)
        break
      
      case 'invoice_due':
        const { invoiceNo, amount, currency, dueDate } = data
        success = await notifications.notifyInvoiceDue(user_id, invoiceNo, amount, currency, dueDate)
        break
      
      case 'registration_success':
        const { name } = data
        success = await notifications.notifyRegistrationWelcome(user_id, name)
        break
      
      case 'quote_ready':
        const { quoteId, amount: quoteAmount, currency: quoteCurrency, validUntil } = data
        success = await notifications.notifyQuoteReady(user_id, quoteId, quoteAmount, quoteCurrency, validUntil)
        break
      
      default:
        return NextResponse.json(
          { error: `Type d'événement non supporté: ${type}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success,
      message: success 
        ? 'Notification envoyée avec succès'
        : 'Échec envoi notification (utilisateur non lié ou opt-out)'
    })

  } catch (error) {
    console.error('Erreur traitement événement:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
