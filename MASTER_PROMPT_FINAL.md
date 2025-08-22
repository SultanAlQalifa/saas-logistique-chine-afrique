# 🚀 MASTER PROMPT FINAL — NextMove SaaS Platform

## 0) Objectifs Globaux
- **Langue** : FR par défaut, sélecteur de langue global accessible partout
- **Navigation** : Sidebar/rubriques auto-rétractables avec accordéon, pin/unpin, mémorisation
- **Tracking** : Numéros de suivi strictement alphanumériques avec migration & validation
- **Qualité UI** : Audit et correctifs auto (boutons, icônes, liens, raccourcis)
- **Mode d'affichage** : Choix entre Sombre, Clair, Défaut (auto), activable partout
- **Paiements** : Système complet API Propre vs Délégué, multi-devises XOF pivot

## 1) Internationalisation (i18n) - Français Global

### Langue par défaut : Français
- Tous les textes UI, messages d'erreur, notifications en français
- Formats localisés : dates (DD/MM/YYYY), nombres (1 234,56 €), devises
- Validation messages en français avec contexte métier

### Sélecteur de langue global
**Emplacement** :
- Header principal (drapeau FR/EN/ES)
- Menu utilisateur dropdown
- Footer (liens rapides)

**Persistance** :
- `users.ui_prefs.language` en base de données
- Cookie `lang` (365 jours)
- Priorité : user.pref > cookie > browser.lang > 'fr'

**Comportement** :
- Switch instantané sans rechargement (i18next/react-i18next)
- URLs localisées : `/fr/dashboard`, `/en/dashboard`
- Formats adaptés par locale (dates, devises, nombres)

### Structure technique
```
/locales/
  fr/
    common.json (boutons, navigation, erreurs)
    dashboard.json (tableaux de bord)
    tracking.json (suivi colis)
    payments.json (paiements)
    billing.json (facturation)
  en/
    [même structure]
  es/
    [même structure]
```

### Tests d'acceptation
- Depuis n'importe quelle page, changer FR → EN → ES sans perte de contexte
- Reconnexion = conserver la langue choisie
- Formats dates/nombres corrects selon locale
- Tous les textes traduits (0% anglais résiduel)

## 2) Sidebar Intelligente & Navigation

### Comportement auto-rétractable
- **Desktop** : Sidebar pleine largeur par défaut, rétractable sur clic
- **Mobile** : Overlay modal avec backdrop
- **Tablet** : Mode hybride selon orientation

### Accordéon intelligent
- Sections principales : Dashboard, Expéditions, Finances, Paramètres
- Auto-expand de la section active
- Mémorisation état ouvert/fermé par utilisateur
- Animation fluide (300ms ease-in-out)

### Pin/Unpin & mémorisation
- Bouton pin en haut de sidebar
- État persisté : `users.ui_prefs.sidebar_pinned` (boolean)
- Mode unpinned : auto-collapse après 3s sans hover
- Mode pinned : reste ouverte, redimensionnable

### Navigation contextuelle
- Breadcrumbs automatiques basés sur la route
- Indicateurs visuels : page active, sections visitées
- Raccourcis clavier : `Ctrl+B` toggle sidebar, `Ctrl+Shift+S` search

### Tests d'acceptation
- Navigation fluide entre toutes les sections sans lag
- État sidebar conservé après refresh/reconnexion
- Responsive parfait mobile/tablet/desktop
- Accessibilité clavier complète

## 3) Tracking Alphanumérique Strict

### Format imposé
- **Exactement 6 caractères alphanumériques** : `[A-Z0-9]{6}`
- Exemples valides : `A3X9K2`, `123456`, `B7Y4M1`
- Exemples invalides : `12345` (trop court), `ABCDEF7` (trop long), `A3-X9K` (caractères spéciaux)

### Migration des données existantes
- Script de migration : convertir tous les PINs numériques existants
- Mapping : `123456` → `A3X9K2` (algorithme déterministe)
- Backup avant migration + rollback possible
- Logs détaillés de la conversion

