// Données de test réalistes pour les ports et aéroports Chine-Afrique

export interface Port {
  id: string
  name: string
  code: string
  country: string
  city: string
  type: 'maritime' | 'aerien'
  coordinates: {
    lat: number
    lng: number
  }
  capacity: string
  specialties: string[]
  averageDelay: number // en jours
  reliability: number // pourcentage
}

export interface Route {
  id: string
  origin: string
  destination: string
  mode: 'maritime' | 'aerien'
  distance: number // en km
  averageTransitTime: number // en jours
  baseCost: number // coût de base en FCFA
  reliability: number
  frequency: string
}

export interface TariffRate {
  id: string
  route: string
  mode: 'maritime' | 'aerien'
  unit: 'CBM' | 'KG'
  minRate: number
  maxRate: number
  currency: 'XOF'
  seasonalMultiplier: {
    high: number // période haute
    normal: number
    low: number // période basse
  }
}

// PORTS CHINOIS
export const chinesePorts: Port[] = [
  {
    id: 'SHA',
    name: 'Port de Shanghai',
    code: 'SHA',
    country: 'Chine',
    city: 'Shanghai',
    type: 'maritime',
    coordinates: { lat: 31.2304, lng: 121.4737 },
    capacity: '47.3 millions TEU/an',
    specialties: ['Conteneurs', 'Vrac', 'Automobiles'],
    averageDelay: 2,
    reliability: 95
  },
  {
    id: 'SZX',
    name: 'Port de Shenzhen',
    code: 'SZX',
    country: 'Chine',
    city: 'Shenzhen',
    type: 'maritime',
    coordinates: { lat: 22.5431, lng: 114.0579 },
    capacity: '28.8 millions TEU/an',
    specialties: ['Conteneurs', 'Électronique', 'Textiles'],
    averageDelay: 1,
    reliability: 97
  },
  {
    id: 'NGB',
    name: 'Port de Ningbo-Zhoushan',
    code: 'NGB',
    country: 'Chine',
    city: 'Ningbo',
    type: 'maritime',
    coordinates: { lat: 29.8683, lng: 121.5440 },
    capacity: '31.1 millions TEU/an',
    specialties: ['Conteneurs', 'Vrac sec', 'Pétrole'],
    averageDelay: 2,
    reliability: 94
  },
  {
    id: 'QIN',
    name: 'Port de Qingdao',
    code: 'QIN',
    country: 'Chine',
    city: 'Qingdao',
    type: 'maritime',
    coordinates: { lat: 36.0986, lng: 120.3719 },
    capacity: '24.5 millions TEU/an',
    specialties: ['Conteneurs', 'Minerais', 'Céréales'],
    averageDelay: 2,
    reliability: 93
  },
  {
    id: 'GUA',
    name: 'Port de Guangzhou',
    code: 'GUA',
    country: 'Chine',
    city: 'Guangzhou',
    type: 'maritime',
    coordinates: { lat: 23.1291, lng: 113.2644 },
    capacity: '25.2 millions TEU/an',
    specialties: ['Conteneurs', 'Automobiles', 'Machines'],
    averageDelay: 2,
    reliability: 92
  },
  // Aéroports chinois
  {
    id: 'PVG',
    name: 'Aéroport de Shanghai Pudong',
    code: 'PVG',
    country: 'Chine',
    city: 'Shanghai',
    type: 'aerien',
    coordinates: { lat: 31.1443, lng: 121.8083 },
    capacity: '3.7 millions tonnes/an',
    specialties: ['Électronique', 'Pharmaceutique', 'Mode'],
    averageDelay: 0.5,
    reliability: 98
  },
  {
    id: 'CAN',
    name: 'Aéroport de Guangzhou Baiyun',
    code: 'CAN',
    country: 'Chine',
    city: 'Guangzhou',
    type: 'aerien',
    coordinates: { lat: 23.3924, lng: 113.2988 },
    capacity: '2.1 millions tonnes/an',
    specialties: ['Électronique', 'Textiles', 'Jouets'],
    averageDelay: 0.3,
    reliability: 97
  },
  {
    id: 'SZX_AIR',
    name: 'Aéroport de Shenzhen Bao\'an',
    code: 'SZX',
    country: 'Chine',
    city: 'Shenzhen',
    type: 'aerien',
    coordinates: { lat: 22.6393, lng: 113.8108 },
    capacity: '1.3 millions tonnes/an',
    specialties: ['High-tech', 'Composants', 'Smartphones'],
    averageDelay: 0.2,
    reliability: 98
  }
]

