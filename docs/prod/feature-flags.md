# 🚫 Désactivation Modules Test - Production V1.0

## Variables d'Environnement Production

### Désactivation Fonctionnalités Test
```env
# Désactiver modules de développement
ENABLE_DEV_TOOLS=false
ENABLE_PLAYGROUND=false
ENABLE_DEBUG_MODE=false
ENABLE_TEST_ROUTES=false

# Désactiver banners et notifications test
SHOW_BETA_BANNER=false
SHOW_DEV_NOTIFICATIONS=false
ENABLE_MOCK_DATA=false

# Désactiver logs verbeux
LOG_LEVEL=warn
DEBUG_SQL=false
VERBOSE_ERRORS=false

# Désactiver télémétrie développement
NEXT_TELEMETRY_DISABLED=1
DISABLE_ANALYTICS_DEV=true
```

## Modules à Désactiver

### 1. Routes de Développement
```typescript
// middleware.ts - Bloquer routes test en production
const DEV_ROUTES = [
  '/api/dev/',
  '/api/test/',
  '/playground',
  '/debug',
  '/admin/dev',
  '/sandbox'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Bloquer routes dev en production
  if (process.env.NODE_ENV === 'production') {
    for (const route of DEV_ROUTES) {
      if (pathname.startsWith(route)) {
        return NextResponse.json(
          { error: 'Route non disponible en production' },
          { status: 404 }
        );
      }
    }
  }
  
  // ... reste du middleware
}
```

### 2. Composants de Debug
```typescript
// components/DevTools.tsx - Conditionnel
export function DevTools() {
  // Ne pas afficher en production
  if (process.env.NODE_ENV === 'production' || !process.env.ENABLE_DEV_TOOLS) {
    return null;
  }
  
  return (
    <div className="dev-tools">
      {/* Outils de développement */}
    </div>
  );
}

// components/BetaBanner.tsx - Conditionnel
export function BetaBanner() {
  if (!process.env.SHOW_BETA_BANNER) {
    return null;
  }
  
  return (
    <div className="beta-banner">
      🧪 Version Beta - Fonctionnalités en test
    </div>
  );
}
```

### 3. Mock Data Services
```typescript
// lib/mock-data.ts - Désactiver en production
export class MockDataService {
  static isEnabled(): boolean {
    return process.env.ENABLE_MOCK_DATA === 'true' && 
           process.env.NODE_ENV !== 'production';
  }
  
  static getPackages() {
    if (!this.isEnabled()) {
      throw new Error('Mock data désactivé en production');
    }
    
    return MOCK_PACKAGES;
  }
  
  static getClients() {
    if (!this.isEnabled()) {
      throw new Error('Mock data désactivé en production');
    }
    
    return MOCK_CLIENTS;
  }
}
```

### 4. Logs de Debug
```typescript
// lib/logger.ts - Filtrer logs production
export class Logger {
  static debug(message: string, data?: any) {
    // Ignorer debug en production
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    
    console.debug(`[DEBUG] ${message}`, data);
  }
  
  static verbose(message: string, data?: any) {
    // Ignorer verbose en production
    if (process.env.NODE_ENV === 'production' || !process.env.VERBOSE_ERRORS) {
      return;
    }
    
    console.log(`[VERBOSE] ${message}`, data);
  }
  
  static info(message: string, data?: any) {
    console.info(`[INFO] ${message}`, data);
  }
  
  static warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data);
  }
  
  static error(message: string, data?: any) {
    console.error(`[ERROR] ${message}`, data);
  }
}
```

## Pages à Désactiver

### 1. Playground Pages
```typescript
// pages/playground/index.tsx
export default function PlaygroundPage() {
  // Rediriger en production
  if (process.env.NODE_ENV === 'production') {
    redirect('/dashboard');
  }
  
  return <PlaygroundContent />;
}

// pages/debug/index.tsx
export default function DebugPage() {
  // Bloquer en production
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  
  return <DebugContent />;
}
```

### 2. API Routes Test
```typescript
// pages/api/test/[...slug].ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Bloquer en production
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Route non disponible' });
  }
  
  // Logique de test...
}

// pages/api/dev/reset.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Bloquer en production
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Accès interdit en production' });
  }
  
  // Reset données de dev...
}
```

## Fonctionnalités à Masquer

### 1. Menus de Debug
```typescript
// components/Navigation.tsx
export function Navigation() {
  const showDevMenu = process.env.NODE_ENV !== 'production' && 
                      process.env.ENABLE_DEV_TOOLS === 'true';
  
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/packages">Colis</Link>
      <Link href="/clients">Clients</Link>
      
      {showDevMenu && (
        <div className="dev-menu">
          <Link href="/playground">Playground</Link>
          <Link href="/debug">Debug</Link>
          <Link href="/api/dev">API Dev</Link>
        </div>
      )}
    </nav>
  );
}
```

### 2. Boutons d'Actions Test
```typescript
// components/PackageActions.tsx
export function PackageActions({ packageId }: { packageId: string }) {
  const showTestActions = process.env.NODE_ENV !== 'production';
  
  return (
    <div className="package-actions">
      <button onClick={() => updateStatus('DELIVERED')}>
        Marquer livré
      </button>
      
      {showTestActions && (
        <>
          <button onClick={() => generateTestData()}>
            Générer données test
          </button>
          <button onClick={() => simulateError()}>
            Simuler erreur
          </button>
        </>
      )}
    </div>
  );
}
```

