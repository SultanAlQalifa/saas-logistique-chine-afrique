# 🔄 Plan Rollback & Urgence - NextMove Cargo V1.0

## Procédures de Rollback

### 1. Rollback Application (Vercel/Netlify)

#### Rollback Automatique
```bash
#!/bin/bash
# scripts/rollback-app.sh

echo "🔄 ROLLBACK APPLICATION NEXTMOVE CARGO"
echo "======================================"

# Variables
PREVIOUS_DEPLOYMENT_ID="deployment_id_previous"
CURRENT_DEPLOYMENT_ID="deployment_id_current"

# 1. Rollback Vercel
if [ "$PLATFORM" = "vercel" ]; then
    echo "📦 Rollback Vercel..."
    vercel rollback $PREVIOUS_DEPLOYMENT_ID --token=$VERCEL_TOKEN
    
    # Vérifier rollback
    sleep 30
    HEALTH_CHECK=$(curl -s -w "%{http_code}" https://nextmove-cargo.vercel.app/api/health)
    if [ "${HEALTH_CHECK: -3}" = "200" ]; then
        echo "✅ Rollback Vercel réussi"
    else
        echo "❌ Échec rollback Vercel"
        exit 1
    fi
fi

# 2. Rollback Netlify
if [ "$PLATFORM" = "netlify" ]; then
    echo "🌐 Rollback Netlify..."
    netlify api restoreSiteDeploy --data='{"deploy_id":"'$PREVIOUS_DEPLOYMENT_ID'"}'
    
    # Vérifier rollback
    sleep 30
    HEALTH_CHECK=$(curl -s -w "%{http_code}" https://nextmove-cargo.netlify.app/api/health)
    if [ "${HEALTH_CHECK: -3}" = "200" ]; then
        echo "✅ Rollback Netlify réussi"
    else
        echo "❌ Échec rollback Netlify"
        exit 1
    fi
fi

echo "🎉 Rollback application terminé"
```

#### Rollback Manuel
```bash
# Via CLI Vercel
vercel rollback [deployment-url] --token=$VERCEL_TOKEN

# Via CLI Netlify  
netlify api restoreSiteDeploy --data='{"deploy_id":"DEPLOY_ID"}'

# Via Interface Web
# 1. Aller sur dashboard Vercel/Netlify
# 2. Sélectionner projet NextMove Cargo
# 3. Onglet "Deployments"
# 4. Cliquer "Rollback" sur déploiement précédent
```

### 2. Rollback Base de Données

#### Backup Automatique
```sql
-- Script de backup avant déploiement
-- scripts/backup-db.sql

-- Créer backup avec timestamp
\copy (SELECT * FROM packages) TO 'backup/packages_20250101_120000.csv' CSV HEADER;
\copy (SELECT * FROM clients) TO 'backup/clients_20250101_120000.csv' CSV HEADER;
\copy (SELECT * FROM invoices) TO 'backup/invoices_20250101_120000.csv' CSV HEADER;
\copy (SELECT * FROM users) TO 'backup/users_20250101_120000.csv' CSV HEADER;

-- Backup complet structure + données
pg_dump $DATABASE_URL > backup/nextmove_backup_20250101_120000.sql
```

#### Restauration d'Urgence
```bash
#!/bin/bash
# scripts/restore-db.sh

echo "🗄️ RESTAURATION BASE DE DONNÉES"
echo "==============================="

BACKUP_FILE="backup/nextmove_backup_20250101_120000.sql"
DATABASE_URL_BACKUP="postgresql://user:pass@host:5432/nextmove_backup"

# 1. Créer base de sauvegarde
echo "💾 Création base de sauvegarde..."
createdb nextmove_backup_$(date +%Y%m%d_%H%M%S)

# 2. Backup base actuelle
echo "📦 Backup base actuelle..."
pg_dump $DATABASE_URL > backup/current_backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Restaurer backup
echo "🔄 Restauration backup..."
psql $DATABASE_URL < $BACKUP_FILE

# 4. Vérifier intégrité
echo "🔍 Vérification intégrité..."
psql $DATABASE_URL -c "
SELECT 
    schemaname,
    tablename,
    n_tup_ins + n_tup_upd + n_tup_del as total_operations
FROM pg_stat_user_tables 
ORDER BY total_operations DESC;
"

echo "✅ Restauration terminée"
```

### 3. Rollback Variables d'Environnement