// PORTS AFRICAINS
export const africanPorts: Port[] = [
  // Afrique de l'Ouest
  {
    id: 'DKR',
    name: 'Port de Dakar',
    code: 'DKR',
    country: 'Sénégal',
    city: 'Dakar',
    type: 'maritime',
    coordinates: { lat: 14.6928, lng: -17.4467 },
    capacity: '1.2 millions TEU/an',
    specialties: ['Conteneurs', 'Arachides', 'Phosphates'],
    averageDelay: 5,
    reliability: 85
  },
  {
    id: 'ABJ',
    name: 'Port d\'Abidjan',
    code: 'ABJ',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    type: 'maritime',
    coordinates: { lat: 5.3364, lng: -4.0267 },
    capacity: '1.8 millions TEU/an',
    specialties: ['Conteneurs', 'Cacao', 'Café'],
    averageDelay: 4,
    reliability: 88
  },
  {
    id: 'LOS',
    name: 'Port de Lagos',
    code: 'LOS',
    country: 'Nigeria',
    city: 'Lagos',
    type: 'maritime',
    coordinates: { lat: 6.4474, lng: 3.3903 },
    capacity: '2.1 millions TEU/an',
    specialties: ['Conteneurs', 'Pétrole', 'Automobiles'],
    averageDelay: 7,
    reliability: 82
  },
  {
    id: 'CON',
    name: 'Port de Conakry',
    code: 'CON',
    country: 'Guinée',
    city: 'Conakry',
    type: 'maritime',
    coordinates: { lat: 9.5370, lng: -13.6785 },
    capacity: '0.8 millions TEU/an',
    specialties: ['Bauxite', 'Conteneurs', 'Riz'],
    averageDelay: 6,
    reliability: 80
  },
  // Afrique du Nord
  {
    id: 'CAS',
    name: 'Port de Casablanca',
    code: 'CAS',
    country: 'Maroc',
    city: 'Casablanca',
    type: 'maritime',
    coordinates: { lat: 33.6022, lng: -7.6218 },
    capacity: '1.4 millions TEU/an',
    specialties: ['Conteneurs', 'Phosphates', 'Automobiles'],
    averageDelay: 3,
    reliability: 90
  },
  {
    id: 'ALG',
    name: 'Port d\'Alger',
    code: 'ALG',
    country: 'Algérie',
    city: 'Alger',
    type: 'maritime',
    coordinates: { lat: 36.7631, lng: 3.0506 },
    capacity: '1.1 millions TEU/an',
    specialties: ['Conteneurs', 'Hydrocarbures', 'Céréales'],
    averageDelay: 4,
    reliability: 87
  },
  // Afrique de l'Est
  {
    id: 'MBA',
    name: 'Port de Mombasa',
    code: 'MBA',
    country: 'Kenya',
    city: 'Mombasa',
    type: 'maritime',
    coordinates: { lat: -4.0435, lng: 39.6682 },
    capacity: '1.5 millions TEU/an',
    specialties: ['Conteneurs', 'Café', 'Thé'],
    averageDelay: 5,
    reliability: 86
  },
  {
    id: 'DAR',
    name: 'Port de Dar es Salaam',
    code: 'DAR',
    country: 'Tanzanie',
    city: 'Dar es Salaam',
    type: 'maritime',
    coordinates: { lat: -6.8160, lng: 39.2803 },
    capacity: '1.2 millions TEU/an',
    specialties: ['Conteneurs', 'Coton', 'Café'],
    averageDelay: 6,
    reliability: 83
  },
  // Aéroports africains
  {
    id: 'DKR_AIR',
    name: 'Aéroport de Dakar Blaise Diagne',
    code: 'DSS',
    country: 'Sénégal',
    city: 'Dakar',
    type: 'aerien',
    coordinates: { lat: 14.6701, lng: -17.0732 },
    capacity: '50,000 tonnes/an',
    specialties: ['Produits frais', 'Pharmaceutique', 'Textiles'],
    averageDelay: 1,
    reliability: 92
  },
  {
    id: 'ABJ_AIR',
    name: 'Aéroport d\'Abidjan Félix Houphouët-Boigny',
    code: 'ABJ',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    type: 'aerien',
    coordinates: { lat: 5.2614, lng: -3.9263 },
    capacity: '45,000 tonnes/an',
    specialties: ['Cacao', 'Produits frais', 'Électronique'],
    averageDelay: 1.2,
    reliability: 90
  },
  {
    id: 'LOS_AIR',
    name: 'Aéroport de Lagos Murtala Muhammed',
    code: 'LOS',
    country: 'Nigeria',
    city: 'Lagos',
    type: 'aerien',
    coordinates: { lat: 6.5774, lng: 3.3212 },
    capacity: '80,000 tonnes/an',
    specialties: ['Pétrole', 'Électronique', 'Produits manufacturés'],
    averageDelay: 1.5,
    reliability: 88
  },
  {
    id: 'CAS_AIR',
    name: 'Aéroport de Casablanca Mohammed V',
    code: 'CMN',
    country: 'Maroc',
    city: 'Casablanca',
    type: 'aerien',
    coordinates: { lat: 33.3675, lng: -7.5898 },
    capacity: '60,000 tonnes/an',
    specialties: ['Automobile', 'Textiles', 'Agroalimentaire'],
    averageDelay: 0.8,
    reliability: 94
  }
]

