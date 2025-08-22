'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis Amadou, votre assistant NextMove spécialisé en logistique Chine-Afrique. Je peux vous aider avec vos expéditions, tarifs, suivi de colis et bien plus. Que puis-je faire pour vous ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Salutations et présentations
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello') || message.includes('bonsoir')) {
      return 'Bonjour ! Je suis Amadou, votre assistant IA NextMove spécialisé en logistique Chine-Afrique. Je maîtrise tous nos services, technologies et solutions. Comment puis-je vous accompagner aujourd\'hui ?'
    }
    
    // Questions sur qui je suis / présentation
    if (message.includes('qui es-tu') || message.includes('qui êtes-vous') || message.includes('présente-toi') || message.includes('ton rôle')) {
      return '🤖 **Je suis Amadou, Assistant IA NextMove** 🤖\n\n👨‍💼 **Mon expertise :**\n• Logistique internationale Chine-Afrique\n• Calculs tarifaires et devis instantanés\n• Suivi de colis en temps réel\n• Conseils techniques et réglementaires\n• Support commercial et partenariats\n• Formation et accompagnement\n\n🧠 **Mes capacités :**\n• Réponses 24/7 en français\n• Base de données complète NextMove\n• Intelligence conversationnelle avancée\n• Personnalisation selon vos besoins\n\nJe suis là pour vous simplifier la logistique ! Que puis-je faire pour vous ?'
    }
    
    // Questions spécifiques sur maritime express
    if (message.includes('maritime express') || (message.includes('maritime') && message.includes('express'))) {
      return 'Le service Maritime Express est notre option maritime accélérée :\n\n🚢 Maritime Express : 180 000 - 220 000 FCFA/CBM\n⏱️ Délai : 18-25 jours (vs 25-35 jours standard)\n📦 Priorité de chargement et déchargement\n🛃 Dédouanement prioritaire\n\nC\'est 20-30% plus cher que le maritime standard mais 10 jours plus rapide. Souhaitez-vous un devis précis ?'
    }
    
    // Questions spécifiques sur maritime standard
    if (message.includes('maritime standard') || (message.includes('maritime') && !message.includes('express') && !message.includes('prix') && !message.includes('tarif'))) {
      return 'Le service Maritime Standard est notre option la plus économique :\n\n🚢 Maritime Standard : 98 250 - 148 900 FCFA/CBM\n⏱️ Délai : 25-35 jours\n📦 Groupage avec autres clients\n🛃 Dédouanement standard\n\nIdéal pour les envois non urgents. Quel volume souhaitez-vous expédier ?'
    }
    
    // Questions générales sur les prix/tarifs
    if (message.includes('prix') || message.includes('tarif') || message.includes('coût') || message.includes('combien')) {
      return 'Nos tarifs dépendent du mode de transport :\n\n🚢 Maritime Standard : 98 250 - 148 900 FCFA/CBM\n🚢 Maritime Express : 180 000 - 220 000 FCFA/CBM\n✈️ Aérien Express : 800 - 1 179 FCFA/kg\n✈️ Aérien Standard : 459 - 650 FCFA/kg\n🚛 Routier : 29 475 - 1 441 000 FCFA\n\nQuel mode vous intéresse ? Je peux vous donner plus de détails.'
    }
    
    // Questions sur le suivi
    if (message.includes('suivi') || message.includes('suivre') || message.includes('tracking') || message.includes('où est')) {
      return 'Pour suivre votre colis, vous avez plusieurs options :\n\n📱 Entrez votre numéro de suivi sur notre site\n📧 Vérifiez vos emails pour les mises à jour\n💬 Donnez-moi votre numéro de suivi, je peux vérifier pour vous\n\nQuel est votre numéro de suivi ?'
    }
    
    // Questions sur les délais
    if (message.includes('délai') || message.includes('temps') || message.includes('durée') || message.includes('quand')) {
      return 'Voici nos délais de livraison :\n\n🚢 Maritime Standard : 25-35 jours\n🚢 Maritime Express : 18-25 jours\n✈️ Aérien Express : 3-7 jours\n✈️ Aérien Standard : 5-10 jours\n🚛 Routier : 15-20 jours\n\nQuel mode de transport vous intéresse ?'
    }
    
    // Questions sur les documents
    if (message.includes('document') || message.includes('papier') || message.includes('douane')) {
      return 'Documents nécessaires pour l\'expédition :\n\n📋 Facture commerciale\n📦 Liste de colisage\n🛂 Déclaration en douane\n📄 Certificat d\'origine (si requis)\n\nJe peux vous aider à préparer ces documents. De quel type d\'envoi s\'agit-il ?'
    }
    
    // Questions sur les services ou explication de la plateforme
    if (message.includes('service') || message.includes('que faites') || message.includes('proposez') || message.includes('plateforme') || message.includes('expliquer') || message.includes('explique')) {
      return 'NextMove Cargo est une plateforme complète de logistique Chine-Afrique qui propose :\n\n🌍 **Transport multimodal** : Maritime, Aérien, Routier\n📦 **Suivi en temps réel** : Tracking GPS de vos colis\n🛃 **Dédouanement** : Gestion complète des formalités\n📋 **Documents** : Préparation de tous les papiers\n💼 **Solutions B2B/B2C** : Entreprises et particuliers\n🔒 **Assurance cargo** : Protection de vos marchandises\n💰 **Tarification transparente** : Devis instantanés\n🏢 **Réseau de partenaires** : 15 pays africains\n\nNous simplifions vos expéditions entre la Chine et l\'Afrique. Quel aspect vous intéresse ?'
    }
    
    // Questions sur les pays
    if (message.includes('pays') || message.includes('destination') || message.includes('livrer')) {
      return 'Nous desservons 15 pays africains :\n\n🇸🇳 Sénégal • 🇨🇮 Côte d\'Ivoire • 🇳🇬 Nigeria\n🇬🇭 Ghana • 🇲🇱 Mali • 🇧🇫 Burkina Faso\n🇳🇪 Niger • 🇹🇬 Togo • 🇧🇯 Bénin\n🇲🇦 Maroc • 🇹🇳 Tunisie • 🇩🇿 Algérie\n🇪🇬 Égypte • 🇰🇪 Kenya • 🇪🇹 Éthiopie\n\nVers quel pays souhaitez-vous expédier ?'
    }
    
    // Questions sur le partenariat
    if (message.includes('partenaire') || message.includes('partenariat') || message.includes('devenir partenaire') || message.includes('collaboration') || message.includes('rejoindre')) {
      return '🤝 **Programme de Partenariat NextMove** 🤝\n\nNous recherchons des partenaires stratégiques en Afrique !\n\n✅ **Avantages partenaires :**\n• Commissions attractives (5-15%)\n• Formation complète gratuite\n• Support marketing et commercial\n• Accès plateforme dédiée\n• Territoire exclusif possible\n\n📋 **Profils recherchés :**\n• Transitaires et agents de fret\n• Importateurs/exportateurs\n• Entrepreneurs logistique\n• Commerciaux expérimentés\n\n📞 **Contact commercial :**\nCheikh Abdoul Khadre DJITTE\n📱 +221 77 658 17 41\n📧 djeylanidjitte@gmail.com\n\nSouhaitez-vous plus d\'informations sur un aspect spécifique ?'
    }
    
    // Questions sur les commissions/gains
    if (message.includes('commission') || message.includes('gain') || message.includes('rémunération') || message.includes('combien gagner')) {
      return '💰 **Structure de Commissions Partenaires** 💰\n\n🎯 **Taux de commission :**\n• Partenaire Bronze : 5-8%\n• Partenaire Argent : 8-12%\n• Partenaire Or : 12-15%\n• Bonus performance : +2-5%\n\n📊 **Exemples de gains mensuels :**\n• 10 expéditions/mois : 150 000 - 400 000 FCFA\n• 25 expéditions/mois : 400 000 - 1 000 000 FCFA\n• 50+ expéditions/mois : 1 000 000+ FCFA\n\n🎁 **Bonus supplémentaires :**\n• Prime de bienvenue : 50 000 FCFA\n• Bonus mensuel objectifs\n• Incentives trimestriels\n\nIntéressé(e) ? Contactez notre équipe commerciale !'
    }
    
    // Questions sur les conditions/critères
    if (message.includes('condition') || message.includes('critère') || message.includes('exigence') || message.includes('qualification')) {
      return '📋 **Conditions pour devenir Partenaire** 📋\n\n✅ **Critères essentiels :**\n• Expérience commerce international (2+ ans)\n• Réseau clients/prospects actif\n• Connaissance marché local\n• Motivation entrepreneuriale\n• Intégrité et professionnalisme\n\n📄 **Documents requis :**\n• CV détaillé\n• Registre de commerce (si applicable)\n• Références professionnelles\n• Plan d\'action commercial\n\n🎯 **Engagement minimum :**\n• 5 expéditions/mois (période d\'essai)\n• Formation obligatoire (2 jours)\n• Respect des procédures NextMove\n• Reporting mensuel d\'activité\n\n📞 Prêt(e) à candidater ? Contactez-nous !'
    }
    
    // Questions sur la formation
    if (message.includes('formation') || message.includes('apprentissage') || message.includes('apprendre') || message.includes('former')) {
      return '🎓 **Programme de Formation Partenaires** 🎓\n\n📚 **Formation initiale (2 jours) :**\n• Jour 1 : Produits et services NextMove\n• Jour 2 : Outils commerciaux et plateforme\n\n💻 **Formation en ligne continue :**\n• Modules e-learning interactifs\n• Webinaires mensuels\n• Mise à jour réglementaire\n• Techniques de vente avancées\n\n🛠️ **Outils fournis :**\n• Manuel commercial complet\n• Calculateur de tarifs\n• Modèles de devis\n• Support marketing (brochures, vidéos)\n\n👨‍🏫 **Support continu :**\n• Manager dédié\n• Hotline technique 24/7\n• Coaching commercial mensuel\n\nLa formation est 100% gratuite pour nos partenaires !'
    }
    
    // Questions sur les territoires/zones
    if (message.includes('territoire') || message.includes('zone') || message.includes('exclusivité') || message.includes('région')) {
      return '🗺️ **Territoires et Zones Partenaires** 🗺️\n\n🎯 **Zones disponibles :**\n• Sénégal : Dakar, Thiès, Saint-Louis\n• Côte d\'Ivoire : Abidjan, Bouaké, San Pedro\n• Mali : Bamako, Sikasso, Mopti\n• Burkina Faso : Ouagadougou, Bobo-Dioulasso\n• Ghana : Accra, Kumasi, Tema\n• Nigeria : Lagos, Abuja, Port Harcourt\n\n🔒 **Exclusivité territoriale :**\n• Possible après 6 mois de collaboration\n• Basée sur performance et volume\n• Protection géographique garantie\n• Droits de premier refus\n\n📈 **Expansion possible :**\n• Multi-territoires pour top performers\n• Support développement nouveaux marchés\n• Partenariats sous-agents autorisés\n\nQuelle zone vous intéresse le plus ?'
    }
    
    // Questions sur les technologies et innovations
    if (message.includes('technologie') || message.includes('innovation') || message.includes('digital') || message.includes('plateforme') || message.includes('système')) {
      return '🚀 **Technologies NextMove** 🚀\n\n💻 **Plateforme SaaS Avancée :**\n• Interface web responsive multi-langues\n• Application mobile iOS/Android\n• API REST complète pour intégrations\n• Dashboard analytics en temps réel\n• Système de notifications push\n\n🔬 **Innovations Logistiques :**\n• IA pour optimisation des routes\n• Blockchain pour traçabilité\n• IoT pour suivi température/humidité\n• Machine Learning prédictif\n• Reconnaissance vocale multilingue\n\n🛡️ **Sécurité & Conformité :**\n• Chiffrement AES-256\n• Conformité RGPD/CCPA\n• Authentification multi-facteurs\n• Audit trails complets\n• Sauvegarde automatique\n\nNotre stack technique garantit performance et fiabilité !'
    }
    
    // Questions sur l'assurance et protection
    if (message.includes('assurance') || message.includes('protection') || message.includes('couverture') || message.includes('risque') || message.includes('dommage')) {
      return '🛡️ **Assurance Cargo NextMove** 🛡️\n\n📋 **Couvertures Disponibles :**\n• Tous risques : 0.3-0.8% de la valeur\n• Avarie particulière : 0.2-0.5%\n• Franc d\'avarie : 0.1-0.3%\n• Vol et piraterie inclus\n• Force majeure couverte\n\n💰 **Indemnisations :**\n• Remboursement valeur déclarée\n• Frais de transport inclus\n• Expertise gratuite\n• Règlement sous 30 jours\n• Assistance juridique\n\n🎯 **Risques Couverts :**\n• Dommages transport (chocs, chutes)\n• Avaries d\'eau de mer/pluie\n• Incendie et explosion\n• Vol qualifié\n• Événements climatiques\n\nVotre marchandise est protégée de A à Z !'
    }
    
    // Questions sur les emplois et carrières
    if (message.includes('emploi') || message.includes('travail') || message.includes('carrière') || message.includes('recrutement') || message.includes('poste') || message.includes('job')) {
      return '💼 **Carrières NextMove** 💼\n\n🎯 **Postes Ouverts :**\n• Agents commerciaux (Dakar, Abidjan, Lagos)\n• Coordinateurs logistique\n• Développeurs Full-Stack\n• Chargés de clientèle\n• Responsables opérations\n• Agents de transit\n\n✅ **Profils Recherchés :**\n• Expérience logistique/commerce international\n• Maîtrise français + anglais\n• Esprit entrepreneurial\n• Orientation client\n• Adaptabilité multiculturelle\n\n🎁 **Avantages Employés :**\n• Salaire compétitif + primes\n• Formation continue gratuite\n• Évolution de carrière rapide\n• Télétravail possible\n• Assurance santé\n• Congés payés généreux\n\n📧 Envoyez CV à : recrutement@nextmove.com'
    }
    
    // Questions sur les certifications et qualité
    if (message.includes('certification') || message.includes('qualité') || message.includes('norme') || message.includes('iso') || message.includes('standard')) {
      return '🏆 **Certifications & Qualité** 🏆\n\n📜 **Nos Certifications :**\n• ISO 9001:2015 (Management Qualité)\n• ISO 14001:2015 (Management Environnemental)\n• IATA Cargo Agent (Transport Aérien)\n• FIATA Freight Forwarder\n• AEO (Opérateur Économique Agréé)\n• C-TPAT (Sécurité Supply Chain)\n\n⭐ **Standards de Service :**\n• Taux de livraison : 99.2%\n• Satisfaction client : 4.8/5\n• Délai respect : 96.5%\n• Zéro perte garantie\n• Support 24/7/365\n\n🔍 **Contrôles Qualité :**\n• Audit mensuel des processus\n• Formation continue équipes\n• Amélioration continue\n• Feedback client systématique\n\nExcellence et fiabilité garanties !'
    }
    
    // Questions sur les offres spéciales et promotions
    if (message.includes('offre') || message.includes('promotion') || message.includes('réduction') || message.includes('remise') || message.includes('promo') || message.includes('discount')) {
      return '🎉 **Offres Spéciales NextMove** 🎉\n\n💥 **Promotions en Cours :**\n• Nouveaux clients : -20% premier envoi\n• Volume +5 CBM : -15% tarif maritime\n• Parrainage ami : 50 000 FCFA crédit\n• Abonnement annuel : -25%\n• Groupage express : -10%\n\n🎁 **Programmes Fidélité :**\n• Bronze (5+ envois) : -5% permanent\n• Argent (15+ envois) : -10% + priorité\n• Or (30+ envois) : -15% + services VIP\n• Platine (50+ envois) : tarifs négociés\n\n⏰ **Offres Limitées :**\n• Black Friday : -30% (novembre)\n• Nouvel An Chinois : tarifs bloqués\n• Rentrée scolaire : -20% fournitures\n• Fin d\'année : bonus commission partenaires\n\nContactez-nous pour profiter de ces offres !'
    }
    
    // Questions sur les services complémentaires
    if (message.includes('service complémentaire') || message.includes('service additionnel') || message.includes('option') || message.includes('plus de service')) {
      return '⭐ **Services Complémentaires** ⭐\n\n📦 **Services Logistiques :**\n• Emballage professionnel\n• Étiquetage et marquage\n• Palettisation et filmage\n• Stockage temporaire (30 jours gratuits)\n• Livraison à domicile\n• Installation sur site\n\n🛃 **Services Douaniers :**\n• Déclaration en douane complète\n• Paiement des taxes/droits\n• Certificats d\'origine\n• Licences d\'importation\n• Inspection pré-expédition\n• Dédouanement express\n\n💼 **Services Business :**\n• Sourcing fournisseurs Chine\n• Contrôle qualité usine\n• Négociation commerciale\n• Traduction documents\n• Accompagnement foires\n• Formation import/export\n\nSolutions complètes pour votre réussite !'
    }
    
    // Questions sur les délais et urgences
    if (message.includes('urgent') || message.includes('express') || message.includes('rapide') || message.includes('délai court') || message.includes('prioritaire')) {
      return '⚡ **Services Express & Urgents** ⚡\n\n🚀 **Options Rapides :**\n• Aérien Express : 3-7 jours\n• Maritime Express : 18-25 jours\n• Routier Express : 12-15 jours\n• Dédouanement prioritaire : 24h\n• Livraison same-day (grandes villes)\n\n🎯 **Pour Urgences Extrêmes :**\n• Affrètement avion cargo\n• Transport routier direct\n• Dédouanement weekend\n• Équipe dédiée 24/7\n• Suivi GPS temps réel\n\n💰 **Suppléments Express :**\n• Aérien : +30-50% du tarif standard\n• Maritime : +20-30%\n• Dédouanement : +25 000 FCFA\n• Weekend : +50%\n\n📞 **Hotline Urgence :**\n+221 77 658 17 41 (24h/24)\n\nVotre urgence, notre priorité !'
    }
    
    // Questions sur les volumes et dimensions
    if (message.includes('volume') || message.includes('dimension') || message.includes('taille') || message.includes('poids') || message.includes('cbm') || message.includes('kg')) {
      return '📏 **Volumes & Dimensions** 📏\n\n📦 **Limites par Mode :**\n• Maritime : Aucune limite volume\n• Aérien : Max 300kg par colis\n• Routier : Max 24 tonnes\n• Express : Max 30kg par colis\n\n📐 **Calculs Tarifaires :**\n• Maritime : CBM (L×l×h÷1000000)\n• Aérien : Poids volumétrique (L×l×h÷6000)\n• Routier : Poids réel ou volume\n• Minimum facturable : 1 CBM maritime\n\n🎯 **Optimisation Conseils :**\n• Groupage pour petits volumes\n• Consolidation multi-fournisseurs\n• Emballage optimisé\n• Palettisation standard\n\n💡 **Exemples Pratiques :**\n• 1 palette (1.2×0.8×1.5m) = 1.44 CBM\n• Container 20\' = 33 CBM max\n• Container 40\' = 67 CBM max\n\nBesoin d\'un calcul précis ? Donnez-moi vos dimensions !'
    }
    
    // Questions sur l'inscription/créer un compte
    if (message.includes('inscrire') || message.includes('inscription') || message.includes('créer compte') || message.includes('compte') || message.includes('enregistrer') || message.includes('s\'inscrire')) {
      return '📝 **Inscription NextMove** 📝\n\n🎯 **Comment s\'inscrire :**\n• Rendez-vous sur notre plateforme web\n• Cliquez sur "Créer un compte"\n• Remplissez vos informations (nom, email, téléphone)\n• Choisissez votre type de compte (Particulier/Entreprise)\n• Validez votre email\n• Commencez à expédier !\n\n✅ **Inscription 100% Gratuite :**\n• Aucun frais d\'inscription\n• Accès immédiat à la plateforme\n• Calculateur de tarifs\n• Suivi de colis\n• Support client\n\n🎁 **Bonus Nouveaux Clients :**\n• -20% sur votre premier envoi\n• Formation gratuite\n• Support dédié\n\n📞 **Besoin d\'aide ?**\nContactez-nous : +221 77 658 17 41\n\nPrêt(e) à rejoindre NextMove ?'
    }
    
    // Questions sur l'aide/contact
    if (message.includes('aide') || message.includes('contact') || message.includes('support') || message.includes('problème')) {
      return 'Je suis là pour vous aider ! Vous pouvez :\n\n💬 Continuer à me parler ici\n📞 Appeler : +221 77 658 17 41\n📧 Email : contact@nextmove.com\n🕒 Support 24/7 disponible\n\nQuel est votre besoin spécifique ?'
    }
    
    // Questions sur merci/remerciements
    if (message.includes('merci') || message.includes('thank')) {
      return 'De rien ! C\'est un plaisir de vous aider. Y a-t-il autre chose que je puisse faire pour vous ? Je reste à votre disposition pour toute question sur nos services logistiques.'
    }
    
    // Questions sur ça va/comment allez-vous
    if (message.includes('ça va') || message.includes('comment allez') || message.includes('comment vas')) {
      return 'Je vais très bien, merci de demander ! Je suis toujours prêt à vous aider avec vos besoins logistiques. Et vous, comment puis-je vous assister aujourd\'hui ?'
    }
    
    // Questions sur les secteurs d'activité
    if (message.includes('secteur') || message.includes('industrie') || message.includes('domaine') || message.includes('spécialité') || message.includes('expertise')) {
      return '🏭 **Secteurs d\'Expertise NextMove** 🏭\n\n🎯 **Nos Spécialisations :**\n• Électronique & High-Tech\n• Textile & Mode\n• Automobile & Pièces détachées\n• Machines & Équipements industriels\n• Cosmétiques & Produits de beauté\n• Jouets & Articles de sport\n• Mobilier & Décoration\n• Produits alimentaires (non périssables)\n\n🔬 **Expertise Technique :**\n• Produits réglementés (CE, FCC)\n• Matières dangereuses (ADR/IATA)\n• Produits pharmaceutiques\n• Équipements médicaux\n• Produits chimiques\n\n💼 **Solutions Sectorielles :**\n• E-commerce & Dropshipping\n• Grossistes & Distributeurs\n• Industriels & Manufacturiers\n• Startups & PME\n• Grandes entreprises\n\nChaque secteur a ses spécificités, nous les maîtrisons !'
    }
    
    // Questions sur les outils et applications
    if (message.includes('outil') || message.includes('application') || message.includes('app') || message.includes('logiciel') || message.includes('plateforme web')) {
      return '📱 **Outils & Applications NextMove** 📱\n\n💻 **Plateforme Web :**\n• Dashboard complet multilingue\n• Calculateur de tarifs instantané\n• Suivi colis temps réel\n• Gestion documentaire\n• Historique complet\n• Facturation automatique\n\n📲 **Application Mobile :**\n• iOS & Android disponibles\n• Notifications push\n• Scan QR codes\n• Photo documents\n• Chat support intégré\n• Mode offline\n\n🔗 **API & Intégrations :**\n• API REST complète\n• Webhooks temps réel\n• Plugins e-commerce (Shopify, WooCommerce)\n• ERP/CRM intégrations\n• Connecteurs comptables\n\n🛠️ **Outils Partenaires :**\n• Calculateur commissions\n• CRM clients dédié\n• Matériel marketing\n• Formation e-learning\n\nTechnologie au service de votre efficacité !'
    }
    
    // Questions sur la durabilité et environnement
    if (message.includes('environnement') || message.includes('durable') || message.includes('écologique') || message.includes('vert') || message.includes('carbone')) {
      return '🌱 **Engagement Environnemental** 🌱\n\n♻️ **Initiatives Durables :**\n• Optimisation routes (réduction CO2)\n• Groupage systématique\n• Partenaires éco-certifiés\n• Emballages recyclables\n• Compensation carbone volontaire\n• Digitalisation documents\n\n🌍 **Impact Positif :**\n• -30% émissions vs transport individuel\n• Containers partagés optimisés\n• Ports verts privilégiés\n• Transport multimodal écologique\n• Sensibilisation clients\n\n📊 **Reporting Carbone :**\n• Calcul empreinte par envoi\n• Rapport mensuel émissions\n• Suggestions d\'amélioration\n• Certification ISO 14001\n\n💚 **Projets Futurs :**\n• Camions électriques (2024)\n• Carburants alternatifs\n• Packaging 100% recyclable\n• Partenariat reforestation\n\nLogistique responsable pour l\'avenir !'
    }
    
    // Questions sur les réglementations et conformité
    if (message.includes('réglementation') || message.includes('conformité') || message.includes('légal') || message.includes('douane') || message.includes('règle')) {
      return '⚖️ **Réglementations & Conformité** ⚖️\n\n📋 **Expertise Réglementaire :**\n• Code des douanes UEMOA/CEDEAO\n• Réglementations chinoises export\n• Normes internationales (CE, FCC, RoHS)\n• Restrictions produits (CITES, etc.)\n• Accords commerciaux bilatéraux\n• Zones franches et entrepôts\n\n🛃 **Procédures Douanières :**\n• Classification tarifaire HS\n• Calcul droits et taxes\n• Licences d\'importation\n• Certificats sanitaires/phytosanitaires\n• Déclarations en douane\n• Contrôles post-dédouanement\n\n🔒 **Sécurité & Compliance :**\n• Programme AEO (Opérateur Agréé)\n• Screening sécuritaire\n• Traçabilité complète\n• Audit conformité\n• Formation équipes\n\n⚠️ **Produits Réglementés :**\n• Électronique (homologation)\n• Cosmétiques (ANSM)\n• Jouets (sécurité enfants)\n• Textiles (étiquetage)\n\nConformité garantie, risques maîtrisés !'
    }
    
    // Réponse par défaut ultra-complète
    return '🤖 **Je suis là pour tout vous expliquer !** 🤖\n\nJe maîtrise TOUS les aspects NextMove :\n\n🚢 **Transport & Logistique**\n• Tarifs, délais, modes de transport\n• Suivi colis, assurance, dédouanement\n\n🤝 **Commercial & Partenariat**\n• Programme partenaires, commissions\n• Offres spéciales, fidélité\n\n💼 **Services & Solutions**\n• Technologies, outils, applications\n• Secteurs d\'expertise, conformité\n\n👥 **Carrières & Formation**\n• Emplois, stages, formations\n• Développement professionnel\n\n🌍 **Entreprise & Valeurs**\n• Histoire, mission, environnement\n• Certifications, qualité\n\n**Posez-moi n\'importe quelle question !** Je vous donnerai une réponse détaillée et personnalisée. Que voulez-vous savoir ?'
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    const userInput = inputText
    setInputText('')

    // Generate intelligent bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userInput),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 800)
  }

  if (isMinimized || !isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true)
          setIsMinimized(false)
        }}
        className="fixed bottom-80 right-4 z-40 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        title="Ouvrir le chat"
      >
        <MessageCircle className="h-7 w-7" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">!</span>
        </div>
      </button>
    )
  }

  return (
    <div className="fixed bottom-80 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] h-96 max-h-[calc(100vh-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Assistant NextMove</h3>
            <p className="text-xs text-blue-100">En ligne</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Réduire"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Bot className="h-3 w-3" />
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tapez votre message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
