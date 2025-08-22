// Générateur de données mock pour la plateforme NextMove Cargo
import { 
  User, Company, Package, Client, Transaction, Commission, 
  Agent, Cargo, SupportTicket, Employee, Invoice, Notification,
  DashboardStats, CompanyStats 
} from '@/types/api';

// Données de base
const africanCountries = [
  'Sénégal', 'Mali', 'Burkina Faso', 'Côte d\'Ivoire', 'Ghana', 'Nigeria',
  'Cameroun', 'Gabon', 'Congo', 'RDC', 'Kenya', 'Tanzanie', 'Maroc', 'Tunisie'
];

const africanCities = [
  'Dakar', 'Bamako', 'Ouagadougou', 'Abidjan', 'Accra', 'Lagos',
  'Douala', 'Libreville', 'Brazzaville', 'Kinshasa', 'Nairobi', 'Dar es Salaam'
];

const africanNames = [
  'Amadou Diallo', 'Fatou Sow', 'Moussa Keita', 'Awa Ndiaye', 'Ousmane Ba',
  'Mariama Cissé', 'Ibrahim Touré', 'Aissatou Fall', 'Mamadou Diouf', 'Khady Sarr',
  'Sekou Camara', 'Bineta Sy', 'Abdoulaye Wade', 'Coumba Gueye', 'Modou Faye'
];

const companyNames = [
  'LogiTrans Sénégal', 'Sahara Express', 'Baobab Logistics', 'AfriCargo Plus',
  'Desert Bridge Transport', 'Savane Shipping', 'Atlantic Cargo', 'Harmattan Express'
];

