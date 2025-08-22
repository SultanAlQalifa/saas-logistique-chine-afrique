'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Brain, Bot, MessageSquare, Settings, Zap, Target, TrendingUp, Users, BarChart3, Plus, Edit, Play, Pause, Eye, Trash2 } from 'lucide-react'

interface AIAssistantConfig {
  id: string
  name: string
  description: string
  type: 'chatbot' | 'email' | 'social' | 'content'
  status: 'active' | 'inactive' | 'training'
  model: string
  language: string
  tone: string
  objectives: string[]
  metrics: {
    interactions: number
    conversions: number
    satisfaction: number
  }
  created_at: string
  updated_at: string
}

const mockAssistants: AIAssistantConfig[] = [
  {
    id: 'ai-1',
    name: 'Assistant Commercial',
    description: 'IA spécialisée dans la génération de leads et la conversion client',
    type: 'chatbot',
    status: 'active',
    model: 'GPT-4',
    language: 'fr',
    tone: 'professionnel',
    objectives: ['Génération de leads', 'Support client', 'Qualification prospects'],
    metrics: {
      interactions: 1247,
      conversions: 89,
      satisfaction: 4.6
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 'ai-2',
    name: 'Content Creator IA',
    description: 'Génération automatique de contenu marketing et posts sociaux',
    type: 'content',
    status: 'active',
    model: 'Claude-3',
    language: 'fr',
    tone: 'engageant',
    objectives: ['Création contenu', 'Posts sociaux', 'Newsletters'],
    metrics: {
      interactions: 856,
      conversions: 124,
      satisfaction: 4.8
    },
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-19T16:45:00Z'
  },
  {
    id: 'ai-3',
    name: 'Email Marketing IA',
    description: 'Optimisation des campagnes email et personnalisation',
    type: 'email',
    status: 'training',
    model: 'GPT-4',
    language: 'fr',
    tone: 'persuasif',
    objectives: ['Campagnes email', 'Personnalisation', 'A/B Testing'],
    metrics: {
      interactions: 432,
      conversions: 67,
      satisfaction: 4.3
    },
    created_at: '2024-01-12T11:30:00Z',
    updated_at: '2024-01-18T13:20:00Z'
  }
]

function AIAssistantPageContent() {
  const { data: session } = useSession()
  const [assistants, setAssistants] = useState<AIAssistantConfig[]>(mockAssistants)
  const [loading, setLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingAssistant, setEditingAssistant] = useState<AIAssistantConfig | null>(null)
  const [newAssistant, setNewAssistant] = useState({
    name: '',
    description: '',
    type: 'chatbot' as const,
    model: 'GPT-4',
    language: 'fr',
    tone: 'professionnel',
    objectives: [] as string[]
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chatbot': return Bot
      case 'email': return MessageSquare
      case 'social': return Users
      case 'content': return Edit
      default: return Brain
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'chatbot': return 'Chatbot'
      case 'email': return 'Email Marketing'
      case 'social': return 'Réseaux Sociaux'
      case 'content': return 'Création Contenu'
      default: return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>
      case 'training':
        return <Badge className="bg-orange-100 text-orange-800">Formation</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleCreateAssistant = () => {
    const assistant: AIAssistantConfig = {
      id: `ai-${Date.now()}`,
      ...newAssistant,
      status: 'training',
      objectives: newAssistant.objectives.filter(obj => obj.trim() !== ''),
      metrics: {
        interactions: 0,
        conversions: 0,
        satisfaction: 0
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setAssistants([...assistants, assistant])
    setShowCreateDialog(false)
    setNewAssistant({
      name: '',
      description: '',
      type: 'chatbot',
      model: 'GPT-4',
      language: 'fr',
      tone: 'professionnel',
      objectives: []
    })
  }

  const toggleAssistantStatus = (id: string) => {
    setAssistants(assistants.map(assistant => 
      assistant.id === id 
        ? { 
            ...assistant, 
            status: assistant.status === 'active' ? 'inactive' : 'active',
            updated_at: new Date().toISOString()
          }
        : assistant
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">🤖 Assistant IA Marketing</h1>
            <p className="text-purple-100 text-lg">Intelligence artificielle pour optimiser vos campagnes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">Assistants Actifs</span>
            </div>
            <p className="text-2xl font-bold mt-1">{assistants.filter(a => a.status === 'active').length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Interactions Total</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {assistants.reduce((sum, a) => sum + a.metrics.interactions, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span className="font-medium">Conversions</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {assistants.reduce((sum, a) => sum + a.metrics.conversions, 0)}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Satisfaction Moy.</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {assistants.length > 0 
                ? (assistants.reduce((sum, a) => sum + a.metrics.satisfaction, 0) / assistants.length).toFixed(1)
                : '0.0'
              }/5
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Assistants IA Configurés</h2>
          <p className="text-gray-600">Gérez vos assistants intelligents pour le marketing</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Assistant IA
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un Assistant IA</DialogTitle>
              <DialogDescription>
                Configurez un nouvel assistant intelligent pour vos campagnes marketing
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de l'Assistant</Label>
                <Input
                  id="name"
                  value={newAssistant.name}
                  onChange={(e) => setNewAssistant({...newAssistant, name: e.target.value})}
                  placeholder="Ex: Assistant Commercial, Content Creator..."
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAssistant.description}
                  onChange={(e) => setNewAssistant({...newAssistant, description: e.target.value})}
                  placeholder="Décrivez les fonctionnalités de cet assistant"
                  rows={3}
                />
              </div>

              <div>
                <Label>Type d'Assistant</Label>
                <Select value={newAssistant.type} onValueChange={(value: any) => setNewAssistant({...newAssistant, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chatbot">🤖 Chatbot</SelectItem>
                    <SelectItem value="email">📧 Email Marketing</SelectItem>
                    <SelectItem value="social">📱 Réseaux Sociaux</SelectItem>
                    <SelectItem value="content">✍️ Création Contenu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Modèle IA</Label>
                  <Select value={newAssistant.model} onValueChange={(value) => setNewAssistant({...newAssistant, model: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GPT-4">GPT-4</SelectItem>
                      <SelectItem value="Claude-3">Claude-3</SelectItem>
                      <SelectItem value="Gemini">Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Langue</Label>
                  <Select value={newAssistant.language} onValueChange={(value) => setNewAssistant({...newAssistant, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Ton de Communication</Label>
                <Select value={newAssistant.tone} onValueChange={(value) => setNewAssistant({...newAssistant, tone: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="amical">Amical</SelectItem>
                    <SelectItem value="persuasif">Persuasif</SelectItem>
                    <SelectItem value="engageant">Engageant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateAssistant} disabled={!newAssistant.name || !newAssistant.description}>
                Créer l'Assistant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assistants List */}
      <div className="grid gap-6">
        {assistants.map((assistant) => {
          const TypeIcon = getTypeIcon(assistant.type)

          return (
            <Card key={assistant.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <TypeIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      {assistant.name}
                      <div className="flex gap-2">
                        {getStatusBadge(assistant.status)}
                        <Badge variant="outline" className="border-purple-200 text-purple-800">
                          {getTypeLabel(assistant.type)}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {assistant.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAssistantStatus(assistant.id)}
                    >
                      {assistant.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAssistant(assistant)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Interactions</Label>
                    <p className="text-xl font-bold text-purple-600">
                      {assistant.metrics.interactions.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Total depuis création</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Conversions</Label>
                    <p className="text-xl font-bold text-green-600">
                      {assistant.metrics.conversions}
                    </p>
                    <p className="text-sm text-gray-500">
                      {assistant.metrics.interactions > 0 
                        ? `${((assistant.metrics.conversions / assistant.metrics.interactions) * 100).toFixed(1)}% taux`
                        : '0% taux'
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Satisfaction</Label>
                    <p className="text-xl font-bold text-orange-600">
                      {assistant.metrics.satisfaction}/5
                    </p>
                    <p className="text-sm text-gray-500">Note moyenne utilisateurs</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Configuration</Label>
                    <p className="text-lg font-semibold">
                      {assistant.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {assistant.language.toUpperCase()} • {assistant.tone}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-500">Objectifs</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {assistant.objectives.map((objective, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                        {objective}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {assistants.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun assistant IA configuré</h3>
            <p className="text-gray-600 mb-4">
              Créez votre premier assistant intelligent pour automatiser vos campagnes marketing.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer mon premier assistant
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AIAssistantPage() {
  return (
    <PermissionGuard 
      permission="marketing:manage"
      tenantRequired={false}
    >
      <AIAssistantPageContent />
    </PermissionGuard>
  )
}
