'use client'

import { useState } from 'react'
import { Bot, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react'
import NextMoveAIChat from '../ai/NextMoveAIChat'

interface AIAgentWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'small' | 'medium' | 'large'
}

export function AIAgentWidget({ 
  position = 'bottom-right',
  size = 'medium'
}: AIAgentWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14', 
    large: 'w-16 h-16'
  }

  const iconSizes = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const chatPositionClasses = {
    'bottom-right': 'bottom-24 right-6',
    'bottom-left': 'bottom-24 left-6',
    'top-right': 'top-24 right-6',
    'top-left': 'top-24 left-6'
  }

  if (!isOpen) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <div className="relative">
          {/* Main Button */}
          <button
            onClick={() => setIsOpen(true)}
            className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group`}
            title="Ouvrir l'Agent IA"
          >
            <Bot className={`${iconSizes[size]}`} />
          </button>
          
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              🤖 Agent IA - Disponible 24/7
            </div>
            <div className="absolute top-full right-4 -mt-1">
              <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Chat Window */}
      <div className={`fixed ${chatPositionClasses[position]} z-40 w-96 ${isMinimized ? 'h-16' : 'h-[600px]'} transition-all duration-300`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Agent IA NextMove</h3>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>En ligne</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-lg flex items-center justify-center transition-colors"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex-1 overflow-hidden">
              <NextMoveAIChat 
                context={{
                  user: {
                    name: "Utilisateur",
                    tenant: "widget",
                    locale: "fr",
                    role: "CLIENT"
                  },
                  recent_shipments: [],
                  recent_invoices: [],
                  active_features: ["pod", "split_payments", "notifications_multichannel", "ai_assistant"]
                }}
                onActionClick={(action) => {
                  switch (action.type) {
                    case 'track':
                      window.location.href = '/dashboard/packages'
                      break
                    case 'quote':
                      window.location.href = '/dashboard/pricing'
                      break
                    case 'invoices':
                      window.location.href = '/dashboard/finances/invoicing'
                      break
                    case 'support':
                      window.location.href = '/dashboard/support'
                      break
                    default:
                      console.log('Action Widget IA:', action)
                  }
                }}
                className="h-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Button */}
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <button
          onClick={() => setIsOpen(false)}
          className={`${sizeClasses[size]} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center`}
          title="Fermer l'Agent IA"
        >
          <X className={`${iconSizes[size]}`} />
        </button>
      </div>
    </>
  )
}
