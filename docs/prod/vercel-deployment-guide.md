# 🚀 Guide de Déploiement Production - NextMove Cargo SaaS

## ✅ Statut Actuel
- **Repository GitHub** : https://github.com/SultanAlQalifa/saas-logistique-chine-afrique
- **Sécurité** : ✅ API keys supprimées, .gitignore mis à jour
- **Build** : ✅ TypeScript sans erreurs
- **Prêt pour déploiement** : ✅ OUI

## 🎯 Options de Déploiement Recommandées

### Option 1 : Vercel (Recommandé)
```bash
# Installation Vercel CLI
npm i -g vercel

# Connexion
vercel login

# Déploiement
vercel --prod
```

### Option 2 : Netlify
```bash
# Installation Netlify CLI
npm i -g netlify-cli

# Connexion
netlify login

# Déploiement
netlify deploy --prod --dir=.next
```

## 🔐 Variables d'Environnement Requises

### Variables Essentielles
```env
# Base
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=votre-secret-super-securise-64-caracteres-minimum

# Base de données (PostgreSQL recommandé)
DATABASE_URL=postgresql://user:password@host:5432/database

# OpenAI (pour l'IA)
OPENAI_API_KEY=sk-proj-votre-cle-openai-ici
```

### Variables Optionnelles
```env
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=votre-phone-number-id
WHATSAPP_ACCESS_TOKEN=votre-access-token
WHATSAPP_BUSINESS_ACCOUNT_ID=votre-business-account-id

# Mobile Money (Wave, Orange Money, etc.)
WAVE_API_KEY=votre-cle-wave
ORANGE_MONEY_API_KEY=votre-cle-orange-money

# Analytics & Monitoring
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://votre-sentry-dsn
```

## 📋 Checklist Pré-Déploiement

### ✅ Sécurité
- [x] API keys supprimées du code source
- [x] .gitignore mis à jour
- [x] Variables d'environnement configurées
- [ ] HTTPS activé sur le domaine
- [ ] Headers de sécurité configurés

### ✅ Base de Données
- [ ] PostgreSQL configuré
- [ ] Migrations Prisma exécutées
- [ ] Données de seed ajoutées
- [ ] Backup configuré

### ✅ Intégrations
- [ ] OpenAI API key configurée
- [ ] WhatsApp Business configuré (optionnel)
- [ ] Mobile Money APIs configurées (optionnel)
- [ ] Email service configuré

## 🚀 Commandes de Déploiement

### Vercel (Méthode Recommandée)
```bash
# 1. Cloner le repository
git clone https://github.com/SultanAlQalifa/saas-logistique-chine-afrique.git
cd saas-logistique-chine-afrique

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement sur Vercel
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY

# 4. Déployer
vercel --prod
```

### Netlify
```bash
# 1. Build local
npm run build

# 2. Déployer
netlify deploy --prod --dir=.next
```

## 🔧 Configuration Post-Déploiement

### 1. Base de Données
```bash
# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma db push

# Ajouter les données de seed
npx prisma db seed
```

### 2. Domaine Personnalisé
- Configurer le DNS
- Activer HTTPS
- Configurer les redirections

### 3. Monitoring
- Configurer Sentry pour les erreurs
- Activer Google Analytics
- Configurer les alertes

## 📊 Comptes de Test Disponibles

```
Admin Plateforme:
Email: admin@platform.com
Mot de passe: admin123

Admin Entreprise:
Email: contact@logitrans.com
Mot de passe: company123

Client Test:
Email: client@example.com
Mot de passe: client123
```

## 🆘 Dépannage

### Erreur de Build
```bash
# Nettoyer le cache
rm -rf .next node_modules
npm install
npm run build
```

### Erreur de Base de Données
```bash
# Réinitialiser Prisma
npx prisma db reset
npx prisma generate
npx prisma db push
```

### Variables d'Environnement
- Vérifier que toutes les variables sont définies
- Redémarrer le service après modification
- Utiliser des guillemets pour les valeurs avec espaces

## 📞 Support

- **Repository** : https://github.com/SultanAlQalifa/saas-logistique-chine-afrique
- **Documentation** : `/docs` dans le repository
- **Issues** : Créer une issue sur GitHub

---

**NextMove Cargo SaaS** - Plateforme logistique Chine-Afrique
Version 1.0.0 - Prêt pour production 🚀
