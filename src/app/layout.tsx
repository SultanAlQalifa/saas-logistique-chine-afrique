import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import PWAInstaller from '@/components/PWAInstaller'
import DynamicFooter from '@/components/DynamicFooter'
import { UnifiedSupportWidget } from '@/components/ui/unified-support-widget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextMove - Chine Afrique',
  description: 'Plateforme de gestion logistique entre la Chine et l\'Afrique',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NextMove',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'NextMove',
    title: 'NextMove - Chine Afrique',
    description: 'Plateforme de gestion logistique entre la Chine et l\'Afrique',
  },
  twitter: {
    card: 'summary',
    title: 'NextMove - Chine Afrique',
    description: 'Plateforme de gestion logistique entre la Chine et l\'Afrique',
  },
}

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NextMove" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent hydration mismatches by ensuring consistent client/server state
              if (typeof window !== 'undefined') {
                window.__WINDSURF_HYDRATION_FIX__ = true;
              }
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div suppressHydrationWarning>
            {children}
            <DynamicFooter />
            <UnifiedSupportWidget />
          </div>
        </Providers>
        <PWAInstaller />
      </body>
    </html>
  )
}
