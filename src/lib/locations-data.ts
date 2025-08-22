export interface Country {
  id: string
  name: string
  code: string
  flag: string
  continent: string
  currency: string
  dialCode: string
  cities: City[]
  ports: Port[]
  airports: Airport[]
}

export interface City {
  id: string
  name: string
  countryId: string
  isCapital: boolean
  population: number
  coordinates: {
    lat: number
    lng: number
  }
}

export interface Port {
  id: string
  name: string
  code: string
  countryId: string
  cityId: string
  type: 'maritime' | 'river' | 'lake'
  coordinates: {
    lat: number
    lng: number
  }
  capacity: string
  facilities: string[]
}

export interface Airport {
  id: string
  name: string
  code: string
  iataCode: string
  icaoCode: string
  countryId: string
  cityId: string
  type: 'international' | 'domestic' | 'cargo'
  coordinates: {
    lat: number
    lng: number
  }
  runways: number
  cargoCapacity?: string
}

export const countries: Country[] = [
  // AFRIQUE
  {
    id: 'senegal',
    name: 'Sénégal',
    code: 'SN',
    flag: '🇸🇳',
    continent: 'Afrique',
    currency: 'XOF',
    dialCode: '+221',
    cities: [
      {
        id: 'dakar',
        name: 'Dakar',
        countryId: 'senegal',
        isCapital: true,
        population: 1182000,
        coordinates: { lat: 14.6928, lng: -17.4467 }
      },
      {
        id: 'thies',
        name: 'Thiès',
        countryId: 'senegal',
        isCapital: false,
        population: 320000,
        coordinates: { lat: 14.7886, lng: -16.9246 }
      },
      {
        id: 'saint-louis',
        name: 'Saint-Louis',
        countryId: 'senegal',
        isCapital: false,
        population: 254000,
        coordinates: { lat: 16.0180, lng: -16.4897 }
      }
    ],
    ports: [
      {
        id: 'port-dakar',
        name: 'Port Autonome de Dakar',
        code: 'DKR',
        countryId: 'senegal',
        cityId: 'dakar',
        type: 'maritime',
        coordinates: { lat: 14.6670, lng: -17.4470 },
        capacity: '15 millions de tonnes/an',
        facilities: ['Conteneurs', 'Vracs', 'Passagers', 'Pêche']
      }
    ],
    airports: [
      {
        id: 'dakar-airport',
        name: 'Aéroport International Blaise Diagne',
        code: 'DSS',
        iataCode: 'DSS',
        icaoCode: 'GOBD',
        countryId: 'senegal',
        cityId: 'dakar',
        type: 'international',
        coordinates: { lat: 14.6700, lng: -17.0730 },
        runways: 1,
        cargoCapacity: '50,000 tonnes/an'
      }
    ]
  },
  {
    id: 'cote-ivoire',
    name: 'Côte d\'Ivoire',
    code: 'CI',
    flag: '🇨🇮',
    continent: 'Afrique',
    currency: 'XOF',
    dialCode: '+225',
    cities: [
      {
        id: 'abidjan',
        name: 'Abidjan',
        countryId: 'cote-ivoire',
        isCapital: false,
        population: 4980000,
        coordinates: { lat: 5.3600, lng: -4.0083 }
      },
      {
        id: 'yamoussoukro',
        name: 'Yamoussoukro',
        countryId: 'cote-ivoire',
        isCapital: true,
        population: 355573,
        coordinates: { lat: 6.8276, lng: -5.2893 }
      },
      {
        id: 'san-pedro',
        name: 'San-Pédro',
        countryId: 'cote-ivoire',
        isCapital: false,
        population: 164944,
        coordinates: { lat: 4.7467, lng: -6.6364 }
      }
    ],
    ports: [
      {
        id: 'port-abidjan',
        name: 'Port Autonome d\'Abidjan',
        code: 'ABJ',
        countryId: 'cote-ivoire',
        cityId: 'abidjan',
        type: 'maritime',
        coordinates: { lat: 5.2461, lng: -3.9315 },
        capacity: '25 millions de tonnes/an',
        facilities: ['Conteneurs', 'Vracs liquides', 'Vracs solides', 'Hydrocarbures']
      },
      {
        id: 'port-san-pedro',
        name: 'Port de San-Pédro',
        code: 'SPY',
        countryId: 'cote-ivoire',
        cityId: 'san-pedro',
        type: 'maritime',
        coordinates: { lat: 4.7333, lng: -6.6167 },
        capacity: '12 millions de tonnes/an',
        facilities: ['Vracs', 'Conteneurs', 'Bois', 'Cacao']
      }
    ],
    airports: [
      {
        id: 'abidjan-airport',
        name: 'Aéroport International Félix-Houphouët-Boigny',
        code: 'ABJ',
        iataCode: 'ABJ',
        icaoCode: 'DIAP',
        countryId: 'cote-ivoire',
        cityId: 'abidjan',
        type: 'international',
        coordinates: { lat: 5.2614, lng: -3.9263 },
        runways: 1,
        cargoCapacity: '80,000 tonnes/an'
      }
    ]
  },
  {
    id: 'ghana',
    name: 'Ghana',
    code: 'GH',
    flag: '🇬🇭',
    continent: 'Afrique',
    currency: 'GHS',
    dialCode: '+233',
    cities: [
      {
        id: 'accra',
        name: 'Accra',
        countryId: 'ghana',
        isCapital: true,
        population: 2291352,
        coordinates: { lat: 5.6037, lng: -0.1870 }
      },
      {
        id: 'kumasi',
        name: 'Kumasi',
        countryId: 'ghana',
        isCapital: false,
        population: 2035064,
        coordinates: { lat: 6.6885, lng: -1.6244 }
      },
      {
        id: 'tema',
        name: 'Tema',
        countryId: 'ghana',
        isCapital: false,
        population: 402637,
        coordinates: { lat: 5.6698, lng: -0.0166 }
      }
    ],
    ports: [
      {
        id: 'port-tema',
        name: 'Port de Tema',
        code: 'TEM',
        countryId: 'ghana',
        cityId: 'tema',
        type: 'maritime',
        coordinates: { lat: 5.6167, lng: 0.0167 },
        capacity: '18 millions de tonnes/an',
        facilities: ['Conteneurs', 'Vracs', 'Hydrocarbures', 'Pêche']
      },
      {
        id: 'port-takoradi',
        name: 'Port de Takoradi',
        code: 'TKD',
        countryId: 'ghana',
        cityId: 'takoradi',
        type: 'maritime',
        coordinates: { lat: 4.8845, lng: -1.7554 },
        capacity: '8 millions de tonnes/an',
        facilities: ['Vracs', 'Conteneurs', 'Pétrole']
      }
    ],
    airports: [
      {
        id: 'accra-airport',
        name: 'Aéroport International Kotoka',
        code: 'ACC',
        iataCode: 'ACC',
        icaoCode: 'DGAA',
        countryId: 'ghana',
        cityId: 'accra',
        type: 'international',
        coordinates: { lat: 5.6052, lng: -0.1719 },
        runways: 2,
        cargoCapacity: '120,000 tonnes/an'
      }
    ]
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    code: 'NG',
    flag: '🇳🇬',
    continent: 'Afrique',
    currency: 'NGN',
    dialCode: '+234',
    cities: [
      {
        id: 'lagos',
        name: 'Lagos',
        countryId: 'nigeria',
        isCapital: false,
        population: 14862000,
        coordinates: { lat: 6.5244, lng: 3.3792 }
      },
      {
        id: 'abuja',
        name: 'Abuja',
        countryId: 'nigeria',
        isCapital: true,
        population: 3278000,
        coordinates: { lat: 9.0579, lng: 7.4951 }
      },
      {
        id: 'port-harcourt',
        name: 'Port Harcourt',
        countryId: 'nigeria',
        isCapital: false,
        population: 1865000,
        coordinates: { lat: 4.8156, lng: 7.0498 }
      }
    ],
    ports: [
      {
        id: 'port-lagos',
        name: 'Port de Lagos (Apapa)',
        code: 'LOS',
        countryId: 'nigeria',
        cityId: 'lagos',
        type: 'maritime',
        coordinates: { lat: 6.4474, lng: 3.3517 },
        capacity: '45 millions de tonnes/an',
        facilities: ['Conteneurs', 'Vracs', 'Hydrocarbures', 'RoRo']
      },
      {
        id: 'port-harcourt',
        name: 'Port de Port Harcourt',
        code: 'PHC',
        countryId: 'nigeria',
        cityId: 'port-harcourt',
        type: 'maritime',
        coordinates: { lat: 4.7719, lng: 7.0134 },
        capacity: '25 millions de tonnes/an',
        facilities: ['Conteneurs', 'Pétrole', 'Vracs']
      }
    ],
    airports: [
      {
        id: 'lagos-airport',
        name: 'Aéroport International Murtala Muhammed',
        code: 'LOS',
        iataCode: 'LOS',
        icaoCode: 'DNMM',
        countryId: 'nigeria',
        cityId: 'lagos',
        type: 'international',
        coordinates: { lat: 6.5774, lng: 3.3212 },
        runways: 2,
        cargoCapacity: '200,000 tonnes/an'
      },
      {
        id: 'abuja-airport',
        name: 'Aéroport International Nnamdi Azikiwe',
        code: 'ABV',
        iataCode: 'ABV',
        icaoCode: 'DNAA',
        countryId: 'nigeria',
        cityId: 'abuja',
        type: 'international',
        coordinates: { lat: 9.0068, lng: 7.2632 },
        runways: 1,
        cargoCapacity: '150,000 tonnes/an'
      }
    ]
  },
  {
    id: 'cameroon',
    name: 'Cameroun',
    code: 'CM',
    flag: '🇨🇲',
    continent: 'Afrique',
    currency: 'XAF',
    dialCode: '+237',
    cities: [
      {
        id: 'douala',
        name: 'Douala',
        countryId: 'cameroon',
        isCapital: false,
        population: 2768000,
        coordinates: { lat: 4.0511, lng: 9.7679 }
      },
      {
        id: 'yaounde',
        name: 'Yaoundé',
        countryId: 'cameroon',
        isCapital: true,
        population: 2440462,
        coordinates: { lat: 3.8480, lng: 11.5021 }
      }
    ],
    ports: [
      {
        id: 'port-douala',
        name: 'Port Autonome de Douala',
        code: 'DLA',
        countryId: 'cameroon',
        cityId: 'douala',
        type: 'maritime',
        coordinates: { lat: 4.0604, lng: 9.7008 },
        capacity: '20 millions de tonnes/an',
        facilities: ['Conteneurs', 'Vracs', 'Hydrocarbures', 'Bois']
      }
    ],
    airports: [
      {
        id: 'douala-airport',
        name: 'Aéroport International de Douala',
        code: 'DLA',
        iataCode: 'DLA',
        icaoCode: 'FKKD',
        countryId: 'cameroon',
        cityId: 'douala',
        type: 'international',
        coordinates: { lat: 4.0061, lng: 9.7195 },
        runways: 1,
        cargoCapacity: '90,000 tonnes/an'
      }
    ]
  },
  // CHINE
  {
    id: 'china',
    name: 'Chine',
    code: 'CN',
    flag: '🇨🇳',
    continent: 'Asie',
    currency: 'CNY',
    dialCode: '+86',
    cities: [
      {
        id: 'shanghai',
        name: 'Shanghai',
        countryId: 'china',
        isCapital: false,
        population: 24870895,
        coordinates: { lat: 31.2304, lng: 121.4737 }
      },
      {
        id: 'beijing',
        name: 'Pékin',
        countryId: 'china',
        isCapital: true,
        population: 21893095,
        coordinates: { lat: 39.9042, lng: 116.4074 }
      },
      {
        id: 'guangzhou',
        name: 'Guangzhou',
        countryId: 'china',
        isCapital: false,
        population: 15300000,
        coordinates: { lat: 23.1291, lng: 113.2644 }
      },
      {
        id: 'shenzhen',
        name: 'Shenzhen',
        countryId: 'china',
        isCapital: false,
        population: 12590000,
        coordinates: { lat: 22.5431, lng: 114.0579 }
      },
      {
        id: 'ningbo',
        name: 'Ningbo',
        countryId: 'china',
        isCapital: false,
        population: 8200000,
        coordinates: { lat: 29.8683, lng: 121.5440 }
      },
      {
        id: 'qingdao',
        name: 'Qingdao',
        countryId: 'china',
        isCapital: false,
        population: 9500000,
        coordinates: { lat: 36.0986, lng: 120.3719 }
      }
    ],
    ports: [
      {
        id: 'port-shanghai',
        name: 'Port de Shanghai',
        code: 'SHA',
        countryId: 'china',
        cityId: 'shanghai',
        type: 'maritime',
        coordinates: { lat: 31.3389, lng: 121.6194 },
        capacity: '750 millions de tonnes/an',
        facilities: ['Conteneurs', 'Vracs', 'Hydrocarbures', 'Croisières']
      },
      {
        id: 'port-ningbo',
        name: 'Port de Ningbo-Zhoushan',
        code: 'NGB',
        countryId: 'china',
        cityId: 'ningbo',
        type: 'maritime',
        coordinates: { lat: 29.9181, lng: 121.5892 },
        capacity: '1.2 milliards de tonnes/an',
        facilities: ['Conteneurs', 'Vracs', 'Pétrole', 'Minerais']
      },
      {
        id: 'port-shenzhen',
        name: 'Port de Shenzhen',
        code: 'SZX',
        countryId: 'china',
        cityId: 'shenzhen',
        type: 'maritime',
        coordinates: { lat: 22.4833, lng: 113.9000 },
        capacity: '280 millions de tonnes/an',
        facilities: ['Conteneurs', 'Vracs', 'Passagers']
      },
      {
        id: 'port-guangzhou',
        name: 'Port de Guangzhou',
        code: 'GUZ',
        countryId: 'china',
        cityId: 'guangzhou',
        type: 'maritime',
        coordinates: { lat: 23.0833, lng: 113.2500 },
        capacity: '650 millions de tonnes/an',
        facilities: ['Conteneurs', 'Vracs', 'Automobiles']
      },
      {
        id: 'port-qingdao',
        name: 'Port de Qingdao',
        code: 'QDO',
        countryId: 'china',
        cityId: 'qingdao',
        type: 'maritime',
        coordinates: { lat: 36.0681, lng: 120.3167 },
        capacity: '600 millions de tonnes/an',
        facilities: ['Conteneurs', 'Vracs', 'Pétrole', 'Minerais']
      }
    ],
    airports: [
      {
        id: 'shanghai-pudong-airport',
        name: 'Aéroport International de Shanghai Pudong',
        code: 'PVG',
        iataCode: 'PVG',
        icaoCode: 'ZSPD',
        countryId: 'china',
        cityId: 'shanghai',
        type: 'international',
        coordinates: { lat: 31.1443, lng: 121.8083 },
        runways: 4,
        cargoCapacity: '4,200,000 tonnes/an'
      },
      {
        id: 'beijing-capital-airport',
        name: 'Aéroport International de Pékin-Capitale',
        code: 'PEK',
        iataCode: 'PEK',
        icaoCode: 'ZBAA',
        countryId: 'china',
        cityId: 'beijing',
        type: 'international',
        coordinates: { lat: 40.0799, lng: 116.6031 },
        runways: 3,
        cargoCapacity: '2,100,000 tonnes/an'
      },
      {
        id: 'guangzhou-airport',
        name: 'Aéroport International de Guangzhou Baiyun',
        code: 'CAN',
        iataCode: 'CAN',
        icaoCode: 'ZGGG',
        countryId: 'china',
        cityId: 'guangzhou',
        type: 'international',
        coordinates: { lat: 23.3924, lng: 113.2988 },
        runways: 3,
        cargoCapacity: '2,200,000 tonnes/an'
      },
      {
        id: 'shenzhen-airport',
        name: 'Aéroport International de Shenzhen Bao\'an',
        code: 'SZX',
        iataCode: 'SZX',
        icaoCode: 'ZGSZ',
        countryId: 'china',
        cityId: 'shenzhen',
        type: 'international',
        coordinates: { lat: 22.6393, lng: 113.8111 },
        runways: 2,
        cargoCapacity: '1,500,000 tonnes/an'
      }
    ]
  }
]

