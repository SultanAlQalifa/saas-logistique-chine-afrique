import { NextRequest, NextResponse } from 'next/server'
import CookieService from '@/lib/cookies.server'
import SessionService from '@/lib/session.server'

export async function POST(request: NextRequest) {
  try {
    const { consent } = await request.json()
    
    if (!['accepted', 'declined'].includes(consent)) {
      return NextResponse.json({ error: 'Invalid consent value' }, { status: 400 })
    }

    const response = NextResponse.json({ success: true })
    
    // Set consent cookie
    CookieService.setConsentCookie(response, consent)
    
    return response
  } catch (error) {
    console.error('Error setting consent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const consent = CookieService.getConsentCookie()
    
    return NextResponse.json({ 
      consent: consent || 'unset',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting consent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
