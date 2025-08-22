import { NextRequest, NextResponse } from 'next/server'
import CookieService from '@/lib/cookies.server'

export async function POST(request: NextRequest) {
  try {
    const { theme, language, sidebar } = await request.json()
    
    const response = NextResponse.json({ success: true })
    
    // Set preference cookies (non-HttpOnly for client access)
    if (theme && ['light', 'dark', 'system'].includes(theme)) {
      CookieService.setPreferenceCookie(response, 'nm_theme', theme)
    }
    
    if (language && ['fr', 'en'].includes(language)) {
      CookieService.setPreferenceCookie(response, 'nm_lang', language)
    }
    
    if (sidebar && ['rail', 'expanded'].includes(sidebar)) {
      CookieService.setPreferenceCookie(response, 'nm_sb', sidebar)
    }
    
    return response
  } catch (error) {
    console.error('Error setting preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const theme = CookieService.getCookie('nm_theme') || 'system'
    const language = CookieService.getCookie('nm_lang') || 'fr'
    const sidebar = CookieService.getCookie('nm_sb') || 'expanded'
    
    return NextResponse.json({ 
      theme,
      language,
      sidebar,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
