import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create a demo company
  const company = await prisma.company.create({
    data: {
      name: 'Demo Logistics Company',
      email: 'contact@demologistics.com',
      phone: '+33 1 23 45 67 89',
      address: '123 Logistics Street',
      country: 'France',
      city: 'Paris',
    },
  })

  // Create company settings
  await prisma.companySettings.create({
    data: {
      companyId: company.id,
      aerialPricePerKg: 5.0,
      maritimePricePerCbm: 150.0,
      aerialEtaDays: 7,
      aerialExpressEtaDays: 3,
      maritimeEtaDays: 60,
      maritimeExpressEtaDays: 45,
      primaryColor: '#3b82f6',
    },
  })

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@company.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: company.id,
    },
  })

  const agentUser = await prisma.user.create({
    data: {
      email: 'agent@company.com',
      name: 'Agent User',
      password: hashedPassword,
      role: 'AGENT',
      companyId: company.id,
    },
  })

  // Create demo clients
  const client1 = await prisma.client.create({
    data: {
      clientId: 'CL-001',
      companyId: company.id,
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '+33 6 12 34 56 78',
      address: '456 Client Avenue',
      country: 'France',
      city: 'Lyon',
    },
  })

  const client2 = await prisma.client.create({
    data: {
      clientId: 'CL-002',
      companyId: company.id,
      name: 'Marie Martin',
      email: 'marie.martin@email.com',
      phone: '+33 6 98 76 54 32',
      address: '789 Business Road',
      country: 'France',
      city: 'Marseille',
    },
  })

  // Create demo cargo
  const cargo = await prisma.cargo.create({
    data: {
      cargoId: 'CG2501001',
      companyId: company.id,
      transportMode: 'MARITIME',
      carrier: 'China Shipping Lines',
      originPort: 'Shanghai Port',
      destinationPort: 'Port of Le Havre',
      departureDate: new Date('2025-01-15'),
      estimatedArrival: new Date('2025-03-15'),
      status: 'IN_TRANSIT',
    },
  })

  // Create demo packages
  await prisma.package.create({
    data: {
      packageId: 'CO-001',
      companyId: company.id,
      clientId: client1.id,
      cargoId: cargo.id,
      description: 'Electronics and accessories',
      weight: 25.5,
      length: 60,
      width: 40,
      height: 30,
      cbm: 0.072,
      transportMode: 'MARITIME',
      calculatedPrice: 10.8,
      finalPrice: 12.0,
      trackingPin: 'A1B2C3',
      status: 'IN_TRANSIT',
      estimatedArrival: new Date('2025-03-15'),
    },
  })

  await prisma.package.create({
    data: {
      packageId: 'CO-002',
      companyId: company.id,
      clientId: client2.id,
      description: 'Textile products',
      weight: 5.2,
      transportMode: 'AERIAL_EXPRESS',
      calculatedPrice: 26.0,
      finalPrice: 25.0,
      trackingPin: 'D4E5F6',
      status: 'PLANNED',
      estimatedArrival: new Date('2025-01-20'),
    },
  })

  await prisma.package.create({
    data: {
      packageId: 'CO-003',
      companyId: company.id,
      clientId: client1.id,
      description: 'Machinery parts',
      weight: 45.0,
      length: 80,
      width: 60,
      height: 50,
      cbm: 0.24,
      transportMode: 'MARITIME_EXPRESS',
      calculatedPrice: 36.0,
      finalPrice: 40.0,
      trackingPin: 'G7H8I9',
      status: 'ARRIVED',
      estimatedArrival: new Date('2025-01-10'),
      actualArrival: new Date('2025-01-10'),
    },
  })

  // Seed currencies
  const currencies = [
    { code: 'XOF', name: 'Franc CFA BCEAO', symbol: 'FCFA', region: 'West Africa', is_pivot: true },
    { code: 'USD', name: 'US Dollar', symbol: '$', region: 'North America' },
    { code: 'EUR', name: 'Euro', symbol: '€', region: 'Europe' },
    { code: 'GBP', name: 'British Pound', symbol: '£', region: 'United Kingdom' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', region: 'China' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', region: 'Japan' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', region: 'Canada' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', region: 'Australia' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', region: 'Switzerland' },
    { code: 'MAD', name: 'Dirham Marocain', symbol: 'DH', region: 'Morocco' },
    { code: 'TND', name: 'Dinar Tunisien', symbol: 'DT', region: 'Tunisia' },
    { code: 'DZD', name: 'Dinar Algérien', symbol: 'DA', region: 'Algeria' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', region: 'Nigeria' },
    { code: 'GHS', name: 'Ghana Cedi', symbol: 'GH₵', region: 'Ghana' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', region: 'South Africa' }
  ]

  for (const currency of currencies) {
    await prisma.currency.create({ data: currency })
  }

  // Seed initial FX rates (XOF as base)
  const fxRates = [
    { from_currency: 'XOF', to_currency: 'USD', rate: 0.0016, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'EUR', rate: 0.0015, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'GBP', rate: 0.0013, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'CNY', rate: 0.0115, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'JPY', rate: 0.24, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'CAD', rate: 0.0022, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'AUD', rate: 0.0025, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'CHF', rate: 0.0014, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'MAD', rate: 0.016, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'TND', rate: 0.005, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'DZD', rate: 0.21, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'NGN', rate: 2.5, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'GHS', rate: 0.025, provider: 'openexchangerates' },
    { from_currency: 'XOF', to_currency: 'ZAR', rate: 0.029, provider: 'openexchangerates' }
  ]

  for (const rate of fxRates) {
    await prisma.fxRate.create({ data: rate })
  }

  // Seed ads credentials (Super Admin managed)
  await prisma.adsCredential.create({
    data: {
      provider: 'meta',
      app_id: process.env.META_APP_ID || 'demo_app_id',
      app_secret: process.env.META_APP_SECRET || 'demo_app_secret',
      access_token: process.env.META_ACCESS_TOKEN || 'demo_access_token',
      business_id: process.env.META_BUSINESS_ID || 'demo_business_id',
      ad_account_id: process.env.META_AD_ACCOUNT_ID || 'demo_ad_account_id'
    }
  })

  await prisma.adsCredential.create({
    data: {
      provider: 'google',
      client_id: process.env.GOOGLE_CLIENT_ID || 'demo_client_id',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || 'demo_client_secret',
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN || 'demo_refresh_token',
      developer_token: process.env.GOOGLE_DEVELOPER_TOKEN || 'demo_developer_token',
      manager_account_id: process.env.GOOGLE_MANAGER_ACCOUNT_ID || 'demo_manager_account_id'
    }
  })

  await prisma.adsCredential.create({
    data: {
      provider: 'tiktok',
      advertiser_id: process.env.TIKTOK_ADVERTISER_ID || 'demo_advertiser_id',
      secret_key: process.env.TIKTOK_SECRET_KEY || 'demo_secret_key',
      app_key: process.env.TIKTOK_APP_KEY || 'demo_app_key'
    }
  })

  // Seed WhatsApp credentials
  await prisma.whatsAppCredential.create({
    data: {
      phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID || '221776581741',
      access_token: process.env.WHATSAPP_ACCESS_TOKEN || 'demo_access_token',
      app_id: process.env.WHATSAPP_APP_ID || 'demo_app_id',
      app_secret: process.env.WHATSAPP_APP_SECRET || 'demo_app_secret',
      webhook_verify_token: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'demo_verify_token',
      business_account_id: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || 'demo_business_account_id'
    }
  })

  // Seed feature flags
  const features = [
    { code: 'DASHBOARD_ANALYTICS', name: 'Analytics Avancées', category: 'Dashboard', module: 'Analytics' },
    { code: 'DASHBOARD_DRILL_DOWN', name: 'Drill-down Détaillé', category: 'Dashboard', module: 'Navigation' },
    { code: 'PACKAGES_BULK_IMPORT', name: 'Import en Masse', category: 'Packages', module: 'Import' },
    { code: 'PACKAGES_AUTO_PRICING', name: 'Tarification Auto', category: 'Packages', module: 'Pricing' },
    { code: 'CLIENTS_ADVANCED_SEGMENTATION', name: 'Segmentation Avancée', category: 'Clients', module: 'Segmentation' },
    { code: 'CLIENTS_LOYALTY_PROGRAM', name: 'Programme Fidélité', category: 'Clients', module: 'Loyalty' },
    { code: 'MARKETING_ADS_CENTRAL', name: 'Publicités Centralisées', category: 'Marketing', module: 'Ads' },
    { code: 'MARKETING_EMAIL_CAMPAIGNS', name: 'Campagnes Email', category: 'Marketing', module: 'Email' },
    { code: 'SUPPORT_WHATSAPP', name: 'Support WhatsApp', category: 'Support', module: 'WhatsApp' },
    { code: 'SUPPORT_AI_CHATBOT', name: 'Chatbot IA', category: 'Support', module: 'AI' },
    { code: 'FINANCES_MULTI_CURRENCY', name: 'Multi-devises', category: 'Finances', module: 'Currency' },
    { code: 'FINANCES_AUTOMATED_INVOICING', name: 'Facturation Auto', category: 'Finances', module: 'Invoicing' }
  ]

  for (const feature of features) {
    await prisma.featureFlag.create({ data: feature })
  }

  console.log('Database seeded successfully!')
  console.log('Demo credentials:')
  console.log('Admin: admin@company.com / password123')
  console.log('Agent: agent@company.com / password123')
  console.log('Tracking PINs: A1B2C3, D4E5F6, G7H8I9')
  console.log('Currencies: 15 currencies seeded with XOF as pivot')
  console.log('FX Rates: Initial rates seeded for all currencies')
  console.log('Ads Credentials: Meta, Google, TikTok credentials seeded')
  console.log('WhatsApp: Business credentials seeded')
  console.log('Feature Flags: 12 SaaS features seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