#### Sauvegarde Configuration
```bash
#!/bin/bash
# scripts/backup-env.sh

echo "⚙️ Backup variables d'environnement..."

# Backup Vercel
vercel env ls > backup/vercel_env_$(date +%Y%m%d_%H%M%S).txt

# Backup local
cp .env.production backup/env_production_$(date +%Y%m%d_%H%M%S).backup

# Backup secrets critiques (masqués)
echo "NEXTAUTH_SECRET=***" > backup/secrets_$(date +%Y%m%d_%H%M%S).txt
echo "DATABASE_URL=***" >> backup/secrets_$(date +%Y%m%d_%H%M%S).txt
echo "WHATSAPP_ACCESS_TOKEN=***" >> backup/secrets_$(date +%Y%m%d_%H%M%S).txt
echo "WAVE_API_KEY=***" >> backup/secrets_$(date +%Y%m%d_%H%M%S).txt

echo "✅ Backup environnement terminé"
```

#### Restauration Configuration
```bash
#!/bin/bash
# scripts/restore-env.sh

echo "🔧 Restauration variables d'environnement..."

BACKUP_DATE="20250101_120000"

# Restaurer depuis backup
if [ -f "backup/env_production_$BACKUP_DATE.backup" ]; then
    cp "backup/env_production_$BACKUP_DATE.backup" .env.production
    echo "✅ Fichier .env.production restauré"
else
    echo "❌ Backup non trouvé"
    exit 1
fi

# Restaurer variables Vercel
vercel env rm NEXTAUTH_SECRET production
vercel env add NEXTAUTH_SECRET production < backup/nextauth_secret.txt

echo "✅ Variables d'environnement restaurées"
```

## Contacts d'Urgence

### Équipe Technique
```yaml
contacts_urgence:
  platform_owner:
    nom: "Cheikh Abdoul Khadre Djeylani DJITTE"
    email: "djeylanidjitte@gmail.com"
    telephone: "+221776581741"
    role: "Platform Owner"
    disponibilite: "24/7"
    
  technical_lead:
    nom: "Lead Developer"
    email: "dev@nextmove-cargo.com"
    telephone: "+221XXXXXXXXX"
    role: "Technical Lead"
    disponibilite: "Heures ouvrables"
    
  devops:
    nom: "DevOps Engineer"
    email: "devops@nextmove-cargo.com"
    telephone: "+221XXXXXXXXX"
    role: "Infrastructure"
    disponibilite: "24/7"
```

### Fournisseurs Critiques
```yaml
fournisseurs_support:
  vercel:
    support: "support@vercel.com"
    documentation: "https://vercel.com/docs"
    status: "https://vercel-status.com"
    
  supabase:
    support: "support@supabase.io"
    documentation: "https://supabase.com/docs"
    status: "https://status.supabase.com"
    
  meta_whatsapp:
    support: "https://developers.facebook.com/support"
    documentation: "https://developers.facebook.com/docs/whatsapp"
    
  wave_money:
    support: "support@wave.com"
    documentation: "https://docs.wave.com"
    telephone: "+221XXXXXXXXX"
```

## Procédures d'Escalade

### Niveau 1 - Incident Mineur
**Critères**: Fonctionnalité non critique affectée, < 10% utilisateurs
**Temps de réponse**: 2 heures
**Actions**:
1. Investiguer logs et métriques
2. Appliquer correctif si possible
3. Documenter incident
4. Notifier équipe

### Niveau 2 - Incident Majeur  
**Critères**: Fonctionnalité critique affectée, 10-50% utilisateurs
**Temps de réponse**: 30 minutes
**Actions**:
1. Alerter Platform Owner
2. Évaluer besoin de rollback
3. Communiquer aux utilisateurs
4. Appliquer solution d'urgence
5. Post-mortem obligatoire

### Niveau 3 - Incident Critique
**Critères**: Service indisponible, > 50% utilisateurs, perte de données
**Temps de réponse**: 15 minutes
**Actions**:
1. Alerter tous les contacts d'urgence
2. Rollback immédiat
3. Communication publique
4. Escalade fournisseurs
5. Réunion de crise

## Scripts d'Urgence

### Diagnostic Rapide
```bash
#!/bin/bash
# scripts/emergency-diagnostic.sh

echo "🚨 DIAGNOSTIC D'URGENCE NEXTMOVE CARGO"
echo "======================================"

# 1. Vérifier santé application
echo "🏥 Santé application..."
curl -s https://nextmove-cargo.vercel.app/api/health | jq .

# 2. Vérifier base de données
echo "🗄️ Santé base de données..."
psql $DATABASE_URL -c "SELECT version();"
psql $DATABASE_URL -c "SELECT count(*) FROM packages;"

# 3. Vérifier intégrations
echo "📱 Santé WhatsApp..."
curl -s "https://graph.facebook.com/v18.0/me" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN"

echo "💰 Santé Wave Money..."
curl -s "https://api.wave.com/v1/health" \
  -H "Authorization: Bearer $WAVE_API_KEY"

# 4. Vérifier métriques Sentry
echo "📊 Métriques Sentry..."
curl -s "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/stats/" \
  -H "Authorization: Bearer $SENTRY_AUTH_TOKEN"

# 5. Vérifier logs récents
echo "📝 Logs récents..."
vercel logs --app=nextmove-cargo --since=1h | tail -20

echo "✅ Diagnostic terminé"
```

