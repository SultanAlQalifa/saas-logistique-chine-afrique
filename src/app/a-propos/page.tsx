'use client'

import Link from 'next/link'
import { ArrowLeft, Users, Globe, Shield, Award, Truck, Target } from 'lucide-react'

export default function AProposPage() {
  const stats = [
    { number: "10,000+", label: "Colis traités", icon: Truck },
    { number: "15", label: "Pays couverts", icon: Globe },
    { number: "500+", label: "Entreprises partenaires", icon: Users },
    { number: "99.2%", label: "Taux de satisfaction", icon: Award }
  ]

  const values = [
    {
      icon: Shield,
      title: "Sécurité",
      description: "Vos marchandises sont protégées à chaque étape du processus de livraison."
    },
    {
      icon: Target,
      title: "Fiabilité",
      description: "Des délais respectés et une traçabilité complète de vos envois."
    },
    {
      icon: Users,
      title: "Service Client",
      description: "Une équipe dédiée disponible 24/7 pour répondre à vos besoins."
    },
    {
      icon: Globe,
      title: "Couverture",
      description: "Un réseau étendu couvrant toute l'Afrique de l'Ouest et Centrale."
    }
  ]

  const team = [
    {
      name: "Cheikh Abdoul Khadre Djeylani DJITTE",
      role: "Fondateur & CEO",
      description: "Expert en logistique internationale avec 10+ ans d'expérience",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Aminata FALL",
      role: "Directrice Opérations",
      description: "Spécialiste des opérations Chine-Afrique depuis 8 ans",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Ibrahim TRAORE",
      role: "Directeur Technique",
      description: "Architecte de notre plateforme technologique innovante",
      image: "/api/placeholder/150/150"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            À <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Propos</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            NextMove Cargo révolutionne la logistique entre la Chine et l'Afrique avec une plateforme SaaS innovante
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Notre Mission</h2>
            <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
              Nous facilitons les échanges commerciaux entre la Chine et l'Afrique en offrant une plateforme 
              technologique de pointe qui simplifie la gestion logistique, améliore la traçabilité et 
              garantit la sécurité des marchandises. Notre objectif est de démocratiser l'accès au commerce 
              international pour les entreprises africaines de toutes tailles.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nos Chiffres</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nos Valeurs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Notre Équipe</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-blue-600 font-semibold mb-4">{member.role}</div>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Notre Histoire</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed mb-6 opacity-90">
              Fondée en 2023 à Dakar, NextMove Cargo est née de la vision de simplifier les échanges 
              commerciaux entre la Chine et l'Afrique. Constatant les défis logistiques auxquels 
              font face les entreprises africaines, nous avons développé une solution technologique 
              innovante.
            </p>
            <p className="text-lg leading-relaxed opacity-90">
              Aujourd'hui, nous sommes fiers de servir plus de 500 entreprises à travers 15 pays 
              africains, facilitant le commerce international et contribuant au développement 
              économique du continent.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Rejoignez-nous</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez comment NextMove Cargo peut transformer votre activité logistique
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Nous contacter
            </Link>
            <Link
              href="/tarifs"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Voir nos tarifs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
