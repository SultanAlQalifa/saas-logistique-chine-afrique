"use client";

import { useState, useRef, useEffect } from 'react';
import { AIHumanizer } from '@/lib/ai-humanizer';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

export function HumanizedChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<InstanceType<typeof AIHumanizer> | null>(null);

  // Initialiser l'IA
  useEffect(() => {
    aiRef.current = new AIHumanizer({
      conversationHistory: [],
      interactionCount: 0,
      lastInteractionTime: Date.now(),
      userPreferences: {
        formality: 'informal',
        preferredName: 'Client'
      }
    });

    // Message de bienvenue
    const welcomeMessages = [
      "Bonjour ! Je suis votre assistante logistique. Comment puis-je vous aider aujourd'hui ?",
      "Salut ! Besoin d'un coup de main pour suivre un colis ou obtenir un devis ?",
      "Bonjour ! En quoi puis-je vous être utile pour votre expédition ?"
    ];
    
    const welcomeMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
    setMessages([{
      role: 'assistant',
      content: welcomeMessage,
      timestamp: Date.now()
    }]);
  }, []);

  // Faire défiler vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !aiRef.current) return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Obtenir une réponse de l'IA
      const response = await aiRef.current.generateResponse(input);
      
      // Ajouter la réponse de l'IA
      const aiMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre demande ?",
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* En-tête du chat */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">NextMove Assistant</h2>
            <p className="text-sm opacity-80">
              {isTyping ? 'En train de rédiger...' : 'En ligne'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-lg px-4 py-2',
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              )}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                <span className="text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 p-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <form onSubmit={handleSubmit} className="border-t p-4 bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          L'assistant est configuré pour des réponses naturelles et humaines
        </p>
      </form>
    </div>
  );
}
