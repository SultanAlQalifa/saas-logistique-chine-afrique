# ✅ Checklist de Validation — Sidebar & 404

## A. Sidebar (comportement & accessibilité)

- [ ] **Auto-rétraction** après 8 s d'inactivité (si non épinglée)
- [ ] **Accordéon** : ouvrir Finances referme Opérations (et inversement)
- [ ] **Hover-expand** : survol ouvre temporairement la sidebar rétractée (se referme au mouseout)
- [ ] **Pin/Unpin** : épingler empêche toute auto-rétraction; l'état persiste après reload
- [ ] **Clavier** : Tab/Shift+Tab naviguent; Entrée ouvre/ferme une rubrique; Échap rétracte
- [ ] **ARIA** : role="navigation", aria-expanded correct sur la rubrique active
- [ ] **Responsive** : <1280 px = overlay (focus-trap) ; ≥1280 px = docked
- [ ] **Pas d'auto-rétraction** pendant un drag, menu contextuel, ou modale ouverte

## B. Changement de langue partout

- [ ] Depuis **Finances > Facturation**, passage FR→EN et retour fonctionne
- [ ] Depuis **Opérations > Expéditions**, passage FR→EN et retour fonctionne  
- [ ] Depuis **Support > Tickets**, passage FR→EN et retour fonctionne
- [ ] La **locale choisie persiste** (profil + cookie) après reconnexion et hard refresh

## C. Routes & 404

