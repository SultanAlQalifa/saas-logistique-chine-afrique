# 🧪 Smoke Tests Production - NextMove Cargo V1.0

## Tests Critiques Post-Déploiement

### 1. Tests d'Authentification
```typescript
// Test connexion utilisateur
describe('Authentication Smoke Tests', () => {
  test('Login with valid credentials', async () => {
    await page.goto('/signin');
    await page.fill('[data-testid="email"]', 'djeylanidjitte@gmail.com');
    await page.fill('[data-testid="password"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('Session persistence', async () => {
    // Vérifier que la session persiste après rafraîchissement
    await page.reload();
    await expect(page).toHaveURL('/dashboard');
  });

  test('Logout functionality', async () => {
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL('/signin');
  });
});
```

### 2. Tests Fonctionnalités Critiques
```typescript
// Test création de colis
describe('Package Creation Smoke Tests', () => {
  test('Create new package', async () => {
    await page.goto('/dashboard/packages/create');
    
    // Remplir formulaire
    await page.selectOption('[data-testid="shipping-mode"]', 'MARITIME');
    await page.fill('[data-testid="description"]', 'Test colis production');
    await page.fill('[data-testid="weight"]', '10');
    await page.fill('[data-testid="length"]', '50');
    await page.fill('[data-testid="width"]', '40');
    await page.fill('[data-testid="height"]', '30');
    
    // Calculer prix
    await page.click('[data-testid="calculate-price"]');
    await expect(page.locator('[data-testid="total-price"]')).toBeVisible();
    
    // Créer colis
    await page.click('[data-testid="create-package"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('Package tracking', async () => {
    await page.goto('/track');
    await page.fill('[data-testid="tracking-input"]', 'NM-2025-00000001');
    await page.click('[data-testid="track-button"]');
    
    await expect(page.locator('[data-testid="tracking-result"]')).toBeVisible();
  });
});
```

### 3. Tests Paiement Wave
```typescript
// Test intégration Wave Money
describe('Payment Smoke Tests', () => {
  test('Wave payment flow', async () => {
    // Créer session de paiement
    const response = await fetch('/api/wave/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000,
        currency: 'XOF',
        description: 'Test paiement production'
      })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.checkout_url).toBeDefined();
  });

  test('Payment webhook handling', async () => {
    // Simuler webhook Wave
    const webhookPayload = {
      id: 'payment_test_123',
      status: 'completed',
      amount: 1000,
      currency: 'XOF'
    };

    const response = await fetch('/api/wave/webhook', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Wave-Signature': 'test_signature'
      },
      body: JSON.stringify(webhookPayload)
    });

    expect(response.status).toBe(200);
  });
});
```

### 4. Tests WhatsApp Business
```typescript
// Test notifications WhatsApp
describe('WhatsApp Smoke Tests', () => {
  test('Send notification message', async () => {
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: '+221776581741',
        type: 'text',
        message: 'Test notification NextMove Cargo Production'
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message_id).toBeDefined();
  });

  test('Webhook message handling', async () => {
    // Simuler réception message
    const webhookPayload = {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            messages: [{
              from: '+221776581741',
              text: { body: 'Test message' },
              timestamp: Date.now()
            }]
          }
        }]
      }]
    };

    const response = await fetch('/api/whatsapp/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    expect(response.status).toBe(200);
  });
});
```

### 5. Tests Performance
```typescript
// Test temps de réponse
describe('Performance Smoke Tests', () => {
  test('Page load times', async () => {
    const pages = [
      '/',
      '/pricing',
      '/track',
      '/dashboard',
      '/dashboard/packages'
    ];

    for (const pagePath of pages) {
      const startTime = Date.now();
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000); // < 3s
      console.log(`${pagePath}: ${loadTime}ms`);
    }
  });

  test('API response times', async () => {
    const endpoints = [
      '/api/health',
      '/api/packages',
      '/api/pricing/calculate'
    ];

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      const response = await fetch(endpoint);
      const responseTime = Date.now() - startTime;
      
      expect(response.status).toBeLessThan(400);
      expect(responseTime).toBeLessThan(1000); // < 1s
      console.log(`${endpoint}: ${responseTime}ms`);
    }
  });
});
```

