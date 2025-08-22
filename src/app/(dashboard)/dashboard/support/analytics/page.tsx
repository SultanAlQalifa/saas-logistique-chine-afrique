'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Target, 
  Activity, 
  Calendar, 
  Download,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Star,
  Zap,
  Brain,
  Award,
  Timer,
  UserCheck,
  MessageSquare
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalTickets: number;
    autoAssigned: number;
    manualAssigned: number;
    avgResponseTime: string;
    satisfactionScore: number;
    resolutionRate: number;
  };
  agentPerformance: {
    id: string;
    name: string;
    department: string;
    ticketsHandled: number;
    avgResponseTime: string;
    satisfactionScore: number;
    resolutionRate: number;
    efficiency: number;
  }[];
  departmentStats: {
    name: string;
    color: string;
    ticketsReceived: number;
    avgResponseTime: string;
    satisfactionScore: number;
    workload: number;
    efficiency: number;
  }[];
  allocationEfficiency: {
    ruleId: string;
    ruleName: string;
    totalAssignments: number;
    successRate: number;
    avgResponseTime: string;
    clientSatisfaction: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  timeBasedStats: {
    hour: number;
    ticketsCreated: number;
    avgResponseTime: number;
    satisfactionScore: number;
  }[];
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Function to generate mock data based on filters
  const generateMockData = (period: string, department: string): AnalyticsData => {
    // Adjust data based on period
    const periodMultiplier = {
      '24h': 0.1,
      '7d': 0.5,
      '30d': 1,
      '90d': 2.5
    }[period] || 1;

    const baseData: AnalyticsData = {
      overview: {
        totalTickets: 1247,
        autoAssigned: 1089,
        manualAssigned: 158,
        avgResponseTime: '1h 23min',
        satisfactionScore: 4.6,
        resolutionRate: 94.2
      },
      agentPerformance: [
        {
          id: 'agent1',
          name: 'Sophie Martin',
          department: 'Support Technique',
          ticketsHandled: 89,
          avgResponseTime: '1h 15min',
          satisfactionScore: 4.8,
          resolutionRate: 96.6,
          efficiency: 92
        },
        {
          id: 'agent2',
          name: 'David Chen',
          department: 'Support Premium',
          ticketsHandled: 34,
          avgResponseTime: '25min',
          satisfactionScore: 4.95,
          resolutionRate: 100,
          efficiency: 98
        },
        {
          id: 'agent3',
          name: 'Marie Dubois',
          department: 'Support Commercial',
          ticketsHandled: 67,
          avgResponseTime: '45min',
          satisfactionScore: 4.7,
          resolutionRate: 94.0,
          efficiency: 89
        },
        {
          id: 'agent4',
          name: 'Ahmed Benali',
          department: 'Support Technique',
          ticketsHandled: 78,
          avgResponseTime: '1h 35min',
          satisfactionScore: 4.5,
          resolutionRate: 91.8,
          efficiency: 85
        }
      ],
      departmentStats: [
        {
          name: 'Support Premium',
          color: 'from-purple-500 to-pink-500',
          ticketsReceived: 156,
          avgResponseTime: '28min',
          satisfactionScore: 4.9,
          workload: 65,
          efficiency: 97
        },
        {
          name: 'Support Technique',
          color: 'from-blue-500 to-cyan-500',
          ticketsReceived: 543,
          avgResponseTime: '1h 25min',
          satisfactionScore: 4.6,
          workload: 82,
          efficiency: 88
        },
        {
          name: 'Support Commercial',
          color: 'from-green-500 to-emerald-500',
          ticketsReceived: 298,
          avgResponseTime: '52min',
          satisfactionScore: 4.7,
          workload: 71,
          efficiency: 91
        },
        {
          name: 'Support Urgence',
          color: 'from-red-500 to-orange-500',
          ticketsReceived: 89,
          avgResponseTime: '18min',
          satisfactionScore: 4.8,
          workload: 45,
          efficiency: 95
        }
      ],
      allocationEfficiency: [
        {
          ruleId: 'rule1',
          ruleName: 'VIP Premium - Urgence Maximale',
          totalAssignments: 45,
          successRate: 98.5,
          avgResponseTime: '12min',
          clientSatisfaction: 4.95,
          trend: 'up'
        },
        {
          ruleId: 'rule2',
          ruleName: 'Support Technique Standard',
          totalAssignments: 234,
          successRate: 87.2,
          avgResponseTime: '1h 45min',
          clientSatisfaction: 4.4,
          trend: 'stable'
        },
        {
          ruleId: 'rule3',
          ruleName: 'Questions Commerciales',
          totalAssignments: 156,
          successRate: 92.1,
          avgResponseTime: '45min',
          clientSatisfaction: 4.7,
          trend: 'up'
        }
      ],
      timeBasedStats: [
        { hour: 8, ticketsCreated: 23, avgResponseTime: 45, satisfactionScore: 4.6 },
        { hour: 9, ticketsCreated: 67, avgResponseTime: 52, satisfactionScore: 4.5 },
        { hour: 10, ticketsCreated: 89, avgResponseTime: 48, satisfactionScore: 4.7 },
        { hour: 11, ticketsCreated: 76, avgResponseTime: 41, satisfactionScore: 4.8 },
        { hour: 12, ticketsCreated: 45, avgResponseTime: 65, satisfactionScore: 4.3 },
        { hour: 13, ticketsCreated: 34, avgResponseTime: 78, satisfactionScore: 4.2 },
        { hour: 14, ticketsCreated: 98, avgResponseTime: 55, satisfactionScore: 4.6 },
        { hour: 15, ticketsCreated: 87, avgResponseTime: 49, satisfactionScore: 4.7 },
        { hour: 16, ticketsCreated: 76, avgResponseTime: 43, satisfactionScore: 4.8 },
        { hour: 17, ticketsCreated: 65, avgResponseTime: 38, satisfactionScore: 4.9 },
        { hour: 18, ticketsCreated: 32, avgResponseTime: 72, satisfactionScore: 4.4 }
      ]
    };

    // Apply period multiplier to numeric values
    baseData.overview.totalTickets = Math.round(baseData.overview.totalTickets * periodMultiplier);
    baseData.overview.autoAssigned = Math.round(baseData.overview.autoAssigned * periodMultiplier);
    baseData.overview.manualAssigned = Math.round(baseData.overview.manualAssigned * periodMultiplier);
    
    // Adjust agent performance based on period
    baseData.agentPerformance = baseData.agentPerformance.map(agent => ({
      ...agent,
      ticketsHandled: Math.round(agent.ticketsHandled * periodMultiplier)
    }));
    
    // Adjust department stats based on period
    baseData.departmentStats = baseData.departmentStats.map(dept => ({
      ...dept,
      ticketsReceived: Math.round(dept.ticketsReceived * periodMultiplier)
    }));
    
    // Filter by department if not 'all'
    if (department !== 'all') {
      baseData.agentPerformance = baseData.agentPerformance.filter(agent => 
        agent.department.toLowerCase().includes(department.toLowerCase())
      );
    }
    
    return baseData;
  };

  // Load data when filters change
  useEffect(() => {
    const mockData = generateMockData(selectedPeriod, selectedDepartment);
    setAnalyticsData(mockData);
    console.log(`Données filtrées: période=${selectedPeriod}, département=${selectedDepartment}`);
  }, [selectedPeriod, selectedDepartment]);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-600 bg-green-100';
    if (efficiency >= 85) return 'text-blue-600 bg-blue-100';
    if (efficiency >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Analytics & Métriques 📊</h1>
              <p className="text-emerald-100 mt-2">
                Analyse approfondie des performances d'allocation et support
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70"
            >
              <option value="24h">Dernières 24h</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70"
            >
              <option value="all">Tous les départements</option>
              <option value="premium">Support Premium</option>
              <option value="technique">Support Technique</option>
              <option value="commercial">Support Commercial</option>
              <option value="urgence">Support Urgence</option>
            </select>
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-blue-600 font-medium text-sm">Total Tickets</p>
                <p className="text-2xl font-bold text-blue-800">{analyticsData.overview.totalTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-green-600 font-medium text-sm">Auto-assignés</p>
                <p className="text-2xl font-bold text-green-800">{analyticsData.overview.autoAssigned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-2 rounded-lg">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-purple-600 font-medium text-sm">Manuels</p>
                <p className="text-2xl font-bold text-purple-800">{analyticsData.overview.manualAssigned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-orange-600 font-medium text-sm">Temps Moyen</p>
                <p className="text-xl font-bold text-orange-800">{analyticsData.overview.avgResponseTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-yellow-600 font-medium text-sm">Satisfaction</p>
                <p className="text-2xl font-bold text-yellow-800">{analyticsData.overview.satisfactionScore}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-teal-500 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-teal-600 font-medium text-sm">Résolution</p>
                <p className="text-2xl font-bold text-teal-800">{analyticsData.overview.resolutionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Performance */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Performance des Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.agentPerformance.map((agent, index) => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-sm text-gray-600">{agent.department}</p>
                    </div>
                    <Badge className={`${getEfficiencyColor(agent.efficiency)} border-0`}>
                      {agent.efficiency}% efficacité
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Tickets traités:</p>
                      <p className="font-medium">{agent.ticketsHandled}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Temps moyen:</p>
                      <p className="font-medium">{agent.avgResponseTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Satisfaction:</p>
                      <p className="font-medium text-yellow-600">{agent.satisfactionScore}/5</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Résolution:</p>
                      <p className="font-medium text-green-600">{agent.resolutionRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Stats */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Performance par Département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.departmentStats.map((dept, index) => (
                <div key={dept.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${dept.color}`}></div>
                      <h4 className="font-medium">{dept.name}</h4>
                    </div>
                    <Badge className={`${getEfficiencyColor(dept.efficiency)} border-0`}>
                      {dept.efficiency}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tickets reçus:</span>
                      <span className="font-medium">{dept.ticketsReceived}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Temps moyen:</span>
                      <span className="font-medium">{dept.avgResponseTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Satisfaction:</span>
                      <span className="font-medium text-yellow-600">{dept.satisfactionScore}/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Charge de travail:</span>
                      <span className="font-medium">{dept.workload}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`bg-gradient-to-r ${dept.color} h-2 rounded-full`}
                        style={{ width: `${dept.workload}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Rules Efficiency */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Efficacité des Règles d'Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsData.allocationEfficiency.map((rule, index) => (
              <div key={rule.ruleId} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{rule.ruleName}</h4>
                  {getTrendIcon(rule.trend)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Assignations:</span>
                    <span className="font-medium">{rule.totalAssignments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taux de succès:</span>
                    <span className="font-medium text-green-600">{rule.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Temps moyen:</span>
                    <span className="font-medium">{rule.avgResponseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Satisfaction:</span>
                    <span className="font-medium text-yellow-600">{rule.clientSatisfaction}/5</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${rule.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time-based Analysis */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-indigo-600" />
            Analyse Temporelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.timeBasedStats.filter((_, i) => i % 3 === 0).map((stat, index) => (
                <div key={stat.hour} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
                  <div className="text-center">
                    <h4 className="font-bold text-lg text-indigo-800">{stat.hour}h00</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{stat.ticketsCreated}</span> tickets
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{stat.avgResponseTime}min</span> réponse
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-yellow-600">{stat.satisfactionScore}/5</span> satisfaction
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📈 Insights Clés</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Pic d'activité entre 14h et 16h avec 98 tickets créés</li>
                <li>• Meilleur temps de réponse à 17h (38min) grâce à la disponibilité des agents</li>
                <li>• Satisfaction la plus élevée en fin de journée (4.9/5)</li>
                <li>• Période creuse à 13h avec une baisse de performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