### Validation stricte
**Frontend** :
- Input pattern : `[A-Z0-9]{6}`
- Validation temps réel avec feedback visuel
- Messages d'erreur français : "Le numéro de suivi doit contenir exactement 6 caractères alphanumériques"

**Backend** :
- Validation API : regex strict + longueur
- Recherche insensible à la casse : `pin.toUpperCase()`
- Index base de données sur PIN normalisé

### Interface utilisateur
- Placeholder : "Ex: A3X9K2"
- Auto-uppercase lors de la saisie
- Bouton "Générer PIN" pour création automatique
- Historique des recherches récentes

### Tests d'acceptation
- Impossible de créer/rechercher un PIN non-conforme
- Migration complète sans perte de données
- Recherche fonctionne avec anciennes et nouvelles données
- Performance optimale avec index

## 4) Audit UI & Correctifs Automatiques

### Détection automatique des problèmes
- **Boutons sans action** : `<button>` sans `onClick` ou `type`
- **Liens cassés** : `<Link>` avec `href` invalide ou manquant
- **Icônes manquantes** : Import/export d'icônes non résolus
- **Raccourcis non fonctionnels** : `Ctrl+X` sans handler
- **Contrastes insuffisants** : Ratio < 4.5:1 (WCAG AA)

### Correctifs automatiques
**Boutons** :
- Ajouter `type="button"` par défaut
- Wrapper dans `<form>` si action de soumission
- Ajouter `disabled` state et loading spinner

**Icônes** :
- Remplacer imports manquants par icônes Heroicons équivalentes
- Fallback : icône générique + tooltip explicatif
- Audit des imports : détecter unused/missing

**Liens** :
- Valider tous les `href` internes/externes
- Ajouter `target="_blank" rel="noopener"` pour liens externes
- Breadcrumbs automatiques basés sur routing

### Monitoring continu
- Dashboard d'audit UI accessible aux admins
- Alertes automatiques sur nouveaux problèmes détectés
- Métriques : % pages sans erreurs, temps de résolution
- Intégration CI/CD : bloquer deploy si audit critique

### Tests d'acceptation
- Scan complet de l'app : 0 bouton/lien/icône cassé
- Tous les raccourcis clavier fonctionnels
- Contrastes conformes WCAG AA minimum
- Dashboard audit à jour en temps réel

## 5) Mode d'Affichage (Thème Sombre/Clair/Défaut)

### Options disponibles
- **Clair** : UI lumineuse standard
- **Sombre** : palette sombre complète (fond sombre, texte clair, contrastes AA)
- **Défaut/Auto** : suit les préférences système (`prefers-color-scheme`)

### Comportement
**Sélecteur dans** :
- Header (icône lune/soleil/système)
- Menu utilisateur
- Page paramètres utilisateur

**Persistance** :
- `users.ui_prefs.theme` en BD (`'light'|'dark'|'auto'`)
- Cookie `theme` (365j)
- Application instantanée sans rechargement (toggle CSS classes)
- Priorité : user.pref > cookie > system default

### Accessibilité & UX
- Respect du contraste (AA/AAA WCAG)
- Icône + label clair ("Mode sombre", "Mode clair", "Auto")
- Animation douce (150ms fade) lors du switch
- Accessible clavier : Tab → Enter/Space toggle

### Technique
- Ajouter classe root `<html data-theme="dark|light|auto">`
- Synchroniser avec tailwind/SCSS variables (`:root { --color-bg: … }`)
- Hook front `useTheme()` qui applique préférences
- Backend : exposer préférence dans profil utilisateur

### Palette de couleurs
**Mode Clair** :
- Background : `#ffffff`, `#f8fafc`
- Text : `#1f2937`, `#374151`
- Primary : `#3b82f6`
- Border : `#e5e7eb`

**Mode Sombre** :
- Background : `#0f172a`, `#1e293b`
- Text : `#f1f5f9`, `#cbd5e1`
- Primary : `#60a5fa`
- Border : `#334155`

