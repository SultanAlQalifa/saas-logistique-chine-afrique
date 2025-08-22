'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Save, 
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react'
import FooterTab from './footer-tab'
import HeaderTab from './header-tab'
import BodyTab from './body-tab'

export default function ContentManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'header' | 'body' | 'footer'>('about')
  const [saving, setSaving] = useState(false)

  // About page content
  const [aboutContent, setAboutContent] = useState({
    heroTitle: 'À Propos',
    heroSubtitle: 'NextMove Cargo révolutionne la logistique entre la Chine et l\'Afrique avec une plateforme SaaS innovante',
    mission: 'Nous facilitons les échanges commerciaux entre la Chine et l\'Afrique en offrant une plateforme technologique de pointe qui simplifie la gestion logistique, améliore la traçabilité et garantit la sécurité des marchandises.',
    story: 'Fondée en 2023 à Dakar, NextMove Cargo est née de la vision de simplifier les échanges commerciaux entre la Chine et l\'Afrique.',
    stats: [
      { number: '10,000+', label: 'Colis traités' },
      { number: '15', label: 'Pays couverts' },
      { number: '500+', label: 'Entreprises partenaires' },
      { number: '99.2%', label: 'Taux de satisfaction' }
    ],
    team: [
      { name: 'Cheikh Abdoul Khadre Djeylani DJITTE', role: 'Fondateur & CEO', description: 'Expert en logistique internationale avec 10+ ans d\'expérience' },
      { name: 'Aminata FALL', role: 'Directrice Opérations', description: 'Spécialiste des opérations Chine-Afrique depuis 8 ans' }
    ]
  })

  // Contact page content
  const [contactContent, setContactContent] = useState({
    heroTitle: 'Nous Contacter',
    heroSubtitle: 'Notre équipe est là pour répondre à toutes vos questions et vous accompagner dans vos projets logistiques',
    contactInfo: [
      { title: 'Adresse', content: 'Dakar, Sénégal\nZone industrielle de Pikine' },
      { title: 'Téléphone', content: '+221 77 658 17 41\n+221 33 123 45 67' },
      { title: 'Email', content: 'contact@nextmove.com\nsupport@nextmove.com' }
    ],
    offices: [
      { city: 'Dakar', country: 'Sénégal', address: 'Zone industrielle de Pikine', phone: '+221 77 658 17 41', email: 'dakar@nextmove.com' },
      { city: 'Abidjan', country: 'Côte d\'Ivoire', address: 'Zone portuaire d\'Abidjan', phone: '+225 07 123 456', email: 'abidjan@nextmove.com' }
    ]
  })

  // Header content
  const [headerContent, setHeaderContent] = useState({
    logo: {
      text: 'NextMove Cargo',
      imageUrl: '/logo-nextmove-new.svg',
      showImage: true,
      showText: true
    },
    navigation: [
      { title: 'Accueil', url: '/', active: true },
      { title: 'Services', url: '/tarifs', active: true },
      { title: 'Suivi', url: '/track', active: true },
      { title: 'À propos', url: '/a-propos', active: true },
      { title: 'Contact', url: '/contact', active: true },
      { title: 'Blog', url: '/blog', active: false }
    ],
    ctaButton: {
      text: 'Connexion',
      url: '/auth/signin',
      style: 'primary',
      active: true
    },
    announcement: {
      text: '🎉 Nouveau: Suivi en temps réel disponible!',
      url: '/track',
      active: false,
      backgroundColor: '#10B981',
      textColor: '#FFFFFF'
    }
  })

  // Body/Homepage content
  const [bodyContent, setBodyContent] = useState({
    hero: {
      title: 'Votre Partenaire Logistique Chine-Afrique',
      subtitle: 'Simplifiez vos expéditions avec notre plateforme SaaS innovante. Suivi en temps réel, tarifs transparents, livraison sécurisée.',
      ctaText: 'Commencer maintenant',
      ctaUrl: '/auth/signin',
      backgroundImage: '/hero-bg.jpg',
      showVideo: false,
      videoUrl: ''
    },
    features: [
      {
        icon: '🚢',
        title: 'Fret Maritime & Aérien',
        description: 'Solutions complètes pour tous vos besoins de transport entre la Chine et l\'Afrique'
      },
      {
        icon: '📦',
        title: 'Suivi en Temps Réel',
        description: 'Suivez vos colis à chaque étape avec notre système de tracking avancé'
      },
      {
        icon: '💰',
        title: 'Tarifs Transparents',
        description: 'Calculez instantanément le coût de vos expéditions avec notre outil de tarification'
      },
      {
        icon: '🛡️',
        title: 'Sécurité Garantie',
        description: 'Vos marchandises sont protégées par notre assurance complète'
      }
    ],
    stats: [
      { number: '10,000+', label: 'Colis livrés', icon: '📦' },
      { number: '15', label: 'Pays couverts', icon: '🌍' },
      { number: '500+', label: 'Clients satisfaits', icon: '😊' },
      { number: '99.2%', label: 'Taux de réussite', icon: '✅' }
    ],
    testimonials: [
      {
        name: 'Amadou Diallo',
        company: 'Import Export Sahel',
        text: 'NextMove Cargo a révolutionné notre façon de gérer nos importations. Service exceptionnel!',
        rating: 5,
        avatar: '/avatars/amadou.jpg'
      },
      {
        name: 'Fatou Sow',
        company: 'Boutique Moderne',
        text: 'Rapidité, transparence et professionnalisme. Je recommande vivement!',
        rating: 5,
        avatar: '/avatars/fatou.jpg'
      }
    ],
    cta: {
      title: 'Prêt à simplifier vos expéditions?',
      subtitle: 'Rejoignez des centaines d\'entreprises qui nous font confiance',
      buttonText: 'Commencer gratuitement',
      buttonUrl: '/auth/signin',
      backgroundColor: '#6366F1',
      textColor: '#FFFFFF'
    }
  })

  // Footer content
  const [footerContent, setFooterContent] = useState({
    companyInfo: {
      name: 'NextMove Cargo',
      description: 'Votre partenaire de confiance pour la logistique Chine-Afrique',
      address: 'Dakar, Sénégal',
      phone: '+221 77 658 17 41',
      email: 'contact@nextmove.com'
    },
    quickLinks: [
      { title: 'À propos', url: '/a-propos' },
      { title: 'Services', url: '/tarifs' },
      { title: 'Suivi', url: '/track' },
      { title: 'Contact', url: '/contact' }
    ],
    services: [
      { title: 'Fret Maritime', url: '/tarifs' },
      { title: 'Fret Aérien', url: '/tarifs' },
      { title: 'Transport Routier', url: '/tarifs' },
      { title: 'Dédouanement', url: '/tarifs' }
    ],
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/nextmovecargo', icon: 'facebook' },
      { platform: 'Twitter', url: 'https://twitter.com/nextmovecargo', icon: 'twitter' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/nextmovecargo', icon: 'linkedin' },
      { platform: 'WhatsApp', url: 'https://wa.me/221776581741', icon: 'whatsapp' }
    ],
    legalLinks: [
      { title: 'Mentions légales', url: '/mentions-legales' },
      { title: 'Politique de confidentialité', url: '/confidentialite' },
      { title: 'CGV', url: '/cgv' },
      { title: 'CGU', url: '/cgu' }
    ],
    copyright: '© 2024 NextMove Cargo. Tous droits réservés.'
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const tabNames = {
        about: 'À propos',
        contact: 'Contact',
        header: 'Header',
        body: 'Page d\'accueil',
        footer: 'Footer'
      }
      alert(`✅ Contenu "${tabNames[activeTab]}" sauvegardé avec succès!`)
    } catch (error) {
      alert('❌ Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading') {
    return <div className="p-6"><div className="animate-pulse h-8 bg-gray-200 rounded w-1/4"></div></div>
  }

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚫 Accès Restreint</h2>
          <p className="text-gray-600">Cette page est réservée aux super administrateurs.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <FileText className="h-10 w-10" />
              📝 Gestion de Contenu
            </h1>
            <p className="text-purple-100 text-lg">
              Modifiez facilement le contenu du Header, Body, Footer et pages statiques
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/a-propos"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Voir À propos
            </a>
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Voir Contact
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Voir Footer
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📄 Page "À propos"
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contact'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📞 Page "Contact"
            </button>
            <button
              onClick={() => setActiveTab('header')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'header'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔝 Header
            </button>
            <button
              onClick={() => setActiveTab('body')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'body'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏠 Page d'accueil
            </button>
            <button
              onClick={() => setActiveTab('footer')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'footer'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🦶 Footer
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'about' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Section Hero</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre principal</label>
                    <input
                      type="text"
                      value={aboutContent.heroTitle}
                      onChange={(e) => setAboutContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
                    <textarea
                      value={aboutContent.heroSubtitle}
                      onChange={(e) => setAboutContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Mission */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Mission</h3>
                <textarea
                  value={aboutContent.mission}
                  onChange={(e) => setAboutContent(prev => ({ ...prev, mission: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Story */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Notre Histoire</h3>
                <textarea
                  value={aboutContent.story}
                  onChange={(e) => setAboutContent(prev => ({ ...prev, story: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">📊 Statistiques</h3>
                  <button
                    onClick={() => setAboutContent(prev => ({
                      ...prev,
                      stats: [...prev.stats, { number: '', label: '' }]
                    }))}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </button>
                </div>
                <div className="space-y-4">
                  {aboutContent.stats.map((stat, index) => (
                    <div key={index} className="grid grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                          type="text"
                          value={stat.number}
                          onChange={(e) => {
                            const newStats = [...aboutContent.stats]
                            newStats[index].number = e.target.value
                            setAboutContent(prev => ({ ...prev, stats: newStats }))
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
                            const newStats = [...aboutContent.stats]
                            newStats[index].label = e.target.value
                            setAboutContent(prev => ({ ...prev, stats: newStats }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <button
                        onClick={() => setAboutContent(prev => ({
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

              {/* Team */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">👥 Équipe</h3>
                  <button
                    onClick={() => setAboutContent(prev => ({
                      ...prev,
                      team: [...prev.team, { name: '', role: '', description: '' }]
                    }))}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </button>
                </div>
                <div className="space-y-4">
                  {aboutContent.team.map((member, index) => (
                    <div key={index} className="grid grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => {
                            const newTeam = [...aboutContent.team]
                            newTeam[index].name = e.target.value
                            setAboutContent(prev => ({ ...prev, team: newTeam }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => {
                            const newTeam = [...aboutContent.team]
                            newTeam[index].role = e.target.value
                            setAboutContent(prev => ({ ...prev, team: newTeam }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={member.description}
                          onChange={(e) => {
                            const newTeam = [...aboutContent.team]
                            newTeam[index].description = e.target.value
                            setAboutContent(prev => ({ ...prev, team: newTeam }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <button
                        onClick={() => setAboutContent(prev => ({
                          ...prev,
                          team: prev.team.filter((_, i) => i !== index)
                        }))}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Section Hero</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre principal</label>
                    <input
                      type="text"
                      value={contactContent.heroTitle}
                      onChange={(e) => setContactContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre</label>
                    <textarea
                      value={contactContent.heroSubtitle}
                      onChange={(e) => setContactContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📞 Informations de Contact</h3>
                <div className="space-y-4">
                  {contactContent.contactInfo.map((info, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                          type="text"
                          value={info.title}
                          onChange={(e) => {
                            const newInfo = [...contactContent.contactInfo]
                            newInfo[index].title = e.target.value
                            setContactContent(prev => ({ ...prev, contactInfo: newInfo }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                        <textarea
                          value={info.content}
                          onChange={(e) => {
                            const newInfo = [...contactContent.contactInfo]
                            newInfo[index].content = e.target.value
                            setContactContent(prev => ({ ...prev, contactInfo: newInfo }))
                          }}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offices */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">🏢 Bureaux</h3>
                  <button
                    onClick={() => setContactContent(prev => ({
                      ...prev,
                      offices: [...prev.offices, { city: '', country: '', address: '', phone: '', email: '' }]
                    }))}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </button>
                </div>
                <div className="space-y-4">
                  {contactContent.offices.map((office, index) => (
                    <div key={index} className="grid grid-cols-6 gap-3 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                        <input
                          type="text"
                          value={office.city}
                          onChange={(e) => {
                            const newOffices = [...contactContent.offices]
                            newOffices[index].city = e.target.value
                            setContactContent(prev => ({ ...prev, offices: newOffices }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                        <input
                          type="text"
                          value={office.country}
                          onChange={(e) => {
                            const newOffices = [...contactContent.offices]
                            newOffices[index].country = e.target.value
                            setContactContent(prev => ({ ...prev, offices: newOffices }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                        <input
                          type="text"
                          value={office.address}
                          onChange={(e) => {
                            const newOffices = [...contactContent.offices]
                            newOffices[index].address = e.target.value
                            setContactContent(prev => ({ ...prev, offices: newOffices }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                          type="text"
                          value={office.phone}
                          onChange={(e) => {
                            const newOffices = [...contactContent.offices]
                            newOffices[index].phone = e.target.value
                            setContactContent(prev => ({ ...prev, offices: newOffices }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={office.email}
                          onChange={(e) => {
                            const newOffices = [...contactContent.offices]
                            newOffices[index].email = e.target.value
                            setContactContent(prev => ({ ...prev, offices: newOffices }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <button
                        onClick={() => setContactContent(prev => ({
                          ...prev,
                          offices: prev.offices.filter((_, i) => i !== index)
                        }))}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'header' && (
            <HeaderTab 
              headerContent={headerContent}
              setHeaderContent={setHeaderContent}
            />
          )}

          {activeTab === 'body' && (
            <BodyTab 
              bodyContent={bodyContent}
              setBodyContent={setBodyContent}
            />
          )}

          {activeTab === 'footer' && (
            <FooterTab 
              footerContent={footerContent}
              setFooterContent={setFooterContent}
            />
          )}

          <div className="flex justify-end pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
