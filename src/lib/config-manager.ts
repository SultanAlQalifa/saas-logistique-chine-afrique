import { promises as fs } from 'fs'
import path from 'path'

const CONFIG_FILE_PATH = path.join(process.cwd(), 'data', 'config.json')

// Configuration par défaut
const DEFAULT_CONFIG = {
  general: {
    siteName: 'NextMove Cargo',
    siteUrl: 'https://nextmove-cargo.com',
    adminEmail: 'admin@nextmove-cargo.com',
    timezone: 'Africa/Dakar',
    language: 'fr',
    currency: 'XOF',
    maintenanceMode: false,
    companyName: 'NextMove Cargo SARL',
    companyAddress: 'Dakar, Sénégal',
    supportPhone: '+221 77 123 45 67',
    businessHours: '08:00 - 18:00'
  },
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    gpt5Enabled: true,
    gpt5Model: 'gpt-4-turbo',
    maxTokens: 4096,
    temperature: 0.7,
    systemPrompt: 'Vous êtes un assistant IA spécialisé en logistique Chine-Afrique.',
    autoResponse: true,
    responseDelay: 1000,
    fallbackModel: 'gpt-4-turbo',
    contextWindow: 128000,
    streamingEnabled: true
  },
  integrations: {
    whatsappToken: 'EAAG...',
    telegramBotToken: '123456:ABC...',
    slackWebhook: 'https://hooks.slack.com/...',
    discordWebhook: 'https://discord.com/api/webhooks/...',
    emailProvider: 'sendgrid',
    sendgridApiKey: 'SG.xxx',
    twilioSid: 'AC...',
    twilioToken: 'xxx',
    stripePublicKey: 'pk_live_...',
    stripeSecretKey: 'sk_live_...',
    paypalClientId: 'AYiPC...',
    googleMapsApiKey: 'AIza...'
  },
  appearance: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    darkMode: false,
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    customCss: '',
    fontFamily: 'Inter',
    borderRadius: 'rounded-xl',
    animations: true
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    webhookNotifications: false,
    notificationSound: true,
    digestFrequency: 'daily',
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    channels: {
      newOrder: ['email', 'push'],
      statusUpdate: ['email', 'sms'],
      payment: ['email', 'push'],
      system: ['email']
    }
  },
  system: {
    maxFileSize: '50',
    sessionTimeout: '120',
    backupFrequency: 'daily',
    logLevel: 'info',
    cacheEnabled: true,
    debugMode: false,
    rateLimiting: true,
    apiRateLimit: 1000,
    databasePool: 20,
    redisEnabled: true,
    cdnEnabled: true,
    compressionEnabled: true
  },
  security: {
    twoFactorAuth: true,
    passwordMinLength: '8',
    loginAttempts: '5',
    sslForced: true
  }
}

export class ConfigManager {
  private static configCache: any = null
  private static lastLoadTime = 0
  private static readonly CACHE_DURATION = 30000 // 30 seconds

  /**
   * Check if we're in a production/read-only environment
   */
  private static isProductionEnvironment(): boolean {
    return process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true' || process.env.VERCEL === '1'
  }

  /**
   * Ensure the data directory and config file exist (only in development)
   */
  private static async ensureConfigFile(): Promise<void> {
    if (this.isProductionEnvironment()) {
      return // Skip file operations in production
    }

    try {
      const dataDir = path.dirname(CONFIG_FILE_PATH)
      await fs.mkdir(dataDir, { recursive: true })
      
      // Check if config file exists
      try {
        await fs.access(CONFIG_FILE_PATH)
      } catch {
        // File doesn't exist, create it with default config
        await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2))
        console.log('Configuration file created with default values')
      }
    } catch (error) {
      console.error('Error ensuring config file:', error)
    }
  }

  /**
   * Load configuration from file with caching
   */
  static async loadConfig(): Promise<any> {
    const now = Date.now()
    
    // Return cached config if still valid
    if (this.configCache && (now - this.lastLoadTime) < this.CACHE_DURATION) {
      return this.configCache
    }

    // In production, use default config with environment variables
    if (this.isProductionEnvironment()) {
      this.configCache = {
        ...DEFAULT_CONFIG,
        ai: {
          ...DEFAULT_CONFIG.ai,
          openaiApiKey: process.env.OPENAI_API_KEY || DEFAULT_CONFIG.ai.openaiApiKey
        }
      }
      this.lastLoadTime = now
      console.log('Configuration loaded from environment (production)')
      return this.configCache
    }

    try {
      await this.ensureConfigFile()
      const configData = await fs.readFile(CONFIG_FILE_PATH, 'utf-8')
      this.configCache = JSON.parse(configData)
      this.lastLoadTime = now
      
      console.log('Configuration loaded from file (development)')
      return this.configCache
    } catch (error) {
      console.error('Error loading config:', error)
      // Return default config if file loading fails
      this.configCache = DEFAULT_CONFIG
      this.lastLoadTime = now
      return this.configCache
    }
  }

  /**
   * Save configuration to file (only in development)
   */
  static async saveConfig(config: any): Promise<void> {
    if (this.isProductionEnvironment()) {
      console.warn('Cannot save config in production environment (read-only filesystem)')
      // Update cache only
      this.configCache = config
      this.lastLoadTime = Date.now()
      return
    }

    try {
      await this.ensureConfigFile()
      await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2))
      
      // Update cache
      this.configCache = config
      this.lastLoadTime = Date.now()
      
      console.log('Configuration saved to file')
    } catch (error) {
      console.error('Error saving config:', error)
      throw error
    }
  }

  /**
   * Update a specific section of the configuration
   */
  static async updateSection(section: string, sectionConfig: any): Promise<any> {
    const config = await this.loadConfig()
    
    if (!config.hasOwnProperty(section)) {
      throw new Error(`Section '${section}' not found`)
    }

    config[section] = { ...config[section], ...sectionConfig }
    
    if (this.isProductionEnvironment()) {
      console.warn(`Cannot persist config changes in production. Section '${section}' updated in memory only.`)
      // Update cache only
      this.configCache = config
      this.lastLoadTime = Date.now()
    } else {
      await this.saveConfig(config)
    }
    
    return config[section]
  }

  /**
   * Get AI configuration specifically (public method)
   */
  static async getAIConfig(): Promise<any> {
    const config = await this.loadConfig()
    return config.ai || DEFAULT_CONFIG.ai
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  static clearCache(): void {
    this.configCache = null
    this.lastLoadTime = 0
  }
}
