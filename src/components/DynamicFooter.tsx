'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Globe
} from 'lucide-react'

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
}

export default function DynamicFooter() {
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFooterConfig = async () => {
      try {
        const response = await fetch('/api/admin/footer-config')
        if (response.ok) {
          const config = await response.json()
          setFooterConfig(config)
        }
      } catch (error) {
        console.error('Error fetching footer config:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFooterConfig()
  }, [])

  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "h-5 w-5" }
    switch (platform) {
      case 'facebook': return <Facebook {...iconProps} />
      case 'twitter': return <Twitter {...iconProps} />
      case 'instagram': return <Instagram {...iconProps} />
      case 'linkedin': return <Linkedin {...iconProps} />
      case 'youtube': return <Youtube {...iconProps} />
      default: return <Globe {...iconProps} />
    }
  }

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-width mx-auto px-4 py-8">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="h-6 bg-gray-700 rounded mb-4 w-48"></div>
                <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-64"></div>
                  <div className="h-4 bg-gray-700 rounded w-48"></div>
                  <div className="h-4 bg-gray-700 rounded w-56"></div>
                </div>
              </div>
              <div>
                <div className="h-5 bg-gray-700 rounded mb-4 w-24"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-700 rounded w-28"></div>
                  <div className="h-4 bg-gray-700 rounded w-36"></div>
                </div>
              </div>
              <div>
                <div className="h-5 bg-gray-700 rounded mb-4 w-20"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  if (!footerConfig || !footerConfig.isActive) {
    return null
  }

  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="max-width mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Company Info - Compact */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold">{footerConfig.companyName}</h3>
            <div className="flex flex-col md:flex-row items-center gap-2 mt-1 text-xs text-gray-400">
              {footerConfig.phone && (
                <a href={`tel:${footerConfig.phone}`} className="hover:text-white transition-colors">
                  {footerConfig.phone}
                </a>
              )}
              {footerConfig.email && (
                <a href={`mailto:${footerConfig.email}`} className="hover:text-white transition-colors">
                  {footerConfig.email}
                </a>
              )}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-gray-400">
              {footerConfig.copyrightText}
            </p>
          </div>

          {/* Social Links - Compact */}
          {footerConfig.socialLinks.some(link => link.isActive) && (
            <div className="flex gap-2">
              {footerConfig.socialLinks
                .filter(link => link.isActive && link.url)
                .map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
                    aria-label={`Suivez-nous sur ${social.platform}`}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
