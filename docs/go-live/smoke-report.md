# 🔍 SMOKE TESTS REPORT - NextMove Cargo V1.0

**Date**: 21/08/2025  
**Version**: nextmove@1.0.0  
**Statut**: 🟡 EN COURS  

## A. Headers & Rate Limit

### Headers de Sécurité
- [ ] **CSP (Content Security Policy)** - À vérifier
- [ ] **X-Frame-Options** - À vérifier  
- [ ] **X-Content-Type-Options** - À vérifier
- [ ] **Referrer-Policy** - À vérifier
- [ ] **HSTS (Strict-Transport-Security)** - À vérifier

**Test Command**: `curl -I https://localhost:3000/api/health`

### Rate Limiting
- [ ] **100 req/min/IP** - À tester
- [ ] **429 Too Many Requests** après dépassement - À vérifier

**Test Command**: 
```bash
for i in {1..105}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/health; done
```

## B. Cookies & Consentement

### Bandeau de Consentement
- [ ] **Navigation privée** → Bandeau s'affiche
- [ ] **Accepter** → Bandeau disparaît + analytics activés
- [ ] **Refuser** → Bandeau disparaît + analytics désactivés

### Cookies de Session
- [ ] **nm_sess** présent après login
- [ ] **HttpOnly=true** 
- [ ] **Secure=true** (en production)
- [ ] **SameSite=Lax/Strict**

**Test Command**: `curl -I https://localhost:3000/auth/signin`

## C. Images & Lazy Loading

### Next.js Image Optimization
- [ ] **Toutes les images** utilisent `next/image`
- [ ] **Lazy loading** activé par défaut
- [ ] **Formats optimisés** (WebP, AVIF)

### Pages Lourdes
- [ ] **Blog** → Lazy loading OK
- [ ] **Community** → Lazy loading OK
- [ ] **Documentation** → Lazy loading OK

## D. UX & Interface

### Loaders
- [ ] **Login** → Spinner visible pendant auth
- [ ] **Paiement** → Loading state pendant transaction
- [ ] **Suivi** → Loader pendant recherche colis

### Menus
- [ ] **"Clients Entreprises"** ≠ **"Mes Clients"** - Clarification OK
- [ ] **Navigation** → Blog, Communauté accessibles
- [ ] **Footer** → Liens légaux présents

## E. Base de Données & Prisma

### Migrations
- [ ] **Prisma migrate status** → Toutes appliquées
- [ ] **Pas de mock data** restante
- [ ] **Seed data** cohérente

### Index de Performance
- [ ] **users** → email, id
- [ ] **shipments** → trackingNumber, status
- [ ] **transactions** → paymentId, status

**Test Command**: `npx prisma db seed`

## F. Intégrations Externes

### WhatsApp Business Cloud API
- [ ] **Template test** envoyé avec succès
- [ ] **Webhook status** reçu et traité
- [ ] **Credentials** valides en .env

### Wave Money API
- [ ] **Paiement test 1000 FCFA** → PENDING
- [ ] **Transition** PENDING → SUCCESS
- [ ] **Webhook signé** reçu et validé
- [ ] **Écriture DB** transaction complète

## G. Tests Playwright

### Suites de Tests
- [ ] **test:e2e** → 100% PASS
- [ ] **test:auth** → 100% PASS  
- [ ] **test:payment** → 100% PASS
- [ ] **test:tracking** → 100% PASS
- [ ] **test:cookies** → 100% PASS

**Test Command**: `npm run test:e2e`

---

## 🚨 ISSUES DÉTECTÉES

### Critiques (BLOQUANT)
*Aucune pour le moment*

### Mineures (À CORRIGER)
*Aucune pour le moment*

---

## ✅ CRITÈRES GO/NO-GO

- [ ] **Tous les tests** Playwright PASS
- [ ] **Headers sécurité** présents
- [ ] **Rate limiting** fonctionnel
- [ ] **Intégrations** WhatsApp + Wave validées
- [ ] **UX critique** sans blocage
- [ ] **DB** prête pour production

**STATUT FINAL**: 🟡 **EN COURS** | 🟢 **GO** | 🔴 **NO-GO**

---

*Rapport généré automatiquement - NextMove Cargo DevOps*