// Helper functions
export function getCountryById(id: string): Country | undefined {
  return countries.find(country => country.id === id)
}

export function getCityById(countryId: string, cityId: string): City | undefined {
  const country = getCountryById(countryId)
  return country?.cities.find(city => city.id === cityId)
}

export function getPortById(countryId: string, portId: string): Port | undefined {
  const country = getCountryById(countryId)
  return country?.ports.find(port => port.id === portId)
}

export function getAirportById(countryId: string, airportId: string): Airport | undefined {
  const country = getCountryById(countryId)
  return country?.airports.find(airport => airport.id === airportId)
}

export function getCountriesByContinent(continent: string): Country[] {
  return countries.filter(country => country.continent === continent)
}

export function searchLocations(query: string): {
  countries: Country[]
  cities: City[]
  ports: Port[]
  airports: Airport[]
} {
  const lowerQuery = query.toLowerCase()
  
  const matchingCountries = countries.filter(country =>
    country.name.toLowerCase().includes(lowerQuery) ||
    country.code.toLowerCase().includes(lowerQuery)
  )
  
  const matchingCities: City[] = []
  const matchingPorts: Port[] = []
  const matchingAirports: Airport[] = []
  
  countries.forEach(country => {
    // Cities
    country.cities.forEach(city => {
      if (city.name.toLowerCase().includes(lowerQuery)) {
        matchingCities.push(city)
      }
    })
    
    // Ports
    country.ports.forEach(port => {
      if (port.name.toLowerCase().includes(lowerQuery) ||
          port.code.toLowerCase().includes(lowerQuery)) {
        matchingPorts.push(port)
      }
    })
    
    // Airports
    country.airports.forEach(airport => {
      if (airport.name.toLowerCase().includes(lowerQuery) ||
          airport.code.toLowerCase().includes(lowerQuery) ||
          airport.iataCode.toLowerCase().includes(lowerQuery)) {
        matchingAirports.push(airport)
      }
    })
  })
  
  return {
    countries: matchingCountries,
    cities: matchingCities,
    ports: matchingPorts,
    airports: matchingAirports
  }
}

