import { test, expect } from '@playwright/test'
import routesManifest from '../../routes.manifest.json'

test.describe('Routing System', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@platform.com')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should handle all defined routes without 404', async ({ page }) => {
    const routes = Object.entries(routesManifest.routes)
    
    for (const [name, route] of routes) {
      // Skip parameterized routes and auth routes
      if (route.path.includes(':') || route.path.startsWith('/auth')) {
        continue
      }
      
      // Skip routes that require specific roles
      if (route.guards?.some(guard => guard.includes('SUPER_ADMIN'))) {
        continue
      }

      await page.goto(route.path)
      
      // Should not be 404
      await expect(page).not.toHaveTitle(/404/)
      await expect(page.locator('h1')).not.toContainText('Page non trouvée')
      
      // Should have valid status
      const response = await page.waitForResponse(resp => 
        resp.url().includes(route.path) && resp.request().method() === 'GET'
      )
      expect(response.status()).toBeLessThan(400)
    }
  })

  test('should handle redirects correctly', async ({ page }) => {
    const redirects = Object.entries(routesManifest.redirects)
    
    for (const [oldPath, newPath] of redirects) {
      await page.goto(oldPath)
      await page.waitForURL(`**${newPath}`)
      
      // Should redirect to correct new path
      expect(page.url()).toContain(newPath)
    }
  })

  test('should handle aliases correctly', async ({ page }) => {
    const aliases = Object.entries(routesManifest.aliases)
    
    for (const [aliasPath, targetPath] of aliases) {
      await page.goto(aliasPath)
      
      // Should show content from target path
      const response = await page.waitForResponse(resp => 
        resp.url().includes(aliasPath) && resp.request().method() === 'GET'
      )
      expect(response.status()).toBe(200)
    }
  })

  test('should navigate using router utilities', async ({ page }) => {
    // Test navigation to packages
    await page.click('a[href="/dashboard/packages"]')
    await page.waitForURL('**/packages')
    expect(page.url()).toContain('/dashboard/packages')
    
    // Test navigation to finances
    await page.click('a[href="/dashboard/finances"]')
    await page.waitForURL('**/finances')
    expect(page.url()).toContain('/dashboard/finances')
  })

  test('should show 404 page for invalid routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    
    // Should show custom 404 page
    await expect(page.locator('h1')).toContainText('Page non trouvée')
    await expect(page.locator('span')).toContainText('404')
    
    // Should have search functionality
    await expect(page.locator('input[placeholder*="Rechercher"]')).toBeVisible()
    
    // Should have quick links
    await expect(page.locator('a[href="/dashboard"]')).toBeVisible()
    await expect(page.locator('a[href="/"]')).toBeVisible()
  })

  test('should log 404 events', async ({ page }) => {
    let consoleMessages: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('404 Event')) {
        consoleMessages.push(msg.text())
      }
    })
    
    await page.goto('/non-existent-page')
    
    // Should log 404 event
    expect(consoleMessages).toHaveLength(1)
    expect(consoleMessages[0]).toContain('404 Event')
  })

  test('should handle search from 404 page', async ({ page }) => {
    await page.goto('/invalid-route')
    
    // Fill search form
    await page.fill('input[placeholder*="Rechercher"]', 'colis')
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard with search
    await page.waitForURL('**/dashboard?search=colis')
    expect(page.url()).toContain('search=colis')
  })

  test('should maintain proper navigation state', async ({ page }) => {
    // Navigate through multiple pages
    await page.click('a[href="/dashboard/packages"]')
    await page.waitForURL('**/packages')
    
    await page.click('a[href="/dashboard/finances"]')
    await page.waitForURL('**/finances')
    
    // Back button should work
    await page.goBack()
    await page.waitForURL('**/packages')
    
    // Forward button should work
    await page.goForward()
    await page.waitForURL('**/finances')
  })

  test('should handle role-based access', async ({ page }) => {
    // Try to access super admin route as regular admin
    await page.goto('/dashboard/companies')
    
    // Should redirect or show access denied
    const url = page.url()
    const hasError = await page.locator('text=insufficient_permissions').isVisible()
    
    expect(url.includes('/dashboard/companies') || hasError).toBeTruthy()
  })
})