// ROUTES PRINCIPALES
export const routes: Route[] = [
  // Routes maritimes Shanghai vers Afrique
  {
    id: 'SHA-DKR-M',
    origin: 'SHA',
    destination: 'DKR',
    mode: 'maritime',
    distance: 18500,
    averageTransitTime: 35,
    baseCost: 1200,
    reliability: 90,
    frequency: 'Hebdomadaire'
  },
  {
    id: 'SHA-ABJ-M',
    origin: 'SHA',
    destination: 'ABJ',
    mode: 'maritime',
    distance: 19200,
    averageTransitTime: 38,
    baseCost: 1350,
    reliability: 88,
    frequency: 'Bi-hebdomadaire'
  },
  {
    id: 'SHA-LOS-M',
    origin: 'SHA',
    destination: 'LOS',
    mode: 'maritime',
    distance: 19800,
    averageTransitTime: 40,
    baseCost: 1400,
    reliability: 85,
    frequency: 'Hebdomadaire'
  },
  {
    id: 'SHA-CAS-M',
    origin: 'SHA',
    destination: 'CAS',
    mode: 'maritime',
    distance: 16500,
    averageTransitTime: 32,
    baseCost: 1100,
    reliability: 92,
    frequency: 'Bi-hebdomadaire'
  },
  {
    id: 'SHA-MBA-M',
    origin: 'SHA',
    destination: 'MBA',
    mode: 'maritime',
    distance: 14200,
    averageTransitTime: 28,
    baseCost: 950,
    reliability: 89,
    frequency: 'Hebdomadaire'
  },
  // Routes aériennes
  {
    id: 'PVG-DKR-A',
    origin: 'PVG',
    destination: 'DKR_AIR',
    mode: 'aerien',
    distance: 15800,
    averageTransitTime: 2,
    baseCost: 4500,
    reliability: 95,
    frequency: 'Quotidienne'
  },
  {
    id: 'PVG-ABJ-A',
    origin: 'PVG',
    destination: 'ABJ_AIR',
    mode: 'aerien',
    distance: 16200,
    averageTransitTime: 2,
    baseCost: 4800,
    reliability: 93,
    frequency: '5x/semaine'
  },
  {
    id: 'PVG-LOS-A',
    origin: 'PVG',
    destination: 'LOS_AIR',
    mode: 'aerien',
    distance: 16500,
    averageTransitTime: 2,
    baseCost: 5000,
    reliability: 91,
    frequency: 'Quotidienne'
  },
  {
    id: 'CAN-CAS-A',
    origin: 'CAN',
    destination: 'CAS_AIR',
    mode: 'aerien',
    distance: 14800,
    averageTransitTime: 2,
    baseCost: 4200,
    reliability: 96,
    frequency: '4x/semaine'
  }
]