- [ ] **Tous les liens** utilisent le router (pas d'URL "en dur")
- [ ] Les **alias i18n** mènent à la même route nommée
- [ ] **Anciennes URLs** redirigent vers les nouvelles (301/302 attendues)
- [ ] **Page 404** affiche recherche + liens utiles; l'événement 404 est loggé (route, referrer, user/tenant)
- [ ] **Crawl interne** (link-checker) : 0 lien critique en 404/500

## D. Boutons / Icônes / Actions

- [ ] **Tous les CTA** ont un état loading/disabled pendant l'action
- [ ] **Icônes cohérentes** (même librairie, taille 16–20 px), tooltips présents
- [ ] Les **redirections post-action** (ex. "Créer un devis") mènent à la bonne page
- [ ] **Raccourcis clavier** principaux OK (Enter/Space = valider, Esc = annuler/fermer)

---

## 🧪 Scénarios E2E (Playwright/Cypress)

### 1) Sidebar — Accordéon & Auto-rétraction
```typescript
// Aller sur /operations
await page.goto('/dashboard/operations')

// Cliquer "Finances" → vérifier que "Opérations" est fermée
await page.click('button:has-text("Finances")')
await expect(page.locator('#section-operations')).not.toBeVisible()

// Ne rien faire 8 s → sidebar rétractée (si non épinglée)
await page.waitForTimeout(9000)
const sidebar = page.locator('[role="navigation"]')
const isPinned = await page.locator('button[title*="Détacher"]').isVisible()
if (!isPinned) {
  await expect(sidebar).toHaveClass(/w-16/)
}

// Survoler la zone sidebar → elle se déploie
await sidebar.hover()
await expect(sidebar).toHaveClass(/w-64/)

// Cliquer l'icône pin → la sidebar reste ouverte après 10 s
await page.click('button[title*="Épingler"]')
await page.waitForTimeout(10000)
await expect(sidebar).toHaveClass(/w-64/)
```

### 2) Langue — Partout, pas seulement l'accueil
```typescript
// Ouvrir /finances/facturation → switch EN → labels en anglais
await page.goto('/dashboard/finances/invoicing')
await page.click('[data-testid="language-switcher"]')
await page.click('text=English')
await expect(page.locator('h1')).toContainText('Invoicing')

// Reload dur → la langue reste EN
await page.reload()
await expect(page.locator('h1')).toContainText('Invoicing')

// Switch FR depuis /support/tickets/123 → labels reviennent en français
await page.goto('/dashboard/support/tickets')
await page.click('[data-testid="language-switcher"]')
await page.click('text=Français')
await expect(page.locator('h1')).toContainText('Tickets')
```

### 3) Routes stables & 404 UX
```typescript
// Parcourir chaque entrée de routes.manifest.json
const routes = Object.values(routesManifest.routes)
for (const route of routes) {
  if (!route.path.includes(':') && !route.guards?.includes('SUPER_ADMIN')) {
    await page.goto(route.path)
    const response = await page.waitForResponse(resp => resp.url().includes(route.path))
    expect(response.status()).toBeLessThan(400)
  }
}

// URL invalide → page 404 avec recherche + log
await page.goto('/this-does-not-exist')
await expect(page.locator('h1')).toContainText('Page non trouvée')
await expect(page.locator('input[placeholder*="Rechercher"]')).toBeVisible()
```

### 4) États UI
```typescript
// Formulaire → bouton loading/disabled
await page.click('button:has-text("Créer un devis")')
await page.fill('[name="description"]', 'Test devis')
await page.click('button[type="submit"]')

// Vérifier état loading
await expect(page.locator('button[type="submit"]')).toBeDisabled()
await expect(page.locator('button[type="submit"]')).toContainText('Création...')

// Vérifier tooltips
const icons = page.locator('[data-testid*="icon"]').first()
await icons.hover()
await expect(page.locator('[role="tooltip"]')).toBeVisible()
```

---

## 🧰 Modèle de Log de Bugs

```markdown
### [Titre court] Sidebar ne se rétracte pas après inactivité (non épinglée)

**Environnement :** PROD | Tenant=X | Navigateur=Chrome 126 | Écran=1440x900
**URL :** https://app.nextmove/.../operations

**Étapes :**
1. Ouvrir la page /operations
2. S'assurer que la sidebar N'EST PAS épinglée
3. Ne faire aucune action pendant 10 s

**Résultat observé :**
- La sidebar reste ouverte

**Résultat attendu :**
- La sidebar se rétracte (slide à droite) après 8 s d'inactivité

**Logs/Console :**
- Aucun warning ; event "ui.busy=false"

**Capture :**
- (joindre screenshot/vidéo)

**Priorité :**
- Haute (UX de base)
```

---

## 🧯 Plan d'Action Express si 404 persistent

1. **Exporter** la table des routes effectives (nom, chemin, i18n, guards)
2. **Diff** avec routes.manifest.json : repérer les écarts
3. **Rechercher** dans le code `href="` et remplacer par `routerLink` / `Link` (routes nommées)
4. **Ajouter redirections** (redirects) pour anciennes URLs publiques (301)
5. **Relancer** le link-checker et bloquer le build si erreurs > 0

## Pages Critiques à Crawler en Premier

### Navigation Principale
- [ ] `/dashboard` - Tableau de bord
- [ ] `/dashboard/packages` - Gestion Colis
- [ ] `/dashboard/finances/invoicing` - Facturation
- [ ] `/dashboard/operations/expeditions` - Expéditions
- [ ] `/dashboard/support/tickets` - Support

### Pages Profondes Critiques
- [ ] `/dashboard/client/packages` - Colis Client
- [ ] `/dashboard/finances/accounting` - Comptabilité
- [ ] `/dashboard/support/chatbot` - Chatbot IA
- [ ] `/dashboard/marketing/integrations` - Intégrations Pub
- [ ] `/dashboard/profile` - Profil Utilisateur

### Pages Publiques
- [ ] `/` - Accueil
- [ ] `/track` - Suivi Public
- [ ] `/auth/signin` - Connexion
- [ ] `/pricing` - Tarifs

### Redirections à Tester
- [ ] `/factures` → `/dashboard/finances/invoicing`
- [ ] `/colis` → `/dashboard/packages`
- [ ] `/suivi` → `/track`
- [ ] `/connexion` → `/auth/signin`
