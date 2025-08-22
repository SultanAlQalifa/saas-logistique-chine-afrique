'use client'

import { Plus, Trash2 } from 'lucide-react'

interface BodyContent {
  hero: {
    title: string
    subtitle: string
    ctaText: string
    ctaUrl: string
    backgroundImage: string
    showVideo: boolean
    videoUrl: string
  }
  features: Array<{
    icon: string
    title: string
    description: string
  }>
  stats: Array<{
    number: string
    label: string
    icon: string
  }>
  testimonials: Array<{
    name: string
    company: string
    text: string
    rating: number
    avatar: string
  }>
  cta: {
    title: string
    subtitle: string
    buttonText: string
    buttonUrl: string
    backgroundColor: string
    textColor: string
  }
}

interface BodyTabProps {
  bodyContent: BodyContent
  setBodyContent: (content: BodyContent | ((prev: BodyContent) => BodyContent)) => void
}

export default function BodyTab({ bodyContent, setBodyContent }: BodyTabProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Section Hero</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre principal</label>
            <input
              type="text"
              value={bodyContent.hero.title}
              onChange={(e) => setBodyContent(prev => ({
                ...prev,
                hero: { ...prev.hero, title: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
            <textarea
              value={bodyContent.hero.subtitle}
              onChange={(e) => setBodyContent(prev => ({
                ...prev,
                hero: { ...prev.hero, subtitle: e.target.value }
              }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Texte bouton CTA</label>
              <input
                type="text"
                value={bodyContent.hero.ctaText}
                onChange={(e) => setBodyContent(prev => ({
                  ...prev,
                  hero: { ...prev.hero, ctaText: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL bouton CTA</label>
              <input
                type="text"
                value={bodyContent.hero.ctaUrl}
                onChange={(e) => setBodyContent(prev => ({
                  ...prev,
                  hero: { ...prev.hero, ctaUrl: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">✨ Fonctionnalités</h3>
          <button
            onClick={() => setBodyContent(prev => ({
              ...prev,
              features: [...prev.features, { icon: '🔥', title: '', description: '' }]
            }))}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {bodyContent.features.map((feature, index) => (
            <div key={index} className="grid grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
                <input
                  type="text"
                  value={feature.icon}
                  onChange={(e) => {
                    const newFeatures = [...bodyContent.features]
                    newFeatures[index].icon = e.target.value
                    setBodyContent(prev => ({ ...prev, features: newFeatures }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => {
                    const newFeatures = [...bodyContent.features]
                    newFeatures[index].title = e.target.value
                    setBodyContent(prev => ({ ...prev, features: newFeatures }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={feature.description}
                  onChange={(e) => {
                    const newFeatures = [...bodyContent.features]
                    newFeatures[index].description = e.target.value
                    setBodyContent(prev => ({ ...prev, features: newFeatures }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => setBodyContent(prev => ({
                  ...prev,
                  features: prev.features.filter((_, i) => i !== index)
                }))}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📊 Statistiques</h3>
          <button
            onClick={() => setBodyContent(prev => ({
              ...prev,
              stats: [...prev.stats, { number: '', label: '', icon: '📈' }]
            }))}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {bodyContent.stats.map((stat, index) => (
            <div key={index} className="grid grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
                <input
                  type="text"
                  value={stat.icon}
                  onChange={(e) => {
                    const newStats = [...bodyContent.stats]
                    newStats[index].icon = e.target.value
                    setBodyContent(prev => ({ ...prev, stats: newStats }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={stat.number}
                  onChange={(e) => {
                    const newStats = [...bodyContent.stats]
                    newStats[index].number = e.target.value
                    setBodyContent(prev => ({ ...prev, stats: newStats }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...bodyContent.stats]
                    newStats[index].label = e.target.value
                    setBodyContent(prev => ({ ...prev, stats: newStats }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => setBodyContent(prev => ({
                  ...prev,
                  stats: prev.stats.filter((_, i) => i !== index)
                }))}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">💬 Témoignages</h3>
          <button
            onClick={() => setBodyContent(prev => ({
              ...prev,
              testimonials: [...prev.testimonials, { name: '', company: '', text: '', rating: 5, avatar: '' }]
            }))}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {bodyContent.testimonials.map((testimonial, index) => (
            <div key={index} className="grid grid-cols-6 gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) => {
                    const newTestimonials = [...bodyContent.testimonials]
                    newTestimonials[index].name = e.target.value
                    setBodyContent(prev => ({ ...prev, testimonials: newTestimonials }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                <input
                  type="text"
                  value={testimonial.company}
                  onChange={(e) => {
                    const newTestimonials = [...bodyContent.testimonials]
                    newTestimonials[index].company = e.target.value
                    setBodyContent(prev => ({ ...prev, testimonials: newTestimonials }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Témoignage</label>
                <input
                  type="text"
                  value={testimonial.text}
                  onChange={(e) => {
                    const newTestimonials = [...bodyContent.testimonials]
                    newTestimonials[index].text = e.target.value
                    setBodyContent(prev => ({ ...prev, testimonials: newTestimonials }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <select
                  value={testimonial.rating}
                  onChange={(e) => {
                    const newTestimonials = [...bodyContent.testimonials]
                    newTestimonials[index].rating = parseInt(e.target.value)
                    setBodyContent(prev => ({ ...prev, testimonials: newTestimonials }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐</option>
                  <option value={4}>⭐⭐⭐⭐</option>
                  <option value={3}>⭐⭐⭐</option>
                  <option value={2}>⭐⭐</option>
                  <option value={1}>⭐</option>
                </select>
              </div>
              <button
                onClick={() => setBodyContent(prev => ({
                  ...prev,
                  testimonials: prev.testimonials.filter((_, i) => i !== index)
                }))}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Section Call-to-Action</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
              <input
                type="text"
                value={bodyContent.cta.title}
                onChange={(e) => setBodyContent(prev => ({
                  ...prev,
                  cta: { ...prev.cta, title: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
              <input
                type="text"
                value={bodyContent.cta.subtitle}
                onChange={(e) => setBodyContent(prev => ({
                  ...prev,
                  cta: { ...prev.cta, subtitle: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Texte du bouton</label>
              <input
                type="text"
                value={bodyContent.cta.buttonText}
                onChange={(e) => setBodyContent(prev => ({
                  ...prev,
                  cta: { ...prev.cta, buttonText: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL du bouton</label>
              <input
                type="text"
                value={bodyContent.cta.buttonUrl}
                onChange={(e) => setBodyContent(prev => ({
                  ...prev,
                  cta: { ...prev.cta, buttonUrl: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur de fond</label>
              <input
                type="color"
                value={bodyContent.cta.backgroundColor}
                onChange={(e) => setBodyContent(prev => ({
                  ...prev,
                  cta: { ...prev.cta, backgroundColor: e.target.value }
                }))}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur du texte</label>
              <input
                type="color"
                value={bodyContent.cta.textColor}
                onChange={(e) => setBodyContent(prev => ({
                  ...prev,
                  cta: { ...prev.cta, textColor: e.target.value }
                }))}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
