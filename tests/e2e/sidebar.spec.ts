import { test, expect } from '@playwright/test'

test.describe('Enhanced Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@platform.com')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should auto-retract after 8 seconds of inactivity', async ({ page }) => {
    // Ensure sidebar is expanded
    const sidebar = page.locator('[role="navigation"]')
    await expect(sidebar).toHaveClass(/w-64/)
    
    // Wait for auto-retraction (8 seconds + buffer)
    await page.waitForTimeout(9000)
    
    // Check if sidebar collapsed (unless pinned)
    const isPinned = await page.locator('button[title*="Détacher"]').isVisible()
    if (!isPinned) {
      await expect(sidebar).toHaveClass(/w-16/)
    }
  })

  test('should implement accordion behavior', async ({ page }) => {
    // Open Operations section
    await page.click('button:has-text("Opérations")')
    await expect(page.locator('#section-operations')).toBeVisible()
    
    // Open Finances section - should close Operations
    await page.click('button:has-text("Finances")')
    await expect(page.locator('#section-finances')).toBeVisible()
    await expect(page.locator('#section-operations')).not.toBeVisible()
  })

  test('should pin/unpin functionality', async ({ page }) => {
    const pinButton = page.locator('button[title*="Épingler"], button[title*="Détacher"]')
    
    // Pin sidebar
    await pinButton.click()
    
    // Wait for inactivity - should not auto-retract when pinned
    await page.waitForTimeout(9000)
    const sidebar = page.locator('[role="navigation"]')
    await expect(sidebar).toHaveClass(/w-64/)
    
    // Unpin sidebar
    await pinButton.click()
    
    // Should auto-retract after unpinning
    await page.waitForTimeout(9000)
    await expect(sidebar).toHaveClass(/w-16/)
  })

  test('should expand on hover when collapsed', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')
    
    // First collapse sidebar (if not already)
    await page.waitForTimeout(9000)
    
    // Hover over sidebar
    await sidebar.hover()
    await page.waitForTimeout(300)
    
    // Should expand temporarily
    await expect(sidebar).toHaveClass(/w-64/)
    
    // Move mouse away
    await page.mouse.move(500, 300)
    await page.waitForTimeout(300)
    
    // Should collapse again (unless pinned)
    const isPinned = await page.locator('button[title*="Détacher"]').isVisible()
    if (!isPinned) {
      await expect(sidebar).toHaveClass(/w-16/)
    }
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on sidebar
    await page.keyboard.press('Tab')
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter') // Should open/close section
    
    // Escape should collapse sidebar
    await page.keyboard.press('Escape')
    const sidebar = page.locator('[role="navigation"]')
    
    const isPinned = await page.locator('button[title*="Détacher"]').isVisible()
    if (!isPinned) {
      await expect(sidebar).toHaveClass(/w-16/)
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const sidebar = page.locator('[role="navigation"]')
    
    // Should have overlay behavior on mobile
    await expect(sidebar).toHaveClass(/lg:relative/)
    
    // Navigation should auto-close after clicking a link
    await page.click('a[href="/dashboard/packages"]')
    await page.waitForURL('**/packages')
    
    // Sidebar should be collapsed on mobile after navigation
    await expect(sidebar).toHaveClass(/w-16/)
  })

  test('should persist preferences', async ({ page }) => {
    // Pin sidebar
    await page.click('button[title*="Épingler"]')
    
    // Open a section
    await page.click('button:has-text("Opérations")')
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Preferences should be restored
    await expect(page.locator('button[title*="Détacher"]')).toBeVisible()
    await expect(page.locator('#section-operations')).toBeVisible()
  })

  test('should have proper ARIA attributes', async ({ page }) => {
    const sidebar = page.locator('[role="navigation"]')
    await expect(sidebar).toHaveAttribute('aria-label', 'Navigation principale')
    
    // Check accordion ARIA attributes
    const operationsButton = page.locator('button:has-text("Opérations")')
    await expect(operationsButton).toHaveAttribute('aria-expanded')
    await expect(operationsButton).toHaveAttribute('aria-controls')
  })
})
