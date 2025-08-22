'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Plus, Send, Paperclip, Phone, Mail, ExternalLink, AlertCircle, Clock, CheckCircle, MessageCircle, User, Bot, FileText, Download, X } from 'lucide-react'
import WhatsAppInterface from '@/components/whatsapp/WhatsAppInterface'
import Link from 'next/link'

export default function ClientSupportPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'contact' | 'whatsapp'>('chat')
  const [newMessage, setNewMessage] = useState('')
  const [newTicketTitle, setNewTicketTitle] = useState('')
  
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
  const [newTicketDescription, setNewTicketDescription] = useState('')
  const [newTicketPriority, setNewTicketPriority] = useState('medium')
  const [showNewTicket, setShowNewTicket] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // Separate state for chat and WhatsApp messages to avoid mixing conversations
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      message: 'Bonjour Aminata ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
      time: '14:30',
      type: 'bot' as const
    },
    {
      id: 2,
      sender: 'user',
      message: 'Bonjour, j\'aimerais connaître le statut de mon colis CO-001234',
      time: '14:32',
      type: 'user' as const
    },
    {
      id: 3,
      sender: 'bot',
      message: 'Je vérifie le statut de votre colis CO-001234... Votre colis est actuellement en transit et devrait arriver demain à Dakar.',
      time: '14:33',
      type: 'bot' as const
    },
    {
      id: 4,
      sender: 'agent',
      message: 'Bonjour Aminata, je suis Sarah, votre agent support. Je vois que vous vous renseignez sur le colis CO-001234. Tout est en ordre, livraison prévue demain entre 9h et 17h.',
      time: '14:45',
      type: 'agent' as const
    }
  ])

  // Separate state for WhatsApp messages
  const [whatsappMessages, setWhatsappMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      message: 'Bienvenue sur WhatsApp Business NextMove ! Comment puis-je vous aider ?',
      time: '14:00',
      type: 'bot' as const
    }
  ])

  // Fonction pour scroll automatique vers le bas
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      container.scrollTop = container.scrollHeight
    }
  }

  // Auto-scroll quand les messages changent
  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, whatsappMessages])

  // Observer les changements de taille du conteneur
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const resizeObserver = new ResizeObserver(() => {
        scrollToBottom()
      })
      
      resizeObserver.observe(container)
      
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [activeTab])

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
    },
    {
      id: 'TK-003',
      title: 'Demande de modification adresse',
      status: 'in_progress',
      priority: 'low',
      created: '2024-01-08',
      lastUpdate: '2024-01-14',
      agent: 'Fatou Sall'
    }
  ]


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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Ajouter le message à la conversation
      const newMsg = {
        id: chatMessages.length + 1,
        sender: 'user',
        message: newMessage,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: 'user' as const
      }
      
      setChatMessages(prev => [...prev, newMsg])
      const userMessage = newMessage
      setNewMessage('')
      
      // Vérifier si l'utilisateur demande un humain
      const wantsHuman = userMessage.toLowerCase().includes('humain') || 
                        userMessage.toLowerCase().includes('agent') || 
                        userMessage.toLowerCase().includes('personne') ||
                        userMessage.toLowerCase().includes('parler à quelqu\'un') ||
                        userMessage.toLowerCase().includes('support humain')
      
      // Simuler une réponse de l'IA après un délai
      setTimeout(() => {
        let botMessage = ''
        let responseType: 'bot' | 'agent' = 'bot'
        
        const lowerMessage = userMessage.toLowerCase()
        
        if (wantsHuman) {
          botMessage = '👨‍💼 Je comprends parfaitement votre souhait de parler à un agent humain. C\'est avec plaisir que je vous mets en relation avec notre équipe support dédiée. Un de nos agents expérimentés va vous contacter dans les meilleurs délais via WhatsApp ou email. En attendant, je reste à votre entière disposition pour vous accompagner. Y a-t-il quelque chose de spécifique avec lequel je peux vous aider dès maintenant ?'
          responseType = 'agent'
        } else if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || lowerMessage.includes('bonsoir') || lowerMessage.includes('hey') || lowerMessage.includes('hi') || lowerMessage.includes('bonne journée') || lowerMessage.includes('good morning') || lowerMessage.includes('good evening')) {
            botMessage = '👋 Bonjour ! Je suis l\'agent virtuel officiel NextMove Cargo.\n\n**💰 Nos tarifs :**\n• Basic : 30 000 FCFA/mois\n• Pro : 75 000 FCFA/mois\n• Premium : 150 000 FCFA/mois\n\n**🚚 Transport :**\n• Maritime : 650-850 FCFA/m³\n• Aérien : 5 200-8 500 FCFA/kg\n\nComment puis-je vous aider précisément ?'
          } else if (lowerMessage.includes('ça va') || lowerMessage.includes('tu vas bien') || lowerMessage.includes('comment allez-vous')) {
            botMessage = '😊 Merci ! Je suis opérationnel 24h/24.\n\n**Questions fréquentes :**\n• Tarifs abonnements : 30 000 à 150 000 FCFA/mois\n• Transport maritime : 650 FCFA/m³ (25-35 jours)\n• Transport aérien : 5 200 FCFA/kg (5-7 jours)\n• Suivi de colis avec numéro CO-\n\nQuelle information précise recherchez-vous ?'
          } else if (lowerMessage.includes('colis') || lowerMessage.includes('suivi') || lowerMessage.includes('tracking') || lowerMessage.includes('paquet') || lowerMessage.includes('expédition') || lowerMessage.includes('envoi') || lowerMessage.includes('commande') || lowerMessage.includes('livraison') || lowerMessage.includes('où est') || lowerMessage.includes('statut') || lowerMessage.includes('trace') || lowerMessage.includes('localiser')) {
            botMessage = '📦 Ce sera un plaisir de vous accompagner dans le suivi de votre colis ! Je suis là pour vous fournir toutes les informations dont vous avez besoin. Pourriez-vous, s\'il vous plaît, me communiquer votre numéro de suivi ? Il commence généralement par "CO-" suivi de chiffres. Je m\'empresserai de vous donner toutes les informations sur l\'état de votre expédition.'
          } else if (lowerMessage.includes('tarif') || lowerMessage.includes('prix') || lowerMessage.includes('coût') || lowerMessage.includes('combien') || lowerMessage.includes('montant') || lowerMessage.includes('facture') || lowerMessage.includes('devis') || lowerMessage.includes('estimation') || lowerMessage.includes('budget') || lowerMessage.includes('frais') || lowerMessage.includes('ça coûte') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            botMessage = '💰 **Tarifs NextMove Cargo (FCFA uniquement) :**\n\n**Abonnements entreprises :**\n• Basic : 30 000 FCFA/mois\n• Pro : 75 000 FCFA/mois\n• Premium : 150 000 FCFA/mois\n• Paiement fractionné accepté, commission 0%\n\n**Transport :**\n• Maritime : 650 FCFA/m³ (Standard), 850 FCFA/m³ (Express)\n• Aérien : 5 200 FCFA/kg (Standard), 8 500 FCFA/kg (Express)\n\nQuel type de tarif vous intéresse ?'
          } else if (lowerMessage.includes('livraison') || lowerMessage.includes('délai') || lowerMessage.includes('temps')) {
            botMessage = '🚚 Je serais ravi de vous informer sur nos délais de livraison ! Voici nos différentes options :\n\n• **Maritime** : 25-35 jours (idéal pour optimiser vos coûts)\n• **Aérien** : 5-7 jours (parfait pour vos urgences)\n• **Express** : 3-5 jours (notre service premium)\n\nQuel type d\'expédition vous intéresserait le plus ? Je serais honoré de vous conseiller la meilleure option selon vos besoins.'
          } else if (lowerMessage.includes('merci') || lowerMessage.includes('thank') || lowerMessage.includes('remercie') || lowerMessage.includes('thanks') || lowerMessage.includes('merci beaucoup') || lowerMessage.includes('je vous remercie') || lowerMessage.includes('grateful') || lowerMessage.includes('appreciate')) {
            botMessage = '🙏 De rien ! NextMove Cargo à votre service.\n\n**Rappel de nos services :**\n• Suivi colis 24h/24\n• Tarifs transparents en FCFA\n• Support multicanal\n• Paiement fractionné sans commission\n\nAutre chose ?'
          } else if (lowerMessage.includes('problème') || lowerMessage.includes('souci') || lowerMessage.includes('erreur') || lowerMessage.includes('bug') || lowerMessage.includes('dysfonctionnement') || lowerMessage.includes('panne') || lowerMessage.includes('difficulté') || lowerMessage.includes('incident') || lowerMessage.includes('ne marche pas') || lowerMessage.includes('ne fonctionne pas') || lowerMessage.includes('issue') || lowerMessage.includes('trouble') || lowerMessage.includes('broken')) {
            botMessage = '⚠️ Je suis sincèrement désolé d\'apprendre que vous rencontrez une difficulté. Votre satisfaction est notre priorité absolue, et je vais faire tout mon possible pour vous aider à résoudre cette situation. Pourriez-vous, s\'il vous plaît, me donner un peu plus de détails sur ce qui vous préoccupe ? Je m\'engage à vous accompagner personnellement ou à vous orienter vers la personne la plus compétente pour vous aider.'
          } else if (lowerMessage.includes('contact') || lowerMessage.includes('téléphone') || lowerMessage.includes('email') || lowerMessage.includes('joindre') || lowerMessage.includes('appeler') || lowerMessage.includes('numéro') || lowerMessage.includes('mail') || lowerMessage.includes('coordonnées') || lowerMessage.includes('adresse') || lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('reach') || lowerMessage.includes('communicate')) {
            botMessage = '📞 Ce sera un plaisir de vous communiquer nos coordonnées ! Notre équipe est à votre entière disposition :\n\n• **Email** : support@nextmovecargo.com\n• **Téléphone** : +221 33 123 45 67\n• **WhatsApp Business** : disponible 24h/24 pour votre confort\n\nComment préféreriez-vous être contacté ? Nous nous ferons un plaisir de vous répondre dans les meilleurs délais.'
          } else if (lowerMessage.includes('commission') || lowerMessage.includes('frais supplémentaire') || lowerMessage.includes('coût caché') || lowerMessage.includes('riiba')) {
            botMessage = '💰 **Politique tarifaire transparente NextMove :**\n\n**✅ Aucun frais caché :**\n• Tarifs clairs et transparents\n• Pas de commission sur les transactions\n• **Commission 0%** (conforme aux principes islamiques - pas de riiba)\n\n**💳 Paiements flexibles :**\n• **Paiements fractionnés** possibles\n• Facilités de paiement adaptées\n• Respect des principes éthiques\n\n**🎁 Avantages inclus :**\n• 1 mois gratuit d\'essai\n• Formation gratuite\n• Support technique inclus\n• Mises à jour automatiques\n\n**📊 Tarification simple :**\n• Basic : 30 000 FCFA/mois (tout inclus)\n• Pro : 75 000 FCFA/mois (tout inclus)\n• Premium : 150 000 FCFA/mois (tout inclus)\n\n**🤝 Notre engagement :**\nTransparence totale, éthique commerciale et respect des valeurs africaines !'
          } else if (lowerMessage.includes('kg') || lowerMessage.includes('kilogramme') || lowerMessage.includes('poids') || lowerMessage.includes('calcul par kg') || lowerMessage.includes('calcul au poids')) {
            botMessage = '⚖️ Excellente question ! Le **kg (kilogramme)** est l\'unité de mesure du poids utilisée pour le transport aérien :\n\n**🧮 Comment fonctionne le calcul au kg :**\n• **Principe** : Facturation basée sur le poids total de votre colis\n• **Exemple** : Un colis de 25 kg coûtera 25 × tarif/kg\n\n**💰 Nos tarifs aériens :**\n• **Aérien Standard** : 5 200 FCFA/kg (5-7 jours)\n• **Aérien Express** : 8 500 FCFA/kg (3-5 jours)\n• Idéal pour les marchandises lourdes mais compactes\n\n**⚖️ Poids vs Volume :**\n• **Aérien** : Facturation au poids (kg)\n• **Maritime** : Facturation au volume (CBM)\n\n**🎯 Conseil pratique :**\nSi votre colis fait moins de 167 kg par m³, l\'aérien peut être plus économique. Pour les objets lourds et compacts, c\'est souvent le meilleur choix !\n\n**📦 Exemples typiques :**\n• Documents, livres, échantillons\n• Produits électroniques compacts\n• Pièces détachées métalliques\n\nQuel est le poids approximatif de votre envoi ?'
          } else if (lowerMessage.includes('cbm') || lowerMessage.includes('m³') || lowerMessage.includes('volume') || lowerMessage.includes('calcul par cbm') || lowerMessage.includes('mètre cube') || lowerMessage.includes('calcul de cbm')) {
            botMessage = '📏 Excellente question ! Le **CBM (Cubic Meter)** ou **m³** est une unité de mesure du volume utilisée en logistique :\n\n**🧮 Comment calculer le CBM :**\n• **Formule** : Longueur × Largeur × Hauteur (en mètres)\n• **Exemple** : Un colis de 1,2m × 0,8m × 0,5m = 0,48 m³\n\n**💰 Pourquoi c\'est important :**\n• Le transport maritime se facture au **volume (CBM)**\n• Tarif : 650 FCFA/m³ (Standard) ou 850 FCFA/m³ (Express)\n• Plus économique pour les marchandises volumineuses mais légères\n\n**⚖️ CBM vs Poids :**\n• **Maritime** : Facturation au volume (CBM)\n• **Aérien** : Facturation au poids (kg)\n\n**🎯 Conseil pratique :**\nSi votre colis fait plus de 167 kg par m³, choisissez le maritime. Sinon, comparez avec l\'aérien !\n\nAvez-vous des dimensions spécifiques à calculer ?'
          } else if (lowerMessage.includes('devis') || lowerMessage.includes('quote') || lowerMessage.includes('estimation') || lowerMessage.includes('calculateur')) {
            botMessage = '📋 Excellente question ! Notre **calculateur de prix** vous permet d\'obtenir un devis instantané :\n\n**🧮 Comment utiliser le calculateur :**\n• Accédez à l\'onglet "Calculateur" dans votre dashboard\n• Renseignez les dimensions (L × l × h)\n• Indiquez le poids de votre colis\n• Sélectionnez la destination\n• Choisissez le mode de transport\n\n**💰 Devis instantané avec :**\n• Prix détaillé par mode de transport\n• Comparaison maritime vs aérien\n• Délais de livraison estimés\n• Frais additionnels transparents\n\n**🎯 Avantages :**\n• Calcul en temps réel\n• Tarifs officiels NextMove\n• Possibilité de créer l\'expédition directement\n\nSouhaitez-vous que je vous guide vers le calculateur ?'
          } else if (lowerMessage.includes('compte') || lowerMessage.includes('inscription') || lowerMessage.includes('créer compte') || lowerMessage.includes('s\'inscrire')) {
            botMessage = '👤 C\'est formidable que vous souhaitiez rejoindre NextMove ! Voici comment créer votre compte :\n\n**📝 Inscription simple :**\n• Cliquez sur "S\'inscrire" sur notre site\n• Renseignez vos informations personnelles\n• Vérifiez votre email\n• Activez votre compte\n\n**🏢 Types de comptes :**\n• **Particulier** : Pour vos envois personnels\n• **Entreprise** : Tarifs préférentiels et facturation\n• **Agent** : Pour devenir partenaire NextMove\n\n**🎁 Avantages immédiats :**\n• Suivi en temps réel de vos colis\n• Historique de toutes vos expéditions\n• Support client prioritaire\n• Notifications automatiques\n\nQuel type de compte vous intéresse le plus ?'
          } else if (lowerMessage.includes('pod') || lowerMessage.includes('preuve') || lowerMessage.includes('signature')) {
            botMessage = '📋 Notre système **POD (Proof of Delivery)** garantit la sécurité de vos livraisons :\n\n**📸 Preuves irréfutables :**\n• Photo géolocalisée du colis livré\n• Signature électronique du destinataire\n• Coordonnées GPS précises\n• Horodatage certifié\n\n**🔒 Sécurité renforcée :**\n• Réduction de 87% des litiges\n• Preuve légale en cas de conflit\n• Traçabilité complète\n• Archivage sécurisé\n\n**📱 Processus simple :**\n• Le livreur prend une photo\n• Le destinataire signe sur tablette\n• Reçu automatique généré\n• Notification immédiate à l\'expéditeur\n\nVotre tranquillité d\'esprit est notre priorité !'
          } else if (lowerMessage.includes('whatsapp') || lowerMessage.includes('notification') || lowerMessage.includes('sms') || lowerMessage.includes('alerte')) {
            botMessage = '📱 Notre système de **notifications multicanal** vous tient informé à chaque étape :\n\n**📢 Canaux disponibles :**\n• **WhatsApp Business** : Messages instantanés\n• **SMS** : Alertes importantes\n• **Email** : Rapports détaillés\n• **Notifications push** : Via l\'application\n\n**🔔 Événements notifiés :**\n• Colis pris en charge\n• Départ du pays d\'origine\n• Arrivée en transit\n• Livraison effectuée\n• Problèmes ou retards\n\n**⚙️ Personnalisation :**\n• Choisissez vos canaux préférés\n• Définissez la fréquence\n• Langue française ou anglaise\n\nRestez connecté à vos expéditions 24h/24 !'
          } else if (lowerMessage.includes('paiement') || lowerMessage.includes('payer') || lowerMessage.includes('fractionné') || lowerMessage.includes('acompte')) {
            botMessage = '💳 Notre système de **paiement flexible** s\'adapte à vos besoins :\n\n**💰 Paiement fractionné :**\n• **30% d\'acompte** à la commande\n• **70% restants** à la livraison\n• Idéal pour les gros montants\n• Sécurité maximale\n\n**🏦 Méthodes acceptées :**\n• **CinetPay** : Mobile Money, cartes bancaires\n• **Kkiapay** : Wave, MTN, Moov Money\n• **Stripe** : Cartes internationales\n• **Virement bancaire** : Pour les entreprises\n\n**🔒 Sécurité garantie :**\n• Transactions cryptées\n• Conformité PCI DSS\n• Remboursement en cas de problème\n\nQuelle méthode de paiement préférez-vous ?'
          } else if (lowerMessage.includes('tracking') || lowerMessage.includes('suivi') || lowerMessage.includes('où est') || lowerMessage.includes('localiser')) {
            botMessage = '📍 Notre système de **suivi en temps réel** vous donne une visibilité complète :\n\n**🔍 Informations disponibles :**\n• Position géographique actuelle\n• Statut détaillé (en transit, dédouané, etc.)\n• Prochaine étape prévue\n• Délai estimé de livraison\n• Historique complet du parcours\n\n**📱 Accès au suivi :**\n• Dashboard NextMove\n• SMS avec lien direct\n• WhatsApp avec mise à jour\n• Email avec rapport détaillé\n\n**🎯 Statuts possibles :**\n• Collecté ✅\n• En transit 🚛\n• Arrivé à destination 🏭\n• En cours de livraison 🚚\n• Livré ✅\n\nVotre numéro de suivi commence par "CO-" suivi de chiffres.'
          } else if (lowerMessage.includes('agent') || lowerMessage.includes('partenaire') || lowerMessage.includes('devenir') || lowerMessage.includes('collaboration')) {
            botMessage = '🤝 Rejoignez notre **réseau d\'agents partenaires** NextMove :\n\n**💼 Opportunités disponibles :**\n• **Agent de collecte** : Récupération des colis\n• **Agent de livraison** : Distribution finale\n• **Représentant commercial** : Développement clientèle\n• **Partenaire logistique** : Entrepôt et manutention\n\n**💰 Avantages financiers :**\n• Commissions attractives (5-15%)\n• Paiements réguliers\n• Primes de performance\n• Formation gratuite\n\n**📋 Conditions requises :**\n• Véhicule adapté (selon le poste)\n• Disponibilité flexible\n• Sens du service client\n• Couverture d\'assurance\n\n**📞 Pour postuler :**\nContactez notre équipe RH au +221 33 123 45 67\n\nEnsemble, développons la logistique africaine !'
          } else if (lowerMessage.includes('douane') || lowerMessage.includes('dédouanement') || lowerMessage.includes('customs') || lowerMessage.includes('formalités')) {
            botMessage = '🏛️ NextMove s\'occupe de toutes vos **formalités douanières** :\n\n**📋 Services inclus :**\n• Déclaration en douane automatique\n• Calcul des droits et taxes\n• Suivi du dédouanement\n• Gestion des documents requis\n\n**📄 Documents nécessaires :**\n• Facture commerciale\n• Liste de colisage (packing list)\n• Certificat d\'origine (si requis)\n• Permis spéciaux (produits réglementés)\n\n**💰 Frais transparents :**\n• Droits de douane selon tarif officiel\n• TVA applicable\n• Frais de dédouanement NextMove\n• Aucun frais caché\n\n**⏱️ Délais moyens :**\n• Dédouanement express : 24-48h\n• Dédouanement standard : 3-5 jours\n\nNous gérons tout pour vous simplifier la vie !'
          } else if (lowerMessage.includes('assurance') || lowerMessage.includes('protection') || lowerMessage.includes('couverture') || lowerMessage.includes('dommage')) {
            botMessage = '🛡️ Protégez vos expéditions avec notre **assurance cargo** :\n\n**🔒 Couverture complète :**\n• Perte totale ou partielle\n• Dommages pendant le transport\n• Vol ou disparition\n• Avaries dues aux intempéries\n\n**💰 Options d\'assurance :**\n• **Basique** : Jusqu\'à 100 000 FCFA (gratuite)\n• **Standard** : Jusqu\'à 500 000 FCFA (1% de la valeur)\n• **Premium** : Jusqu\'à 2 000 000 FCFA (2% de la valeur)\n• **Sur mesure** : Montants supérieurs (devis)\n\n**⚡ Indemnisation rapide :**\n• Déclaration en ligne\n• Expertise sous 48h\n• Remboursement sous 7 jours\n• Accompagnement personnalisé\n\n**📋 Comment souscrire :**\nCochez simplement l\'option assurance lors de votre commande !\n\nVotre sérénité n\'a pas de prix.'
          } else if (lowerMessage.includes('nextmove') || lowerMessage.includes('plateforme') || lowerMessage.includes('saas') || lowerMessage.includes('présentation') || lowerMessage.includes('qui êtes-vous')) {
            botMessage = '🚀 **NextMove Cargo** - Votre partenaire SaaS logistique en Afrique !\n\n**🎯 Notre Mission :**\nDigitaliser et automatiser la gestion des expéditions en Afrique et à l\'international. Nous connectons tous les acteurs de la chaîne logistique dans un écosystème collaboratif.\n\n**👥 Qui utilise NextMove :**\n• **Entreprises clientes** : Transitaires, transporteurs, logisticiens, compagnies cargo, PME exportatrices\n• **Agents & employés** : Gestion des expéditions et services\n• **Clients finaux** : Suivi de colis, devis, support 24/7\n\n**💡 Valeur ajoutée :**\n• Digitalisation complète du secteur logistique\n• Réduction des coûts et délais\n• Simplicité d\'usage même pour les TPE\n• Premier SaaS logistique local en Afrique de l\'Ouest\n\n**🌍 Vision :** Devenir le leader africain du SaaS logistique collaboratif !'
          } else if (lowerMessage.includes('abonnement') || lowerMessage.includes('plan') || lowerMessage.includes('prix') && (lowerMessage.includes('entreprise') || lowerMessage.includes('société'))) {
            botMessage = '💼 **Nos abonnements entreprises** (paiements mensuels) :\n\n**📦 Basic - 30 000 FCFA/mois :**\n• Gestion de base des colis\n• Facturation simple\n• Support standard\n• Idéal pour les TPE\n\n**🚀 Pro - 75 000 FCFA/mois :**\n• Fonctionnalités avancées\n• API d\'intégration\n• Analytics détaillées\n• Support prioritaire\n\n**⭐ Premium - 150 000 FCFA/mois :**\n• Toutes les fonctionnalités\n• White-label personnalisé\n• Support dédié\n• Statistiques avancées\n\n**💰 Avantages :**\n• Paiements fractionnés possibles\n• Commission 0% (conforme aux principes islamiques)\n• 1 mois gratuit pour tester\n\nQuel plan correspond le mieux à vos besoins ?'
          } else if (lowerMessage.includes('fonctionnalité') || lowerMessage.includes('service') || lowerMessage.includes('que fait') || lowerMessage.includes('capacité')) {
            botMessage = '⚙️ **Fonctionnalités principales NextMove Cargo :**\n\n**📦 Gestion des colis :**\n• Calcul au kg (aérien) ou CBM (maritime)\n• Tracking numéro alphanumérique\n• Preuve de livraison (POD) avec photo et signature\n\n**💰 Facturation & Paiements :**\n• Devis et factures automatisés\n• Paiement en ligne sécurisé\n• Intégration Orange Money, Wave, PayPal\n\n**🤖 IA & Support :**\n• Assistant IA 24/7 (c\'est moi !)\n• Support client multilingue\n• Réponses automatiques intelligentes\n\n**📱 Notifications :**\n• Web, WhatsApp, Email, SMS\n• Suivi en temps réel\n• Alertes personnalisées\n\n**🎨 Personnalisation :**\n• Logos, couleurs, favicon\n• White-label complet\n• Blog & communauté intégrés\n\nQuelle fonctionnalité vous intéresse le plus ?'
          } else if (lowerMessage.includes('différence') || lowerMessage.includes('basic vs pro') || lowerMessage.includes('pro vs premium') || lowerMessage.includes('comparaison plan')) {
            botMessage = '📊 **Comparaison détaillée de nos plans :**\n\n**📦 Basic (30 000 FCFA/mois) :**\n• Gestion simple des colis, factures et suivi\n• Fonctionnalités de base\n• Support standard\n• Idéal pour débuter\n\n**🚀 Pro (75 000 FCFA/mois) :**\n• API d\'intégration\n• Automatisations avancées\n• Rapports détaillés\n• Analytics approfondies\n• Support prioritaire\n\n**⭐ Premium (150 000 FCFA/mois) :**\n• Personnalisation totale (white-label)\n• Branding complet\n• Statistiques premium\n• Support dédié\n• Toutes les fonctionnalités\n\n**💰 Avantages communs :**\n• Paiements fractionnés possibles\n• Commission 0% (conforme principes islamiques)\n• 1 mois gratuit d\'essai\n\nQuel plan correspond à vos besoins ?'
          } else if (lowerMessage.includes('revenus') || lowerMessage.includes('prévision') || lowerMessage.includes('financier') || lowerMessage.includes('chiffre')) {
            botMessage = '📈 **Prévisions financières NextMove Cargo :**\n\n**🎯 Scénarios sur 6 mois :**\n\n**Prudent (100 entreprises) :**\n• 70 Basic + 20 Pro + 10 Premium\n• Revenu mensuel : ~6 750 000 FCFA\n• Revenu 6 mois : ~40 500 000 FCFA\n\n**Modéré (150 entreprises) :**\n• 90 Basic + 40 Pro + 20 Premium\n• Revenu mensuel : ~11 250 000 FCFA\n• Revenu 6 mois : ~67 500 000 FCFA\n\n**Optimiste (250 entreprises) :**\n• 150 Basic + 70 Pro + 30 Premium\n• Revenu mensuel : ~18 750 000 FCFA\n• Revenu 6 mois : ~112 500 000 FCFA\n\n**📊 Utilisateurs indirects :**\n• 2 000 à 10 000 clients finaux\n\nCroissance soutenue attendue !'
          } else if (lowerMessage.includes('risque') || lowerMessage.includes('défi') || lowerMessage.includes('problème potentiel') || lowerMessage.includes('difficulté')) {
            botMessage = '⚠️ **Gestion des risques NextMove Cargo :**\n\n**🎯 Risques identifiés & solutions :**\n\n**Adoption lente du marché :**\n• Solution : 1 mois gratuit + formations gratuites\n\n**Manque de digitalisation :**\n• Solution : Interfaces simplifiées + tutoriels vidéo\n\n**Méfiance paiements en ligne :**\n• Solution : Multiples options (Wave, Orange Money, PayPal)\n\n**Concurrence future :**\n• Solution : Avantage "First Mover" + ancrage local\n\n**Support client insuffisant :**\n• Solution : IA NextMove + support humain hybride\n\n**🛡️ Notre approche :**\nAnticipation proactive des défis avec solutions concrètes pour assurer le succès de nos clients !'
          } else if (lowerMessage.includes('vision') || lowerMessage.includes('futur') || lowerMessage.includes('expansion') || lowerMessage.includes('long terme')) {
            botMessage = '🌍 **Vision & expansion NextMove Cargo :**\n\n**🚀 Objectifs long terme :**\n\n**2-3 ans :**\n• Extension sur toute l\'Afrique\n• Écosystème logistique intégré\n• Partenariats stratégiques renforcés\n\n**🔗 Écosystème intégré :**\n• Douane automatisée\n• Assurances cargo\n• Fret optimisé\n• Paiements unifiés\n\n**🤝 API ouvertes :**\n• Intégration banques\n• Partenaires transporteurs\n• Marketplaces e-commerce\n\n**🏆 Mission ultime :**\nDevenir le leader africain du SaaS logistique collaboratif, en connectant tous les acteurs dans un écosystème digital unifié.\n\n**💡 Innovation continue :**\nTechnologies émergentes, IA avancée, blockchain pour la traçabilité !'
          } else if (lowerMessage.includes('marché') || lowerMessage.includes('afrique') || lowerMessage.includes('concurrence') || lowerMessage.includes('leader')) {
            botMessage = '🌍 **NextMove Cargo sur le marché africain :**\n\n**📊 Contexte du marché :**\n• L\'Afrique de l\'Ouest connaît une forte croissance des échanges commerciaux\n• Marché du cargo : plusieurs milliards FCFA/an\n• Secteur peu digitalisé = opportunité énorme\n\n**🎯 Public cible :**\n• >50 000 entreprises logistiques en Afrique de l\'Ouest\n• 3 000 à 5 000 entreprises au Sénégal\n• PME exportatrices/importatrices\n• Startups logistiques locales\n\n**🏆 Notre avantage :**\n• **Aucun concurrent direct** sur le SaaS logistique local\n• Positionnement "First Mover"\n• Approche collaborative (pas compétitive)\n• Adaptation aux réalités locales\n\n**📈 Objectifs 6 mois :**\n• 100-250 entreprises abonnées\n• 2 000-10 000 utilisateurs finaux\n• Extension vers toute l\'Afrique\n\nRejoignez la révolution logistique africaine !'
          } else if (lowerMessage.includes('marketing') || lowerMessage.includes('publicité') || lowerMessage.includes('promotion') || lowerMessage.includes('se faire connaître')) {
            botMessage = '📢 **Stratégie marketing NextMove Cargo :**\n\n**🎯 Canaux de diffusion :**\n• **Réseaux sociaux** : Facebook, LinkedIn, TikTok Business, Instagram\n• **Partenariats stratégiques** : Ports, aéroports, compagnies transport\n• **Associations professionnelles** : Transitaires, logisticiens\n• **Blog & communauté** : Contenu intégré à la plateforme\n\n**🎪 Actions promotionnelles :**\n• Formations gratuites à l\'utilisation\n• Sponsoring événements locaux\n• Foires commerciales & salons logistiques\n• Bannières publicitaires intégrées\n\n**💡 Différenciation :**\n• Solution 100% africaine\n• Adaptation aux réalités locales\n• Paiement en monnaie locale (CFA)\n• Position collaborative vs compétitive\n\n**🚀 Avantages uniques :**\n• Aucun concurrent direct local\n• Premier SaaS logistique en Afrique de l\'Ouest\n• Approche "First Mover"\n\nNotre force : l\'innovation au service de l\'Afrique !'
          } else if (lowerMessage.includes('qui peut utiliser') || lowerMessage.includes('public cible') || lowerMessage.includes('utilisateurs') || lowerMessage.includes('clients type')) {
            botMessage = '👥 **Qui peut utiliser NextMove Cargo ?**\n\n**🏢 Entreprises principales :**\n• **Transitaires & logisticiens** : Gestion complète des expéditions\n• **Compagnies transport** : Maritime, aérien, routier\n• **PME exportatrices/importatrices** : Simplification des processus\n• **Entreprises e-commerce** : Intégration logistique\n\n**👤 Utilisateurs finaux :**\n• **Clients particuliers** : Suivi de colis en temps réel\n• **Agents & employés** : Outils de gestion quotidienne\n• **Partenaires** : Réseau collaboratif\n\n**🎯 Secteurs d\'activité :**\n• Import/Export\n• E-commerce\n• Distribution\n• Manufacturing\n• Services logistiques\n\n**💼 Tailles d\'entreprises :**\n• TPE (très petites entreprises)\n• PME (petites et moyennes entreprises)\n• Grandes entreprises\n• Startups logistiques\n\nNextMove s\'adapte à tous les profils !'
          } else if (lowerMessage.includes('transport') || lowerMessage.includes('mode') || lowerMessage.includes('option') || lowerMessage.includes('meilleur') || lowerMessage.includes('choisir')) {
            botMessage = '🚢✈️ C\'est avec grand plaisir que je vais vous présenter nos modes de transport et leurs avantages respectifs :\n\n**🚢 Maritime (Recommandé pour les gros volumes) :**\n• Délai : 25-35 jours\n• Tarif : 650 FCFA/m³ (Standard) ou 850 FCFA/m³ (Express)\n• Parfait pour : meubles, électroménager, marchandises volumineuses\n\n**✈️ Aérien (Recommandé pour l\'urgence) :**\n• Délai : 5-7 jours\n• Tarif : 5 200 FCFA/kg (Standard) ou 8 500 FCFA/kg (Express)\n• Idéal pour : documents, échantillons, produits fragiles\n\n**Le choix optimal dépend de :**\n• Votre budget disponible\n• L\'urgence de votre livraison\n• La nature de votre marchandise\n• Le rapport poids/volume\n\nQuel type de produit souhaiteriez-vous expédier ? Je serais honoré de vous conseiller la solution la plus adaptée à vos besoins spécifiques.'
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
          
          // Force scroll après ajout du message bot
          setTimeout(scrollToBottom, 100)
        }, 1000)
      }
  }

  const handleCreateTicket = () => {
    if (newTicketTitle.trim() && newTicketDescription.trim()) {
      console.log('Création du ticket:', {
        title: newTicketTitle,
        description: newTicketDescription,
        priority: newTicketPriority
      })
      setNewTicketTitle('')
      setNewTicketDescription('')
      setNewTicketPriority('medium')
      setShowNewTicket(false)
    }
  }

  const tabs = [
    { id: 'chat', label: 'Chat Support', icon: MessageSquare },
    { id: 'tickets', label: 'Mes Tickets', icon: Plus },
    { id: 'contact', label: 'Nous Contacter', icon: Phone },
    { id: 'whatsapp', label: 'Chat WhatsApp', icon: MessageCircle },
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Support</h1>
          <p className="text-gray-600">Chat, tickets et assistance personnalisée</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Support Actif 24/7
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'chat' | 'tickets' | 'contact' | 'whatsapp')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">💬 Chat Support</h2>
                <p className="text-gray-600">Discutez avec nos agents ou notre IA</p>
              </div>
            </div>

            {/* Zone de chat */}
            <div className="border border-gray-200 rounded-lg">
              {/* Messages */}
              <div ref={messagesContainerRef} className="h-96 overflow-y-auto p-4 space-y-4 scroll-smooth min-h-0">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words ${
                      msg.type === 'user' 
                        ? 'bg-purple-500 text-white' 
                        : msg.type === 'bot'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-green-100 text-green-900'
                    }`}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {msg.type === 'bot' && <Bot className="h-4 w-4 flex-shrink-0" />}
                        {msg.type === 'agent' && <User className="h-4 w-4 flex-shrink-0" />}
                        {msg.type === 'user' && <User className="h-4 w-4 flex-shrink-0" />}
                        <span className="text-xs font-medium">
                          {msg.type === 'bot' ? 'IA Assistant' : msg.type === 'agent' ? 'Agent Support' : 'Vous'}
                        </span>
                        <span className="text-xs opacity-75">{msg.time}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Bouton créer ticket */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">🎫 Mes Tickets</h2>
              <p className="text-gray-600">Gérez vos demandes d'assistance</p>
            </div>
            <button
              onClick={() => setShowNewTicket(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouveau Ticket
            </button>
          </div>

          {/* Formulaire nouveau ticket */}
          {showNewTicket && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Créer un nouveau ticket</h3>
                <button
                  onClick={() => setShowNewTicket(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <select
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newTicketDescription}
                    onChange={(e) => setNewTicketDescription(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Décrivez votre problème en détail..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowNewTicket(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateTicket}
                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Créer le ticket
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Liste des tickets */}
          <div className="grid gap-4">
            {myTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status === 'open' ? 'Ouvert' : ticket.status === 'in_progress' ? 'En cours' : 'Résolu'}
                      </div>
                      <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority === 'high' ? 'Priorité haute' : ticket.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{ticket.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Créé le {ticket.created}</span>
                      <span>Dernière mise à jour: {ticket.lastUpdate}</span>
                      <span>Agent: {ticket.agent}</span>
                    </div>
                  </div>
                  <button className="text-purple-600 hover:text-purple-800 flex items-center gap-1 text-sm">
                    Voir détails
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {activeTab === 'whatsapp' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">📱 Chat WhatsApp</h2>
                <p className="text-gray-600">Discutez directement via WhatsApp Business</p>
              </div>
            </div>

            {/* Interface WhatsApp complète */}
            <WhatsAppInterface />
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">📞 Nous Contacter</h2>
                <p className="text-gray-600">Différents moyens de nous joindre</p>
              </div>
            </div>


            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Email</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  support@nextmovecargo.com<br />
                  Réponse sous 2h en moyenne
                </p>
                <button 
                  onClick={() => window.open('mailto:support@nextmovecargo.com?subject=Demande de support - NextMove Cargo', '_blank')}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Envoyer un email
                </button>
              </div>

              {/* Téléphone */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  +221 33 123 45 67<br />
                  Lun-Ven: 8h-18h, Sam: 9h-13h
                </p>
                <button 
                  onClick={() => window.open('tel:+22133123456', '_self')}
                  className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Appeler maintenant
                </button>
              </div>
            </div>

            {/* Horaires */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">⏰ Horaires de Support</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Chat & WhatsApp:</span>
                  <span className="font-medium">24h/24 - 7j/7</span>
                </div>
                <div className="flex justify-between">
                  <span>Téléphone:</span>
                  <span className="font-medium">Lun-Ven 8h-18h, Sam 9h-13h</span>
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
  )
}