// Générateurs de données
export const generateUsers = (count: number = 50): User[] => {
  const users: User[] = [];
  
  for (let i = 0; i < count; i++) {
    const name = africanNames[Math.floor(Math.random() * africanNames.length)];
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const roles: User['role'][] = ['SUPER_ADMIN', 'ADMIN', 'CLIENT'];
    
    users.push({
      id: `user_${i + 1}`,
      email,
      name,
      role: roles[Math.floor(Math.random() * roles.length)],
      companyId: Math.random() > 0.1 ? `company_${Math.floor(Math.random() * 8) + 1}` : undefined,
      phone: `+221 ${70 + Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return users;
};

export const generateCompanies = (count: number = 8): Company[] => {
  const companies: Company[] = [];
  
  for (let i = 0; i < count; i++) {
    const name = companyNames[i] || `Entreprise ${i + 1}`;
    const country = africanCountries[Math.floor(Math.random() * africanCountries.length)];
    const city = africanCities[Math.floor(Math.random() * africanCities.length)];
    const plans: Company['subscriptionPlan'][] = ['BASIC', 'PREMIUM', 'ENTERPRISE'];
    
    companies.push({
      id: `company_${i + 1}`,
      name,
      email: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+221 33 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
      address: `${Math.floor(Math.random() * 999) + 1} Avenue ${africanNames[Math.floor(Math.random() * africanNames.length)].split(' ')[1]}`,
      city,
      country,
      website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      subscriptionPlan: plans[Math.floor(Math.random() * plans.length)],
      isActive: Math.random() > 0.1,
      createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return companies;
};

export const generatePackages = (count: number = 200): Package[] => {
  const packages: Package[] = [];
  const modes: Package['shippingMode'][] = ['AERIEN', 'AERIEN_EXPRESS', 'MARITIME', 'MARITIME_EXPRESS'];
  const statuses: Package['status'][] = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
  
  for (let i = 0; i < count; i++) {
    const mode = modes[Math.floor(Math.random() * modes.length)];
    const weight = Math.random() * 50 + 1;
    const dimensions = mode.includes('MARITIME') ? {
      length: Math.random() * 2 + 0.5,
      width: Math.random() * 2 + 0.5,
      height: Math.random() * 2 + 0.5,
      cbm: 0
    } : undefined;
    
    if (dimensions) {
      dimensions.cbm = dimensions.length * dimensions.width * dimensions.height;
    }
    
    const basePrice = mode.includes('AERIEN') ? weight * 5000 : (dimensions?.cbm || 1) * 150000;
    const price = basePrice * (mode.includes('EXPRESS') ? 1.5 : 1);
    
    packages.push({
      id: `package_${i + 1}`,
      trackingNumber: `NMC${Date.now().toString().slice(-6)}${i.toString().padStart(3, '0')}`,
      senderName: africanNames[Math.floor(Math.random() * africanNames.length)],
      senderPhone: `+221 ${70 + Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
      senderAddress: `${Math.floor(Math.random() * 999) + 1} Rue ${Math.floor(Math.random() * 50) + 1}, ${africanCities[Math.floor(Math.random() * africanCities.length)]}`,
      recipientName: africanNames[Math.floor(Math.random() * africanNames.length)],
      recipientPhone: `+86 ${130 + Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
      recipientAddress: `Room ${Math.floor(Math.random() * 999) + 1}, Building ${Math.floor(Math.random() * 50) + 1}, Guangzhou, China`,
      weight,
      dimensions,
      shippingMode: mode,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      price,
      currency: 'XOF',
      companyId: `company_${Math.floor(Math.random() * 8) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return packages;
};

export const generateClients = (count: number = 100): Client[] => {
  const clients: Client[] = [];
  
  for (let i = 0; i < count; i++) {
    const name = africanNames[Math.floor(Math.random() * africanNames.length)];
    const country = africanCountries[Math.floor(Math.random() * africanCountries.length)];
    const city = africanCities[Math.floor(Math.random() * africanCities.length)];
    const totalPackages = Math.floor(Math.random() * 20) + 1;
    const totalSpent = totalPackages * (Math.random() * 500000 + 50000);
    
    clients.push({
      id: `client_${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: `+221 ${70 + Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
      address: `${Math.floor(Math.random() * 999) + 1} Avenue ${name.split(' ')[1]}`,
      city,
      country,
      type: Math.random() > 0.7 ? 'BUSINESS' : 'INDIVIDUAL',
      companyId: `company_${Math.floor(Math.random() * 8) + 1}`,
      totalPackages,
      totalSpent,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return clients;
};

export const generateTransactions = (packages: Package[]): Transaction[] => {
  const transactions: Transaction[] = [];
  const statuses: Transaction['status'][] = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
  const methods: Transaction['paymentMethod'][] = ['CARD', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CASH'];
  const providers = ['CinetPay', 'Kkiapay', 'Wave', 'Orange Money', 'Free Money'];
  
  packages.forEach((pkg, i) => {
    if (Math.random() > 0.1) { // 90% des colis ont une transaction
      transactions.push({
        id: `transaction_${i + 1}`,
        packageId: pkg.id,
        amount: pkg.price,
        currency: pkg.currency,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentMethod: methods[Math.floor(Math.random() * methods.length)],
        paymentProvider: providers[Math.floor(Math.random() * providers.length)],
        transactionRef: `TXN${Date.now().toString().slice(-8)}${i.toString().padStart(3, '0')}`,
        companyId: pkg.companyId,
        createdAt: pkg.createdAt,
        updatedAt: new Date()
      });
    }
  });
  
  return transactions;
};

export const generateAgents = (count: number = 30): Agent[] => {
  const agents: Agent[] = [];
  const specializations = ['Import/Export', 'Douanes', 'Transport Maritime', 'Transport Aérien', 'Logistique'];
  const zones = ['Dakar Centre', 'Dakar Banlieue', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor'];
  
  for (let i = 0; i < count; i++) {
    const name = africanNames[Math.floor(Math.random() * africanNames.length)];
    const country = africanCountries[Math.floor(Math.random() * africanCountries.length)];
    const city = africanCities[Math.floor(Math.random() * africanCities.length)];
    
    agents.push({
      id: `agent_${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@agents.com`,
      phone: `+221 ${70 + Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
      address: `${Math.floor(Math.random() * 999) + 1} Rue ${name.split(' ')[1]}`,
      city,
      country,
      commissionRate: Math.random() * 10 + 2, // 2-12%
      zone: zones[Math.floor(Math.random() * zones.length)],
      specialization: [specializations[Math.floor(Math.random() * specializations.length)]],
      isActive: Math.random() > 0.1,
      companyId: `company_${Math.floor(Math.random() * 8) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return agents;
};

export const generateCommissions = (packages: Package[], agents: Agent[]): Commission[] => {
  const commissions: Commission[] = [];
  const statuses: Commission['status'][] = ['PENDING', 'PAID', 'CANCELLED'];
  
  packages.forEach((pkg, i) => {
    if (Math.random() > 0.3) { // 70% des colis ont une commission
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const amount = pkg.price * (agent.commissionRate / 100);
      
      commissions.push({
        id: `commission_${i + 1}`,
        packageId: pkg.id,
        agentId: agent.id,
        amount,
        currency: pkg.currency,
        rate: agent.commissionRate,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        companyId: pkg.companyId,
        createdAt: pkg.createdAt,
        updatedAt: new Date()
      });
    }
  });
  
  return commissions;
};

export const generateCargos = (count: number = 20): Cargo[] => {
  const cargos: Cargo[] = [];
  const types: Cargo['type'][] = ['AERIEN', 'MARITIME'];
  const statuses: Cargo['status'][] = ['LOADING', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED'];
  const routes = [
    { origin: 'Dakar, Sénégal', destination: 'Guangzhou, Chine' },
    { origin: 'Abidjan, Côte d\'Ivoire', destination: 'Shanghai, Chine' },
    { origin: 'Lagos, Nigeria', destination: 'Shenzhen, Chine' },
    { origin: 'Casablanca, Maroc', destination: 'Beijing, Chine' }
  ];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const route = routes[Math.floor(Math.random() * routes.length)];
    const departureDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    const transitDays = type === 'AERIEN' ? Math.random() * 3 + 1 : Math.random() * 25 + 15;
    const arrivalDate = new Date(departureDate.getTime() + transitDays * 24 * 60 * 60 * 1000);
    
    const maxWeight = type === 'AERIEN' ? 20000 : 500000;
    const maxVolume = type === 'AERIEN' ? 100 : 2000;
    const currentWeight = Math.random() * maxWeight * 0.8;
    const currentVolume = Math.random() * maxVolume * 0.8;
    
    cargos.push({
      id: `cargo_${i + 1}`,
      name: `${type === 'AERIEN' ? 'Vol' : 'Navire'} NMC-${i + 1}`,
      type,
      origin: route.origin,
      destination: route.destination,
      departureDate,
      arrivalDate,
      capacity: {
        weight: maxWeight,
        volume: maxVolume
      },
      currentLoad: {
        weight: currentWeight,
        volume: currentVolume
      },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      packages: [], // À remplir avec les IDs des colis assignés
      companyId: `company_${Math.floor(Math.random() * 8) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  
  return cargos;
};

// Fonction principale pour générer toutes les données
export const generateAllMockData = () => {
  const companies = generateCompanies(8);
  const users = generateUsers(50);
  const packages = generatePackages(200);
  const clients = generateClients(100);
  const agents = generateAgents(30);
  const transactions = generateTransactions(packages);
  const commissions = generateCommissions(packages, agents);
  const cargos = generateCargos(20);
  
  return {
    companies,
    users,
    packages,
    clients,
    agents,
    transactions,
    commissions,
    cargos
  };
};

// Données par défaut pour les tests
export const mockData = generateAllMockData();
