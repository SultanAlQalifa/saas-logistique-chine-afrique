const { test, expect } = require('@playwright/test');

test.describe('Security Headers Tests', () => {
  test('should return all required security headers', async ({ request }) => {
    const response = await request.get('/api/health');
    
    // Vérifier que la réponse est OK
    expect(response.status()).toBe(200);
    
    const headers = response.headers();
    
    // Headers de sécurité requis
    expect(headers['x-frame-options']).toBeTruthy();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBeTruthy();
    expect(headers['content-security-policy']).toBeTruthy();
    
    console.log('✅ Security headers validated');
  });

  test('should enforce rate limiting', async ({ request }) => {
    const requests = [];
    
    // Envoyer 105 requêtes rapidement
    for (let i = 0; i < 105; i++) {
      requests.push(request.get('/api/health'));
    }
    
    const responses = await Promise.all(requests);
    const statusCodes = responses.map(r => r.status());
    
    // Vérifier qu'au moins une requête retourne 429
    const rateLimited = statusCodes.some(code => code === 429);
    expect(rateLimited).toBe(true);
    
    console.log('✅ Rate limiting working');
  });
});
