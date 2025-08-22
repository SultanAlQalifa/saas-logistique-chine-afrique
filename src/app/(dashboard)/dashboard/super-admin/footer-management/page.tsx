'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  AlertTriangle
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
  isActive: true
}

export default function FooterManagementPage() {
  const { data: session } = useSession()
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(defaultFooterConfig)
  const [activeTab, setActiveTab] = useState<'general' | 'sections' | 'social'>('general')
  const [editingSection, setEditingSection] = useState<FooterSection | null>(null)
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Vérifier si l'utilisateur est SUPER_ADMIN
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN'

  // Si pas SUPER_ADMIN, afficher message d'accès refusé
  if (session && !isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            Cette page est réservée aux Super Administrateurs uniquement.
            <br />
            Contactez votre administrateur système pour plus d'informations.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Votre rôle actuel : <span className="font-medium">{session?.user?.role || 'Non défini'}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-4 w-4" />
      case 'twitter': return <Twitter className="h-4 w-4" />
      case 'instagram': return <Instagram className="h-4 w-4" />
      case 'linkedin': return <Linkedin className="h-4 w-4" />
      case 'youtube': return <Youtube className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/footer-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footerConfig)
      })
      
      if (response.ok) {
        alert('✅ Configuration du footer sauvegardée avec succès!')
      } else {
        throw new Error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      alert('❌ Erreur lors de la sauvegarde: ' + error)
    } finally {
      setIsSaving(false)
    }
  }

  const addSection = () => {
    const newSection: FooterSection = {
      id: Date.now().toString(),
      title: "Nouvelle Section",
      links: [],
      order: footerConfig.sections.length + 1
    }
    setFooterConfig(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
    setEditingSection(newSection)
    alert('✅ Nouvelle section ajoutée avec succès!')
  }

  const deleteSection = (sectionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette section?')) {
      setFooterConfig(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId)
      }))
      alert('🗑️ Section supprimée avec succès!')
    }
  }

  const addLink = (sectionId: string) => {
    const newLink: FooterLink = {
      id: Date.now().toString(),
      title: "Nouveau Lien",
      url: "/",
      order: 1
    }
    
    setFooterConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, links: [...section.links, newLink] }
          : section
      )
    }))
    setEditingLink(newLink)
    alert('✅ Nouveau lien ajouté avec succès!')
  }

  const deleteLink = (sectionId: string, linkId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lien?')) {
      setFooterConfig(prev => ({
        ...prev,
        sections: prev.sections.map(section => 
          section.id === sectionId 
            ? { ...section, links: section.links.filter(l => l.id !== linkId) }
            : section
        )
      }))
      alert('🗑️ Lien supprimé avec succès!')
    }
  }

  const updateSocialLink = (linkId: string, updates: Partial<SocialLink>) => {
    setFooterConfig(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => 
        link.id === linkId ? { ...link, ...updates } : link
      )
    }))
    if (updates.isActive !== undefined) {
      const status = updates.isActive ? 'activé' : 'désactivé'
      alert(`✅ Réseau social ${status} avec succès!`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Globe className="h-10 w-10" />
              🔧 Gestion du Footer
            </h1>
            <p className="text-purple-100 text-lg">
              Configurez le pied de page de la plateforme
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowPreview(!showPreview)
                // Scroll to preview section after a short delay
                if (!showPreview) {
                  setTimeout(() => {
                    const previewElement = document.getElementById('footer-preview')
                    if (previewElement) {
                      previewElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }, 100)
                }
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Masquer' : 'Aperçu'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'Informations Générales', icon: Globe },
              { id: 'sections', label: 'Sections & Liens', icon: Edit3 },
              { id: 'social', label: 'Réseaux Sociaux', icon: Facebook }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    value={footerConfig.companyName}
                    onChange={(e) => setFooterConfig(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="email"
                      value={footerConfig.email}
                      onChange={(e) => setFooterConfig(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="tel"
                      value={footerConfig.phone}
                      onChange={(e) => setFooterConfig(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                    <textarea
                      value={footerConfig.address}
                      onChange={(e) => setFooterConfig(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={footerConfig.description}
                  onChange={(e) => setFooterConfig(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte de copyright
                </label>
                <input
                  type="text"
                  value={footerConfig.copyrightText}
                  onChange={(e) => setFooterConfig(prev => ({ ...prev, copyrightText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={footerConfig.isActive}
                  onChange={(e) => setFooterConfig(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Afficher le footer sur la plateforme
                </label>
              </div>
            </div>
          )}

          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Sections du Footer</h3>
                <button
                  onClick={addSection}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une section
                </button>
              </div>

              <div className="space-y-4">
                {footerConfig.sections.map((section) => (
                  <div key={section.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingSection(section)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      {section.links.map((link) => (
                        <div key={link.id} className="flex justify-between items-center bg-white p-2 rounded">
                          <div>
                            <span className="font-medium">{link.title}</span>
                            <span className="text-gray-500 text-sm ml-2">({link.url})</span>
                          </div>
                          <button
                            onClick={() => deleteLink(section.id, link.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => addLink(section.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Ajouter un lien
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Réseaux Sociaux</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {footerConfig.socialLinks.map((social) => (
                  <div key={social.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {getSocialIcon(social.platform)}
                      <span className="font-medium capitalize">{social.platform}</span>
                      <div className="ml-auto">
                        <input
                          type="checkbox"
                          checked={social.isActive}
                          onChange={(e) => updateSocialLink(social.id, { isActive: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => updateSocialLink(social.id, { url: e.target.value })}
                      placeholder={`URL ${social.platform}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div id="footer-preview" className="bg-white rounded-xl shadow-lg border border-gray-200 animate-in slide-in-from-top-4 duration-300">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Aperçu du Footer
            </h3>
            <p className="text-sm text-gray-600 mt-1">Voici comment le footer apparaîtra sur la plateforme</p>
          </div>
          <div className="p-6">
            <div className="bg-gray-900 text-white p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold mb-4">{footerConfig.companyName}</h3>
                  <p className="text-gray-300 mb-4">{footerConfig.description}</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {footerConfig.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {footerConfig.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {footerConfig.email}
                    </div>
                  </div>
                </div>

                {/* Sections */}
                {footerConfig.sections.map((section) => (
                  <div key={section.id}>
                    <h4 className="font-semibold mb-4">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.id}>
                          <a href={link.url} className="text-gray-300 hover:text-white text-sm transition-colors">
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-700 mt-8 pt-8 flex justify-between items-center">
                <p className="text-gray-300 text-sm">{footerConfig.copyrightText}</p>
                <div className="flex gap-4">
                  {footerConfig.socialLinks.filter(s => s.isActive).map((social) => (
                    <a key={social.id} href={social.url} className="text-gray-300 hover:text-white transition-colors">
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
