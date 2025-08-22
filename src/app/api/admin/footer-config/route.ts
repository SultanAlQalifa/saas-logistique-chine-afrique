import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const CONFIG_DIR = path.join(process.cwd(), 'data')
const CONFIG_FILE = path.join(CONFIG_DIR, 'footer-config.json')

interface FooterLink {
  id: string
  title: string
  url: string
  order: number
}

interface FooterSection {
  id: string
  title: string
  links: FooterLink[]
  order: number
}

interface SocialLink {
  id: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube'
  url: string
  isActive: boolean
}

interface FooterConfig {
  companyName: string
  description: string
  address: string
  phone: string
  email: string
  sections: FooterSection[]
  socialLinks: SocialLink[]
  copyrightText: string
  isActive: boolean
  updatedAt: string
  updatedBy: string
}

const defaultFooterConfig: FooterConfig = {
  companyName: "SaaS Logistique",
  description: "Plateforme de gestion logistique entre la Chine et l'Afrique",
  address: "123 Avenue de la Logistique, Abidjan, Côte d'Ivoire",
  phone: "+225 01 23 45 67 89",
  email: "contact@saaslogistique.com",
  sections: [
    {
      id: "1",
      title: "Services",
      order: 1,
      links: [
        { id: "1", title: "Transport Maritime", url: "/services/maritime", order: 1 },
        { id: "2", title: "Transport Aérien", url: "/services/aerien", order: 2 },
        { id: "3", title: "Suivi de Colis", url: "/track", order: 3 }
      ]
    },
    {
      id: "2",
      title: "Support",
      order: 2,
      links: [
        { id: "4", title: "Centre d'Aide", url: "/help", order: 1 },
        { id: "5", title: "Contact", url: "/contact", order: 2 },
        { id: "6", title: "FAQ", url: "/faq", order: 3 }
      ]
    }
  ],
  socialLinks: [
    { id: "1", platform: "facebook", url: "https://facebook.com/saaslogistique", isActive: true },
    { id: "2", platform: "twitter", url: "https://twitter.com/saaslogistique", isActive: true },
    { id: "3", platform: "linkedin", url: "https://linkedin.com/company/saaslogistique", isActive: true },
    { id: "4", platform: "instagram", url: "https://instagram.com/saaslogistique", isActive: false },
    { id: "5", platform: "youtube", url: "https://youtube.com/saaslogistique", isActive: false }
  ],
  copyrightText: "© 2024 SaaS Logistique. Tous droits réservés.",
  isActive: true,
  updatedAt: new Date().toISOString(),
  updatedBy: "system"
}

async function ensureConfigExists() {
  if (!existsSync(CONFIG_DIR)) {
    await mkdir(CONFIG_DIR, { recursive: true })
  }
  
  if (!existsSync(CONFIG_FILE)) {
    await writeFile(CONFIG_FILE, JSON.stringify(defaultFooterConfig, null, 2))
  }
}

export async function GET() {
  try {
    await ensureConfigExists()
    const data = await readFile(CONFIG_FILE, 'utf-8')
    const config = JSON.parse(data)
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error reading footer config:', error)
    return NextResponse.json(defaultFooterConfig)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.companyName || !body.email) {
      return NextResponse.json(
        { error: 'Nom de l\'entreprise et email sont requis' },
        { status: 400 }
      )
    }

    // Ajouter les métadonnées de mise à jour
    const updatedConfig: FooterConfig = {
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: 'super-admin' // TODO: Récupérer l'utilisateur depuis la session
    }

    await ensureConfigExists()
    await writeFile(CONFIG_FILE, JSON.stringify(updatedConfig, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configuration du footer sauvegardée avec succès',
      config: updatedConfig
    })
  } catch (error) {
    console.error('Error saving footer config:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde de la configuration' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { isActive } = body

    await ensureConfigExists()
    const data = await readFile(CONFIG_FILE, 'utf-8')
    const config = JSON.parse(data)
    
    config.isActive = isActive
    config.updatedAt = new Date().toISOString()
    config.updatedBy = 'super-admin'
    
    await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: `Footer ${isActive ? 'activé' : 'désactivé'} avec succès`
    })
  } catch (error) {
    console.error('Error updating footer status:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    )
  }
}
