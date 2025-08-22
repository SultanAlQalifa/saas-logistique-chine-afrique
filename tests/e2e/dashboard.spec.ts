import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'admin@nextmove.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display dashboard correctly', async ({ page }) => {
    // Check main dashboard elements
    await expect(page.locator('h1')).toContainText('Tableau de Bord');
    await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible();
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });

  test('should navigate to clients plateforme page', async ({ page }) => {
    // Click on Clients Plateforme
    await page.click('text=Clients Plateforme');
    
    // Should navigate to clients page
    await expect(page).toHaveURL(/\/dashboard\/clients/);
    await expect(page.locator('h1')).toContainText('Clients Plateforme');
    await expect(page.locator('text=Tous les clients inscrits sur la plateforme')).toBeVisible();
  });

  test('should navigate to mes clients page', async ({ page }) => {
    // Click on Mes Clients
    await page.click('text=Mes Clients');
    
    // Should navigate to mes-clients page
    await expect(page).toHaveURL(/\/dashboard\/mes-clients/);
    await expect(page.locator('h1')).toContainText('Mes Clients');
    await expect(page.locator('text=Clients ayant des colis actifs avec votre entreprise')).toBeVisible();
  });

  test('should display correct navigation labels', async ({ page }) => {
    // Check that navigation clearly distinguishes between client types
    await expect(page.locator('text=Clients Plateforme')).toBeVisible();
    await expect(page.locator('text=Mes Clients')).toBeVisible();
    
    // Hover over navigation items to see descriptions
    await page.hover('text=Clients Plateforme');
    await expect(page.locator('text=Tous les clients inscrits sur la plateforme')).toBeVisible();
    
    await page.hover('text=Mes Clients');
    await expect(page.locator('text=Clients ayant des colis avec votre entreprise')).toBeVisible();
  });

  test('should navigate to packages management', async ({ page }) => {
    // Navigate to packages
    await page.click('text=Colis');
    
    await expect(page).toHaveURL(/\/dashboard\/packages/);
    await expect(page.locator('h1')).toContainText('Colis');
  });

  test('should navigate to tracking page', async ({ page }) => {
    // Navigate to expeditions/tracking
    await page.click('text=Expéditions');
    
    await expect(page).toHaveURL(/\/dashboard\/expeditions/);
    await expect(page.locator('h1')).toContainText('Expéditions');
  });
});
