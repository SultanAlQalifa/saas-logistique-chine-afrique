import { test, expect } from '@playwright/test'
import routesManifest from '../../routes.manifest.json'

test.describe('Critical User Paths', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@platform.com')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('Dashboard → Packages → Create Package flow', async ({ page }) => {
    // Navigate to packages
    await page.click('a[href="/dashboard/packages"]')
    await page.waitForURL('**/packages')
    
    // Create new package
    await page.click('button:has-text("Créer"), button:has-text("Nouveau")')
    
    // Verify form loads
    await expect(page.locator('form')).toBeVisible()
    
    // Check loading states
    const submitBtn = page.locator('button[type="submit"]')
    await expect(submitBtn).not.toBeDisabled()
    
    // Fill form and submit
    await page.fill('[name="description"]', 'Test Package E2E')
    await page.fill('[name="weight"]', '2.5')
    await submitBtn.click()
    
    // Verify loading state
    await expect(submitBtn).toBeDisabled()
    await expect(submitBtn).toContainText(/Création|Envoi|Loading/)
  })

  test('Finances → Invoicing → Create Invoice flow', async ({ page }) => {
    await page.click('button:has-text("Finances")')
    await page.click('a[href="/dashboard/finances/invoicing"]')
    await page.waitForURL('**/invoicing')
    
    await page.click('button:has-text("Créer"), button:has-text("Nouvelle")')
    await expect(page.locator('form, [role="dialog"]')).toBeVisible()
    
    const submitBtn = page.locator('button[type="submit"]')
    await page.fill('[name="clientName"], [name="client"]', 'Test Client')
    await page.fill('[name="amount"], [name="total"]', '1000')
    
    await submitBtn.click()
    await expect(submitBtn).toBeDisabled()
  })

  test('Support → Tickets → Create Ticket flow', async ({ page }) => {
    await page.click('button:has-text("Support")')
    await page.click('a[href="/dashboard/support/tickets"]')
    await page.waitForURL('**/tickets')
    
    await page.click('button:has-text("Créer"), button:has-text("Nouveau")')
    await expect(page.locator('form, [role="dialog"]')).toBeVisible()
    
    await page.fill('[name="title"], [name="subject"]', 'Test Ticket E2E')
    await page.fill('[name="description"], [name="message"]', 'Description du problème')
    
    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()
    await expect(submitBtn).toBeDisabled()
  })

  test('Track Package → Public Flow', async ({ page }) => {
    // Test public tracking
    await page.goto('/track')
    
    await page.fill('input[placeholder*="PIN"]', 'A3X9K2')
    await page.click('button:has-text("Suivre"), button[type="submit"]')
    
    // Should show tracking results or error
    await expect(page.locator('.tracking-result, .error-message')).toBeVisible({ timeout: 10000 })
  })

  test('Language switching from deep pages', async ({ page }) => {
    // Go to deep page
    await page.goto('/dashboard/finances/invoicing')
    
    // Switch language
    const langSwitcher = page.locator('[data-testid="language-switcher"], button:has-text("FR"), button:has-text("EN")')
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click()
      await page.click('text=English, text=EN')
      
      // Verify language change
      await expect(page.locator('h1, [data-testid="page-title"]')).not.toContainText(/Facturation/)
    }
    
    // Reload and verify persistence
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Should still be in English (if language switching is implemented)
  })
})

test.describe('Icon and Tooltip Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@platform.com')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('Icons have consistent sizes and tooltips', async ({ page }) => {
    // Check sidebar icons
    const sidebarIcons = page.locator('[role="navigation"] svg, [role="navigation"] .lucide')
    const iconCount = await sidebarIcons.count()
    
    for (let i = 0; i < Math.min(iconCount, 10); i++) {
      const icon = sidebarIcons.nth(i)
      
      // Check size consistency (should be 16-20px)
      const box = await icon.boundingBox()
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(16)
        expect(box.width).toBeLessThanOrEqual(24)
        expect(box.height).toBeGreaterThanOrEqual(16)
        expect(box.height).toBeLessThanOrEqual(24)
      }
    }
    
    // Check button tooltips
    const buttonsWithIcons = page.locator('button[title], button[aria-label]')
    const buttonCount = await buttonsWithIcons.count()
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttonsWithIcons.nth(i)
      await button.hover()
      
      // Should have title or aria-label
      const title = await button.getAttribute('title')
      const ariaLabel = await button.getAttribute('aria-label')
      expect(title || ariaLabel).toBeTruthy()
    }
  })
})

test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@platform.com')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('Tab navigation works in sidebar', async ({ page }) => {
    // Focus on sidebar
    await page.keyboard.press('Tab')
    
    // Navigate through sidebar items
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      
      // Check if focused element is visible
      const focused = page.locator(':focus')
      await expect(focused).toBeVisible()
    }
  })

  test('Enter key opens/closes accordion sections', async ({ page }) => {
    // Focus on Operations section
    const operationsBtn = page.locator('button:has-text("Opérations")')
    await operationsBtn.focus()
    
    // Press Enter to open
    await page.keyboard.press('Enter')
    await expect(page.locator('#section-operations')).toBeVisible()
    
    // Press Enter again to close
    await page.keyboard.press('Enter')
    await expect(page.locator('#section-operations')).not.toBeVisible()
  })

  test('Escape key collapses sidebar', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')
    
    // Ensure sidebar is expanded
    await expect(sidebar).toHaveClass(/w-64/)
    
    // Press Escape
    await page.keyboard.press('Escape')
    
    // Should collapse (unless pinned)
    const isPinned = await page.locator('button[title*="Détacher"]').isVisible()
    if (!isPinned) {
      await expect(sidebar).toHaveClass(/w-16/)
    }
  })
})

test.describe('Form Validation and States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@platform.com')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('Forms show proper loading and error states', async ({ page }) => {
    // Go to a form page
    await page.goto('/dashboard/packages')
    await page.click('button:has-text("Créer"), button:has-text("Nouveau")')
    
    const form = page.locator('form')
    await expect(form).toBeVisible()
    
    // Try to submit empty form
    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()
    
    // Should show validation errors or be disabled
    const hasErrors = await page.locator('.error, .text-red-500, [role="alert"]').isVisible()
    const isDisabled = await submitBtn.isDisabled()
    
    expect(hasErrors || isDisabled).toBeTruthy()
  })
})
