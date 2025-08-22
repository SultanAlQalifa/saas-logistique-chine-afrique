import { Page, BrowserContext, expect } from '@playwright/test';
import { resetConsent, acceptConsent } from './consent';

/**
 * Utilitaires d'authentification robustes pour les tests E2E
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@nextmove-cargo.com',
    password: 'Admin123!'
  },
  client: {
    email: 'client@test.com', 
    password: 'Client123!'
  },
  superAdmin: {
    email: 'superadmin@nextmove-cargo.com',
    password: 'SuperAdmin123!'
  }
} as const;

/**
 * Login robuste qui gère d'abord le consentement cookies puis l'auth
 */
export async function loginUser(page: Page, credentials: LoginCredentials): Promise<void> {
  // 1. Aller à la page de login
  await page.goto('/auth/signin');
  
  // 2. Gérer le consentement cookies si présent
  const consentBanner = page.getByTestId('consent-banner');
  if (await consentBanner.isVisible()) {
    await acceptConsent(page);
  }
  
  // 3. Remplir le formulaire de login
  await page.fill('input[name="email"]', credentials.email);
  await page.fill('input[name="password"]', credentials.password);
  
  // 4. Soumettre le formulaire
  await page.click('button[type="submit"]');
  
  // 5. Attendre la redirection vers le dashboard
  await page.waitForURL('/dashboard**');
  
  // 6. Vérifier que nous sommes bien connectés
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * Login avec bypass du consentement (cookies pré-acceptés)
 */
export async function loginUserWithPreAcceptedConsent(page: Page, credentials: LoginCredentials): Promise<void> {
  // 1. Pré-accepter le consentement via cookie
  await page.context().addCookies([{
    name: 'nm_consent',
    value: 'accepted',
    domain: 'localhost',
    path: '/'
  }]);
  
  // 2. Login normal sans gestion du consentement
  await page.goto('/auth/signin');
  await page.fill('input[name="email"]', credentials.email);
  await page.fill('input[name="password"]', credentials.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard**');
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * Logout complet avec nettoyage
 */
export async function logoutUser(page: Page): Promise<void> {
  // Aller au dashboard si pas déjà là
  if (!page.url().includes('/dashboard')) {
    await page.goto('/dashboard');
  }
  
  // Cliquer sur logout (adapter le sélecteur selon votre UI)
  await page.click('[data-testid="logout-button"], button:has-text("Déconnexion"), button:has-text("Logout")');
  
  // Attendre la redirection
  await page.waitForURL('/auth/signin');
  await expect(page).toHaveURL('/auth/signin');
}

/**
 * Vérifier l'état d'authentification
 */
export async function checkAuthState(page: Page, shouldBeAuthenticated: boolean): Promise<void> {
  if (shouldBeAuthenticated) {
    // Vérifier qu'on peut accéder au dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  } else {
    // Vérifier qu'on est redirigé vers login
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth/signin');
  }
}

/**
 * Setup d'authentification pour les tests
 */
export async function setupAuthenticatedSession(context: BrowserContext, userType: keyof typeof TEST_CREDENTIALS = 'client'): Promise<void> {
  const page = await context.newPage();
  
  // Reset du consentement
  await resetConsent(context);
  
  // Login avec les credentials appropriés
  await loginUser(page, TEST_CREDENTIALS[userType]);
  
  await page.close();
}

/**
 * Vérifier la présence du cookie de session
 */
export async function checkSessionCookie(page: Page, shouldExist: boolean): Promise<void> {
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(cookie => cookie.name === 'nm_sess');
  
  if (shouldExist) {
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.httpOnly).toBe(true);
    expect(sessionCookie?.sameSite).toMatch(/Lax|Strict/);
  } else {
    expect(sessionCookie).toBeUndefined();
  }
}

/**
 * Vérifier la présence du token CSRF
 */
export async function checkCSRFToken(page: Page, shouldExist: boolean): Promise<void> {
  const cookies = await page.context().cookies();
  const csrfCookie = cookies.find(cookie => cookie.name === 'nm_csrf');
  
  if (shouldExist) {
    expect(csrfCookie).toBeDefined();
    expect(csrfCookie?.httpOnly).toBe(false); // CSRF token doit être accessible en JS
    expect(csrfCookie?.sameSite).toBe('Strict');
  } else {
    expect(csrfCookie).toBeUndefined();
  }
}
