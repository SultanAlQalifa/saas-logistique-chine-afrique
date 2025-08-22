'use client'

import { useState } from 'react'
import { MessageCircle, Phone, Bot, Headphones, Mail, Video } from 'lucide-react'
import AIAssistant from '@/components/ai-chat/AIAssistant'

interface ChatOption {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  component?: React.ReactNode
  action?: () => void
}

export function ChatHub() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)

  const chatOptions: ChatOption[] = [
    {
      id: 'ai-assistant',
      name: 'Assistant IA',
      icon: <Bot className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      component: <AIAssistant isOpen={true} onToggle={() => {}} />
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      action: () => window.open('https://wa.me/221771234567', '_blank')
    },
    {
      id: 'phone',
      name: 'Téléphone',
      icon: <Phone className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      action: () => window.open('tel:+221771234567', '_self')
    },
    {
      id: 'support',
      name: 'Support Live',
      icon: <Headphones className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      action: () => console.log('Ouvrir support live')
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      action: () => window.open('mailto:support@nextmove-cargo.com', '_self')
    },
    {
      id: 'video-call',
      name: 'Appel Vidéo',
      icon: <Video className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-teal-500 to-green-500',
      action: () => console.log('Démarrer appel vidéo')
    }
  ]

  const handleChatOptionClick = (option: ChatOption) => {
    if (option.component) {
      setActiveChat(activeChat === option.id ? null : option.id)
    } else if (option.action) {
      option.action()
    }
  }

  const getOptionPosition = (index: number, total: number) => {
    const angle = (Math.PI / (total - 1)) * index - Math.PI / 2
    const radius = 80
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return { x, y }
  }

  return (
    <>
      {/* Chat Hub Container */}
      <div className="fixed bottom-6 right-6 z-50">
        <div
          className="relative"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          onTouchStart={() => setIsExpanded(!isExpanded)}
        >
          {/* Main Chat Button */}
          <div className="relative">
            <button
              className={`
                w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform
                bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-110
                flex items-center justify-center text-white
                ${isExpanded ? 'rotate-45' : 'rotate-0'}
              `}
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </div>

          {/* Expanded Chat Options */}
          <div className={`absolute bottom-0 right-0 transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {chatOptions.map((option, index) => {
              const { x, y } = getOptionPosition(index, chatOptions.length)
              return (
                <button
                  key={option.id}
                  onClick={() => handleChatOptionClick(option)}
                  className={`
                    absolute w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform
                    ${option.color} hover:scale-110 flex items-center justify-center text-white
                    ${isExpanded ? 'translate-x-0 translate-y-0' : 'translate-x-0 translate-y-0'}
                  `}
                  style={{
                    transform: isExpanded 
                      ? `translate(${x}px, ${y}px) scale(1)` 
                      : 'translate(0px, 0px) scale(0)',
                    transitionDelay: isExpanded ? `${index * 50}ms` : '0ms'
                  }}
                  title={option.name}
                >
                  {option.icon}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tooltip */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            Choisissez votre mode de contact
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Active Chat Component */}
      {activeChat && (
        <div className="fixed bottom-24 right-6 z-40">
          {chatOptions.find(option => option.id === activeChat)?.component}
        </div>
      )}

      {/* Mobile Touch Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-30 md:hidden"
          onTouchStart={() => setIsExpanded(false)}
        />
      )}
    </>
  )
}
