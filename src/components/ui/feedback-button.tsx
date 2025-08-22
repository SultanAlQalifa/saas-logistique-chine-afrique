'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { FeedbackModal } from './feedback-modal'

interface FeedbackData {
  type: 'suggestion' | 'bug' | 'compliment' | 'other'
  category: string
  title: string
  description: string
  email?: string
  priority: 'low' | 'medium' | 'high'
}

export function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const handleFeedbackSubmit = async (feedback: FeedbackData) => {
    // Simulate API call
    console.log('Feedback submitted:', feedback)
    
    // Here you would typically send the feedback to your backend
    // await fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(feedback)
    // })
    
    // Show success message
    alert('Merci pour votre feedback ! Nous l\'avons bien reçu.')
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-20 right-4 z-40 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        title="Ouvrir le feedback"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <>
      {/* Floating Feedback Widget */}
      <div className="fixed bottom-20 right-4 z-40">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">Feedback</h3>
                <p className="text-xs text-gray-500">Aidez-nous à nous améliorer</p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Réduire"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-600 mb-4">
            Partagez vos suggestions, signalez des bugs ou laissez-nous un compliment !
          </p>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium"
            >
              💬 Laisser un feedback
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(true)
                  // Pre-select suggestion type
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-yellow-50 text-yellow-700 rounded border border-yellow-200 hover:bg-yellow-100 transition-colors"
              >
                💡 Suggestion
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(true)
                  // Pre-select bug type
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded border border-red-200 hover:bg-red-100 transition-colors"
              >
                🐛 Bug
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Votre feedback nous aide à améliorer NextMove
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  )
}