// TARIFS PAR ROUTE
export const tariffRates: TariffRate[] = [
  // Tarifs maritimes CBM
  {
    id: 'SHA-DKR-M-CBM',
    route: 'SHA-DKR-M',
    mode: 'maritime',
    unit: 'CBM',
    minRate: 98250,
    maxRate: 196500,
    currency: 'XOF',
    seasonalMultiplier: {
      high: 1.3, // Période haute (Nov-Jan)
      normal: 1.0,
      low: 0.8 // Période basse (Mai-Juillet)
    }
  },
  {
    id: 'SHA-ABJ-M-CBM',
    route: 'SHA-ABJ-M',
    mode: 'maritime',
    unit: 'CBM',
    minRate: 117900,
    maxRate: 229250,
    currency: 'XOF',
    seasonalMultiplier: {
      high: 1.25,
      normal: 1.0,
      low: 0.85
    }
  },
  {
    id: 'SHA-LOS-M-CBM',
    route: 'SHA-LOS-M',
    mode: 'maritime',
    unit: 'CBM',
    minRate: 131000,
    maxRate: 248900,
    currency: 'XOF',
    seasonalMultiplier: {
      high: 1.4,
      normal: 1.0,
      low: 0.75
    }
  },
  {
    id: 'SHA-CAS-M-CBM',
    route: 'SHA-CAS-M',
    mode: 'maritime',
    unit: 'CBM',
    minRate: 78600,
    maxRate: 163750,
    currency: 'XOF',
    seasonalMultiplier: {
      high: 1.2,
      normal: 1.0,
      low: 0.9
    }
  },
  {
    id: 'SHA-MBA-M-CBM',
    route: 'SHA-MBA-M',
    mode: 'maritime',
    unit: 'CBM',
    minRate: 65500,
    maxRate: 144100,
    currency: 'XOF',
    seasonalMultiplier: {
      high: 1.15,
      normal: 1.0,
      low: 0.85
    }
  },
  // Tarifs aériens KG
  {
    id: 'PVG-DKR-A-KG',
    route: 'PVG-DKR-A',
    mode: 'aerien',
    unit: 'KG',
    minRate: 524,
    maxRate: 983,
    currency: 'XOF',
    seasonalMultiplier: {
      high: 1.5,
      normal: 1.0,
      low: 0.8
    }
  },
  {
    id: 'PVG-ABJ-A-KG',
    route: 'PVG-ABJ-A',
    mode: 'aerien',
    unit: 'KG',
    minRate: 590,
    maxRate: 1114,
    currency: 'XOF',
    seasonalMultiplier: {
      high: 1.6,
      normal: 1.0,
      low: 0.75
    }
  },
  {
    id: 'PVG-LOS-A-KG',
    route: 'PVG-LOS-A',
    mode: 'aerien',
    unit: 'KG',
    minRate: 655,
    maxRate: 1179,
    currency: 'XOF',
    seasonalMultiplier: {
      high: 1.7,
      normal: 1.0,
      low: 0.7
    }
  },
  {
    id: 'CAN-CAS-A-KG',
    route: 'CAN-CAS-A',
    mode: 'aerien',
    unit: 'KG',
    minRate: 459,
    maxRate: 852,
    currency: 'XOF',
    seasonalMultiplier: {
      high: 1.4,
      normal: 1.0,
      low: 0.85
    }
  }
]

// DONNÉES SUPPLÉMENTAIRES
export const commodityTypes = [
  'Électronique',
  'Textiles et Vêtements',
  'Machines et Équipements',
  'Automobiles et Pièces',
  'Produits Chimiques',
  'Jouets et Articles de Sport',
  'Meubles et Décoration',
  'Produits Alimentaires',
  'Matériaux de Construction',
  'Produits Pharmaceutiques'
]

export const seasonalPeriods = {
  high: ['Novembre', 'Décembre', 'Janvier'], // Période haute
  normal: ['Février', 'Mars', 'Avril', 'Août', 'Septembre', 'Octobre'], // Période normale
  low: ['Mai', 'Juin', 'Juillet'] // Période basse
}

export const additionalFees = {
  maritime: {
    documentation: 32750, // FCFA
    handling: 16375, // FCFA par CBM
    customs: 49125, // FCFA
    insurance: 0.005, // 0.5% de la valeur
    storage: 3275 // FCFA par jour par CBM
  },
  aerien: {
    documentation: 19650, // FCFA
    handling: 98, // FCFA par KG
    customs: 32750, // FCFA
    insurance: 0.008, // 0.8% de la valeur
    storage: 328 // FCFA par jour par KG
  }
}

// Fonction utilitaire pour calculer le tarif
export function calculateRate(
  route: string,
  mode: 'maritime' | 'aerien',
  volume: number,
  unit: 'CBM' | 'KG',
  season: 'high' | 'normal' | 'low' = 'normal'
): number {
  const tariff = tariffRates.find(t => 
    t.route === route && 
    t.mode === mode && 
    t.unit === unit
  )
  
  if (!tariff) return 0
  
  // Calcul du tarif de base (moyenne entre min et max)
  const baseRate = (tariff.minRate + tariff.maxRate) / 2
  
  // Application du multiplicateur saisonnier
  const seasonalRate = baseRate * tariff.seasonalMultiplier[season]
  
  // Calcul du coût total
  return seasonalRate * volume
}

// Fonction pour obtenir tous les ports par type
export function getPortsByType(type: 'maritime' | 'aerien'): Port[] {
  return [...chinesePorts, ...africanPorts].filter(port => port.type === type)
}

// Fonction pour obtenir les routes disponibles
export function getAvailableRoutes(origin: string, destination: string): Route[] {
  return routes.filter(route => 
    route.origin === origin && route.destination === destination
  )
}
