# 🚀 Guide de Déploiement Vercel - NextMove Cargo

## ✅ PRÉPARATION TERMINÉE

Tous les fichiers ont été optimisés pour un déploiement Vercel réussi :

- ✅ `next.config.js` optimisé avec `output: 'standalone'`
- ✅ `package.json` avec scripts de build corrects
- ✅ `vercel.json` configuré pour Next.js 14
- ✅ Middleware sécurisé avec routes publiques
- ✅ API de santé `/api/health` créée
- ✅ Build local testé et fonctionnel

## 🎯 DÉPLOIEMENT MANUEL (3 COMMANDES)

### 1. Connexion à Vercel
```bash
npx vercel login
```

### 2. Configuration initiale du projet
```bash
npx vercel
```
**Répondez :**
- Set up and deploy? → `Y`
- Which scope? → Choisissez votre compte
- Link to existing project? → `N`
- Project name → `nextmove-cargo-saas`
- Directory → `./` (par défaut)

### 3. Déploiement en production
```bash
npx vercel --prod
```

## 🔧 VARIABLES D'ENVIRONNEMENT VERCEL

### Variables Essentielles (À configurer dans Vercel UI)

```bash
# Base Configuration
NODE_ENV=production
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=votre-secret-nextauth-32-caracteres-minimum

# Database (Supabase/Neon/PlanetScale recommandé)
DATABASE_URL=postgresql://user:password@host:5432/nextmove_prod
DIRECT_URL=postgresql://user:password@host:5432/nextmove_prod

# Security
FORCE_HTTPS=true
SECURE_COOKIES=true
CSRF_SECRET=votre-csrf-secret-32-caracteres

# SEO & Analytics
NEXT_PUBLIC_SITE_URL=https://votre-domaine.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=votre-code-verification

# Email (SendGrid/Resend)
EMAIL_FROM=noreply@votre-domaine.com
SENDGRID_API_KEY=votre-cle-sendgrid

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### Variables Optionnelles (Configuration post-déploiement)

```bash
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=votre-phone-number-id
WHATSAPP_ACCESS_TOKEN=votre-access-token
WHATSAPP_APP_ID=votre-app-id
WHATSAPP_APP_SECRET=votre-app-secret
WHATSAPP_WEBHOOK_VERIFY_TOKEN=votre-webhook-token
WHATSAPP_BUSINESS_ACCOUNT_ID=votre-business-account-id

# Mobile Money APIs
WAVE_API_KEY=votre-wave-api-key
WAVE_API_SECRET=votre-wave-api-secret
ORANGE_MONEY_API_KEY=votre-orange-api-key
MTN_MONEY_API_KEY=votre-mtn-api-key

# Advertising APIs
META_APP_ID=votre-meta-app-id
META_APP_SECRET=votre-meta-app-secret
GOOGLE_ADS_CLIENT_ID=votre-google-ads-client-id
TIKTOK_APP_ID=votre-tiktok-app-id

# Monitoring
SENTRY_DSN=votre-sentry-dsn
SENTRY_ORG=votre-org
SENTRY_PROJECT=nextmove-cargo
```

## 📋 CHECKLIST POST-DÉPLOIEMENT

### Immédiat (Jour 1)
- [ ] Vérifier que le site se charge : `https://votre-domaine.vercel.app`
- [ ] Tester l'API de santé : `https://votre-domaine.vercel.app/api/health`
- [ ] Configurer la base de données PostgreSQL
- [ ] Tester la connexion utilisateur
- [ ] Configurer les variables d'environnement essentielles

### Court terme (Semaine 1)
- [ ] Configurer le domaine personnalisé
- [ ] Activer Google Analytics
- [ ] Configurer l'email (SendGrid/Resend)
- [ ] Tester les fonctionnalités principales
- [ ] Configurer Sentry pour le monitoring

### Moyen terme (Mois 1)
- [ ] Intégrer WhatsApp Business API
- [ ] Configurer les APIs de paiement mobile
- [ ] Activer les intégrations publicitaires
- [ ] Optimiser les performances
- [ ] Configurer les sauvegardes

## 🔗 RESSOURCES UTILES

- **Vercel Dashboard** : https://vercel.com/dashboard
- **Next.js Deployment** : https://nextjs.org/docs/deployment
- **Vercel CLI Docs** : https://vercel.com/docs/cli
- **Environment Variables** : https://vercel.com/docs/concepts/projects/environment-variables

## 🚨 NOTES IMPORTANTES

1. **Base de données** : Utilisez Supabase, Neon ou PlanetScale pour PostgreSQL managé
2. **Domaine personnalisé** : Configurez après le premier déploiement
3. **HTTPS** : Automatique avec Vercel
4. **Monitoring** : Intégrez Sentry dès le déploiement
5. **Sauvegardes** : Configurez les sauvegardes automatiques de la DB

## 🎯 COMMANDES DE DÉPANNAGE

```bash
# Redéployer
npx vercel --prod

# Voir les logs
npx vercel logs

# Lister les déploiements
npx vercel ls

# Supprimer un projet
npx vercel remove nom-du-projet
```

---

**✅ STATUT : Projet prêt pour déploiement Vercel manuel**

Exécutez les 3 commandes ci-dessus dans votre terminal pour déployer NextMove Cargo SaaS sur Vercel.