## Scripts de Nettoyage

### Script de Désactivation
```bash
#!/bin/bash
# scripts/disable-test-features.sh

echo "🚫 Désactivation modules test pour production..."

# 1. Supprimer fichiers de développement
echo "🗑️ Suppression fichiers dev..."
rm -rf pages/playground/
rm -rf pages/debug/
rm -rf components/dev/
rm -rf lib/mock-data.ts
rm -rf tests/manual/

# 2. Nettoyer API routes test
echo "🧹 Nettoyage API routes test..."
rm -rf pages/api/test/
rm -rf pages/api/dev/
rm -rf pages/api/playground/

# 3. Supprimer assets de développement
echo "📁 Suppression assets dev..."
rm -rf public/dev/
rm -rf public/test-images/
rm -rf public/mock-data/

# 4. Nettoyer dépendances dev
echo "📦 Nettoyage dépendances..."
npm prune --production

# 5. Vérifier variables d'environnement
echo "⚙️ Vérification variables..."
if grep -q "ENABLE_DEV_TOOLS=true" .env.production; then
    echo "❌ ENABLE_DEV_TOOLS encore activé"
    exit 1
fi

if grep -q "SHOW_BETA_BANNER=true" .env.production; then
    echo "❌ SHOW_BETA_BANNER encore activé"
    exit 1
fi

echo "✅ Modules test désactivés avec succès"
```

### Validation Post-Nettoyage
```bash
#!/bin/bash
# scripts/validate-production-clean.sh

echo "🔍 Validation nettoyage production..."

# 1. Vérifier absence routes test
echo "🚦 Vérification routes..."
RESPONSE=$(curl -s -w "%{http_code}" https://nextmove-cargo.vercel.app/playground)
if [ "${RESPONSE: -3}" = "404" ]; then
    echo "✅ Route /playground bloquée"
else
    echo "❌ Route /playground encore accessible"
    exit 1
fi

# 2. Vérifier absence API test
RESPONSE=$(curl -s -w "%{http_code}" https://nextmove-cargo.vercel.app/api/test/ping)
if [ "${RESPONSE: -3}" = "404" ]; then
    echo "✅ API test bloquée"
else
    echo "❌ API test encore accessible"
    exit 1
fi

# 3. Vérifier absence banners beta
RESPONSE=$(curl -s https://nextmove-cargo.vercel.app/)
if echo "$RESPONSE" | grep -q "beta-banner"; then
    echo "❌ Banner beta encore présent"
    exit 1
else
    echo "✅ Banner beta supprimé"
fi

# 4. Vérifier logs production
RESPONSE=$(curl -s https://nextmove-cargo.vercel.app/api/health)
if echo "$RESPONSE" | grep -q "debug"; then
    echo "❌ Logs debug encore présents"
    exit 1
else
    echo "✅ Logs debug supprimés"
fi

echo "✅ Validation nettoyage réussie"
```

## Checklist Désactivation

### ✅ Routes & Pages
- [ ] /playground supprimé
- [ ] /debug supprimé  
- [ ] /api/test/* bloqué
- [ ] /api/dev/* bloqué
- [ ] /sandbox supprimé

### ✅ Composants UI
- [ ] DevTools masqué
- [ ] BetaBanner supprimé
- [ ] DebugPanel masqué
- [ ] TestActions supprimés
- [ ] MockDataViewer supprimé

### ✅ Variables Environnement
- [ ] ENABLE_DEV_TOOLS=false
- [ ] ENABLE_PLAYGROUND=false
- [ ] SHOW_BETA_BANNER=false
- [ ] ENABLE_MOCK_DATA=false
- [ ] LOG_LEVEL=warn

### ✅ Fonctionnalités
- [ ] Mock data désactivé
- [ ] Logs debug supprimés
- [ ] Télémétrie dev désactivée
- [ ] Routes test bloquées
- [ ] Menus dev masqués

### ✅ Fichiers
- [ ] /lib/mock-data.ts supprimé
- [ ] /components/dev/ supprimé
- [ ] /pages/playground/ supprimé
- [ ] /tests/manual/ supprimé
- [ ] /public/dev/ supprimé

## Configuration Finale

### .env.production Final
```env
# Production - Modules test désactivés
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
LOG_LEVEL=warn

# Fonctionnalités désactivées
ENABLE_DEV_TOOLS=false
ENABLE_PLAYGROUND=false
ENABLE_DEBUG_MODE=false
ENABLE_TEST_ROUTES=false
SHOW_BETA_BANNER=false
SHOW_DEV_NOTIFICATIONS=false
ENABLE_MOCK_DATA=false
DEBUG_SQL=false
VERBOSE_ERRORS=false
DISABLE_ANALYTICS_DEV=true

# Production uniquement
FORCE_HTTPS=true
SECURE_COOKIES=true
```

### Middleware Final
```typescript
// middleware.ts - Configuration production
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Bloquer toutes les routes de développement
  const blockedPaths = [
    '/playground',
    '/debug', 
    '/api/test',
    '/api/dev',
    '/sandbox',
    '/mock'
  ];
  
  if (process.env.NODE_ENV === 'production') {
    for (const path of blockedPaths) {
      if (pathname.startsWith(path)) {
        return new NextResponse(null, { status: 404 });
      }
    }
  }
  
  // Continuer avec middleware normal
  return NextResponse.next();
}
```
