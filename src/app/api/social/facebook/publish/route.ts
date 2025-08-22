import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { content, mediaUrl, scheduledAt } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Contenu manquant' },
        { status: 400 }
      )
    }

    // Publier sur Facebook
    const facebookResponse = await publishToFacebook({
      content,
      mediaUrl,
      scheduledAt
    })

    return NextResponse.json({
      success: true,
      postId: facebookResponse.postId,
      status: scheduledAt ? 'scheduled' : 'published',
      timestamp: new Date().toISOString(),
      platform: 'facebook'
    })

  } catch (error) {
    console.error('Erreur publication Facebook:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

async function publishToFacebook({ content, mediaUrl, scheduledAt }: {
  content: string
  mediaUrl?: string
  scheduledAt?: string
}) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN
  const pageId = process.env.FACEBOOK_PAGE_ID

  if (!accessToken || !pageId) {
    throw new Error('Configuration Facebook manquante')
  }

  // Simulation de la réponse
  return {
    postId: `fb_${Date.now()}`,
    status: 'published'
  }

  // Code réel pour l'API Facebook (commenté)
  /*
  const apiUrl = `https://graph.facebook.com/v18.0/${pageId}/feed`
  
  const payload: any = {
    message: content,
    access_token: accessToken
  }

  if (mediaUrl) {
    payload.link = mediaUrl
  }

  if (scheduledAt) {
    payload.published = false
    payload.scheduled_publish_time = Math.floor(new Date(scheduledAt).getTime() / 1000)
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Erreur API Facebook: ${response.statusText}`)
  }

  return response.json()
  */
}