### Tests d'acceptation
- Depuis toute page (ex. Facturation), switcher sombre ↔ clair sans reload
- Reconnexion = conserver le thème choisi
- "Défaut" = suit l'OS (testé en changeant paramètres système)
- Audit contraste OK en sombre comme en clair

## 6) Système de Paiements Complet

### Modes de Paiement
**API_PROPRE** :
- Tenants configurent leurs propres agrégateurs
- Paiements vont directement chez le tenant
- Pas de wallet ni décaissements
- Limites par plan (Standard: 2 providers, VIP: illimité)

**DELEGUE** :
- Utilise les agrégateurs de la plateforme
- Wallets avec soldes en XOF + devise d'affichage
- Système de décaissements avec workflow d'approbation
- Frais plateforme et provider automatiques

### Multi-Devises XOF Pivot
- Toutes les écritures financières stockées en XOF
- Conversion temps réel pour affichage utilisateur
- Taux de change utilisés conservés pour audit
- Support : XOF, EUR, USD, GBP, CAD

### Providers Supportés
- **Mobile Money** : Wave, Orange Money, MTN Money
- **Cartes** : Paystack, Stripe, Flutterwave
- **Autres** : PayPal, virements bancaires

### Sécurité & Audit
- Vérification signatures webhooks
- Journalisation complète des actions sensibles
- Contrôles d'accès par rôle (OWNER/TENANT/USER)
- Chiffrement des credentials providers

## 7) Architecture Technique

### Stack Principal
- **Frontend** : Next.js 14, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Prisma ORM
- **Base de données** : PostgreSQL 14+
- **Auth** : NextAuth.js
- **i18n** : react-i18next
- **State** : Zustand + React Query

### Structure des dossiers
```
/src/
  /app/                 # App Router Next.js 14
  /components/          # Composants réutilisables
  /lib/                 # Services métier
  /types/               # Types TypeScript
  /hooks/               # Hooks React personnalisés
  /locales/             # Fichiers de traduction
  /styles/              # CSS/Tailwind
/prisma/
  schema.prisma         # Modèle de données
  /migrations/          # Migrations DB
```

### Performance & Optimisation
- Server Components par défaut
- Lazy loading des composants lourds
- Image optimization (Next.js Image)
- Bundle splitting automatique
- Cache Redis pour sessions/i18n

## 8) Tests & Qualité

### Tests Automatisés
- **Unit** : Jest + Testing Library
- **Integration** : API routes avec base de test
- **E2E** : Playwright sur parcours critiques
- **Visual** : Chromatic pour composants

### Métriques Qualité
- Code coverage > 80%
- Performance Lighthouse > 90
- Accessibilité WCAG AA
- SEO optimisé

### CI/CD Pipeline
- Tests automatiques sur PR
- Audit sécurité (Snyk)
- Build et deploy automatique
- Monitoring erreurs (Sentry)

## 9) Déploiement & Monitoring

### Environnements
- **Dev** : Local avec Docker
- **Staging** : Vercel Preview
- **Prod** : Vercel Production

### Variables d'environnement
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
WAVE_API_KEY=...
PAYSTACK_SECRET_KEY=...
STRIPE_SECRET_KEY=...
```

### Monitoring
- **Uptime** : Vercel Analytics
- **Erreurs** : Sentry
- **Performance** : Web Vitals
- **Business** : Dashboard admin intégré

## 10) Roadmap & Évolutions

### Phase 1 (Actuelle)
- ✅ i18n français global
- ✅ Sidebar intelligente
- ✅ Tracking alphanumérique
- ✅ Audit UI automatique
- ✅ Thèmes sombre/clair/auto
- ✅ Système paiements complet

### Phase 2 (Q1 2024)
- Mobile app React Native
- API publique pour intégrations
- Marketplace d'extensions
- Analytics avancées

### Phase 3 (Q2 2024)
- IA pour optimisation logistique
- Blockchain pour traçabilité
- Expansion géographique

---

**🎯 Ce MASTER PROMPT couvre l'intégralité de la plateforme NextMove SaaS avec tous les modules demandés. Il peut être appliqué directement dans Windsurf pour une implémentation complète et cohérente.**
