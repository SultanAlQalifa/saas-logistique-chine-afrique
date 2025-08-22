# 🔑 Configuration Fournisseurs LIVE - Production 2025

## WhatsApp Business API

### Configuration Requise
```env
WHATSAPP_PHONE_NUMBER_ID="123456789012345"
WHATSAPP_ACCESS_TOKEN="EAAxxxxxxxxxxxxxxxxxxxxx"
WHATSAPP_APP_ID="123456789012345"
WHATSAPP_APP_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="nextmove_webhook_2025"
WHATSAPP_BUSINESS_ACCOUNT_ID="123456789012345"
```

### Étapes de Configuration
1. **Créer Application Meta Business**
   - Aller sur https://developers.facebook.com/
   - Créer nouvelle app "Business"
   - Ajouter produit "WhatsApp Business API"

2. **Configurer Webhook**
   - URL: `https://nextmove-cargo.vercel.app/api/whatsapp/webhook`
   - Token de vérification: `nextmove_webhook_2025`
   - Champs: `messages`, `message_deliveries`, `message_reads`

3. **Templates de Messages**
   ```javascript
   // Template notification colis
   {
     "name": "package_notification",
     "language": "fr",
     "components": [
       {
         "type": "BODY",
         "text": "Bonjour {{1}}, votre colis {{2}} est {{3}}. Suivi: {{4}}"
       }
     ]
   }
   ```

### Test de Validation
```bash
curl -X POST "https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "+221776581741",
    "type": "text",
    "text": {"body": "Test NextMove Cargo Production"}
  }'
```

## Wave Money API

### Configuration Requise
```env
WAVE_API_KEY="wave_live_xxxxxxxxxxxxxxxx"
WAVE_API_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"
WAVE_MERCHANT_ID="merchant_xxxxxxxxxxxxxxxx"
WAVE_WEBHOOK_SECRET="webhook_secret_xxxxxxxx"
```

### Endpoints Production
- **Base URL**: `https://api.wave.com/v1`
- **Webhook URL**: `https://nextmove-cargo.vercel.app/api/wave/webhook`

### Configuration Webhook
```json
{
  "url": "https://nextmove-cargo.vercel.app/api/wave/webhook",
  "events": [
    "payment.completed",
    "payment.failed",
    "payment.pending"
  ],
  "secret": "webhook_secret_xxxxxxxx"
}
```

### Test de Validation
```bash
curl -X POST "https://api.wave.com/v1/checkout/sessions" \
  -H "Authorization: Bearer ${WAVE_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "XOF",
    "success_url": "https://nextmove-cargo.vercel.app/payment/success",
    "cancel_url": "https://nextmove-cargo.vercel.app/payment/cancel"
  }'
```

## Sentry Monitoring

### Configuration Requise
```env
NEXT_PUBLIC_SENTRY_DSN="https://xxxxxxxx@xxxxxxxx.ingest.sentry.io/xxxxxxxx"
SENTRY_ORG="nextmove-cargo"
SENTRY_PROJECT="nextmove-cargo-prod"
SENTRY_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxx"
```

### Alertes Configurées
- **Erreurs critiques**: Notification immédiate
- **Performance**: Seuil > 1s
- **Taux d'erreur**: > 1%
- **Disponibilité**: < 99%

## Base de Données PostgreSQL

### Configuration Production
```env
DATABASE_URL="postgresql://user:password@host:5432/nextmove_cargo_prod"
DIRECT_URL="postgresql://user:password@host:5432/nextmove_cargo_prod"
```

### Fournisseurs Recommandés
1. **Supabase** (Recommandé)
   - URL: https://supabase.com/
   - Plan: Pro ($25/mois)
   - Backup automatique
   - SSL inclus

2. **Neon** (Alternative)
   - URL: https://neon.tech/
   - Plan: Scale ($19/mois)
   - Branching DB
   - Serverless

3. **Railway** (Alternative)
   - URL: https://railway.app/
   - Plan: Pro ($20/mois)
   - Deploy automatique
   - Monitoring inclus

