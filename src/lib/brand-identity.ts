// Charte graphique et identité de marque NextMove
export interface BrandColors {
  primary: string
  secondary: string
  accent: string
  success: string
  warning: string
  error: string
  neutral: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
  }
}

export interface BrandTypography {
  fontFamily: {
    primary: string
    secondary: string
    mono: string
  }
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl': string
  }
  fontWeight: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
}

export interface BrandSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
}

// Palette de couleurs inspirée de l'Afrique
export const brandColors: BrandColors = {
  // Orange terre cuite (couleur dominante africaine)
  primary: '#E67E22',
  // Vert émeraude (richesse naturelle de l'Afrique)
  secondary: '#27AE60',
  // Or (richesse et prospérité)
  accent: '#F39C12',
  // Vert succès
  success: '#2ECC71',
  // Orange attention
  warning: '#F39C12',
  // Rouge corail
  error: '#E74C3C',
  // Nuances de gris chaud
  neutral: {
    50: '#FDFCFC',
    100: '#F8F6F4',
    200: '#F1EDE8',
    300: '#E8E1D9',
    400: '#D4C4B0',
    500: '#A68B5B',
    600: '#8B6914',
    700: '#6B4E03',
    800: '#4A3728',
    900: '#2C1810'
  }
}

// Typographie inspirée des motifs africains modernes
export const brandTypography: BrandTypography = {
  fontFamily: {
    primary: '"Inter", "Segoe UI", "Roboto", sans-serif',
    secondary: '"Playfair Display", "Georgia", serif',
    mono: '"JetBrains Mono", "Fira Code", monospace'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem'
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
}

// Espacement harmonieux
export const brandSpacing: BrandSpacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem'
}

// Suggestions de noms pour la plateforme
export const brandNameSuggestions = {
  recommended: [
    {
      name: 'NextMove Cargo',
      description: 'Évoque le mouvement et le transport de marchandises',
      pros: ['Court et mémorable', 'International', 'Professionnel'],
      africaConnection: 'Mouvement vers l\'avenir de l\'Afrique'
    },
    {
      name: 'Baobab Logistics',
      description: 'Inspiré de l\'arbre emblématique africain',
      pros: ['Identité africaine forte', 'Symbolise la connexion', 'Unique'],
      africaConnection: 'Baobab = arbre de vie, connexion entre les peuples'
    },
    {
      name: 'Sahara Bridge',
      description: 'Pont logistique à travers les continents',
      pros: ['Évoque la connexion', 'Référence géographique', 'Moderne'],
      africaConnection: 'Sahara = cœur de l\'Afrique, Bridge = connexion'
    }
  ],
  alternatives: [
    {
      name: 'NextMove Transit',
      description: 'Focus sur le transit et le passage',
      pros: ['Cohérent avec l\'écosystème', 'Clair'],
      cons: ['Moins spécifique au cargo']
    },
    {
      name: 'AfriLink Cargo',
      description: 'Lien direct avec l\'Afrique',
      pros: ['Identité africaine claire', 'Évoque la connexion'],
      cons: ['Peut sembler limitant géographiquement']
    },
    {
      name: 'Kilimandjaro Logistics',
      description: 'Référence au sommet africain',
      pros: ['Évoque l\'excellence', 'Identité africaine'],
      cons: ['Nom long', 'Difficile à prononcer']
    }
  ]
}

// Éléments visuels de la charte
export const brandVisualElements = {
  logo: {
    primaryVersion: 'Logo avec texte complet',
    iconVersion: 'Symbole seul pour les petits espaces',
    monochromeVersion: 'Version noir et blanc'
  },
  patterns: {
    african: 'Motifs géométriques inspirés des textiles africains',
    modern: 'Lignes épurées et formes contemporaines',
    hybrid: 'Fusion entre tradition et modernité'
  },
  imagery: {
    style: 'Photographies authentiques de l\'Afrique moderne',
    colors: 'Tons chauds et naturels',
    composition: 'Équilibre entre tradition et innovation'
  }
}

// Guidelines d'utilisation
export const brandGuidelines = {
  doAndDont: {
    do: [
      'Utiliser les couleurs primaires pour les éléments importants',
      'Maintenir un contraste suffisant pour l\'accessibilité',
      'Respecter les espacements définis',
      'Utiliser la typographie principale pour les textes',
      'Intégrer des éléments visuels africains avec subtilité'
    ],
    dont: [
      'Modifier les couleurs de la palette',
      'Utiliser plus de 3 couleurs simultanément',
      'Négliger l\'espacement entre les éléments',
      'Mélanger trop de polices différentes',
      'Utiliser des clichés sur l\'Afrique'
    ]
  },
  accessibility: {
    contrast: 'Ratio minimum de 4.5:1 pour le texte',
    colorBlind: 'Ne pas se fier uniquement à la couleur pour l\'information',
    fontSize: 'Taille minimum de 14px pour le texte principal'
  }
}

// Cohérence avec l'écosystème NextMove
export const ecosystemBranding = {
  nextMoveAgency: {
    colors: ['#E67E22', '#27AE60'], // Orange et vert
    style: 'Voyage et découverte'
  },
  nextMoveCargo: {
    colors: ['#E67E22', '#F39C12'], // Orange et or
    style: 'Logistique et efficacité'
  },
  restoConnect360: {
    colors: ['#27AE60', '#F39C12'], // Vert et or
    style: 'Gastronomie et convivialité'
  },
  synergy: 'Palette commune permettant une identité cohérente tout en gardant des spécificités'
}
