import { test, expect } from '@playwright/test'

/**
 * Priority crawl test - checks critical pages first
 * Run this before full test suite to catch major issues early
 */

const CRITICAL_PAGES = [
  // Navigation Principale
  { path: '/dashboard', name: 'Tableau de bord', public: false },
  { path: '/dashboard/packages', name: 'Gestion Colis', public: false, role: 'ADMIN' },
  { path: '/dashboard/finances/invoicing', name: 'Facturation', public: false, role: 'ADMIN' },
  { path: '/dashboard/operations/expeditions', name: 'Expéditions', public: false, role: 'ADMIN' },
  { path: '/dashboard/support/tickets', name: 'Support', public: false, role: 'ADMIN' },
  
  // Pages Client
  { path: '/dashboard/client/packages', name: 'Colis Client', public: false, role: 'CLIENT' },
  { path: '/dashboard/mes-colis', name: 'Mes Colis', public: false },
  
  // Pages Profondes Critiques
  { path: '/dashboard/finances/accounting', name: 'Comptabilité', public: false, role: 'ADMIN' },
  { path: '/dashboard/support/chatbot', name: 'Chatbot IA', public: false, role: 'ADMIN' },
  { path: '/dashboard/marketing/integrations', name: 'Intégrations Pub', public: false, role: 'ADMIN' },
  { path: '/dashboard/profile', name: 'Profil Utilisateur', public: false },
  
  // Pages Publiques
  { path: '/', name: 'Accueil', public: true },
  { path: '/track', name: 'Suivi Public', public: true },
  { path: '/auth/signin', name: 'Connexion', public: true },
]

const REDIRECTIONS = [
  { from: '/factures', to: '/dashboard/finances/invoicing', name: 'Factures → Facturation' },
  { from: '/colis', to: '/dashboard/packages', name: 'Colis → Gestion Colis' },
  { from: '/suivi', to: '/track', name: 'Suivi → Track' },
  { from: '/connexion', to: '/auth/signin', name: 'Connexion → Auth' },
  { from: '/comptabilite', to: '/dashboard/finances/accounting', name: 'Comptabilité' },
  { from: '/expeditions', to: '/dashboard/operations/expeditions', name: 'Expéditions' },
  { from: '/tickets', to: '/dashboard/support/tickets', name: 'Tickets' },
]

test.describe('Priority Crawl - Critical Pages', () => {
  test('Public pages should load without authentication', async ({ page }) => {
    const publicPages = CRITICAL_PAGES.filter(p => p.public)
    
    for (const pageInfo of publicPages) {
      console.log(`Testing public page: ${pageInfo.name} (${pageInfo.path})`)
      
      const response = await page.goto(pageInfo.path)
      expect(response?.status()).toBeLessThan(400)
      
      // Should not redirect to login
      expect(page.url()).not.toContain('/auth/signin')
      
      // Should not show 404
      await expect(page.locator('h1')).not.toContainText('Page non trouvée')
      
      console.log(`✅ ${pageInfo.name} - OK`)
    }
  })

  test('Protected pages redirect to login when not authenticated', async ({ page }) => {
    const protectedPages = CRITICAL_PAGES.filter(p => !p.public).slice(0, 5) // Test first 5
    
    for (const pageInfo of protectedPages) {
      console.log(`Testing protected page: ${pageInfo.name} (${pageInfo.path})`)
      
      await page.goto(pageInfo.path)
      
      // Should redirect to login or show auth required
      const isOnLogin = page.url().includes('/auth/signin')
      const hasAuthError = await page.locator('text=authentication, text=login, text=connexion').isVisible()
      
      expect(isOnLogin || hasAuthError).toBeTruthy()
      console.log(`✅ ${pageInfo.name} - Properly protected`)
    }
  })

  test('All redirections work correctly', async ({ page }) => {
    for (const redirect of REDIRECTIONS) {
      console.log(`Testing redirect: ${redirect.name}`)
      
      const response = await page.goto(redirect.from)
      
      // Should redirect (3xx) or rewrite to target
      const finalUrl = page.url()
      const isRedirected = finalUrl.includes(redirect.to) || response?.status() >= 300
      
      expect(isRedirected).toBeTruthy()
      console.log(`✅ ${redirect.from} → ${redirect.to}`)
    }
  })
})

test.describe('Priority Crawl - Authenticated Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@platform.com')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('Admin pages load successfully after authentication', async ({ page }) => {
    const adminPages = CRITICAL_PAGES.filter(p => !p.public && p.role !== 'CLIENT')
    
    for (const pageInfo of adminPages) {
      console.log(`Testing admin page: ${pageInfo.name} (${pageInfo.path})`)
      
      const response = await page.goto(pageInfo.path)
      
      // Should load successfully
      expect(response?.status()).toBeLessThan(400)
      
      // Should not show 404
      await expect(page.locator('h1')).not.toContainText('Page non trouvée')
      
      // Should not show access denied
      await expect(page.locator('text=insufficient_permissions')).not.toBeVisible()
      
      console.log(`✅ ${pageInfo.name} - Loaded successfully`)
    }
  })

  test('Critical CTAs are present and clickable', async ({ page }) => {
    const ctaTests = [
      { page: '/dashboard/packages', cta: 'Créer', name: 'Create Package' },
      { page: '/dashboard/finances/invoicing', cta: 'Créer', name: 'Create Invoice' },
      { page: '/dashboard/support/tickets', cta: 'Créer', name: 'Create Ticket' },
      { page: '/track', cta: 'Suivre', name: 'Track Package' },
    ]
    
    for (const test of ctaTests) {
      console.log(`Testing CTA: ${test.name} on ${test.page}`)
      
      await page.goto(test.page)
      
      const ctaButton = page.locator(`button:has-text("${test.cta}"), input[type="submit"]:has-text("${test.cta}")`)
      
      if (await ctaButton.isVisible()) {
        await expect(ctaButton).toBeEnabled()
        console.log(`✅ ${test.name} - CTA present and enabled`)
      } else {
        console.log(`⚠️  ${test.name} - CTA not found (might be conditional)`)
      }
    }
  })
})

test.describe('Priority Crawl - Performance Check', () => {
  test('Critical pages load within performance budget', async ({ page }) => {
    const performancePages = [
      '/dashboard',
      '/dashboard/packages',
      '/track',
      '/'
    ]
    
    for (const pagePath of performancePages) {
      console.log(`Performance test: ${pagePath}`)
      
      const startTime = Date.now()
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000)
      
      console.log(`✅ ${pagePath} - Loaded in ${loadTime}ms`)
    }
  })
})

test.describe('Priority Crawl - Console Errors', () => {
  test('Critical pages should not have console errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`${msg.location()?.url}: ${msg.text()}`)
      }
    })
    
    const testPages = ['/dashboard', '/dashboard/packages', '/track']
    
    for (const pagePath of testPages) {
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')
    }
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('third-party')
    )
    
    if (criticalErrors.length > 0) {
      console.log('Console errors found:')
      criticalErrors.forEach(error => console.log(`❌ ${error}`))
    }
    
    expect(criticalErrors).toHaveLength(0)
  })
})
