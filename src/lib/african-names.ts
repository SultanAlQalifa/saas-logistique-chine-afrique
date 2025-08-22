// Système de noms africains adaptatifs pour l'agent IA
export interface AfricanName {
  name: string
  origin: string
  meaning: string
  gender: 'male' | 'female' | 'unisex'
  region: string[]
  countries: string[]
}

export const africanNames: AfricanName[] = [
  // Afrique de l'Ouest
  {
    name: 'Amina',
    origin: 'Haoussa/Arabe',
    meaning: 'Digne de confiance, fidèle',
    gender: 'female',
    region: ['west'],
    countries: ['nigeria', 'niger', 'ghana', 'burkina-faso', 'mali', 'senegal']
  },
  {
    name: 'Kwame',
    origin: 'Akan (Ghana)',
    meaning: 'Né un samedi',
    gender: 'male',
    region: ['west'],
    countries: ['ghana', 'cote-divoire', 'togo']
  },
  {
    name: 'Fatou',
    origin: 'Mandingue',
    meaning: 'Celle qui sevré',
    gender: 'female',
    region: ['west'],
    countries: ['senegal', 'mali', 'guinea', 'gambia', 'burkina-faso']
  },
  {
    name: 'Kofi',
    origin: 'Akan (Ghana)',
    meaning: 'Né un vendredi',
    gender: 'male',
    region: ['west'],
    countries: ['ghana', 'cote-divoire', 'togo']
  },
  {
    name: 'Awa',
    origin: 'Peul/Mandingue',
    meaning: 'Première femme',
    gender: 'female',
    region: ['west'],
    countries: ['senegal', 'mali', 'guinea', 'niger', 'burkina-faso', 'mauritania']
  },
  {
    name: 'Moussa',
    origin: 'Arabe/Mandingue',
    meaning: 'Sauvé des eaux (Moïse)',
    gender: 'male',
    region: ['west', 'north'],
    countries: ['mali', 'senegal', 'guinea', 'burkina-faso', 'niger', 'morocco', 'algeria']
  },

  // Afrique Centrale
  {
    name: 'Nkomo',
    origin: 'Bantou',
    meaning: 'Richesse, prospérité',
    gender: 'unisex',
    region: ['central'],
    countries: ['cameroon', 'gabon', 'congo', 'central-african-republic']
  },
  {
    name: 'Akono',
    origin: 'Ewondo (Cameroun)',
    meaning: 'Celui qui apporte la paix',
    gender: 'male',
    region: ['central'],
    countries: ['cameroon', 'equatorial-guinea']
  },
  {
    name: 'Mbala',
    origin: 'Lingala',
    meaning: 'Force, puissance',
    gender: 'unisex',
    region: ['central'],
    countries: ['congo', 'democratic-republic-congo', 'central-african-republic']
  },

  // Afrique de l'Est
  {
    name: 'Amara',
    origin: 'Amharique',
    meaning: 'Éternelle, immortelle',
    gender: 'female',
    region: ['east'],
    countries: ['ethiopia', 'eritrea', 'sudan']
  },
  {
    name: 'Jengo',
    origin: 'Swahili',
    meaning: 'Construction, édification',
    gender: 'male',
    region: ['east'],
    countries: ['kenya', 'tanzania', 'uganda', 'rwanda', 'burundi']
  },
  {
    name: 'Zara',
    origin: 'Arabe/Amharique',
    meaning: 'Fleur qui s\'épanouit',
    gender: 'female',
    region: ['east', 'north'],
    countries: ['ethiopia', 'sudan', 'somalia', 'djibouti']
  },
  {
    name: 'Baraka',
    origin: 'Swahili/Arabe',
    meaning: 'Bénédiction',
    gender: 'unisex',
    region: ['east'],
    countries: ['kenya', 'tanzania', 'uganda', 'sudan']
  },

  // Afrique du Sud
  {
    name: 'Thandiwe',
    origin: 'Zulu/Xhosa',
    meaning: 'Bien-aimée',
    gender: 'female',
    region: ['south'],
    countries: ['south-africa', 'zimbabwe', 'botswana']
  },
  {
    name: 'Sipho',
    origin: 'Zulu',
    meaning: 'Cadeau',
    gender: 'male',
    region: ['south'],
    countries: ['south-africa', 'swaziland', 'lesotho']
  },
  {
    name: 'Nomsa',
    origin: 'Zulu',
    meaning: 'Comme toujours',
    gender: 'female',
    region: ['south'],
    countries: ['south-africa', 'zimbabwe']
  },

  // Afrique du Nord
  {
    name: 'Yasmine',
    origin: 'Arabe',
    meaning: 'Jasmin',
    gender: 'female',
    region: ['north'],
    countries: ['morocco', 'algeria', 'tunisia', 'libya', 'egypt']
  },
  {
    name: 'Omar',
    origin: 'Arabe',
    meaning: 'Celui qui vit longtemps',
    gender: 'male',
    region: ['north'],
    countries: ['morocco', 'algeria', 'tunisia', 'libya', 'egypt', 'sudan']
  },
  {
    name: 'Aicha',
    origin: 'Arabe',
    meaning: 'Vivante, pleine de vie',
    gender: 'female',
    region: ['north', 'west'],
    countries: ['morocco', 'algeria', 'tunisia', 'senegal', 'mali']
  }
]

