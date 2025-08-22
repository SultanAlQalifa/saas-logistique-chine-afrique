'use client'

import { useState, useRef, useEffect } from 'react'
import { AIChatService } from '@/lib/ai-chat-service'
import { 
  Send, 
  Bot, 
  User, 
  Paperclip, 
  Mic, 
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Package,
  DollarSign,
  HeadphonesIcon,
  Globe,
  ExternalLink,
  MapPin,
  Calendar,
  Star,
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ImageUpload from '@/components/ui/image-upload'
import BackButton from '@/components/ui/back-button';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  actions?: Array<{
    label: string;
    action: string;
    variant?: 'primary' | 'secondary';
  }>;
}

interface TicketData {
  category?: string;
  priority?: string;
  title?: string;
  description?: string;
  clientInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    type?: 'particulier' | 'entreprise';
  };
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [whatsappMessages, setWhatsappMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [ticketData, setTicketData] = useState<TicketData>({});
  const [isRecording, setIsRecording] = useState(false);
  const [ticketImages, setTicketImages] = useState<any[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
  // Debug logging
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    // Délai pour permettre au DOM de se mettre à jour
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Initialize chatbot
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const addMessage = (content: string, type: 'user' | 'bot', actions?: Message['actions']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      actions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleQuickAction = (action: string) => {
    // Ajouter automatiquement le message utilisateur correspondant à l'action
    const actionMessages: { [key: string]: string } = {
      'create_ticket': 'Je souhaite créer un ticket',
      'track_package': 'Je veux suivre mon colis',
      'pricing_info': 'J\'ai des questions sur les tarifs',
      'complaint': 'Je souhaite déposer une réclamation',
      'human_contact': 'Je souhaite parler à un agent',
      'delivery_issue': 'Problème de livraison',
      'billing_issue': 'Question de facturation',
      'damage_claim': 'Colis endommagé',
      'other_issue': 'Autre demande',
      'air_pricing': 'Tarifs aériens',
      'sea_pricing': 'Tarifs maritimes',
      'price_calculator': 'Calculateur de prix'
    };

    const userMessage = actionMessages[action] || action;
    addMessage(userMessage, 'user');

    switch (action) {
      case 'create_ticket':
        simulateTyping(() => {
          addMessage(
            '🎫 Parfait ! Je vais vous aider à créer un ticket. Pour commencer, de quel type de problème s\'agit-il ?',
            'bot',
            [
              { label: '🚚 Problème de livraison', action: 'delivery_issue', variant: 'primary' },
              { label: '💳 Question de facturation', action: 'billing_issue', variant: 'primary' },
              { label: '📦 Colis endommagé', action: 'damage_claim', variant: 'primary' },
              { label: '💬 Autre demande', action: 'other_issue', variant: 'secondary' }
            ]
          );
          setCurrentStep('category_selection');
        });
        break;

      case 'track_package':
        simulateTyping(() => {
          addMessage(
            '📦 Pour suivre votre colis, j\'ai besoin de votre numéro de suivi. Pouvez-vous me le fournir ?',
            'bot'
          );
          setCurrentStep('package_tracking');
        });
        break;

      case 'pricing_info':
        simulateTyping(() => {
          addMessage(
            '💰 Je peux vous aider avec les informations tarifaires ! Que souhaitez-vous savoir ?',
            'bot',
            [
              { label: '✈️ Tarifs aériens', action: 'air_pricing', variant: 'primary' },
              { label: '🚢 Tarifs maritimes', action: 'sea_pricing', variant: 'primary' },
              { label: '🧮 Calculateur de prix', action: 'price_calculator', variant: 'secondary' }
            ]
          );
          setCurrentStep('pricing_selection');
        });
        break;

      case 'complaint':
        simulateTyping(() => {
          addMessage(
            '😔 Je comprends votre mécontentement. Je vais vous aider à déposer une réclamation. De quel type de problème s\'agit-il ?',
            'bot',
            [
              { label: '📦 Colis perdu/endommagé', action: 'damaged_package', variant: 'primary' },
              { label: '⏰ Retard de livraison', action: 'delivery_delay', variant: 'primary' },
              { label: '💰 Problème de facturation', action: 'billing_complaint', variant: 'primary' },
              { label: '👥 Service client insatisfaisant', action: 'service_complaint', variant: 'primary' },
              { label: '🔧 Autre réclamation', action: 'other_complaint', variant: 'secondary' }
            ]
          );
          setCurrentStep('complaint_category');
        });
        break;

      case 'human_contact':
        simulateTyping(() => {
          addMessage(
            '👨‍💼 Je comprends que vous souhaitez parler à un agent humain. Je vais créer un ticket prioritaire pour vous mettre en contact rapidement.',
            'bot',
            [
              { label: '📞 Demande d\'appel', action: 'request_call', variant: 'primary' },
              { label: '💬 Chat en direct', action: 'live_chat', variant: 'primary' },
              { label: '📧 Email support', action: 'email_support', variant: 'secondary' }
            ]
          );
        });
        break;

      case 'delivery_issue':
        setTicketData(prev => ({ ...prev, category: 'Livraison', priority: 'haute' }));
        simulateTyping(() => {
          addMessage(
            '🚚 Je comprends que vous avez un problème de livraison. Pouvez-vous me décrire le problème en quelques mots ?',
            'bot'
          );
          setCurrentStep('problem_description');
        });
        break;

      case 'billing_issue':
        setTicketData(prev => ({ ...prev, category: 'Facturation', priority: 'normale' }));
        simulateTyping(() => {
          addMessage(
            '💳 Je vais vous aider avec votre question de facturation. Pouvez-vous me décrire le problème ?',
            'bot'
          );
          setCurrentStep('problem_description');
        });
        break;

      case 'damage_claim':
        setTicketData(prev => ({ ...prev, category: 'Réclamation', priority: 'urgente' }));
        simulateTyping(() => {
          addMessage(
            '📦 Je suis désolé d\'apprendre que votre colis a été endommagé. Pouvez-vous me décrire les dommages constatés ?',
            'bot'
          );
          setCurrentStep('problem_description');
        });
        break;

      case 'other_issue':
        setTicketData(prev => ({ ...prev, category: 'Autre', priority: 'normale' }));
        simulateTyping(() => {
          addMessage(
            '💬 Pas de problème ! Pouvez-vous me décrire votre demande ou question ?',
            'bot'
          );
          setCurrentStep('problem_description');
        });
        break;

      default:
        break;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, 'user');
    setInputValue('');
    setIsTyping(true);

    try {
      // Utiliser le chatbot universel avec RAG + OpenAI + Tools
      const response = await fetch('/api/universal-chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(-5).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      })

      const data = await response.json()
      
      if (data.success && data.response) {
        const botResponse: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: data.response.message,
          timestamp: new Date(),
          actions: data.response.actions?.map((action: any) => ({
            label: action.label,
            action: action.action,
            variant: action.variant
          }))
        }
        
        setMessages(prev => [...prev, botResponse])
        
        // Afficher les sources RAG si disponibles
        if (data.response.sources && data.response.sources.length > 0) {
          console.log('Sources RAG:', data.response.sources)
        }
        
        // Gérer les résultats d'outils
        if (data.response.toolResults && data.response.toolResults.length > 0) {
          console.log('Résultats outils:', data.response.toolResults)
        }
      } else {
        throw new Error(data.error || 'Erreur de réponse')
      }
      
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse IA:', error)
      
      const errorResponse: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Désolé, je rencontre un problème technique. Un agent va vous contacter sous peu.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  };

  const handleBotResponse = (userInput: string) => {
    switch (currentStep) {
      case 'category_selection':
        setTicketData(prev => ({ ...prev, category: userInput }));
        simulateTyping(() => {
          addMessage(
            '📝 Merci ! Maintenant, pouvez-vous me décrire votre problème en détail ?',
            'bot'
          );
          setCurrentStep('problem_description');
        });
        break;

      case 'problem_description':
        setTicketData(prev => ({ ...prev, description: userInput }));
        simulateTyping(() => {
          addMessage(
            '⚡ Quelle est la priorité de votre demande ?',
            'bot',
            [
              { label: '🔴 Urgente', action: 'set_urgent', variant: 'primary' },
              { label: '🟠 Haute', action: 'set_high', variant: 'primary' },
              { label: '🟡 Normale', action: 'set_normal', variant: 'secondary' },
              { label: '🟢 Basse', action: 'set_low', variant: 'secondary' }
            ]
          );
          setCurrentStep('priority_selection');
        });
        break;

      case 'priority_selection':
        setTicketData(prev => ({ ...prev, priority: userInput }));
        simulateTyping(() => {
          addMessage(
            '👤 Pour finaliser, j\'ai besoin de quelques informations personnelles. Quel est votre nom complet ?',
            'bot'
          );
          setCurrentStep('collect_name');
        });
        break;

      case 'collect_name':
        setTicketData(prev => ({ 
          ...prev, 
          clientInfo: { ...prev.clientInfo, name: userInput }
        }));
        simulateTyping(() => {
          addMessage(
            '📧 Parfait ! Maintenant, quelle est votre adresse email ?',
            'bot'
          );
          setCurrentStep('collect_email');
        });
        break;

      case 'collect_email':
        setTicketData(prev => ({ 
          ...prev, 
          clientInfo: { ...prev.clientInfo, email: inputValue }
        }));
        simulateTyping(() => {
          addMessage(
            '📱 Merci ! Pouvez-vous me donner votre numéro de téléphone ?',
            'bot'
          );
          setCurrentStep('collect_phone');
        });
        break;

      case 'collect_phone':
        setTicketData(prev => ({ 
          ...prev, 
          clientInfo: { ...prev.clientInfo, phone: inputValue }
        }));
        simulateTyping(() => {
          addMessage(
            '🏢 Dernière question : êtes-vous un particulier ou représentez-vous une entreprise ?',
            'bot',
            [
              { label: '👤 Particulier', action: 'set_individual', variant: 'primary' },
              { label: '🏢 Entreprise', action: 'set_company', variant: 'primary' }
            ]
          );
          setCurrentStep('collect_type');
        });
        break;

      case 'package_tracking':
        simulateTyping(() => {
          addMessage(
            `📦 Merci ! Je recherche les informations pour le numéro de suivi : ${inputValue}\n\n✅ Votre colis a été expédié le 12/01/2024\n🚚 Statut actuel : En transit\n📍 Dernière position : Entrepôt Paris\n⏰ Livraison prévue : 16/01/2024`,
            'bot',
            [
              { label: '📧 Recevoir les mises à jour', action: 'subscribe_updates', variant: 'primary' },
              { label: '🎫 Signaler un problème', action: 'create_ticket', variant: 'secondary' }
            ]
          );
        });
        break;

      default:
        // General AI response
        simulateTyping(() => {
          let response = '';
          if (userInput.includes('bonjour') || userInput.includes('salut')) {
            response = '👋 Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
          } else if (userInput.includes('merci')) {
            response = '😊 Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?';
          } else if (userInput.includes('prix') || userInput.includes('tarif')) {
            response = '💰 Pour les informations tarifaires, je peux vous rediriger vers notre calculateur de prix ou vous mettre en contact avec notre équipe commerciale.';
          } else {
            response = '🤔 Je comprends votre demande. Pour mieux vous aider, pourriez-vous me donner plus de détails ou choisir une des options proposées ?';
          }
          addMessage(response, 'bot');
        });
        break;
    }
  };

  const handleSpecialAction = (action: string) => {
    switch (action) {
      case 'set_individual':
        setTicketData(prev => ({ 
          ...prev, 
          clientInfo: { ...prev.clientInfo, type: 'particulier' }
        }));
        addMessage('Particulier', 'user');
        createTicket();
        break;

      case 'set_company':
        setTicketData(prev => ({ 
          ...prev, 
          clientInfo: { ...prev.clientInfo, type: 'entreprise' }
        }));
        addMessage('Entreprise', 'user');
        createTicket();
        break;

      case 'subscribe_updates':
        addMessage('Je souhaite recevoir les mises à jour', 'user');
        simulateTyping(() => {
          addMessage(
            '📧 Parfait ! Vous êtes maintenant abonné aux notifications de suivi pour ce colis.\n\n✅ Vous recevrez :\n• SMS lors des étapes importantes\n• Email quotidien avec la position\n• Notification 24h avant la livraison\n\n📱 Les notifications seront envoyées sur votre téléphone et email.',
            'bot',
            [
              { label: '⚙️ Gérer mes préférences', action: 'manage_notifications', variant: 'secondary' },
              { label: '🏠 Retour au menu principal', action: 'restart', variant: 'secondary' }
            ]
          );
        });
        break;

      case 'manage_notifications':
        addMessage('Gérer mes préférences de notification', 'user');
        simulateTyping(() => {
          addMessage(
            '⚙️ Préférences de notification :\n\n📱 **SMS** : Activé\n📧 **Email** : Activé\n🔔 **Push** : Désactivé\n⏰ **Fréquence** : Quotidienne\n\nPour modifier ces paramètres, contactez notre support ou accédez à votre espace client.',
            'bot',
            [
              { label: '📞 Contacter le support', action: 'human_contact', variant: 'primary' },
              { label: '🏠 Retour au menu principal', action: 'restart', variant: 'secondary' }
            ]
          );
        });
        break;

      case 'restart':
        resetChat();
        break;

      default:
        handleQuickAction(action);
        break;
    }
  };

  const createTicket = () => {
    simulateTyping(() => {
      const ticketId = `TK-${Date.now().toString().slice(-6)}`;
      addMessage(
        `🎉 Parfait ! Votre ticket a été créé avec succès !\n\n📋 **Récapitulatif :**\n• Numéro : ${ticketId}\n• Catégorie : ${ticketData.category}\n• Priorité : ${ticketData.priority}\n• Client : ${ticketData.clientInfo?.name} (${ticketData.clientInfo?.type})\n\n✅ Vous recevrez une confirmation par email et notre équipe vous contactera dans les plus brefs délais.`,
        'bot',
        [
          { label: '📧 Envoyer par email', action: 'send_email', variant: 'primary' },
          { label: '🔄 Nouveau ticket', action: 'restart', variant: 'secondary' },
          { label: '🏠 Retour accueil', action: 'go_home', variant: 'secondary' }
        ]
      );
      setCurrentStep('ticket_created');
    }, 2000);
  };

  const resetChat = () => {
    setMessages([]);
    setTicketData({});
    setCurrentStep('greeting');
    // Re-initialize
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  const handleWhatsAppRedirect = () => {
    const phoneNumber = '+33123456789';
    const message = encodeURIComponent('Bonjour, je souhaite obtenir de l\'aide concernant mes expéditions.');
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
    window.location.href = whatsappUrl;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Bouton retour */}
      <BackButton href="/dashboard/support" label="Retour au Support" />
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm min-h-[600px] flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-cyan-50 via-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <span>💬 Support Client</span>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Disponible 24h/24
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-50 to-gray-100 m-4 mb-0 h-12">
              <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                <MessageSquare className="h-4 w-4" />
                Chat Direct
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm">
                <Phone className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm">
                <HeadphonesIcon className="h-4 w-4" />
                Informations
              </TabsTrigger>
            </TabsList>

            {/* Chat Direct Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[500px] space-y-4 scroll-smooth">
            {(activeTab === 'chat' ? messages : whatsappMessages).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    
                    <div className={`rounded-2xl p-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {message.actions && (
                        <div className="mt-4 space-y-2">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              onClick={() => handleSpecialAction(action.action)}
                              variant={action.variant === 'primary' ? 'default' : 'outline'}
                              size="sm"
                              className={`w-full justify-start ${
                                action.variant === 'primary'
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0'
                                  : 'hover:bg-purple-50 hover:border-purple-300'
                              }`}
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
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
                <div ref={messagesEndRef} />
              </div>

              {/* Actions rapides fixes */}
              <div className="border-t border-gray-100 px-1 py-0.5 bg-gray-50">
                <div className="text-xs text-gray-600 mb-0.5 font-medium">Actions rapides :</div>
                <div className="grid grid-cols-5 gap-0.5">
                  <button
                    onClick={() => {
                      const userMessage = 'Connexion';
                      addMessage(userMessage, 'user');
                      setInputValue(userMessage);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="p-1 bg-yellow-100 hover:bg-yellow-200 rounded text-sm transition-colors flex items-center justify-center"
                    title="Connexion"
                  >
                    🔑
                  </button>
                  <button
                    onClick={() => {
                      const userMessage = 'Suivre mes colis';
                      addMessage(userMessage, 'user');
                      setInputValue(userMessage);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="p-1 bg-blue-100 hover:bg-blue-200 rounded text-sm transition-colors flex items-center justify-center"
                    title="Suivre mes colis"
                  >
                    📦
                  </button>
                  <button
                    onClick={() => {
                      const userMessage = 'Voir mes factures';
                      addMessage(userMessage, 'user');
                      setInputValue(userMessage);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="p-1 bg-green-100 hover:bg-green-200 rounded text-sm transition-colors flex items-center justify-center"
                    title="Voir mes factures"
                  >
                    💰
                  </button>
                  <button
                    onClick={() => {
                      const userMessage = 'Créer un devis';
                      addMessage(userMessage, 'user');
                      setInputValue(userMessage);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="p-1 bg-purple-100 hover:bg-purple-200 rounded text-sm transition-colors flex items-center justify-center"
                    title="Créer un devis"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => {
                      const userMessage = 'Documentation';
                      addMessage(userMessage, 'user');
                      setInputValue(userMessage);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="p-1 bg-orange-100 hover:bg-orange-200 rounded text-sm transition-colors flex items-center justify-center"
                    title="Documentation"
                  >
                    📚
                  </button>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${isRecording ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Tapez votre message..."
                      className="pr-12 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-gray-200"
                      onClick={() => setShowImageUpload(!showImageUpload)}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => {
                      setMessages([]);
                      setInputValue('');
                      setIsTyping(false);
                    }}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white p-1 rounded-lg transition-all duration-200 transform hover:scale-105"
                    title="Réinitialiser la conversation"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image Upload Section */}
                {showImageUpload && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      📎 Pièces jointes
                    </h4>
                    <p className="text-xs text-blue-700 mb-3">
                      Ajoutez des photos ou documents pour illustrer votre problème (factures, photos de colis, captures d'écran, etc.)
                    </p>
                    <ImageUpload
                      maxFiles={5}
                      maxSize={10}
                      onFilesChange={setTicketImages}
                      existingImages={ticketImages}
                      showCamera={true}
                      showPreview={true}
                      className="bg-white rounded-lg"
                    />
                    {ticketImages.length > 0 && (
                      <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {ticketImages.length} fichier(s) ajouté(s) - Ils seront inclus avec votre ticket
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* WhatsApp Tab */}
            <TabsContent value="whatsapp" className="flex-1 flex flex-col m-0">
              <div className="flex-1 flex flex-col bg-gray-50">
                {/* Header */}
                <div className="bg-green-600 text-white p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp Business</h3>
                    <p className="text-sm opacity-90">NextMove Support</p>
                    <p className="text-xs opacity-75">En ligne</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-green-500 text-white p-3 text-center">
                  <p className="text-sm">📞 +221 77 123 45 67 • 3 agents disponibles • Support 24/7</p>
                </div>

                {/* Conversations List */}
                <div className="flex-1 p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Discussions</h4>
                  
                  {/* Conversation Items */}
                  <div className="space-y-2">
                    <div 
                      className="bg-white rounded-lg p-3 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setActiveTab('chat');
                        // Ajouter le message de contexte de la discussion Support dans WhatsApp
                        const contextMessage = {
                          id: Date.now().toString(),
                          type: 'user' as const,
                          content: 'Bonjour, j\'aimerais avoir des nouvelles de mon colis en cours de livraison',
                          timestamp: new Date(),
                          actions: []
                        };
                        setWhatsappMessages(prev => [...prev, contextMessage]);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          S
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-gray-900">Support NextMove</h5>
                            <span className="text-xs text-gray-500">14:23</span>
                          </div>
                          <p className="text-sm text-gray-600">Votre colis est en cours de livraison</p>
                        </div>
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          2
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        🛡️ Support
                      </div>
                    </div>

                    <div 
                      className="bg-white rounded-lg p-3 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setActiveTab('chat');
                        // Ajouter le message de contexte LogiTrans dans WhatsApp
                        const contextMessage = {
                          id: Date.now().toString(),
                          type: 'user' as const,
                          content: 'Bonjour LogiTrans Sénégal, j\'ai une question sur ma commande récente',
                          timestamp: new Date(),
                          actions: []
                        };
                        setWhatsappMessages(prev => [...prev, contextMessage]);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          L
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-gray-900">LogiTrans Sénégal</h5>
                            <span className="text-xs text-gray-500">13:45</span>
                          </div>
                          <p className="text-sm text-gray-600">Merci pour votre commande</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-blue-600">
                        📦 LogiTrans Sénégal
                      </div>
                    </div>

                    <div 
                      className="bg-white rounded-lg p-3 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setActiveTab('chat');
                        // Ajouter le message de contexte de Cargo Express dans WhatsApp
                        const contextMessage = {
                          id: Date.now().toString(),
                          type: 'user' as const,
                          content: 'Bonjour Cargo Express Mali, j\'aimerais confirmer les délais de livraison pour ma commande',
                          timestamp: new Date(),
                          actions: []
                        };
                        setWhatsappMessages(prev => [...prev, contextMessage]);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          C
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-gray-900">Cargo Express Mali</h5>
                            <span className="text-xs text-gray-500">12:30</span>
                          </div>
                          <p className="text-sm text-gray-600">Le délai de livraison est de 5-7 jours</p>
                        </div>
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          1
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-orange-600">
                        📦 Cargo Express Mali
                      </div>
                    </div>
                  </div>

                  {/* Active Chat Preview */}
                  <div className="bg-white rounded-lg p-4 border-2 border-green-200 mt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        S
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">Support NextMove</h5>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          En ligne
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-100 rounded-lg p-2 text-gray-700">
                        Bonjour ! Comment puis-je vous aider ?
                        <div className="text-xs text-gray-500 mt-1">14:20</div>
                      </div>
                      <div className="bg-green-500 text-white rounded-lg p-2 ml-8">
                        J'aimerais suivre mon colis
                        <div className="text-xs opacity-75 mt-1">14:21</div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-2 text-gray-700">
                        Votre colis arrivera demain.
                        <div className="text-xs text-gray-500 mt-1">14:23</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-2">
                    <Button
                      onClick={() => {
                        setActiveTab('chat');
                        // Ajouter un message de démarrage dans WhatsApp
                        const startMessage = {
                          id: Date.now().toString(),
                          type: 'user' as const,
                          content: 'Bonjour, j\'aimerais commencer une conversation avec le support',
                          timestamp: new Date(),
                          actions: []
                        };
                        setWhatsappMessages(prev => [...prev, startMessage]);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white w-full"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Démarrer une conversation
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Cliquez pour commencer à chatter avec notre équipe support
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleWhatsAppRedirect}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ouvrir WhatsApp réel
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Support Info Tab */}
            <TabsContent value="support" className="flex-1 flex flex-col m-0">
              <div className="flex-1 p-6 space-y-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                    <HeadphonesIcon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🎧 Support Client</h3>
                  <p className="text-gray-600">Notre équipe est là pour vous accompagner</p>
                </div>

                {/* Contact Methods */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Téléphone</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">Assistance téléphonique directe</p>
                      <p className="font-mono text-blue-600">+33 1 23 45 67 89</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Mail className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Email</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">Support par email</p>
                      <p className="font-mono text-green-600">support@logistique.com</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Hours & Availability */}
                <Card className="border-2 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Horaires de disponibilité</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">📞 Support téléphonique</h5>
                        <div className="space-y-1 text-gray-600">
                          <p>Lundi - Vendredi : 8h00 - 20h00</p>
                          <p>Samedi : 9h00 - 17h00</p>
                          <p>Dimanche : 10h00 - 16h00</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">💬 Chat & WhatsApp</h5>
                        <div className="space-y-1 text-gray-600">
                          <p className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Disponible 24h/24 - 7j/7
                          </p>
                          <p>Réponse sous 5 minutes</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">98.5%</div>
                    <div className="text-sm text-gray-600">Satisfaction client</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">&lt; 5min</div>
                    <div className="text-sm text-gray-600">Temps de réponse</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <div className="text-sm text-gray-600">Disponibilité</div>
                  </div>
                </div>

                {/* Contact Footer */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Besoin d'aide immédiate ?</p>
                  <div className="flex justify-center gap-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('chat')}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat Direct
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('whatsapp')}
                      className="hover:bg-green-50 hover:border-green-300"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
