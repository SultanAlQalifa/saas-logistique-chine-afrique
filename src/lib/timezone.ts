export const timezones = [
  // GMT/UTC
  { code: 'GMT', name: 'Greenwich Mean Time', offset: '+00:00', flag: '🇬🇧', region: 'Europe' },
  { code: 'UTC', name: 'Coordinated Universal Time', offset: '+00:00', flag: '🌍', region: 'Global' },
  
  // Afrique
  { code: 'Africa/Abidjan', name: 'Abidjan (GMT)', offset: '+00:00', flag: '🇨🇮', region: 'Afrique de l\'Ouest' },
  { code: 'Africa/Dakar', name: 'Dakar (GMT)', offset: '+00:00', flag: '🇸🇳', region: 'Afrique de l\'Ouest' },
  { code: 'Africa/Bamako', name: 'Bamako (GMT)', offset: '+00:00', flag: '🇲🇱', region: 'Afrique de l\'Ouest' },
  { code: 'Africa/Ouagadougou', name: 'Ouagadougou (GMT)', offset: '+00:00', flag: '🇧🇫', region: 'Afrique de l\'Ouest' },
  { code: 'Africa/Niamey', name: 'Niamey (WAT)', offset: '+01:00', flag: '🇳🇪', region: 'Afrique de l\'Ouest' },
  { code: 'Africa/Lagos', name: 'Lagos (WAT)', offset: '+01:00', flag: '🇳🇬', region: 'Afrique de l\'Ouest' },
  { code: 'Africa/Douala', name: 'Douala (WAT)', offset: '+01:00', flag: '🇨🇲', region: 'Afrique Centrale' },
  { code: 'Africa/Libreville', name: 'Libreville (WAT)', offset: '+01:00', flag: '🇬🇦', region: 'Afrique Centrale' },
  { code: 'Africa/Bangui', name: 'Bangui (WAT)', offset: '+01:00', flag: '🇨🇫', region: 'Afrique Centrale' },
  { code: 'Africa/Ndjamena', name: 'N\'Djamena (WAT)', offset: '+01:00', flag: '🇹🇩', region: 'Afrique Centrale' },
  { code: 'Africa/Cairo', name: 'Le Caire (EET)', offset: '+02:00', flag: '🇪🇬', region: 'Afrique du Nord' },
  { code: 'Africa/Casablanca', name: 'Casablanca (WET)', offset: '+01:00', flag: '🇲🇦', region: 'Afrique du Nord' },
  { code: 'Africa/Tunis', name: 'Tunis (CET)', offset: '+01:00', flag: '🇹🇳', region: 'Afrique du Nord' },
  { code: 'Africa/Johannesburg', name: 'Johannesburg (SAST)', offset: '+02:00', flag: '🇿🇦', region: 'Afrique du Sud' },
  { code: 'Africa/Nairobi', name: 'Nairobi (EAT)', offset: '+03:00', flag: '🇰🇪', region: 'Afrique de l\'Est' },
  { code: 'Africa/Accra', name: 'Accra (GMT)', offset: '+00:00', flag: '🇬🇭', region: 'Afrique de l\'Ouest' },
  
  // Chine et Asie
  { code: 'Asia/Shanghai', name: 'Shanghai (CST)', offset: '+08:00', flag: '🇨🇳', region: 'Chine' },
  { code: 'Asia/Beijing', name: 'Beijing (CST)', offset: '+08:00', flag: '🇨🇳', region: 'Chine' },
  { code: 'Asia/Guangzhou', name: 'Guangzhou (CST)', offset: '+08:00', flag: '🇨🇳', region: 'Chine' },
  { code: 'Asia/Shenzhen', name: 'Shenzhen (CST)', offset: '+08:00', flag: '🇨🇳', region: 'Chine' },
  { code: 'Asia/Hong_Kong', name: 'Hong Kong (HKT)', offset: '+08:00', flag: '🇭🇰', region: 'Asie' },
  { code: 'Asia/Singapore', name: 'Singapour (SGT)', offset: '+08:00', flag: '🇸🇬', region: 'Asie' },
  { code: 'Asia/Tokyo', name: 'Tokyo (JST)', offset: '+09:00', flag: '🇯🇵', region: 'Asie' },
  { code: 'Asia/Seoul', name: 'Seoul (KST)', offset: '+09:00', flag: '🇰🇷', region: 'Asie' },
  { code: 'Asia/Kolkata', name: 'Mumbai (IST)', offset: '+05:30', flag: '🇮🇳', region: 'Asie' },
  { code: 'Asia/Dubai', name: 'Dubai (GST)', offset: '+04:00', flag: '🇦🇪', region: 'Moyen-Orient' },
  { code: 'Asia/Riyadh', name: 'Riyadh (AST)', offset: '+03:00', flag: '🇸🇦', region: 'Moyen-Orient' },
  
  // Europe
  { code: 'Europe/London', name: 'Londres (GMT/BST)', offset: '+00:00', flag: '🇬🇧', region: 'Europe' },
  { code: 'Europe/Paris', name: 'Paris (CET/CEST)', offset: '+01:00', flag: '🇫🇷', region: 'Europe' },
  { code: 'Europe/Berlin', name: 'Berlin (CET/CEST)', offset: '+01:00', flag: '🇩🇪', region: 'Europe' },
  { code: 'Europe/Rome', name: 'Rome (CET/CEST)', offset: '+01:00', flag: '🇮🇹', region: 'Europe' },
  { code: 'Europe/Madrid', name: 'Madrid (CET/CEST)', offset: '+01:00', flag: '🇪🇸', region: 'Europe' },
  { code: 'Europe/Zurich', name: 'Zurich (CET/CEST)', offset: '+01:00', flag: '🇨🇭', region: 'Europe' },
  { code: 'Europe/Stockholm', name: 'Stockholm (CET/CEST)', offset: '+01:00', flag: '🇸🇪', region: 'Europe' },
  { code: 'Europe/Moscow', name: 'Moscou (MSK)', offset: '+03:00', flag: '🇷🇺', region: 'Europe' },
  
  // Amériques
  { code: 'America/New_York', name: 'New York (EST/EDT)', offset: '-05:00', flag: '🇺🇸', region: 'Amérique du Nord' },
  { code: 'America/Los_Angeles', name: 'Los Angeles (PST/PDT)', offset: '-08:00', flag: '🇺🇸', region: 'Amérique du Nord' },
  { code: 'America/Chicago', name: 'Chicago (CST/CDT)', offset: '-06:00', flag: '🇺🇸', region: 'Amérique du Nord' },
  { code: 'America/Toronto', name: 'Toronto (EST/EDT)', offset: '-05:00', flag: '🇨🇦', region: 'Amérique du Nord' },
  { code: 'America/Sao_Paulo', name: 'São Paulo (BRT)', offset: '-03:00', flag: '🇧🇷', region: 'Amérique du Sud' },
  { code: 'America/Mexico_City', name: 'Mexico City (CST/CDT)', offset: '-06:00', flag: '🇲🇽', region: 'Amérique du Nord' },
  
  // Océanie
  { code: 'Australia/Sydney', name: 'Sydney (AEST/AEDT)', offset: '+10:00', flag: '🇦🇺', region: 'Océanie' },
  { code: 'Australia/Melbourne', name: 'Melbourne (AEST/AEDT)', offset: '+10:00', flag: '🇦🇺', region: 'Océanie' },
  { code: 'Pacific/Auckland', name: 'Auckland (NZST/NZDT)', offset: '+12:00', flag: '🇳🇿', region: 'Océanie' }
]