// Mapping des codes pays vers les noms de pays
export const countryMapping: { [key: string]: string } = {
  'DZ': 'algeria',
  'AO': 'angola',
  'BJ': 'benin',
  'BW': 'botswana',
  'BF': 'burkina-faso',
  'BI': 'burundi',
  'CV': 'cape-verde',
  'CM': 'cameroon',
  'CF': 'central-african-republic',
  'TD': 'chad',
  'KM': 'comoros',
  'CG': 'congo',
  'CD': 'democratic-republic-congo',
  'CI': 'cote-divoire',
  'DJ': 'djibouti',
  'EG': 'egypt',
  'GQ': 'equatorial-guinea',
  'ER': 'eritrea',
  'SZ': 'swaziland',
  'ET': 'ethiopia',
  'GA': 'gabon',
  'GM': 'gambia',
  'GH': 'ghana',
  'GN': 'guinea',
  'GW': 'guinea-bissau',
  'KE': 'kenya',
  'LS': 'lesotho',
  'LR': 'liberia',
  'LY': 'libya',
  'MG': 'madagascar',
  'MW': 'malawi',
  'ML': 'mali',
  'MR': 'mauritania',
  'MU': 'mauritius',
  'MA': 'morocco',
  'MZ': 'mozambique',
  'NA': 'namibia',
  'NE': 'niger',
  'NG': 'nigeria',
  'RW': 'rwanda',
  'ST': 'sao-tome-and-principe',
  'SN': 'senegal',
  'SC': 'seychelles',
  'SL': 'sierra-leone',
  'SO': 'somalia',
  'ZA': 'south-africa',
  'SS': 'south-sudan',
  'SD': 'sudan',
  'TZ': 'tanzania',
  'TG': 'togo',
  'TN': 'tunisia',
  'UG': 'uganda',
  'ZM': 'zambia',
  'ZW': 'zimbabwe'
}

// Fonction pour obtenir un nom adapté selon la localisation
export function getAdaptiveAfricanName(
  userCountry?: string,
  userLanguage?: string,
  preferredGender?: 'male' | 'female' | 'unisex'
): AfricanName {
  let filteredNames = [...africanNames]

  // Filtrer par pays si disponible
  if (userCountry) {
    const countryCode = userCountry.toLowerCase()
    const countryName = countryMapping[countryCode] || countryCode
    
    const countrySpecificNames = filteredNames.filter(name => 
      name.countries.includes(countryName)
    )
    
    if (countrySpecificNames.length > 0) {
      filteredNames = countrySpecificNames
    }
  }

  // Filtrer par genre si spécifié
  if (preferredGender) {
    const genderSpecificNames = filteredNames.filter(name => 
      name.gender === preferredGender || name.gender === 'unisex'
    )
    
    if (genderSpecificNames.length > 0) {
      filteredNames = genderSpecificNames
    }
  }

  // Filtrer par langue/région si disponible
  if (userLanguage) {
    const lang = userLanguage.toLowerCase()
    
    // Mapping des langues vers les régions
    const languageRegionMapping: { [key: string]: string[] } = {
      'fr': ['west', 'central', 'north'], // Français
      'ar': ['north', 'east'], // Arabe
      'en': ['east', 'south', 'west'], // Anglais
      'pt': ['central', 'south'], // Portugais
      'sw': ['east'], // Swahili
      'ha': ['west'], // Haoussa
      'am': ['east'] // Amharique
    }
    
    const regions = languageRegionMapping[lang]
    if (regions) {
      const regionSpecificNames = filteredNames.filter(name =>
        name.region.some(region => regions.includes(region))
      )
      
      if (regionSpecificNames.length > 0) {
        filteredNames = regionSpecificNames
      }
    }
  }

  // Retourner un nom aléatoire parmi les noms filtrés
  const randomIndex = Math.floor(Math.random() * filteredNames.length)
  return filteredNames[randomIndex] || africanNames[0] // Fallback sur le premier nom
}

// Fonction pour obtenir le nom complet avec titre de courtoisie
export function getAgentFullName(
  userCountry?: string,
  userLanguage?: string,
  preferredGender?: 'male' | 'female' | 'unisex'
): string {
  const selectedName = getAdaptiveAfricanName(userCountry, userLanguage, preferredGender)
  
  // Titres de courtoisie selon la région/culture
  const getTitleByRegion = (name: AfricanName): string => {
    const lang = userLanguage?.toLowerCase() || 'fr'
    
    if (lang === 'ar' || name.region.includes('north')) {
      return name.gender === 'female' ? 'Mlle' : 'M.'
    }
    
    // Français par défaut
    return name.gender === 'female' ? 'Mlle' : 'M.'
  }
  
  const title = getTitleByRegion(selectedName)
  return `${title} ${selectedName.name}`
}

// Fonction pour obtenir une présentation personnalisée
export function getAgentIntroduction(
  userCountry?: string,
  userLanguage?: string,
  preferredGender?: 'male' | 'female' | 'unisex'
): string {
  const selectedName = getAdaptiveAfricanName(userCountry, userLanguage, preferredGender)
  const fullName = getAgentFullName(userCountry, userLanguage, preferredGender)
  
  const greetings = [
    `Bonjour ! Je suis ${fullName}, votre assistant logistique personnel. Je suis là pour vous accompagner dans tous vos besoins d'expédition entre la Chine et l'Afrique.`,
    `Bonsoir ! ${fullName} à votre service. Je suis ravi de pouvoir vous aider avec vos projets logistiques. Comment puis-je vous assister aujourd'hui ?`,
    `Salutations ! Je me présente : ${fullName}, votre conseiller logistique dédié. Mon nom signifie "${selectedName.meaning}" en ${selectedName.origin}, et j'espère être à la hauteur de cette signification en vous servant.`
  ]
  
  const randomIndex = Math.floor(Math.random() * greetings.length)
  return greetings[randomIndex]
}
