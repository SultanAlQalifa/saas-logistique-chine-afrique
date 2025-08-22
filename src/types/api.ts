// Types pour l'API de la plateforme NextMove Cargo

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT';
  companyId?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website?: string;
  logo?: string;
  subscriptionPlan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Package {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    cbm: number;
  };
  shippingMode: 'AERIEN' | 'AERIEN_EXPRESS' | 'MARITIME' | 'MARITIME_EXPRESS';
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  price: number;
  currency: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  type: 'INDIVIDUAL' | 'BUSINESS';
  companyId: string;
  totalPackages: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  packageId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CARD' | 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CASH';
  paymentProvider?: string;
  transactionRef?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commission {
  id: string;
  packageId: string;
  agentId: string;
  amount: number;
  currency: string;
  rate: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  commissionRate: number;
  zone: string;
  specialization: string[];
  isActive: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cargo {
  id: string;
  name: string;
  type: 'AERIEN' | 'MARITIME';
  origin: string;
  destination: string;
  departureDate: Date;
  arrivalDate: Date;
  capacity: {
    weight: number;
    volume: number;
  };
  currentLoad: {
    weight: number;
    volume: number;
  };
  status: 'LOADING' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED';
  packages: string[];
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'DELIVERY' | 'BILLING' | 'COMPLAINT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  clientId: string;
  assignedAgentId?: string;
  messages: TicketMessage[];
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'CLIENT' | 'AGENT' | 'SYSTEM';
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  hireDate: Date;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  packageIds: string[];
  amount: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: Date;
  paidDate?: Date;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
  recipientId: string;
  recipientType: 'USER' | 'CLIENT';
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Types pour les statistiques
export interface DashboardStats {
  totalPackages: number;
  totalRevenue: number;
  totalClients: number;
  totalAgents: number;
  monthlyGrowth: {
    packages: number;
    revenue: number;
    clients: number;
  };
  recentPackages: Package[];
  topClients: Client[];
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}

export interface CompanyStats {
  totalCompanies: number;
  activeCompanies: number;
  totalRevenue: number;
  subscriptionDistribution: {
    BASIC: number;
    PREMIUM: number;
    ENTERPRISE: number;
  };
  monthlySignups: Array<{
    month: string;
    signups: number;
  }>;
}
