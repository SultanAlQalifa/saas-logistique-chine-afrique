export const currencies = [
  // Afrique de l'Ouest (UEMOA)
  { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'CFA', flag: '🇸🇳', region: 'UEMOA' },
  
  // Afrique Centrale (CEMAC)
  { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA', flag: '🇨🇲', region: 'CEMAC' },
  
  // Principales devises mondiales
  { code: 'USD', name: 'Dollar américain', symbol: '$', flag: '🇺🇸', region: 'Amérique' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', region: 'Europe' },
  { code: 'CNY', name: 'Yuan chinois', symbol: '¥', flag: '🇨🇳', region: 'Asie' },
  { code: 'GBP', name: 'Livre sterling', symbol: '£', flag: '🇬🇧', region: 'Europe' },
  { code: 'JPY', name: 'Yen japonais', symbol: '¥', flag: '🇯🇵', region: 'Asie' },
  
  // Autres devises africaines importantes
  { code: 'NGN', name: 'Naira nigérian', symbol: '₦', flag: '🇳🇬', region: 'Afrique', enabled: true },
  { code: 'ZAR', name: 'Rand sud-africain', symbol: 'R', flag: '🇿🇦', region: 'Afrique', enabled: true },
  { code: 'EGP', name: 'Livre égyptienne', symbol: 'E£', flag: '🇪🇬', region: 'Afrique', enabled: true },
  { code: 'MAD', name: 'Dirham marocain', symbol: 'DH', flag: '🇲🇦', region: 'Afrique', enabled: true },
  { code: 'TND', name: 'Dinar tunisien', symbol: 'DT', flag: '🇹🇳', region: 'Afrique', enabled: true },
  { code: 'KES', name: 'Shilling kenyan', symbol: 'KSh', flag: '🇰🇪', region: 'Afrique', enabled: true },
  { code: 'GHS', name: 'Cedi ghanéen', symbol: 'GH₵', flag: '🇬🇭', region: 'Afrique', enabled: true },
  
  // Autres devises importantes
  { code: 'CAD', name: 'Dollar canadien', symbol: 'C$', flag: '🇨🇦', region: 'Amérique', enabled: true },
  { code: 'AUD', name: 'Dollar australien', symbol: 'A$', flag: '🇦🇺', region: 'Océanie', enabled: true },
  { code: 'CHF', name: 'Franc suisse', symbol: 'CHF', flag: '🇨🇭', region: 'Europe', enabled: true },
  { code: 'SEK', name: 'Couronne suédoise', symbol: 'kr', flag: '🇸🇪', region: 'Europe', enabled: true },
  { code: 'NOK', name: 'Couronne norvégienne', symbol: 'kr', flag: '🇳🇴', region: 'Europe', enabled: true },
  { code: 'DKK', name: 'Couronne danoise', symbol: 'kr', flag: '🇩🇰', region: 'Europe', enabled: true },
  { code: 'RUB', name: 'Rouble russe', symbol: '₽', flag: '🇷🇺', region: 'Europe', enabled: true },
  { code: 'BRL', name: 'Real brésilien', symbol: 'R$', flag: '🇧🇷', region: 'Amérique', enabled: true },
  { code: 'MXN', name: 'Peso mexicain', symbol: '$', flag: '🇲🇽', region: 'Amérique', enabled: true },
  { code: 'INR', name: 'Roupie indienne', symbol: '₹', flag: '🇮🇳', region: 'Asie', enabled: true },
  { code: 'KRW', name: 'Won sud-coréen', symbol: '₩', flag: '🇰🇷', region: 'Asie', enabled: true },
  { code: 'SGD', name: 'Dollar de Singapour', symbol: 'S$', flag: '🇸🇬', region: 'Asie', enabled: true },
  { code: 'HKD', name: 'Dollar de Hong Kong', symbol: 'HK$', flag: '🇭🇰', region: 'Asie', enabled: true },
  { code: 'AED', name: 'Dirham des EAU', symbol: 'AED', flag: '🇦🇪', region: 'Moyen-Orient', enabled: true },
  { code: 'SAR', name: 'Riyal saoudien', symbol: 'SR', flag: '🇸🇦', region: 'Moyen-Orient', enabled: true }
]

export const defaultCurrency = 'XOF' // Franc CFA BCEAO par défaut

// Taux de change fictifs - dans un vrai projet, ces données viendraient d'une API
export const exchangeRates: { [key: string]: number } = {
  // Base: 1 XOF (Franc CFA BCEAO)
  'XOF': 1.0,
  'XAF': 1.0, // Parité entre les deux francs CFA
  'USD': 0.0016, // 1 USD ≈ 620 XOF
  'EUR': 0.0015, // 1 EUR ≈ 655 XOF
  'CNY': 0.012,  // 1 CNY ≈ 85 XOF
  'GBP': 0.0013, // 1 GBP ≈ 780 XOF
  'JPY': 0.24,   // 1 JPY ≈ 4.2 XOF
  'NGN': 2.4,    // 1 NGN ≈ 0.42 XOF
  'ZAR': 0.03,   // 1 ZAR ≈ 33 XOF
  'EGP': 0.08,   // 1 EGP ≈ 12.5 XOF
  'MAD': 0.016,  // 1 MAD ≈ 62 XOF
  'TND': 0.005,  // 1 TND ≈ 200 XOF
  'KES': 0.21,   // 1 KES ≈ 4.8 XOF
  'GHS': 0.13,   // 1 GHS ≈ 7.7 XOF
  'CAD': 0.0022, // 1 CAD ≈ 460 XOF
  'AUD': 0.0024, // 1 AUD ≈ 420 XOF
  'CHF': 0.0014, // 1 CHF ≈ 690 XOF
  'SEK': 0.017,  // 1 SEK ≈ 58 XOF
  'NOK': 0.017,  // 1 NOK ≈ 57 XOF
  'DKK': 0.011,  // 1 DKK ≈ 88 XOF
  'RUB': 0.15,   // 1 RUB ≈ 6.7 XOF
  'BRL': 0.008,  // 1 BRL ≈ 125 XOF
  'MXN': 0.028,  // 1 MXN ≈ 36 XOF
  'INR': 0.13,   // 1 INR ≈ 7.4 XOF
  'KRW': 2.1,    // 1 KRW ≈ 0.47 XOF
  'SGD': 0.0022, // 1 SGD ≈ 460 XOF
  'HKD': 0.013,  // 1 HKD ≈ 79 XOF
  'AED': 0.006,  // 1 AED ≈ 169 XOF
  'SAR': 0.006   // 1 SAR ≈ 165 XOF
}

export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
  region: string
  enabled: boolean
}

export interface FxRate {
  id: string
  base_code: string
  quote_code: string
  rate_to_quote: number
  provider: string
  fetched_at: string
  stale: boolean
}

export interface MoneyAmount {
  amount_xof: number
  currency_code: string
  amount_ccy: number
  fx_rate_used?: number
  converted_at?: string
}

// Service FX avec API de taux en temps réel
export class FxService {
  private static readonly CACHE_DURATION = 15 * 60 * 1000 // 15 minutes
  private static readonly BASE_CURRENCY = 'XOF'
  private static cache = new Map<string, { rate: number; timestamp: number; stale: boolean }>()
  
  // Providers supportés
  private static readonly PROVIDERS = {
    OPEN_EXCHANGE: 'openexchangerates',
    CURRENCY_LAYER: 'currencylayer', 
    FIXER: 'fixer',
    XE: 'xe'
  }

  // Configuration des providers (à déplacer en variables d'environnement)
  private static readonly PROVIDER_CONFIGS = {
    [FxService.PROVIDERS.OPEN_EXCHANGE]: {
      url: 'https://openexchangerates.org/api/latest.json',
      apiKey: process.env.OPEN_EXCHANGE_API_KEY,
      active: true
    },
    [FxService.PROVIDERS.CURRENCY_LAYER]: {
      url: 'http://api.currencylayer.com/live',
      apiKey: process.env.CURRENCY_LAYER_API_KEY,
      active: false
    },
    [FxService.PROVIDERS.FIXER]: {
      url: 'http://data.fixer.io/api/latest',
      apiKey: process.env.FIXER_API_KEY,
      active: false
    }
  }

  /**
   * Récupère les taux de change en temps réel
   */
  static async fetchRatesFromProvider(provider: string = FxService.PROVIDERS.OPEN_EXCHANGE): Promise<{ [key: string]: number }> {
    const config = FxService.PROVIDER_CONFIGS[provider]
    if (!config || !config.active || !config.apiKey) {
      throw new Error(`Provider ${provider} not configured or inactive`)
    }

    try {
      const url = provider === FxService.PROVIDERS.OPEN_EXCHANGE 
        ? `${config.url}?app_id=${config.apiKey}&base=USD`
        : `${config.url}?access_key=${config.apiKey}`

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok || !data.rates) {
        throw new Error(`Failed to fetch rates from ${provider}: ${data.error?.info || 'Unknown error'}`)
      }

      // Convertir les taux USD-based vers XOF-based
      const usdToXof = data.rates.XOF || 655.957 // Taux de fallback
      const xofBasedRates: { [key: string]: number } = { XOF: 1.0 }

      Object.entries(data.rates).forEach(([currency, rate]) => {
        if (currency !== 'XOF') {
          // Convertir USD->Currency vers XOF->Currency
          xofBasedRates[currency] = (rate as number) / usdToXof
        }
      })

      return xofBasedRates
    } catch (error) {
      console.error(`Error fetching rates from ${provider}:`, error)
      throw error
    }
  }

  /**
   * Met à jour le cache des taux de change
   */
  static async refreshRates(): Promise<void> {
    try {
      const rates = await FxService.fetchRatesFromProvider()
      const timestamp = Date.now()

      Object.entries(rates).forEach(([currency, rate]) => {
        FxService.cache.set(currency, {
          rate,
          timestamp,
          stale: false
        })
      })

      console.log(`FX rates refreshed at ${new Date().toISOString()}`)
    } catch (error) {
      console.error('Failed to refresh FX rates:', error)
      
      // Marquer les taux existants comme "stale" mais les garder
      FxService.cache.forEach((value, key) => {
        FxService.cache.set(key, { ...value, stale: true })
      })
    }
  }

  /**
   * Obtient le taux de change XOF -> devise cible
   */
  static async getRate(quoteCurrency: string): Promise<{ rate: number; stale: boolean }> {
    if (quoteCurrency === FxService.BASE_CURRENCY) {
      return { rate: 1.0, stale: false }
    }

    const cached = FxService.cache.get(quoteCurrency)
    const now = Date.now()

    // Vérifier si le cache est valide
    if (cached && (now - cached.timestamp) < FxService.CACHE_DURATION) {
      return { rate: cached.rate, stale: cached.stale }
    }

    // Rafraîchir les taux si nécessaire
    if (!cached || (now - cached.timestamp) >= FxService.CACHE_DURATION) {
      await FxService.refreshRates()
      const refreshed = FxService.cache.get(quoteCurrency)
      if (refreshed) {
        return { rate: refreshed.rate, stale: refreshed.stale }
      }
    }

    // Fallback vers les taux statiques
    const fallbackRate = exchangeRates[quoteCurrency]
    if (fallbackRate) {
      return { rate: fallbackRate, stale: true }
    }

    throw new Error(`No exchange rate available for ${quoteCurrency}`)
  }

  /**
   * Convertit un montant de XOF vers une autre devise
   */
  static async convertFromXof(amountXof: number, quoteCurrency: string): Promise<MoneyAmount> {
    const { rate, stale } = await FxService.getRate(quoteCurrency)
    
    return {
      amount_xof: amountXof,
      currency_code: quoteCurrency,
      amount_ccy: amountXof * rate,
      fx_rate_used: rate,
      converted_at: new Date().toISOString()
    }
  }

  /**
   * Convertit un montant d'une devise vers XOF
   */
  static async convertToXof(amountCcy: number, fromCurrency: string): Promise<MoneyAmount> {
    if (fromCurrency === FxService.BASE_CURRENCY) {
      return {
        amount_xof: amountCcy,
        currency_code: fromCurrency,
        amount_ccy: amountCcy
      }
    }

    const { rate, stale } = await FxService.getRate(fromCurrency)
    const amountXof = amountCcy / rate

    return {
      amount_xof: amountXof,
      currency_code: fromCurrency,
      amount_ccy: amountCcy,
      fx_rate_used: rate,
      converted_at: new Date().toISOString()
    }
  }

  /**
   * Convertit entre deux devises (via XOF)
   */
  static async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<MoneyAmount> {
    if (fromCurrency === toCurrency) {
      return {
        amount_xof: fromCurrency === FxService.BASE_CURRENCY ? amount : 0,
        currency_code: toCurrency,
        amount_ccy: amount
      }
    }

    // Convertir d'abord vers XOF
    const inXof = await FxService.convertToXof(amount, fromCurrency)
    
    // Puis vers la devise cible
    return await FxService.convertFromXof(inXof.amount_xof, toCurrency)
  }

  /**
   * Formate un montant avec sa devise
   */
  static formatMoney(moneyAmount: MoneyAmount, showConversionInfo: boolean = false): string {
    const currency = currencies.find(c => c.code === moneyAmount.currency_code)
    const formatted = formatCurrency(moneyAmount.amount_ccy, moneyAmount.currency_code)
    
    if (showConversionInfo && moneyAmount.fx_rate_used && moneyAmount.converted_at) {
      const convertedTime = new Date(moneyAmount.converted_at).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
      return `${formatted} (converti depuis XOF · taux du ${convertedTime})`
    }
    
    return formatted
  }

  /**
   * Obtient tous les taux actuels (pour l'API)
   */
  static async getAllRates(): Promise<{ [key: string]: { rate: number; stale: boolean; updated_at: string } }> {
    const result: { [key: string]: { rate: number; stale: boolean; updated_at: string } } = {}
    
    for (const currency of currencies) {
      try {
        const { rate, stale } = await FxService.getRate(currency.code)
        const cached = FxService.cache.get(currency.code)
        
        result[currency.code] = {
          rate,
          stale,
          updated_at: cached ? new Date(cached.timestamp).toISOString() : new Date().toISOString()
        }
      } catch (error) {
        console.error(`Failed to get rate for ${currency.code}:`, error)
      }
    }
    
    return result
  }
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies.find(c => c.code === currencyCode)
  if (!currency) return `${amount} ${currencyCode}`
  
  // Formatage spécial pour les francs CFA
  if (currencyCode === 'XOF' || currencyCode === 'XAF') {
    return `${amount.toLocaleString('fr-FR')} ${currency.symbol}`
  }
  
  // Formatage standard pour les autres devises
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function getCurrencyByCode(code: string) {
  return currencies.find(c => c.code === code)
}

export function getCurrentCurrency(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('currency') || defaultCurrency
  }
  return defaultCurrency
}

