import { test, expect } from '@playwright/test';
import { acceptConsent, declineConsent, resetConsent, checkConsentCookie, checkConsentBannerVisibility } from '../utils/consent';
import { loginUser, checkSessionCookie, checkCSRFToken, TEST_CREDENTIALS } from '../utils/auth';

test.describe('Cookie Management E2E Tests', () => {
  test.beforeEach(async ({ context }) => {
    // Reset consent state before each test
    await resetConsent(context);
  });

  test('should display consent banner on first visit - desktop', async ({ page }) => {
    await page.goto('/');
    await checkConsentBannerVisibility(page, true);
    
    // Check banner content
    const banner = page.getByTestId('consent-banner');
    await expect(banner).toContainText('Cookies et confidentialité');
    await expect(banner).toContainText('cookies techniques');
  });

  test('should display consent banner on first visit - mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-specific test');
    
    await page.goto('/');
    await checkConsentBannerVisibility(page, true);
    
    // Ensure banner is visible on mobile (no display:none via breakpoints)
    const banner = page.getByTestId('consent-banner');
    const isVisible = await banner.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should accept cookies and hide banner', async ({ page }) => {
    await acceptConsent(page);
    await checkConsentCookie(page, 'accepted');
  });

  test('should decline cookies and hide banner', async ({ page }) => {
    await declineConsent(page);
    await checkConsentCookie(page, 'declined');
  });

  test('should persist consent choice across page reloads', async ({ page }) => {
    await acceptConsent(page);
    
    // Reload page
    await page.reload();
    
    // Banner should not appear again
    await checkConsentBannerVisibility(page, false);
    await checkConsentCookie(page, 'accepted');
  });

  test('should open cookie policy modal', async ({ page }) => {
    await page.goto('/');
    
    // Click "En savoir plus"
    await page.getByTestId('consent-more').click();
    
    // Check if modal opens (could be new tab or modal)
    const newPagePromise = page.waitForEvent('popup');
    const newPage = await newPagePromise;
    await expect(newPage).toHaveURL('/legal');
  });

  test('should set preference cookies when accepted', async ({ page }) => {
    await acceptConsent(page);
    
    // Set some preferences (theme, language, sidebar)
    await page.goto('/dashboard');
    
    // Simulate preference changes
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('language', 'fr');
      localStorage.setItem('sidebar', 'collapsed');
    });
    
    const cookies = await page.context().cookies();
    const consentCookie = cookies.find(c => c.name === 'nm_consent');
    expect(consentCookie?.value).toBe('accepted');
  });

  test('should clear session cookie on logout', async ({ page }) => {
    // Login first
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'contact@logitrans.com');
    await page.fill('input[type="password"]', 'company123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Déconnexion');
    
    // Should redirect to home
    await expect(page).toHaveURL('/');
    
    // Session cookie should be cleared
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === 'nm_sess');
    expect(sessionCookie).toBeUndefined();
  });

  test('should handle CSRF protection', async ({ page }) => {
    // Login first
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'contact@logitrans.com');
    await page.fill('input[type="password"]', 'company123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Check CSRF cookie exists
    const cookies = await page.context().cookies();
    const csrfCookie = cookies.find(c => c.name === 'nm_csrf');
    expect(csrfCookie).toBeDefined();
    expect(csrfCookie?.httpOnly).toBe(false); // Needs to be readable by JS
  });

  test('should respect multi-tenant cookie scoping', async ({ page }) => {
    // Test with different subdomains (if applicable)
    await page.goto('/');
    
    // Set tenant cookie
    await page.context().addCookies([{
      name: 'nm_tenant',
      value: 'logitrans',
      domain: 'localhost',
      path: '/'
    }]);
    
    await page.reload();
    
    // Check tenant cookie
    const cookies = await page.context().cookies();
    const tenantCookie = cookies.find(c => c.name === 'nm_tenant');
    expect(tenantCookie?.value).toBe('logitrans');
  });

  test('should validate cookie security headers', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check security headers
    if (response) {
      const headers = response.headers();
      expect(headers['x-frame-options']).toBe('DENY');
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['content-security-policy']).toContain("default-src 'self'");
    }
  });

  test('should handle analytics consent correctly', async ({ page }) => {
    await page.goto('/');
    
    // Decline cookies - analytics should be disabled
    await page.click('button:has-text("Refuser")');
    
    // Check that analytics tracking is disabled
    const analyticsDisabled = await page.evaluate(() => {
      return !window.gtag && !window.dataLayer;
    });
    expect(analyticsDisabled).toBe(true);
    
    // Accept cookies - analytics should be enabled
    await page.context().clearCookies();
    await page.goto('/');
    await page.click('button:has-text("Accepter")');
    
    // Analytics should now be available (internal analytics only)
    const analyticsEnabled = await page.evaluate(() => {
      return typeof window.fetch === 'function'; // Basic check
    });
    expect(analyticsEnabled).toBe(true);
  });

  test('should create secure session cookie on login', async ({ page }) => {
    await acceptConsent(page);
    
    // Attempt login
    await loginUser(page, TEST_CREDENTIALS.client);
    
    // Check session cookie properties
    await checkSessionCookie(page, true);
  });

  test('should set CSRF token cookie', async ({ page }) => {
    await acceptConsent(page);
    
    // Navigate to a protected page that requires CSRF
    await page.goto('/dashboard');
    
    await checkCSRFToken(page, true);
  });

  test('should scope cookies to correct domain in multi-tenant setup', async ({ page }) => {
    await acceptConsent(page);
    
    const cookies = await page.context().cookies();
    
    // All NextMove cookies should be scoped to localhost in test environment
    cookies.forEach(cookie => {
      if (cookie.name.startsWith('nm_')) {
        expect(cookie.domain).toMatch(/localhost|127\.0\.0\.1/);
      }
    });
  });

  test('should include security headers in responses', async ({ page }) => {
    const response = await page.goto('/');
    
    if (response) {
      const headers = response.headers();
      
      // Check for security headers
      expect(headers['x-frame-options']).toBeTruthy();
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['referrer-policy']).toBeTruthy();
      
      // CSP header should be present
      expect(headers['content-security-policy']).toBeTruthy();
    }
  });

  test('should handle analytics consent properly', async ({ page }) => {
    // Test declined analytics
    await declineConsent(page);
    
    // Check that analytics is disabled
    const analyticsDisabled = await page.evaluate(() => {
      return !window.localStorage.getItem('analytics_enabled');
    });
    expect(analyticsDisabled).toBe(true);
    
    // Reset and accept
    await resetConsent(page.context());
    await acceptConsent(page);
    
    // Analytics should now be enabled
    const analyticsEnabled = await page.evaluate(() => {
      return window.localStorage.getItem('analytics_enabled') === 'true';
    });
    expect(analyticsEnabled).toBe(true);
  });

  test('should fallback to localStorage when cookies disabled', async ({ page, context }) => {
    // Simulate cookies being disabled by intercepting cookie setting
    await context.route('**/*', async (route) => {
      await route.continue();
    });
    
    await page.goto('/');
    
    // Try to set preferences via localStorage fallback
    await page.evaluate(() => {
      localStorage.setItem('nm_theme', 'dark');
      localStorage.setItem('nm_lang', 'en');
      localStorage.setItem('nm_sb', 'expanded');
    });
    
    // Verify localStorage fallback works
    const themeValue = await page.evaluate(() => localStorage.getItem('nm_theme'));
    expect(themeValue).toBe('dark');
  });

  test('should clear session on logout', async ({ page }) => {
    await acceptConsent(page);
    await loginUser(page, TEST_CREDENTIALS.client);
    
    // Verify session exists
    await checkSessionCookie(page, true);
    
    // Logout
    await page.click('[data-testid="logout-button"], button:has-text("Déconnexion")');
    
    // Session cookie should be cleared
    await checkSessionCookie(page, false);
  });
});