### Configuration SSL
```sql
-- Forcer SSL en production
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = '/path/to/server.crt';
ALTER SYSTEM SET ssl_key_file = '/path/to/server.key';
```

## OpenAI API (Optionnel)

### Configuration Requise
```env
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
OPENAI_ORG_ID="org-xxxxxxxxxxxxxxxx"
```

### Limites Production
- **Modèle**: GPT-4o-mini (économique)
- **Max tokens**: 1000 par requête
- **Rate limit**: 100 req/min
- **Budget mensuel**: $50 max

## Email SMTP

### Configuration Requise
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@nextmove-cargo.com"
SMTP_PASSWORD="xxxxxxxxxxxxxxxx"
SMTP_FROM="NextMove Cargo <noreply@nextmove-cargo.com>"
```

### Fournisseurs Recommandés
1. **Google Workspace**
   - 99.9% uptime
   - Anti-spam intégré
   - $6/utilisateur/mois

2. **SendGrid** (Alternative)
   - API REST
   - Analytics détaillées
   - Plan gratuit 100 emails/jour

## CDN & Storage

### Configuration Requise
```env
CLOUDINARY_CLOUD_NAME="nextmove-cargo"
CLOUDINARY_API_KEY="xxxxxxxxxxxxxxxx"
CLOUDINARY_API_SECRET="xxxxxxxxxxxxxxxx"
```

### Optimisations
- **Images**: Auto WebP/AVIF
- **Cache**: 1 an pour assets statiques
- **Compression**: Automatique
- **Lazy loading**: Activé

## Checklist de Validation

### ✅ WhatsApp Business
- [ ] Application Meta créée
- [ ] Webhook configuré et testé
- [ ] Templates approuvés
- [ ] Numéro vérifié
- [ ] Test envoi message

### ✅ Wave Money
- [ ] Compte marchand activé
- [ ] API keys générées
- [ ] Webhook configuré
- [ ] Test paiement 1000 FCFA
- [ ] Vérification callback

### ✅ Base de Données
- [ ] Instance PostgreSQL créée
- [ ] SSL activé
- [ ] Backup configuré
- [ ] Connexion testée
- [ ] Migrations appliquées

### ✅ Monitoring
- [ ] Sentry configuré
- [ ] Alertes activées
- [ ] Dashboard créé
- [ ] Test erreur
- [ ] Notifications Slack/Email

### ✅ Email
- [ ] SMTP configuré
- [ ] Domaine vérifié
- [ ] SPF/DKIM configurés
- [ ] Test envoi
- [ ] Templates créés

## Scripts de Validation

### Test Complet des Fournisseurs
```bash
#!/bin/bash
echo "🔍 Test des fournisseurs production..."

# Test WhatsApp
echo "📱 Test WhatsApp..."
npm run test:whatsapp

# Test Wave Money
echo "💰 Test Wave Money..."
npm run test:wave

# Test Base de données
echo "🗄️ Test Database..."
npm run test:db

# Test Email
echo "📧 Test Email..."
npm run test:email

echo "✅ Tests terminés"
```

### Monitoring Santé
```bash
#!/bin/bash
echo "🏥 Vérification santé des services..."

# Vérifier tous les endpoints
curl -f https://nextmove-cargo.vercel.app/api/health || exit 1
curl -f https://nextmove-cargo.vercel.app/api/whatsapp/health || exit 1
curl -f https://nextmove-cargo.vercel.app/api/wave/health || exit 1

echo "✅ Tous les services sont opérationnels"
```

## Support & Contacts

### Urgences Production
- **WhatsApp**: Support Meta Business
- **Wave**: support@wave.com
- **Sentry**: support@sentry.io
- **Database**: Support fournisseur choisi

### Documentation
- **WhatsApp**: https://developers.facebook.com/docs/whatsapp
- **Wave**: https://docs.wave.com/
- **Sentry**: https://docs.sentry.io/
- **PostgreSQL**: https://www.postgresql.org/docs/