export function setCurrentCurrency(currency: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currency', currency)
  }
}

// Fonction utilitaire pour obtenir les devises par région
export function getCurrenciesByRegion(region: string) {
  return currencies.filter(c => c.region === region)
}

// Fonction pour détecter la devise basée sur la localisation (simulation)
export function detectCurrencyFromLocation(): string {
  if (typeof window !== 'undefined' && 'navigator' in window) {
    const language = navigator.language || 'fr-FR'
    
    // Mapping basique langue/région -> devise
    const currencyMap: { [key: string]: string } = {
      'fr-FR': 'EUR',
      'en-US': 'USD',
      'en-GB': 'GBP',
      'zh-CN': 'CNY',
      'ja-JP': 'JPY',
      'fr-SN': 'XOF', // Sénégal
      'fr-CI': 'XOF', // Côte d'Ivoire
      'fr-BF': 'XOF', // Burkina Faso
      'fr-ML': 'XOF', // Mali
      'fr-CM': 'XAF', // Cameroun
      'fr-GA': 'XAF', // Gabon
      'fr-TD': 'XAF', // Tchad
      'ar-SA': 'SAR',
      'pt-BR': 'BRL',
      'es-MX': 'MXN'
    }
    
    return currencyMap[language] || defaultCurrency
  }
  
  return defaultCurrency
}

// Fonction utilitaire pour obtenir le taux de change (version simplifiée)
export function getCurrencyRate(fromCurrency: string, toCurrency: string = 'XOF'): number {
  if (fromCurrency === toCurrency) return 1.0
  
  // Si on convertit vers XOF, utiliser le taux direct
  if (toCurrency === 'XOF') {
    return 1 / (exchangeRates[fromCurrency] || 1)
  }
  
  // Si on convertit depuis XOF, utiliser le taux direct
  if (fromCurrency === 'XOF') {
    return exchangeRates[toCurrency] || 1
  }
  
  // Pour les conversions entre devises non-XOF, passer par XOF
  const fromToXof = 1 / (exchangeRates[fromCurrency] || 1)
  const xofToTarget = exchangeRates[toCurrency] || 1
  return fromToXof * xofToTarget
}
