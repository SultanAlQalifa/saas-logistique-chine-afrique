'use client'

import Link from 'next/link'
import { ArrowLeft, Check, Star, Truck, Ship, Plane } from 'lucide-react'

export default function TarifsPage() {
  const plans = [
    {
      name: "Starter",
      price: "25,000",
      period: "/mois",
      description: "Parfait pour les petites entreprises",
      features: [
        "Jusqu'à 50 colis/mois",
        "Suivi en temps réel",
        "Support par email",
        "1 utilisateur",
        "Rapports de base"
      ],
      popular: false,
      color: "blue"
    },
    {
      name: "Professional",
      price: "75,000",
      period: "/mois",
      description: "Idéal pour les entreprises en croissance",
      features: [
        "Jusqu'à 200 colis/mois",
        "Suivi avancé + notifications",
        "Support prioritaire 24/7",
        "5 utilisateurs",
        "Rapports détaillés",
        "API access",
        "Intégrations e-commerce"
      ],
      popular: true,
      color: "purple"
    },
    {
      name: "Enterprise",
      price: "150,000",
      period: "/mois",
      description: "Pour les grandes entreprises",
      features: [
        "Colis illimités",
        "Suivi personnalisé",
        "Support dédié",
        "Utilisateurs illimités",
        "Analytics avancés",
        "API complète",
        "Intégrations sur mesure",
        "Formation équipe"
      ],
      popular: false,
      color: "emerald"
    }
  ]

  const services = [
    {
      icon: Truck,
      title: "Transport Terrestre",
      price: "2,500 FCFA/kg",
      description: "Livraison par camion, délai 15-20 jours"
    },
    {
      icon: Ship,
      title: "Transport Maritime",
      price: "1,200 FCFA/kg",
      description: "Fret maritime, délai 25-35 jours"
    },
    {
      icon: Plane,
      title: "Transport Aérien",
      price: "8,500 FCFA/kg",
      description: "Livraison express, délai 3-7 jours"
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
            Nos <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tarifs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des solutions adaptées à tous les besoins, de la startup à la grande entreprise
          </p>
        </div>

        {/* Plans d'abonnement */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Plans d'Abonnement</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-purple-500 scale-105' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Plus Populaire
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">FCFA{plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    Choisir ce plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services de transport */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Tarifs Transport</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <service.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <div className="text-2xl font-bold text-blue-600 mb-4">{service.price}</div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contactez-nous pour un devis personnalisé adapté à vos besoins
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Demander un devis
            </Link>
            <Link
              href="/"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
