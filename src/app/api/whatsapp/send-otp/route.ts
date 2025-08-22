import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WhatsAppIntegration } from '@/lib/whatsapp-integration'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Numéro de téléphone requis' },
        { status: 400 }
      )
    }

    const whatsapp = WhatsAppIntegration.getInstance()
    const result = await whatsapp.linkUserAccount(
      session.user.id || session.user.email || 'anonymous',
      phoneNumber
    )

    return NextResponse.json(result)

  } catch (error) {
    console.error('Erreur envoi OTP WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
