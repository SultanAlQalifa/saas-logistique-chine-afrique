# 🚀 API NextMove Cargo - Documentation

## 📋 Vue d'ensemble

L'API NextMove Cargo permet aux développeurs d'intégrer facilement les fonctionnalités de logistique Chine-Afrique dans leurs applications tierces.

**Base URL:** `https://api.nextmovecargo.com/v1`  
**Version:** v1  
**Format:** JSON  

## 🔐 Authentification

Toutes les requêtes API nécessitent une clé API valide dans l'en-tête :

```http
X-API-Key: sk_test_nextmove_cargo_2024
```

### Types de clés API
- **Test:** `sk_test_*` - Pour les tests et développement
- **Production:** `sk_live_*` - Pour l'environnement de production

## 📦 Endpoints Colis

### Récupérer tous les colis
```http
GET /api/v1/packages
```

**Paramètres de requête:**
- `status` (optionnel): `PENDING`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`
- `limit` (optionnel): Nombre max de résultats (défaut: 10)
- `offset` (optionnel): Décalage pour pagination (défaut: 0)

**Exemple de réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pkg_001",
      "trackingNumber": "TRK-2024-001",
      "senderName": "Jean Dupont",
      "senderEmail": "jean@example.com",
      "recipientName": "Marie Martin",
      "weight": 2.5,
      "status": "IN_TRANSIT",
      "origin": "Guangzhou, Chine",
      "destination": "Abidjan, Côte d'Ivoire",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### Créer un nouveau colis
```http
POST /api/v1/packages
```

**Corps de la requête:**
```json
{
  "senderName": "Jean Dupont",
  "senderEmail": "jean@example.com",
  "senderPhone": "+33123456789",
  "recipientName": "Marie Martin",
  "recipientEmail": "marie@example.com",
  "recipientPhone": "+225123456789",
  "recipientAddress": "123 Rue de la Paix, Abidjan",
  "weight": 2.5,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 15
  },
  "value": 150000,
  "currency": "FCFA",
  "origin": "Guangzhou, Chine",
  "destination": "Abidjan, Côte d'Ivoire"
}
```

### Récupérer un colis spécifique
```http
GET /api/v1/packages/{id}
```

### Mettre à jour un colis
```http
PUT /api/v1/packages/{id}
```

### Supprimer un colis
```http
DELETE /api/v1/packages/{id}
```

## 📍 Suivi de Colis

### Suivre un colis
```http
GET /api/v1/tracking/{trackingNumber}
```

**Exemple de réponse:**
```json
{
  "success": true,
  "data": {
    "trackingNumber": "TRK-2024-001",
    "status": "IN_TRANSIT",
    "origin": "Guangzhou, Chine",
    "destination": "Abidjan, Côte d'Ivoire",
    "estimatedDelivery": "2024-01-25T00:00:00Z",
    "events": [
      {
        "timestamp": "2024-01-15T10:30:00Z",
        "location": "Guangzhou, Chine",
        "status": "PICKED_UP",
        "description": "Colis récupéré chez l'expéditeur"
      },
      {
        "timestamp": "2024-01-17T14:20:00Z",
        "location": "En mer - Route vers l'Afrique",
        "status": "IN_TRANSIT",
        "description": "Colis embarqué sur le navire cargo"
      }
    ]
  }
}
```

## 👥 Endpoints Clients

### Récupérer tous les clients
```http
GET /api/v1/clients
```

**Paramètres:**
- `status`: `ACTIVE`, `INACTIVE`, `SUSPENDED`
- `country`: Filtrer par pays
- `limit`, `offset`: Pagination

### Créer un nouveau client
```http
POST /api/v1/clients
```

**Corps requis:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+33123456789",
  "address": "123 Rue de la République, Paris",
  "country": "France",
  "company": "Import Export SARL"
}
```

## 🏢 Endpoints Entreprises

### Récupérer toutes les entreprises
```http
GET /api/v1/companies
```