export function getRouteDistance(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  // Haversine formula for calculating distance between two points
  const R = 6371 // Earth's radius in kilometers
  const dLat = (to.lat - from.lat) * Math.PI / 180
  const dLng = (to.lng - from.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export const tradeRoutes = [
  {
    id: 'shanghai-dakar',
    name: 'Shanghai - Dakar',
    from: { countryId: 'china', cityId: 'shanghai', portId: 'port-shanghai' },
    to: { countryId: 'senegal', cityId: 'dakar', portId: 'port-dakar' },
    distance: 18500,
    transitTime: '25-30 jours',
    frequency: 'Hebdomadaire',
    carriers: ['COSCO', 'MSC', 'CMA CGM']
  },
  {
    id: 'ningbo-abidjan',
    name: 'Ningbo - Abidjan',
    from: { countryId: 'china', cityId: 'ningbo', portId: 'port-ningbo' },
    to: { countryId: 'cote-ivoire', cityId: 'abidjan', portId: 'port-abidjan' },
    distance: 19200,
    transitTime: '28-32 jours',
    frequency: 'Bi-hebdomadaire',
    carriers: ['Maersk', 'MSC', 'Hapag-Lloyd']
  },
  {
    id: 'shenzhen-lagos',
    name: 'Shenzhen - Lagos',
    from: { countryId: 'china', cityId: 'shenzhen', portId: 'port-shenzhen' },
    to: { countryId: 'nigeria', cityId: 'lagos', portId: 'port-lagos' },
    distance: 17800,
    transitTime: '24-28 jours',
    frequency: 'Quotidienne',
    carriers: ['COSCO', 'Evergreen', 'ONE']
  },
  {
    id: 'guangzhou-douala',
    name: 'Guangzhou - Douala',
    from: { countryId: 'china', cityId: 'guangzhou', portId: 'port-guangzhou' },
    to: { countryId: 'cameroon', cityId: 'douala', portId: 'port-douala' },
    distance: 18900,
    transitTime: '26-30 jours',
    frequency: 'Hebdomadaire',
    carriers: ['CMA CGM', 'MSC', 'PIL']
  }
]
