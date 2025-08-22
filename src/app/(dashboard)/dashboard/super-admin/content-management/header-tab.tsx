'use client'

import { Plus, Trash2 } from 'lucide-react'

interface HeaderContent {
  logo: {
    text: string
    imageUrl: string
    showImage: boolean
    showText: boolean
  }
  navigation: Array<{
    title: string
    url: string
    active: boolean
  }>
  ctaButton: {
    text: string
    url: string
    style: string
    active: boolean
  }
  announcement: {
    text: string
    url: string
    active: boolean
    backgroundColor: string
    textColor: string
  }
}

interface HeaderTabProps {
  headerContent: HeaderContent
  setHeaderContent: (content: HeaderContent | ((prev: HeaderContent) => HeaderContent)) => void
}

export default function HeaderTab({ headerContent, setHeaderContent }: HeaderTabProps) {
  return (
    <div className="space-y-8">
      {/* Logo Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Logo</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Texte du logo</label>
              <input
                type="text"
                value={headerContent.logo.text}
                onChange={(e) => setHeaderContent(prev => ({
                  ...prev,
                  logo: { ...prev.logo, text: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL de l'image</label>
              <input
                type="text"
                value={headerContent.logo.imageUrl}
                onChange={(e) => setHeaderContent(prev => ({
                  ...prev,
                  logo: { ...prev.logo, imageUrl: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={headerContent.logo.showImage}
                onChange={(e) => setHeaderContent(prev => ({
                  ...prev,
                  logo: { ...prev.logo, showImage: e.target.checked }
                }))}
                className="mr-2"
              />
              Afficher l'image
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={headerContent.logo.showText}
                onChange={(e) => setHeaderContent(prev => ({
                  ...prev,
                  logo: { ...prev.logo, showText: e.target.checked }
                }))}
                className="mr-2"
              />
              Afficher le texte
            </label>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🧭 Navigation</h3>
          <button
            onClick={() => setHeaderContent(prev => ({
              ...prev,
              navigation: [...prev.navigation, { title: '', url: '', active: true }]
            }))}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {headerContent.navigation.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 items-center">
              <input
                type="text"
                placeholder="Titre"
                value={item.title}
                onChange={(e) => {
                  const newNav = [...headerContent.navigation]
                  newNav[index].title = e.target.value
                  setHeaderContent(prev => ({ ...prev, navigation: newNav }))
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="URL"
                value={item.url}
                onChange={(e) => {
                  const newNav = [...headerContent.navigation]
                  newNav[index].url = e.target.value
                  setHeaderContent(prev => ({ ...prev, navigation: newNav }))
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={(e) => {
                    const newNav = [...headerContent.navigation]
                    newNav[index].active = e.target.checked
                    setHeaderContent(prev => ({ ...prev, navigation: newNav }))
                  }}
                  className="mr-2"
                />
                Actif
              </label>
              <button
                onClick={() => setHeaderContent(prev => ({
                  ...prev,
                  navigation: prev.navigation.filter((_, i) => i !== index)
                }))}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔘 Bouton d'Action</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Texte</label>
            <input
              type="text"
              value={headerContent.ctaButton.text}
              onChange={(e) => setHeaderContent(prev => ({
                ...prev,
                ctaButton: { ...prev.ctaButton, text: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input
              type="text"
              value={headerContent.ctaButton.url}
              onChange={(e) => setHeaderContent(prev => ({
                ...prev,
                ctaButton: { ...prev.ctaButton, url: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={headerContent.ctaButton.active}
                onChange={(e) => setHeaderContent(prev => ({
                  ...prev,
                  ctaButton: { ...prev.ctaButton, active: e.target.checked }
                }))}
                className="mr-2"
              />
              Afficher
            </label>
          </div>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📢 Barre d'Annonce</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Texte</label>
              <input
                type="text"
                value={headerContent.announcement.text}
                onChange={(e) => setHeaderContent(prev => ({
                  ...prev,
                  announcement: { ...prev.announcement, text: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="text"
                value={headerContent.announcement.url}
                onChange={(e) => setHeaderContent(prev => ({
                  ...prev,
                  announcement: { ...prev.announcement, url: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur de fond</label>
              <input
                type="color"
                value={headerContent.announcement.backgroundColor}
                onChange={(e) => setHeaderContent(prev => ({
                  ...prev,
                  announcement: { ...prev.announcement, backgroundColor: e.target.value }
                }))}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur du texte</label>
              <input
                type="color"
                value={headerContent.announcement.textColor}
                onChange={(e) => setHeaderContent(prev => ({
                  ...prev,
                  announcement: { ...prev.announcement, textColor: e.target.value }
                }))}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={headerContent.announcement.active}
                  onChange={(e) => setHeaderContent(prev => ({
                    ...prev,
                    announcement: { ...prev.announcement, active: e.target.checked }
                  }))}
                  className="mr-2"
                />
                Afficher
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