### Rollback Complet
```bash
#!/bin/bash
# scripts/emergency-rollback.sh

echo "🔄 ROLLBACK COMPLET D'URGENCE"
echo "============================="

# Confirmation obligatoire
read -p "⚠️ Confirmer rollback complet? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Rollback annulé"
    exit 1
fi

# 1. Rollback application
echo "📦 Rollback application..."
./scripts/rollback-app.sh

# 2. Rollback base de données
echo "🗄️ Rollback base de données..."
./scripts/restore-db.sh

# 3. Rollback variables environnement
echo "⚙️ Rollback environnement..."
./scripts/restore-env.sh

# 4. Vérification post-rollback
echo "🔍 Vérification post-rollback..."
sleep 60
./scripts/emergency-diagnostic.sh

# 5. Notification équipe
echo "📢 Notification équipe..."
curl -X POST $SLACK_WEBHOOK_URL \
  -d '{"text":"🔄 Rollback complet effectué - NextMove Cargo restauré"}'

echo "✅ Rollback complet terminé"
```

## Communication de Crise

### Template Notification Utilisateurs
```markdown
# Incident NextMove Cargo - [DATE] [HEURE]

## Résumé
Nous rencontrons actuellement des difficultés techniques sur la plateforme NextMove Cargo.

## Impact
- [Description de l'impact]
- Services affectés: [Liste]
- Utilisateurs concernés: [Estimation]

## Actions en cours
- Équipe technique mobilisée
- Investigation en cours
- Solution d'urgence en préparation

## Prochaine mise à jour
Prochaine communication dans 30 minutes.

## Contact
Pour toute urgence: +221776581741
Email: support@nextmove-cargo.com

L'équipe NextMove Cargo
```

### Template Post-Mortem
```markdown
# Post-Mortem Incident - [DATE]

## Chronologie
- [HEURE] Début incident
- [HEURE] Détection
- [HEURE] Équipe alertée  
- [HEURE] Investigation démarrée
- [HEURE] Cause identifiée
- [HEURE] Solution appliquée
- [HEURE] Service restauré

## Cause Racine
[Description détaillée]

## Impact
- Durée: X heures Y minutes
- Utilisateurs affectés: X
- Perte de revenus: X FCFA
- Réputation: [Évaluation]

## Actions Correctives
1. [Action immédiate]
2. [Action court terme]
3. [Action long terme]

## Prévention
- [Mesures préventives]
- [Améliorations monitoring]
- [Formation équipe]

## Leçons Apprises
[Points clés pour éviter récurrence]
```

## Checklist Rollback

### ✅ Préparation
- [ ] Backup application créé
- [ ] Backup base de données créé
- [ ] Variables environnement sauvegardées
- [ ] Équipe d'urgence alertée
- [ ] Communication préparée

### ✅ Exécution
- [ ] Rollback application effectué
- [ ] Rollback base de données effectué
- [ ] Variables restaurées
- [ ] Services vérifiés
- [ ] Tests smoke passés

### ✅ Post-Rollback
- [ ] Service opérationnel confirmé
- [ ] Utilisateurs notifiés
- [ ] Incident documenté
- [ ] Post-mortem planifié
- [ ] Mesures préventives définies

<function_calls>
<invoke name="todo_list">
<parameter name="todos">[{"content": "\ud83c\udfed Configuration environnement production", "id": "701", "priority": "high", "status": "completed"}, {"content": "\ud83d\udd22 Reset num\u00e9rotations s\u00e9ries 2025", "id": "702", "priority": "high", "status": "completed"}, {"content": "\ud83e\uddf9 Purge donn\u00e9es test & anonymisation", "id": "703", "priority": "high", "status": "completed"}, {"content": "\u26a1 Optimisation DB indexes & performances", "id": "704", "priority": "high", "status": "completed"}, {"content": "\ud83d\ude80 Build production & optimisations front", "id": "705", "priority": "high", "status": "completed"}, {"content": "\ud83d\udd11 Configuration fournisseurs LIVE", "id": "706", "priority": "high", "status": "completed"}, {"content": "\ud83d\udcca Monitoring & logs production", "id": "707", "priority": "high", "status": "completed"}, {"content": "\ud83e\uddea Smoke tests post-deploy", "id": "708", "priority": "high", "status": "completed"}, {"content": "\ud83d\udeab D\u00e9sactivation modules test", "id": "709", "priority": "medium", "status": "completed"}, {"content": "\ud83d\udd04 Plan rollback & urgence", "id": "710", "priority": "high", "status": "completed"}, {"content": "\u2705 Acceptance criteria GO LIVE", "id": "711", "priority": "high", "status": "in_progress"}]