export const defaultTimezone = 'GMT' // GMT+00 par défaut

export function getCurrentTimezone(): string {
  if (typeof window !== 'undefined') {
    // Essayer de récupérer depuis localStorage
    const saved = localStorage.getItem('timezone')
    if (saved) return saved
    
    // Sinon, détecter automatiquement
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
      return detected || defaultTimezone
    } catch {
      return defaultTimezone
    }
  }
  return defaultTimezone
}

export function setCurrentTimezone(timezone: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('timezone', timezone)
  }
}

export function getTimezoneByCode(code: string) {
  return timezones.find(tz => tz.code === code)
}

export function formatTimeInTimezone(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(date)
  } catch {
    return date.toLocaleString('fr-FR')
  }
}

export function convertTimeToTimezone(date: Date, fromTimezone: string, toTimezone: string): Date {
  try {
    // Créer une date dans le fuseau source
    const sourceTime = new Intl.DateTimeFormat('en-CA', {
      timeZone: fromTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date)
    
    // Convertir vers le fuseau cible
    const targetDate = new Date(sourceTime)
    return targetDate
  } catch {
    return date
  }
}

export function getTimezoneName(timezone: string): string {
  const tz = getTimezoneByCode(timezone)
  return tz ? tz.name : timezone
}

export function getTimezoneOffset(timezone: string): string {
  const tz = getTimezoneByCode(timezone)
  return tz ? tz.offset : '+00:00'
}

export function getTimezonesByRegion(region: string) {
  return timezones.filter(tz => tz.region === region)
}

export function detectUserTimezone(): string {
  if (typeof window !== 'undefined') {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
      return defaultTimezone
    }
  }
  return defaultTimezone
}

