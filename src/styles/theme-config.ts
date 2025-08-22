// Configuration des couleurs NextMove Cargo - Version assombrie pour meilleur contraste
export const NextMoveTheme = {
  // Couleurs primaires assombries
  primary: {
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff', 
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c2d12', // Assombri de purple-500 à purple-700
      800: '#6b21a8', // Assombri de purple-600 à purple-800
      900: '#581c87'
    },
    pink: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d', // Assombri de pink-500 à pink-700
      800: '#9d174d', // Assombri de pink-600 à pink-800
      900: '#831843'
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8', // Assombri de blue-500 à blue-700
      800: '#1e40af', // Assombri de blue-600 à blue-800
      900: '#1e3a8a'
    },
    cyan: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490', // Assombri de cyan-500 à cyan-700
      800: '#155e75', // Assombri de cyan-600 à cyan-800
      900: '#164e63'
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d', // Assombri de green-500 à green-700
      800: '#166534', // Assombri de green-600 à green-800
      900: '#14532d'
    },
    emerald: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857', // Assombri de emerald-500 à emerald-700
      800: '#065f46', // Assombri de emerald-600 à emerald-800
      900: '#064e3b'
    }
  },

  // Gradients assombris pour meilleur contraste
  gradients: {
    primary: 'from-purple-700 to-pink-700',
    primaryHover: 'from-purple-800 to-pink-800',
    blue: 'from-blue-700 to-cyan-700',
    blueHover: 'from-blue-800 to-cyan-800',
    green: 'from-green-700 to-emerald-700',
    greenHover: 'from-green-800 to-emerald-800',
    
    // Nouveaux gradients pour NextMove Cargo
    cargo: 'from-blue-800 to-purple-800',
    cargoHover: 'from-blue-900 to-purple-900',
    ocean: 'from-cyan-800 to-blue-800',
    oceanHover: 'from-cyan-900 to-blue-900',
    success: 'from-emerald-700 to-green-700',
    successHover: 'from-emerald-800 to-green-800'
  },

  // Couleurs de fond assombries
  backgrounds: {
    primary: 'bg-gray-900',
    secondary: 'bg-gray-800',
    card: 'bg-gray-800/50',
    cardHover: 'bg-gray-700/50',
    sidebar: 'bg-gray-900/95',
    modal: 'bg-gray-800/95'
  },

  // Textes avec meilleur contraste
  text: {
    primary: 'text-gray-100',
    secondary: 'text-gray-300',
    muted: 'text-gray-400',
    accent: 'text-purple-300',
    success: 'text-emerald-300',
    warning: 'text-yellow-300',
    error: 'text-red-300'
  },

  // Bordures assombries
  borders: {
    primary: 'border-gray-700',
    secondary: 'border-gray-600',
    accent: 'border-purple-600',
    success: 'border-emerald-600',
    warning: 'border-yellow-600',
    error: 'border-red-600'
  },

  // Ombres pour profondeur
  shadows: {
    sm: 'shadow-lg shadow-gray-900/25',
    md: 'shadow-xl shadow-gray-900/25',
    lg: 'shadow-2xl shadow-gray-900/25',
    colored: {
      purple: 'shadow-lg shadow-purple-800/25',
      blue: 'shadow-lg shadow-blue-800/25',
      green: 'shadow-lg shadow-emerald-800/25'
    }
  },

  // Icônes thématiques NextMove Cargo
  icons: {
    cargo: '🚢',
    plane: '✈️',
    truck: '🚛',
    package: '📦',
    world: '🌍',
    anchor: '⚓',
    crane: '🏗️',
    container: '📦'
  }
};

// Classes utilitaires pour Tailwind CSS
export const NextMoveClasses = {
  // Boutons avec contraste amélioré
  button: {
    primary: `bg-gradient-to-r ${NextMoveTheme.gradients.primary} hover:${NextMoveTheme.gradients.primaryHover} text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${NextMoveTheme.shadows.colored.purple}`,
    secondary: `bg-gradient-to-r ${NextMoveTheme.gradients.blue} hover:${NextMoveTheme.gradients.blueHover} text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${NextMoveTheme.shadows.colored.blue}`,
    success: `bg-gradient-to-r ${NextMoveTheme.gradients.success} hover:${NextMoveTheme.gradients.successHover} text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${NextMoveTheme.shadows.colored.green}`
  },

  // Cartes avec fond assombri
  card: {
    primary: `${NextMoveTheme.backgrounds.card} ${NextMoveTheme.borders.primary} border rounded-xl p-6 ${NextMoveTheme.shadows.md} backdrop-blur-sm`,
    hover: `${NextMoveTheme.backgrounds.cardHover} ${NextMoveTheme.borders.secondary} border rounded-xl p-6 ${NextMoveTheme.shadows.lg} backdrop-blur-sm hover:scale-105 transition-all duration-200`
  },

  // Headers avec gradients assombris
  header: {
    primary: `bg-gradient-to-r ${NextMoveTheme.gradients.cargo} ${NextMoveTheme.text.primary} font-bold text-xl p-4 rounded-t-xl`,
    secondary: `bg-gradient-to-r ${NextMoveTheme.gradients.ocean} ${NextMoveTheme.text.primary} font-semibold text-lg p-3 rounded-t-lg`
  }
};

export default NextMoveTheme;
