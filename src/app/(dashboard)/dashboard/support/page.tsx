'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  HeadphonesIcon, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  AlertCircle,
  Users,
  TrendingUp,
  Star,
  Filter,
  Search,
  Plus,
  Ticket,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Bot,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/ui/back-button';
import NextMoveAIChat from '@/components/ai/NextMoveAIChat';

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  avgResponseTime: string;
  satisfaction: number;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
  priority: 'basse' | 'normale' | 'haute' | 'urgente';
  category: string;
  clientName: string;
  clientType: 'particulier' | 'entreprise';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: number;
}

export default function SupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [priorityFilter, setPriorityFilter] = useState<string>('tous');
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    avgResponseTime: '2h 30min',
    satisfaction: 4.8
  });

  // Mock data
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: 'TK-001',
        title: 'Retard de livraison - Colis Shanghai',
        description: 'Mon colis expédié de Shanghai n\'est pas arrivé dans les délais prévus',
        status: 'ouvert',
        priority: 'haute',
        category: 'Livraison',
        clientName: 'Marie Dubois',
        clientType: 'particulier',
        createdAt: '2024-01-15T10:30:00',
        updatedAt: '2024-01-15T10:30:00',
        messages: 1
      },
      {
        id: 'TK-002',
        title: 'Problème de facturation - Expédition maritime',
        description: 'Erreur sur la facture pour l\'expédition maritime du 10 janvier',
        status: 'en_cours',
        priority: 'normale',
        category: 'Facturation',
        clientName: 'Entreprise LogiAfrica',
        clientType: 'entreprise',
        createdAt: '2024-01-14T14:20:00',
        updatedAt: '2024-01-15T09:15:00',
        assignedTo: 'Agent Support 1',
        messages: 4
      },
      {
        id: 'TK-003',
        title: 'Demande de devis - Transport aérien',
        description: 'Besoin d\'un devis pour transport aérien de 50kg vers Dakar',
        status: 'resolu',
        priority: 'normale',
        category: 'Devis',
        clientName: 'Ibrahim Diallo',
        clientType: 'particulier',
        createdAt: '2024-01-13T16:45:00',
        updatedAt: '2024-01-14T11:30:00',
        assignedTo: 'Agent Commercial',
        messages: 6
      },
      {
        id: 'TK-004',
        title: 'Colis endommagé à la réception',
        description: 'Le colis reçu présente des dommages visibles',
        status: 'en_cours',
        priority: 'urgente',
        category: 'Réclamation',
        clientName: 'SociétéImport SARL',
        clientType: 'entreprise',
        createdAt: '2024-01-15T08:00:00',
        updatedAt: '2024-01-15T08:45:00',
        assignedTo: 'Manager Support',
        messages: 3
      },
      {
        id: 'TK-005',
        title: 'Question sur les délais de livraison',
        description: 'Combien de temps pour une livraison maritime vers Abidjan ?',
        status: 'resolu',
        priority: 'basse',
        category: 'Information',
        clientName: 'Paul Martin',
        clientType: 'particulier',
        createdAt: '2024-01-12T13:20:00',
        updatedAt: '2024-01-13T10:15:00',
        assignedTo: 'Chatbot IA',
        messages: 2
      }
    ];

    setTickets(mockTickets);
    setFilteredTickets(mockTickets);

    // Calculate stats
    const statsData: TicketStats = {
      total: mockTickets.length,
      open: mockTickets.filter(t => t.status === 'ouvert').length,
      inProgress: mockTickets.filter(t => t.status === 'en_cours').length,
      resolved: mockTickets.filter(t => t.status === 'resolu').length,
      avgResponseTime: '2h 30min',
      satisfaction: 4.8
    };
    setStats(statsData);
  }, []);

  // Filter tickets
  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'tous') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'tous') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ouvert': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      case 'resolu': return 'bg-green-100 text-green-800';
      case 'ferme': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'basse': return 'bg-gray-100 text-gray-600';
      case 'normale': return 'bg-blue-100 text-blue-600';
      case 'haute': return 'bg-orange-100 text-orange-600';
      case 'urgente': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Bouton retour */}
      <BackButton href="/dashboard" label="Retour au dashboard" />
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <HeadphonesIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Support Client 🎧</h1>
            <p className="text-purple-100 mt-2">
              Gestion des tickets et chatbot intelligent pour vos clients
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-blue-500 p-2 lg:p-3 rounded-xl shadow-lg flex-shrink-0">
                <Ticket className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-blue-600 font-medium text-sm lg:text-base truncate">Total</p>
                <p className="text-xl lg:text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-orange-500 p-2 lg:p-3 rounded-xl shadow-lg flex-shrink-0">
                <AlertCircle className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-orange-600 font-medium text-sm lg:text-base truncate">Ouverts</p>
                <p className="text-xl lg:text-2xl font-bold text-orange-800">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-yellow-500 p-2 lg:p-3 rounded-xl shadow-lg flex-shrink-0">
                <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-yellow-600 font-medium text-sm lg:text-base truncate">En Cours</p>
                <p className="text-xl lg:text-2xl font-bold text-yellow-800">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-green-500 p-2 lg:p-3 rounded-xl shadow-lg flex-shrink-0">
                <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-green-600 font-medium text-sm lg:text-base truncate">Résolus</p>
                <p className="text-xl lg:text-2xl font-bold text-green-800">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-purple-500 p-2 lg:p-3 rounded-xl shadow-lg flex-shrink-0">
                <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-purple-600 font-medium text-sm lg:text-base truncate">Temps Réponse</p>
                <p className="text-base lg:text-lg font-bold text-purple-800">{stats.avgResponseTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="bg-pink-500 p-2 lg:p-3 rounded-xl shadow-lg flex-shrink-0">
                <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-pink-600 font-medium text-sm lg:text-base truncate">Satisfaction</p>
                <p className="text-xl lg:text-2xl font-bold text-pink-800">{stats.satisfaction}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="tous">Tous les statuts</option>
            <option value="ouvert">Ouvert</option>
            <option value="en_cours">En cours</option>
            <option value="resolu">Résolu</option>
            <option value="ferme">Fermé</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="tous">Toutes priorités</option>
            <option value="basse">Basse</option>
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => router.push('/dashboard/support/chatbot')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Bot className="h-4 w-4 mr-2" />
            Chatbot IA
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/support/tickets/create')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Ticket
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/support/config')}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
        </div>
      </div>

      {/* AI Assistant & Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Assistant */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              🤖 Assistant Support IA
            </h2>
            <p className="text-sm text-gray-600">Support client intelligent 24/7</p>
          </div>
          <NextMoveAIChat 
            context={{
              user: {
                name: "Agent Support",
                tenant: "support",
                locale: "fr",
                role: "ADMIN"
              },
              recent_shipments: [],
              recent_invoices: [],
              active_features: ["support", "tickets", "escalation", "ai_assistant"]
            }}
            onActionClick={(action) => {
              switch (action.type) {
                case 'escalate':
                  router.push('/dashboard/support/tickets/create')
                  break
                case 'support':
                  router.push('/dashboard/support/chatbot')
                  break
                case 'track':
                  router.push('/dashboard/packages')
                  break
                default:
                  console.log('Action Support IA:', action)
              }
            }}
            className="h-96"
          />
        </div>

        {/* Tickets List */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                Tickets Support ({filteredTickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 truncate flex-1 min-w-0">{ticket.title}</h3>
                              <div className="flex gap-2 flex-shrink-0">
                                <Badge className={`${getStatusColor(ticket.status)} border-0 text-xs`}>
                                  {ticket.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={`${getPriorityColor(ticket.priority)} border-0 text-xs`}>
                                  {ticket.priority}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1 truncate">
                                <Users className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{ticket.clientName} ({ticket.clientType})</span>
                              </span>
                              <span className="flex-shrink-0">#{ticket.id}</span>
                              <span className="flex-shrink-0">{ticket.category}</span>
                              <span className="flex-shrink-0 hidden sm:inline">{formatDate(ticket.createdAt)}</span>
                              {ticket.assignedTo && (
                                <span className="text-purple-600 font-medium truncate">
                                  Assigné à: {ticket.assignedTo}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MessageCircle className="h-4 w-4" />
                          {ticket.messages}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/dashboard/support/tickets/${ticket.id}`)}
                          className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-300 hover:scale-105 flex-shrink-0"
                        >
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
