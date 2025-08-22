# 📊 Monitoring & Logs Production - NextMove Cargo V1.0

## Configuration Sentry

### Variables d'Environnement
```env
NEXT_PUBLIC_SENTRY_DSN="https://xxxxxxxx@xxxxxxxx.ingest.sentry.io/xxxxxxxx"
SENTRY_ORG="nextmove-cargo"
SENTRY_PROJECT="nextmove-cargo-prod"
SENTRY_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxx"
SENTRY_RELEASE="v1.0.0"
```

### Alertes Critiques
```javascript
// Règles d'alertes Sentry
{
  "error_rate": {
    "threshold": "1%",
    "window": "5m",
    "action": "slack_notification"
  },
  "response_time": {
    "threshold": "1000ms",
    "percentile": "95th",
    "action": "email_alert"
  },
  "critical_errors": {
    "level": "error",
    "tags": ["critical"],
    "action": "immediate_notification"
  }
}
```

### Dashboard Métriques
- **Erreurs par heure**: Graphique temps réel
- **Performance API**: P95 response time
- **Utilisateurs actifs**: Sessions uniques
- **Taux de conversion**: Paiements réussis
- **Disponibilité**: Uptime monitoring

## Logs Structurés

### Configuration Winston
```javascript
// lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'nextmove-cargo',
    version: process.env.NEXT_PUBLIC_APP_VERSION
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});
```

### Niveaux de Logs
- **ERROR**: Erreurs critiques nécessitant intervention
- **WARN**: Situations anormales mais non critiques
- **INFO**: Événements importants (connexions, paiements)
- **DEBUG**: Informations de débogage (désactivé en prod)

### Logs Métier
```javascript
// Exemples de logs structurés
logger.info('Package created', {
  packageId: 'NM-2025-00000001',
  clientId: 'client_123',
  amount: 150000,
  currency: 'XOF',
  destination: 'Dakar'
});

logger.error('Payment failed', {
  paymentId: 'pay_123',
  provider: 'wave',
  amount: 50000,
  error: error.message,
  userId: 'user_456'
});
```

## Health Checks

### Endpoint de Santé
```typescript
// pages/api/health.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION,
    checks: {
      database: await checkDatabase(),
      whatsapp: await checkWhatsApp(),
      wave: await checkWave(),
      sentry: await checkSentry()
    }
  };

  const isHealthy = Object.values(health.checks).every(check => check.status === 'ok');
  
  res.status(isHealthy ? 200 : 503).json(health);
}
```

### Checks Individuels
```typescript
async function checkDatabase(): Promise<HealthCheck> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', responseTime: Date.now() - start };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

async function checkWhatsApp(): Promise<HealthCheck> {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    return { status: response.ok ? 'ok' : 'error' };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}
```

## Métriques Personnalisées

### Performance Tracking
```typescript
// lib/metrics.ts
export class MetricsService {
  static trackPageLoad(page: string, loadTime: number) {
    logger.info('Page load', {
      metric: 'page_load_time',
      page,
      loadTime,
      timestamp: Date.now()
    });
  }

  static trackAPICall(endpoint: string, method: string, responseTime: number, status: number) {
    logger.info('API call', {
      metric: 'api_response_time',
      endpoint,
      method,
      responseTime,
      status,
      timestamp: Date.now()
    });
  }

  static trackBusinessEvent(event: string, data: Record<string, any>) {
    logger.info('Business event', {
      metric: 'business_event',
      event,
      data,
      timestamp: Date.now()
    });
  }
}
```

### Événements Métier
```typescript
// Exemples d'utilisation
MetricsService.trackBusinessEvent('package_created', {
  packageId: 'NM-2025-00000001',
  clientType: 'enterprise',
  amount: 150000,
  destination: 'Dakar'
});

MetricsService.trackBusinessEvent('payment_completed', {
  paymentId: 'pay_123',
  provider: 'wave',
  amount: 50000,
  processingTime: 2.5
});
```

## Alertes & Notifications

### Configuration Slack
```env
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/xxx/xxx/xxx"
SLACK_CHANNEL="#nextmove-alerts"
```

### Types d'Alertes
```typescript
export enum AlertType {
  CRITICAL = 'critical',    // Intervention immédiate
  WARNING = 'warning',      // Surveillance renforcée
  INFO = 'info'            // Information
}

export interface Alert {
  type: AlertType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  timestamp: string;
}
```

### Service d'Alertes
```typescript
export class AlertService {
  static async sendAlert(alert: Alert) {
    // Slack notification
    if (alert.type === AlertType.CRITICAL) {
      await this.sendSlackAlert(alert);
    }

    // Sentry notification
    SentryService.captureMessage(alert.message, 
      alert.type === AlertType.CRITICAL ? 'error' : 'warning',
      alert.metadata
    );

    // Log local
    logger.warn('Alert triggered', alert);
  }

  private static async sendSlackAlert(alert: Alert) {
    const payload = {
      channel: process.env.SLACK_CHANNEL,
      username: 'NextMove Monitoring',
      icon_emoji: ':warning:',
      text: `🚨 *${alert.title}*\n${alert.message}`,
      attachments: [{
        color: alert.type === AlertType.CRITICAL ? 'danger' : 'warning',
        fields: Object.entries(alert.metadata || {}).map(([key, value]) => ({
          title: key,
          value: String(value),
          short: true
        }))
      }]
    };

    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }
}
```

