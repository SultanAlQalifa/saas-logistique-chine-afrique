import { test, expect } from '@playwright/test';

test.describe('Package Tracking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'client@example.com');
    await page.fill('input[type="password"]', 'client123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display tracking search interface', async ({ page }) => {
    await page.goto('/dashboard/tracking');
    
    // Check tracking search elements
    await expect(page.locator('input[placeholder*="numéro de suivi"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('text=Rechercher un colis')).toBeVisible();
  });

  test('should track package with valid tracking number', async ({ page }) => {
    await page.goto('/dashboard/tracking');
    
    // Enter valid tracking number
    await page.fill('input[placeholder*="numéro de suivi"]', 'NM2024001');
    await page.click('button[type="submit"]');
    
    // Should show tracking results
    await expect(page.locator('[data-testid="tracking-results"]')).toBeVisible();
    await expect(page.locator('text=Statut du colis')).toBeVisible();
    await expect(page.locator('text=Historique')).toBeVisible();
  });

  test('should show error for invalid tracking number', async ({ page }) => {
    await page.goto('/dashboard/tracking');
    
    // Enter invalid tracking number
    await page.fill('input[placeholder*="numéro de suivi"]', 'INVALID123');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Colis introuvable')).toBeVisible();
  });

  test('should display package timeline', async ({ page }) => {
    await page.goto('/dashboard/tracking');
    
    // Track a package
    await page.fill('input[placeholder*="numéro de suivi"]', 'NM2024001');
    await page.click('button[type="submit"]');
    
    // Check timeline elements
    await expect(page.locator('[data-testid="timeline"]')).toBeVisible();
    await expect(page.locator('text=Colis créé')).toBeVisible();
    await expect(page.locator('text=En transit')).toBeVisible();
  });

  test('should show package details modal', async ({ page }) => {
    await page.goto('/dashboard/packages');
    
    // Click on a package
    await page.click('[data-testid="package-item"]:first-child');
    
    // Should open details modal
    await expect(page.locator('[data-testid="package-modal"]')).toBeVisible();
    await expect(page.locator('text=Détails du colis')).toBeVisible();
    await expect(page.locator('text=Expéditeur')).toBeVisible();
    await expect(page.locator('text=Destinataire')).toBeVisible();
  });

  test('should update package status', async ({ page }) => {
    await page.goto('/dashboard/packages');
    
    // Click on a package
    await page.click('[data-testid="package-item"]:first-child');
    
    // Click update status button
    await page.click('[data-testid="update-status-btn"]');
    
    // Select new status
    await page.selectOption('select[name="status"]', 'en_transit');
    await page.fill('textarea[name="note"]', 'Package picked up from warehouse');
    
    // Submit update
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Statut mis à jour')).toBeVisible();
  });

  test('should create POD (Proof of Delivery)', async ({ page }) => {
    await page.goto('/dashboard/packages');
    
    // Find delivered package
    await page.click('[data-testid="package-item"][data-status="delivered"]:first-child');
    
    // Click POD button
    await page.click('[data-testid="create-pod-btn"]');
    
    // Should navigate to POD creation
    await expect(page).toHaveURL(/\/pod$/);
    await expect(page.locator('text=Preuve de Livraison')).toBeVisible();
  });

  test('should capture delivery signature', async ({ page }) => {
    await page.goto('/dashboard/packages/1/pod');
    
    // Navigate to signature step
    await page.click('button[data-step="signature"]');
    
    // Check signature canvas
    await expect(page.locator('canvas[data-testid="signature-canvas"]')).toBeVisible();
    await expect(page.locator('button[data-testid="clear-signature"]')).toBeVisible();
    await expect(page.locator('button[data-testid="save-signature"]')).toBeVisible();
  });

  test('should capture delivery location', async ({ page }) => {
    await page.goto('/dashboard/packages/1/pod');
    
    // Navigate to location step
    await page.click('button[data-step="location"]');
    
    // Check geolocation elements
    await expect(page.locator('[data-testid="location-capture"]')).toBeVisible();
    await expect(page.locator('button[data-testid="get-location"]')).toBeVisible();
  });

  test('should generate delivery receipt', async ({ page }) => {
    await page.goto('/dashboard/packages/1/pod');
    
    // Complete POD workflow
    await page.click('button[data-step="signature"]');
    // Simulate signature (would need actual canvas interaction)
    await page.click('button[data-testid="save-signature"]');
    
    await page.click('button[data-step="location"]');
    await page.click('button[data-testid="get-location"]');
    
    // Generate receipt
    await page.click('button[data-testid="generate-receipt"]');
    
    // Should show receipt preview
    await expect(page.locator('[data-testid="receipt-preview"]')).toBeVisible();
    await expect(page.locator('text=Reçu de Livraison')).toBeVisible();
  });

  test('should send tracking notifications', async ({ page }) => {
    await page.goto('/dashboard/packages');
    
    // Select package
    await page.click('[data-testid="package-item"]:first-child');
    
    // Click notify button
    await page.click('[data-testid="notify-customer-btn"]');
    
    // Choose notification method
    await page.check('input[value="whatsapp"]');
    await page.check('input[value="email"]');
    
    // Send notification
    await page.click('button[data-testid="send-notification"]');
    
    // Should show success
    await expect(page.locator('text=Notification envoyée')).toBeVisible();
  });
});
