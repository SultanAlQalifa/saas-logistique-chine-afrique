'use client'

import { MessageCircle } from 'lucide-react'

export function WhatsAppWidget() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+221776581741' // Numéro de téléphone NextMove
    const message = encodeURIComponent('Bonjour ! Je souhaite obtenir des informations sur vos services de logistique Chine-Afrique.')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
      title="Contacter sur WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
    </button>
  )
}