## Script de Smoke Tests

### Exécution Automatique
```bash
#!/bin/bash
# scripts/smoke-tests.sh

echo "🧪 SMOKE TESTS PRODUCTION - NextMove Cargo V1.0"
echo "================================================"

# Variables
BASE_URL="https://nextmove-cargo.vercel.app"
ADMIN_EMAIL="djeylanidjitte@gmail.com"
TEST_PHONE="+221776581741"

# 1. Test santé générale
echo "🏥 Test santé générale..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" $BASE_URL/api/health)
HTTP_CODE="${HEALTH_RESPONSE: -3}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Service opérationnel"
else
    echo "❌ Service en erreur (HTTP $HTTP_CODE)"
    exit 1
fi

# 2. Test authentification
echo "🔐 Test authentification..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"'$ADMIN_EMAIL'","password":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    echo "✅ Authentification OK"
else
    echo "❌ Échec authentification"
    exit 1
fi

# 3. Test création colis
echo "📦 Test création colis..."
PACKAGE_RESPONSE=$(curl -s -X POST $BASE_URL/api/packages \
    -H "Content-Type: application/json" \
    -d '{
        "description": "Test colis smoke",
        "weight": 10,
        "dimensions": {"length": 50, "width": 40, "height": 30},
        "mode": "MARITIME"
    }')

if echo "$PACKAGE_RESPONSE" | grep -q "NM-2025"; then
    echo "✅ Création colis OK"
else
    echo "❌ Échec création colis"
    exit 1
fi

# 4. Test calcul prix
echo "💰 Test calcul prix..."
PRICING_RESPONSE=$(curl -s -X POST $BASE_URL/api/pricing/calculate \
    -H "Content-Type: application/json" \
    -d '{
        "mode": "MARITIME",
        "weight": 10,
        "dimensions": {"length": 50, "width": 40, "height": 30},
        "destination": "Dakar"
    }')

if echo "$PRICING_RESPONSE" | grep -q "total"; then
    echo "✅ Calcul prix OK"
else
    echo "❌ Échec calcul prix"
    exit 1
fi

# 5. Test Wave Money (si configuré)
if [ ! -z "$WAVE_API_KEY" ]; then
    echo "💳 Test Wave Money..."
    WAVE_RESPONSE=$(curl -s -X POST $BASE_URL/api/wave/create-session \
        -H "Content-Type: application/json" \
        -d '{"amount": 1000, "currency": "XOF"}')
    
    if echo "$WAVE_RESPONSE" | grep -q "checkout_url"; then
        echo "✅ Wave Money OK"
    else
        echo "❌ Échec Wave Money"
        exit 1
    fi
else
    echo "⚠️ Wave Money non configuré - ignoré"
fi

# 6. Test WhatsApp (si configuré)
if [ ! -z "$WHATSAPP_ACCESS_TOKEN" ]; then
    echo "📱 Test WhatsApp..."
    WA_RESPONSE=$(curl -s -X POST $BASE_URL/api/whatsapp/send \
        -H "Content-Type: application/json" \
        -d '{
            "to": "'$TEST_PHONE'",
            "type": "text",
            "message": "Test smoke NextMove Cargo Production"
        }')
    
    if echo "$WA_RESPONSE" | grep -q "message_id"; then
        echo "✅ WhatsApp OK"
    else
        echo "❌ Échec WhatsApp"
        exit 1
    fi
else
    echo "⚠️ WhatsApp non configuré - ignoré"
fi

# 7. Test performance pages critiques
echo "⚡ Test performance..."
PAGES=("/" "/pricing" "/track" "/dashboard")

for page in "${PAGES[@]}"; do
    START_TIME=$(date +%s%3N)
    RESPONSE=$(curl -s -w "%{http_code}" $BASE_URL$page)
    END_TIME=$(date +%s%3N)
    LOAD_TIME=$((END_TIME - START_TIME))
    HTTP_CODE="${RESPONSE: -3}"
    
    if [ "$HTTP_CODE" = "200" ] && [ "$LOAD_TIME" -lt 3000 ]; then
        echo "✅ $page: ${LOAD_TIME}ms"
    else
        echo "❌ $page: ${LOAD_TIME}ms (HTTP $HTTP_CODE)"
        exit 1
    fi
done

echo ""
echo "🎉 TOUS LES SMOKE TESTS RÉUSSIS !"
echo "✅ NextMove Cargo V1.0 prêt pour production"
echo ""
```

