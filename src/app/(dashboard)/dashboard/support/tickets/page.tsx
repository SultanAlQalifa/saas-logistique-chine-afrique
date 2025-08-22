'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Plus,
  Eye,
  Building,
  Calendar,
  Star
} from 'lucide-react';

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
  rating?: number;
}

export default function TicketsManagementPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');

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
        messages: 6,
        rating: 5
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
      }
    ];

    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
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

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <MessageCircle className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestion des Tickets 🎫</h1>
            <p className="text-purple-100 mt-2">
              Interface complète pour gérer tous les tickets clients
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un ticket..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
        </div>

        <Button 
          onClick={() => router.push('/dashboard/support/tickets/create')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Ticket
        </Button>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <Card 
            key={ticket.id} 
            className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getStatusColor(ticket.status)} border-0 text-xs`}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={`${getPriorityColor(ticket.priority)} border-0 text-xs`}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{ticket.title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ticket.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  {ticket.clientType === 'entreprise' ? (
                    <Building className="h-4 w-4 text-gray-500" />
                  ) : (
                    <User className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="font-medium">{ticket.clientName}</span>
                  <Badge className={ticket.clientType === 'entreprise' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} variant="secondary">
                    {ticket.clientType}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>#{ticket.id}</span>
                  <span>{ticket.category}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{ticket.messages}</span>
                  </div>
                </div>

                {ticket.assignedTo && (
                  <div className="text-sm text-purple-600 font-medium">
                    Assigné à: {ticket.assignedTo}
                  </div>
                )}

                {ticket.rating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= ticket.rating! 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({ticket.rating}/5)
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
