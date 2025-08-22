'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  User, 
  X,
  Minimize2,
  Maximize2,
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  Clock
} from 'lucide-react';
import { NextMoveAI } from '@/lib/nextmove-ai';
import { AIChatService } from '@/lib/ai-chat-service';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

interface ChatbotWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'purple' | 'blue' | 'green';
}

export default function ChatbotWidget({ 
  position = 'bottom-right', 
  theme = 'purple' 
}: ChatbotWidgetProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextMoveAI] = useState(() => new NextMoveAI());
  const [aiChatService] = useState(() => AIChatService.getInstance());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const themeColors = {
    purple: {
      gradient: 'from-purple-700 to-pink-700',
      hover: 'from-purple-800 to-pink-800',
      bg: 'bg-purple-700',
      text: 'text-purple-800'
    },
    blue: {
      gradient: 'from-blue-700 to-cyan-700',
      hover: 'from-blue-800 to-cyan-800',
      bg: 'bg-blue-700',
      text: 'text-blue-800'
    },
    green: {
      gradient: 'from-green-700 to-emerald-700',
      hover: 'from-green-800 to-emerald-800',
      bg: 'bg-green-700',
      text: 'text-green-800'
    }
  };

  const currentTheme = themeColors[theme];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize welcome message with NextMove AI
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, messages.length]);

  const initializeChat = async () => {
    try {
      const userId = session?.user?.email || 'anonymous';
      const channelId = 'widget';
      const locale = 'fr'; // Default to French
      
      // Utiliser le service IA centralisé pour l'initialisation
      const response = await aiChatService.processMessage('', {
        sessionId: `widget-${userId}`,
        context: 'widget',
        userType: 'particulier',
        language: 'fr',
        previousMessages: [],
        userId,
        clientInfo: {
          name: session?.user?.name || undefined,
          email: session?.user?.email || undefined
        }
      });
      
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        actions: response.actions?.map(action => ({
          label: action.label,
          action: action.action || 'default'
        })) || [
          { label: '🎫 Créer un ticket', action: 'create_ticket' },
          { label: '📦 Suivre un colis', action: 'track_package' },
          { label: '💰 Questions tarifaires', action: 'pricing_info' },
          { label: '📞 Contact humain', action: 'human_contact' }
        ]
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing NextMove AI chat:', error);
      // Fallback to simple welcome message
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: '👋 Bonjour ! Je suis NextMove AI, votre assistant logistique intelligent. Comment puis-je vous aider ?',
        timestamp: new Date(),
        actions: [
          { label: '🎫 Créer un ticket', action: 'create_ticket' },
          { label: '📦 Suivre un colis', action: 'track_package' },
          { label: '💰 Questions tarifaires', action: 'pricing_info' },
          { label: '📞 Contact humain', action: 'human_contact' }
        ]
      };
      setMessages([welcomeMessage]);
    }
  };

  const addMessage = (content: string, type: 'user' | 'bot', actions?: Message['actions']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      actions
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (type === 'bot' && !isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const simulateTyping = (callback: () => void, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleQuickAction = async (action: string) => {
    console.log('🔥 Action rapide cliquée:', action);
    
    // Map action to user message
    const actionMessages: { [key: string]: string } = {
      'create_ticket': 'Je souhaite créer un ticket',
      'track_package': 'Je veux suivre mon colis',
      'pricing_info': 'Questions sur les tarifs',
      'human_contact': 'Je veux parler à un agent',
      'price_calculator': 'Calculateur de prix',
      'contact_sales': 'Contact commercial',
      'request_call': 'Demande d\'appel',
      'live_chat': 'Chat en direct',
      'track': 'Suivre mes colis',
      'invoices': 'Voir mes factures',
      'quote': 'Créer un devis',
      'documentation': 'Documentation',
      'docs': 'Documentation'
    };

    const userMessage = actionMessages[action] || action;
    console.log('📝 Message utilisateur à ajouter:', userMessage);
    
    // Ajouter le message utilisateur
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    console.log('✅ Message utilisateur ajouté');

    // Handle special actions
    if (action === 'open_full_chat') {
      window.open('/dashboard/support/chatbot', '_blank');
      return;
    }

    // Simuler la frappe et répondre
    setIsTyping(true);
    console.log('⌨️ Simulation de frappe démarrée');
    
    setTimeout(async () => {
      setIsTyping(false);
      console.log('🤖 Traitement de la réponse IA...');
      
      // Réponse bot simple pour tester
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `J'ai bien reçu votre demande: "${userMessage}". Comment puis-je vous aider davantage?`,
        timestamp: new Date(),
        actions: [
          { label: '📞 Parler à un agent', action: 'human_contact' },
          { label: '🚀 Chat complet', action: 'open_full_chat' }
        ]
      };
      
      setMessages(prev => [...prev, botResponse]);
      console.log('✅ Réponse bot ajoutée');
    }, 1500);
    
    /*
    // Process with NextMove AI - désactivé temporairement pour debug
    simulateTyping(async () => {
      try {
        const userId = session?.user?.email || 'anonymous';
        const channelId = 'widget';
        const locale = 'fr';
        
        const response = await nextMoveAI.processMessage(userMessage, userId, channelId, { locale });
        
        const actions = response.ctas?.map(cta => ({
          label: cta.text,
          action: cta.action || 'default'
        }));
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.message,
          timestamp: new Date(),
          actions
        };
        setMessages(prev => [...prev, botMessage]);
        
      } catch (error) {
        console.error('Error processing quick action with NextMove AI:', error);
        // Fallback responses
        let fallbackResponse = '';
        let fallbackActions: Array<{label: string; action: string}> = [];
        
        switch (action) {
          case 'create_ticket':
            fallbackResponse = '🎫 Je vais vous rediriger vers notre interface de création de tickets.';
            fallbackActions = [
              { label: '🚀 Ouvrir le chatbot complet', action: 'open_full_chat' }
            ];
            break;
          case 'track_package':
            fallbackResponse = '📦 Donnez-moi votre numéro de suivi pour tracer votre colis.';
            break;
          case 'pricing_info':
            fallbackResponse = '💰 Consultez notre calculateur de prix ou contactez notre équipe.';
            fallbackActions = [
              { label: '🧮 Calculateur de prix', action: 'price_calculator' }
            ];
            break;
          case 'human_contact':
            fallbackResponse = '👨‍💼 Je vous mets en contact avec un agent. Temps d\'attente : 2-3 minutes.';
            fallbackActions = [
              { label: '💬 Chat en direct', action: 'live_chat' }
            ];
            break;
          default:
            fallbackResponse = '🤔 Pour une assistance complète, utilisez notre chatbot principal.';
            fallbackActions = [
              { label: '🚀 Chatbot complet', action: 'open_full_chat' }
            ];
        }
        
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: fallbackResponse,
          timestamp: new Date(),
          actions: fallbackActions
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    });
    */
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    addMessage(userMessage, 'user');
    setInputValue('');

    // Process with NextMove AI
    simulateTyping(async () => {
      try {
        const userId = session?.user?.email || 'anonymous';
        const channelId = 'widget';
        const locale = 'fr'; // Default to French
        
        const response = await nextMoveAI.processMessage(userMessage, userId, channelId, { locale });
        
        const actions = response.ctas?.map(cta => ({
          label: cta.text,
          action: cta.action || 'default'
        }));
        
        addMessage(response.message, 'bot', actions);
        
      } catch (error) {
        console.error('Error processing message with NextMove AI:', error);
        // Fallback to simple response
        addMessage(
          '🤔 Je rencontre une difficulté technique. Pour une assistance complète, utilisez notre chatbot principal ou contactez un agent.',
          'bot',
          [
            { label: '🚀 Chatbot complet', action: 'open_full_chat' },
            { label: '📞 Agent humain', action: 'human_contact' }
          ]
        );
      }
    });
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  if (!isOpen) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <Button
          onClick={toggleWidget}
          className={`relative h-14 w-14 rounded-full bg-gradient-to-r ${currentTheme.gradient} hover:${currentTheme.hover} text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300`}
        >
          <Bot className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div className={`bg-white rounded-2xl shadow-2xl border-0 w-80 ${isMinimized ? 'h-16' : 'h-96'} transition-all duration-300`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentTheme.gradient} text-white p-4 rounded-t-2xl flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">NextMove AI</h3>
              <div className="flex items-center gap-1 text-xs opacity-90">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Assistant IA</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleWidget}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto max-h-64 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-1.5 rounded-full ${
                      message.type === 'user' 
                        ? `bg-gradient-to-r ${currentTheme.gradient}` 
                        : 'bg-gray-100'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-3 w-3 text-white" />
                      ) : (
                        <Bot className={`h-3 w-3 ${currentTheme.text}`} />
                      )}
                    </div>
                    
                    <div className={`rounded-xl p-3 text-sm ${
                      message.type === 'user'
                        ? `bg-gradient-to-r ${currentTheme.gradient} text-white`
                        : 'bg-gray-50 text-gray-800'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {message.actions && (
                        <div className="mt-2 space-y-1">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              onClick={() => handleQuickAction(action.action)}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs h-7 bg-white/90 hover:bg-white border-white/50"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-full bg-gray-100">
                      <Bot className={`h-3 w-3 ${currentTheme.text}`} />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <div className="flex items-center gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez votre message..."
                  className="flex-1 text-sm border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="sm"
                  className={`bg-gradient-to-r ${currentTheme.gradient} hover:${currentTheme.hover} text-white shadow-lg h-9 w-9 p-0`}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>support@logistique.com</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
