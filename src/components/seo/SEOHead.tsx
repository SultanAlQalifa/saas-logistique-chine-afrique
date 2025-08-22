'use client'

import Head from 'next/head'
import { generateStructuredData, siteConfig } from '@/lib/seo'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
  noIndex?: boolean
  structuredDataType?: 'Organization' | 'WebSite' | 'Service' | 'Article'
  structuredData?: any
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  noIndex = false,
  structuredDataType = 'WebSite',
  structuredData
}: SEOHeadProps) {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const pageDescription = description || siteConfig.description
  const pageKeywords = keywords?.join(', ') || siteConfig.keywords.join(', ')
  const pageOgImage = ogImage || siteConfig.ogImage
  const fullOgImageUrl = pageOgImage.startsWith('http') ? pageOgImage : `${siteConfig.url}${pageOgImage}`

  // Générer les données structurées
  const jsonLd = structuredData || generateStructuredData(structuredDataType)

  return (
    <Head>
      {/* Métadonnées de base */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={siteConfig.author} />
      <meta name="creator" content={siteConfig.creator} />
      <meta name="publisher" content={siteConfig.publisher} />
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : siteConfig.robots} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:url" content={canonical || siteConfig.url} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.language} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@nextmovecargo" />
      <meta name="twitter:creator" content="@nextmovecargo" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={fullOgImageUrl} />
      
      {/* Langues alternatives */}
      <link rel="alternate" hrefLang="fr-FR" href={`${siteConfig.url}/fr`} />
      <link rel="alternate" hrefLang="en-US" href={`${siteConfig.url}/en`} />
      <link rel="alternate" hrefLang="x-default" href={siteConfig.url} />
      
      {/* Favicon et icônes */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Métadonnées mobiles */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#0ea5e9" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
      <meta name="application-name" content={siteConfig.name} />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Vérifications des moteurs de recherche */}
      {siteConfig.googleSiteVerification && (
        <meta name="google-site-verification" content={siteConfig.googleSiteVerification} />
      )}
      {siteConfig.bingVerification && (
        <meta name="msvalidate.01" content={siteConfig.bingVerification} />
      )}
      
      {/* Données structurées JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      {/* Préconnexions pour les performances */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Head>
  )
}
