# 🚀 MASTER PROMPT — i18n FR global + Sidebar intelligente + Tracking alphanumérique + Audit UI

## 0) Objectifs
- **Langue** : Interface FR par défaut, sélecteur de langue global (FR/EN/…) accessible partout, persistant par profil utilisateur et cookie, jamais limité à l'accueil.
- **Navigation** : Sidebar et rubriques auto-rétractables (gain d'espace), avec logique d'accordéon, épingle (pin), mémorisation d'état, accessibilité clavier.
- **Tracking** : Tous les numéros de suivi doivent être alphanumériques (au moins 1 lettre et 1 chiffre). Interdire les codes 100 % lettres ou 100 % chiffres. Migrer le stock existant et imposer la règle côté API/DB/UI.
- **Qualité UI** : Vérifier et corriger automatiquement : boutons, icônes, liens/redirections, touches rapides (actions), états désactivés/chargement, feedback d'erreur.

## 1) Internationalisation (i18n)

### FR par défaut
- Activer i18n avec locales : fr (default), en.
- Fallback : fr.
- Interdire l'affichage de clés anglaises brutes (si clé manquante → fallback fr).

### Sélecteur de langue "global"
**Emplacements** : header (toujours visible) + menu utilisateur.
**Persistance** : users.locale (BD) ET cookie locale (365j).
**Middleware** : sur chaque requête, déterminer la locale : query ? cookie ? user.locale ? default(fr).

### Routage & SEO
- Support /{locale}/… (optionnel) + balises hreflang.
- Générer traductions pour : titres, menus, labels, messages d'erreur, placeholders, CTA, tooltips, états vides.

### CI i18n
- Tâche qui échoue le build si des chaînes non traduites sont détectées (lint i18n).
- Script i18n:extract + i18n:check.

## 2) Sidebar & rubriques auto-rétractables

### Comportement
- La sidebar se rétracte automatiquement (slide vers la droite) quand l'utilisateur n'interagit pas (inactivité 8 s) ou quand une page avec contenu dense est ouverte.
- Accordéon : lorsqu'une rubrique s'ouvre, les autres se referment.
- Hover pour expand (0.2 s) + Pin (icône épingle) pour la garder ouverte.
- Mémoriser l'état par utilisateur (users.ui_prefs.sidebar={pinned, last_section}).

### Accessibilité
- Navigation clavier (Tab/Shift+Tab), flèches ↑↓ pour sections, Enter pour ouvrir/fermer, Esc pour rétracter.
- ARIA : aria-expanded, aria-controls, role="navigation", ordre logique.

### Performance/UX
- Animation 150–200 ms (CSS transform, GPU).
- Lazy-load du contenu de sous-rubriques au premier expand.

## 3) Tracking number strictement alphanumérique

### Règle fonctionnelle
- Doit contenir : ≥1 lettre (A-Z) et ≥1 chiffre (0-9), sans espaces, -/_ autorisés optionnellement (à confirmer).
- Interdits : tout-lettres, tout-chiffres.
- Longueur : 8–20 (à appliquer dès maintenant).

### Validation
**Regex stricte (majuscules)** :
```regex
^(?=.*[A-Z])(?=.*\d)[A-Z0-9]{8,20}$
```
(si tirets/underscores permis : `^(?=.*[A-Z])(?=.*\d)[A-Z0-9_-]{8,20}$` + interdire début/fin par séparateur)

**UI** : transformer auto en MAJUSCULE, trim, enlever espaces.

### API & BD
- **API** : refuser 400 si non conforme.
- **BD** : index unique shipments.tracking_code + CHECK CONSTRAINT (ou trigger si moteur ne supporte pas le CHECK regex).
- Éviter collisions lors de migration (voir §3.4).

### Migration automatique des existants
- **Pour tout code numérique-seul** : préfixer par une lettre calculée (A + checksum mod 26), ex : 12345678 → K12345678.
- **Pour tout code alphabétique-seul** : suffixer par 2 chiffres (%97 d'un hash) pour atteindre la longueur min, ex : ABCDEFGH → ABCDEFGH42.
- **Si longueur hors 8–20**, re-hasher en 12–14 chars alphanum.
- Table de correspondance tracking_renames(old_code, new_code, changed_at, reason) et log d'audit.
- Notifier via bannière Admin : "X codes corrigés" + export CSV.

### Rétro-compatibilité
- Alias lookup temporaire : pendant 90 jours, si un ancien code est saisi, rediriger vers le nouveau via tracking_renames.

## 4) Audit & correctifs automatiques de l'UI

### Vérifier et corriger
- **Boutons** : labels FR, états loading/disabled, tailles cohérentes, contraste AA.
- **Icônes** : présence, taille 16–20 px, alternative textuelle (tooltip), cohérence set d'icônes.
- **Redirections/liens** : routes valides, pas d'URL mortes, ouverture target correcte.
- **Touches d'action** : Enter/Space déclenchent l'action, Escape annule/ferme, raccourcis (ex. g+s → "Rechercher").
- **Sections d'action** : CTA primaires visibles au dessus de la ligne de flottaison, confirmations non bloquantes.

### Tests end-to-end (à ajouter)
**Scénarios Playwright/Cypress** :
- **i18n** : bascule FR↔EN depuis toutes les pages (pas seulement l'accueil), persistance cookie+profil.
- **Sidebar** : auto-rétraction après navigation + accélérateur clavier + pin/unpin + mémorisation.
- **Tracking** : création + recherche + import CSV → rejets corrects + messages FR, migration respectée, alias lookup OK.
- **Liens/CTA** : cliquer tous les boutons principaux des modules et vérifier la navigation (HTTP 200/OK).
- **Icônes** : snapshot visuel pour absence/rupture.

### Lint & CI
- Lint i18n (chaînes non traduites) → build fail.
- Lint a11y de base (roles/aria manquants) → warnings.
- Rapport HTML "UI audit" joint au build.

## 5) Implémentation rapide (pistes techniques)

### i18n
- Extraire toutes les chaînes dans /locales/fr.json et /locales/en.json.
- Middleware locale côté backend + guard côté front (hydrate locale à l'app mount).

### Sidebar
- Composant SidebarShell avec props {autoCollapse, pinned, onPinToggle} ; stocker préférences utilisateur.

### Tracking
- **Formulaires** : masque + regex + helper normalizeTracking().
- **API** : valider avant insert/update.
- **BD** : index unique + contrainte (ou trigger).
- **Migration script** : tâche idempotente avec dry-run + CSV des changements.

### Audit UI
- Script de crawl interne (headless) qui clique les CTA connus, log 404/500, exporte un rapport.

## 6) Tests d'acceptation (doit passer)

- **Langue** : depuis "Finances > Facturation" ou "Opérations > Expéditions", changer la langue fonctionne, persiste après reload.
- **Sidebar** : ouvrir "Opérations", puis "Finances" → "Opérations" se rétracte ; quitter souris → sidebar se rétracte à droite (si non épinglée).
- **Tracking** : tentative "12345678" → rejet en saisie (si création) ; si existant, migration → "K12345678" + alias 90 j.
- **UI** : aucun bouton orphelin, toutes les icônes présentes, toutes les redirections OK, raccourcis clavier actifs, messages FR.

## 7) Journalisation & rollback

- **Audit** : audit_logs pour migrations tracking, changements de langue, pin/unpin sidebar, corrections auto de liens.
- **Rollback** : fichier CSV tracking_renames pour revenir en arrière si besoin (désactivable).

---

**Fin du prompt.**

Avec ceci, Windsurf appliquera immédiatement : FR partout + switch global, sidebar/rubriques intelligentes, tracking 100 % alphanumérique avec migration, et un grand ménage UI (boutons/icônes/liens/touches) avec tests d'acceptation.