export function isBusinessHours(timezone: string, date: Date = new Date()): boolean {
  try {
    const timeInZone = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
    const hour = timeInZone.getHours()
    const day = timeInZone.getDay()
    
    // Heures ouvrables : 8h-18h, lundi-vendredi
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18
  } catch {
    return false
  }
}

export function getBusinessHoursStatus(timezone: string): {
  isOpen: boolean
  nextOpenTime?: Date
  message: string
} {
  const now = new Date()
  const isOpen = isBusinessHours(timezone, now)
  
  if (isOpen) {
    return {
      isOpen: true,
      message: 'Nos bureaux sont actuellement ouverts'
    }
  }
  
  // Calculer la prochaine ouverture
  const nextOpen = new Date(now)
  const currentDay = nextOpen.getDay()
  const currentHour = nextOpen.getHours()
  
  if (currentDay === 0) { // Dimanche
    nextOpen.setDate(nextOpen.getDate() + 1) // Lundi
    nextOpen.setHours(8, 0, 0, 0)
  } else if (currentDay === 6) { // Samedi
    nextOpen.setDate(nextOpen.getDate() + 2) // Lundi
    nextOpen.setHours(8, 0, 0, 0)
  } else if (currentHour >= 18) { // Après 18h en semaine
    nextOpen.setDate(nextOpen.getDate() + 1) // Jour suivant
    nextOpen.setHours(8, 0, 0, 0)
  } else { // Avant 8h en semaine
    nextOpen.setHours(8, 0, 0, 0)
  }
  
  return {
    isOpen: false,
    nextOpenTime: nextOpen,
    message: `Nos bureaux sont fermés. Réouverture le ${nextOpen.toLocaleDateString('fr-FR')} à 8h00`
  }
}

// Fonction utilitaire pour formater une durée entre deux fuseaux
export function getTimeDifference(timezone1: string, timezone2: string): string {
  const now = new Date()
  
  try {
    const time1 = new Date(now.toLocaleString('en-US', { timeZone: timezone1 }))
    const time2 = new Date(now.toLocaleString('en-US', { timeZone: timezone2 }))
    
    const diffMs = time1.getTime() - time2.getTime()
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))
    
    if (diffHours === 0) return 'Même fuseau horaire'
    if (diffHours > 0) return `+${diffHours}h`
    return `${diffHours}h`
  } catch {
    return 'Inconnu'
  }
}