**Paramètres:**
- `status`: `ACTIVE`, `INACTIVE`, `PENDING`
- `country`: Filtrer par pays
- `industry`: Filtrer par secteur

### Créer une nouvelle entreprise
```http
POST /api/v1/companies
```

## 🔗 Webhooks

### Récupérer tous les webhooks
```http
GET /api/v1/webhooks
```

### Créer un webhook
```http
POST /api/v1/webhooks
```

**Corps requis:**
```json
{
  "url": "https://votre-site.com/webhook",
  "events": ["package.created", "package.updated", "package.delivered"]
}
```

**Événements disponibles:**
- `package.created` - Nouveau colis créé
- `package.updated` - Colis mis à jour
- `package.delivered` - Colis livré
- `package.cancelled` - Colis annulé
- `client.created` - Nouveau client
- `company.created` - Nouvelle entreprise

## 📊 Statistiques

### Récupérer les statistiques du dashboard
```http
GET /api/v1/stats
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "packages": {
      "total": 5672,
      "pending": 234,
      "inTransit": 1456,
      "delivered": 3892
    },
    "revenue": {
      "total": 45600000,
      "thisMonth": 3200000,
      "growth": 14.3
    },
    "clients": {
      "total": 856,
      "active": 734,
      "new": 45
    }
  }
}
```

## 🔑 Gestion des Clés API

### Récupérer toutes les clés API (Admin uniquement)
```http
GET /api/v1/auth/api-keys
```

### Créer une nouvelle clé API (Admin uniquement)
```http
POST /api/v1/auth/api-keys
```

## ⚠️ Codes d'Erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide |
| 401 | Non authentifié (clé API manquante/invalide) |
| 403 | Accès refusé |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

## 📝 Exemples d'Intégration

### JavaScript/Node.js
```javascript
const API_KEY = 'sk_test_nextmove_cargo_2024';
const BASE_URL = 'https://api.nextmovecargo.com/v1';

async function createPackage(packageData) {
  const response = await fetch(`${BASE_URL}/packages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify(packageData)
  });
  
  return await response.json();
}

async function trackPackage(trackingNumber) {
  const response = await fetch(`${BASE_URL}/tracking/${trackingNumber}`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  
  return await response.json();
}
```

### Python
```python
import requests

API_KEY = 'sk_test_nextmove_cargo_2024'
BASE_URL = 'https://api.nextmovecargo.com/v1'

def create_package(package_data):
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    }
    
    response = requests.post(f'{BASE_URL}/packages', 
                           json=package_data, 
                           headers=headers)
    return response.json()

def track_package(tracking_number):
    headers = {'X-API-Key': API_KEY}
    response = requests.get(f'{BASE_URL}/tracking/{tracking_number}', 
                          headers=headers)
    return response.json()
```

### PHP
```php
<?php
$apiKey = 'sk_test_nextmove_cargo_2024';
$baseUrl = 'https://api.nextmovecargo.com/v1';

function createPackage($packageData) {
    global $apiKey, $baseUrl;
    
    $headers = [
        'Content-Type: application/json',
        'X-API-Key: ' . $apiKey
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . '/packages');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($packageData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}
?>
```

## 🚀 Cas d'Usage

### 1. E-commerce Integration
Intégrez l'API pour créer automatiquement des expéditions lors de commandes.

### 2. Système de Suivi
Développez une interface de suivi personnalisée pour vos clients.

### 3. Dashboard Analytics
Récupérez les statistiques pour créer des tableaux de bord personnalisés.

### 4. Notifications Automatiques
Utilisez les webhooks pour notifier vos clients des mises à jour d'expédition.

## 📞 Support

- **Email:** api-support@nextmovecargo.com
- **Documentation:** https://docs.nextmovecargo.com
- **Status:** https://status.nextmovecargo.com

---

*Cette documentation est mise à jour régulièrement. Consultez la version en ligne pour les dernières modifications.*
