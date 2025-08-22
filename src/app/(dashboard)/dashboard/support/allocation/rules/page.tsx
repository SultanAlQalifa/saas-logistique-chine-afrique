'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Target, 
  Brain, 
  Shuffle, 
  Users, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Copy,
  Play,
  Pause
} from 'lucide-react';

interface AllocationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: {
    categories: string[];
    priorities: string[];
    clientTypes: string[];
    languages: string[];
    complexity: string[];
    businessHours?: boolean;
    urgentOnly?: boolean;
  };
  assignment: {
    department?: string;
    specificAgent?: string;
    strategy: 'round_robin' | 'least_loaded' | 'expertise' | 'availability' | 'random' | 'priority_based';
    fallbackStrategy?: string;
  };
  limits: {
    maxTicketsPerAgent?: number;
    workingHours?: {
      start: string;
      end: string;
      timezone: string;
    };
    excludeWeekends?: boolean;
  };
  stats: {
    totalAssigned: number;
    successRate: number;
    avgResponseTime: string;
    lastUsed: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AllocationRulesPage() {
  const [rules, setRules] = useState<AllocationRule[]>([]);
  const [editingRule, setEditingRule] = useState<AllocationRule | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    const mockRules: AllocationRule[] = [
      {
        id: 'rule1',
        name: 'VIP Premium - Urgence Maximale',
        description: 'Assignation prioritaire pour les clients VIP avec tickets urgents',
        enabled: true,
        priority: 1,
        conditions: {
          categories: ['VIP', 'Réclamation', 'Problème critique'],
          priorities: ['urgente'],
          clientTypes: ['entreprise'],
          languages: ['Français', 'Anglais'],
          complexity: ['complex'],
          urgentOnly: true,
          businessHours: false
        },
        assignment: {
          department: 'support-premium',
          strategy: 'expertise',
          fallbackStrategy: 'least_loaded'
        },
        limits: {
          maxTicketsPerAgent: 3,
          workingHours: {
            start: '08:00',
            end: '20:00',
            timezone: 'Europe/Paris'
          },
          excludeWeekends: false
        },
        stats: {
          totalAssigned: 45,
          successRate: 98.5,
          avgResponseTime: '12min',
          lastUsed: '2024-01-15T14:30:00'
        },
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-15T09:00:00'
      },
      {
        id: 'rule2',
        name: 'Support Technique Standard',
        description: 'Répartition équilibrée pour les problèmes techniques courants',
        enabled: true,
        priority: 2,
        conditions: {
          categories: ['Livraison', 'Suivi colis', 'Problèmes techniques'],
          priorities: ['normale', 'basse'],
          clientTypes: ['particulier', 'entreprise'],
          languages: ['Français'],
          complexity: ['simple', 'medium'],
          businessHours: true
        },
        assignment: {
          strategy: 'least_loaded',
          fallbackStrategy: 'round_robin'
        },
        limits: {
          maxTicketsPerAgent: 8,
          workingHours: {
            start: '09:00',
            end: '18:00',
            timezone: 'Europe/Paris'
          },
          excludeWeekends: true
        },
        stats: {
          totalAssigned: 234,
          successRate: 87.2,
          avgResponseTime: '1h 45min',
          lastUsed: '2024-01-15T13:45:00'
        },
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-10T16:30:00'
      },
      {
        id: 'rule3',
        name: 'Questions Commerciales Multilingues',
        description: 'Assignation basée sur l\'expertise commerciale et linguistique',
        enabled: true,
        priority: 3,
        conditions: {
          categories: ['Devis', 'Tarification', 'Ventes', 'Partenariats'],
          priorities: ['normale', 'haute'],
          clientTypes: ['particulier', 'entreprise'],
          languages: ['Français', 'Anglais', 'Chinois', 'Espagnol'],
          complexity: ['simple', 'medium']
        },
        assignment: {
          department: 'support-commercial',
          strategy: 'expertise',
          fallbackStrategy: 'availability'
        },
        limits: {
          maxTicketsPerAgent: 6,
          workingHours: {
            start: '08:30',
            end: '19:00',
            timezone: 'Europe/Paris'
          },
          excludeWeekends: true
        },
        stats: {
          totalAssigned: 156,
          successRate: 92.1,
          avgResponseTime: '45min',
          lastUsed: '2024-01-15T11:20:00'
        },
        createdAt: '2024-01-01T10:00:00',
        updatedAt: '2024-01-12T14:15:00'
      },
      {
        id: 'rule4',
        name: 'Support Nocturne - Urgences',
        description: 'Gestion des urgences en dehors des heures ouvrables',
        enabled: false,
        priority: 4,
        conditions: {
          categories: ['Urgence', 'Panne système', 'Problème critique'],
          priorities: ['urgente', 'haute'],
          clientTypes: ['entreprise'],
          languages: ['Français', 'Anglais'],
          complexity: ['medium', 'complex'],
          businessHours: false
        },
        assignment: {
          department: 'support-urgence',
          strategy: 'availability',
          fallbackStrategy: 'random'
        },
        limits: {
          maxTicketsPerAgent: 2,
          excludeWeekends: false
        },
        stats: {
          totalAssigned: 23,
          successRate: 91.3,
          avgResponseTime: '35min',
          lastUsed: '2024-01-14T02:15:00'
        },
        createdAt: '2024-01-05T15:00:00',
        updatedAt: '2024-01-14T02:20:00'
      }
    ];

    setRules(mockRules);
  }, []);

  const getStrategyLabel = (strategy: string) => {
    const strategies = {
      'round_robin': 'Tour de rôle',
      'least_loaded': 'Moins chargé',
      'expertise': 'Expertise',
      'availability': 'Disponibilité',
      'random': 'Aléatoire',
      'priority_based': 'Basé priorité'
    };
    return strategies[strategy as keyof typeof strategies] || strategy;
  };

  const getStrategyIcon = (strategy: string) => {
    switch (strategy) {
      case 'round_robin': return <Shuffle className="h-4 w-4" />;
      case 'least_loaded': return <Target className="h-4 w-4" />;
      case 'expertise': return <Brain className="h-4 w-4" />;
      case 'availability': return <Clock className="h-4 w-4" />;
      case 'random': return <Shuffle className="h-4 w-4" />;
      case 'priority_based': return <TrendingUp className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const duplicateRule = (rule: AllocationRule) => {
    const newRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      name: `${rule.name} (Copie)`,
      enabled: false,
      stats: {
        totalAssigned: 0,
        successRate: 0,
        avgResponseTime: '0min',
        lastUsed: ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRules(prev => [...prev, newRule]);
  };

  const movePriority = (ruleId: string, direction: 'up' | 'down') => {
    setRules(prev => {
      const ruleIndex = prev.findIndex(r => r.id === ruleId);
      if (ruleIndex === -1) return prev;
      
      const newRules = [...prev];
      const rule = newRules[ruleIndex];
      
      if (direction === 'up' && rule.priority > 1) {
        const otherRule = newRules.find(r => r.priority === rule.priority - 1);
        if (otherRule) {
          otherRule.priority = rule.priority;
          rule.priority = rule.priority - 1;
        }
      } else if (direction === 'down') {
        const otherRule = newRules.find(r => r.priority === rule.priority + 1);
        if (otherRule) {
          otherRule.priority = rule.priority;
          rule.priority = rule.priority + 1;
        }
      }
      
      return newRules.sort((a, b) => a.priority - b.priority);
    });
  };

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Settings className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Règles d'Allocation ⚙️</h1>
              <p className="text-indigo-100 mt-2">
                Configuration avancée des règles d'assignation automatique
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle règle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-green-600 font-medium">Règles Actives</p>
                <p className="text-2xl font-bold text-green-800">{rules.filter(r => r.enabled).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-blue-600 font-medium">Tickets Assignés</p>
                <p className="text-2xl font-bold text-blue-800">{rules.reduce((sum, r) => sum + r.stats.totalAssigned, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-purple-600 font-medium">Taux de Succès</p>
                <p className="text-2xl font-bold text-purple-800">
                  {(rules.reduce((sum, r) => sum + r.stats.successRate, 0) / rules.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-orange-600 font-medium">Temps Moyen</p>
                <p className="text-2xl font-bold text-orange-800">1h 12min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une règle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Filtres avancés
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-6">
        {filteredRules.map((rule, index) => (
          <Card key={rule.id} className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-100 text-gray-800 font-bold">
                      #{rule.priority}
                    </Badge>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePriority(rule.id, 'up')}
                        disabled={rule.priority === 1}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePriority(rule.id, 'down')}
                        disabled={rule.priority === rules.length}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {rule.name}
                      <Badge className={rule.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {rule.enabled ? 'Activée' : 'Désactivée'}
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{rule.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRule(rule.id)}
                    className={rule.enabled ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {rule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateRule(rule)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingRule(rule)}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRule(rule.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conditions */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Conditions
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Catégories:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.conditions.categories.map((cat, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Priorités:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.conditions.priorities.map((priority, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {priority}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Types clients:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.conditions.clientTypes.map((type, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment Strategy */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Stratégie d'assignation
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStrategyIcon(rule.assignment.strategy)}
                      <span className="font-medium">{getStrategyLabel(rule.assignment.strategy)}</span>
                    </div>
                    {rule.assignment.department && (
                      <p className="text-sm text-gray-600">
                        Département: <span className="font-medium">{rule.assignment.department}</span>
                      </p>
                    )}
                    {rule.assignment.fallbackStrategy && (
                      <p className="text-sm text-gray-600">
                        Fallback: <span className="font-medium">{getStrategyLabel(rule.assignment.fallbackStrategy)}</span>
                      </p>
                    )}
                    {rule.limits.maxTicketsPerAgent && (
                      <p className="text-sm text-gray-600">
                        Max tickets/agent: <span className="font-medium">{rule.limits.maxTicketsPerAgent}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Statistiques
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tickets assignés:</span>
                      <span className="font-medium">{rule.stats.totalAssigned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Taux de succès:</span>
                      <span className="font-medium text-green-600">{rule.stats.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Temps moyen:</span>
                      <span className="font-medium">{rule.stats.avgResponseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dernière utilisation:</span>
                      <span className="text-xs text-gray-500">
                        {rule.stats.lastUsed ? new Date(rule.stats.lastUsed).toLocaleString('fr-FR') : 'Jamais'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune règle trouvée</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Aucune règle ne correspond à votre recherche.' : 'Commencez par créer votre première règle d\'allocation.'}
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une règle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
