'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

interface AIOnlyChatWidgetProps {
  onAIChat?: () => void
  position?: 'center' | 'left' | 'right'
  size?: 'small' | 'medium' | 'large'
}

export function AIOnlyChatWidget({ 
  onAIChat,
  position = 'center',
  size = 'medium'
}: AIOnlyChatWidgetProps) {
  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4', 
    large: 'p-5'
  }

  const iconSizes = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-10 w-10'
  }

  const positionClasses = {
    center: 'justify-center',
    left: 'justify-start',
    right: 'justify-end'
  }

  const handleAIChat = () => {
    if (onAIChat) {
      onAIChat()
    } else {
      // Action par défaut - ouvrir l'assistant IA
      console.log('Ouverture assistant IA')
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative group">
        {/* Bouton Assistant IA uniquement */}
        <button
          onClick={handleAIChat}
          className={`bg-gradient-to-r from-blue-500 to-blue-600 ${sizeClasses[size]} rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-50`}
          title="Parler avec l'Assistant IA"
        >
          <MessageCircle className={`${iconSizes[size]} text-white`} />
        </button>
        
        {/* Tooltip au survol */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            💬 Assistant IA - Disponible 24/7
          </div>
          <div className="absolute top-full right-4 -mt-1">
            <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
