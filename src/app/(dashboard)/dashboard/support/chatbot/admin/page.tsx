'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  Bot, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  MessageSquare,
  GitBranch,
  Zap,
  Target,
  Users,
  BarChart3,
  Sparkles
} from 'lucide-react';

interface ChatbotFlow {
  id: string;
  name: string;
  trigger: string;
  description: string;
  isActive: boolean;
  steps: ChatbotStep[];
  usage: number;
  successRate: number;
}

interface ChatbotStep {
  id: string;
  type: 'message' | 'action' | 'condition' | 'input';
  content: string;
  actions?: ChatbotAction[];
  nextStep?: string;
  conditions?: ChatbotCondition[];
}

interface ChatbotAction {
  id: string;
  label: string;
  action: string;
  variant: 'primary' | 'secondary';
  nextStep?: string;
}

interface ChatbotCondition {
  id: string;
  condition: string;
  nextStep: string;
}

export default function ChatbotAdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'flows' | 'responses' | 'analytics'>('flows');
  const [selectedFlow, setSelectedFlow] = useState<ChatbotFlow | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data pour les flux du chatbot
  const [chatbotFlows, setChatbotFlows] = useState<ChatbotFlow[]>([
    {
      id: '1',
      name: 'Création de Ticket',
      trigger: 'create_ticket',
      description: 'Flux pour guider l\'utilisateur dans la création d\'un ticket support',
      isActive: true,
      usage: 156,
      successRate: 89,
      steps: [
        {
          id: '1',
          type: 'message',
          content: '🎫 Parfait ! Je vais vous aider à créer un ticket. Pour commencer, de quel type de problème s\'agit-il ?',
          actions: [
            { id: '1', label: '🚚 Problème de livraison', action: 'delivery_issue', variant: 'primary', nextStep: '2' },
            { id: '2', label: '💳 Question de facturation', action: 'billing_issue', variant: 'primary', nextStep: '3' },
            { id: '3', label: '📦 Colis endommagé', action: 'damage_claim', variant: 'primary', nextStep: '4' },
            { id: '4', label: '💬 Autre demande', action: 'other_issue', variant: 'secondary', nextStep: '5' }
          ]
        },
        {
          id: '2',
          type: 'message',
          content: '🚚 Je comprends que vous avez un problème de livraison. Pouvez-vous me décrire le problème en quelques mots ?',
          nextStep: '6'
        }
      ]
    },
    {
      id: '2',
      name: 'Suivi de Colis',
      trigger: 'track_package',
      description: 'Flux pour le suivi des colis avec numéro de tracking',
      isActive: true,
      usage: 234,
      successRate: 95,
      steps: [
        {
          id: '1',
          type: 'message',
          content: '📦 Pour suivre votre colis, j\'ai besoin de votre numéro de suivi. Pouvez-vous me le fournir ?',
          nextStep: '2'
        },
        {
          id: '2',
          type: 'input',
          content: 'Attente du numéro de suivi',
          nextStep: '3'
        }
      ]
    },
    {
      id: '3',
      name: 'Informations Tarifaires',
      trigger: 'pricing_info',
      description: 'Flux pour fournir des informations sur les tarifs de transport',
      isActive: true,
      usage: 89,
      successRate: 76,
      steps: [
        {
          id: '1',
          type: 'message',
          content: '💰 Je peux vous aider avec les informations tarifaires ! Que souhaitez-vous savoir ?',
          actions: [
            { id: '1', label: '✈️ Tarifs aériens', action: 'air_pricing', variant: 'primary' },
            { id: '2', label: '🚢 Tarifs maritimes', action: 'sea_pricing', variant: 'primary' },
            { id: '3', label: '🧮 Calculateur de prix', action: 'price_calculator', variant: 'secondary' }
          ]
        }
      ]
    },
    {
      id: '4',
      name: 'Réclamation/Plainte Client',
      trigger: 'complaint',
      description: 'Flux pour traiter les réclamations et plaintes des clients',
      isActive: true,
      usage: 67,
      successRate: 82,
      steps: [
        {
          id: '1',
          type: 'message',
          content: '😔 Je comprends votre mécontentement. Je vais vous aider à déposer une réclamation. De quel type de problème s\'agit-il ?',
          actions: [
            { id: '1', label: '📦 Colis perdu/endommagé', action: 'damaged_package', variant: 'primary', nextStep: '2' },
            { id: '2', label: '⏰ Retard de livraison', action: 'delivery_delay', variant: 'primary', nextStep: '3' },
            { id: '3', label: '💰 Problème de facturation', action: 'billing_complaint', variant: 'primary', nextStep: '4' },
            { id: '4', label: '👥 Service client insatisfaisant', action: 'service_complaint', variant: 'primary', nextStep: '5' },
            { id: '5', label: '🔧 Autre réclamation', action: 'other_complaint', variant: 'secondary', nextStep: '6' }
          ]
        },
        {
          id: '2',
          type: 'message',
          content: '📦 Je vais créer une réclamation pour colis perdu/endommagé. Pouvez-vous me fournir votre numéro de suivi ?',
          nextStep: '7'
        },
        {
          id: '3',
          type: 'message',
          content: '⏰ Pour traiter votre réclamation de retard, j\'ai besoin de votre numéro de commande et de la date de livraison prévue.',
          nextStep: '7'
        },
        {
          id: '4',
          type: 'message',
          content: '💰 Concernant votre problème de facturation, pouvez-vous me préciser le montant contesté et la référence de facture ?',
          nextStep: '7'
        },
        {
          id: '5',
          type: 'message',
          content: '👥 Je prends note de votre insatisfaction concernant notre service. Pouvez-vous me décrire précisément ce qui s\'est passé ?',
          nextStep: '7'
        },
        {
          id: '6',
          type: 'message',
          content: '🔧 Merci de me décrire votre réclamation en détail pour que je puisse vous aider au mieux.',
          nextStep: '7'
        },
        {
          id: '7',
          type: 'input',
          content: 'Attente des détails de la réclamation',
          nextStep: '8'
        },
        {
          id: '8',
          type: 'message',
          content: '✅ Votre réclamation a été enregistrée avec le numéro REC-{timestamp}. Un responsable vous contactera sous 24h. Souhaitez-vous ajouter des pièces justificatives ?',
          actions: [
            { id: '1', label: '📎 Ajouter des fichiers', action: 'add_attachments', variant: 'primary' },
            { id: '2', label: '✅ Terminer', action: 'finish_complaint', variant: 'secondary' }
          ]
        }
      ]
    }
  ]);

  const getFlowStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleFlowToggle = (flowId: string) => {
    setChatbotFlows(flows => 
      flows.map(flow => 
        flow.id === flowId ? { ...flow, isActive: !flow.isActive } : flow
      )
    );
  };

  const handleViewFlow = (flow: ChatbotFlow) => {
    setSelectedFlow(flow);
    setIsEditing(false);
  };

  const handleEditFlow = (flow: ChatbotFlow) => {
    setSelectedFlow(flow);
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setSelectedFlow(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Settings className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  🤖 Administration Chatbot IA <Sparkles className="h-6 w-6" />
                </h1>
                <p className="text-purple-100">
                  Gérez les flux conversationnels et les réponses automatiques
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold py-2 px-4 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Flux
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-lg mb-8">
          <button
            onClick={() => setActiveTab('flows')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'flows' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <GitBranch className="h-4 w-4 inline mr-2" />
            Flux Conversationnels
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'responses' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Réponses Automatiques
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Analytics & Performance
          </button>
        </div>

        {/* Flux Conversationnels */}
        {activeTab === 'flows' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">🤖 Flux Actifs</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {chatbotFlows.filter(f => f.isActive).length}
                      </p>
                    </div>
                    <div className="bg-blue-500 p-3 rounded-xl">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">📊 Utilisation Totale</p>
                      <p className="text-2xl font-bold text-green-900">
                        {chatbotFlows.reduce((sum, f) => sum + f.usage, 0)}
                      </p>
                    </div>
                    <div className="bg-green-500 p-3 rounded-xl">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">🎯 Taux Moyen</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {Math.round(chatbotFlows.reduce((sum, f) => sum + f.successRate, 0) / chatbotFlows.length)}%
                      </p>
                    </div>
                    <div className="bg-purple-500 p-3 rounded-xl">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">⚡ Performance</p>
                      <p className="text-2xl font-bold text-orange-900">Excellente</p>
                    </div>
                    <div className="bg-orange-500 p-3 rounded-xl">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des flux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chatbotFlows.map((flow) => (
                <Card key={flow.id} className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                          {flow.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-3">{flow.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getFlowStatusColor(flow.isActive)} border-0 text-xs`}>
                            {flow.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Trigger: <code className="bg-gray-100 px-1 rounded">{flow.trigger}</code>
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewFlow(flow)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditFlow(flow)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{flow.usage}</div>
                        <div className="text-xs text-gray-500">Utilisations</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getSuccessRateColor(flow.successRate)}`}>
                          {flow.successRate}%
                        </div>
                        <div className="text-xs text-gray-500">Succès</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{flow.steps.length}</div>
                        <div className="text-xs text-gray-500">Étapes</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button
                        variant={flow.isActive ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleFlowToggle(flow.id)}
                        className="text-xs"
                      >
                        {flow.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      <div className="text-xs text-gray-500">
                        Dernière modification: Aujourd'hui
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Réponses Automatiques */}
        {activeTab === 'responses' && (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-purple-600" />
                Configuration des Réponses Automatiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message de Bienvenue
                    </label>
                    <Textarea
                      defaultValue="👋 Bonjour ! Je suis votre assistant virtuel pour le support client. Je suis là pour vous aider à créer un ticket ou répondre à vos questions concernant vos expéditions."
                      rows={4}
                      className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message d'Erreur
                    </label>
                    <Textarea
                      defaultValue="🤔 Je comprends votre demande. Pour mieux vous aider, pourriez-vous me donner plus de détails ou choisir une des options proposées ?"
                      rows={4}
                      className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les Modifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>📊 Utilisation par Flux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chatbotFlows.map((flow) => (
                    <div key={flow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{flow.name}</div>
                        <div className="text-sm text-gray-500">{flow.usage} utilisations</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getSuccessRateColor(flow.successRate)}`}>
                          {flow.successRate}%
                        </div>
                        <div className="text-xs text-gray-500">succès</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>🎯 Métriques de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                    <div className="text-sm text-green-700">Taux de Résolution Automatique</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">2.3s</div>
                      <div className="text-xs text-blue-700">Temps de Réponse Moyen</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">94%</div>
                      <div className="text-xs text-purple-700">Satisfaction Client</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modal pour visualiser/éditer un flux */}
      {selectedFlow && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {isEditing ? '✏️ Éditer le Flux' : '👁️ Visualiser le Flux'}
            </h2>
            <p className="text-purple-100 mt-1">{selectedFlow.name}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseModal}
            className="text-white hover:bg-white/20"
          >
            ✕
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Informations générales */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg">📋 Informations Générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Flux
                </label>
                <Input
                  value={selectedFlow.name}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger
                </label>
                <Input
                  value={selectedFlow.trigger}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={selectedFlow.description}
                disabled={!isEditing}
                rows={3}
                className="border-gray-300"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFlow.isActive}
                  disabled={!isEditing}
                  className="rounded"
                />
                <span className="text-sm">Flux actif</span>
              </div>
              <Badge className={`${getFlowStatusColor(selectedFlow.isActive)} border-0`}>
                {selectedFlow.isActive ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">📊 Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedFlow.usage}</div>
                <div className="text-sm text-blue-700">Utilisations</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className={`text-2xl font-bold ${getSuccessRateColor(selectedFlow.successRate)}`}>
                  {selectedFlow.successRate}%
                </div>
                <div className="text-sm text-green-700">Taux de Succès</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{selectedFlow.steps.length}</div>
                <div className="text-sm text-purple-700">Étapes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Étapes du flux */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg">🔄 Étapes du Flux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedFlow.steps.map((step, index) => (
                <div key={step.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {step.type}
                        </Badge>
                        {step.nextStep && (
                          <span className="text-xs text-gray-500">
                            → Étape {step.nextStep}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        {step.content}
                      </div>
                      {step.actions && step.actions.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-600">Actions disponibles:</div>
                          <div className="flex flex-wrap gap-2">
                            {step.actions.map((action) => (
                              <Badge
                                key={action.id}
                                variant={action.variant === 'primary' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {action.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCloseModal}
          >
            Fermer
          </Button>
          {isEditing ? (
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
      )}
    </div>
  );
}
