import { Plus, Trash2 } from 'lucide-react'

interface FooterTabProps {
  footerContent: {
    companyInfo: {
      name: string
      description: string
      address: string
      phone: string
      email: string
    }
    quickLinks: Array<{ title: string; url: string }>
    services: Array<{ title: string; url: string }>
    socialLinks: Array<{ platform: string; url: string; icon: string }>
    legalLinks: Array<{ title: string; url: string }>
    copyright: string
  }
  setFooterContent: (updater: (prev: any) => any) => void
}

export default function FooterTab({ footerContent, setFooterContent }: FooterTabProps) {
  return (
    <div className="space-y-8">
      {/* Company Info */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏢 Informations Entreprise</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
            <input
              type="text"
              value={footerContent.companyInfo.name}
              onChange={(e) => setFooterContent(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, name: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={footerContent.companyInfo.description}
              onChange={(e) => setFooterContent(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, description: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <input
              type="text"
              value={footerContent.companyInfo.address}
              onChange={(e) => setFooterContent(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, address: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input
              type="text"
              value={footerContent.companyInfo.phone}
              onChange={(e) => setFooterContent(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, phone: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={footerContent.companyInfo.email}
              onChange={(e) => setFooterContent(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, email: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🔗 Liens Rapides</h3>
          <button
            onClick={() => setFooterContent(prev => ({
              ...prev,
              quickLinks: [...prev.quickLinks, { title: '', url: '' }]
            }))}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {footerContent.quickLinks.map((link, index) => (
            <div key={index} className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => {
                    const newLinks = [...footerContent.quickLinks]
                    newLinks[index].title = e.target.value
                    setFooterContent(prev => ({ ...prev, quickLinks: newLinks }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...footerContent.quickLinks]
                    newLinks[index].url = e.target.value
                    setFooterContent(prev => ({ ...prev, quickLinks: newLinks }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => setFooterContent(prev => ({
                  ...prev,
                  quickLinks: prev.quickLinks.filter((_: any, i: number) => i !== index)
                }))}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🚚 Services</h3>
          <button
            onClick={() => setFooterContent(prev => ({
              ...prev,
              services: [...prev.services, { title: '', url: '' }]
            }))}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {footerContent.services.map((service, index) => (
            <div key={index} className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <input
                  type="text"
                  value={service.title}
                  onChange={(e) => {
                    const newServices = [...footerContent.services]
                    newServices[index].title = e.target.value
                    setFooterContent(prev => ({ ...prev, services: newServices }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={service.url}
                  onChange={(e) => {
                    const newServices = [...footerContent.services]
                    newServices[index].url = e.target.value
                    setFooterContent(prev => ({ ...prev, services: newServices }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => setFooterContent(prev => ({
                  ...prev,
                  services: prev.services.filter((_: any, i: number) => i !== index)
                }))}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📱 Réseaux Sociaux</h3>
          <button
            onClick={() => setFooterContent(prev => ({
              ...prev,
              socialLinks: [...prev.socialLinks, { platform: '', url: '', icon: '' }]
            }))}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {footerContent.socialLinks.map((social, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plateforme</label>
                <input
                  type="text"
                  value={social.platform}
                  onChange={(e) => {
                    const newSocials = [...footerContent.socialLinks]
                    newSocials[index].platform = e.target.value
                    setFooterContent(prev => ({ ...prev, socialLinks: newSocials }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={social.url}
                  onChange={(e) => {
                    const newSocials = [...footerContent.socialLinks]
                    newSocials[index].url = e.target.value
                    setFooterContent(prev => ({ ...prev, socialLinks: newSocials }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
                <input
                  type="text"
                  value={social.icon}
                  onChange={(e) => {
                    const newSocials = [...footerContent.socialLinks]
                    newSocials[index].icon = e.target.value
                    setFooterContent(prev => ({ ...prev, socialLinks: newSocials }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => setFooterContent(prev => ({
                  ...prev,
                  socialLinks: prev.socialLinks.filter((_: any, i: number) => i !== index)
                }))}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Links */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">⚖️ Liens Légaux</h3>
          <button
            onClick={() => setFooterContent(prev => ({
              ...prev,
              legalLinks: [...prev.legalLinks, { title: '', url: '' }]
            }))}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {footerContent.legalLinks.map((legal, index) => (
            <div key={index} className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={legal.title}
                  onChange={(e) => {
                    const newLegals = [...footerContent.legalLinks]
                    newLegals[index].title = e.target.value
                    setFooterContent(prev => ({ ...prev, legalLinks: newLegals }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={legal.url}
                  onChange={(e) => {
                    const newLegals = [...footerContent.legalLinks]
                    newLegals[index].url = e.target.value
                    setFooterContent(prev => ({ ...prev, legalLinks: newLegals }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => setFooterContent(prev => ({
                  ...prev,
                  legalLinks: prev.legalLinks.filter((_: any, i: number) => i !== index)
                }))}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">© Copyright</h3>
        <input
          type="text"
          value={footerContent.copyright}
          onChange={(e) => setFooterContent(prev => ({ ...prev, copyright: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="© 2024 NextMove Cargo. Tous droits réservés."
        />
      </div>
    </div>
  )
}
