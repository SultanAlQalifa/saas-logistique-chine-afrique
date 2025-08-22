import { test, expect } from '@playwright/test';

test.describe('Package Tracking', () => {
  test('should display tracking page correctly', async ({ page }) => {
    await page.goto('/track');
    
    // Check page elements
    await expect(page).toHaveTitle(/Suivi de Colis - NextMove Cargo/);
    await expect(page.locator('h1')).toContainText('Suivre votre colis');
    await expect(page.locator('input[placeholder*="numéro de suivi"]')).toBeVisible();
    await expect(page.locator('button:has-text("Rechercher")')).toBeVisible();
  });

  test('should show validation error for empty tracking number', async ({ page }) => {
    await page.goto('/track');
    
    // Try to search with empty input
    await page.click('button:has-text("Rechercher")');
    
    // Should show validation error
    await expect(page.locator('text=Veuillez saisir un numéro de suivi')).toBeVisible();
  });

  test('should display tracking results for valid tracking number', async ({ page }) => {
    await page.goto('/track');
    
    // Enter valid tracking number
    await page.fill('input[placeholder*="numéro de suivi"]', 'NM2024001');
    await page.click('button:has-text("Rechercher")');
    
    // Should display tracking information
    await expect(page.locator('[data-testid="tracking-result"]')).toBeVisible();
    await expect(page.locator('text=Statut du colis')).toBeVisible();
    await expect(page.locator('text=Historique des mouvements')).toBeVisible();
  });

  test('should show not found message for invalid tracking number', async ({ page }) => {
    await page.goto('/track');
    
    // Enter invalid tracking number
    await page.fill('input[placeholder*="numéro de suivi"]', 'INVALID123');
    await page.click('button:has-text("Rechercher")');
    
    // Should show not found message
    await expect(page.locator('text=Aucun colis trouvé')).toBeVisible();
  });

  test('should display tracking timeline correctly', async ({ page }) => {
    await page.goto('/track');
    
    // Search for package
    await page.fill('input[placeholder*="numéro de suivi"]', 'NM2024001');
    await page.click('button:has-text("Rechercher")');
    
    // Check timeline elements
    await expect(page.locator('[data-testid="tracking-timeline"]')).toBeVisible();
    await expect(page.locator('.timeline-item').first()).toBeVisible();
    
    // Check for status indicators
    await expect(page.locator('.status-completed')).toBeVisible();
    await expect(page.locator('text=Colis expédié')).toBeVisible();
  });
});
