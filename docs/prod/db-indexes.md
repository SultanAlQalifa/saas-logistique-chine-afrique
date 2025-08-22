# 📊 Optimisation Base de Données - Production 2025

## Index Critiques pour Performance

### 1. Tables Principales

#### Users
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### Packages/Shipments
```sql
CREATE INDEX idx_packages_tracking_number ON packages(tracking_number);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_client_id ON packages(client_id);
CREATE INDEX idx_packages_created_at ON packages(created_at);
CREATE INDEX idx_packages_delivery_date ON packages(delivery_date);
CREATE INDEX idx_packages_tenant_id ON packages(tenant_id);
```

#### Invoices
```sql
CREATE INDEX idx_invoices_number ON invoices(number);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_tenant_id ON invoices(tenant_id);
```

#### Payments
```sql
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_method ON payments(method);
CREATE INDEX idx_payments_created_at ON payments(created_at);
```

### 2. Index Composites

```sql
-- Recherche packages par client et statut
CREATE INDEX idx_packages_client_status ON packages(client_id, status);

-- Recherche factures par période
CREATE INDEX idx_invoices_date_status ON invoices(created_at, status);

-- Performance dashboard
CREATE INDEX idx_packages_tenant_status_date ON packages(tenant_id, status, created_at);
```

### 3. Index Texte Intégral

```sql
-- Recherche clients
CREATE INDEX idx_clients_search ON clients USING gin(to_tsvector('french', name || ' ' || email));

-- Recherche packages
CREATE INDEX idx_packages_search ON packages USING gin(to_tsvector('french', description || ' ' || tracking_number));
```

## Configuration PostgreSQL

### postgresql.conf
```ini
# Mémoire
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Connexions
max_connections = 100
max_prepared_transactions = 100

# Logs
log_statement = 'mod'
log_duration = on
log_min_duration_statement = 1000

# Performance
random_page_cost = 1.1
effective_io_concurrency = 200
```

## Requêtes d'Optimisation

### Analyse Performance
```sql
-- Identifier requêtes lentes
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Vérifier utilisation index
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM packages 
WHERE tenant_id = 'xxx' AND status = 'IN_TRANSIT';
```

### Maintenance Régulière
```sql
-- Vacuum automatique
ALTER TABLE packages SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE invoices SET (autovacuum_vacuum_scale_factor = 0.1);

-- Statistiques à jour
ANALYZE packages;
ANALYZE invoices;
ANALYZE users;
```

## Monitoring Performances

### Métriques Clés
- Temps de réponse moyen < 200ms
- Utilisation CPU < 70%
- Utilisation mémoire < 80%
- Connexions actives < 50

### Alertes
- Requêtes > 1s
- Deadlocks détectés
- Espace disque < 20%
- Connexions > 80

## Script de Déploiement

```bash
#!/bin/bash
# Appliquer index en production

echo "🔧 Application des index de performance..."

psql $DATABASE_URL << EOF
-- Index critiques
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_packages_tracking_number ON packages(tracking_number);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_packages_tenant_status ON packages(tenant_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_number ON invoices(number);

-- Analyse des tables
ANALYZE packages;
ANALYZE invoices;
ANALYZE users;

-- Vérification
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE tablename IN ('packages', 'invoices', 'users')
ORDER BY tablename, indexname;
EOF

echo "✅ Index appliqués avec succès"
```
