'use client'

import { useState, useEffect, useCallback } from 'react'

export const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'zh-cn', name: '简体中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
]

export const defaultLanguage = 'fr'

export const translations = {
  fr: {
    // Navigation
    'nav.track': 'Suivre un colis',
    'nav.pricing': 'Tarifs',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.dashboard': 'Dashboard',
    'nav.free_trial': 'Essai gratuit',
    'nav.language': 'Langue',
    
    // Hero Section
    'hero.title': 'SaaS Logistique',
    'hero.subtitle': 'Chine-Afrique',
    'hero.description': 'La plateforme de référence pour vos échanges commerciaux entre la Chine et l\'Afrique. Suivi en temps réel, transparence totale, livraison garantie.',
    'hero.cta_trial': 'Essai gratuit 14 jours',
    'hero.cta_track': 'Suivre un colis',
    
    // Stats
    'stats.packages': 'Colis traités',
    'stats.countries': 'Pays UEMOA/CEMAC',
    'stats.delivery_rate': 'Taux de livraison',
    'stats.support': 'Support client',
    
    // Features
    'features.title': 'Pourquoi choisir notre plateforme ?',
    'features.subtitle': 'Une solution complète et innovante pour optimiser vos échanges commerciaux',
    'features.coverage.title': 'Couverture Totale',
    'features.coverage.description': 'Présent dans tous les pays UEMOA et CEMAC avec un réseau de partenaires fiables',
    'features.performance.title': 'Performance Exceptionnelle',
    'features.performance.description': 'Des résultats qui parlent d\'eux-mêmes avec une satisfaction client inégalée',
    'features.security.title': 'Sécurité Maximale',
    'features.security.description': 'Vos marchandises sont protégées à chaque étape du processus',
    
    // Routes
    'routes.title': 'Nos Routes Commerciales',
    'routes.subtitle': 'Connexions directes entre les principales villes chinoises et africaines',
    
    // Testimonials
    'testimonials.title': 'Ce que disent nos clients',
    'testimonials.subtitle': 'La satisfaction de nos clients est notre priorité absolue',
    
    // CTA
    'cta.title': 'Prêt à révolutionner votre logistique ?',
    'cta.subtitle': 'Rejoignez des milliers d\'entreprises qui nous font confiance',
    'cta.start': 'Commencer maintenant',
    'cta.demo': 'Voir une démo',
    
    // Dashboard
    'dashboard.my_profile': 'Mon Profil',
    'dashboard.my_orders': 'Mes Commandes',
    'dashboard.my_packages': 'Mes Colis',
    'dashboard.notifications': 'Notifications',
    'dashboard.settings': 'Paramètres',
    
    // Rating System
    'rating.title': 'Évaluations et Avis',
    'rating.subtitle': 'Découvrez ce que nos utilisateurs pensent de notre plateforme et de nos entreprises partenaires',
    'rating.platform_title': 'Noter la Plateforme',
    'rating.platform_description': 'Partagez votre expérience globale avec NextMove',
    'rating.companies_title': 'Entreprises Partenaires',
    'rating.companies_description': 'Évaluez les entreprises de logistique',
    'rating.based_on': 'Basé sur',
    'rating.reviews': 'avis',
    'rating.rate_platform': 'Noter la plateforme',
    'rating.view_all_companies': 'Voir toutes les entreprises',
    'rating.recent_reviews': 'Avis récents de nos utilisateurs',
    
    // Documentation
    'nav.documentation': 'Documentation',
    'doc.complete_guide': 'Guide complet d\'utilisation de NextMove Cargo',
    'doc.search_placeholder': 'Rechercher dans la documentation...',
    'doc.platform_title': 'Votre plateforme logistique Chine-Afrique',
    'doc.platform_description': 'NextMove Cargo est votre solution complète pour gérer vos expéditions entre la Chine et l\'Afrique. Cette plateforme vous permet de :',
    'doc.manage_packages': 'Gérer vos colis et expéditions',
    'doc.calculate_rates': 'Calculer les tarifs en temps réel',
    'doc.track_performance': 'Suivre vos performances',
    'doc.communicate_clients': 'Communiquer avec vos clients',
    'doc.automate_processes': 'Automatiser vos processus',
    'doc.getting_started': 'Premiers pas',
    'doc.welcome_title': 'Bienvenue sur NextMove Cargo',
    'doc.initial_config': 'Configuration initiale',
    'doc.package_management': 'Gestion des colis',
    'doc.pricing': 'Tarification',
    'doc.client_management': 'Gestion clients',
    'doc.analytics': 'Analyses et rapports',
    'doc.ai_assistant': 'Assistant IA',
    'doc.integrations': 'Intégrations',
    'doc.troubleshooting': 'Dépannage',
    
    // Dashboard
    'dashboard.title': 'Tableau de Bord',
    'dashboard.welcome': 'Bienvenue',
    'dashboard.overview': 'Vue d\'ensemble',
    'dashboard.total_packages': 'Total Colis',
    'dashboard.revenue': 'Revenus',
    'dashboard.in_transit': 'En Transit',
    'dashboard.arrived': 'Arrivés',
    'dashboard.recent_packages': 'Colis Récents',
    'dashboard.quick_actions': 'Actions Rapides',
    'dashboard.create_package': 'Créer un Colis',
    'dashboard.track_package': 'Suivre un Colis',
    'dashboard.view_analytics': 'Voir Analytics',
    'dashboard.manage_clients': 'Gérer Clients',
    'dashboard.customize': 'Personnaliser',
    'dashboard.add_widget': 'Ajouter Widget',
    'dashboard.save_changes': 'Sauvegarder',
    'dashboard.cancel': 'Annuler',
    
    // Packages
    'packages.title': 'Gestion des Colis',
    'packages.search': 'Rechercher un colis...',
    'packages.all_status': 'Tous les statuts',
    'packages.create_new': 'Nouveau Colis',
    'packages.export': 'Exporter',
    'packages.tracking_number': 'Numéro de suivi',
    'packages.description': 'Description',
    'packages.status': 'Statut',
    'packages.weight': 'Poids',
    'packages.price': 'Prix',
    'packages.actions': 'Actions',
    'packages.edit': 'Modifier',
    'packages.view': 'Voir',
    
    // Analytics
    'analytics.title': 'Analytics Avancées',
    'analytics.performance': 'Analysez vos performances et tendances business',
    'analytics.export': 'Exporter',
    'analytics.refresh': 'Actualiser',
    'analytics.shipments': 'Expéditions',
    'analytics.customers': 'Clients',
    'analytics.delivery_time': 'Temps de livraison',
    
    // Sidebar Navigation
    nav: {
      client_space: 'Espace Client',
      operations: 'Opérations',
      clients_relations: 'Clients & Relations',
      finances: 'Finances & Comptabilité',
      business: 'Business & Marketing',
      hr: 'Ressources Humaines',
      support: 'Support Client',
      admin: 'Administration',
      profile: 'Mon Compte',
      client_dashboard: 'Tableau de bord',
      new_quote: 'Nouveau Devis',
      my_requests: 'Mes Demandes',
      my_packages: 'Mes Colis',
      individual_clients: 'Clients Particuliers',
      companies: 'Clients Entreprises',
      agents: 'Agents Partenaires',
      contacts: 'Annuaire Contacts',
      communication: 'Communication',
      my_profile: 'Mon Profil',
      preferences: 'Préférences',
    },
    
    // Footer
    'footer.services': 'Services',
    'footer.package_management': 'Gestion des Colis',
    'footer.cargo_management': 'Gestion des Cargos',
    'footer.client_management': 'Gestion Clients',
    'footer.tracking': 'Suivi de Colis',
    'footer.support': 'Support',
    'footer.help_center': 'Centre d\'Aide',
    'footer.contact': 'Contact',
    'footer.documentation': 'Documentation',
    'footer.faq': 'FAQ',
    'footer.contact_info': 'Informations de Contact',
    'footer.address': 'Dakar, Côte d\'Ivoire',
    'footer.phone': '+221 33 123 45 67',
    'footer.email': 'contact@nextmove.com',
    'footer.support_24_7': 'Support 24/7',
    'footer.description': 'La plateforme de référence pour vos échanges commerciaux Chine-Afrique',
    'footer.rights': 'Tous droits réservés.'
  },
  
  en: {
    // Navigation
    'nav.track': 'Track Package',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    'nav.free_trial': 'Free Trial',
    'nav.language': 'Language',
    
    // Hero Section
    'hero.title': 'SaaS Logistics',
    'hero.subtitle': 'China-Africa',
    'hero.description': 'The reference platform for your trade exchanges between China and Africa. Real-time tracking, total transparency, guaranteed delivery.',
    'hero.cta_trial': '14-day free trial',
    'hero.cta_track': 'Track a package',
    
    // Stats
    'stats.packages': 'Packages processed',
    'stats.countries': 'UEMOA/CEMAC countries',
    'stats.delivery_rate': 'Delivery rate',
    'stats.support': 'Customer support',
    
    // Features
    'features.title': 'Why choose our platform?',
    'features.subtitle': 'A complete and innovative solution to optimize your trade exchanges',
    'features.coverage.title': 'Total Coverage',
    'features.coverage.description': 'Present in all UEMOA and CEMAC countries with a network of reliable partners',
    'features.performance.title': 'Exceptional Performance',
    'features.performance.description': 'Results that speak for themselves with unmatched customer satisfaction',
    'features.security.title': 'Maximum Security',
    'features.security.description': 'Your goods are protected at every step of the process',
    
    // Routes
    'routes.title': 'Our Trade Routes',
    'routes.subtitle': 'Direct connections between major Chinese and African cities',
    
    // Testimonials
    'testimonials.title': 'What our customers say',
    'testimonials.subtitle': 'Customer satisfaction is our absolute priority',
    
    // CTA
    'cta.title': 'Ready to revolutionize your logistics?',
    'cta.subtitle': 'Join thousands of companies that trust us',
    'cta.start': 'Start now',
    'cta.demo': 'See a demo',
    
    // Dashboard
    'dashboard.my_profile': 'My Profile',
    'dashboard.my_orders': 'My Orders',
    'dashboard.my_packages': 'My Packages',
    'dashboard.notifications': 'Notifications',
    'dashboard.settings': 'Settings',
    
    // Rating System
    'rating.title': 'Reviews and Ratings',
    'rating.subtitle': 'Discover what our users think about our platform and partner companies',
    'rating.platform_title': 'Rate the Platform',
    'rating.platform_description': 'Share your overall experience with NextMove',
    'rating.companies_title': 'Partner Companies',
    'rating.companies_description': 'Rate logistics companies',
    'rating.based_on': 'Based on',
    'rating.reviews': 'reviews',
    'rating.rate_platform': 'Rate platform',
    'rating.view_all_companies': 'View all companies',
    'rating.recent_reviews': 'Recent reviews from our users',
    
    // Documentation
    'nav.documentation': 'Documentation',
    'doc.complete_guide': 'Complete NextMove Cargo user guide',
    'doc.search_placeholder': 'Search in documentation...',
    'doc.platform_title': 'Your China-Africa logistics platform',
    'doc.platform_description': 'NextMove Cargo is your complete solution for managing shipments between China and Africa. This platform allows you to:',
    'doc.manage_packages': 'Manage your packages and shipments',
    'doc.calculate_rates': 'Calculate rates in real time',
    'doc.track_performance': 'Track your performance',
    'doc.communicate_clients': 'Communicate with your clients',
    'doc.automate_processes': 'Automate your processes',
    'doc.getting_started': 'Getting started',
    'doc.welcome_title': 'Welcome to NextMove Cargo',
    'doc.initial_config': 'Initial configuration',
    'doc.package_management': 'Package management',
    'doc.pricing': 'Pricing',
    'doc.client_management': 'Client management',
    'doc.analytics': 'Analytics and reports',
    'doc.ai_assistant': 'AI Assistant',
    'doc.integrations': 'Integrations',
    'doc.troubleshooting': 'Troubleshooting',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.total_packages': 'Total Packages',
    'dashboard.revenue': 'Revenue',
    'dashboard.in_transit': 'In Transit',
    'dashboard.arrived': 'Arrived',
    'dashboard.recent_packages': 'Recent Packages',
    'dashboard.quick_actions': 'Quick Actions',
    'dashboard.create_package': 'Create Package',
    'dashboard.track_package': 'Track Package',
    'dashboard.view_analytics': 'View Analytics',
    'dashboard.manage_clients': 'Manage Clients',
    'dashboard.customize': 'Customize',
    'dashboard.add_widget': 'Add Widget',
    'dashboard.save_changes': 'Save Changes',
    'dashboard.cancel': 'Cancel',
    
    // Packages
    'packages.title': 'Package Management',
    'packages.search': 'Search packages...',
    'packages.all_status': 'All statuses',
    'packages.create_new': 'New Package',
    'packages.export': 'Export',
    'packages.tracking_number': 'Tracking Number',
    'packages.description': 'Description',
    'packages.status': 'Status',
    'packages.weight': 'Weight',
    'packages.price': 'Price',
    'packages.actions': 'Actions',
    'packages.edit': 'Edit',
    'packages.view': 'View',
    
    // Analytics
    'analytics.title': 'Advanced Analytics',
    'analytics.performance': 'Analyze your performance and business trends',
    'analytics.export': 'Export',
    'analytics.refresh': 'Refresh',
    'analytics.shipments': 'Shipments',
    'analytics.customers': 'Customers',
    'analytics.delivery_time': 'Delivery Time',
    
    // Sidebar Navigation
    'nav.client_space': 'Client Space',
    'nav.operations': 'Operations',
    'nav.clients_relations': 'Clients & Relations',
    'nav.finances': 'Finance & Accounting',
    'nav.business': 'Business & Marketing',
    'nav.hr': 'Human Resources',
    'nav.support': 'Customer Support',
    'nav.admin': 'Administration',
    'nav.profile': 'My Account',
    'nav.client_dashboard': 'Dashboard',
    'nav.new_quote': 'New Quote',
    'nav.my_requests': 'My Requests',
    'nav.my_packages': 'My Packages',
    'nav.individual_clients': 'Individual Clients',
    'nav.companies': 'Corporate Clients',
    'nav.agents': 'Partner Agents',
    'nav.contacts': 'Contact Directory',
    'nav.communication': 'Communication',
    'nav.my_profile': 'My Profile',
    'nav.preferences': 'Preferences',
    
    // Footer
    'footer.services': 'Services',
    'footer.package_management': 'Package Management',
    'footer.cargo_management': 'Cargo Management',
    'footer.client_management': 'Client Management',
    'footer.tracking': 'Tracking',
    'footer.support': 'Support',
    'footer.help_center': 'Help Center',
    'footer.contact': 'Contact',
    'footer.documentation': 'Documentation',
    'footer.faq': 'FAQ',
    'footer.contact_info': 'Contact Information',
    'footer.address': 'Dakar, Ivory Coast',
    'footer.phone': '+221 33 123 45 67',
    'footer.email': 'contact@nextmove.com',
    'footer.support_24_7': '24/7 Support',
    'footer.description': 'The reference platform for your China-Africa trade exchanges',
    'footer.rights': 'All rights reserved.'
  },
  
  pt: {
    // Navigation
    'nav.track': 'Rastrear Encomenda',
    'nav.pricing': 'Preços',
    'nav.about': 'Sobre',
    'nav.contact': 'Contato',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    'nav.free_trial': 'Teste Grátis',
    'nav.language': 'Idioma',
    
    // Hero Section
    'hero.title': 'SaaS Logística',
    'hero.subtitle': 'China-África',
    'hero.description': 'A plataforma de referência para seus intercâmbios comerciais entre China e África. Rastreamento em tempo real, transparência total, entrega garantida.',
    'hero.cta_trial': 'Teste grátis de 14 dias',
    'hero.cta_track': 'Rastrear encomenda',
    
    // Stats
    'stats.packages': 'Encomendas processadas',
    'stats.countries': 'Países UEMOA/CEMAC',
    'stats.delivery_rate': 'Taxa de entrega',
    'stats.support': 'Suporte ao cliente',
    
    // Features
    'features.title': 'Por que escolher nossa plataforma?',
    'features.subtitle': 'Uma solução completa e inovadora para otimizar seus intercâmbios comerciais',
    'features.coverage.title': 'Cobertura Total',
    'features.coverage.description': 'Presente em todos os países UEMOA e CEMAC com uma rede de parceiros confiáveis',
    'features.performance.title': 'Performance Excepcional',
    'features.performance.description': 'Resultados que falam por si com satisfação do cliente incomparável',
    'features.security.title': 'Segurança Máxima',
    'features.security.description': 'Suas mercadorias são protegidas em cada etapa do processo',
    
    // Routes
    'routes.title': 'Nossas Rotas Comerciais',
    'routes.subtitle': 'Conexões diretas entre as principais cidades chinesas e africanas',
    
    // Testimonials
    'testimonials.title': 'O que dizem nossos clientes',
    'testimonials.subtitle': 'A satisfação do cliente é nossa prioridade absoluta',
    
    // CTA
    'cta.title': 'Pronto para revolucionar sua logística?',
    'cta.subtitle': 'Junte-se a milhares de empresas que confiam em nós',
    'cta.start': 'Começar agora',
    'cta.demo': 'Ver demonstração',
    
    // Dashboard
    'dashboard.my_profile': 'Meu Perfil',
    'dashboard.my_orders': 'Meus Pedidos',
    'dashboard.my_packages': 'Minhas Encomendas',
    'dashboard.notifications': 'Notificações',
    'dashboard.settings': 'Configurações',
    
    // Rating System
    'rating.title': 'Avaliações e Comentários',
    'rating.subtitle': 'Descubra o que nossos usuários pensam sobre nossa plataforma e empresas parceiras',
    'rating.platform_title': 'Avaliar a Plataforma',
    'rating.platform_description': 'Compartilhe sua experiência geral com NextMove',
    'rating.companies_title': 'Empresas Parceiras',
    'rating.companies_description': 'Avalie empresas de logística',
    'rating.based_on': 'Baseado em',
    'rating.reviews': 'avaliações',
    'rating.rate_platform': 'Avaliar plataforma',
    'rating.view_all_companies': 'Ver todas as empresas',
    'rating.recent_reviews': 'Avaliações recentes de nossos usuários',
    
    // Footer
    'footer.services': 'Serviços',
    'footer.package_management': 'Gestão de Encomendas',
    'footer.cargo_management': 'Gestão de Cargas',
    'footer.client_management': 'Gestão de Clientes',
    'footer.tracking': 'Rastreamento',
    'footer.support': 'Suporte',
    'footer.help_center': 'Centro de Ajuda',
    'footer.contact': 'Contato',
    'footer.documentation': 'Documentação',
    'footer.faq': 'FAQ',
    'footer.contact_info': 'Informações de Contato',
    'footer.address': 'Dakar, Costa do Marfim',
    'footer.phone': '+221 33 123 45 67',
    'footer.email': 'contact@nextmove.com',
    'footer.support_24_7': 'Suporte 24/7',
    'footer.description': 'A plataforma de referência para seus intercâmbios comerciais China-África',
    'footer.rights': 'Todos os direitos reservados.'
  },
  
  es: {
    // Navigation
    'nav.track': 'Rastrear Paquete',
    'nav.pricing': 'Precios',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar Sesión',
    'nav.dashboard': 'Panel',
    'nav.free_trial': 'Prueba Gratuita',
    'nav.language': 'Idioma',
    
    // Hero Section
    'hero.title': 'SaaS Logística',
    'hero.subtitle': 'China-África',
    'hero.description': 'La plataforma de referencia para sus intercambios comerciales entre China y África. Seguimiento en tiempo real, transparencia total, entrega garantizada.',
    'hero.cta_trial': 'Prueba gratuita de 14 días',
    'hero.cta_track': 'Rastrear paquete',
    
    // Stats
    'stats.packages': 'Paquetes procesados',
    'stats.countries': 'Países UEMOA/CEMAC',
    'stats.delivery_rate': 'Tasa de entrega',
    'stats.support': 'Soporte al cliente',
    
    // Features
    'features.title': '¿Por qué elegir nuestra plataforma?',
    'features.subtitle': 'Una solución completa e innovadora para optimizar sus intercambios comerciales',
    'features.coverage.title': 'Cobertura Total',
    'features.coverage.description': 'Presente en todos los países UEMOA y CEMAC con una red de socios confiables',
    'features.performance.title': 'Rendimiento Excepcional',
    'features.performance.description': 'Resultados que hablan por sí mismos con satisfacción del cliente inigualable',
    'features.security.title': 'Seguridad Máxima',
    'features.security.description': 'Sus mercancías están protegidas en cada paso del proceso',
    
    // Routes
    'routes.title': 'Nuestras Rutas Comerciales',
    'routes.subtitle': 'Conexiones directas entre las principales ciudades chinas y africanas',
    
    // Testimonials
    'testimonials.title': 'Lo que dicen nuestros clientes',
    'testimonials.subtitle': 'La satisfacción del cliente es nuestra prioridad absoluta',
    
    // CTA
    'cta.title': '¿Listo para revolucionar su logística?',
    'cta.subtitle': 'Únase a miles de empresas que confían en nosotros',
    'cta.start': 'Comenzar ahora',
    'cta.demo': 'Ver demostración',
    
    // Dashboard
    'dashboard.my_profile': 'Mi Perfil',
    'dashboard.my_orders': 'Mis Pedidos',
    'dashboard.my_packages': 'Mis Paquetes',
    'dashboard.notifications': 'Notificaciones',
    'dashboard.settings': 'Configuración'
  },
  
  ar: {
    // Navigation
    'nav.track': 'تتبع الطرد',
    'nav.pricing': 'الأسعار',
    'nav.about': 'حول',
    'nav.contact': 'اتصل',
    'nav.login': 'تسجيل الدخول',
    'nav.dashboard': 'لوحة التحكم',
    'nav.free_trial': 'تجربة مجانية',
    'nav.language': 'اللغة',
    
    // Hero Section
    'hero.title': 'منصة اللوجستيات',
    'hero.subtitle': 'الصين-أفريقيا',
    'hero.description': 'المنصة المرجعية لتبادلاتكم التجارية بين الصين وأفريقيا. تتبع في الوقت الفعلي، شفافية تامة، تسليم مضمون.',
    'hero.cta_trial': 'تجربة مجانية لمدة 14 يوم',
    'hero.cta_track': 'تتبع طرد',
    
    // Stats
    'stats.packages': 'الطرود المعالجة',
    'stats.countries': 'دول الاتحاد الاقتصادي والنقدي',
    'stats.delivery_rate': 'معدل التسليم',
    'stats.support': 'دعم العملاء',
    
    // Features
    'features.title': 'لماذا تختار منصتنا؟',
    'features.subtitle': 'حل شامل ومبتكر لتحسين تبادلاتكم التجارية',
    'features.coverage.title': 'تغطية شاملة',
    'features.coverage.description': 'متواجدون في جميع دول الاتحاد الاقتصادي والنقدي مع شبكة من الشركاء الموثوقين',
    'features.performance.title': 'أداء استثنائي',
    'features.performance.description': 'نتائج تتحدث عن نفسها مع رضا عملاء لا مثيل له',
    'features.security.title': 'أمان أقصى',
    'features.security.description': 'بضائعكم محمية في كل خطوة من العملية',
    
    // Routes
    'routes.title': 'طرقنا التجارية',
    'routes.subtitle': 'اتصالات مباشرة بين المدن الصينية والأفريقية الرئيسية',
    
    // Testimonials
    'testimonials.title': 'ما يقوله عملاؤنا',
    'testimonials.subtitle': 'رضا العملاء هو أولويتنا المطلقة',
    
    // CTA
    'cta.title': 'مستعد لثورة في اللوجستيات؟',
    'cta.subtitle': 'انضم إلى آلاف الشركات التي تثق بنا',
    'cta.start': 'ابدأ الآن',
    'cta.demo': 'شاهد العرض التوضيحي',
    
    // Dashboard
    'dashboard.my_profile': 'ملفي الشخصي',
    'dashboard.my_orders': 'طلباتي',
    'dashboard.my_packages': 'طردي',
    'dashboard.notifications': 'الإشعارات',
    'dashboard.settings': 'الإعدادات'
  },
  
  zh: {
    // Navigation
    'nav.track': '追踪包裹',
    'nav.pricing': '价格',
    'nav.about': '关于我们',
    'nav.contact': '联系我们',
    'nav.login': '登录',
    'nav.dashboard': '仪表板',
    'nav.free_trial': '免费试用',
    'nav.language': '语言',
    
    // Hero Section
    'hero.title': 'SaaS物流',
    'hero.subtitle': '中非贸易',
    'hero.description': '中非贸易交流的参考平台。实时追踪，完全透明，保证交付。',
    'hero.cta_trial': '14天免费试用',
    'hero.cta_track': '追踪包裹',
    
    // Stats
    'stats.packages': '处理包裹',
    'stats.countries': 'UEMOA/CEMAC国家',
    'stats.delivery_rate': '交付率',
    'stats.support': '客户支持',
    
    // Features
    'features.title': '为什么选择我们的平台？',
    'features.subtitle': '优化贸易交流的完整创新解决方案',
    'features.coverage.title': '全面覆盖',
    'features.coverage.description': '在所有UEMOA和CEMAC国家都有可靠的合作伙伴网络',
    'features.performance.title': '卓越性能',
    'features.performance.description': '无与伦比的客户满意度，结果不言而喻',
    'features.security.title': '最大安全',
    'features.security.description': '您的货物在流程的每一步都受到保护',
    
    // Routes
    'routes.title': '我们的贸易路线',
    'routes.subtitle': '中非主要城市之间的直接连接',
    
    // Testimonials
    'testimonials.title': '客户评价',
    'testimonials.subtitle': '客户满意是我们的绝对优先',
    
    // CTA
    'cta.title': '准备革新您的物流？',
    'cta.subtitle': '加入信任我们的数千家企业',
    'cta.start': '立即开始',
    'cta.demo': '查看演示',
    
    // Dashboard
    'dashboard.my_profile': '我的资料',
    'dashboard.my_orders': '我的订单',
    'dashboard.my_packages': '我的包裹',
    'dashboard.notifications': '通知',
    'dashboard.settings': '设置'
  },
  
  'zh-cn': {
    // Navigation
    'nav.track': '追踪包裹',
    'nav.pricing': '价格',
    'nav.about': '关于我们',
    'nav.contact': '联系我们',
    'nav.login': '登录',
    'nav.dashboard': '仪表板',
    'nav.free_trial': '免费试用',
    'nav.language': '语言',
    
    // Hero Section
    'hero.title': 'SaaS物流',
    'hero.subtitle': '中非贸易',
    'hero.description': '中非贸易交流的参考平台。实时追踪，完全透明，保证交付。',
    'hero.cta_trial': '14天免费试用',
    'hero.cta_track': '追踪包裹',
    
    // Stats
    'stats.packages': '处理包裹',
    'stats.countries': 'UEMOA/CEMAC国家',
    'stats.delivery_rate': '交付率',
    'stats.support': '客户支持',
    
    // Features
    'features.title': '为什么选择我们的平台？',
    'features.subtitle': '优化贸易交流的完整创新解决方案',
    'features.coverage.title': '全面覆盖',
    'features.coverage.description': '在所有UEMOA和CEMAC国家都有可靠的合作伙伴网络',
    'features.performance.title': '卓越性能',
    'features.performance.description': '无与伦比的客户满意度，结果不言而喻',
    'features.security.title': '最大安全',
    'features.security.description': '您的货物在流程的每一步都受到保护',
    
    // Routes
    'routes.title': '我们的贸易路线',
    'routes.subtitle': '中非主要城市之间的直接连接',
    
    // Testimonials
    'testimonials.title': '客户评价',
    'testimonials.subtitle': '客户满意是我们的绝对优先',
    
    // CTA
    'cta.title': '准备革新您的物流？',
    'cta.subtitle': '加入信任我们的数千家企业',
    'cta.start': '立即开始',
    'cta.demo': '查看演示',
    
    // Dashboard
    'dashboard.my_profile': '我的资料',
    'dashboard.my_orders': '我的订单',
    'dashboard.my_packages': '我的包裹',
    'dashboard.notifications': '通知',
    'dashboard.settings': '设置'
  },
  
  ru: {
    // Navigation
    'nav.track': 'Отследить посылку',
    'nav.pricing': 'Цены',
    'nav.about': 'О нас',
    'nav.contact': 'Контакты',
    'nav.login': 'Войти',
    'nav.dashboard': 'Панель',
    'nav.free_trial': 'Бесплатная пробная версия',
    'nav.language': 'Язык',
    
    // Hero Section
    'hero.title': 'SaaS Логистика',
    'hero.subtitle': 'Китай-Африка',
    'hero.description': 'Эталонная платформа для ваших торговых обменов между Китаем и Африкой. Отслеживание в реальном времени, полная прозрачность, гарантированная доставка.',
    'hero.cta_trial': '14-дневная бесплатная пробная версия',
    'hero.cta_track': 'Отследить посылку',
    
    // Stats
    'stats.packages': 'Обработанные посылки',
    'stats.countries': 'Страны UEMOA/CEMAC',
    'stats.delivery_rate': 'Процент доставки',
    'stats.support': 'Поддержка клиентов',
    
    // Features
    'features.title': 'Почему выбрать нашу платформу?',
    'features.subtitle': 'Полное и инновационное решение для оптимизации ваших торговых обменов',
    'features.coverage.title': 'Полное покрытие',
    'features.coverage.description': 'Присутствие во всех странах UEMOA и CEMAC с сетью надежных партнеров',
    'features.performance.title': 'Исключительная производительность',
    'features.performance.description': 'Результаты говорят сами за себя с непревзойденным удовлетворением клиентов',
    'features.security.title': 'Максимальная безопасность',
    'features.security.description': 'Ваши товары защищены на каждом этапе процесса',
    
    // Routes
    'routes.title': 'Наши торговые маршруты',
    'routes.subtitle': 'Прямые соединения между основными китайскими и африканскими городами',
    
    // Testimonials
    'testimonials.title': 'Что говорят наши клиенты',
    'testimonials.subtitle': 'Удовлетворение клиентов - наш абсолютный приоритет',
    
    // CTA
    'cta.title': 'Готовы революционизировать вашу логистику?',
    'cta.subtitle': 'Присоединяйтесь к тысячам компаний, которые нам доверяют',
    'cta.start': 'Начать сейчас',
    'cta.demo': 'Посмотреть демо',
    
    // Dashboard
    'dashboard.my_profile': 'Мой профиль',
    'dashboard.my_orders': 'Мои заказы',
    'dashboard.my_packages': 'Мои посылки',
    'dashboard.notifications': 'Уведомления',
    'dashboard.settings': 'Настройки',
    
    // Rating System
    'rating.title': 'Оценки и Отзывы',
    'rating.subtitle': 'Узнайте, что наши пользователи думают о нашей платформе и компаниях-партнерах',
    'rating.platform_title': 'Оценить Платформу',
    'rating.platform_description': 'Поделитесь своим общим опытом с NextMove',
    'rating.companies_title': 'Компании-Партнеры',
    'rating.companies_description': 'Оцените логистические компании',
    'rating.based_on': 'Основано на',
    'rating.reviews': 'отзывах',
    'rating.rate_platform': 'Оценить платформу',
    'rating.view_all_companies': 'Посмотреть все компании',
    'rating.recent_reviews': 'Недавние отзывы наших пользователей',
    
    // Footer
    'footer.services': 'Услуги',
    'footer.package_management': 'Управление посылками',
    'footer.cargo_management': 'Управление грузами',
    'footer.client_management': 'Управление клиентами',
    'footer.tracking': 'Отслеживание',
    'footer.support': 'Поддержка',
    'footer.help_center': 'Центр помощи',
    'footer.contact': 'Контакт',
    'footer.documentation': 'Документация',
    'footer.faq': 'FAQ',
    'footer.contact_info': 'Контактная информация',
    'footer.address': 'Дакар, Кот-д\'Ивуар',
    'footer.phone': '+221 33 123 45 67',
    'footer.email': 'contact@nextmove.com',
    'footer.support_24_7': 'Поддержка 24/7',
    'footer.description': 'Эталонная платформа для ваших торговых обменов Китай-Африка',
    'footer.rights': 'Все права защищены.'
  }
}

