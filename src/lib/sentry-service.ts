import * as Sentry from '@sentry/nextjs'

export class SentryService {
  static init() {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      console.log('Sentry initialized for NextMove Cargo')
    }
  }

  static captureError(error: Error, context?: Record<string, any>) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        tags: {
          component: 'NextMove Cargo',
          environment: process.env.NODE_ENV,
        },
        extra: context,
      })
    } else {
      console.error('Error captured:', error, context)
    }
  }

  static captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(message, {
        level: level as any,
        tags: {
          component: 'NextMove Cargo',
          environment: process.env.NODE_ENV,
        },
        extra: context,
      })
    } else {
      console.log(`[${level.toUpperCase()}] ${message}`, context)
    }
  }

  static setUser(user: { id: string; email?: string; role?: string }) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    })
  }

  static addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    })
  }

  static startTransaction(name: string, op: string) {
    if (process.env.NODE_ENV === 'production') {
      // Use modern Sentry performance API
      return Sentry.startSpan({
        name,
        op,
      }, () => {})
    }
    return null
  }

  static captureApiError(endpoint: string, error: Error, statusCode?: number) {
    this.captureError(error, {
      endpoint,
      statusCode,
      type: 'api_error',
    })
  }

  static capturePaymentError(provider: string, error: Error, amount?: number) {
    this.captureError(error, {
      provider,
      amount,
      type: 'payment_error',
    })
  }

  static captureWhatsAppError(error: Error, phoneNumber?: string) {
    this.captureError(error, {
      phoneNumber: phoneNumber ? phoneNumber.replace(/\d{4}$/, '****') : undefined,
      type: 'whatsapp_error',
    })
  }

  static captureTrackingError(trackingNumber: string, error: Error) {
    this.captureError(error, {
      trackingNumber,
      type: 'tracking_error',
    })
  }
}

export default SentryService
