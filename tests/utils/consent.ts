import { Page, BrowserContext, expect } from '@playwright/test';

/**
 * Utilitaires pour les tests de consentement cookies
 */

export async function acceptConsent(page: Page): Promise<void> {
  await page.goto('/');
  
  // Attendre que la bannière soit visible
  await expect(page.getByTestId('consent-banner')).toBeVisible();
  
  // Cliquer sur Accepter
  await page.getByTestId('consent-accept').click();
  
  // Vérifier que la bannière disparaît
  await expect(page.getByTestId('consent-banner')).toBeHidden();
}

export async function declineConsent(page: Page): Promise<void> {
  await page.goto('/');
  
  // Attendre que la bannière soit visible
  await expect(page.getByTestId('consent-banner')).toBeVisible();
  
  // Cliquer sur Refuser
  await page.getByTestId('consent-decline').click();
  
  // Vérifier que la bannière disparaît
  await expect(page.getByTestId('consent-banner')).toBeHidden();
}

export async function resetConsent(context: BrowserContext): Promise<void> {
  // Supprimer tous les cookies pour reset le consentement
  await context.clearCookies();
}

export async function openCookiePolicy(page: Page): Promise<void> {
  // S'assurer que la bannière est visible
  await expect(page.getByTestId('consent-banner')).toBeVisible();
  
  // Cliquer sur "En savoir plus"
  await page.getByTestId('consent-more').click();
  
  // Vérifier que la modal s'ouvre
  await expect(page.getByTestId('cookie-policy-modal')).toBeVisible();
}

export async function checkConsentBannerVisibility(page: Page, shouldBeVisible: boolean): Promise<void> {
  if (shouldBeVisible) {
    await expect(page.getByTestId('consent-banner')).toBeVisible();
  } else {
    await expect(page.getByTestId('consent-banner')).not.toBeVisible();
  }
}

export async function checkConsentCookie(page: Page, expectedValue: 'accepted' | 'declined' | null): Promise<void> {
  const cookies = await page.context().cookies();
  const consentCookie = cookies.find(cookie => cookie.name === 'nm_consent');
  
  if (expectedValue === null) {
    expect(consentCookie).toBeUndefined();
  } else {
    expect(consentCookie).toBeDefined();
    expect(consentCookie?.value).toBe(expectedValue);
  }
}
