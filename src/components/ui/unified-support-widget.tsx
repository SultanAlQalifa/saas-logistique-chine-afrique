'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Phone, Mail, ExternalLink, AlertCircle, Clock, CheckCircle, User, Bot, FileText, Download, Paperclip, MessageCircle, HelpCircle, Plus, Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import WhatsAppWidgetInterface from '@/components/whatsapp/WhatsAppWidgetInterface'
import { WidgetDeepLink } from '@/lib/widget-deep-link'
import OpenAIService from '@/lib/openai'

interface Message {
  id: number
  sender: string
  message: string
  time: string
  type: 'bot' | 'user' | 'agent'
  suggestions?: string[]
  actions?: Array<{
    type: string
    label: string
    data?: any
  }>
}

interface SupportWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function UnifiedSupportWidget({ 
  position = 'bottom-right'
}: SupportWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'contact' | 'whatsapp'>('chat')
  const [activeChannel, setActiveChannel] = useState<'web' | 'whatsapp'>('web')
  const [whatsappLinked, setWhatsappLinked] = useState(false)
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [showWhatsAppLinking, setShowWhatsAppLinking] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [linkingStep, setLinkingStep] = useState<'phone' | 'otp' | 'success'>('phone')
  const [newMessage, setNewMessage] = useState('')
  const deepLink = useRef<WidgetDeepLink | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      message: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
      time: '14:30',
      type: 'bot'
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'medium' })
  
  // Options prédéfinies pour les titres de tickets
  const ticketTitleOptions = [
    'Problème de livraison',
    'Retard de colis',
    'Colis endommagé',
    'Erreur de facturation',
    'Modification d\'adresse',
    'Demande de remboursement',
    'Question sur les tarifs',
    'Problème de suivi',
    'Réclamation qualité',
    'Demande d\'information',
    'Problème technique plateforme',
    'Autre (préciser en description)'
  ]
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Fonction pour forcer le scroll vers le bas
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current
      // Force scroll immédiat sans animation
      container.scrollTop = container.scrollHeight
    }
  }

  // Scroll automatique après chaque changement de messages
  useEffect(() => {
    const scrollToEnd = () => {
      if (chatContainerRef.current) {
        const container = chatContainerRef.current
        container.scrollTop = container.scrollHeight
      }
    }
    
    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
      scrollToEnd()
      // Forcer plusieurs tentatives
      setTimeout(scrollToEnd, 10)
      setTimeout(scrollToEnd, 50)
      setTimeout(scrollToEnd, 100)
      setTimeout(scrollToEnd, 200)
      setTimeout(scrollToEnd, 500)
    }, 0)
  }, [chatMessages])

  // Scroll spécifique pour l'indicateur de frappe
  useEffect(() => {
    if (isTyping && chatContainerRef.current) {
      const container = chatContainerRef.current
      setTimeout(() => {
        container.scrollTop = container.scrollHeight
      }, 100)
    }
  }, [isTyping])

  // Charger les messages depuis localStorage au démarrage
  useEffect(() => {
    const savedMessages = localStorage.getItem('support-chat-messages')
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        if (parsedMessages.length > 0) {
          setChatMessages(parsedMessages)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error)
      }
    }
  }, [])

  // Sauvegarder les messages dans localStorage (éviter la sauvegarde du message initial)
  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  // Initialiser le deep-link listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      deepLink.current = WidgetDeepLink.getInstance()
      
      const handleDeepLink = (params: any) => {
        console.log('Deep-link détecté:', params)
        
        // Ouvrir automatiquement le widget
        setIsOpen(true)
        
        // Définir le canal actif
        if (params.chan === 'wa') {
          setActiveChannel('whatsapp')
        }
        
        // Générer un message contextuel
        const contextualMessage = deepLink.current?.generateContextualMessage(params)
        if (contextualMessage) {
          const botMessage: Message = {
            id: Date.now(),
            sender: 'bot',
            message: contextualMessage.message,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            type: 'bot',
            suggestions: contextualMessage.suggestions,
            actions: contextualMessage.actions
          }
          
          setChatMessages(prev => [...prev, botMessage])
        }
        
        // Logger l'événement
        console.log('Deep-link traité:', params)
      }
      
      deepLink.current.addListener(handleDeepLink)
      
      return () => {
        if (deepLink.current) {
          deepLink.current.removeListener(handleDeepLink)
        }
      }
    }
  }, [])

  // Sauvegarder les messages dans localStorage (éviter la sauvegarde du message initial)
  useEffect(() => {
    if (chatMessages.length > 1 || (chatMessages.length === 1 && chatMessages[0].id !== 1)) {
      localStorage.setItem('support-chat-messages', JSON.stringify(chatMessages))
    }
  }, [chatMessages])

  // Mock data pour les tickets existants
  const myTickets = [
    {
      id: 'TK-001',
      title: 'Problème de livraison colis CO-001234',
      status: 'open',
      priority: 'high',
      created: '2024-01-15',
      lastUpdate: '2024-01-16',
      agent: 'Sarah Diop'
    },
    {
      id: 'TK-002', 
      title: 'Question sur les tarifs Chine-Sénégal',
      status: 'resolved',
      priority: 'medium',
      created: '2024-01-10',
      lastUpdate: '2024-01-12',
      agent: 'Moussa Kane'
    }
  ]

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const widgetPositionClasses = {
    'bottom-right': 'bottom-24 right-6',
    'bottom-left': 'bottom-24 left-6',
    'top-right': 'top-24 right-6',
    'top-left': 'top-24 left-6'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />
      case 'in_progress': return <Clock className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: chatMessages.length + 1,
        sender: 'user',
        message: newMessage,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'user'
      }
      
      setChatMessages(prev => [...prev, userMessage])
      const messageContent = newMessage
      setNewMessage('')
      setIsTyping(true)
      
      // Logique de réponse locale (sans API)
      setTimeout(() => {
        let botMessage = ''
        let responseType: 'bot' | 'agent' = 'bot'
        
        const lowerMessage = messageContent.toLowerCase()
        
        // Vérifier si l'utilisateur demande un humain
        const wantsHuman = lowerMessage.includes('humain') || 
                          lowerMessage.includes('agent') || 
                          lowerMessage.includes('personne') ||
                          lowerMessage.includes('parler à quelqu\'un') ||
                          lowerMessage.includes('support humain')
        
        if (wantsHuman) {
          botMessage = '👨‍💼 Je comprends parfaitement votre souhait de parler à un agent humain. C\'est avec plaisir que je vous mets en relation avec notre équipe support dédiée. Un de nos agents expérimentés va vous contacter dans les meilleurs délais via WhatsApp ou email. En attendant, je reste à votre entière disposition pour vous accompagner. Y a-t-il quelque chose de spécifique avec lequel je peux vous aider dès maintenant ?'
          responseType = 'agent'
        } else if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || lowerMessage.includes('bonsoir') || lowerMessage.includes('hey') || lowerMessage.includes('hi') || lowerMessage.includes('bonne journée') || lowerMessage.includes('good morning') || lowerMessage.includes('good evening')) {
          botMessage = '👋 Bonjour et bienvenue ! C\'est un réel plaisir de vous accueillir. Je suis votre assistant personnel NextMove, et je suis là pour vous accompagner dans tous vos besoins logistiques. Comment puis-je avoir l\'honneur de vous aider aujourd\'hui ? Je serais ravi de vous renseigner sur vos colis, nos tarifs, ou répondre à toutes vos questions.'
        } else if (lowerMessage.includes('ça va') || lowerMessage.includes('tu vas bien') || lowerMessage.includes('comment allez-vous')) {
          botMessage = '😊 Je vous remercie infiniment pour cette délicate attention ! Je vais très bien, merci beaucoup. C\'est vraiment un plaisir d\'être à votre service aujourd\'hui. Je suis entièrement dévoué à vous accompagner dans tous vos besoins logistiques. Avez-vous des questions concernant vos expéditions ou nos services ? Je serais honoré de pouvoir vous aider.'
        } else if (lowerMessage.includes('colis') || lowerMessage.includes('suivi') || lowerMessage.includes('tracking') || lowerMessage.includes('paquet') || lowerMessage.includes('expédition') || lowerMessage.includes('envoi') || lowerMessage.includes('commande') || lowerMessage.includes('livraison') || lowerMessage.includes('où est') || lowerMessage.includes('statut') || lowerMessage.includes('trace') || lowerMessage.includes('localiser')) {
          botMessage = '📦 Ce sera un plaisir de vous accompagner dans le suivi de votre colis ! Je suis là pour vous fournir toutes les informations dont vous avez besoin. Pourriez-vous, s\'il vous plaît, me communiquer votre numéro de suivi ? Il commence généralement par "CO-" suivi de chiffres. Je m\'empresserai de vous donner toutes les informations sur l\'état de votre expédition.'
        } else if (lowerMessage.includes('tarif') || lowerMessage.includes('prix') || lowerMessage.includes('coût') || lowerMessage.includes('combien') || lowerMessage.includes('montant') || lowerMessage.includes('facture') || lowerMessage.includes('devis') || lowerMessage.includes('estimation') || lowerMessage.includes('budget') || lowerMessage.includes('frais') || lowerMessage.includes('ça coûte') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
          botMessage = '💰 C\'est avec grand plaisir que je vais vous accompagner pour connaître nos tarifs ! Nos prix sont calculés avec la plus grande transparence et dépendent du mode de transport (maritime/aérien), du poids et du volume de votre expédition. Souhaiteriez-vous que je vous prépare un devis personnalisé ? Je serais ravi de vous proposer la meilleure solution adaptée à vos besoins.'
        } else if (lowerMessage.includes('livraison') || lowerMessage.includes('délai') || lowerMessage.includes('temps')) {
          botMessage = '🚚 Je serais ravi de vous informer sur nos délais de livraison ! Voici nos différentes options :\n\n• **Maritime** : 25-35 jours (idéal pour optimiser vos coûts)\n• **Aérien** : 5-7 jours (parfait pour vos urgences)\n• **Express** : 3-5 jours (notre service premium)\n\nQuel type d\'expédition vous intéresserait le plus ? Je serais honoré de vous conseiller la meilleure option selon vos besoins.'
        } else if (lowerMessage.includes('merci') || lowerMessage.includes('thank') || lowerMessage.includes('remercie') || lowerMessage.includes('thanks') || lowerMessage.includes('merci beaucoup') || lowerMessage.includes('je vous remercie') || lowerMessage.includes('grateful') || lowerMessage.includes('appreciate')) {
          botMessage = '🙏 C\'est moi qui vous remercie pour votre confiance ! C\'est un véritable plaisir et un honneur de pouvoir vous aider. N\'hésitez surtout pas à revenir vers moi pour toutes vos questions concernant nos services logistiques. Je reste à votre entière disposition avec le plus grand plaisir !'
        } else if (lowerMessage.includes('problème') || lowerMessage.includes('souci') || lowerMessage.includes('erreur') || lowerMessage.includes('bug') || lowerMessage.includes('dysfonctionnement') || lowerMessage.includes('panne') || lowerMessage.includes('difficulté') || lowerMessage.includes('incident') || lowerMessage.includes('ne marche pas') || lowerMessage.includes('ne fonctionne pas') || lowerMessage.includes('issue') || lowerMessage.includes('trouble') || lowerMessage.includes('broken')) {
          botMessage = '⚠️ Je suis sincèrement désolé d\'apprendre que vous rencontrez une difficulté. Votre satisfaction est notre priorité absolue, et je vais faire tout mon possible pour vous aider à résoudre cette situation. Pourriez-vous, s\'il vous plaît, me donner un peu plus de détails sur ce qui vous préoccupe ? Je m\'engage à vous accompagner personnellement ou à vous orienter vers la personne la plus compétente pour vous aider.'
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('téléphone') || lowerMessage.includes('email') || lowerMessage.includes('joindre') || lowerMessage.includes('appeler') || lowerMessage.includes('numéro') || lowerMessage.includes('mail') || lowerMessage.includes('coordonnées') || lowerMessage.includes('adresse') || lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('reach') || lowerMessage.includes('communicate')) {
          botMessage = '📞 Ce sera un plaisir de vous communiquer nos coordonnées ! Notre équipe est à votre entière disposition :\n\n• **Email** : support@nextmovecargo.com\n• **Téléphone** : +221 33 123 45 67\n• **WhatsApp Business** : disponible 24h/24 pour votre confort\n\nComment préféreriez-vous être contacté ? Nous nous ferons un plaisir de vous répondre dans les meilleurs délais.'
        } else if (lowerMessage.includes('nextmove') || lowerMessage.includes('plateforme') || lowerMessage.includes('saas') || lowerMessage.includes('présentation') || lowerMessage.includes('qui êtes-vous')) {
          botMessage = '🚀 **NextMove Cargo** - Votre partenaire SaaS logistique en Afrique !\n\n**🎯 Notre Mission :**\nDigitaliser et automatiser la gestion des expéditions en Afrique et à l\'international. Nous connectons tous les acteurs de la chaîne logistique dans un écosystème collaboratif.\n\n**👥 Qui utilise NextMove :**\n• **Entreprises clientes** : Transitaires, transporteurs, logisticiens, compagnies cargo, PME exportatrices\n• **Agents & employés** : Gestion des expéditions et services\n• **Clients finaux** : Suivi de colis, devis, support 24/7\n\n**💡 Valeur ajoutée :**\n• Digitalisation complète du secteur logistique\n• Réduction des coûts et délais\n• Simplicité d\'usage même pour les TPE\n• Premier SaaS logistique local en Afrique de l\'Ouest\n\n**🌍 Vision :** Devenir le leader africain du SaaS logistique collaboratif !'
        } else if (lowerMessage.includes('abonnement') || lowerMessage.includes('plan') || lowerMessage.includes('prix') && (lowerMessage.includes('entreprise') || lowerMessage.includes('société'))) {
          botMessage = '💼 **Nos abonnements entreprises** (paiements mensuels) :\n\n**📦 Basic - 30 000 FCFA/mois :**\n• Gestion de base des colis\n• Facturation simple\n• Support standard\n• Idéal pour les TPE\n\n**🚀 Pro - 75 000 FCFA/mois :**\n• Fonctionnalités avancées\n• API d\'intégration\n• Analytics détaillées\n• Support prioritaire\n\n**⭐ Premium - 150 000 FCFA/mois :**\n• Toutes les fonctionnalités\n• White-label personnalisé\n• Support dédié\n• Statistiques avancées\n\n**💰 Avantages :**\n• Paiements fractionnés possibles\n• Commission 0% (conforme aux principes islamiques)\n• 1 mois gratuit pour tester\n\nQuel plan correspond le mieux à vos besoins ?'
        } else if (lowerMessage.includes('fonctionnalité') || lowerMessage.includes('service') || lowerMessage.includes('que fait') || lowerMessage.includes('capacité')) {
          botMessage = '⚙️ **Fonctionnalités principales NextMove Cargo :**\n\n**📦 Gestion des colis :**\n• Calcul au kg (aérien) ou CBM (maritime)\n• Tracking numéro alphanumérique\n• Preuve de livraison (POD) avec photo et signature\n\n**💰 Facturation & Paiements :**\n• Devis et factures automatisés\n• Paiement en ligne sécurisé\n• Intégration Orange Money, Wave, PayPal\n\n**🤖 IA & Support :**\n• Assistant IA 24/7 (c\'est moi !)\n• Support client multilingue\n• Réponses automatiques intelligentes\n\n**📱 Notifications :**\n• Web, WhatsApp, Email, SMS\n• Suivi en temps réel\n• Alertes personnalisées\n\n**🎨 Personnalisation :**\n• Logos, couleurs, favicon\n• White-label complet\n• Blog & communauté intégrés\n\nQuelle fonctionnalité vous intéresse le plus ?'
        } else if (lowerMessage.includes('marché') || lowerMessage.includes('afrique') || lowerMessage.includes('concurrence') || lowerMessage.includes('leader')) {
          botMessage = '🌍 **NextMove Cargo sur le marché africain :**\n\n**📊 Contexte du marché :**\n• L\'Afrique de l\'Ouest connaît une forte croissance des échanges commerciaux\n• Marché du cargo : plusieurs milliards FCFA/an\n• Secteur peu digitalisé = opportunité énorme\n\n**🎯 Public cible :**\n• >50 000 entreprises logistiques en Afrique de l\'Ouest\n• 3 000 à 5 000 entreprises au Sénégal\n• PME exportatrices/importatrices\n• Startups logistiques locales\n\n**🏆 Notre avantage :**\n• **Aucun concurrent direct** sur le SaaS logistique local\n• Positionnement "First Mover"\n• Approche collaborative (pas compétitive)\n• Adaptation aux réalités locales\n\n**📈 Objectifs 6 mois :**\n• 100-250 entreprises abonnées\n• 2 000-10 000 utilisateurs finaux\n• Extension vers toute l\'Afrique\n\nRejoignez la révolution logistique africaine !'
        } else if (lowerMessage.includes('cbm') || lowerMessage.includes('m³') || lowerMessage.includes('volume') || lowerMessage.includes('calcul par cbm') || lowerMessage.includes('mètre cube') || lowerMessage.includes('calcul de cbm')) {
          botMessage = '📏 Excellente question ! Le **CBM (Cubic Meter)** ou **m³** est une unité de mesure du volume utilisée en logistique :\n\n**🧮 Comment calculer le CBM :**\n• **Formule** : Longueur × Largeur × Hauteur (en mètres)\n• **Exemple** : Un colis de 1,2m × 0,8m × 0,5m = 0,48 m³\n\n**💰 Pourquoi c\'est important :**\n• Le transport maritime se facture au **volume (CBM)**\n• Tarif : 650 FCFA/m³ (Standard) ou 850 FCFA/m³ (Express)\n• Plus économique pour les marchandises volumineuses mais légères\n\n**⚖️ CBM vs Poids :**\n• **Maritime** : Facturation au volume (CBM)\n• **Aérien** : Facturation au poids (kg)\n\n**🎯 Conseil pratique :**\nSi votre colis fait plus de 167 kg par m³, choisissez le maritime. Sinon, comparez avec l\'aérien !\n\nAvez-vous des dimensions spécifiques à calculer ?'
        } else if (lowerMessage.includes('différence') || lowerMessage.includes('basic vs pro') || lowerMessage.includes('pro vs premium') || lowerMessage.includes('comparaison plan')) {
          botMessage = '📊 **Comparaison détaillée de nos plans :**\n\n**📦 Basic (30 000 FCFA/mois) :**\n• Gestion simple des colis, factures et suivi\n• Fonctionnalités de base\n• Support standard\n• Idéal pour débuter\n\n**🚀 Pro (75 000 FCFA/mois) :**\n• API d\'intégration\n• Automatisations avancées\n• Rapports détaillés\n• Analytics approfondies\n• Support prioritaire\n\n**⭐ Premium (150 000 FCFA/mois) :**\n• Personnalisation totale (white-label)\n• Branding complet\n• Statistiques premium\n• Support dédié\n• Toutes les fonctionnalités\n\n**💰 Avantages communs :**\n• Paiements fractionnés possibles\n• Commission 0% (conforme principes islamiques)\n• 1 mois gratuit d\'essai\n\nQuel plan correspond à vos besoins ?'
        } else if (lowerMessage.includes('commission') || lowerMessage.includes('frais supplémentaire') || lowerMessage.includes('coût caché') || lowerMessage.includes('riiba')) {
          botMessage = '💰 **Politique tarifaire transparente NextMove :**\n\n**✅ Aucun frais caché :**\n• Tarifs clairs et transparents\n• Pas de commission sur les transactions\n• **Commission 0%** (conforme aux principes islamiques - pas de riiba)\n\n**💳 Paiements flexibles :**\n• **Paiements fractionnés** possibles\n• Facilités de paiement adaptées\n• Respect des principes éthiques\n\n**🎁 Avantages inclus :**\n• 1 mois gratuit d\'essai\n• Formation gratuite\n• Support technique inclus\n• Mises à jour automatiques\n\n**📊 Tarification simple :**\n• Basic : 30 000 FCFA/mois (tout inclus)\n• Pro : 75 000 FCFA/mois (tout inclus)\n• Premium : 150 000 FCFA/mois (tout inclus)\n\n**🤝 Notre engagement :**\nTransparence totale, éthique commerciale et respect des valeurs africaines !'
        } else if (lowerMessage.includes('qui peut utiliser') || lowerMessage.includes('public cible') || lowerMessage.includes('utilisateurs') || lowerMessage.includes('clients type')) {
          botMessage = '👥 **Qui peut utiliser NextMove Cargo ?**\n\n**🏢 Entreprises principales :**\n• **Transitaires & logisticiens** : Gestion complète des expéditions\n• **Compagnies transport** : Maritime, aérien, routier\n• **PME exportatrices/importatrices** : Simplification des processus\n• **Entreprises e-commerce** : Intégration logistique\n\n**👤 Utilisateurs finaux :**\n• **Clients particuliers** : Suivi de colis en temps réel\n• **Agents & employés** : Outils de gestion quotidienne\n• **Partenaires** : Réseau collaboratif\n\n**🎯 Secteurs d\'activité :**\n• Import/Export\n• E-commerce\n• Distribution\n• Manufacturing\n• Services logistiques\n\n**💼 Tailles d\'entreprises :**\n• TPE (très petites entreprises)\n• PME (petites et moyennes entreprises)\n• Grandes entreprises\n• Startups logistiques\n\nNextMove s\'adapte à tous les profils !'
        } else if (lowerMessage.includes('kg') || lowerMessage.includes('kilogramme') || lowerMessage.includes('poids') || lowerMessage.includes('calcul par kg') || lowerMessage.includes('calcul au poids')) {
          botMessage = '⚖️ Excellente question ! Le **kg (kilogramme)** est l\'unité de mesure du poids utilisée pour le transport aérien :\n\n**🧮 Comment fonctionne le calcul au kg :**\n• **Principe** : Facturation basée sur le poids total de votre colis\n• **Exemple** : Un colis de 25 kg coûtera 25 × tarif/kg\n\n**💰 Nos tarifs aériens :**\n• **Aérien Standard** : 5 200 FCFA/kg (5-7 jours)\n• **Aérien Express** : 8 500 FCFA/kg (3-5 jours)\n• Idéal pour les marchandises lourdes mais compactes\n\n**⚖️ Poids vs Volume :**\n• **Aérien** : Facturation au poids (kg)\n• **Maritime** : Facturation au volume (CBM)\n\n**🎯 Conseil pratique :**\nSi votre colis fait moins de 167 kg par m³, l\'aérien peut être plus économique. Pour les objets lourds et compacts, c\'est souvent le meilleur choix !\n\n**📦 Exemples typiques :**\n• Documents, livres, échantillons\n• Produits électroniques compacts\n• Pièces détachées métalliques\n\nQuel est le poids approximatif de votre envoi ?'
        } else {
          botMessage = '🤖 Je suis l\'agent virtuel officiel de NextMove Cargo. Je vais transmettre votre demande à notre support humain. Un agent vous contactera rapidement pour vous fournir une réponse précise.\n\n📞 **Contact direct :**\n• Email : support@nextmovecargo.com\n• Téléphone : +221 33 123 45 67\n• WhatsApp Business : 24h/24\n\nEn attendant, n\'hésitez pas à me poser des questions sur nos tarifs (30 000 à 150 000 FCFA/mois), nos services de suivi de colis, ou nos modes de transport.'
        }

        const botResponse = {
          id: Date.now(),
          sender: responseType,
          message: botMessage,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          type: responseType
        }
        
        setChatMessages(prev => [...prev, botResponse])
        setIsTyping(false)
      }, 1000)
    }
  }

  const handleCreateTicket = () => {
    if (newTicket.title && newTicket.description) {
      // Logique pour créer un nouveau ticket
      console.log('Nouveau ticket:', newTicket)
      setNewTicket({ title: '', description: '', priority: 'medium' })
      setShowNewTicket(false)
    }
  }

  const handleAction = (action: { type: string; label: string; data?: any; }) => {
    console.log('Action déclenchée:', action)
    
    switch (action.type) {
      case 'view_shipment':
        // Rediriger vers la page de suivi
        if (action.data?.shipmentId) {
          window.open(`/dashboard/shipments/${action.data.shipmentId}`, '_blank')
        }
        break
      
      case 'download_invoice':
        // Télécharger la facture
        if (action.data?.invoiceId) {
          window.open(`/api/invoices/${action.data.invoiceId}/download`, '_blank')
        }
        break
      
      case 'contact_agent':
        // Ouvrir le formulaire de contact ou escalader
        setActiveTab('contact')
        break
      
      case 'create_quote':
        // Rediriger vers la création de devis
        window.open('/dashboard/quotes/new', '_blank')
        break

      case 'link_whatsapp':
        // Ouvrir le flow de liaison WhatsApp
        setShowWhatsAppLinking(true)
        setLinkingStep('phone')
        break

      case 'invoices':
        // Envoyer directement le message pour voir les factures
        const invoiceMessage: Message = {
          id: Date.now(),
          sender: 'user',
          message: 'Voir mes factures',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          type: 'user'
        }
        setChatMessages(prev => [...prev, invoiceMessage])
        setNewMessage('Voir mes factures')
        setTimeout(() => handleSendMessage(), 100)
        break

      case 'documentation':
        // Envoyer directement le message pour la documentation
        const docMessage: Message = {
          id: Date.now(),
          sender: 'user',
          message: 'Voir la documentation',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          type: 'user'
        }
        setChatMessages(prev => [...prev, docMessage])
        setNewMessage('Voir la documentation')
        setTimeout(() => handleSendMessage(), 100)
        break
      
      default:
        console.log('Action non reconnue:', action.type)
    }
  }

  const handleWhatsAppLinking = async () => {
    if (linkingStep === 'phone') {
      if (!whatsappPhone) {
        alert('Veuillez saisir votre numéro de téléphone')
        return
      }

      try {
        const response = await fetch('/api/whatsapp/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: whatsappPhone })
        })

        const data = await response.json()
        
        if (data.success) {
          setOtpSent(true)
          setLinkingStep('otp')
        } else {
          alert(data.message || 'Erreur lors de l\'envoi du code')
        }
      } catch (error) {
        console.error('Erreur liaison WhatsApp:', error)
        alert('Erreur technique. Réessayez plus tard.')
      }
    } else if (linkingStep === 'otp') {
      if (!otpCode) {
        alert('Veuillez saisir le code de vérification')
        return
      }

      try {
        const response = await fetch('/api/whatsapp/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phoneNumber: whatsappPhone,
            otp: otpCode
          })
        })

        const data = await response.json()
        
        if (data.success) {
          setWhatsappLinked(true)
          setLinkingStep('success')
          setActiveChannel('whatsapp')
          setTimeout(() => {
            setShowWhatsAppLinking(false)
          }, 2000)
        } else {
          alert(data.message || 'Code de vérification incorrect')
        }
      } catch (error) {
        console.error('Erreur vérification OTP:', error)
        alert('Erreur technique. Réessayez plus tard.')
      }
    }
  }

  const tabs = [
    { id: 'chat' as const, label: 'Chat Support', icon: MessageSquare },
    { id: 'tickets' as const, label: 'Mes Tickets', icon: Plus },
    { id: 'contact' as const, label: 'Nous Contacter', icon: Phone },
    { id: 'whatsapp' as const, label: 'Chat WhatsApp', icon: MessageCircle },
  ]

  if (!isOpen) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <div className="relative">
          {/* Main Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
            title="Ouvrir le Support"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
          
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              💬 Support - Disponible 24/7
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
      {/* Support Widget Window */}
      <div className={`fixed ${widgetPositionClasses[position]} z-40 ${isMinimized ? 'w-48' : 'w-96'} ${isMinimized ? 'h-16' : 'h-[600px]'} transition-all duration-300`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r from-purple-500 to-pink-600 text-white ${isMinimized ? 'p-1' : 'p-4'} rounded-t-2xl flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`bg-white/20 ${isMinimized ? 'p-0.5' : 'p-2'} rounded-lg`}>
                <HelpCircle className={`${isMinimized ? 'h-3 w-3' : 'h-5 w-5'}`} />
              </div>
              {!isMinimized && (
                <div>
                  <h3 className="font-bold text-sm">Mon Support</h3>
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Support Actif 24/7</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className={`text-white hover:bg-white/20 ${isMinimized ? 'h-6 w-6' : 'h-8 w-8'} p-0 rounded-lg flex items-center justify-center transition-colors`}
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`text-white hover:bg-white/20 ${isMinimized ? 'h-6 w-6' : 'h-8 w-8'} p-0 rounded-lg flex items-center justify-center transition-colors`}
              >
                <X className={`${isMinimized ? 'h-3 w-3' : 'h-4 w-4'}`} />
              </button>
            </div>
          </div>

          {/* Widget Content */}
          {!isMinimized && (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Navigation par onglets */}
              <div className="border-b border-gray-200 px-4">
                <nav className="-mb-px flex space-x-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-xs flex items-center gap-1 ${
                          activeTab === tab.id
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Contenu des onglets */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'chat' && (
                  <div className="p-4 flex flex-col h-full">

                    {/* Zone de chat */}
                    <div className="flex-1 border border-gray-200 rounded-lg flex flex-col">
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-2 space-y-2 scroll-smooth min-h-0" ref={chatContainerRef}>
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-3 py-2 rounded-lg break-words text-xs relative ${
                              msg.type === 'user' 
                                ? 'bg-purple-500 text-white' 
                                : msg.type === 'bot'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-green-100 text-green-900'
                            }`}>
                              {/* Badge WhatsApp */}
                              {activeChannel === 'whatsapp' && (
                                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full">
                                  WA
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1 mb-1">
                                {msg.type === 'bot' && <Bot className="h-3 w-3 flex-shrink-0" />}
                                {msg.type === 'agent' && <User className="h-3 w-3 flex-shrink-0" />}
                                {msg.type === 'user' && <User className="h-3 w-3 flex-shrink-0" />}
                                <span className="text-xs font-medium">
                                  {msg.type === 'bot' ? 'IA NextMove' : msg.type === 'agent' ? 'Agent' : 'Vous'}
                                </span>
                                <span className="text-xs opacity-75">{msg.time}</span>
                                {activeChannel === 'whatsapp' && (
                                  <span className="text-xs opacity-75">📱</span>
                                )}
                              </div>
                              <div className="text-xs leading-relaxed whitespace-pre-line">{msg.message}</div>
                              
                              {/* Suggestions rapides */}
                              {msg.suggestions && msg.suggestions.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {msg.suggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        // Envoyer directement le message au lieu de le mettre dans l'input
                                        const userMessage: Message = {
                                          id: Date.now(),
                                          sender: 'user',
                                          message: suggestion,
                                          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                                          type: 'user'
                                        }
                                        setChatMessages(prev => [...prev, userMessage])
                                        setNewMessage(suggestion)
                                        setTimeout(() => handleSendMessage(), 100)
                                      }}
                                      className="px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs border border-current border-opacity-30 transition-all"
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                              
                              {/* Boutons d'action */}
                              {msg.actions && msg.actions.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {msg.actions.map((action, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleAction(action)}
                                      className="w-full px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs border border-current border-opacity-30 transition-all flex items-center gap-1"
                                    >
                                      {action.type === 'view_shipment' && <ExternalLink className="h-3 w-3" />}
                                      {action.type === 'download_invoice' && <ExternalLink className="h-3 w-3" />}
                                      {action.type === 'contact_agent' && <Phone className="h-3 w-3" />}
                                      {action.type === 'create_quote' && <Plus className="h-3 w-3" />}
                                      {action.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Indicateur de frappe */}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="max-w-[80%] px-3 py-2 rounded-lg bg-blue-100 text-blue-900">
                              <div className="flex items-center gap-1 mb-1">
                                <Bot className="h-3 w-3 flex-shrink-0" />
                                <span className="text-xs font-medium">IA NextMove</span>
                                <span className="text-xs opacity-75">en train d'écrire...</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={(el) => {
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' })
                          }
                        }} />
                      </div>

                      {/* Actions rapides fixes */}
                      <div className="border-t border-gray-100 px-1 py-0.5 bg-gray-50">
                        <div className="text-xs text-gray-600 mb-0.5 font-medium">Actions rapides :</div>
                        <div className="grid grid-cols-5 gap-0.5">
                          <button
                            onClick={() => {
                              const userMessage: Message = {
                                id: Date.now(),
                                sender: 'user',
                                message: 'Connexion',
                                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                                type: 'user'
                              }
                              setChatMessages(prev => [...prev, userMessage])
                              setNewMessage('Connexion')
                              setTimeout(() => handleSendMessage(), 100)
                            }}
                            className="p-1 bg-yellow-100 hover:bg-yellow-200 rounded text-sm transition-colors flex items-center justify-center"
                            title="Connexion"
                          >
                            🔑
                          </button>
                          <button
                            onClick={() => {
                              const userMessage: Message = {
                                id: Date.now(),
                                sender: 'user',
                                message: 'Suivre mes colis',
                                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                                type: 'user'
                              }
                              setChatMessages(prev => [...prev, userMessage])
                              setNewMessage('Suivre mes colis')
                              setTimeout(() => handleSendMessage(), 100)
                            }}
                            className="p-1 bg-blue-100 hover:bg-blue-200 rounded text-sm transition-colors flex items-center justify-center"
                            title="Suivre mes colis"
                          >
                            📦
                          </button>
                          <button
                            onClick={() => {
                              const userMessage: Message = {
                                id: Date.now(),
                                sender: 'user',
                                message: 'Voir mes factures',
                                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                                type: 'user'
                              }
                              setChatMessages(prev => [...prev, userMessage])
                              setNewMessage('Voir mes factures')
                              setTimeout(() => handleSendMessage(), 100)
                            }}
                            className="p-1 bg-green-100 hover:bg-green-200 rounded text-sm transition-colors flex items-center justify-center"
                            title="Voir mes factures"
                          >
                            💰
                          </button>
                          <button
                            onClick={() => {
                              const userMessage: Message = {
                                id: Date.now(),
                                sender: 'user',
                                message: 'Créer un devis',
                                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                                type: 'user'
                              }
                              setChatMessages(prev => [...prev, userMessage])
                              setNewMessage('Créer un devis')
                              setTimeout(() => handleSendMessage(), 100)
                            }}
                            className="p-1 bg-purple-100 hover:bg-purple-200 rounded text-sm transition-colors flex items-center justify-center"
                            title="Créer un devis"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => {
                              const userMessage: Message = {
                                id: Date.now(),
                                sender: 'user',
                                message: 'Documentation',
                                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                                type: 'user'
                              }
                              setChatMessages(prev => [...prev, userMessage])
                              setNewMessage('Documentation')
                              setTimeout(() => handleSendMessage(), 100)
                            }}
                            className="p-1 bg-orange-100 hover:bg-orange-200 rounded text-sm transition-colors flex items-center justify-center"
                            title="Documentation"
                          >
                            📚
                          </button>
                        </div>
                      </div>

                      {/* Zone de saisie */}
                      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-2 z-10">
                        {activeChannel === 'whatsapp' && !whatsappLinked && (
                          <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                            📱 Liez WhatsApp pour recevoir et envoyer des messages ici même
                            <button 
                              onClick={() => setShowWhatsAppLinking(true)}
                              className="ml-2 underline hover:no-underline"
                            >
                              Lier maintenant
                            </button>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*,application/pdf,.doc,.docx,.txt';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  // Simuler l'upload du fichier
                                  const fileMessage = `📎 Fichier joint: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                                  setNewMessage(fileMessage);
                                }
                              };
                              input.click();
                            }}
                          >
                            <Paperclip className="h-4 w-4" />
                          </button>
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={activeChannel === 'whatsapp' ? "Message via WhatsApp..." : "Tapez votre message..."}
                            className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={activeChannel === 'whatsapp' && !whatsappLinked}
                          />
                          <button
                            onClick={() => {
                              setChatMessages([]);
                              setNewMessage('');
                              setIsTyping(false);
                            }}
                            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white p-1 rounded-lg transition-all duration-200 transform hover:scale-105"
                            title="Réinitialiser la conversation"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isTyping || (activeChannel === 'whatsapp' && !whatsappLinked)}
                            className="bg-purple-500 text-white p-1 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tickets' && (
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">🎫 Mes Tickets</h3>
                        <p className="text-xs text-gray-600">Gérez vos demandes</p>
                      </div>
                      <button
                        onClick={() => setShowNewTicket(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Nouveau
                      </button>
                    </div>

                    {/* Formulaire nouveau ticket */}
                    {showNewTicket && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-semibold">Nouveau ticket</h3>
                          <button
                            onClick={() => setShowNewTicket(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Titre</label>
                            <select
                              value={newTicket.title}
                              onChange={(e) => setNewTicket(prev => ({...prev, title: e.target.value}))}
                              className="w-full border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="">Sélectionnez le type de problème</option>
                              {ticketTitleOptions.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={newTicket.description}
                              onChange={(e) => setNewTicket(prev => ({...prev, description: e.target.value}))}
                              rows={3}
                              className="w-full border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Décrivez votre problème..."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Priorité</label>
                            <select
                              value={newTicket.priority}
                              onChange={(e) => setNewTicket(prev => ({...prev, priority: e.target.value}))}
                              className="w-full border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="low">Basse</option>
                              <option value="medium">Moyenne</option>
                              <option value="high">Haute</option>
                            </select>
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => setShowNewTicket(false)}
                              className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={handleCreateTicket}
                              className="flex-1 px-3 py-1 bg-purple-500 text-white rounded-lg text-xs hover:bg-purple-600"
                            >
                              Créer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Liste des tickets */}
                    <div className="space-y-3">
                      {myTickets.map((ticket) => (
                        <div key={ticket.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-gray-500">{ticket.id}</span>
                                <div className={`flex items-center gap-1 px-1 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                  {getStatusIcon(ticket.status)}
                                  {ticket.status === 'open' ? 'Ouvert' : ticket.status === 'in_progress' ? 'En cours' : 'Résolu'}
                                </div>
                              </div>
                              <h4 className="font-medium text-xs text-gray-900 mb-1">{ticket.title}</h4>
                              <div className="text-xs text-gray-500">
                                <span>Créé le {ticket.created}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'whatsapp' && (
                  <div className="space-y-4">
                    {/* Header WhatsApp */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <MessageCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold">WhatsApp Business</h3>
                            <p className="text-xs text-green-100">NextMove Support</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                          <span className="text-xs">En ligne</span>
                        </div>
                      </div>
                      <div className="text-xs text-green-100">
                        📞 +221 77 123 45 67 • 3 agents disponibles • Support 24/7
                      </div>
                    </div>

                    {/* Interface WhatsApp complète pour widget */}
                    <WhatsAppWidgetInterface />
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-lg">
                        <Phone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">📞 Nous Contacter</h3>
                        <p className="text-xs text-gray-600">Différents moyens de nous joindre</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Email */}
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <h4 className="font-medium text-xs text-gray-900">Email</h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          support@nextmovecargo.com<br />
                          Réponse sous 2h en moyenne
                        </p>
                        <button 
                          onClick={() => window.open('mailto:support@nextmovecargo.com?subject=Demande de support - NextMove Cargo', '_blank')}
                          className="w-full bg-blue-500 text-white py-1 rounded-lg text-xs hover:bg-blue-600 transition-colors"
                        >
                          Envoyer un email
                        </button>
                      </div>

                      {/* Téléphone */}
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="h-4 w-4 text-purple-600" />
                          <h4 className="font-medium text-xs text-gray-900">Téléphone</h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          +221 33 123 45 67<br />
                          Lun-Ven: 8h-18h, Sam: 9h-13h
                        </p>
                        <button 
                          onClick={() => window.open('tel:+22133123456', '_self')}
                          className="w-full bg-purple-500 text-white py-1 rounded-lg text-xs hover:bg-purple-600 transition-colors"
                        >
                          Appeler maintenant
                        </button>
                      </div>

                      {/* Horaires */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium text-xs text-gray-900 mb-2">⏰ Horaires de Support</h4>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>Chat & WhatsApp:</span>
                            <span className="font-medium">24h/24 - 7j/7</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Téléphone:</span>
                            <span className="font-medium">Lun-Ven 8h-18h</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Email:</span>
                            <span className="font-medium">Réponse sous 2h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Button when open */}
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <button
          onClick={() => setIsOpen(false)}
          className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          title="Fermer le Support"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </>
  )
}