export function getTranslation(key: string, language?: string): string {
  const lang = language || getCurrentLanguage()
  const keys = key.split('.')
  let value: any = translations[lang as keyof typeof translations]
  
  // Si la langue n'existe pas, utiliser le français par défaut
  if (!value) {
    value = translations.fr
  }
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  if (value === undefined || value === null) {
    // Fallback to French if translation not found
    let fallbackValue: any = translations.fr
    for (const k of keys) {
      fallbackValue = fallbackValue?.[k]
    }
    
    // Si même le fallback français n'existe pas, retourner la clé
    if (fallbackValue === undefined || fallbackValue === null) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    
    return fallbackValue
  }
  
  return value
}

// Hook pour forcer le re-render des composants lors du changement de langue
export function useTranslation() {
  const [currentLang, setCurrentLang] = useState(() => getCurrentLanguage())
  const [forceRefresh, setForceRefresh] = useState(0)
  
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = getCurrentLanguage()
      setCurrentLang(newLang)
      setForceRefresh(prev => prev + 1)
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('languageChanged', handleLanguageChange)
      return () => window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [])
  
  const t = useCallback((key: string) => {
    return getTranslation(key, currentLang)
  }, [currentLang, forceRefresh])
  
  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang)
    setCurrentLang(lang)
  }
  
  return { t, currentLang, setLanguage }
}


export function getCurrentLanguage(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language')
    if (stored && translations[stored as keyof typeof translations]) {
      return stored
    }
    // Si pas de langue stockée ou langue invalide, utiliser le français par défaut
    localStorage.setItem('language', defaultLanguage)
    return defaultLanguage
  }
  return defaultLanguage
}

export function setCurrentLanguage(language: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language)
    // Déclencher un événement pour notifier les composants du changement
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }))
  }
}