## Monitoring Uptime

### Configuration UptimeRobot
```json
{
  "monitors": [
    {
      "url": "https://nextmove-cargo.vercel.app",
      "type": "HTTP",
      "interval": 300,
      "timeout": 30
    },
    {
      "url": "https://nextmove-cargo.vercel.app/api/health",
      "type": "HTTP",
      "interval": 60,
      "timeout": 10
    }
  ],
  "alert_contacts": [
    {
      "type": "email",
      "value": "admin@nextmove-cargo.com"
    },
    {
      "type": "slack",
      "value": "#nextmove-alerts"
    }
  ]
}
```

### Seuils d'Alertes
- **Downtime**: > 30 secondes
- **Response Time**: > 5 secondes
- **Error Rate**: > 5%
- **SSL Certificate**: Expiration < 30 jours

## Dashboard Production

### Métriques Temps Réel
```typescript
// Dashboard data structure
export interface DashboardMetrics {
  uptime: {
    current: number;
    last24h: number;
    last7d: number;
  };
  performance: {
    avgResponseTime: number;
    p95ResponseTime: number;
    errorRate: number;
  };
  business: {
    activeUsers: number;
    packagesCreated: number;
    paymentsProcessed: number;
    revenue: number;
  };
  infrastructure: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    dbConnections: number;
  };
}
```

### Widgets Dashboard
1. **Status Global**: Vert/Rouge avec uptime
2. **Graphique Response Time**: 24h glissantes
3. **Erreurs Récentes**: Top 10 avec stack traces
4. **Métriques Business**: KPIs temps réel
5. **Infrastructure**: CPU, RAM, Disk
6. **Alertes Actives**: Liste prioritaire

## Scripts de Monitoring

### Check Santé Automatique
```bash
#!/bin/bash
# scripts/health-check.sh

echo "🏥 Vérification santé NextMove Cargo..."

HEALTH_URL="https://nextmove-cargo.vercel.app/api/health"
RESPONSE=$(curl -s -w "%{http_code}" $HEALTH_URL)
HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Service opérationnel"
    exit 0
else
    echo "❌ Service en erreur (HTTP $HTTP_CODE)"
    # Envoyer alerte
    curl -X POST $SLACK_WEBHOOK_URL \
        -H 'Content-Type: application/json' \
        -d '{"text":"🚨 NextMove Cargo DOWN - HTTP '$HTTP_CODE'"}'
    exit 1
fi
```

### Collecte Métriques
```bash
#!/bin/bash
# scripts/collect-metrics.sh

echo "📊 Collecte métriques production..."

# Métriques Vercel
vercel logs --app=nextmove-cargo --since=1h > logs/vercel-$(date +%Y%m%d-%H%M).log

# Métriques base de données
psql $DATABASE_URL -c "
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY n_tup_ins DESC;
" > logs/db-stats-$(date +%Y%m%d-%H%M).csv

echo "✅ Métriques collectées"
```

## Retention & Archivage

### Politique de Rétention
- **Logs ERROR**: 90 jours
- **Logs INFO**: 30 jours
- **Métriques**: 1 an
- **Alertes**: 6 mois
- **Health checks**: 30 jours

### Script d'Archivage
```bash
#!/bin/bash
# scripts/archive-logs.sh

echo "📦 Archivage logs anciens..."

# Archiver logs > 30 jours
find logs/ -name "*.log" -mtime +30 -exec gzip {} \;

# Supprimer archives > 90 jours
find logs/ -name "*.gz" -mtime +90 -delete

# Archiver métriques Sentry
sentry-cli releases files v1.0.0 upload-sourcemaps ./

echo "✅ Archivage terminé"
```

## Checklist Go-Live

### ✅ Monitoring Setup
- [ ] Sentry configuré et testé
- [ ] Logs structurés activés
- [ ] Health checks opérationnels
- [ ] Alertes Slack configurées
- [ ] Dashboard accessible
- [ ] UptimeRobot configuré

### ✅ Métriques Business
- [ ] Tracking packages créés
- [ ] Tracking paiements
- [ ] Tracking erreurs utilisateur
- [ ] Tracking performance
- [ ] KPIs définis

### ✅ Alertes Critiques
- [ ] Downtime > 30s
- [ ] Error rate > 1%
- [ ] Response time > 1s
- [ ] Payment failures
- [ ] Database errors

### ✅ Documentation
- [ ] Runbook incidents
- [ ] Contacts urgence
- [ ] Procédures escalade
- [ ] Dashboard URLs
- [ ] Accès équipe
