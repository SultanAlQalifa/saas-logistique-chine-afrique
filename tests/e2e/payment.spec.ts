import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'contact@logitrans.com');
    await page.fill('input[type="password"]', 'company123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display payment options correctly', async ({ page }) => {
    await page.goto('/dashboard/finances/paiements');
    
    // Check payment methods are visible
    await expect(page.locator('text=Orange Money')).toBeVisible();
    await expect(page.locator('text=MTN Mobile Money')).toBeVisible();
    await expect(page.locator('text=Wave Money')).toBeVisible();
    await expect(page.locator('text=Free Money')).toBeVisible();
  });

  test('should initiate Wave Money payment', async ({ page }) => {
    await page.goto('/dashboard/finances/paiements');
    
    // Click on Wave Money option
    await page.click('[data-testid="wave-money-option"]');
    
    // Fill payment form
    await page.fill('input[name="amount"]', '50000');
    await page.fill('input[name="phoneNumber"]', '221701234567');
    await page.fill('input[name="description"]', 'Test payment for cargo shipment');
    
    // Submit payment
    await page.click('button[type="submit"]');
    
    // Check for loading state
    await expect(page.locator('[data-testid="payment-loader"]')).toBeVisible();
    
    // Wait for payment confirmation or error
    await page.waitForSelector('[data-testid="payment-result"]', { timeout: 10000 });
    
    // Should show either success or demo message
    const result = page.locator('[data-testid="payment-result"]');
    await expect(result).toBeVisible();
  });

  test('should validate phone number format', async ({ page }) => {
    await page.goto('/dashboard/finances/paiements');
    
    // Click on Wave Money option
    await page.click('[data-testid="wave-money-option"]');
    
    // Fill with invalid phone number
    await page.fill('input[name="phoneNumber"]', '123456');
    await page.fill('input[name="amount"]', '10000');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=Numéro de téléphone invalide')).toBeVisible();
  });

  test('should validate minimum amount', async ({ page }) => {
    await page.goto('/dashboard/finances/paiements');
    
    // Click on Wave Money option
    await page.click('[data-testid="wave-money-option"]');
    
    // Fill with amount below minimum
    await page.fill('input[name="amount"]', '500');
    await page.fill('input[name="phoneNumber"]', '221701234567');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=Montant minimum')).toBeVisible();
  });

  test('should check payment status', async ({ page }) => {
    await page.goto('/dashboard/finances/transactions');
    
    // Should display transaction history
    await expect(page.locator('[data-testid="transaction-list"]')).toBeVisible();
    
    // Click on a transaction to check status
    await page.click('[data-testid="transaction-item"]:first-child');
    
    // Should show transaction details modal
    await expect(page.locator('[data-testid="transaction-modal"]')).toBeVisible();
    await expect(page.locator('text=Statut')).toBeVisible();
    await expect(page.locator('text=Montant')).toBeVisible();
    await expect(page.locator('text=Date')).toBeVisible();
  });

  test('should process refund request', async ({ page }) => {
    await page.goto('/dashboard/finances/transactions');
    
    // Find a completed transaction
    await page.click('[data-testid="transaction-item"][data-status="completed"]:first-child');
    
    // Click refund button
    await page.click('[data-testid="refund-button"]');
    
    // Fill refund form
    await page.fill('input[name="refundAmount"]', '25000');
    await page.fill('textarea[name="reason"]', 'Customer requested refund');
    
    // Submit refund
    await page.click('button[data-testid="submit-refund"]');
    
    // Should show confirmation
    await expect(page.locator('text=Demande de remboursement')).toBeVisible();
  });

  test('should display payment analytics', async ({ page }) => {
    await page.goto('/dashboard/finances/analytics');
    
    // Check analytics widgets
    await expect(page.locator('[data-testid="total-payments"]')).toBeVisible();
    await expect(page.locator('[data-testid="successful-payments"]')).toBeVisible();
    await expect(page.locator('[data-testid="failed-payments"]')).toBeVisible();
    await expect(page.locator('[data-testid="pending-payments"]')).toBeVisible();
    
    // Check charts
    await expect(page.locator('[data-testid="payment-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="provider-breakdown"]')).toBeVisible();
  });
});
