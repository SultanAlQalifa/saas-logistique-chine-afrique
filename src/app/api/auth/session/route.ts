import { NextRequest, NextResponse } from 'next/server'
import SessionService from '@/lib/session.server'
import CookieService from '@/lib/cookies.server'
import SecurityService from '@/lib/security.server'

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF for session operations
    const csrfToken = request.headers.get('x-csrf-token')
    const session = await SessionService.getSession(request)
    
    if (session && csrfToken) {
      const isValidCSRF = await SessionService.verifyCSRFToken(csrfToken, session)
      if (!isValidCSRF) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
      }
    }

    const { action, userData } = await request.json()
    const response = NextResponse.json({ success: true })

    switch (action) {
      case 'create':
        if (!userData || !userData.userId || !userData.email || !userData.role) {
          return NextResponse.json({ error: 'Missing required user data' }, { status: 400 })
        }
        
        await SessionService.setSessionCookie(response, userData)
        
        // Generate and set CSRF token
        const newSession = await SessionService.createSession(userData)
        const sessionData = await SessionService.verifySession(newSession)
        if (sessionData) {
          const csrfToken = await SecurityService.generateCSRFToken(sessionData.userId)
          CookieService.setCSRFToken(response, csrfToken)
        }
        
        return response

      case 'refresh':
        if (!session) {
          return NextResponse.json({ error: 'No active session' }, { status: 401 })
        }
        
        await SessionService.refreshSession(response, session)
        return response

      case 'destroy':
        SessionService.clearSession(response)
        CookieService.deleteCookie(response, 'nm_csrf')
        return response

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await SessionService.getSession(request)
    
    if (!session) {
      return NextResponse.json({ 
        authenticated: false,
        session: null 
      })
    }

    // Validate session security
    if (!SessionService.validateSessionSecurity(session, request)) {
      const response = NextResponse.json({ 
        authenticated: false,
        session: null,
        error: 'Session security validation failed'
      })
      SessionService.clearSession(response)
      return response
    }

    return NextResponse.json({ 
      authenticated: true,
      session: {
        userId: session.userId,
        email: session.email,
        role: session.role,
        tenantId: session.tenantId,
        expiresAt: new Date(session.exp * 1000).toISOString()
      }
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