## Checklist Smoke Tests

### ✅ Tests Fonctionnels
- [ ] Connexion/déconnexion utilisateur
- [ ] Création de colis
- [ ] Calcul de prix
- [ ] Suivi de colis
- [ ] Navigation principale
- [ ] Responsive mobile

### ✅ Tests Intégrations
- [ ] Paiement Wave Money
- [ ] Notifications WhatsApp
- [ ] Upload d'images
- [ ] Génération PDF
- [ ] Envoi d'emails
- [ ] Base de données

### ✅ Tests Performance
- [ ] Temps de chargement < 3s
- [ ] API response < 1s
- [ ] Images optimisées
- [ ] Bundle size acceptable
- [ ] Lighthouse score > 90

### ✅ Tests Sécurité
- [ ] Headers sécurité présents
- [ ] HTTPS forcé
- [ ] Cookies sécurisés
- [ ] CSRF protection
- [ ] Rate limiting actif

### ✅ Tests Monitoring
- [ ] Sentry capture erreurs
- [ ] Logs structurés
- [ ] Health checks OK
- [ ] Alertes fonctionnelles
- [ ] Métriques collectées

## Rapport de Smoke Tests

### Template de Rapport
```markdown
# Rapport Smoke Tests - [DATE]

## Résumé Exécutif
- **Statut Global**: ✅ SUCCÈS / ❌ ÉCHEC
- **Tests Exécutés**: X/Y
- **Temps d'exécution**: X minutes
- **Environnement**: Production

## Détails par Catégorie

### Fonctionnalités Core
| Test | Statut | Temps | Notes |
|------|--------|-------|-------|
| Authentification | ✅ | 1.2s | OK |
| Création colis | ✅ | 2.1s | OK |
| Calcul prix | ✅ | 0.8s | OK |

### Intégrations
| Service | Statut | Temps | Notes |
|---------|--------|-------|-------|
| Wave Money | ✅ | 1.5s | OK |
| WhatsApp | ✅ | 2.3s | OK |
| Database | ✅ | 0.5s | OK |

### Performance
| Page | Temps | Lighthouse | Notes |
|------|-------|------------|-------|
| Homepage | 1.8s | 94 | OK |
| Dashboard | 2.1s | 91 | OK |
| Pricing | 1.5s | 96 | OK |

## Actions Requises
- [ ] Aucune - Tous tests OK
- [ ] Corriger [problème identifié]
- [ ] Optimiser [performance]

## Validation Go-Live
✅ Prêt pour mise en production
```

### Automatisation CI/CD
```yaml
# .github/workflows/smoke-tests.yml
name: Smoke Tests Production

on:
  deployment_status:
    branches: [main]

jobs:
  smoke-tests:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run Smoke Tests
      run: |
        chmod +x scripts/smoke-tests.sh
        ./scripts/smoke-tests.sh
      env:
        BASE_URL: ${{ secrets.PRODUCTION_URL }}
        ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
        
    - name: Notify Success
      if: success()
      run: |
        curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
          -d '{"text":"✅ Smoke tests réussis - Production OK"}'
        
    - name: Notify Failure
      if: failure()
      run: |
        curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
          -d '{"text":"❌ Smoke tests échoués - Vérifier production"}'
```
