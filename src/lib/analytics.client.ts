'use client'

import useCookieConsent from '@/hooks/useCookieConsent'
import ClientCookieService from './cookies.client'

export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  userId?: string
  sessionId?: string
}

export interface PageView {
  page: string
  title: string
  userId?: string
  sessionId?: string
}

class AnalyticsService {
  private isEnabled = false
  private sessionId: string | null = null
  private userId: string | null = null

  constructor() {
    this.init()
  }

  private init() {
    // Check consent status
    const consent = ClientCookieService.getCookie('nm_consent')
    this.isEnabled = consent === 'accepted'
    
    if (this.isEnabled) {
      this.generateSessionId()
    }
  }

  private generateSessionId() {
    // Generate anonymous session ID (no personal data)
    this.sessionId = `nm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Enable analytics after consent
  enable(userId?: string) {
    this.isEnabled = true
    this.userId = userId || null
    this.generateSessionId()
  }

  // Disable analytics
  disable() {
    this.isEnabled = false
    this.sessionId = null
    this.userId = null
  }

  // Track page view
  trackPageView(pageView: PageView) {
    if (!this.isEnabled) return

    const event = {
      type: 'page_view',
      ...pageView,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
    }

    this.sendEvent(event)
  }

  // Track custom event
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) return

    const analyticsEvent = {
      type: 'custom_event',
      ...event,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    }

    this.sendEvent(analyticsEvent)
  }

  // Track user interaction
  trackInteraction(element: string, action: string, context?: Record<string, any>) {
    this.trackEvent({
      action,
      category: 'interaction',
      label: element,
      ...context,
    })
  }

  // Track business events
  trackBusinessEvent(eventType: string, data: Record<string, any>) {
    this.trackEvent({
      action: eventType,
      category: 'business',
      label: JSON.stringify(data),
    })
  }

  // Send event to internal analytics (not third-party)
  private async sendEvent(event: any) {
    try {
      // Send to internal analytics endpoint
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
    } catch (error) {
      // Silently fail - don't break user experience
      console.debug('Analytics tracking failed:', error)
    }
  }

  // Get analytics status
  getStatus() {
    return {
      enabled: this.isEnabled,
      sessionId: this.sessionId,
      hasUserId: !!this.userId,
    }
  }
}

// Singleton instance
const analytics = new AnalyticsService()

// Hook for React components
export function useAnalytics() {
  const { analyticsEnabled } = useCookieConsent()

  // Update analytics status based on consent
  if (analyticsEnabled && !analytics.getStatus().enabled) {
    analytics.enable()
  } else if (!analyticsEnabled && analytics.getStatus().enabled) {
    analytics.disable()
  }

  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackBusinessEvent: analytics.trackBusinessEvent.bind(analytics),
    isEnabled: analytics.getStatus().enabled,
  }
}

export default analytics
